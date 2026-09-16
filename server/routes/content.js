import { Router } from 'express'
import { query } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'
import {
  getPageBag,
  savePageLocaleBag,
  normalizeLocale,
  pickLocaleContent,
  setLocaleContent,
  isLocaleBag,
} from '../contentStore.js'

const router = Router()

function parseJsonField(val) {
  if (typeof val !== 'string') return val
  try {
    return JSON.parse(val)
  } catch {
    return val
  }
}

async function readMysqlPage(page) {
  const rows = await query('SELECT section_key, content FROM site_content WHERE page = ?', [page])
  const bags = {}
  for (const row of rows) {
    bags[row.section_key] = parseJsonField(row.content)
  }
  return bags
}

function mergeBags(a, b) {
  // Prefer b when both define a locale; keep the other locale from either side.
  if (!a) return b
  if (!b) return a
  if (!isLocaleBag(a) && !isLocaleBag(b)) return b
  return {
    en: pickLocaleContent(b, 'en') ?? pickLocaleContent(a, 'en'),
    ko: pickLocaleContent(b, 'ko') ?? pickLocaleContent(a, 'ko'),
  }
}

router.get('/', async (req, res) => {
  const { page, locale } = req.query
  if (!page) {
    return res.status(400).json({ ok: false, message: 'page query required' })
  }
  const loc = normalizeLocale(locale)

  let mysqlBags = null
  try {
    mysqlBags = await readMysqlPage(page)
  } catch (e) {
    console.error('content mysql read fallback:', e.message || e)
  }

  try {
    const fileBags = await getPageBag(page)
    const keys = new Set([
      ...Object.keys(mysqlBags || {}),
      ...Object.keys(fileBags || {}),
    ])
    const data = {}
    for (const section of keys) {
      const bag = mergeBags(mysqlBags?.[section], fileBags?.[section])
      const picked = pickLocaleContent(bag, loc)
      if (picked !== undefined) data[section] = picked
    }
    return res.json({
      ok: true,
      locale: loc,
      data,
      source: mysqlBags ? 'mysql+file' : 'file',
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, message: 'Server error' })
  }
})

router.put('/', requireAdmin, async (req, res) => {
  const { page, section, content, locale } = req.body || {}
  if (!page || !section || content === undefined) {
    return res.status(400).json({ ok: false, message: 'page, section, content required' })
  }
  const loc = normalizeLocale(locale)

  let existingBag
  try {
    const fileBags = await getPageBag(page)
    existingBag = fileBags[section]
  } catch {
    existingBag = undefined
  }

  try {
    const rows = await query(
      'SELECT content FROM site_content WHERE page = ? AND section_key = ? LIMIT 1',
      [page, section]
    )
    if (rows.length) {
      existingBag = mergeBags(parseJsonField(rows[0].content), existingBag)
    }
  } catch {
    // mysql unavailable
  }

  const nextBag = setLocaleContent(existingBag, loc, content)

  let mysqlOk = false
  try {
    await query(
      'INSERT INTO site_content (page, section_key, content) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE content = VALUES(content)',
      [page, section, JSON.stringify(nextBag)]
    )
    mysqlOk = true
  } catch (e) {
    console.error('content mysql write fallback:', e.message || e)
  }

  try {
    await savePageLocaleBag(page, section, nextBag)
  } catch (e) {
    console.error('content file write error:', e)
    if (!mysqlOk) {
      return res.status(500).json({ ok: false, message: 'Failed to save content' })
    }
  }

  return res.json({
    ok: true,
    locale: loc,
    persisted: mysqlOk ? 'mysql+file' : 'file',
  })
})

export default router
