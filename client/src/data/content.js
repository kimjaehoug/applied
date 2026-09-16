export const site = {
  name: 'Applied AI Lab',
  dept: 'Dept. Software Engineering at Jeonbuk National University',
}

export const professor = {
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
      'Selected among the Top 20 Environmental R&D achievements (2024)',
      'Grand Prize, JBNU 77th Future Talent Award; College of Engineering Outstanding Professor Award',
      "Named among the world's top 2% scientists by Stanford University and Elsevier (2025 edition)",
    ],
  history: [
    { period: '2022 -', desc: 'Professor of Department of Software Engineering & Division of Electronics and Information Engineering at Jeonbuk National University, Jeonju, Korea' },
    { period: '2019 - 2022', desc: 'Director of AI Data Research Centre and Professor of Electronic Information Engineering (IT Convergence Major) at Soongsil University, Seoul, Korea' },
    { period: '2003 - 2021', desc: 'National R&D Project Pre-feasibility Study and Project Coordination PM, KISTEP' },
    { period: '2002 - 2003', desc: 'Technology leader, LG CNS' },
  ],
  topics: [
    'SOTA AI',
    'Prediction Diseases & Precision Medicine',
    'Analysis of Health & Environmental Data',
  ],
}

export const research = [
  {
    title: "시계열 데이터 분석 & 예측",
    sections: [
      {
        subtitle: "주요기술",
        items: [
          "LSTM, AutoRegressive 모델",
          "시계열 예측 알고리즘"
        ]
      },
      {
        subtitle: "응용분야",
        items: [
          "환경 데이터 분석",
          "웨어러블 디바이스로 수집된 건강 데이터의 예측 분석"
        ]
      }
    ]
  },
  {
    title : "다중 모달 데이터 통합 및 분석",
    sections: [
      {
        subtitle: "주요기술",
        items: [
          "CNN, AutoEncoder",
          "다중 모달 학습 알고리즘"
        ]
      },
      {
        subtitle: "응용분야",
        items: [
          "이미지, 텍스트, 모션, 신체 시그널 등",
          "센서 데이터 통합 분석을 통한 환경 및 건강 데이터 처리"
        ]
      }
    ]
  },
  {
    title: "딥러닝 및 전이학습",
    sections: [
      {
        subtitle: "주요기술",
        items: [
          "전이 학습과 Learning Without Forgetting COVID-19 진단",
          "다양한 상황에서 머신러닝 최적화"
        ]
      },
      {
        subtitle: "응용분야",
        items: [
          "의료 영상 분석, 질병 예측 및 진단",
          "스마트 헬스케어 및 원격 진료 시스템",
          "스마트 시티 및 자율 시스템"
        ]
      }
    ]
  },
  {
    title: "자연어 처리(NLP) & 중소형언어모델(SLM)",
    sections: [
      {
        subtitle: "주요기술",
        items: [
          "BERT, BiLSTM, Transformer, sLLM",
          "최신 딥러닝 모델을 활용한 자연어 처리"
        ]
      },
      {
        subtitle: "응용분야",
        items: [
          "SLM 기반의 의료 진단 보고서 분석",
          "이미지와 텍스트 결합을 통한 정보 추론",
          "대규모 텍스트 데이터 분석 및 분류"
        ]
      }
    ]
  }
]

export const vision ={
  content1: "암, 알츠하이머 등 주요 질병 진단 및 예측 알고리즘 개발",
  content2: "의료영상데이터(MRI,CT)를 활용한 진단 알고리즘 개선 및 정확도 향상",
  content3: "빅데이터 및 인공지능을 활용한 정밀 의학 연구",
  content4: "피부 질환 진단을 위한 주의 메커니즘 기반 딥러닝 모델 개발",
  content5: "COVID-19 감염 진단을 위한 전이 학습 및 학습 유지 기법 적용"
}

