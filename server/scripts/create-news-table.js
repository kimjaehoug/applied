/**
 * news 테이블만 생성하는 스크립트
 * 실행: node scripts/create-news-table.js
 * 환경변수: MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE (기본값: applied_ai_lab)
 */
import 'dotenv/config'
import mysql from 'mysql2/promise'

const dbName = process.env.MYSQL_DATABASE || 'applied_ai_lab'

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    multipleStatements: true,
  })

  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
  await conn.query(`USE \`${dbName}\``)
  await conn.query(`
    CREATE TABLE IF NOT EXISTS news (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      body TEXT NOT NULL,
      source VARCHAR(200) DEFAULT '',
      date VARCHAR(20) DEFAULT '',
      image VARCHAR(1000) DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await conn.end()
  console.log('news table ready.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})

