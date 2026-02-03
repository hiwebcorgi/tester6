# 백엔드 솔루션 비교 분석 (2026)

## 📋 요구사항
1. **100% 무료**: 나중에도 무조건 0원
2. **노코드 편집**: 구매자가 쉽게 화면 고칠 수 있음
3. **배포 환경 안정성**: Vercel 등에서 문제없이 동작
4. **Visual Editing UI**: 배포 화면에서도 UI 보임

---

## 🔍 솔루션 비교

### 1️⃣ GitHub API (현재 선택)

#### ✅ 장점
- **완전 무료**: Rate limit 있지만 일반 사이트 편집에는 충분 (인증된 요청: 시간당 5,000건)
- **배포 안정성**: 단순 REST API 호출로 Vercel에서 문제없이 동작
- **버전 관리**: Git history로 모든 변경사항 추적 가능
- **자동 배포 연동**: Vercel이 GitHub commit 감지해서 자동 재배포
- **데이터 소유권**: 모든 콘텐츠가 사용자의 GitHub 리포지토리에 저장
- **백업 용이**: Git 자체가 백업 시스템

#### ⚠️ 단점
- **이미지 파일 제한**: 큰 미디어 파일은 Git LFS 필요 (50MB/파일, 1GB 무료)
- **실시간성 부족**: Commit → 배포까지 시간 소요 (1-3분)
- **커밋 이력 복잡**: 사용자 편집이 모두 커밋으로 남음

#### 💰 비용 분석
```
- GitHub Free Tier:
  - Public repo: 무제한 무료
  - Private repo: 무제한 무료
  - Git LFS: 1GB storage + 1GB bandwidth/월 무료
  - API Rate Limit: 인증 요청 5,000/시간 (충분함)

→ 영구 0원 보장 ✅
```

#### 🎯 적합한 데이터
- ✅ 페이지 콘텐츠 (Markdown)
- ✅ 블로그 포스트
- ✅ 공지사항 (JSON/Markdown)
- ✅ 사이트 설정 (JSON)
- ⚠️ 이미지 (제한적, Git LFS 권장)
- ❌ 대용량 비디오

---

### 2️⃣ Firebase (Firestore + Storage)

#### ✅ 장점
- **실시간 동기화**: 변경사항 즉시 반영
- **확장성**: Google 인프라 기반
- **미디어 처리**: Firebase Storage로 대용량 파일 처리
- **인증 통합**: Firebase Auth 기본 제공
- **NoSQL DB**: 유연한 데이터 구조

#### ⚠️ 단점
- **무료 티어 제한 (2026 기준)**:
  - Firestore: 읽기 50,000/일, 쓰기 20,000/일, 삭제 20,000/일
  - Storage: 5GB 저장, 1GB/일 다운로드
  - 함수: 125,000 호출/월
- **트래픽 증가 시 비용**: 초과 시 자동 과금 위험
- **0원 보장 불가**: 사이트 인기 많아지면 비용 발생 가능 ⚠️
- **벤더 종속**: Google 플랫폼에 강하게 종속
- **버전 관리 부족**: Git 같은 히스토리 관리 없음

#### 💰 비용 분석
```
Firebase Spark Plan (무료):
- Firestore 읽기: 50,000/일 = 월 1,500,000 건
- Firestore 쓰기: 20,000/일 = 월 600,000 건
- Storage: 5GB
- 다운로드: 1GB/일 = 월 30GB

예상 시나리오 (일 방문자 1,000명):
- 페이지뷰: 1,000명 × 5페이지 = 5,000 읽기/일 ✅ 안전
- 편집: 10건/일 ✅ 안전

예상 시나리오 (일 방문자 10,000명):
- 페이지뷰: 10,000명 × 5페이지 = 50,000 읽기/일 ⚠️ 한계
- 초과 시: $0.06/100,000 읽기 → 월 $1.80

→ 소규모는 0원, 중규모 이상은 비용 발생 ⚠️
```

#### 🎯 적합한 데이터
- ✅ 문의폼 제출 내용 (실시간 저장)
- ✅ 공지사항 (실시간 업데이트)
- ✅ 사용자 댓글/리뷰
- ✅ 사이트 통계/분석

