import { Router } from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsRoot = path.join(__dirname, '..', 'uploads')
const newsDir = path.join(uploadsRoot, 'news')

if (!fs.existsSync(uploadsRoot)) {
  fs.mkdirSync(uploadsRoot)
}
if (!fs.existsSync(newsDir)) {
  fs.mkdirSync(newsDir)
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, newsDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_')
    const stamp = Date.now()
    cb(null, `${base}-${stamp}${ext}`)
  },
})

const upload = multer({ storage })

// 관리자 뉴스 이미지 업로드
router.post('/news', requireAdmin, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, message: '파일이 필요합니다.' })
  }
  const urlPath = `/uploads/news/${req.file.filename}`
  res.json({ ok: true, url: urlPath, filename: req.file.filename })
})

export default router

