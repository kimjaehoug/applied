import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import contentRoutes from './routes/content.js'
import uploadRoutes from './routes/upload.js'
import newsRoutes from './routes/news.js'
import contactRoutes from './routes/contact.js'

const app = express()
const PORT = process.env.PORT || 5000
const isDev = process.env.NODE_ENV !== 'production'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors({
  origin: (origin, cb) => {
    if (isDev) return cb(null, true)

    const allowed = (process.env.FRONT_ORIGIN || '').trim()
    if (!origin) return cb(null, true)
    if (allowed && origin === allowed) return cb(null, true)
    return cb(new Error('Not allowed by CORS'))
  },
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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/content', contentRoutes)
app.use('/api/uploads', uploadRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/contact', contactRoutes)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
