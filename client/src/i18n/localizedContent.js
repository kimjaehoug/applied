/** Locale-aware static content overlays for Korean-heavy fallback data */

export const researchByLocale = {
  en: [
    {
      title: 'Time-series analysis',
      sections: [
        {
          subtitle: 'Core techniques',
          items: ['LSTM & AutoRegressive models', 'Time-series forecasting'],
        },
        {
          subtitle: 'Applications',
          items: [
            'Environmental data analysis',
            'Wearable health-data forecasting',
          ],
        },
      ],
    },
    {
      title: 'Multimodal integration',
      sections: [
        {
          subtitle: 'Core techniques',
          items: ['CNN & AutoEncoder', 'Multimodal learning'],
        },
        {
          subtitle: 'Applications',
          items: [
            'Image, text, motion, signals',
            'Sensor fusion for health & environment',
          ],
        },
      ],
    },
    {
      title: 'Deep & transfer learning',
      sections: [
        {
          subtitle: 'Core techniques',
          items: [
            'Transfer learning / LwF',
            'Cross-condition ML optimization',
          ],
        },
        {
          subtitle: 'Applications',
          items: [
            'Medical imaging & diagnosis',
            'Smart healthcare systems',
            'Smart city & autonomy',
          ],
        },
      ],
    },
    {
      title: 'NLP & SLM',
      sections: [
        {
          subtitle: 'Core techniques',
          items: [
            'BERT, BiLSTM, Transformer, sLLM',
            'Modern deep NLP models',
          ],
        },
        {
          subtitle: 'Applications',
          items: [
            'Medical report analysis',
            'Image-text reasoning',
            'Large-scale text classification',
          ],
        },
      ],
    },
  ],
  ko: null, // use content.js export
}

export const visionByLocale = {
  en: {
    content1: 'Algorithms for diagnosing and predicting major diseases such as cancer and Alzheimer\'s',
    content2: 'Improving diagnostic accuracy with medical imaging data (MRI, CT)',
    content3: 'Precision medicine research powered by big data and AI',
    content4: 'Attention-based deep learning for skin disease diagnosis',
    content5: 'Transfer learning and retention methods for COVID-19 infection diagnosis',
  },
  ko: null,
}

export const highlightsByLocale = {
  en: {
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
  },
  ko: null,
}

export const professorBioByLocale = {
  en: {
    biography: [
      'Chairperson of the GFID (Ministry of Health and Welfare)',
      'Industrial Intelligence, AI semiconductor & next-gen sensors (MOTIE)',
      'Package R&D AI (Ministry of Science and ICT)',
      'SBAS, Smart city (Ministry of Land, Infrastructure and Transport)',
      'e-Navigation Advisory Committee (Ministry of Oceans and Fisheries)',
      'Head of Research at major IT companies (LG CNS)',
      'Selected among the Top 20 Environmental R&D achievements (2024)',
      'Grand Prize, JBNU 77th Future Talent Award; College of Engineering Outstanding Professor Award',
      "Named among the world's top 2% scientists by Stanford University and Elsevier (2025 edition)",
    ],
  },
  ko: null,
}

export const newsEnByTitle = {
  'AI, 감염병 대응의 판 바꾼다… 전북대, 의료 인공지능 연구 본격화': {
    title: 'AI reshapes infectious-disease response: JBNU expands medical AI research',
    body: "Applied AI Lab at Jeonbuk National University hosts a seminar on AI for infectious-disease diagnosis and treatment.",
    source: 'Jeonmin Ilbo et al.',
  },
  "전북대 조재혁 교수, 스탠퍼드대학 '세계 상위 2%'연구자 선정": {
    title: "Prof. Jaehyuk Cho named among Stanford/Elsevier world's top 2% scientists",
    body: 'Professor Jaehyuk Cho of Jeonbuk National University was selected among the world\'s top 2% scientists.',
    source: 'Jeolla Ilbo, Jeonju Ilbo, News1 et al.',
  },
  '유서현 전북대 박사과정생, 생성형 AI로 의료 감염 대응의 길 열다': {
    title: 'PhD student Seohyun Yoo advances generative AI for medical infection response',
    body: 'JBNU announced practical generative-AI approaches to strengthen infection response in clinical settings.',
    source: 'The Electronic Times',
  },
  '[2025 전북혁신도시활성화 대토론회] 조재혁 전북대학교 소프트웨어공학과 교수 주제 발표': {
    title: '[2025 Jeonbuk Innovation City Forum] Keynote by Prof. Jaehyuk Cho',
    body: "Prof. Cho presented on 'AI era: Jeonbuk answers.'",
    source: 'Jeonbuk Domin Ilbo',
  },
  "전북대 조재혁 교수팀, 'AI 기술로 감염 대응' 우수논문상": {
    title: "Cho lab wins best-paper award for AI-based infection response",
    body: 'Prof. Cho and master\'s student Joonseo Hyeon received a best-paper award at the 2025 ICT Platform Society summer conference.',
    source: 'Yonhap News',
  },
  "조재혁 교수팀, '감염병 대응 AI 시스템' 개발 본격화": {
    title: 'Cho lab launches infectious-disease AI system development',
    body: 'The team began developing Korea\'s first sLLM and prediction platform specialized for infectious-disease response.',
    source: 'Jeonmin Ilbo',
  },
  "AI로 공기 정화 건강 관리하는 '에어스텔라' 플랫폼": {
    title: "Airstella: AI platform for air quality and health management",
    body: 'The indoor air-quality and health platform developed by the Cho lab is drawing attention.',
    source: 'Korea Economic Daily',
  },
  '전북대 조재혁 교수, 국가연구개발사업 우수성과 20선 선정': {
    title: 'Prof. Cho selected among Top 20 national R&D achievements',
    body: 'Recognized for IoT multi-environment sensing technology in the 2024 national R&D excellence list.',
    source: 'Jeonbuk Domin Ilbo',
  },
}

export function localizeNewsItem(item, locale) {
  if (locale !== 'en' || !item) return item
  const mapped = newsEnByTitle[item.title]
  if (!mapped) return item
  return { ...item, ...mapped }
}
