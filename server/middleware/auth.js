export function requireAdmin(req, res, next) {
  if (req.session && req.session.adminId) {
    return next()
  }
  res.status(401).json({ ok: false, message: '로그인이 필요합니다.' })
}
