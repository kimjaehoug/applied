# Applied AI Lab - 전북대학교 소프트웨어공학과

[Applied AI Lab](https://appliedai.creatorlink.net) 사이트를 React + Tailwind + Node 조합으로 재구현한 프로젝트입니다.

## 기술 스택

- **Frontend**: React 18, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express, MySQL
- **기능**: 반응형 레이아웃, 관리자 로그인, **페이지별 콘텐츠 MySQL 저장 및 편집**, 문의 폼 API

## 프로젝트 구조

```
applied-ai-lab/
├── client/          # React 프론트엔드
│   ├── src/
│   │   ├── api/         # API 클라이언트
│   │   ├── contexts/    # Auth, Content
│   │   ├── components/ # Layout, EditableSection, EditJsonModal
│   │   ├── pages/
│   │   └── data/        # 기본 fallback 콘텐츠
│   └── package.json
├── server/
│   ├── scripts/
│   │   └── create-tables.js   # DB/테이블 생성 전용
│   ├── routes/         # auth, content
│   ├── middleware/     # requireAdmin
│   ├── db.js            # MySQL 연결
│   ├── schema.sql       # 테이블 정의
│   ├── seed.js          # 초기 관리자 + 콘텐츠 시드
│   └── index.js
└── package.json
```

## 실행 방법

### 1. MySQL 준비

- MySQL 서버 실행 후:

```bash
cd server
cp .env.example .env   # 필요 시 .env에서 호스트/비밀번호 수정
npm install
```

**옵션 A – 테이블만 생성** (DB·테이블만 만들고 데이터는 넣지 않음)

```bash
npm run db:create
```

**옵션 B – 테이블 생성 + 기본 데이터 시드** (권장)

```bash
npm run seed
```

`npm run seed`는 `schema.sql`로 테이블을 만든 뒤 기본 관리자와 기본 콘텐츠를 넣습니다.  
이미 테이블이 있으면 `CREATE TABLE IF NOT EXISTS`로 건너뛰고, 관리자/콘텐츠만 삽입·갱신합니다.

시드 실행 시 **기본 관리자 계정**이 생성됩니다.

- **아이디**: `admin`
- **비밀번호**: `admin123`  
  (배포 후 반드시 비밀번호 변경 권장)

### 2. 의존성 설치

```bash
# 루트
npm install

# 클라이언트
cd client && npm install

# 서버 (위에서 했으면 생략 가능)
cd server && npm install
```

### 3. 개발 서버 실행

**방법 A – 클라이언트만 (프론트만 확인)**

```bash
cd client && npm run dev
```

브라우저에서 http://localhost:3000 접속

**방법 B – 클라이언트 + 서버 동시 실행**

```bash
npm run dev
```

- 프론트: http://localhost:3000  
- API: http://localhost:5000 (문의 폼, 로그인, 콘텐츠 API)

### 4. 관리자 로그인 및 콘텐츠 편집

1. 브라우저에서 **우측 상단 "관리자"** 클릭 → `/admin/login` 이동
2. 위 계정(`admin` / `admin123`)으로 로그인
3. 로그인 후 각 페이지(홈, 소개, 연구, 멤버, 채용, 문의)로 이동
4. **섹션에 마우스를 올리면 "편집" 버튼**이 보임 → 클릭 시 JSON 편집 모달에서 내용 수정 후 저장

저장된 내용은 MySQL `site_content` 테이블에 저장되며, 다음 접속부터 반영됩니다.

### 5. 빌드

```bash
npm run build
```

`client/dist`에 정적 파일이 생성됩니다.

### 6. 프로덕션 실행

```bash
npm run build
npm run start
```

서버만 실행됩니다. 정적 파일 서빙이 필요하면 Express에서 `client/dist`를 서빙하도록 설정하면 됩니다.

## 페이지 구성

| 경로 | 설명 |
|------|------|
| `/` | 홈 (교수 소개, 뉴스 요약) |
| `/about` | 소개 (프로필, 수상경력, 활동이력, 뉴스) |
| `/research` | 연구 (논문, 특허, R&D 과제) |
| `/members` | 멤버 (연구원, 학생, Alumni) |
| `/openings` | 채용 (모집 분야, 혜택, 지원 방법) |
| `/contact` | 문의 (연락처, 문의 폼) |

## API 요약

| API | 설명 |
|-----|------|
| `POST /api/auth/login` | 로그인 (관리자) |
| `POST /api/auth/logout` | 로그아웃 |
| `GET /api/auth/me` | 현재 로그인 여부 |
| `GET /api/content?page=home` | 페이지별 콘텐츠 조회 (공개) |
| `PUT /api/content` | 섹션 수정 (관리자, body: `{ page, section, content }`) |
| `POST /api/contact` | 문의 전송 (로그만 출력, Nodemailer 연동 가능) |

## 라이선스

ISC
