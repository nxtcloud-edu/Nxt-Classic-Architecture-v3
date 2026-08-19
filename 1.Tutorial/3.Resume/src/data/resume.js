/**
 * 이력서 내용은 전부 이 파일에 있다.
 * 자기 이력서로 바꿀 때는 이 파일만 고치면 되고, components/ 는 건드릴 필요가 없다.
 */

/* ── 기본 정보 ── */
export const profile = {
  name: '홍길동',
  tagline: '클라우드 엔지니어링에 대한 열정을 가진 대학생',
  summary:
    'AWS 기반 인프라 구축과 운영을 공부하고 있습니다. 배운 것은 직접 배포해 보고, 과정을 기록으로 남깁니다.',
  // 히어로 상단 배지. 빈 문자열로 두면 배지가 사라진다.
  status: '인턴십 지원 중',
};

/* ── 연락처. href가 없는 항목은 링크가 아닌 텍스트로 표시된다 ── */
export const contacts = [
  { icon: 'mail', label: 'example@email.com', href: 'mailto:example@email.com' },
  { icon: 'phone', label: '010-1234-5678' },
  { icon: 'github', label: 'github.com/yourid', href: 'https://github.com/yourid' },
  { icon: 'linkedin', label: 'linkedin.com/in/yourprofile', href: 'https://linkedin.com/in/yourprofile' },
];

/* ── 연도별 성장 추이 (꺾은선 차트) ── */
export const experienceData = [
  {
    year: 2022,
    certifications: 1,
    activities: 2,
    certDetail: 'AWS 학생 교육 프로그램 수료',
    actDetail: 'AWS 기초 강좌 수강 및 실습\n자료구조/알고리즘 과목 수강',
  },
  {
    year: 2023,
    certifications: 2,
    activities: 3,
    certDetail: 'AWS Cloud Practitioner\nAWS Solutions Architect Associate',
    actDetail:
      'EC2, S3를 활용한 웹 서비스 구축\nCloudWatch 모니터링 대시보드 구축\n서버리스 아키텍처 설계 및 구현',
  },
  {
    year: 2024,
    certifications: 3,
    activities: 4,
    certDetail:
      'AWS Cloud Practitioner\nAWS Solutions Architect Associate\nAWS AI Practitioner',
    actDetail:
      'AWS 심화 강좌 수강 및 실습\nAWS 대학생 유저 그룹 운영진\n교내 DevOps 동아리\n웹서버 구축 프로젝트',
  },
  {
    year: 2025,
    certifications: 5,
    activities: 5,
    certDetail: 'AWS Professional 자격증 목표\n추가 클라우드 자격증 취득 예정',
    actDetail: '클라우드 네이티브 프로젝트 리드\n기술 컨퍼런스 발표 목표\n인턴십 목표',
  },
];

/* ── 프로젝트 경험 구성비 (도넛 차트). value 합이 100이 되도록 맞춘다 ── */
export const projectMix = [
  { name: '인프라/데브옵스', value: 40 },
  { name: '백엔드 개발', value: 30 },
  { name: '클라우드 아키텍처', value: 20 },
  { name: '모니터링/로깅', value: 10 },
];

/* ── 주요 성과 ── */
export const achievements = [
  {
    title: '자격증 취득: AWS Certified Cloud Practitioner (CLF)',
    detail:
      'AWS의 기초 지식과 클라우드 컴퓨팅의 개념을 이해하고 있으며, AWS 인프라에 대한 기초적인 사용 및 운영 능력을 인증받음',
  },
  {
    title: '자격증 취득: AWS Certified Solutions Architect – Associate (SAA)',
    detail:
      'AWS 아키텍처의 설계 및 배포에 필요한 고급 기술을 보유하고 있으며, 확장 가능하고 비용 효율적인 클라우드 솔루션을 설계할 수 있는 능력을 인증받음',
  },
  {
    title: '해커톤 입상: DSC 공유대학 해커톤 최우수상',
    detail:
      '모빌리티를 활용한 지역사회 문제해결을 주제로 한 해커톤에서 사회적 고립 청년들의 사회 복귀를 지원하는 챌린지 프로젝트를 설계하여, AWS 서비스 기반의 데이터 수집 및 분석을 통해 맞춤형 지원 방안을 제안',
  },
  {
    title: 'AWS GameDay 행사 참여: Generative AI Unicorn Party GameDay',
    detail:
      '참가자들이 AWS 솔루션을 사용하여 실제 기술 문제를 해결하는 데 도전하는 게임화된 학습 이벤트로, 해당 GameDay에서는 생성형 AI와 관련된 문제 해결을 중심으로 진행',
  },
];