export const news = [
  {
    date: '25.11.02',
    title: 'AI, 감염병 대응의 판 바꾼다… 전북대, 의료 인공지능 연구 본격화',
    source: '전민일보 등',
    body: "전북대학교 적응형AI연구실은 오는 3일 오후 4시 30분 인문사회관 208호에서 '감염병 진단·치료 AI 활용 세미나'를 개최한다.",
    image: '/image/news/1.png',
  },
  {
    date: '25.10.26',
    title: "전북대 조재혁 교수, 스탠퍼드대학 '세계 상위 2%'연구자 선정",
    source: '전라일보, 전주일보, 뉴스1 등',
    body: "전북대학교 조재혁 교수가 스탠퍼드대학교의 엘스비어(Elsevier)가 발표한 '세계 상위 2% 연구자'에 선정됐다.",
    image: '/image/news/2.png',
  },
  {
    date: '25.09.30',
    title: '유서현 전북대 박사과정생, 생성형 AI로 의료 감염 대응의 길 열다',
    source: '전자신문',
    body: '전북대학교는 조재혁 공대 소프트웨어공학과 교수와 유서현 박사과정생이 의료 현황에서 감염 대응 역량 강화를 위한 생성형 인공지능(AI) 기술의 실용적 가능성을 제시했다고 30일 밝혔다.',
    image: '',
  },
  {
    date: '25.09.28',
    title: '[2025 전북혁신도시활성화 대토론회] 조재혁 전북대학교 소프트웨어공학과 교수 주제 발표',
    source: '전북도민일보',
    body: "조재혁 전북대학교 소프트웨어공학과 교수는 'AI 시대, 전북이 답하다'를 주제로 발표에 나섰다.",
    image: '',
  },
  {
    date: '25.07.03',
    title: "전북대 조재혁 교수팀, 'AI 기술로 감염 대응' 우수논문상",
    source: '연합뉴스',
    body: "전북대학교는 공과대 소프트웨어공학과 조재혁 교수와 현준서 석사과정생이 '2025년 ICT플랫폼학회 하계학술대회 및 생성형 AI 기술 세미나'에서 우수논문상을 받았다고 3일 밝혔다.",
    image: '',
  },
  {
    date: '25.06.11',
    title: "조재혁 교수팀, '감염병 대응 AI 시스템' 개발 본격화",
    source: '전민일보',
    body: '전북대학교 조재혁 교수 연구팀(공대 소프트웨어공학)이 국내 최초로 감염병 대응에 특화된 소형 언어모델(sLLM) 및 예측·데이터 통합 플랫폼 개발에 착수했다.',
    image: '',
  },
  {
    date: '24.11.11',
    title: "AI로 공기 정화 건강 관리하는 '에어스텔라' 플랫폼",
    source: '한국경제',
    body: "전북대 소프트웨어공학과 조재혁 교수 연구팀이 개발한 실내 공기질 및 건강 관리 플랫폼(에어스텔라)이 주목받고 있다.",
    image: '',
  },
  {
    date: '24.10.25',
    title: '전북대 조재혁 교수, 국가연구개발사업 우수성과 20선 선정',
    source: '전북도민일보',
    body: '전북대학교 소프트웨어공학과 조재혁 교수가 IoT 복합 환경측정기기 개발 기술을 통해 환경 R&D 2024년 국가연구개발사업 우수성과 20선에 선정됐다.',
    image: '',
  },
]

export const researchers = [
  { name: 'Eunkyung Shin', role: 'Researcher', period: '2025 May-', research: '' },
]

