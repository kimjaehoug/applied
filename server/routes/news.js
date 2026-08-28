import { Router } from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { query } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const newsDir = path.join(__dirname, '..', 'uploads', 'news')
if (!fs.existsSync(newsDir)) fs.mkdirSync(newsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, newsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_')
    cb(null, `${base}-${Date.now()}${ext}`)
  },
})
const upload = multer({ storage })

router.get('/', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM news ORDER BY created_at DESC')
    res.json({ ok: true, data: rows })
  } catch (e) {
    if (e && e.code === 'ER_NO_SUCH_TABLE') {
      return res.json({
        ok: true,
        data: [],
        message: 'news 테이블이 없습니다. 서버에서 `npm run db:news` 또는 `npm run db:create`를 실행해 주세요.',
      })
    }
    console.error(e)
    res.status(500).json({ ok: false, message: '서버 오류' })
  }
})

router.post('/', requireAdmin, upload.single('image'), async (req, res) => {
  const { title, body: bodyText, source, date } = req.body || {}
  if (!title) return res.status(400).json({ ok: false, message: '제목은 필수입니다.' })

  const image = req.file ? `/uploads/news/${req.file.filename}` : (req.body.imageUrl || '')
  try {
    const result = await query(
      'INSERT INTO news (title, body, source, date, image) VALUES (?, ?, ?, ?, ?)',
      [title, bodyText || '', source || '', date || '', image]
    )
    res.json({ ok: true, id: result.insertId })
  } catch (e) {
    console.error(e)
    res.status(500).json({ ok: false, message: '서버 오류' })
  }
})

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const rows = await query('SELECT image FROM news WHERE id = ?', [req.params.id])
    await query('DELETE FROM news WHERE id = ?', [req.params.id])
    if (rows.length && rows[0].image && rows[0].image.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', rows[0].image)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ ok: false, message: '서버 오류' })
  }
})

export default router
