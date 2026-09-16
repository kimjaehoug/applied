import { Router } from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { query } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'
import { sendContactMail } from '../mail.js'

const router = Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, '..', 'data')
const inboxFile = path.join(dataDir, 'contact-messages.json')

async function ensureContactTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(500) NOT NULL,
      message TEXT NOT NULL,
      mailed TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

async function readInboxFile() {
  try {
    const raw = await fs.readFile(inboxFile, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function saveInboxFile(entry) {
  await fs.mkdir(dataDir, { recursive: true })
  const list = await readInboxFile()
  const next = {
    id: Date.now(),
    ...entry,
    created_at: new Date().toISOString(),
  }
  list.unshift(next)
  await fs.writeFile(inboxFile, JSON.stringify(list.slice(0, 200), null, 2), 'utf8')
  return next
}

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body || {}
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ ok: false, message: 'Please fill in all required fields.' })
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())
  if (!emailOk) {
    return res.status(400).json({ ok: false, message: 'Please enter a valid email address.' })
  }

  const payload = {
    name: String(name).trim(),
    email: String(email).trim(),
    subject: String(subject).trim(),
    message: String(message).trim(),
  }

  let mailed = false
  let needsActivation = false
  let mailError = null

  try {
    const result = await sendContactMail(payload)
    mailed = true
    needsActivation = Boolean(result?.needsActivation)
  } catch (e) {
    mailError = e
    console.error('contact mail error:', e.message || e)
  }

  // Always persist locally so inquiries are not lost even if MySQL is down.
  try {
    await saveInboxFile({ ...payload, mailed, needsActivation })
  } catch (e) {
    console.error('contact file save error:', e)
  }

  try {
    await ensureContactTable()
    await query(
      'INSERT INTO contact_messages (name, email, subject, message, mailed) VALUES (?, ?, ?, ?, ?)',
      [payload.name, payload.email, payload.subject, payload.message, mailed ? 1 : 0]
    )
  } catch (e) {
    console.error('contact db save error:', e.message || e)
  }

  if (!mailed) {
    return res.status(502).json({
      ok: false,
      message: mailError?.message || 'Failed to send email. Please try again or email us directly.',
    })
  }

  if (needsActivation) {
    return res.json({
      ok: true,
      mailed: true,
      needsActivation: true,
      message: 'Activation email sent to the lab inbox. After one click to activate, future inquiries will be delivered automatically.',
    })
  }

  return res.json({ ok: true, mailed: true, message: 'Your inquiry has been sent.' })
})

router.get('/messages', requireAdmin, async (_req, res) => {
  try {
    const fileItems = await readInboxFile()
    let dbItems = []
    try {
      await ensureContactTable()
      dbItems = await query(
        'SELECT id, name, email, subject, message, mailed, created_at FROM contact_messages ORDER BY id DESC LIMIT 100'
      )
    } catch {
      dbItems = []
    }
    res.json({ ok: true, items: fileItems.length ? fileItems : dbItems })
  } catch (e) {
    console.error(e)
    res.status(500).json({ ok: false, message: 'Server error' })
  }
})

export default router
