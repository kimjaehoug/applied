/**
 * DB 초기화 및 기본 관리자 + 기본 콘텐츠 시드
 * 실행: node seed.js
 * 환경변수: MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
 */
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
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

const defaultAdmin = {
  username: 'admin',
  password: 'admin123', // 최초 로그인 후 반드시 변경 권장
}

const defaultContent = {
  site: { name: 'Applied AI Lab', dept: 'Dept. Software Engineering at Jeonbuk National University' },
  professor: {
    name: 'Jaehyuk Cho',
    nameKo: '조재혁',
    title: 'Professor',
    biography: [
      'Chairperson of the GFID (Ministry of Health and Welfare)',
      'Industrial Intelligence, AI semi-conductor & Next-gen sensors (Ministry of Trade, Industry and Energy)',
      'Package R&D AI (Ministry of Science and ICT)',
      'SBAS, Smart city (Ministry of Land, Infrastructure and Transport)',
      'e-Navigation Advisory Committee (Ministry of Oceans and Fisheries)',
      'Head of Research at major IT companies (LG CNS)',
      '2024 환경 R&D 우수성과 20선',
      '전북대학교 77주년 미래인재상 대상 수상, 공과대학 우수교수상',
      "스탠포드대와 엘스비어(Elsevier)에서 '세계 상위2% 연구자' (2025년판)에 선정",
    ],
    history: [
      { period: '2022 -', desc: 'Professor of Department of Software Engineering & Division of Electronics and Information Engineering at Jeonbuk National University, Jeonju, Korea' },
      { period: '2019 - 2022', desc: 'Director of AI Data Research Centre and Professor of Electronic Information Engineering (IT Convergence Major) at Soongsil University, Seoul, Korea' },
      { period: '2003 - 2021', desc: 'National R&D Project Pre-feasibility Study and Project Coordination PM, KISTEP' },
      { period: '2002 - 2003', desc: 'Technology leader, LG CNS' },
    ],
    topics: ['SOTA AI', 'Prediction Diseases & Precision Medicine', 'Analysis of Health & Environmental Data'],
  },
  news: [
    { date: '25.11.02', title: 'AI, 감염병 대응의 판 바꾼다… 전북대, 의료 인공지능 연구 본격화', source: '전민일보 등', body: '전북대학교 적응형AI연구실은 오는 3일 오후 4시 30분 인문사회관 208호에서 \'감염병 진단·치료 AI 활용 세미나\'를 개최한다.' },
    { date: '25.10.26', title: "전북대 조재혁 교수, 스탠퍼드대학 '세계 상위 2%'연구자 선정", source: '전라일보, 전주일보, 뉴스1 등', body: '전북대학교 조재혁 교수가 스탠퍼드대학교의 엘스비어(Elsevier)가 발표한 \'세계 상위 2% 연구자\'에 선정됐다.' },
  ],
  researchers: [{ name: 'Eunkyung Shin', role: 'Researcher', period: '2025 May-', research: '' }],
  students: [
    { name: 'Seohyun Yoo', role: 'PhD Student', period: '2022 Sep-', research: 'Natural Language Processing, AI, Machine Learning' },
    { name: 'Shi Ming', role: 'PhD Student', period: '2024 Sep-', research: 'Graph Neural Network, Combinatorial Optimization' },
  ],
  alumni: [
    { name: 'Joonseo Hyeon', period: '22.12. - 25.02.', role: 'Integrated PhD Student in Jeonbuk National University' },
    { name: 'Kihoon Moon', period: '24.03. - 25.08.', role: 'Integrated PhD Student in Sungkyunkwan University' },
  ],
  researchHighlights: {
    publications: ['SCI IF 10% 저널에 30편 이상 논문 게재', '생성형 AI, 자율학습, 머신러닝 등 관련 논문 다수 게재'],
    patent: ['2023년 이후 특허 출원 23건', 'IoT 기반 빅데이터 수집 및 관리 기술 관련 기술 이전'],
    projects: [
      { period: '2021-2024', title: 'IoT 기반 환경 보건 빅데이터 시스템 구축', org: '환경부', budget: '60억 원, 3+1년' },
      { period: '2019-2023', title: '5G 기반 스마트 센서 플랫폼', org: '과학기술정보통신부', budget: '50억 원, 5년' },
    ],
  },
  openings: {
    positions: ['Master Program', 'PhD Program', 'Undergraduate Assistants (Junior, Senior)'],
    benefits: ['Provide own GPU Servers for AI and Data Analysis', 'Education for Data Analysis from Scratch', 'Support Incentives and Living Expenses', 'Support Domestic/International Conferences'],
    apply: ['CV', 'Official Transcript', 'Cover Letter'],
    contact: 'Give under documents by E-mail',
  },
  contact: {
    phone: '(063) 270 4771',
    email: 'chojh@jbnu.ac.kr',
    address: '567, Baekje-daero, Deokjin-gu, Jeonju-si, Jeonbuk-do, Republic of Korea',
    room: 'Engineering Building No.5, Room No. 309',
  },
}

// Flatten for DB: page + section_key -> content
function flattenContent(prefix, obj, acc = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}_${k}` : k
    if (v !== null && typeof v === 'object' && !Array.isArray(v) && (typeof v.period === 'undefined' && typeof v.title === 'undefined')) {
      flattenContent(key, v, acc)
    } else {
      acc[key] = v
    }
  }
  return acc
}

async function run() {
  let conn
  try {
    conn = await mysql.createConnection({ ...config, multipleStatements: true })
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8')
    for (const stmt of schema.split(';').filter(Boolean)) {
      const s = stmt.trim()
      if (s) await conn.query(s)
    }

    const hash = await bcrypt.hash(defaultAdmin.password, 10)
    await conn.query(
      'INSERT IGNORE INTO admins (username, password_hash) VALUES (?, ?)',
      [defaultAdmin.username, hash]
    )
    console.log('Admin created (or already exists):', defaultAdmin.username, '/', defaultAdmin.password)

    const contentRows = []
    const pageSections = [
      ['home', 'site', defaultContent.site],
      ['home', 'professor', defaultContent.professor],
      ['home', 'news', defaultContent.news],
      ['about', 'professor', defaultContent.professor],
      ['about', 'news', defaultContent.news],
      ['members', 'researchers', defaultContent.researchers],
      ['members', 'students', defaultContent.students],
      ['members', 'alumni', defaultContent.alumni],
      ['research', 'researchHighlights', defaultContent.researchHighlights],
      ['openings', 'openings', defaultContent.openings],
      ['contact', 'contact', defaultContent.contact],
    ]
    for (const [page, section_key, content] of pageSections) {
      contentRows.push([page, section_key, JSON.stringify(content)])
    }
    for (const row of contentRows) {
      await conn.query(
        'INSERT INTO site_content (page, section_key, content) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE content = VALUES(content)',
        row
      )
    }
    console.log('Default content seeded.')
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    if (conn) await conn.end()
  }
}

run()
