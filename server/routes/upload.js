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
const membersDir = path.join(uploadsRoot, 'members')

if (!fs.existsSync(uploadsRoot)) {
  fs.mkdirSync(uploadsRoot)
}
if (!fs.existsSync(newsDir)) {
  fs.mkdirSync(newsDir)
}
if (!fs.existsSync(membersDir)) {
  fs.mkdirSync(membersDir)
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
const memberStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, membersDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_')
    const stamp = Date.now()
    cb(null, `${base}-${stamp}${ext}`)
  },
})
const uploadMember = multer({ storage: memberStorage })

// 관리자 뉴스 이미지 업로드
router.post('/news', requireAdmin, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, message: '파일이 필요합니다.' })
  }
  const urlPath = `/uploads/news/${req.file.filename}`
  res.json({ ok: true, url: urlPath, filename: req.file.filename })
})

// 관리자 멤버 프로필 이미지 업로드
router.post('/members', requireAdmin, uploadMember.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, message: '파일이 필요합니다.' })
  }
  const urlPath = `/uploads/members/${req.file.filename}`
  res.json({ ok: true, url: urlPath, filename: req.file.filename })
})

export default router