export const students = [
  { name: 'Seohyun Yoo', role: 'PhD Student', period: '2022 Sep-', research: 'Natural Language Processing, Artificial Intelligence, Machine Learning, Meta-heuristics, Deep Learning, Environmental Studies' , profile_image:""},
  { name: 'Shi Ming', role: 'PhD Student', period: '2024 Sep-', research: 'Graph Neural Network(including Application), Combinatorial Optimization' , profile_image:""},
  { name: 'Joonseo Hyeon', role: 'Integrated PhD Student', period: '2025 Mar-', research: 'Natural Language Processing, Multimodal Model, Vision Language Model' , profile_image:""},
  { name: 'Yeon Ho Jo', role: 'Integrated PhD Student', period: '2026 Feb-', research: 'Natural Language Processing, AI Agent, Machine Learning, Deep Learning' , profile_image:""},
  { name: 'Sharifov Suhrob', role: 'Master Student', period: '2025 Sep-', research: 'Natural Language Processing, Conversational AI' , profile_image:""},
  { name: 'Jaehong Kim', role: 'Integrated Master Student', period: '2026 Feb-', research: 'Time-Series Forecasting' , profile_image:"" },
  { name: 'Yewon Kwon', role: 'Undergraduate Assistant', period: '2024 May-', research: '' , profile_image:""},
  { name: 'Yunsu Kim', role: 'Undergraduate Assistant', period: '2024 Sep-', research: '' , profile_image:""},
  { name: 'Jimin Kwon', role: 'Undergraduate Assistant', period: '2025 Mar-', research: 'Efficient AI, AI Miniaturization' , profile_image:""},
  { name: 'Suyeong Yoon', role: 'Undergraduate Assistant', period: '2025 Jun-', research: '' , profile_image:""},
  { name: 'Seojin Bae', role: 'Undergraduate Assistant', period: '2025 Jun-', research: '' , profile_image:""},
  { name: 'Jinwoo Jang', role: 'Undergraduate Assistant', period: '2025 Sep-', research: '' , profile_image:""},
]

export const alumni = [
  { name: 'Joonseo Hyeon', period: '22.12. - 25.02.', role: 'Integrated PhD Student in Jeonbuk National University' },
  { name: 'Kihoon Moon', period: '24.03. - 25.08.', role: 'Integrated PhD Student in Sungkyunkwan University' },
  { name: 'Jaehong Kim', period: '24.10. - 26.08.', role: 'Integrated Master Student in Jeonbuk National University' },
]

export const researchHighlights = {
  publications: [
    '30+ papers in SCI journals within the top 10% IF',
    'Multiple papers on generative AI, autonomous learning, and machine learning',
    'AI application papers in medicine and smart cities',
    'Multidisciplinary advanced-technology publications powered by AI',
  ],
  patent: [
    '23 patent applications since 2023 (AI, IoT, and environmental monitoring)',
    'Multiple registrations for real-time disaster response and AI systems',
    'Technology transfer for IoT-based big-data collection and management',
    'Commercialization of environmental and health-impact monitoring technology',
    '16 software copyright registrations',
  ],
  projects: [
    { period: '2021-2024', title: 'IoT-based environmental health big-data system', org: 'Ministry of Environment', budget: 'KRW 6B, 3+1 years' },
    { period: '2021-2023', title: 'AI platform and digital open lab', org: 'MSIT', budget: 'KRW 2B, 5 years' },
    { period: '2020-2024', title: 'Sensor-based SoC', org: 'MOTIE', budget: 'KRW 0.3B, 4 years' },
    { period: '2019-2023', title: '5G-based smart sensor platform', org: 'MSIT', budget: 'KRW 5B, 5 years' },
    { period: '2019-2021', title: 'Common data model for medicine', org: 'MOHW', budget: 'KRW 0.5B, 3 years' },
  ],
}

export const openings = {
  positions: ['Master Program', 'PhD Program', 'Undergraduate Assistants (Junior, Senior)'],
  benefits: [
    'Provide own GPU Servers for AI and Data Analysis',
    'Education for Data Analysis from Scratch',
    'Support Incentives and Living Expenses for Full-time Graduate Students (discussion needed)',
    'Support Participating Domestic/International Conferences',
  ],
  apply: [
    'CV (Possible work periods, personal skills, and motivation must be required)',
    'Official Transcript',
    'Cover Letter',
  ],
  contact: 'Give under documents by E-mail',
}

export const contact = {
  phone: '(063) 270 4771',
  email: 'chojh@jbnu.ac.kr',
  address: '567, Baekje-daero, Deokjin-gu, Jeonju-si, Jeonbuk-do, Republic of Korea',
  room: 'Engineering Building No.5, Room No. 309',
}
