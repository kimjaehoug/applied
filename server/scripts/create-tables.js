/**
 * 데이터베이스 및 테이블 생성 스크립트
 * 실행: node scripts/create-tables.js
 * 환경변수: MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE (기본값: applied_ai_lab)
 */
import 'dotenv/config'
import mysql from 'mysql2/promise'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const config = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'applied_ai_lab',
}

async function run() {
  // DB 이름 없이 연결 (CREATE DATABASE 실행용)
  const conn = await mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    multipleStatements: true,
  })

  const schemaPath = join(__dirname, '..', 'schema.sql')
  const schema = readFileSync(schemaPath, 'utf8')

  const statements = schema
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'))

  console.log('Creating database and tables...')
  for (const stmt of statements) {
    await conn.query(stmt)
    if (stmt.toUpperCase().startsWith('CREATE DATABASE')) {
      console.log('  - Database created (or already exists)')
    } else if (stmt.toUpperCase().startsWith('CREATE TABLE')) {
      const match = stmt.match(/CREATE TABLE (?:IF NOT EXISTS )?`?(\w+)`?/i)
      console.log('  - Table:', match ? match[1] : 'ok')
    }
  }

  await conn.end()
  console.log('Done.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
