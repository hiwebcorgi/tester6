# Vercel 설정 가이드

Vercel은 이 프로젝트의 **무료 호스팅 플랫폼**으로, Next.js 프로젝트를 자동으로 빌드하고 배포합니다.

## 📋 필요한 것

- Vercel 계정
- GitHub 저장소 (이미 생성됨)
- 환경 변수 값들

## 🚀 단계별 설정

### 1. Vercel 계정 생성

#### 1.1 회원가입

1. [vercel.com](https://vercel.com) 접속
2. **Sign Up** 클릭
3. **Continue with GitHub** 선택 (권장)
   - GitHub 계정으로 로그인
   - Vercel에 GitHub 연동 권한 승인
4. 가입 완료!

**비용**: 무료 (Hobby Plan)

#### 1.2 무료 플랜 제한

| 항목 | 제한 |
|-----|------|
| **대역폭** | 월 100GB |
| **빌드 시간** | 월 6,000분 |
| **서버리스 함수** | 초당 10회 실행 |
| **동시 빌드** | 1개 |
| **프로젝트** | 무제한 |

> 💡 **일반 웹사이트는 무료 플랜으로 충분합니다!**

### 2. 프로젝트 배포

#### 2.1 새 프로젝트 생성

1. Vercel 대시보드에서 **Add New** 클릭
2. **Project** 선택
3. GitHub 저장소 찾기
   - 검색창에 저장소 이름 입력
   - 또는 "Import Git Repository" 섹션에서 선택
4. **Import** 클릭

#### 2.2 프로젝트 설정

**Configure Project** 화면:

**Project Name**: 
- 자동으로 저장소 이름 설정됨
- 변경 가능 (URL에 사용됨)
- 예: `my-awesome-website`

**Framework Preset**:
- 자동 감지: `Next.js` ✅
- 수동 선택 필요 없음

**Root Directory**:
- `.` (프로젝트 루트)
- 변경 필요 없음

**Build and Output Settings**:
- 자동 설정됨
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### 3. 환경 변수 설정

⚠️ **중요**: 배포 전에 반드시 환경 변수를 설정해야 합니다!

#### 3.1 환경 변수 추가

**Configure Project** 화면에서 **Environment Variables** 섹션 펼치기:

##### 필수 환경 변수

```
이름: TINA_PUBLIC_IS_LOCAL
값: false
```

```
이름: GITHUB_OWNER
값: 당신의GitHub사용자이름
```

```
이름: GITHUB_REPO
값: 저장소이름
```

```
이름: GITHUB_PERSONAL_ACCESS_TOKEN
값: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

```
이름: GITHUB_BRANCH
값: main
```

##### 선택 환경 변수 (나중에 추가 가능)

```
이름: NEXT_PUBLIC_TINA_CLIENT_ID
값: (TinaCMS Cloud 사용 시)
```

```
이름: TINA_TOKEN
값: (TinaCMS Cloud 사용 시)
```

#### 3.2 추가 패키지 설치

```
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

pnpm i @vercel/speed-insights
pnpm i @vercel/analytics
```

#### 3.3 환경별 설정

각 환경 변수마다 적용 환경 선택:
- ✅ **Production** (프로덕션 - 필수)
- ✅ **Preview** (미리보기 - 권장)
- ⬜ **Development** (로컬 개발 - 선택)

> 💡 **팁**: Preview도 체크하면 PR 미리보기에서도 동작합니다.

### 4. 배포 시작

1. 모든 환경 변수 입력 완료
2. **Deploy** 버튼 클릭
3. 빌드 진행 상황 확인
   - 실시간 로그 표시
   - 소요 시간: 약 2~5분

#### 4.1 배포 성공 확인

배포 성공 시:
- 🎉 "Congratulations!" 메시지 표시
- 프로젝트 URL 생성: `https://프로젝트명.vercel.app`
- **Visit** 버튼으로 사이트 확인

### 5. 도메인 설정

#### 5.1 기본 도메인

자동 생성된 도메인:
```
https://프로젝트명.vercel.app
https://프로젝트명-사용자이름.vercel.app
```

#### 5.2 커스텀 도메인 추가 (선택)

1. 프로젝트 대시보드 → **Settings** → **Domains**
2. **Add** 클릭
3. 도메인 입력: `www.example.com`
4. DNS 설정 안내에 따라 도메인 제공업체에서 설정
   - **A Record**: `76.76.21.21`
   - 또는 **CNAME**: `cname.vercel-dns.com`

**비용**: 도메인 등록비만 필요 (~$12/년)

### 6. 자동 배포 설정

#### 6.1 Git 연동 배포

Vercel은 자동으로 GitHub와 연동됩니다:

**Production 브랜치**:
- `main` 또는 `master` 브랜치에 push
- → 자동으로 프로덕션 배포

**Preview 배포**:
- 다른 브랜치에 push
- Pull Request 생성
- → 미리보기 URL 자동 생성

**TinaCMS 콘텐츠 수정**:
- TinaCMS에서 콘텐츠 저장
- → GitHub에 자동 커밋
- → Vercel이 자동 감지하여 재배포
- → 2~3분 후 사이트 업데이트

#### 6.2 배포 알림

프로젝트 Settings → **Git** → **Deploy Hooks**에서:
- Slack 알림
- Discord 알림
- 이메일 알림 설정 가능

### 7. 배포 후 환경 변수 추가/수정

#### 7.1 환경 변수 관리

1. 프로젝트 대시보드
2. **Settings** 탭
3. **Environment Variables** 메뉴
4. 추가/수정/삭제 가능

#### 7.2 변경 사항 적용

환경 변수 변경 후:
1. **Deployments** 탭으로 이동
2. 최신 배포의 ⋯ (더보기) 클릭
3. **Redeploy** 선택
4. **Use existing Build Cache** 체크 해제
5. **Redeploy** 클릭

> ⚠️ 환경 변수 변경은 새 배포부터 적용됩니다!

### 8. Build & Development Settings (고급)

#### 8.1 Node.js 버전

Settings → **General** → **Node.js Version**:
- 권장: `18.x` (기본값)
- Next.js 15는 Node.js 18.18+ 필요

#### 8.2 Install Command

```bash
npm install
```

변경 필요 없음 (자동 감지)

#### 8.3 Build Command

```bash
npm run build
```

`package.json`의 build 스크립트 사용:
```json
"build": "tinacms build && next build"
```

#### 8.4 Output Directory

```
.next
```

Next.js 기본 출력 디렉토리

### 9. 성능 최적화

#### 9.1 Vercel Analytics (선택)

무료 웹 분석 도구:

1. 프로젝트 대시보드 → **Analytics** 탭
2. **Enable** 클릭
3. 방문자 통계, 페이지 성능 확인 가능

**무료 플랜**:
- 월 10,000 페이지뷰까지 무료

#### 9.2 Vercel Speed Insights (선택)

성능 모니터링:

1. Settings → **Speed Insights**
2. **Enable** 클릭
3. Core Web Vitals 추적

**무료 플랜**:
- 제한적 기능 제공

#### 9.3 이미지 최적화

Vercel은 자동으로 Next.js `<Image>` 컴포넌트를 최적화:
- WebP 변환
- 반응형 이미지
- Lazy loading

**무료 플랜**:
- 월 1,000개 소스 이미지 최적화

## 🔒 보안 설정

### HTTPS

- 자동으로 SSL 인증서 발급 (Let's Encrypt)
- 모든 도메인 HTTPS 강제
- 추가 설정 불필요 ✅

### 환경 변수 암호화

- Vercel이 자동으로 암호화 저장
- 빌드 시에만 복호화
- GitHub에 노출되지 않음 ✅

## 📊 모니터링

### Deployment 로그

**Deployments** 탭에서:
- 모든 배포 기록 확인
- 빌드 로그 확인
- 오류 발생 시 상세 로그 분석

### Runtime 로그

**Logs** 탭에서:
- 실시간 서버 로그
- API 요청 로그
- 오류 추적

## ❓ 문제 해결

### 문제: 배포 실패 - Build Error

**원인**: 빌드 과정에서 오류 발생

**해결**:
1. Deployment 로그 확인
2. 로컬에서 `npm run build` 테스트
3. 오류 수정 후 다시 push

### 문제: 환경 변수가 적용되지 않음

**원인**: 환경 변수 추가 후 재배포 안 함

**해결**:
1. Deployments → 최신 배포 → Redeploy
2. "Use existing Build Cache" 체크 해제
3. Redeploy 실행

### 문제: TinaCMS Admin 페이지 404

**원인**: 빌드 시 TinaCMS CLI가 실행되지 않음

**해결**:

`package.json` 확인:
```json
"scripts": {
  "build": "tinacms build && next build"
}
```

### 문제: 이미지가 표시되지 않음

**원인**: 이미지 경로 오류

**해결**:
- 이미지는 `public/` 폴더에 저장
- 경로는 `/image.jpg` 형식 (절대 경로)

## 💰 비용 관리

### 무료 플랜 사용량 확인

1. 계정 Settings → **Usage**
2. 대역폭, 빌드 시간 확인
3. 월간 리셋

### 무료 한도 초과 시

- Hobby Plan: 자동으로 서비스 일시 중단
- 다음 달 1일에 자동 재개
- 또는 Pro Plan ($20/월)으로 업그레이드

**일반 웹사이트**:
- 월 방문자 수천 명도 무료 플랜으로 충분 ✅

## 🔄 CI/CD 워크플로우

### 자동화된 배포 흐름

```
1. 코드 수정 (로컬)
   ↓
2. Git commit & push
   ↓
3. GitHub 저장소 업데이트
   ↓
4. Vercel Webhook 트리거
   ↓
5. 자동 빌드 시작
   ↓
6. 빌드 성공
   ↓
7. 자동 배포
   ↓
8. 사이트 업데이트 (2~3분)
```

## 📚 추가 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [환경 변수 가이드](https://vercel.com/docs/concepts/projects/environment-variables)
- [커스텀 도메인 설정](https://vercel.com/docs/concepts/projects/domains)

---

**다음 단계**: [TinaCMS Cloud 설정 가이드](./tinacms-setup.md)로 이동하세요 (선택사항).
