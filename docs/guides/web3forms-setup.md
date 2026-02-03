# Web3Forms 문의 폼 설정 가이드 📧
## 2분 만에 이메일로 문의 받기

> 💡 **Web3Forms**는 무료 폼 서비스입니다. 홈페이지에서 문의가 오면 **이메일로 자동 전송**됩니다!

---

## 📋 준비물
- 이메일 주소 (문의를 받을 이메일)

---

## 🔵 Step 1: Web3Forms 가입 (30초)

1. **[web3forms.com](https://web3forms.com)** 접속
2. 화면 중앙의 **이메일 입력란**에 **문의를 받을 이메일** 입력
3. **Create Access Key** 버튼 클릭
4. 이메일로 온 인증 메일 확인 → **Verify Email** 클릭

---

## 🟢 Step 2: Access Key 복사 (30초)

1. 이메일 인증 후 Web3Forms 대시보드로 이동
2. **Access Key**가 표시됩니다:

```
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

3. 이 키를 **복사**합니다 (매우 중요!)

---

## 🟡 Step 3: Vercel에 환경변수 등록 (1분)

1. **[vercel.com](https://vercel.com)** 로그인
2. 내 프로젝트 선택 → **Settings** 탭 클릭
3. 왼쪽 메뉴에서 **Environment Variables** 클릭
4. 아래 값을 입력:

| 항목 | 값 |
|------|---|
| **Key** | `NEXT_PUBLIC_WEB3FORMS_KEY` |
| **Value** | (Step 2에서 복사한 Access Key 붙여넣기) |
| **Environment** | ✅ Production, ✅ Preview, ✅ Development 모두 체크 |

5. **Save** 클릭

---

## 🔄 Step 4: 재배포 (자동)

환경변수를 저장하면 Vercel이 자동으로 재배포합니다.

수동으로 재배포하려면:
1. **Deployments** 탭 클릭
2. 최신 배포 옆의 **⋯** 클릭 → **Redeploy**
3. **Redeploy** 버튼 클릭

---

## ✅ 완료! 테스트하기

1. 내 홈페이지의 **/contact** 페이지 접속
2. 테스트 문의 작성 후 전송
3. **이메일 확인** → 문의 내용이 도착합니다! 📬

---

## 📊 Web3Forms 무료 플랜 정보

| 항목 | 제한 |
|------|------|
| **월 제출 횟수** | 250건 |
| **폼 개수** | 무제한 |
| **이메일 주소** | 3개까지 |
| **데이터 보관** | 30일 |

> 💡 소상공인 기준 월 250건이면 충분합니다! (하루 평균 8건 이상)

---

## ❓ 자주 묻는 질문

### Q: Access Key를 분실했어요
**A:** [web3forms.com](https://web3forms.com)에서 같은 이메일로 다시 생성하시면 됩니다.

### Q: 다른 이메일로 받고 싶어요
**A:** Web3Forms 대시보드에서 새 Access Key를 발급받고, Vercel 환경변수를 업데이트하세요.

### Q: 월 250건이 초과되면요?
**A:** 다음 달까지 폼이 중단됩니다. 새 이메일로 Access Key를 발급받거나, 유료 플랜($4/월)을 고려하세요.

### Q: 스팸 문의가 많이 와요
**A:** reCAPTCHA가 이미 설정되어 있어 대부분의 스팸은 차단됩니다.

---

## 📧 요약 체크리스트

- [ ] Web3Forms에서 Access Key 발급
- [ ] Vercel에 `NEXT_PUBLIC_WEB3FORMS_KEY` 환경변수 추가
- [ ] **Redeploy** 실행
- [ ] /contact 페이지에서 테스트 문의 전송
- [ ] 이메일 수신 확인

---

> **ZeroPack Factory**  
> 문의 폼 설정 완료! 이제 고객 문의가 이메일로 자동 전송됩니다 📬
