import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { query } from '../db.js'

const router = Router()

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {}
  if (!username || !password) {
    return res.status(400).json({ ok: false, message: '아이디와 비밀번호를 입력해 주세요.' })
  }
  try {
    const rows = await query('SELECT id, username, password_hash FROM admins WHERE username = ?', [username])
    if (!rows.length) {
      return res.status(401).json({ ok: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' })
    }
    const admin = rows[0]
    const match = await bcrypt.compare(password, admin.password_hash)
    if (!match) {
      return res.status(401).json({ ok: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' })
    }
    req.session.adminId = admin.id
    req.session.username = admin.username
    res.json({ ok: true, user: { id: admin.id, username: admin.username } })
  } catch (e) {
    console.error(e)
    res.status(500).json({ ok: false, message: '서버 오류' })
  }
})

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true })
  })
})

router.get('/me', (req, res) => {
  if (req.session && req.session.adminId) {
    return res.json({ ok: true, user: { id: req.session.adminId, username: req.session.username } })
  }
  res.json({ ok: false, user: null })
})

export default router