---

### 3️⃣ Supabase (PostgreSQL + Storage)

#### ✅ 장점
- **오픈소스**: Self-hosting 가능 (완전 무료 가능)
- **PostgreSQL**: 강력한 관계형 DB
- **실시간 구독**: Realtime database 기능
- **RESTful API**: 자동 생성되는 API
- **Storage**: 파일 저장소 포함
- **Auth**: 인증 시스템 내장

#### ⚠️ 단점
- **무료 티어 제한 (2026 기준)**:
  - Database: 500MB
  - Storage: 1GB
  - Bandwidth: 5GB/월
  - Edge Functions: 500,000 호출/월
  - Paused after 1 week of inactivity (무료 플랜)
- **비활성 중단**: 7일 미사용 시 프로젝트 일시 중지 ⚠️
- **0원 보장 불가**: 트래픽 증가 시 비용 발생
- **Self-hosting 복잡도**: 완전 무료로 하려면 직접 호스팅 필요 (DevOps 비용)

#### 💰 비용 분석
```
Supabase Free Tier:
- Database: 500MB (소규모 충분)
- Storage: 1GB (이미지 제한적)
- Bandwidth: 5GB/월
- 7일 미사용 시 일시 중지 ⚠️

예상 시나리오 (일 방문자 1,000명):
- API 요청: 1,000명 × 10요청 = 10,000/일 = 300,000/월 ✅
- Bandwidth: 페이지당 500KB × 1,000 × 5 = 2.5GB/일 ❌ 초과!

Self-hosting (완전 무료):
- Docker + VPS 필요
- 설정/유지보수 복잡
- DevOps 시간 비용 발생

→ 무료 티어는 소규모만, 중규모는 비용 발생 ⚠️
→ Self-hosting은 기술 비용 발생 ⚠️
```

#### 🎯 적합한 데이터
- ✅ 관계형 데이터 (복잡한 쿼리 필요 시)
- ✅ 사용자 인증 정보
- ✅ 문의폼 제출
- ⚠️ 미디어 파일 (용량 제한)

---

## 📊 종합 비교표

| 항목 | GitHub API | Firebase | Supabase |
|------|-----------|----------|----------|
| **영구 무료 보장** | ✅ 완전 보장 | ⚠️ 트래픽 제한 | ⚠️ 트래픽 제한 + 비활성 중단 |
| **배포 안정성** | ✅ 매우 안정 | ✅ 안정 | ✅ 안정 |
| **실시간 편집** | ❌ Commit → 배포 (1-3분) | ✅ 즉시 반영 | ✅ 즉시 반영 |
| **노코드 친화성** | ⚠️ Visual Editor 필요 | ✅ Firebase Console | ✅ Supabase Dashboard |
| **버전 관리** | ✅ Git history | ❌ 없음 | ❌ 없음 |
| **미디어 처리** | ⚠️ Git LFS (1GB) | ✅ 5GB 무료 | ⚠️ 1GB 무료 |
| **벤더 종속** | ❌ GitHub만 | ⚠️ Google 종속 | ⚠️ Supabase 종속 |
| **데이터 소유권** | ✅ 완전 소유 | ⚠️ 제한적 | ⚠️ 제한적 |
| **학습 곡선** | 중간 | 낮음 | 중간 |
| **확장성** | ⚠️ Git 한계 | ✅ 매우 높음 | ✅ 높음 |

---

## 🎯 최종 권장 아키텍처

### ✅ 하이브리드 접근 (Best Practice)

```
1. 메인 콘텐츠 → GitHub API
   - 페이지 (Markdown)
   - 블로그 포스트 (Markdown)
   - 사이트 설정 (JSON)
   - 공지사항 (JSON/Markdown)
   → 이유: 영구 무료, 버전 관리, 자동 배포

2. 동적 데이터 → GitHub API (Initially)
   - 문의폼 제출 → GitHub Issues API 사용
   → 이유: 완전 무료, 이메일 알림 자동
   
3. 미디어 → Cloudinary (무료 티어)
   - 이미지/비디오 → Cloudinary Free Tier
   → 25GB 저장, 25GB bandwidth/월 무료
   → 자동 이미지 최적화/변환
   → Git 저장소 용량 절약
```

