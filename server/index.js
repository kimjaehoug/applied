import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import contentRoutes from './routes/content.js'
import uploadRoutes from './routes/upload.js'

const app = express()
const PORT = process.env.PORT || 5000
const isDev = process.env.NODE_ENV !== 'production'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors({
  origin: isDev ? 'http://localhost:3000' : process.env.FRONT_ORIGIN,
  credentials: true,
}))
app.use(express.json())
app.use(session({
  secret: process.env.SESSION_SECRET || 'applied-ai-lab-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: !isDev,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax',
  },
}))

// 정적 업로드 파일 서빙
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// 문의 메일 API
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ ok: false, message: '필수 항목을 입력해 주세요.' })
  }
  console.log('Contact form:', { name, email, subject, message })
  res.json({ ok: true, message: '문의가 접수되었습니다.' })
})

app.use('/api/auth', authRoutes)
app.use('/api/content', contentRoutes)
app.use('/api/uploads', uploadRoutes)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