/* ── 교육 이수 (아코디언) ── */
export const education = [
  {
    title: 'GenAI with Cloud',
    description: 'PartyRock 위젯 활용 AI 실습',
    achievements: [
      'AWS AI 서비스 활용한 애플리케이션 개발 사례 학습',
      'AI 생성 콘텐츠의 투명성, 딥페이크 등 윤리적 문제와 사회적 영향 이해',
      '책임 있는 AI 개발을 위한 AWS의 기술 및 정책 소개: Amazon Bedrock Guardrails',
      'Amazon Titan Image Generator의 워터마크 기능 및 감지 API',
    ],
  },
  {
    title: '서비스 배포 with Cloud',
    description: '2-티어, 3-티어 아키텍처 구축 실습',
    achievements: [
      '랜덤 명언 앱, AI 학습 노트 앱 개발 및 배포',
      'RDS 연동, API 및 프론트엔드(React) 개발',
      '배포(S3, EC2), AI 기능(Bedrock) 연동까지 전 과정 실습 경험',
    ],
  },
  {
    title: 'Serverless & AI 실습',
    description: '서버리스 기반 챗봇 개발 실습',
    achievements: [
      'Rekognition 활용 얼굴인식 로그인 구현 실습',
      'S3 프론트엔드 배포 및 Lambda 함수와 boto3를 활용한 백엔드 배포',
      'CloudFront를 활용하여 HTTPS 엔드포인트 배포 및 S3 웹 사이트 통합',
    ],
  },
  {
    title: 'AWS 자격증반 수강',
    description: 'AWS CLF, SAA 자격증반 수강 및 대비',
    achievements: [
      'AWS의 핵심 서비스 이해와 클라우드 설계 원칙 학습',
      '실전 문제 풀이를 통한 시험 대비 역량 강화',
      '문제 풀이 사이트 및 학습 자료로 부족한 부분 보완',
    ],
  },
  {
    title: '서버리스 MSA',
    description: '서버리스 MSA 아키텍처 기반 3-티어 아키텍처 구축 실습',
    achievements: [
      '쇼핑몰 애플리케이션 개발 및 배포',
      'SQS를 통해 마이크로서비스 간의 비동기 메시징 처리 및 이벤트 기반 아키텍처 구현',
      'Streamlit을 활용해 간단한 프론트엔드를 구축하여 사용자 인터페이스 개발',
    ],
  },
  {
    title: 'Resume Challenge',
    description: 'AWS 핵심 서비스들을 활용한 이력서 웹사이트 배포 실습',
    achievements: [
      'HTML/CSS로 작성한 이력서를 S3 버킷에 배포하여 웹 호스팅',
      'DynamoDB 테이블과 Lambda 함수로 웹사이트 좋아요 기능 추가',
      '가상 서버 EC2 구동 및 환경 설정 경험',
    ],
  },
  {
    title: 'Face Authentication App',
    description: 'Amazon Rekognition으로 만드는 얼굴 인식 인증 시스템',
    achievements: [
      'CloudFront 배포를 통한 안전한 웹 애플리케이션 제공',
      'Rekognition API와 Lambda를 연결해 얼굴 비교 로직 작성',
      'S3 정적 웹 호스팅으로 얼굴 인증 프론트엔드 구현',
    ],
  },
];

/* ── 프로젝트 (아코디언) ── */
export const projects = [
  {
    title: '학과 스터디 매칭 플랫폼 AWS 배포',
    description: 'DevOps / 인프라 담당',
    achievements: [
      'AWS EC2에 Node.js 백엔드 서버 배포 및 RDS(MySQL) 연동',
      'Terraform IaC를 활용한 AWS 리소스 자동화',
      '배포 파이프라인 구성 및 운영',
    ],
  },
  {
    title: '교내 동아리 웹사이트 클라우드 전환',
    description: '정적 호스팅 + CDN 구성',
    achievements: [
      'AWS S3와 CloudFront를 활용한 정적 웹사이트 호스팅',
      'Route53을 통한 도메인 관리 및 HTTPS 설정',
      'Lambda를 활용한 이미지 리사이징 자동화 구현',
      'CloudWatch로 접속자 수 모니터링 대시보드 구축',
    ],
  },
  {
    title: '개인 블로그 운영',
    description: '학습 기록 연재',
    achievements: ['프로젝트 진행 과정 블로그 연재 중', 'SAA 문제 풀이 블로그 연재 중'],
  },
];

/* ── 기술 태그 ── */
export const skills = [
  'AWS',
  'Python',
  'Terraform',
  'Docker',
  'CI/CD',
  'React',
  'Node.js',
  'Linux',
];
