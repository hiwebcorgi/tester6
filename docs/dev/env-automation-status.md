# 배포 자동화 현황표 (Environment Variables)

zpbook 배포 시스템에서 각 환경변수가 어떻게 처리되는지 구분한 표입니다.

| 환경변수 | 처리 주체 | 자동화 방식 | 비고 |
|---------|----------|------------|------|
| **GITHUB_OWNER** | ✅ **시스템** | GitHub OAuth 정보로 자동 설정 | - |
| **GITHUB_REPO** | ✅ **시스템** | 생성된 저장소 이름 자동 설정 | - |
| **GITHUB_BRANCH** | ✅ **시스템** | `master` 기본값 설정 | - |
| **GITHUB_PERSONAL_ACCESS_TOKEN** | ✅ **시스템** | OAuth 토큰 자동 변환/설정 | 사용자 동의 필요 |
| **ADMIN_PASSWORD** | ✅ **시스템** | 온보딩 시 입력받은 값 주입 | - |
| **NEXT_PUBLIC_CAPTCHA_KEY** | ✅ **시스템** | ZeroPack 공용 키 할당 | 추후 커스텀 도메인 시 변경 권장 |
| **NEXT_PUBLIC_WEB3FORMS_KEY** | 👤 **사용자** | **직접 가입 후 발급 필요** | 이메일 인증 때문에 자동화 불가 |

## 요약

- **자동화 비율**: 6/7 (85%)
- **사용자 작업**: 오직 **Web3Forms 키** 발급만 필요
- **Recaptcha**: 기본적으로 공유 키를 제공하여 초기 설정 불필요

## 사용자 경험 플로우

1. zpbook 로그인 & 템플릿 선택
2. GitHub & Vercel 연결 (OAuth)
3. 초기 설정 (Admin 비밀번호, 프로젝트명 입력)
   - *이때 시스템이 6개 환경변수 자동 주입*
4. **배포 완료!**
5. (후속 조치) 문의 폼 사용을 위해 Web3Forms 키 발급 및 입력 안내