### 📝 문의폼 솔루션 상세

#### Option A: GitHub Issues API (추천 ⭐)
```typescript
// 문의폼 제출 → GitHub Issue 생성
async function submitContactForm(data) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues`,
    {
      method: 'POST',
      headers: {
        Authorization: `token ${githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `문의: ${data.subject}`,
        body: `
**이름**: ${data.name}
**이메일**: ${data.email}
**내용**:
${data.message}
        `,
        labels: ['contact-form']
      })
    }
  );
  return response.json();
}
```

**장점**:
- ✅ 완전 무료
- ✅ 이메일 알림 자동
- ✅ Issue tracker로 관리 용이
- ✅ 댓글로 답변 가능
- ✅ Label/Milestone 활용

**단점**:
- ⚠️ Public repo면 이슈 공개됨 (Private repo 사용 권장)
- ⚠️ Rate limit: 5,000 요청/시간 (충분함)

#### Option B: JSON 파일로 저장
```typescript
// 문의폼 제출 → data/contacts.json 파일 업데이트
async function submitContactForm(data) {
  // 1. 기존 contacts.json 읽기
  const file = await fetchFileFromGitHub('data/contacts.json');
  const contacts = JSON.parse(atob(file.content));
  
  // 2. 새 문의 추가
  contacts.push({
    id: Date.now(),
    ...data,
    createdAt: new Date().toISOString()
  });
  
  // 3. GitHub에 commit
  await updateFileOnGitHub('data/contacts.json', 
    JSON.stringify(contacts, null, 2),
    file.sha
  );
}
```

**장점**:
- ✅ 완전 무료
- ✅ 데이터 완전 소유
- ✅ 버전 관리

**단점**:
- ⚠️ 실시간 알림 없음 (Webhook 설정 필요)
- ⚠️ Concurrent 업데이트 처리 필요

---

## 🚀 구현 우선순위

### Phase 1: 핵심 콘텐츠 (GitHub API 100%)
1. ✅ 페이지 편집 (Markdown)
2. ✅ 블로그 포스트 편집
3. ✅ Visual Editing UI
4. ✅ 이미지 업로드 (Git LFS or Cloudinary)

### Phase 2: 동적 기능 (GitHub API)
5. ✅ 공지사항 관리 (JSON)
6. ✅ 문의폼 (GitHub Issues API)

### Phase 3: 확장 (필요시)
7. ⚠️ 댓글 시스템 → Utterances (GitHub Issues 기반, 무료)
8. ⚠️ 분석 → Vercel Analytics (무료)

---

## ✅ 결론

### 선택: GitHub API (100% 무료 보장)

**이유**:
1. ✅ **영구 0원 보장**: Rate limit 내에서 완전 무료
2. ✅ **배포 안정성**: Vercel + GitHub 완벽 통합
3. ✅ **데이터 소유권**: 모든 콘텐츠를 사용자가 소유
4. ✅ **버전 관리**: Git history로 모든 변경 추적
5. ✅ **자동 배포**: Commit → Auto deploy
6. ✅ **문의폼**: GitHub Issues API로 완전 무료 해결

**트레이드오프**:
- ⚠️ 실시간 반영 안 됨 (1-3분 빌드 시간)
- ⚠️ 미디어 파일 제한 (Git LFS 1GB or Cloudinary 사용)

**노코드 편집**:
- Custom Visual Editor 구현으로 해결
- 클릭 → 편집 → 저장 (GitHub commit) → 자동 배포
- 구매자는 GitHub 모르고도 편집 가능

---

## 🎯 다음 단계

1. ✅ `custom-visual-editor-plan.md` 구현 진행
2. ✅ GitHub API 통합 (Contents API, Issues API)
3. ✅ 이미지 업로드: Cloudinary Free Tier 통합
4. ✅ 문의폼: GitHub Issues API 구현
5. ✅ 배포 테스트: Vercel 환경에서 검증

---

**최종 판단**: GitHub API가 요구사항에 **가장 적합**합니다. ✅
