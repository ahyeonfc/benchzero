# 골고 — 조기축구 출석·로테이션·경기 분석

주소: https://ahyeonfc.github.io/goalgo/ (2026-11-24 저장소 이름 benchzero → goalgo). Firebase 프로젝트 id(benchzero-50f14)는 바꿀 수 없어 그대로 쓴다.

출석 체크, 쿼터별 출전 로테이션, 작전판, 경기 기록을 관리하는 무료 웹앱입니다.
휴대폰에서 "홈 화면에 추가"하면 앱처럼 실행되고, 인터넷이 끊겨도 동작합니다.

## 파일
- `index.html` 앱 본체
- `manifest.webmanifest` 앱 이름·아이콘 정보
- `sw.js` 오프라인 동작
- `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` 앱 아이콘

## 1. GitHub Pages에 올리기 (무료)
1. github.com 로그인 → 오른쪽 위 `+` → **New repository**
2. 이름 `goalgo`, **Public** 선택 → **Create repository**
3. **uploading an existing file** 클릭 → 위 파일 7개를 끌어다 놓기 → **Commit changes**
4. 저장소 **Settings → Pages** → Branch를 `main`, 폴더 `/ (root)` → **Save**
5. 1~2분 뒤 `https://내아이디.github.io/goalgo/` 로 접속

## 2. Firebase 만들기 (무료 Spark 요금제, 카드 등록 없음)
1. console.firebase.google.com → **프로젝트 추가** → 이름 `benchzero` → 애널리틱스 끄기 → 만들기
2. 왼쪽 **빌드 → Firestore Database → 데이터베이스 만들기**
   - 위치: `asia-northeast3 (서울)` → **프로덕션 모드** → 만들기
3. **규칙** 탭 내용을 아래로 전부 바꾸고 **게시**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /clubs/{club} {
      allow read, write: if club.size() >= 16;
    }
    match /pub/{code} {
      allow read, write: if code.size() >= 16;
      match /bind/{pid} {
        allow read, create, delete: if code.size() >= 16;
      }
      match /in/{id} {
        allow read: if code.size() >= 16;
        allow create: if code.size() >= 16 && request.resource.data.ts == request.time;
      }
    }
  }
}
```

- `clubs`: 운영진 기록 (축구회 코드를 아는 운영진만)
- `pub`: 회원 체크인용 (이름 목록·출석만, 출석 시각은 서버 시각으로만 기록돼 조작할 수 없어요)

4. 프로젝트 개요 옆 톱니바퀴 → **프로젝트 설정 → 내 앱 → 웹(</>)** → 닉네임 입력 → 앱 등록
5. 화면에 나오는 `const firebaseConfig = { ... };` 부분을 복사

## 3. 앱에서 연결
1. 앱 주소 열기 → **설정 → 서버 저장** 칸에 복사한 내용 붙여 넣기 → **서버에 연결**
2. 기존 명단·기록 옮기기: Claude의 조기축구 로테이션판 **설정 → 백업 글 복사** → 새 앱 **설정 → 백업** 칸에 붙여 넣기 → **복원**(두 번 누르기)
3. **운영진 연결 링크 복사** → 운영진 단톡방에 보내기 (링크를 열면 같은 기록에 바로 연결)
4. 크롬 메뉴 `⋮` → **홈 화면에 추가**(또는 앱 설치)

## 알아 둘 점
- Firebase 무료 한도(하루 쓰기 2만 건, 저장 1GB)는 매주 경기 기준으로 1%도 쓰지 않습니다.
- 연결 링크(축구회 코드)를 아는 사람은 기록을 보고 고칠 수 있으니 운영진에게만 공유하세요.
- 회원 명단은 이 공개 저장소에 들어 있지 않고, Firebase와 각 휴대폰에만 저장됩니다.


## 4. 회원 체크인 켜기
1. 앱 **설정 → 회원 체크인 → 켜기**
2. 운동장에서 **지금 내 위치를 운동장으로 저장** (반경·열리는 시각 조정 가능)
3. 화면의 **QR코드**를 인쇄해 붙이거나 **회원용 출석 링크 복사** → 회원 단톡방
4. 회원은 처음 한 번 이름을 고르면 그 휴대폰 전용이 되고, 다음부터는 **도착했어요** 버튼만 누르면 돼요
5. 휴대폰을 바꾼 회원은 설정 → 등록된 휴대폰에서 이름을 두 번 눌러 해제

## 5. 말판 사진 읽기 (무료)
1. Firebase 콘솔 → **AI 서비스 → AI Logic → 시작하기 → Gemini Developer API** 선택 (결제 등록 없이 무료 등급)
2. 앱 **설정 → 말판 사진 읽기 → 켜기**
3. 작전판에서 **말판 사진 찍기 / 앨범에서 고르기**
