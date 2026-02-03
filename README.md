# Zero-Cost Web Factory 🚀

> **완전 무료**로 웹사이트를 제작하고 관리할 수 있는 혁신적인 보일러플레이트

PRD에 명시된 Elon Musk의 제1원칙적 사고와 5단계 알고리즘을 적용하여 **유지보수 비용을 0으로** 만든 차세대 웹 팩토리입니다.

## ✨ 핵심 특징

- 💰 **완전 무료**: 서버비, DB 비용, 호스팅 비용 0원
- 📦 **GitHub 저장소**: 별도 DB 없이 Git을 데이터베이스로 활용
- 🎨 **모듈 기반 콘텐츠 관리**: 각 모듈별 CRUD 인터페이스
- 🖼️ **자동 이미지 최적화**: WebP 변환 및 압축 자동화
- 🚀 **자동 배포**: 콘텐츠 수정 시 Vercel에서 자동으로 재배포
- 🔒 **완전한 소유권**: 모든 데이터가 당신의 GitHub 저장소에
- 📱 **반응형 디자인**: 모든 디바이스에서 완벽한 사용자 경험

## 🛠️ 기술 스택

- **Framework**: Next.js 16.1.1 (App Router)
- **Styling**: Tailwind CSS 4
- **CMS**: 자체 제작 콘텐츠 관리 시스템
- **Database**: GitHub Repository (JSON)
- **Hosting**: Vercel (Free Tier)
- **Forms**: google sheets (Free)
- **Image Processing**: Sharp (WebP 최적화)
- **Animation**: Framer Motion
- **Icons**: Lucide React

## 📦 구현된 모듈

### ✅ 활성화된 모듈
- **📧 문의하기** (`/contact`) - google sheets 연동 문의 폼
- **🎨 포트폴리오** (`/portfolio`) - 이미지 갤러리 + CRUD 기능
- **📝 블로그** (`/blog`) - 블로그 포스트 관리 시스템

### 🔄 비활성 모듈 (필요시 활성화 가능)
- **📢 공지사항** (`/notice`) - 공지사항 게시판
- **❓ FAQ** (`/faq`) - 자주 묻는 질문
- **💼 채용** (`/careers`) - 채용 공고 관리

> 모듈 활성화는 `content/modules.json`에서 `active: true`로 변경

## 🚀 빠른 시작

### 방법 1: 원클릭 배포 (권장) ⚡

가장 빠르고 쉬운 방법입니다. GitHub과 Vercel 계정만 있으면 5분 안에 배포 완료!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hiwebcorgi/zeropack.corg.app&env=GITHUB_OWNER,GITHUB_REPO,GITHUB_PERSONAL_ACCESS_TOKEN,NEXT_PUBLIC_GOOGLE_SHEETS_ID,NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL,NEXT_PUBLIC_GOOGLE_PRIVATE_KEY&envDescription=필수%20환경변수%20설정&envLink=https://github.com/hiwebcorgi/zeropack.corg.app#-환경변수-설정)

**소요 시간**: 5분  
**필요한 것**: GitHub 계정, Vercel 계정 (둘 다 무료)

#### 📝 단계별 가이드

1. **위 버튼 클릭** → Vercel 배포 페이지로 이동
2. **GitHub 로그인** → 자동으로 프로젝트가 당신의 GitHub에 복사됨
3. **Vercel 로그인** → 무료 계정으로 진행
4. **환경변수 입력** → 아래 표 참고하여 4개 값 입력
5. **Deploy 클릭** → 자동 배포 시작
6. **완료!** 🎉 → 배포된 사이트 URL 확인

#### 🔑 환경변수 설정

