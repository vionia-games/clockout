# 칼퇴하자! / Clock Out! (퇴근 준비 퍼즐)

React 18 + TypeScript + Vite로 만든 한국어 모바일 퍼즐 게임입니다. 미술과 로고는 오리지널 SVG로 제작했습니다.

## 게임 플레이

- 매일 한국 시간(Asia/Seoul) 자정에 고정된 오늘의 도전이 바뀝니다.
- 1단계 **퇴근 준비**: 3×3 두 층, 총 18장, 세 가지 아이콘을 각 6장씩 사용합니다. 아이콘별로 최대 두 장만 남을 수 있어 7칸 수집 가방이 가득 차지 않습니다.
- 2단계 **야근 지옥**: 135장, 9가지 아이콘을 쓰는 수제 「야근 파일 산」 배치입니다. 층별 장수는 45/54/36이며, 빈 틈과 좌우 돌출을 가진 불규칙한 윤곽으로 구성됩니다. 덮인 카드는 위 카드가 사라질 때까지 누를 수 없습니다.
- 같은 아이콘 세 장은 자동으로 사라지고, 수집 가방의 일곱 칸이 모두 차면 도전이 끝납니다.
- 되돌리기, 힌트, 층별 아이콘 수를 유지하는 섞기, 한국 날짜별 최고 기록을 지원합니다.
- 하루 동안 초기 판은 결정적으로 생성되며, 두 번째 단계는 층별 삼 개 조합으로 실행 가능한 전체 풀이 경로를 제공합니다.

## 실행 및 검증

```bash
npm install
npm run dev
npm run typecheck
npm run test:logic
npm run build:web
```

`npm run test:logic`은 1단계의 안전성, 2단계의 장수/아이콘 분포/가림 관계, 날짜 고정성, 그리고 실제로 클릭 가능한 풀이 순서를 검사합니다. GitHub Pages 배포 워크플로도 배포 전에 이 검증과 웹 빌드를 실행합니다.

## 배포 및 앱 아이콘

GitHub Pages: [https://vionia-games.github.io/clockout/](https://vionia-games.github.io/clockout/)

- `public/logo.svg`: 게임 내에서 쓰는 오리지널 달리기 알람 시계 로고
- `public/app-icon.svg`: 앱 아이콘
- `public/favicon.svg`: 웹 파비콘

Apps in Toss 제출은 Toss Console에서 별도 등록/심사를 마쳐야 합니다. 현재 데이터는 브라우저 localStorage에 저장됩니다.
