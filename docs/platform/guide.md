# Vercel Custom Domain Setup Guide (with Cloudflare)

이 문서는 Vercel 프로젝트에 커스텀 도메인을 연결하고, Cloudflare를 통해 DNS를 관리하는 방법을 설명합니다.

## 1. Vercel에서 도메인 추가

1.  Vercel 대시보드에서 해당 프로젝트로 이동합니다.
2.  **Settings** > **Domains** 탭을 클릭합니다.
3.  입력창에 연결할 도메인(예: `example.com`)을 입력하고 **Add**를 클릭합니다.
4.  만약 `www.example.com`도 함께 추가하겠냐는 메시지가 나오면 **Add**를 권장합니다 (자동으로 리다이렉트 설정됨).
5.  도메인이 추가되면 "Invalid Configuration" 상태가 될 수 있습니다. Vercel이 제시하는 A 레코드와 CNAME 레코드 값을 확인합니다.

## 2. Cloudflare DNS 설정

Cloudflare 대시보드에서 해당 도메인의 **DNS** 설정 페이지로 이동합니다. 기존에 다른 호스팅에 연결된 레코드가 있다면 삭제하거나 수정해야 합니다.

### 권장 설정 (루트 도메인 + www)

Vercel은 루트 도메인(`example.com`)과 서브도메인(`www.example.com`) 연결 시 다음과 같은 설정을 권장합니다.

| Type | Name | Content | Proxy Status | 설명 |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` (Root) | `76.76.21.21` | **DNS Only** (회색 구름) | 루트 도메인을 Vercel IP로 연결 |
| **CNAME** | `www` | `cname.vercel-dns.com` | **DNS Only** (회색 구름) | www 서브도메인을 Vercel로 연결 |

> **중요:** Cloudflare의 Proxy Status는 반드시 **DNS Only (회색 구름)** 로 설정하는 것이 Vercel의 SSL 인증서 발급 및 갱신에 가장 안정적입니다. Proxy(주황색 구름)를 사용하면 SSL 인증서 발급에 문제가 생기거나 "Too many redirects" 오류가 발생할 수 있습니다.

### 대안: 루트 도메인에 CNAME 사용 (CNAME Flattening)

Cloudflare는 루트 도메인(@)에도 CNAME을 사용할 수 있는 CNAME Flattening을 지원합니다. 이 경우 A 레코드 대신 CNAME을 사용할 수도 있습니다.

| Type | Name | Content | Proxy Status |
| :--- | :--- | :--- | :--- |
| **CNAME** | `@` | `cname.vercel-dns.com` | **DNS Only** |
| **CNAME** | `www` | `cname.vercel-dns.com` | **DNS Only** |

## 3. 설정 확인 및 연결 완료

1.  Cloudflare에서 설정을 저장했다면, 다시 Vercel의 **Domains** 설정 페이지로 돌아옵니다.
2.  Vercel이 DNS 변경 사항을 감지할 때까지 기다립니다. (보통 몇 분 내에 완료되지만, 최대 24시간이 걸릴 수 있습니다.)
3.  DNS 설정이 올바르다면 상태가 **Valid Configuration** (또는 체크 표시)으로 변경되고, SSL 인증서가 자동으로 발급됩니다.

## 4. 트러블슈팅

### TXT 레코드 인증이 필요한 경우
도메인을 이전에 다른 Vercel 계정에서 사용했거나 소유권 확인이 필요한 경우, Vercel이 **TXT 레코드** 추가를 요청할 수 있습니다.

1.  Vercel이 화면에 표시해주는 `_vercel` 관련 TXT 레코드 값(Value)을 복사합니다.
2.  Cloudflare DNS 설정에서 **Add Record**를 클릭합니다.
    *   **Type**: `TXT`
    *   **Name**: `_vercel` (또는 Vercel이 제시한 이름)
    *   **Content**: 복사한 값
3.  저장 후 Vercel에서 다시 확인합니다.

### Cloudflare Proxy(주황색 구름)를 꼭 사용해야 하는 경우
만약 Cloudflare의 보안 기능(WAF, DDoS 방어 등)을 위해 Proxy 모드를 사용해야 한다면 다음 설정을 확인하세요.

1.  Cloudflare **SSL/TLS** 설정 메뉴로 이동합니다.
2.  암호화 모드를 **Full (Strict)** 로 설정합니다. (매우 중요)
    *   *Flexible*로 설정 시 무한 리다이렉트 루프가 발생합니다.
3.  Vercel 설정에서 HTTPS 리다이렉트 충돌이 없는지 확인해야 할 수 있습니다. 하지만 일반적으로 Vercel은 **DNS Only** 사용을 강력히 권장합니다.

---
**요약:**
*   **A 레코드**: `@` -> `76.76.21.21`
*   **CNAME 레코드**: `www` -> `cname.vercel-dns.com`
*   **Proxy Status**: `DNS Only` (회색 구름) 권장