| 변수명 | 값 예시 | 설명 | 도움말 |
|--------|---------|------|--------|
| `GITHUB_OWNER` | `your-username` | GitHub 사용자명 | 당신의 GitHub 아이디 |
| `GITHUB_REPO` | `zeropack.corg.app` | 저장소 이름 | 그대로 입력 |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | `ghp_xxxx...` | GitHub 토큰 | [여기서 자동 생성](https://github.com/settings/tokens/new?scopes=repo&description=ZeroPack) ← 클릭! |
| `NEXT_PUBLIC_GOOGLE_SHEETS_ID` | `1AbC...XyZ` | Google Sheets ID | [스프레드시트 생성](https://sheets.google.com) 후 URL에서 ID 복사 |
| `NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL` | `your-service@project.iam.gserviceaccount.com` | 서비스 계정 이메일 | [Google Cloud Console](https://console.cloud.google.com)에서 생성 |
| `NEXT_PUBLIC_GOOGLE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\n...` | 서비스 계정 Private Key | 서비스 계정 생성 시 다운로드된 JSON 파일에서 복사 |

> 💡 **팁**: GitHub 토큰 링크를 클릭하면 필요한 권한(`repo`)이 자동으로 선택됩니다. "Generate token" 버튼만 누르면 끝!

---

### 방법 2: 로컬 개발 환경 설정

개발자이거나 코드를 수정하고 싶다면 이 방법을 사용하세요.

#### 1. 프로젝트 클론 및 설치

```bash
git clone <your-repo-url>
cd zeropack.corg.app
pnpm install
```

### 2. 환경 변수 설정

```bash
cp .env.example .env
```

**로컬 개발 시** (GitHub 설정 불필요):
```env
TINA_PUBLIC_IS_LOCAL=true
NEXT_PUBLIC_GOOGLE_SHEETS_ID=your_sheets_id
NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
NEXT_PUBLIC_GOOGLE_PRIVATE_KEY=your_private_key
```

**프로덕션 배포 시**:
```env
TINA_PUBLIC_IS_LOCAL=false
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repo_name
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_pat
NEXT_PUBLIC_GOOGLE_SHEETS_ID=your_sheets_id
NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
NEXT_PUBLIC_GOOGLE_PRIVATE_KEY=your_private_key
```

### 3. 개발 서버 실행

```bash
pnpm dev
```

- 사이트: http://localhost:3000
- 관리자 페이지: http://localhost:3000/admin

## 📝 콘텐츠 관리

### 모듈별 콘텐츠 관리

각 모듈 페이지에서 직접 콘텐츠를 관리할 수 있습니다:

#### 포트폴리오 관리
- **추가**: 포트폴리오 페이지에서 "새 프로젝트 추가" 버튼 클릭
- **수정**: 각 항목의 편집 버튼 클릭
- **삭제**: 각 항목의 삭제 버튼 클릭
- **이미지**: 드래그 앤 드롭으로 업로드 (자동 WebP 변환)

#### 블로그 관리
- **추가**: 블로그 페이지에서 "새 포스트 작성" 버튼 클릭
- **수정**: 각 포스트의 편집 버튼 클릭
- **삭제**: 각 포스트의 삭제 버튼 클릭

#### 공지사항 관리
- **추가**: 공지사항 페이지에서 "새 공지 작성" 버튼 클릭
- **수정**: 각 공지의 편집 버튼 클릭
- **삭제**: 각 공지의 삭제 버튼 클릭
- **중요 표시**: 중요 공지는 상단에 고정 표시

### 파일 직접 편집

- **홈페이지**: `content/home.json`
- **포트폴리오**: `content/portfolio.json`
- **블로그**: `content/blog.json`
- **공지사항**: `content/notices/*.json`
- **전역 설정**: `content/settings.json`
- **모듈 설정**: `content/modules.json`

## 🎨 커스터마이징

### 핵심 컴포넌트

- **LandingPageClient**: `app/LandingPageClient.tsx` - 메인 페이지
- **ImageUploader**: `components/ImageUploader.tsx` - 이미지 업로드 및 최적화
- **문의 폼**: `app/contact/page.tsx` - Google Sheets 연동

### 스타일 변경

- **전역 스타일**: `app/globals.css`
- **Tailwind 설정**: `tailwind.config.js`
- **색상 테마**: `globals.css`의 CSS 변수 수정

## 🖼️ 이미지 최적화

프로젝트에는 자동 이미지 최적화 기능이 내장되어 있습니다:

- **자동 WebP 변환**: 업로드된 모든 이미지를 WebP로 변환
- **리사이징**: 웹 최적화 크기로 자동 조정 (최대 1920px)
- **압축**: 품질 80%로 압축하여 파일 크기 최소화
- **저장 위치**: `public/uploads/` 디렉토리

### 사용 방법
```tsx
import ImageUploader from '@/components/ImageUploader';

<ImageUploader 
  value={imageUrl} 
  onChange={setImageUrl}
  label="이미지 업로드"
/>
```

## 🌐 배포

### Vercel에 배포하기

1. [Vercel](https://vercel.com)에 가입
2. GitHub 저장소 연결
3. 환경 변수 설정:
   - `GITHUB_OWNER`: GitHub 사용자명
   - `GITHUB_REPO`: 저장소 이름
   - `GITHUB_PERSONAL_ACCESS_TOKEN`: GitHub PAT (repo 권한)
   - `NEXT_PUBLIC_GOOGLE_SHEETS_ID`: Google Sheets ID
   - `NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL`: 서비스 계정 이메일
   - `NEXT_PUBLIC_GOOGLE_PRIVATE_KEY`: 서비스 계정 Private Key
4. Deploy 버튼 클릭!

### 원클릭 배포

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)

## 📚 프로젝트 구조

```
zeropack.corg.app/
├── app/                        # Next.js App Router
│   ├── api/                    # API Routes
│   │   ├── upload/             # 이미지 업로드 API
│   │   ├── portfolio/          # 포트폴리오 CRUD API
│   │   ├── blog/               # 블로그 CRUD API
│   │   └── notice/             # 공지사항 CRUD API
│   ├── portfolio/              # 포트폴리오 페이지
│   ├── blog/                   # 블로그 페이지
│   ├── notice/                 # 공지사항 페이지
│   ├── contact/                # 문의 페이지
│   ├── LandingPageClient.tsx   # 메인 페이지
│   └── page.tsx                # 홈페이지 서버 컴포넌트
├── components/                 # 재사용 가능한 컴포넌트
│   └── ImageUploader.tsx       # 이미지 업로드 컴포넌트
├── content/                    # 콘텐츠 저장소 (DB 역할)
│   ├── home.json               # 홈페이지 콘텐츠
│   ├── portfolio.json          # 포트폴리오 데이터
│   ├── blog.json               # 블로그 데이터
│   ├── modules.json            # 모듈 활성화 설정
│   ├── settings.json           # 전역 설정
│   └── notices/                # 공지사항 파일
├── docs/                       # 프로젝트 문서
│   ├── dev/                    # 개발 문서
│   ├── management/             # 관리 가이드
│   ├── platform/               # 플랫폼 설정 가이드
│   └── work/                   # 작업 문서
├── public/                     
│   └── uploads/                # 업로드된 이미지 저장소
└── scripts/                    # 유틸리티 스크립트
```

## 💡 주요 기능

### 1. 모듈 기반 콘텐츠 관리
- **직관적인 UI**: 각 모듈 페이지에서 직접 관리
- **모달 폼**: 깔끔한 편집 경험
- **실시간 반영**: 변경사항 즉시 확인
- **GitHub 연동**: 자동 커밋 및 배포

### 2. 이미지 최적화
- **자동 WebP 변환**: 모든 이미지 자동 최적화
- **드래그 앤 드롭**: 직관적인 업로드 UX
- **파일 크기 제한**: 10MB 제한으로 안전성 보장
- **미리보기**: 업로드 전후 이미지 확인

### 3. 모듈 시스템
- **동적 활성화**: JSON 설정으로 모듈 on/off
- **네비게이션 자동 생성**: 활성 모듈만 메뉴에 표시
- **확장 가능**: 새 모듈 쉽게 추가 가능

### 4. CRUD 기능
- **포트폴리오**: 프로젝트 추가/수정/삭제
- **블로그**: 포스트 작성/편집/삭제
- **공지사항**: 공지 관리 + 중요 표시

## 🔧 문제 해결

### 빌드 오류 발생 시

```bash
# Windows
Remove-Item -Recurse -Force .next, node_modules
pnpm install
pnpm build

# Mac/Linux
rm -rf .next node_modules
pnpm install
pnpm build
```

### TinaCMS 관리자 페이지 접속 불가

1. 환경 변수 확인: `.env` 파일에 필수 변수 설정 확인
2. 개발 서버 재시작: `pnpm dev`
3. 브라우저 캐시 삭제 후 재접속

### 이미지 업로드 실패

1. `public/uploads/` 디렉토리 존재 확인
2. 파일 크기 10MB 이하 확인
3. 이미지 파일 형식 확인 (JPG, PNG, WebP)

## 📖 더 알아보기

### 공식 문서
- [Next.js 문서](https://nextjs.org/docs)
- [TinaCMS 문서](https://tina.io/docs/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Vercel 문서](https://vercel.com/docs)

### 프로젝트 문서
- [PRD](docs/dev/prd.md) - 제품 요구사항 문서
- [배포 가이드](docs/platform/vercel-setup.md) - Vercel 배포 방법
- [워크플로우](docs/management/WORKFLOW.md) - 개발 워크플로우

## 💰 비용 분석

| 항목 | 서비스 | 비용 |
|------|--------|------|
| **호스팅** | Vercel (Hobby) | $0 |
| **데이터베이스** | GitHub | $0 |
| **CMS** | 자체 제작 | $0 |
| **폼** | Google Sheets (Free) | $0 |
| **이미지 처리** | Sharp (내장) | $0 |
| **도메인** | 선택사항 | ~$12/년 |
| **월 총 비용** | | **$0** |

### 무료 플랜 한도
- **Vercel**: 월 100GB 대역폭, 무제한 배포
- **Google Sheets**: 무제한 폼 제출 (Google 계정 무료 한도 내)
- **GitHub**: 무제한 저장소, API 호출 제한 있음

## 📄 라이센스

MIT License - 자유롭게 사용하세요!

## 🤝 기여

이슈와 PR을 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**제작 원가: $0** | **유지 비용: $0/월** | **제작 시간: 15분**

Made with ❤️ following First Principles Thinking
