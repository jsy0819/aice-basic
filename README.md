# AICE Basic

AICE Basic 자격증 준비를 위한 개인용 학습 웹앱입니다.

코딩을 거의 모르는 사용자도 바로 열어 쓸 수 있도록, 첫 버전은 설치가 필요 없는 정적 HTML/CSS/JavaScript 앱으로 만들고 있습니다.

## 현재 기능

- 오늘의 학습 대시보드
- AICE Basic 핵심 개념 카드
- 빠른 퀴즈와 해설
- 15문항 모의고사
- AIDU 흐름 체크리스트
- 약점 영역과 복습 추천
- 문제 관리, 북마크, 복습 표시
- 직접 검수한 문제 추가 및 삭제
- 브라우저 `localStorage` 저장

## 로컬에서 열기

아래 파일을 브라우저로 열면 됩니다.

```text
app/index.html
```

별도 설치, 로그인, 백엔드, 데이터베이스는 필요하지 않습니다.

## GitHub Pages 배포

이 저장소에는 GitHub Pages용 워크플로가 들어 있습니다.

```text
.github/workflows/deploy-pages.yml
```

배포 방식은 간단합니다.

1. GitHub에 새 저장소를 만듭니다.
2. 이 프로젝트를 그 저장소에 push합니다.
3. GitHub 저장소의 `Settings > Pages`로 갑니다.
4. `Build and deployment > Source`를 `GitHub Actions`로 선택합니다.
5. `Actions` 탭에서 `Deploy GitHub Pages`가 성공했는지 확인합니다.

배포 주소는 보통 아래 형태입니다.

```text
https://사용자명.github.io/저장소명/
```

이 프로젝트는 `app` 폴더만 사이트로 배포합니다.

## 문제 검증 기준

앱에 기본 포함된 문제는 공식 기출 복사본이 아닙니다.

현재 기본 문제는 AICE Basic 학습 범위와 프로젝트 문서를 기준으로 만든 자체 제작 문제입니다. 공식 샘플, 교재, 유료 자료, 수업 자료에서 문제를 추가하려면 사용 권한을 확인한 뒤 `내 검수 문제 추가` 기능으로 직접 등록하세요.

## Project Documents

- [Product plan](docs/product-plan.md)
- [AICE Basic scope](docs/aice-basic-scope.md)
- [Codex workflow](docs/codex-workflow.md)
- [Implementation roadmap](docs/implementation-roadmap.md)
- [Manual setup checklist](docs/manual-setup-checklist.md)
- [Service review](docs/service-review.md)
