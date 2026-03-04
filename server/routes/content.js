import { Router } from 'express'
import { query } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

// 전체 페이지 콘텐츠 조회 (공개)
router.get('/', async (req, res) => {
  const { page } = req.query
  if (!page) {
    return res.status(400).json({ ok: false, message: 'page 쿼리 필요' })
  }
  try {
    const rows = await query('SELECT section_key, content FROM site_content WHERE page = ?', [page])
    const data = {}
    for (const row of rows) {
      let val = row.content
      if (typeof val === 'string') {
        try { val = JSON.parse(val) } catch { val = val }
      }
      data[row.section_key] = val
    }
    res.json({ ok: true, data })
  } catch (e) {
    console.error(e)
    res.status(500).json({ ok: false, message: '서버 오류' })
  }
})

// 섹션 수정 (관리자 전용)
router.put('/', requireAdmin, async (req, res) => {
  const { page, section, content } = req.body || {}
  if (!page || !section || content === undefined) {
    return res.status(400).json({ ok: false, message: 'page, section, content 필요' })
  }
  try {
    const payload = typeof content === 'string' ? content : JSON.stringify(content)
    await query(
      'INSERT INTO site_content (page, section_key, content) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE content = VALUES(content)',
      [page, section, payload]
    )
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ ok: false, message: '서버 오류' })
  }
})

export default router
