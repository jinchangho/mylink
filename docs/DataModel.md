# [Data Model] 마이링크 (MyLink)

이 문서는 "마이링크" 서비스에서 사용하는 데이터 구조를 정의합니다. NoSQL(예: Firebase Firestore) 또는 RDBMS 환경 모두에서 참고할 수 있도록 구성되었습니다.

---

## 1. Users (사용자 정보)
구글 소셜 로그인을 통해 생성되는 사용자 기본 정보입니다.

| 필드명 | 타입 | 설명 |
| :--- | :--- | :--- |
| `uid` | String | 구글 계정 고유 식별자 (Primary Key) |
| `email` | String | 사용자의 구글 이메일 주소 |
| `username` | String | 고유 URL 핸들 (예: mylink.com/**username**) |
| `display_name` | String | 프로필에 표시될 이름 (기본값: Gmail 앞부분) |
| `bio` | String | 한 줄 소개 |
| `photo_url` | String | 프로필 이미지 URL |
| `created_at` | Timestamp | 계정 생성 일시 |
| `updated_at` | Timestamp | 정보 최종 수정 일시 |

---

## 2. Links (링크 정보)
사용자가 자신의 프로필 페이지에 추가한 개별 링크 데이터입니다.

| 필드명 | 타입 | 설명 |
| :--- | :--- | :--- |
| `id` | String | 링크 고유 식별자 |
| `user_id` | String | 해당 링크를 소유한 사용자의 `uid` (Foreign Key) |
| `title` | String | 링크 버튼에 표시될 문구 |
| `url` | String | 연결될 실제 웹 주소 |
| `order` | Number | 드래그 앤 드롭 정렬 순서 (낮을수록 상단) |
| `is_visible` | Boolean | 페이지 노출 여부 (ON/OFF 상태) |
| `created_at` | Timestamp | 링크 생성 일시 |

---

## 3. 관계 정의 (Relationships)
- **User : Link = 1 : N**
  - 한 명의 사용자는 여러 개의 링크를 가질 수 있습니다.
  - 사용자가 삭제되면 해당 사용자의 링크 데이터도 함께 관리되어야 합니다.
