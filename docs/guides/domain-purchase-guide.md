# 도메인 구입 3분 가이드 🚀
## Cloudflare 기준 (가장 저렴!)

> 💡 **Cloudflare**는 도메인을 **원가**에 판매합니다. 마진 없이 가장 저렴해요!

---

## 💰 가격 비교

| 도메인 | Cloudflare | 가비아 | 절약 |
|--------|-----------|--------|------|
| **.com** | 약 $10.44 (~14,000원) | ~18,000원 | **4,000원** |
| **.net** | 약 $10.44 (~14,000원) | ~18,000원 | **4,000원** |
| **.kr** | 직접구매불가 | ~17,000원 | - |

> ⚠️ `.kr`, `.co.kr` 등 한국 도메인은 Cloudflare에서 구매 불가. 가비아 이용하세요.

---

## 📋 준비물
- 이메일 주소
- 해외결제 가능 카드 (Visa, Mastercard)

---

## 🔵 Step 1: Cloudflare 가입 (30초)

1. **[dash.cloudflare.com](https://dash.cloudflare.com/sign-up)** 접속
2. 이메일 + 비밀번호 입력
3. **Create Account** 클릭
4. 이메일 인증 (받은 메일에서 링크 클릭)

---

## 🟢 Step 2: 도메인 검색 & 구매 (1분)

1. 왼쪽 메뉴에서 **Domain Registration** → **Register Domains** 클릭
2. 검색창에 **원하는 도메인** 입력 (예: `mybusiness`)
3. 사용 가능한 도메인 목록에서 **원하는 것 선택**
4. **Purchase** 클릭
5. 등록자 정보 입력:
   - First Name / Last Name (영문)
   - Address (영문 주소)
   - Phone (한국: +82 10-xxxx-xxxx)
6. 결제 정보 입력 → **Complete Purchase**

---

## 🟡 Step 3: Vercel 도메인 연결 (1분 30초)

### 3-1. Vercel에서 도메인 추가

1. **[vercel.com](https://vercel.com)** 로그인
2. 프로젝트 선택 → **Settings** → **Domains**
3. 구입한 도메인 입력 (예: `mybusiness.com`) → **Add**
4. Vercel이 보여주는 **DNS 레코드 확인**:

```
📋 Vercel에서 제공하는 값 (예시)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3-2. Cloudflare에서 DNS 설정

1. **[dash.cloudflare.com](https://dash.cloudflare.com)** 접속
2. 도메인 선택 → **DNS** → **Records** 클릭
3. **Add record** 버튼 클릭

#### A 레코드 추가 (메인 도메인용)
| 항목 | 값 |
|------|---|
| Type | **A** |
| Name | **@** |
| IPv4 address | **76.76.21.21** |
| Proxy status | **DNS only** (구름 끄기!) |
| TTL | Auto |

→ **Save** 클릭

#### CNAME 레코드 추가 (www용)
| 항목 | 값 |
|------|---|
| Type | **CNAME** |
| Name | **www** |
| Target | **cname.vercel-dns.com** |
| Proxy status | **DNS only** (구름 끄기!) |
| TTL | Auto |

→ **Save** 클릭

> ⚠️ **중요!** Proxy status를 **DNS only** (회색 구름)로 설정하세요!  
> 주황색 구름(Proxied)으로 하면 SSL 오류가 날 수 있어요.

---

## ✅ Step 4: 연결 확인 (5~30분 대기)

1. Vercel **Settings** → **Domains**로 돌아가기
2. 도메인 옆에 **✓ Valid Configuration** 표시 확인
3. 브라우저에서 `https://mybusiness.com` 접속 테스트

> 💡 DNS 전파에 최대 30분 소요될 수 있어요. 조금만 기다려주세요!

---

## 📋 요약 체크리스트

- [ ] Cloudflare 계정 생성
- [ ] 도메인 구매 완료
- [ ] Vercel에 도메인 추가
- [ ] Cloudflare DNS에 A 레코드 추가 (`76.76.21.21`)
- [ ] Cloudflare DNS에 CNAME 레코드 추가 (`cname.vercel-dns.com`)
- [ ] Proxy status → DNS only 설정
- [ ] Valid Configuration 확인

---

## 📞 자주 묻는 질문

### Q: 한국 도메인(.kr, .co.kr)도 가능한가요?
**A:** Cloudflare에서는 직접 구매 불가해요. 가비아에서 구매 후 Cloudflare DNS로 이전하거나, 가비아 DNS를 직접 사용할 수 있어요.

### Q: Proxy status를 Proxied로 하면 안 되나요?
**A:** Vercel은 자체 SSL을 사용하므로 Proxied 모드 시 충돌이 발생해요. 반드시 **DNS only**로 설정하세요.

### Q: 도메인 연결 후 바로 안 되는데요?
**A:** DNS 전파에 5~30분(최대 48시간) 걸릴 수 있어요. 30분 후 다시 확인해주세요.

### Q: www 없이 접속하면 어떻게 되나요?
**A:** A 레코드가 있으면 `mybusiness.com` (www 없이)으로도 접속됩니다.

---

## 📧 도움이 필요하시면?

도메인 연결이 어려우시면 연락 주세요. 무료로 대신 설정해 드립니다!

- **이메일**: contact@zeropack.kr

---

> **ZeroPack Factory**  
> 도메인 비용(연 ~14,000원)만 내시면 됩니다. 그 외 **월 유지비는 0원**!
