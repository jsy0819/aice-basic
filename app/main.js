const STORAGE_KEY = "aice-basic-progress-v4";
const LEGACY_KEYS = ["aice-basic-progress-v3", "aice-basic-progress-v2", "aice-basic-progress-v1"];
const PASS_SCORE = 80;
const MOCK_DURATION_SECONDS = 60 * 60;

const sources = [
  {
    id: "official-basic",
    title: "공식 AICE Basic 페이지",
    note: "시험 세부 정보는 변경될 수 있어 시험 전 재확인이 필요합니다.",
  },
  {
    id: "official-overview",
    title: "공식 AICE 소개 페이지",
    note: "AICE는 KT와 한국경제신문이 함께 주관하는 인공지능 능력시험으로 소개됩니다.",
  },
  {
    id: "scope-doc",
    title: "프로젝트 범위 문서",
    note: "2026-06-09 확인 기준: Basic, AIDU, 정형 데이터, 15문항, 60분, 80점 목표.",
  },
  {
    id: "user-verified",
    title: "내 검수 문제",
    note: "사용 권한이 있는 공식 샘플, 교재, 개인 정리 문제를 직접 등록한 항목입니다.",
  },
];

const topics = [
  { id: "all", label: "전체" },
  { id: "eda", label: "탐색 분석" },
  { id: "preprocessing", label: "전처리" },
  { id: "modeling", label: "모델링" },
  { id: "evaluation", label: "성능 평가" },
  { id: "aidu", label: "AIDU 흐름" },
];

const topicNames = Object.fromEntries(topics.map((topic) => [topic.id, topic.label]));

const studyCards = [
  {
    id: "data-shape",
    topic: "eda",
    title: "데이터 구조 먼저 보기",
    summary: "행, 열, 컬럼 의미, 데이터 타입을 확인해야 이후 선택이 흔들리지 않습니다.",
    why: "AIDU에서 모델을 누르기 전, 문제 목표와 데이터 상태를 먼저 파악하는 습관이 중요합니다.",
    example: "고객 데이터라면 고객 ID, 이용 기간, 결제 방식, 이탈 여부처럼 역할이 다른 컬럼을 구분합니다.",
    checklist: ["행/열 개수 확인", "목표 컬럼 확인", "숫자형과 범주형 구분"],
  },
  {
    id: "data-quality",
    topic: "eda",
    title: "데이터 품질 점검",
    summary: "결측치, 중복, 비현실적인 값은 모델 성능보다 먼저 확인합니다.",
    why: "품질이 낮은 데이터를 그대로 학습하면 모델이 잘못된 패턴을 배울 수 있습니다.",
    example: "나이가 999이거나 매출이 음수인 값은 실제 의미인지 입력 오류인지 확인해야 합니다.",
    checklist: ["결측치 비율 확인", "중복 행 확인", "비현실적 값 확인"],
  },
  {
    id: "distribution",
    topic: "eda",
    title: "분포와 시각화",
    summary: "값이 한쪽에 몰렸는지, 이상치가 눈에 띄는지 시각적으로 확인합니다.",
    why: "분포를 보면 평균만으로는 놓치는 데이터의 모양을 이해할 수 있습니다.",
    example: "학습 시간 대부분이 0에 몰려 있다면 단순 평균보다 분포 확인이 더 유용합니다.",
    checklist: ["히스토그램 확인", "박스플롯 확인", "한쪽 치우침 확인"],
  },
  {
    id: "correlation",
    topic: "eda",
    title: "관계와 상관",
    summary: "두 변수 사이에 함께 움직이는 경향이 있는지 확인합니다.",
    why: "상관관계는 변수 선택과 해석의 힌트가 되지만, 원인을 증명하는 것은 아닙니다.",
    example: "면적과 집값이 함께 증가하는 경향은 산점도로 확인할 수 있습니다.",
    checklist: ["산점도 확인", "상관계수 참고", "원인으로 단정하지 않기"],
  },
  {
    id: "missing",
    topic: "preprocessing",
    title: "결측치 처리",
    summary: "비어 있는 값은 삭제, 대체, 제외 중 상황에 맞게 처리합니다.",
    why: "결측치가 많거나 특정 그룹에 몰려 있으면 결과 해석이 달라질 수 있습니다.",
    example: "나이 결측치가 적으면 중앙값 대체, 너무 많으면 컬럼 제외를 고민합니다.",
    checklist: ["개수와 비율 확인", "패턴 확인", "삭제/대체/제외 선택"],
  },
  {
    id: "outlier",
    topic: "preprocessing",
    title: "이상치 처리",
    summary: "극단값이 오류인지 의미 있는 신호인지 문제 맥락으로 판단합니다.",
    why: "이상치를 무조건 제거하면 중요한 사례를 잃을 수 있고, 그대로 두면 모델이 왜곡될 수 있습니다.",
    example: "VIP 고객의 매우 큰 구매액은 이상치처럼 보여도 중요한 신호일 수 있습니다.",
    checklist: ["현실 가능성 확인", "분포에서 위치 확인", "처리 이유 기록"],
  },
  {
    id: "encoding",
    topic: "preprocessing",
    title: "인코딩",
    summary: "문자 범주를 모델이 계산할 수 있는 숫자 형태로 변환합니다.",
    why: "지역, 성별, 결제 방식 같은 값은 그대로 계산하기 어렵기 때문에 변환이 필요합니다.",
    example: "지역처럼 순서가 없는 값은 원-핫 인코딩을 고려할 수 있습니다.",
    checklist: ["범주형 확인", "순서 유무 확인", "적절한 인코딩 선택"],
  },
  {
    id: "scaling",
    topic: "preprocessing",
    title: "정규화와 스케일링",
    summary: "단위 차이가 큰 숫자 변수는 비슷한 범위로 맞춥니다.",
    why: "KNN처럼 거리 기반 모델은 큰 단위의 변수가 과하게 영향을 줄 수 있습니다.",
    example: "나이와 연봉을 함께 쓰면 연봉 값이 너무 커서 거리 계산을 지배할 수 있습니다.",
    checklist: ["숫자 범위 비교", "거리 기반 모델 여부 확인", "스케일링 적용"],
  },
  {
    id: "split",
    topic: "modeling",
    title: "학습 데이터와 평가 데이터",
    summary: "모델이 외운 것인지 새 데이터에도 통하는지 확인하려면 데이터를 나눠야 합니다.",
    why: "학습 데이터 점수만 보면 실제 성능을 과대평가할 수 있습니다.",
    example: "80%는 학습, 20%는 평가에 사용해 새 데이터 성능을 확인합니다.",
    checklist: ["목표 컬럼 분리", "학습/평가 분리", "평가 점수 확인"],
  },
  {
    id: "decision-tree",
    topic: "modeling",
    title: "의사결정나무",
    summary: "조건을 나누며 예측하는 직관적인 모델입니다.",
    why: "초보자가 모델의 판단 흐름을 이해하기 쉽고 변수 중요도 확인에도 연결됩니다.",
    example: "이용 기간이 짧고 문의 횟수가 많으면 이탈 가능성이 높다고 나눌 수 있습니다.",
    checklist: ["분류/예측 목표 확인", "과적합 주의", "중요 변수 확인"],
  },
  {
    id: "random-forest",
    topic: "modeling",
    title: "랜덤포레스트",
    summary: "여러 의사결정나무를 모아 더 안정적인 예측을 만듭니다.",
    why: "단일 나무보다 한 데이터 패턴에 과하게 맞춰지는 문제를 줄이는 데 도움이 됩니다.",
    example: "여러 나무의 예측을 모아 최종 결과를 결정합니다.",
    checklist: ["단일 모델과 비교", "성능 변화 확인", "중요 변수 해석"],
  },
  {
    id: "knn",
    topic: "modeling",
    title: "KNN",
    summary: "가까운 이웃 데이터의 답을 참고해 예측합니다.",
    why: "거리 계산을 사용하므로 스케일링과 이상치 영향을 함께 생각해야 합니다.",
    example: "비슷한 고객들의 이탈 여부를 참고해 새 고객의 이탈 가능성을 예측합니다.",
    checklist: ["거리 기반 이해", "스케일링 확인", "이웃 수 영향 생각"],
  },
  {
    id: "deep-learning",
    topic: "modeling",
    title: "딥러닝 기초",
    summary: "여러 층의 계산으로 복잡한 패턴을 학습하는 방식입니다.",
    why: "Basic 수준에서는 수식보다 입력, 학습, 평가, 개선 흐름을 이해하는 것이 우선입니다.",
    example: "정형 데이터에서도 딥러닝을 사용할 수 있지만 항상 가장 좋은 선택은 아닙니다.",
    checklist: ["입력 데이터 준비", "학습/평가 구분", "다른 모델과 비교"],
  },
  {
    id: "accuracy",
    topic: "evaluation",
    title: "성능 지표",
    summary: "정확도 같은 지표로 모델이 얼마나 맞혔는지 확인합니다.",
    why: "점수 하나만 보지 말고 문제 목표와 오답 유형을 함께 봐야 합니다.",
    example: "불합격 예측에서 전체 정확도는 높아도 특정 그룹을 계속 틀릴 수 있습니다.",
    checklist: ["정확도 확인", "오답 유형 확인", "목표에 맞는 지표인지 판단"],
  },
  {
    id: "feature-importance",
    topic: "evaluation",
    title: "변수 중요도",
    summary: "예측에 큰 영향을 준 컬럼을 확인해 해석과 개선에 활용합니다.",
    why: "중요도가 높은 변수가 데이터 오류라면 모델 결과도 믿기 어렵습니다.",
    example: "이탈 예측에서 문의 횟수가 높게 나오면 고객 불만과 관련된 해석을 생각할 수 있습니다.",
    checklist: ["상위 변수 확인", "상식과 비교", "개선 실험 계획"],
  },
  {
    id: "improvement",
    topic: "evaluation",
    title: "성능 개선 실험",
    summary: "성능이 낮으면 전처리, 변수, 모델을 순서 있게 바꿔 비교합니다.",
    why: "한 번에 많이 바꾸면 무엇 때문에 좋아졌는지 알기 어렵습니다.",
    example: "결측치 처리 변경 후 점수 비교, 다음에는 모델 변경처럼 한 단계씩 봅니다.",
    checklist: ["한 번에 하나씩 변경", "점수 기록", "약점 주제 확인"],
  },
  {
    id: "aidu-flow",
    topic: "aidu",
    title: "AIDU 사고 흐름",
    summary: "문제 이해, 데이터 확인, 전처리, 모델링, 평가, 개선 순서로 생각합니다.",
    why: "AIDU는 도구이지만 시험에서 필요한 것은 버튼보다 판단 순서입니다.",
    example: "모델 성능이 낮을 때 무작정 다른 모델을 누르기보다 데이터 품질부터 다시 봅니다.",
    checklist: ["문제 목표", "데이터 품질", "전처리", "평가와 개선"],
  },
];

studyCards.push(
  {
    id: "target-leakage",
    topic: "preprocessing",
    title: "데이터 누수 주의",
    summary: "정답을 알려주는 컬럼이 입력에 섞이면 실제 성능을 착각할 수 있습니다.",
    why: "평가 점수가 높아도 실제 시험이나 새 데이터에서 통하지 않을 수 있으므로 목표 컬럼과 입력 컬럼을 구분해야 합니다.",
    example: "이탈 여부를 예측하는데 '해지일' 같은 사후 정보가 입력에 들어가면 데이터 누수일 수 있습니다.",
    checklist: ["목표 컬럼 확인", "사후 정보 제거", "평가 점수 과대평가 주의"],
  },
  {
    id: "model-compare",
    topic: "evaluation",
    title: "모델 비교",
    summary: "같은 평가 데이터와 같은 기준으로 모델을 비교해야 의미가 있습니다.",
    why: "조건이 다르면 어떤 모델이 더 나은지 판단하기 어렵습니다.",
    example: "의사결정나무와 랜덤포레스트를 같은 평가 데이터로 비교해야 공정합니다.",
    checklist: ["같은 평가 데이터", "같은 지표", "결과 기록"],
  },
  {
    id: "error-analysis",
    topic: "evaluation",
    title: "오답 패턴 분석",
    summary: "전체 점수보다 어떤 유형에서 계속 틀리는지 확인하는 것이 더 중요할 때가 많습니다.",
    why: "약한 주제를 알아야 다음 복습이 구체적으로 정해집니다.",
    example: "전처리 문제를 계속 틀리면 결측치, 이상치, 인코딩을 다시 묶어서 복습합니다.",
    checklist: ["오답 주제 기록", "반복 오류 확인", "관련 카드 복습"],
  },
  {
    id: "aice-final-check",
    topic: "aidu",
    title: "시험 전 최종 확인",
    summary: "시험 세부 정보는 바뀔 수 있으므로 공식 페이지를 마지막에 다시 확인합니다.",
    why: "앱은 학습 보조 도구이고, 접수/시험 방식/세부 기준은 공식 안내가 기준입니다.",
    example: "시험 전날에는 공식 AICE Basic 페이지에서 문항 수, 시간, 도구 안내를 다시 봅니다.",
    checklist: ["공식 페이지 확인", "AIDU 흐름 복습", "약점 문제 재풀이"],
  },
);

const questionBank = [
  q("q1", "eda", "기초", "scope-doc", "새 정형 데이터셋을 받았을 때 가장 먼저 확인할 내용은 무엇일까요?", ["모델부터 학습한다", "행과 열, 컬럼 의미, 데이터 타입을 확인한다", "정답률만 기록한다", "변수 중요도부터 본다"], 1, "데이터의 구조와 타입을 먼저 알아야 전처리와 모델 선택이 의미 있어집니다.", "데이터 모양 → 목표 컬럼 → 타입 순서로 확인합니다."),
  q("q2", "eda", "기초", "scope-doc", "데이터 타입 확인이 중요한 이유는 무엇일까요?", ["숫자형과 범주형에 따라 처리 방법이 달라지기 때문", "시험 시간을 늘리기 위해", "모델 이름을 바꾸기 위해", "점수를 자동으로 올리기 위해"], 0, "숫자형은 분포와 스케일, 범주형은 인코딩처럼 필요한 처리가 다릅니다.", "타입을 보고 다음 처리 후보를 좁힙니다."),
  q("q3", "eda", "보통", "scope-doc", "산점도가 특히 도움이 되는 상황은 무엇일까요?", ["두 숫자형 변수의 관계를 볼 때", "문자 범주를 숫자로 바꿀 때", "타이머를 설정할 때", "결측치를 평균으로 채울 때"], 0, "산점도는 두 숫자형 변수 사이의 패턴이나 이상치를 눈으로 확인하는 데 좋습니다.", "시각화는 전처리 판단의 근거가 됩니다."),
  q("q4", "eda", "보통", "scope-doc", "상관관계를 해석할 때 조심할 점은 무엇일까요?", ["상관이 있으면 항상 원인이다", "상관은 관계의 힌트일 뿐 원인을 증명하지 않는다", "상관은 범주형에만 쓴다", "상관은 모델 평가 후에는 필요 없다"], 1, "상관관계는 함께 움직이는 경향을 보여주지만 원인과 결과를 확정하지는 않습니다.", "상관은 힌트로 쓰고 문제 맥락과 함께 봅니다."),
  q("q5", "preprocessing", "기초", "scope-doc", "결측치를 발견했을 때 가장 먼저 할 일은 무엇일까요?", ["무조건 모든 행을 삭제한다", "결측치 개수와 비율, 패턴을 확인한다", "랜덤포레스트를 실행한다", "정답 컬럼을 지운다"], 1, "결측치가 얼마나 있고 어디에 몰려 있는지 알아야 삭제나 대체를 선택할 수 있습니다.", "개수 → 비율 → 패턴 → 처리 방법 순서가 좋습니다."),
  q("q6", "preprocessing", "보통", "scope-doc", "나이가 999로 들어간 값은 어떤 관점으로 봐야 할까요?", ["반드시 우수한 데이터다", "입력 오류나 이상치일 수 있다", "항상 평균값이다", "인코딩이 끝난 값이다"], 1, "현실적으로 불가능한 값은 입력 오류 또는 이상치일 수 있어 확인이 필요합니다.", "이상치는 문제 맥락으로 유지/수정/제거를 판단합니다."),
  q("q7", "preprocessing", "기초", "scope-doc", "지역, 결제 방식처럼 문자로 된 범주형 변수를 모델에 넣기 전 필요한 처리는 무엇일까요?", ["정규화", "인코딩", "타이머", "상관계수"], 1, "범주형 문자는 모델이 계산할 수 있도록 숫자 형태로 바꿔야 합니다.", "문자 범주 → 숫자 표현으로 바꾸는 단계입니다."),
  q("q8", "preprocessing", "보통", "scope-doc", "순서가 없는 범주형 데이터에 적합한 인코딩 후보는 무엇일까요?", ["원-핫 인코딩", "시험 시간 단축", "평가 데이터 삭제", "정확도 반올림"], 0, "지역처럼 순서가 없는 범주는 원-핫 인코딩을 고려할 수 있습니다.", "범주 사이에 가짜 순서를 만들지 않는 것이 중요합니다."),
  q("q9", "preprocessing", "기초", "scope-doc", "KNN 전에 스케일링을 고려하는 이유는 무엇일까요?", ["KNN은 거리 계산을 사용하기 때문", "KNN은 문자만 처리하기 때문", "스케일링이 항상 정답을 알려주기 때문", "평가를 생략하기 위해"], 0, "거리 기반 모델은 값의 단위 차이가 크면 특정 변수가 과하게 영향을 줄 수 있습니다.", "모델 특성에 따라 전처리 필요성이 달라집니다."),
  q("q10", "preprocessing", "보통", "scope-doc", "이상치를 무조건 제거하면 생길 수 있는 문제는 무엇일까요?", ["중요한 실제 사례를 잃을 수 있다", "데이터 타입이 자동으로 바뀐다", "시험 시간이 늘어난다", "모델이 실행되지 않는다"], 0, "극단값이 오류가 아니라 의미 있는 사례일 수도 있으므로 맥락 판단이 필요합니다.", "처리 이유를 기록하며 비교하는 습관이 좋습니다."),
  q("q11", "modeling", "기초", "scope-doc", "학습 데이터와 평가 데이터를 나누는 이유는 무엇일까요?", ["새 데이터에서도 잘 맞는지 확인하기 위해", "컬럼 이름을 숨기기 위해", "결측치를 만들기 위해", "정답을 외우기 위해"], 0, "학습에 쓰지 않은 데이터로 평가해야 모델이 외운 것인지 확인할 수 있습니다.", "학습 점수와 평가 점수를 구분해서 봅니다."),
  q("q12", "modeling", "기초", "scope-doc", "의사결정나무의 설명으로 가장 알맞은 것은 무엇일까요?", ["조건을 나누며 예측하는 모델", "항상 딥러닝보다 복잡한 모델", "문자를 그대로 계산하는 표", "결측치만 찾는 도구"], 0, "의사결정나무는 조건을 따라 데이터를 나누며 예측하는 직관적 모델입니다.", "판단 흐름을 이해하기 쉬운 모델입니다."),
  q("q13", "modeling", "보통", "scope-doc", "랜덤포레스트가 단일 의사결정나무보다 안정적일 수 있는 이유는 무엇일까요?", ["여러 나무의 예측을 함께 사용하기 때문", "데이터를 보지 않기 때문", "평가를 하지 않기 때문", "항상 100점을 만들기 때문"], 0, "여러 나무를 모으면 한 모델이 특정 데이터에 과하게 맞춰지는 문제를 줄일 수 있습니다.", "단일 모델과 앙상블 모델의 차이를 생각합니다."),
  q("q14", "modeling", "보통", "scope-doc", "KNN 모델을 사용할 때 같이 점검하면 좋은 전처리는 무엇일까요?", ["스케일링", "시험 접수", "결과 삭제", "문항 번호 변경"], 0, "KNN은 거리 기반이므로 숫자 범위 차이가 성능에 영향을 줄 수 있습니다.", "모델 특성 → 필요한 전처리 순서로 연결합니다."),
  q("q15", "modeling", "기초", "scope-doc", "딥러닝 기초에서 Basic 학습자가 우선 이해할 흐름은 무엇일까요?", ["입력, 학습, 평가, 개선 흐름", "수식 전체 암기", "브라우저 설치", "결제 방식"], 0, "Basic에서는 복잡한 수식보다 데이터가 모델을 거쳐 평가되는 전체 흐름이 중요합니다.", "모델 종류보다 실험 흐름을 먼저 잡습니다."),
  q("q16", "modeling", "보통", "scope-doc", "모델을 바꾸기 전 먼저 생각할 질문으로 적절한 것은 무엇일까요?", ["데이터 품질과 전처리는 적절했는가?", "버튼 색이 충분히 화려한가?", "공식 페이지를 닫았는가?", "정답을 이미 외웠는가?"], 0, "성능이 낮다고 바로 모델만 바꾸기보다 데이터와 전처리 문제를 먼저 확인해야 합니다.", "성능 개선은 원인 추정에서 시작합니다."),
  q("q17", "evaluation", "기초", "scope-doc", "모델 성능 평가에서 확인해야 할 것은 무엇일까요?", ["점수와 약점, 문제 목적에 맞는지", "파일 이름 길이", "화면 배경색", "브라우저 탭 개수"], 0, "점수뿐 아니라 어떤 부분에서 틀렸는지와 문제 목적에 맞는지도 봐야 합니다.", "평가는 숫자 확인이 아니라 해석 과정입니다."),
  q("q18", "evaluation", "보통", "scope-doc", "변수 중요도를 보는 이유는 무엇일까요?", ["예측에 큰 영향을 준 변수를 파악하기 위해", "정답을 삭제하기 위해", "타이머를 멈추기 위해", "범주를 숨기기 위해"], 0, "변수 중요도는 모델 해석과 개선 방향을 찾는 데 도움을 줍니다.", "중요도가 높은 변수가 상식과 맞는지 확인합니다."),
  q("q19", "evaluation", "보통", "scope-doc", "성능 개선 실험에서 좋은 태도는 무엇일까요?", ["한 번에 하나씩 바꾸고 결과를 비교한다", "모든 설정을 동시에 바꾼다", "점수를 기록하지 않는다", "오답 주제를 숨긴다"], 0, "한 번에 하나씩 바꿔야 어떤 변경이 효과가 있었는지 알 수 있습니다.", "전처리 변경, 변수 변경, 모델 변경을 순서 있게 비교합니다."),
  q("q20", "evaluation", "기초", "scope-doc", "정확도가 높아도 추가로 확인할 점은 무엇일까요?", ["특정 그룹이나 주제에서 계속 틀리는지", "버튼 크기만 충분한지", "문항 번호가 예쁜지", "공식 링크 색상"], 0, "전체 점수가 높아도 특정 유형에서 약할 수 있으므로 오답 패턴을 봐야 합니다.", "점수와 약점 분석을 함께 봅니다."),
  q("q21", "aidu", "기초", "scope-doc", "AIDU 흐름 연습에서 가장 먼저 해야 할 일은 무엇일까요?", ["문제 목표를 이해한다", "모델만 계속 바꾼다", "결과 화면을 닫는다", "정답률을 숨긴다"], 0, "문제 목표를 알아야 어떤 컬럼이 목표인지, 어떤 평가가 필요한지 판단할 수 있습니다.", "문제 이해가 모든 단계의 출발점입니다."),
  q("q22", "aidu", "보통", "scope-doc", "AIDU에서 성능이 낮게 나왔을 때 좋은 다음 행동은 무엇일까요?", ["데이터 품질, 전처리, 모델 선택을 차례로 점검한다", "무조건 딥러닝만 사용한다", "평가 결과를 무시한다", "모든 컬럼을 삭제한다"], 0, "성능 개선은 원인을 하나씩 확인하며 실험하는 과정입니다.", "품질 → 전처리 → 모델 → 평가 순서로 돌아봅니다."),
  q("q23", "aidu", "기초", "official-basic", "AICE Basic 준비 앱이 실제 AIDU를 대체한다고 보면 될까요?", ["아니다. 사고 흐름을 연습하는 보조 도구로 봐야 한다", "그렇다. AIDU 접속이 필요 없다", "그렇다. 공식 시험을 대신한다", "정답만 외우면 된다"], 0, "이 앱은 AIDU 실습 전후의 판단 과정을 훈련하는 용도입니다.", "공식 도구와 시험 정보는 반드시 별도로 확인해야 합니다."),
  q("q24", "eda", "심화", "scope-doc", "데이터 분포가 한쪽으로 심하게 치우쳐 있을 때 왜 확인이 필요할까요?", ["평균만 보면 실제 데이터 모양을 오해할 수 있기 때문", "범주형이 자동 삭제되기 때문", "모델 평가가 필요 없어지기 때문", "모든 값이 결측치가 되기 때문"], 0, "치우친 분포에서는 평균보다 중앙값, 분포, 이상치 확인이 더 중요할 수 있습니다.", "분포를 보고 요약 지표를 해석합니다."),
  q("q25", "preprocessing", "심화", "scope-doc", "결측치가 특정 그룹에만 많이 몰려 있다면 무엇을 조심해야 할까요?", ["대체나 삭제가 특정 그룹을 왜곡할 수 있다", "항상 정답률이 100%가 된다", "모델 선택이 필요 없어진다", "모든 범주형이 숫자형이 된다"], 0, "결측 패턴이 특정 집단과 관련되면 단순 처리로 편향이 생길 수 있습니다.", "결측치의 양뿐 아니라 패턴도 봐야 합니다."),
  q("q26", "modeling", "심화", "scope-doc", "평가 점수는 낮고 학습 점수만 높다면 어떤 가능성을 생각할 수 있을까요?", ["과적합 가능성", "완벽한 일반화", "결측치가 전혀 없음", "문자열 인코딩 완료"], 0, "학습 데이터에만 너무 잘 맞고 새 데이터에 약하면 과적합을 의심할 수 있습니다.", "학습 점수와 평가 점수 차이를 비교합니다."),
  q("q27", "evaluation", "심화", "scope-doc", "변수 중요도 상위 컬럼이 ID라면 어떤 판단이 필요할까요?", ["의미 없는 식별자가 모델에 영향을 줬는지 확인한다", "ID가 항상 최고의 변수라고 결론낸다", "평가를 멈춘다", "모든 컬럼을 ID로 바꾼다"], 0, "식별자처럼 일반화에 도움 되지 않는 컬럼이 중요하게 나오면 데이터 누수나 과적합을 의심할 수 있습니다.", "중요 변수는 상식과 문제 목표로 검토합니다."),
  q("q28", "aidu", "보통", "scope-doc", "AIDU 체크리스트에서 '개선 시도 기록'이 중요한 이유는 무엇일까요?", ["무엇을 바꿨을 때 성능이 변했는지 알기 위해", "버튼 위치를 기억하기 위해", "문제를 숨기기 위해", "시험 시간을 늘리기 위해"], 0, "실험 기록이 있어야 다음 시도에서 같은 실수를 줄이고 효과를 비교할 수 있습니다.", "변경점과 결과를 같이 남기는 습관이 중요합니다."),
  q("q29", "eda", "기초", "scope-doc", "목표 컬럼을 확인하는 이유는 무엇일까요?", ["무엇을 예측하거나 분류할지 알아야 하기 때문", "모든 컬럼을 지우기 위해", "데이터 타입을 숨기기 위해", "정답을 무작위로 만들기 위해"], 0, "목표 컬럼을 알아야 입력 변수와 정답을 구분하고 모델링 방향을 정할 수 있습니다.", "문제 목표와 목표 컬럼은 함께 확인합니다."),
  q("q30", "preprocessing", "보통", "scope-doc", "숫자형 컬럼인데 코드처럼 쓰이는 값은 어떻게 봐야 할까요?", ["숫자처럼 보여도 범주형일 수 있다", "반드시 평균을 낸다", "반드시 정규화한다", "항상 삭제한다"], 0, "우편번호나 상품 코드처럼 숫자 형태지만 계산 의미가 없는 값은 범주형으로 다뤄야 할 수 있습니다.", "데이터 타입은 형식뿐 아니라 의미로도 판단합니다."),
  q("q31", "modeling", "보통", "scope-doc", "분류 문제와 예측 문제를 구분하는 기준은 무엇일까요?", ["목표가 범주인지 숫자값인지", "버튼 개수", "파일 이름", "브라우저 종류"], 0, "합격/불합격처럼 범주를 맞히면 분류, 가격처럼 숫자를 맞히면 예측 문제로 볼 수 있습니다.", "문제 목표가 모델 선택의 출발점입니다."),
  q("q32", "evaluation", "보통", "scope-doc", "모델 비교를 할 때 공정하게 보려면 무엇이 필요할까요?", ["같은 평가 기준과 같은 평가 데이터", "다른 문제 목표", "무작위 버튼 색", "결과 삭제"], 0, "비교 조건이 달라지면 어떤 모델이 더 나은지 판단하기 어렵습니다.", "동일한 기준으로 비교해야 의미가 있습니다."),
];

questionBank.push(
  q("q33", "eda", "기초", "scope-doc", "정형 데이터에서 '행'이 보통 의미하는 것은 무엇일까요?", ["한 개의 관측 대상 또는 사례", "모델의 최종 점수", "AIDU 버튼 이름", "시험 제한 시간"], 0, "정형 데이터에서 행은 고객 한 명, 주택 한 건처럼 하나의 관측 사례를 뜻하는 경우가 많습니다.", "행은 사례, 열은 속성으로 이해하면 쉽습니다."),
  q("q34", "eda", "기초", "scope-doc", "정형 데이터에서 '열'이 보통 의미하는 것은 무엇일까요?", ["데이터의 속성 또는 변수", "모의고사 번호", "브라우저 창", "결제 수단"], 0, "열은 나이, 가격, 지역처럼 각 사례를 설명하는 속성입니다.", "열의 의미를 알아야 입력 변수와 목표 변수를 나눌 수 있습니다."),
  q("q35", "eda", "보통", "scope-doc", "중복 행이 많을 때 먼저 생각할 점은 무엇일까요?", ["같은 사례가 반복되어 결과가 왜곡될 수 있다", "항상 성능이 정확해진다", "모델 선택이 필요 없어진다", "범주형 변수가 사라진다"], 0, "중복 데이터가 많으면 특정 사례가 과하게 반영될 수 있어 확인이 필요합니다.", "데이터 품질 점검에는 중복 확인도 포함됩니다."),
  q("q36", "eda", "보통", "scope-doc", "평균만 보고 데이터 전체를 판단하면 위험한 이유는 무엇일까요?", ["분포와 이상치를 놓칠 수 있기 때문", "평균은 숫자가 아니기 때문", "평균은 범주형에만 쓰기 때문", "평균은 AIDU에서 금지되기 때문"], 0, "평균은 한 숫자로 요약하지만 데이터가 치우쳐 있거나 이상치가 있으면 오해할 수 있습니다.", "평균, 중앙값, 분포를 함께 보는 습관이 좋습니다."),
  q("q37", "preprocessing", "기초", "scope-doc", "목표 컬럼을 전처리할 때 특히 조심해야 하는 이유는 무엇일까요?", ["정답 자체를 입력 변수처럼 사용하면 데이터 누수가 생길 수 있기 때문", "목표 컬럼은 항상 삭제해야 하기 때문", "목표 컬럼은 문자만 가능하기 때문", "목표 컬럼은 시각화할 수 없기 때문"], 0, "정답 정보를 입력 변수에 섞으면 평가 점수가 비정상적으로 높게 나올 수 있습니다.", "목표 컬럼과 입력 컬럼은 분명히 구분합니다."),
  q("q38", "preprocessing", "보통", "scope-doc", "우편번호처럼 숫자로 보이지만 계산 의미가 약한 값은 어떻게 볼 수 있을까요?", ["범주형 변수로 볼 수 있다", "반드시 평균을 낸다", "반드시 정답 컬럼이다", "항상 이상치다"], 0, "숫자 형태라도 크고 작음의 계산 의미가 없으면 범주형으로 다루는 것이 자연스러울 수 있습니다.", "데이터 타입은 모양보다 의미를 함께 봅니다."),
  q("q39", "preprocessing", "보통", "scope-doc", "평균 대체보다 중앙값 대체가 더 나을 수 있는 상황은 무엇일까요?", ["이상치 때문에 평균이 크게 흔들릴 때", "범주형 변수를 인코딩할 때", "모델을 비교할 때", "공식 페이지를 확인할 때"], 0, "이상치가 있으면 평균이 왜곡될 수 있어 중앙값이 더 안정적일 때가 있습니다.", "결측치 대체값도 분포를 보고 선택합니다."),
  q("q40", "preprocessing", "심화", "scope-doc", "데이터 누수의 예로 가장 가까운 것은 무엇일까요?", ["이탈 예측에서 해지일 컬럼을 입력 변수로 사용한다", "나이 결측치를 중앙값으로 채운다", "지역을 원-핫 인코딩한다", "학습 데이터와 평가 데이터를 나눈다"], 0, "해지일은 이탈 이후에 알 수 있는 정보라 실제 예측 시점에는 사용할 수 없을 가능성이 큽니다.", "예측 시점에 알 수 없는 정보가 들어가면 누수를 의심합니다."),
  q("q41", "modeling", "기초", "scope-doc", "분류 문제의 예로 알맞은 것은 무엇일까요?", ["합격/불합격을 맞힌다", "집값 숫자를 예측한다", "매출액을 예측한다", "온도를 예측한다"], 0, "분류는 정해진 범주 중 하나를 맞히는 문제입니다.", "목표가 범주인지 숫자인지 먼저 봅니다."),
  q("q42", "modeling", "기초", "scope-doc", "회귀 또는 수치 예측 문제의 예로 알맞은 것은 무엇일까요?", ["주택 가격을 예측한다", "이탈/유지를 분류한다", "합격/불합격을 맞힌다", "스팸/정상을 구분한다"], 0, "가격처럼 연속적인 숫자값을 예측하면 회귀 또는 수치 예측 문제에 가깝습니다.", "목표값의 형태가 문제 유형을 결정합니다."),
  q("q43", "modeling", "보통", "scope-doc", "의사결정나무가 너무 복잡하면 생길 수 있는 문제는 무엇일까요?", ["학습 데이터에 과하게 맞는 과적합", "모든 결측치가 자동 해결됨", "범주형 변수가 사라짐", "평가가 필요 없어짐"], 0, "나무가 너무 세부적으로 나뉘면 학습 데이터에는 잘 맞지만 새 데이터에 약할 수 있습니다.", "복잡도와 평가 성능을 함께 봅니다."),
  q("q44", "modeling", "보통", "scope-doc", "랜덤포레스트 결과를 해석할 때 함께 보면 좋은 것은 무엇일까요?", ["변수 중요도", "브라우저 확대율", "파일 확장자", "시험 접수일"], 0, "랜덤포레스트는 변수 중요도를 통해 어떤 컬럼이 예측에 영향을 줬는지 확인할 수 있습니다.", "모델 성능과 해석을 함께 봅니다."),
  q("q45", "modeling", "심화", "scope-doc", "학습 점수 98%, 평가 점수 62%라면 어떤 가능성이 클까요?", ["과적합", "완벽한 일반화", "데이터 타입 오류가 없음", "문제가 너무 쉬움"], 0, "학습 점수만 높고 평가 점수가 낮으면 학습 데이터에만 과하게 맞았을 가능성이 있습니다.", "학습/평가 점수 차이를 확인합니다."),
  q("q46", "evaluation", "기초", "scope-doc", "모의고사 결과에서 주제별 정답 수를 보는 이유는 무엇일까요?", ["어떤 범위가 약한지 찾기 위해", "버튼을 꾸미기 위해", "공식 링크를 숨기기 위해", "타이머를 멈추기 위해"], 0, "주제별 결과를 보면 다음 복습 대상을 구체적으로 정할 수 있습니다.", "점수 다음에는 약점 주제를 확인합니다."),
  q("q47", "evaluation", "보통", "scope-doc", "변수 중요도 상위에 ID 컬럼이 나오면 무엇을 의심할 수 있을까요?", ["일반화에 도움 되지 않는 식별자가 영향을 줬을 수 있다", "ID가 항상 최고의 예측 변수다", "평가가 끝났으니 더 볼 필요 없다", "모든 컬럼을 ID로 바꿔야 한다"], 0, "ID처럼 식별 목적의 컬럼은 실제 패턴보다 우연한 구분을 만들 수 있어 조심해야 합니다.", "중요 변수는 문제 맥락과 상식으로 검토합니다."),
  q("q48", "evaluation", "보통", "scope-doc", "모델 A와 B를 비교할 때 가장 피해야 할 것은 무엇일까요?", ["서로 다른 평가 데이터로 점수를 비교한다", "같은 지표를 사용한다", "결과를 기록한다", "문제 목표를 확인한다"], 0, "평가 데이터가 다르면 점수 차이가 모델 때문인지 데이터 때문인지 알기 어렵습니다.", "비교 조건을 맞추는 것이 핵심입니다."),
  q("q49", "evaluation", "심화", "scope-doc", "성능 개선 후 점수가 올랐을 때 바로 결론내리기 전에 확인할 점은 무엇일까요?", ["같은 평가 조건에서 비교했는지", "버튼 색이 바뀌었는지", "문제 번호가 줄었는지", "브라우저가 최신인지"], 0, "평가 조건이 바뀌었다면 점수 상승의 의미가 약해질 수 있습니다.", "실험 기록과 비교 조건을 함께 확인합니다."),
  q("q50", "aidu", "기초", "scope-doc", "AIDU 흐름에서 전처리 전에 해야 할 일로 가장 적절한 것은 무엇일까요?", ["데이터 컬럼과 품질을 확인한다", "결과 점수를 확정한다", "모든 모델을 실행한다", "해설을 숨긴다"], 0, "데이터 상태를 알아야 어떤 전처리가 필요한지 판단할 수 있습니다.", "확인 없이 전처리하면 문제와 맞지 않는 처리를 할 수 있습니다."),
  q("q51", "aidu", "보통", "scope-doc", "AIDU에서 모델 성능을 개선할 때 좋은 기록 방식은 무엇일까요?", ["바꾼 것과 점수 변화를 함께 적는다", "점수만 보고 기록하지 않는다", "모든 시도를 한 줄로 합친다", "오답 주제를 삭제한다"], 0, "변경점과 결과를 함께 기록해야 다음 시도에서 무엇이 효과적이었는지 알 수 있습니다.", "실험 기록은 성능 개선의 지도 역할을 합니다."),
  q("q52", "aidu", "보통", "scope-doc", "AIDU 실습 중 '먼저 문제 목표를 확인한다'는 말의 의미는 무엇일까요?", ["무엇을 예측하거나 분류할지 확인한다", "버튼 위치를 외운다", "공식 사이트 색을 확인한다", "타이머를 멈춘다"], 0, "문제 목표가 정해져야 목표 컬럼, 입력 컬럼, 평가 방향이 결정됩니다.", "목표 이해가 데이터 분석의 시작입니다."),
  q("q53", "eda", "심화", "scope-doc", "상관이 높은 두 입력 변수가 있을 때 할 수 있는 생각으로 적절한 것은 무엇일까요?", ["비슷한 정보를 중복해서 담고 있을 수 있다", "둘 중 하나는 반드시 정답 컬럼이다", "두 변수는 삭제하면 안 된다", "상관은 항상 나쁜 것이다"], 0, "서로 강하게 연결된 변수는 비슷한 정보를 담을 수 있어 해석과 변수 선택에서 참고합니다.", "상관은 좋고 나쁨보다 해석의 힌트입니다."),
  q("q54", "preprocessing", "심화", "scope-doc", "범주가 너무 많은 컬럼을 원-핫 인코딩할 때 생길 수 있는 문제는 무엇일까요?", ["열이 너무 많이 늘어날 수 있다", "모든 값이 평균이 된다", "모델 평가가 불가능해진다", "정답 컬럼이 사라진다"], 0, "범주 수가 많으면 원-핫 인코딩 후 컬럼이 크게 늘어날 수 있습니다.", "범주 수와 모델 입력 크기를 함께 생각합니다."),
  q("q55", "modeling", "심화", "scope-doc", "모델 선택에서 '항상 가장 복잡한 모델이 좋다'는 말이 위험한 이유는 무엇일까요?", ["문제와 데이터에 따라 단순한 모델이 더 잘 맞을 수 있다", "복잡한 모델은 실행되지 않기 때문", "단순한 모델은 평가할 수 없기 때문", "복잡한 모델은 전처리가 필요 없기 때문"], 0, "좋은 모델은 복잡도보다 문제와 데이터에 맞는지가 중요합니다.", "여러 모델을 같은 기준으로 비교합니다."),
  q("q56", "evaluation", "심화", "scope-doc", "약점 분석 후 가장 좋은 다음 행동은 무엇일까요?", ["약한 주제의 개념 카드와 관련 문제를 다시 푼다", "틀린 기록을 모두 삭제한다", "정답률만 높게 보이게 만든다", "공식 정보 확인을 생략한다"], 0, "약점 분석은 다음 복습 행동으로 이어질 때 의미가 있습니다.", "오답 → 개념 복습 → 유사 문제 풀이 흐름을 만듭니다."),
);

questionBank.push(
  q("q57", "eda", "기초", "scope-doc", "데이터를 처음 열었을 때 컬럼 설명을 확인하는 이유는 무엇일까요?", ["컬럼 이름만으로 의미를 오해할 수 있기 때문", "모델을 자동으로 고르기 위해", "정답률을 숨기기 위해", "시험 시간을 줄이기 위해"], 0, "컬럼 이름이 짧거나 약어일 수 있어 실제 의미를 확인해야 전처리와 해석을 제대로 할 수 있습니다.", "컬럼 의미 확인은 데이터 이해의 첫 단계입니다."),
  q("q58", "eda", "보통", "scope-doc", "범주형 변수의 값 종류가 너무 많을 때 먼저 확인할 것은 무엇일까요?", ["각 범주의 개수와 희귀 범주 여부", "학습 점수만", "타이머 위치", "정답 컬럼 삭제 여부"], 0, "범주가 너무 많거나 일부 범주가 매우 적으면 인코딩과 모델 성능에 영향을 줄 수 있습니다.", "범주 수와 빈도를 함께 봅니다."),
  q("q59", "eda", "보통", "scope-doc", "목표값의 분포가 한쪽으로 심하게 치우쳐 있으면 무엇을 조심해야 할까요?", ["전체 정확도만 보면 성능을 오해할 수 있다", "데이터 타입 확인이 필요 없다", "모든 모델이 100점을 낸다", "전처리가 금지된다"], 0, "목표값이 불균형하면 많이 나온 쪽만 맞혀도 정확도가 높아 보일 수 있습니다.", "목표값 분포는 평가 해석에도 영향을 줍니다."),
  q("q60", "eda", "심화", "scope-doc", "시각화 결과에서 뚜렷한 그룹이 보이면 어떤 생각을 할 수 있을까요?", ["그룹별 특성이 모델에 도움이 될 수 있다", "모든 그룹을 삭제해야 한다", "정답 컬럼이 없다는 뜻이다", "평가가 필요 없다는 뜻이다"], 0, "시각화에서 보이는 그룹은 변수 선택이나 추가 분석의 힌트가 될 수 있습니다.", "패턴을 발견하면 문제 목표와 연결해 봅니다."),
  q("q61", "preprocessing", "기초", "scope-doc", "결측치를 0으로 채우기 전에 확인할 점은 무엇일까요?", ["0이 실제 의미를 갖는 값인지", "버튼 색이 맞는지", "문항 수가 충분한지", "공식 링크가 열리는지"], 0, "0이 실제 값인지, 단순한 대체값인지에 따라 모델이 다르게 해석할 수 있습니다.", "대체값은 의미를 생각하고 선택합니다."),
  q("q62", "preprocessing", "보통", "scope-doc", "범주형 변수에서 오탈자가 있으면 어떤 문제가 생길 수 있을까요?", ["같은 범주가 여러 범주처럼 나뉠 수 있다", "모델 평가가 자동으로 생략된다", "숫자형으로 자동 변환된다", "정답이 항상 첫 번째가 된다"], 0, "예를 들어 Seoul과 seoul이 다른 범주로 처리되면 데이터가 불필요하게 나뉠 수 있습니다.", "범주값 정리도 전처리의 일부입니다."),
  q("q63", "preprocessing", "보통", "scope-doc", "학습 데이터에만 맞춰 전처리 기준을 정해야 하는 이유는 무엇일까요?", ["평가 데이터 정보가 미리 섞이는 것을 막기 위해", "평가 데이터를 삭제하기 위해", "모델을 쓰지 않기 위해", "문제 수를 줄이기 위해"], 0, "평가 데이터의 정보를 전처리 기준에 사용하면 데이터 누수처럼 평가가 과대평가될 수 있습니다.", "평가 데이터는 새 데이터처럼 다룹니다."),
  q("q64", "preprocessing", "심화", "scope-doc", "스케일링 후에도 이상치가 남아 있으면 어떤 문제가 있을 수 있을까요?", ["거리 기반 모델에서 여전히 영향을 크게 줄 수 있다", "모든 범주형이 사라진다", "정답 컬럼이 생성된다", "모의고사 시간이 줄어든다"], 0, "스케일링은 범위를 조정하지만 이상치의 상대적 영향이 완전히 사라지는 것은 아닙니다.", "스케일링과 이상치 점검은 함께 생각합니다."),
  q("q65", "modeling", "기초", "scope-doc", "모델 학습에서 입력 변수와 목표 변수를 나누는 이유는 무엇일까요?", ["무엇으로 무엇을 예측할지 정하기 위해", "버튼을 크게 만들기 위해", "데이터를 숨기기 위해", "평가를 생략하기 위해"], 0, "입력 변수는 설명 재료이고 목표 변수는 맞히려는 답입니다.", "모델링은 입력과 목표를 나누는 것에서 시작합니다."),
  q("q66", "modeling", "보통", "scope-doc", "KNN에서 이웃 수를 너무 작게 잡으면 어떤 일이 생길 수 있을까요?", ["개별 데이터에 민감해질 수 있다", "항상 결측치가 사라진다", "범주형이 자동 인코딩된다", "평가가 필요 없어진다"], 0, "이웃 수가 너무 작으면 가까운 몇 개의 데이터에 지나치게 민감해질 수 있습니다.", "모델 설정도 성능에 영향을 줍니다."),
  q("q67", "modeling", "보통", "scope-doc", "랜덤포레스트와 의사결정나무를 함께 비교하는 이유는 무엇일까요?", ["단일 모델과 여러 모델 조합의 차이를 보기 위해", "둘 중 하나가 항상 0점이기 때문에", "전처리를 생략하기 위해", "목표 컬럼을 바꾸기 위해"], 0, "두 모델을 비교하면 안정성과 해석성의 차이를 느낄 수 있습니다.", "모델 비교는 같은 조건에서 해야 합니다."),
  q("q68", "modeling", "심화", "scope-doc", "모델이 특정 그룹에서만 계속 틀린다면 무엇을 확인하면 좋을까요?", ["그 그룹의 데이터 수, 품질, 전처리 상태", "공식 링크 색상", "브라우저 탭 수", "문항 번호"], 0, "특정 그룹의 데이터가 적거나 품질이 다르면 모델이 약할 수 있습니다.", "오답 패턴을 데이터 특성과 연결합니다."),
  q("q69", "evaluation", "기초", "scope-doc", "정답률 80%라는 결과를 볼 때 함께 확인하면 좋은 것은 무엇일까요?", ["어떤 20%를 틀렸는지", "문제 카드 색상", "오늘 날짜 글꼴", "브라우저 확대 버튼"], 0, "남은 오답 20%가 중요한 유형에 몰려 있을 수 있으므로 오답 내용을 봐야 합니다.", "평가 점수는 오답 분석으로 이어져야 합니다."),
  q("q70", "evaluation", "보통", "scope-doc", "성능이 조금 올랐지만 설명이 어려운 모델이라면 어떤 태도가 좋을까요?", ["성능과 해석 가능성을 함께 고려한다", "무조건 복잡한 모델을 선택한다", "해석은 항상 버린다", "평가 데이터를 바꾼다"], 0, "실무와 시험 사고 모두에서 성능뿐 아니라 왜 그런 결과인지 이해하는 것도 중요합니다.", "모델 선택은 점수와 설명력을 함께 봅니다."),
  q("q71", "evaluation", "보통", "scope-doc", "변수 중요도가 낮은 컬럼을 볼 때 할 수 있는 생각은 무엇일까요?", ["모델에서 영향이 적었을 수 있으나 바로 삭제하기 전 비교가 필요하다", "반드시 정답 컬럼이다", "항상 삭제해도 된다", "오답 원인이 될 수 없다"], 0, "중요도가 낮아도 다른 모델이나 조합에서는 의미가 있을 수 있으므로 실험으로 비교하는 것이 좋습니다.", "변수 삭제도 실험으로 확인합니다."),
  q("q72", "evaluation", "심화", "scope-doc", "모의고사에서 같은 주제를 반복해서 틀린다면 가장 적절한 전략은 무엇일까요?", ["그 주제 카드 복습 후 같은 주제 문제를 다시 푼다", "모의고사 기록을 삭제한다", "다른 주제만 푼다", "공식 정보 확인을 생략한다"], 0, "반복 오답은 약점이 분명하다는 신호이므로 주제 단위 복습이 효과적입니다.", "약점 → 카드 → 유사 문제 순서로 복습합니다."),
  q("q73", "aidu", "기초", "scope-doc", "AIDU에서 버튼을 누르기 전에 머릿속으로 먼저 정리할 것은 무엇일까요?", ["문제 목표와 데이터 상태", "브라우저 테마", "문항 번호", "결제 방식"], 0, "도구 사용보다 먼저 무엇을 해결할지와 데이터가 어떤 상태인지 알아야 합니다.", "AIDU는 버튼보다 판단 순서가 중요합니다."),
  q("q74", "aidu", "보통", "scope-doc", "AIDU 실습에서 성능 개선을 여러 번 했다면 마지막에 해야 할 일은 무엇일까요?", ["무엇을 바꿨고 결과가 어땠는지 정리한다", "가장 낮은 점수만 남긴다", "모든 기록을 지운다", "문제 목표를 바꾼다"], 0, "변경과 결과를 정리해야 다음 실습이나 시험에서 같은 흐름을 재사용할 수 있습니다.", "기록은 실험을 학습으로 바꿔줍니다."),
  q("q75", "aidu", "보통", "scope-doc", "AIDU에서 모델 결과가 좋아 보일 때도 다시 확인할 것은 무엇일까요?", ["데이터 누수나 평가 조건 문제", "버튼 모양", "오늘 날짜", "문제 제목 길이"], 0, "비정상적으로 좋은 점수는 데이터 누수나 평가 방식 문제일 수 있습니다.", "높은 점수도 의심하며 검토합니다."),
  q("q76", "aidu", "심화", "scope-doc", "AIDU 흐름을 시험 전에 반복 연습하는 목적은 무엇일까요?", ["낯선 데이터에서도 순서대로 판단하기 위해", "모든 정답을 외우기 위해", "공식 페이지를 대체하기 위해", "모델 이름만 암기하기 위해"], 0, "시험에서는 낯선 데이터가 나와도 문제 이해부터 평가까지 순서대로 생각해야 합니다.", "흐름을 외우기보다 판단 습관을 만듭니다."),
  q("q77", "eda", "심화", "scope-doc", "데이터가 너무 적을 때 모델 평가에서 조심할 점은 무엇일까요?", ["평가 점수가 작은 변화에도 크게 흔들릴 수 있다", "항상 100점이 보장된다", "전처리가 필요 없다", "범주형 변수가 없다"], 0, "데이터가 적으면 몇 개의 오답만으로도 점수가 크게 달라질 수 있습니다.", "데이터 양은 평가 신뢰도와 연결됩니다."),
  q("q78", "preprocessing", "심화", "scope-doc", "전처리를 너무 많이 적용했을 때 생길 수 있는 문제는 무엇일까요?", ["원래 데이터의 의미를 잃거나 불필요하게 복잡해질 수 있다", "모든 모델이 사라진다", "정답이 자동 생성된다", "AIDU 접속이 차단된다"], 0, "전처리는 목적이 있어야 하며, 필요 없는 처리는 해석을 어렵게 만들 수 있습니다.", "처리 이유를 설명할 수 있어야 합니다."),
  q("q79", "modeling", "심화", "scope-doc", "여러 모델 점수가 비슷하다면 다음 판단으로 좋은 것은 무엇일까요?", ["해석 가능성, 안정성, 문제 목적을 함께 본다", "무작위로 고른다", "가장 이름이 긴 모델을 고른다", "평가를 삭제한다"], 0, "점수가 비슷하면 설명하기 쉬운지, 안정적인지, 목적에 맞는지를 함께 고려합니다.", "모델 선택은 점수 하나로만 끝나지 않습니다."),
  q("q80", "evaluation", "심화", "scope-doc", "최종 학습 점검에서 가장 좋은 마무리는 무엇일까요?", ["약점 주제, 마지막 모의고사 점수, 공식 정보 확인 여부를 함께 본다", "문제 수만 센다", "오답을 숨긴다", "AIDU 흐름을 건너뛴다"], 0, "시험 전에는 내 약점과 점수 흐름, 공식 시험 정보를 함께 확인해야 합니다.", "마지막 점검은 학습 상태와 공식 정보를 함께 보는 것입니다."),
);

const builtInQuestionBank = questionBank.slice();

const aiduSteps = [
  "문제 목표 이해하기",
  "목표 컬럼과 입력 컬럼 구분하기",
  "데이터 타입과 분포 확인하기",
  "결측치와 이상치 점검하기",
  "시각화와 상관관계 살펴보기",
  "전처리 방법 선택하기",
  "모델 후보 선택하기",
  "학습과 평가 실행하기",
  "변수 중요도와 오답 패턴 확인하기",
  "개선 시도와 결과 기록하기",
];

const scenarios = [
  {
    id: "customer",
    title: "고객 이탈 예측",
    goal: "고객이 서비스를 떠날 가능성을 예측합니다.",
    columns: "고객ID, 이용 기간, 월 요금, 문의 횟수, 결제 방식, 이탈 여부",
    prompts: [
      "목표 컬럼과 입력 컬럼은 무엇인가요?",
      "결측치나 이상치가 특히 걱정되는 컬럼은 무엇인가요?",
      "성능이 낮다면 전처리, 변수, 모델 중 무엇부터 바꿔보겠나요?",
    ],
  },
  {
    id: "house",
    title: "집값 예측",
    goal: "주택 특성을 보고 가격을 예측합니다.",
    columns: "면적, 방 개수, 위치, 건축 연도, 거래 가격",
    prompts: [
      "분포와 이상치를 먼저 봐야 하는 컬럼은 무엇인가요?",
      "위치 컬럼은 어떤 전처리가 필요할까요?",
      "변수 중요도에서 어떤 결과가 나오면 납득할 수 있나요?",
    ],
  },
  {
    id: "student",
    title: "학습 성취 분류",
    goal: "학습 기록을 보고 성취 수준을 분류합니다.",
    columns: "출석률, 과제 제출 횟수, 학습 시간, 이전 점수, 성취 등급",
    prompts: [
      "이 문제는 분류와 예측 중 어디에 가까운가요?",
      "학습 시간 분포가 한쪽으로 몰리면 어떤 점을 확인할까요?",
      "오답이 많은 그룹이 있다면 어떤 데이터를 다시 보겠나요?",
    ],
  },
];

const defaultProgress = {
  completedTodayDate: "",
  completedCardIds: [],
  activeCardId: studyCards[0].id,
  activeCardFilter: "all",
  activeQuizFilter: "all",
  quizIndex: 0,
  quizAnswered: false,
  quizAttempts: 0,
  quizCorrect: 0,
  weakTopics: {},
  questionStats: {},
  userVerifiedQuestionIds: [],
  reviewQuestionIds: [],
  bookmarkedQuestionIds: [],
  managerTopicFilter: "all",
  managerStatusFilter: "all",
  questionSearch: "",
  customQuestions: [],
  mockScores: [],
  mockExam: null,
  aiduChecks: {},
  activeScenarioId: scenarios[0].id,
  aiduNotes: {},
};

let progress = loadProgress();
syncQuestionBank();
let mockTimerId = null;

function q(id, topic, difficulty, source, question, choices, answerIndex, explanation, thinking) {
  return { id, topic, topicName: topicNames[topic], difficulty, source, question, choices, answerIndex, explanation, thinking };
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  })[char]);
}

function normalizeCustomQuestion(question) {
  if (!question || typeof question !== "object") return null;

  const topic = topics.some((item) => item.id === question.topic && item.id !== "all") ? question.topic : "eda";
  const choices = Array.isArray(question.choices) ? question.choices.map(cleanText).slice(0, 4) : [];
  const answerIndex = Number(question.answerIndex);
  const normalized = {
    id: cleanText(question.id) || `custom-${Date.now()}`,
    topic,
    topicName: topicNames[topic],
    difficulty: ["기초", "보통", "심화"].includes(question.difficulty) ? question.difficulty : "보통",
    source: "user-verified",
    sourceTitle: cleanText(question.sourceTitle) || "내 검수 자료",
    question: cleanText(question.question),
    choices,
    answerIndex: Number.isInteger(answerIndex) && answerIndex >= 0 && answerIndex < choices.length ? answerIndex : 0,
    explanation: cleanText(question.explanation),
    thinking: cleanText(question.thinking),
    isCustom: true,
  };

  if (!normalized.id.startsWith("custom-")) normalized.id = `custom-${normalized.id}`;
  if (!normalized.question || choices.length !== 4 || choices.some((choice) => !choice) || !normalized.explanation) {
    return null;
  }

  return normalized;
}

function syncQuestionBank() {
  questionBank.length = 0;
  questionBank.push(...builtInQuestionBank);
  questionBank.push(...progress.customQuestions.map(normalizeCustomQuestion).filter(Boolean));
}

function cloneDefaultProgress() {
  return JSON.parse(JSON.stringify(defaultProgress));
}

function loadProgress() {
  const saved = localStorage.getItem(STORAGE_KEY) || LEGACY_KEYS.map((key) => localStorage.getItem(key)).find(Boolean);

  if (!saved) {
    return cloneDefaultProgress();
  }

  try {
    return normalizeProgress(JSON.parse(saved));
  } catch {
    return cloneDefaultProgress();
  }
}

function normalizeProgress(saved) {
  const next = { ...cloneDefaultProgress(), ...saved };
  next.completedCardIds = Array.isArray(saved.completedCardIds) ? saved.completedCardIds : [];
  next.weakTopics = saved.weakTopics || {};
  next.questionStats = saved.questionStats || {};
  next.userVerifiedQuestionIds = Array.isArray(saved.userVerifiedQuestionIds) ? saved.userVerifiedQuestionIds : [];
  next.reviewQuestionIds = Array.isArray(saved.reviewQuestionIds) ? saved.reviewQuestionIds : [];
  next.bookmarkedQuestionIds = Array.isArray(saved.bookmarkedQuestionIds) ? saved.bookmarkedQuestionIds : [];
  next.customQuestions = Array.isArray(saved.customQuestions) ? saved.customQuestions.map(normalizeCustomQuestion).filter(Boolean) : [];
  next.customQuestions.forEach((question) => {
    if (!next.userVerifiedQuestionIds.includes(question.id)) next.userVerifiedQuestionIds.push(question.id);
  });
  next.mockScores = Array.isArray(saved.mockScores) ? saved.mockScores : [];
  next.aiduChecks = saved.aiduChecks || {};
  next.aiduNotes = saved.aiduNotes || {};
  next.activeCardId = studyCards.some((card) => card.id === next.activeCardId) ? next.activeCardId : studyCards[0].id;
  next.activeScenarioId = scenarios.some((scenario) => scenario.id === next.activeScenarioId) ? next.activeScenarioId : scenarios[0].id;
  return next;
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function sourceLabel(sourceId) {
  return sources.find((source) => source.id === sourceId)?.title || "프로젝트 문제 은행";
}

function questionSourceLabel(question) {
  return question.sourceTitle || sourceLabel(question.source);
}

function questionSourceBadge(question) {
  if (question.source === "scope-doc") return "범위 기반";
  if (question.source === "user-verified") return "내 검수";
  return "출처 참고";
}

function todayKey() {
  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric", weekday: "short" }).format(date);
}

function getFilteredQuestions(filter = progress.activeQuizFilter) {
  return filter === "all" ? questionBank : questionBank.filter((question) => question.topic === filter);
}

function getChoiceOrder(question) {
  const order = question.choices.map((_, index) => index);
  const seed = Array.from(question.id).reduce((total, char) => total + char.charCodeAt(0), 0);

  for (let index = order.length - 1; index > 0; index -= 1) {
    const swapIndex = (seed + index * 7) % (index + 1);
    [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
  }

  if (order[0] === question.answerIndex && seed % 4 !== 0) {
    const moveTo = (seed % (order.length - 1)) + 1;
    [order[0], order[moveTo]] = [order[moveTo], order[0]];
  }

  return order;
}

function renderChoiceButtons(question, selectedAnswer, attribute, disabled = false) {
  return getChoiceOrder(question)
    .map((choiceIndex) => {
      const isSelected = selectedAnswer === choiceIndex;
      return `
        <button class="choice-button ${isSelected ? "is-selected" : ""}" type="button" ${attribute}="${choiceIndex}" aria-pressed="${isSelected}" ${disabled ? "disabled" : ""}>
          ${escapeHtml(question.choices[choiceIndex])}
        </button>
      `;
    })
    .join("");
}

function renderStaticInfo() {
  document.querySelector("#todayDate").textContent = formatDate();
  document.querySelector("#sourceSummary").innerHTML = sources
    .map((source) => {
      const count = questionBank.filter((question) => question.source === source.id).length;
      const label = source.id === "scope-doc"
        ? "공식 범위 기반 자체 제작"
        : source.id === "user-verified"
          ? "직접 검수"
          : "출처 참고";

      return `
        <div class="source-card">
          <strong>${source.title}</strong>
          <span>${source.note}</span>
          <span>${label} · 관련 문항 ${count}개</span>
        </div>
      `;
    })
    .join("");
}

function renderFilters() {
  document.querySelector("#topicFilters").innerHTML = topics
    .map((topic) => `
      <button class="filter-button ${progress.activeCardFilter === topic.id ? "is-active" : ""}" type="button" data-card-filter="${topic.id}" aria-pressed="${progress.activeCardFilter === topic.id}">
        ${topic.label}
      </button>
    `)
    .join("");

  document.querySelector("#quizFilters").innerHTML = topics
    .map((topic) => `
      <button class="filter-button ${progress.activeQuizFilter === topic.id ? "is-active" : ""}" type="button" data-quiz-filter="${topic.id}" aria-pressed="${progress.activeQuizFilter === topic.id}">
        ${topic.label}
      </button>
    `)
    .join("");
}

function renderManagerControls() {
  document.querySelector("#managerTopicFilter").innerHTML = topics
    .map((topic) => `
      <option value="${topic.id}" ${progress.managerTopicFilter === topic.id ? "selected" : ""}>${topic.label}</option>
    `)
    .join("");
  const customTopicSelect = document.querySelector("#customQuestionTopic");
  if (customTopicSelect.options.length === 0) {
    customTopicSelect.innerHTML = topics
      .filter((topic) => topic.id !== "all")
      .map((topic) => `<option value="${topic.id}">${topic.label}</option>`)
      .join("");
  }
  document.querySelector("#managerStatusFilter").value = progress.managerStatusFilter;
  document.querySelector("#questionSearch").value = progress.questionSearch;
}

function filteredManagedQuestions() {
  const search = progress.questionSearch.trim().toLowerCase();

  return questionBank.filter((question) => {
    const topicMatch = progress.managerTopicFilter === "all" || question.topic === progress.managerTopicFilter;
    const searchText = `${question.question} ${question.explanation} ${question.thinking} ${question.topicName} ${questionSourceLabel(question)} ${question.choices.join(" ")}`.toLowerCase();
    const searchMatch = !search || searchText.includes(search);
    const status = progress.managerStatusFilter;
    const statusMatch =
      status === "all" ||
      (status === "scope" && question.source === "scope-doc") ||
      (status === "verified" && (question.source === "user-verified" || progress.userVerifiedQuestionIds.includes(question.id))) ||
      (status === "review" && progress.reviewQuestionIds.includes(question.id)) ||
      (status === "bookmarked" && progress.bookmarkedQuestionIds.includes(question.id));

    return topicMatch && searchMatch && statusMatch;
  });
}

function renderQuestionManager() {
  renderManagerControls();

  const filtered = filteredManagedQuestions();
  const verifiedCount = progress.userVerifiedQuestionIds.length;
  const reviewCount = progress.reviewQuestionIds.length;
  const bookmarkCount = progress.bookmarkedQuestionIds.length;

  document.querySelector("#questionMetrics").innerHTML = `
    <div class="manager-stat"><span>전체 문항</span><strong>${questionBank.length}</strong></div>
    <div class="manager-stat"><span>현재 목록</span><strong>${filtered.length}</strong></div>
    <div class="manager-stat"><span>내가 검수함</span><strong>${verifiedCount}</strong></div>
    <div class="manager-stat"><span>복습/북마크</span><strong>${reviewCount}/${bookmarkCount}</strong></div>
  `;

  if (filtered.length === 0) {
    document.querySelector("#questionList").innerHTML = `
      <div class="question-item">
        <h3>조건에 맞는 문제가 없습니다.</h3>
        <p>필터나 검색어를 바꿔보세요.</p>
      </div>
    `;
    return;
  }

  document.querySelector("#questionList").innerHTML = filtered
    .map((question) => {
      const verified = progress.userVerifiedQuestionIds.includes(question.id);
      const review = progress.reviewQuestionIds.includes(question.id);
      const bookmarked = progress.bookmarkedQuestionIds.includes(question.id);
      const attempts = progress.questionStats[question.id]?.attempts || 0;
      const correct = progress.questionStats[question.id]?.correct || 0;

      return `
        <article class="question-item">
          <div class="question-badges">
            <span>${escapeHtml(question.topicName)}</span>
            <span>${escapeHtml(question.difficulty)}</span>
            <span>${escapeHtml(questionSourceBadge(question))}</span>
            <span>${attempts ? `풀이 ${correct}/${attempts}` : "풀이 전"}</span>
          </div>
          <h3>${escapeHtml(question.question)}</h3>
          <p>${escapeHtml(question.explanation)}</p>
          <p class="question-source">출처: ${escapeHtml(questionSourceLabel(question))}</p>
          <div class="question-actions">
            <button class="${verified ? "is-active" : ""}" type="button" data-question-action="verify" data-question-id="${question.id}">
              ${verified ? "검수됨" : "내가 검수"}
            </button>
            <button class="${review ? "is-active" : ""}" type="button" data-question-action="review" data-question-id="${question.id}">
              ${review ? "복습 중" : "복습 표시"}
            </button>
            <button class="${bookmarked ? "is-active" : ""}" type="button" data-question-action="bookmark" data-question-id="${question.id}">
              ${bookmarked ? "북마크됨" : "북마크"}
            </button>
            ${question.isCustom ? `
              <button class="danger-action" type="button" data-question-action="delete" data-question-id="${question.id}">
                삭제
              </button>
            ` : ""}
          </div>
        </article>
      `;
    })
    .join("");
}

function renderStudyCards() {
  const filtered = progress.activeCardFilter === "all"
    ? studyCards
    : studyCards.filter((card) => card.topic === progress.activeCardFilter);

  if (!filtered.some((card) => card.id === progress.activeCardId)) {
    progress.activeCardId = filtered[0]?.id || studyCards[0].id;
    saveProgress();
  }

  document.querySelector("#studyCardList").innerHTML = filtered
    .map((card) => {
      const done = progress.completedCardIds.includes(card.id);
      const selected = progress.activeCardId === card.id;
      return `
        <button class="study-card ${selected ? "is-selected" : ""}" type="button" data-card-id="${card.id}">
          <span class="topic-chip">${topicNames[card.topic]}</span>
          <strong>${card.title}</strong>
          <span>${card.summary}</span>
          <small>${done ? "완료됨" : "학습 전"}</small>
        </button>
      `;
    })
    .join("");

  renderStudyDetail();
}

function renderStudyDetail() {
  const card = studyCards.find((item) => item.id === progress.activeCardId) || studyCards[0];
  const done = progress.completedCardIds.includes(card.id);

  document.querySelector("#studyCardDetail").innerHTML = `
    <span class="topic-chip">${topicNames[card.topic]}</span>
    <h3>${card.title}</h3>
    <p>${card.summary}</p>
    <dl class="concept-list">
      <div>
        <dt>왜 중요할까요?</dt>
        <dd>${card.why}</dd>
      </div>
      <div>
        <dt>예시</dt>
        <dd>${card.example}</dd>
      </div>
      <div>
        <dt>체크포인트</dt>
        <dd>${card.checklist.join(" · ")}</dd>
      </div>
    </dl>
    <button class="primary-button" id="toggleCardButton" type="button">${done ? "완료 취소" : "이 카드 완료"}</button>
  `;
}

function currentQuizQuestion() {
  const questions = getFilteredQuestions();
  return questions[progress.quizIndex % questions.length] || questionBank[0];
}

function renderQuiz() {
  const question = currentQuizQuestion();
  const total = getFilteredQuestions().length;

  document.querySelector("#quizStatus").textContent = progress.quizAnswered ? "풀이 완료" : `${(progress.quizIndex % total) + 1}/${total}`;
  document.querySelector("#quizSource").textContent = questionSourceLabel(question);
  document.querySelector("#quizDifficulty").textContent = `${question.topicName} · ${question.difficulty}`;
  document.querySelector("#quizQuestion").textContent = question.question;
  document.querySelector("#quizFeedback").innerHTML = progress.quizAnswered
    ? "다음 문제를 눌러 이어서 연습하세요."
    : "";
  document.querySelector("#quizChoices").innerHTML = renderChoiceButtons(question, undefined, "data-choice-index", progress.quizAnswered);
}

function renderWeakTopics() {
  const entries = Object.entries(progress.weakTopics).sort((a, b) => b[1] - a[1]);
  const weakContainer = document.querySelector("#weakTopics");

  if (entries.length === 0) {
    weakContainer.innerHTML = `
      <div class="weak-item">
        <strong>아직 기록된 약점이 없습니다.</strong>
        <span>퀴즈나 모의고사에서 틀린 주제가 이곳에 누적됩니다.</span>
      </div>
    `;
  } else {
    weakContainer.innerHTML = entries
      .map(([topic, count]) => `
        <div class="weak-item">
          <strong>${topic}</strong>
          <span>오답 ${count}회 · 관련 개념 카드와 약점 문제를 다시 보세요.</span>
        </div>
      `)
      .join("");
  }

  renderCoachTips(entries);
}

function renderCoachTips(entries = Object.entries(progress.weakTopics)) {
  const completedCards = progress.completedCardIds.length;
  const latestScore = progress.mockScores[0]?.score;
  const tips = [];

  if (entries.length > 0) {
    tips.push({ title: `${entries[0][0]} 복습`, text: "가장 많이 틀린 주제입니다. 해당 필터로 카드 2개를 다시 확인하세요." });
  }
  if (progress.quizAttempts < 5) {
    tips.push({ title: "퀴즈 표본 늘리기", text: "정답률이 의미 있으려면 최소 5문제 이상 풀어보는 것이 좋습니다." });
  }
  if (completedCards < 6) {
    tips.push({ title: "개념 카드 절반 완료", text: "카드 6개를 완료하면 모의고사 해설이 훨씬 잘 읽힙니다." });
  }
  if (latestScore !== undefined && latestScore < PASS_SCORE) {
    tips.push({ title: "모의고사 재도전", text: "80점 미만이면 약점 주제 1개를 복습한 뒤 다시 풀어보세요." });
  }
  if (tips.length === 0) {
    tips.push({ title: "좋은 흐름입니다", text: "이제 모의고사 기록을 3회 정도 쌓아 안정적인 약점을 확인하세요." });
  }

  document.querySelector("#coachTips").innerHTML = tips
    .slice(0, 4)
    .map((tip) => `
      <div class="coach-item">
        <strong>${tip.title}</strong>
        <span>${tip.text}</span>
      </div>
    `)
    .join("");
}

function renderTodayPlan() {
  const weakEntries = Object.entries(progress.weakTopics).sort((a, b) => b[1] - a[1]);
  const topWeak = weakEntries[0]?.[0];
  const focusTopic = topWeak || "데이터 확인 → 전처리 → 모델링 → 평가 흐름 잡기";
  const tasks = topWeak
    ? [`${topWeak} 관련 개념 카드 2개 복습`, "약점 문제 3문제 풀기", "AIDU 시나리오 메모 1개 작성"]
    : ["개념 카드 3개 완료", "빠른 퀴즈 5문제 풀기", "AIDU 체크리스트 5단계 체크"];

  document.querySelector("#focusTopic").textContent = focusTopic;
  document.querySelector("#focusReason").textContent = topWeak
    ? "최근 오답 기록을 기준으로 오늘은 가장 약한 주제를 먼저 복습합니다."
    : "아직 약점 기록이 적습니다. 핵심 개념과 짧은 문제로 기본 흐름을 먼저 확인하세요.";
  document.querySelector("#todayTasks").innerHTML = tasks.map((task) => `<li>${task}</li>`).join("");
}

function renderChecklist() {
  document.querySelector("#aiduChecklist").innerHTML = aiduSteps
    .map((step, index) => {
      const id = `aidu-step-${index}`;
      return `
        <label class="check-item" for="${id}">
          <input id="${id}" type="checkbox" ${progress.aiduChecks[id] ? "checked" : ""} />
          <span>${index + 1}. ${step}</span>
        </label>
      `;
    })
    .join("");
}

function renderScenarios() {
  document.querySelector("#scenarioSelect").innerHTML = scenarios
    .map((scenario) => `
      <option value="${scenario.id}" ${progress.activeScenarioId === scenario.id ? "selected" : ""}>${scenario.title}</option>
    `)
    .join("");
  renderScenarioDetail();
}

function renderScenarioDetail() {
  const scenario = scenarios.find((item) => item.id === progress.activeScenarioId) || scenarios[0];
  document.querySelector("#scenarioDetail").innerHTML = `
    <h3>${scenario.title}</h3>
    <p><strong>목표:</strong> ${scenario.goal}</p>
    <p><strong>컬럼:</strong> ${scenario.columns}</p>
  `;
  document.querySelector("#scenarioPrompts").innerHTML = scenario.prompts
    .map((prompt, index) => {
      const key = `${scenario.id}-${index}`;
      return `
        <label class="note-field" for="note-${key}">
          <span>${prompt}</span>
          <textarea id="note-${key}" data-note-key="${key}" rows="3" placeholder="내 판단을 한두 문장으로 적어보세요.">${progress.aiduNotes[key] || ""}</textarea>
        </label>
      `;
    })
    .join("");
}

function startMockExam() {
  const offset = progress.mockScores.length % Math.max(1, questionBank.length - 15);
  const questionIds = [...questionBank.slice(offset), ...questionBank.slice(0, offset)].slice(0, 15).map((question) => question.id);
  progress.mockExam = {
    status: "active",
    startedAt: Date.now(),
    currentIndex: 0,
    questionIds,
    answers: {},
  };
  saveProgress();
  renderMockExam();
  startMockTimer();
}

function currentMockQuestion() {
  const id = progress.mockExam.questionIds[progress.mockExam.currentIndex];
  return questionBank.find((question) => question.id === id);
}

function renderMockExam() {
  const intro = document.querySelector("#mockIntro");
  const area = document.querySelector("#mockQuestionArea");
  const result = document.querySelector("#mockResult");
  const exam = progress.mockExam;

  if (!exam || exam.status === "idle") {
    intro.classList.remove("hidden");
    area.classList.add("hidden");
    result.classList.add("hidden");
    document.querySelector("#mockProgress").textContent = "대기 중";
    document.querySelector("#mockTimer").textContent = "60:00";
    return;
  }

  if (exam.status === "finished") {
    intro.classList.add("hidden");
    area.classList.add("hidden");
    result.classList.remove("hidden");
    renderMockResult();
    return;
  }

  const question = currentMockQuestion();
  const selected = exam.answers[question.id];

  intro.classList.add("hidden");
  area.classList.remove("hidden");
  result.classList.add("hidden");
  document.querySelector("#mockProgress").textContent = `${exam.currentIndex + 1}/15`;
  document.querySelector("#mockTopic").textContent = `${question.topicName} · ${question.difficulty}`;
  document.querySelector("#mockSource").textContent = questionSourceLabel(question);
  document.querySelector("#mockQuestion").textContent = question.question;
  document.querySelector("#mockFeedback").textContent = selected === undefined ? "" : "답을 선택했습니다. 다음 버튼으로 이어가세요.";
  document.querySelector("#nextMockButton").textContent = exam.currentIndex === exam.questionIds.length - 1 ? "채점하기" : "다음";
  document.querySelector("#mockChoices").innerHTML = renderChoiceButtons(question, selected, "data-mock-choice-index");
  updateMockTimer();
}

function renderMockResult() {
  const latest = progress.mockScores[0];
  if (!latest) return;

  const topicRows = Object.entries(latest.byTopic)
    .map(([topic, row]) => `<li>${topic}: ${row.correct}/${row.total}</li>`)
    .join("");
  const weakTags = latest.weakTopics.length
    ? latest.weakTopics.map((topic) => `<span>${topic}</span>`).join("")
    : "<span>큰 약점 없음</span>";

  document.querySelector("#mockResult").innerHTML = `
    <h3>${latest.score}점 · ${latest.score >= PASS_SCORE ? "목표 달성" : "복습 필요"}</h3>
    <p>정답 ${latest.correct}/${latest.total}문항입니다. 약점 주제를 확인한 뒤 다시 도전하세요.</p>
    <ul>${topicRows}</ul>
    <div class="weak-tags">${weakTags}</div>
    <button class="primary-button" id="restartMockButton" type="button">다시 시작</button>
  `;
}

function renderMockHistory() {
  const container = document.querySelector("#mockHistory");
  if (progress.mockScores.length === 0) {
    container.innerHTML = `
      <div class="history-item">
        <strong>기록 없음</strong>
        <span>모의고사를 완료하면 최근 점수가 표시됩니다.</span>
      </div>
    `;
    return;
  }
  container.innerHTML = progress.mockScores
    .slice(0, 5)
    .map((score) => {
      const dateText = new Intl.DateTimeFormat("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(score.completedAt));
      return `
        <div class="history-item">
          <strong>${score.score}점 (${score.correct}/${score.total})</strong>
          <span>${dateText} · ${score.score >= PASS_SCORE ? "목표 달성" : "복습 필요"}</span>
        </div>
      `;
    })
    .join("");
}

function updateSummary() {
  const cardRate = progress.completedCardIds.length / studyCards.length;
  const quizRate = progress.quizAttempts === 0 ? 0 : progress.quizCorrect / progress.quizAttempts;
  const latestScore = progress.mockScores[0]?.score;
  const mockRate = latestScore === undefined ? 0 : latestScore / 100;
  const aiduRate = Object.values(progress.aiduChecks).filter(Boolean).length / aiduSteps.length;
  const readiness = Math.round(((cardRate * 0.3) + (quizRate * 0.25) + (mockRate * 0.25) + (aiduRate * 0.2)) * 100);
  const todayDone = progress.completedTodayDate === todayKey();

  document.querySelector("#cardProgress").textContent = `${progress.completedCardIds.length}/${studyCards.length}`;
  document.querySelector("#quizRate").textContent = `${Math.round(quizRate * 100)}%`;
  document.querySelector("#latestMockScore").textContent = latestScore === undefined ? "-" : `${latestScore}점`;
  document.querySelector("#readinessScore").textContent = `${readiness}%`;
  document.querySelector("#todayStatus").textContent = todayDone ? "완료" : "대기 중";
  document.querySelector("#completeTodayButton").textContent = todayDone ? "오늘 학습 완료됨" : "오늘 학습 완료 표시";
  renderTodayPlan();
  renderMockHistory();
}

function answerQuiz(event) {
  const button = event.target.closest("[data-choice-index]");
  if (!button || progress.quizAnswered) return;

  const question = currentQuizQuestion();
  const selected = Number(button.dataset.choiceIndex);
  const correct = selected === question.answerIndex;
  progress.quizAttempts += 1;
  progress.quizAnswered = true;
  progress.questionStats[question.id] = progress.questionStats[question.id] || { attempts: 0, correct: 0 };
  progress.questionStats[question.id].attempts += 1;

  if (correct) {
    progress.quizCorrect += 1;
    progress.questionStats[question.id].correct += 1;
  } else {
    addWeakTopic(question.topicName);
    addUnique(progress.reviewQuestionIds, question.id);
  }

  document.querySelectorAll("[data-choice-index]").forEach((choiceButton) => {
    const index = Number(choiceButton.dataset.choiceIndex);
    choiceButton.disabled = true;
    if (index === question.answerIndex) choiceButton.classList.add("is-correct");
    if (index === selected && !correct) choiceButton.classList.add("is-wrong");
  });

  document.querySelector("#quizStatus").textContent = correct ? "정답" : "오답";
  document.querySelector("#quizFeedback").innerHTML = `
    <strong>${correct ? "정답입니다." : "아쉬워요."}</strong>
    <p>${escapeHtml(question.explanation)}</p>
    <p><strong>생각 순서:</strong> ${escapeHtml(question.thinking)}</p>
  `;
  saveProgress();
  renderWeakTopics();
  renderQuestionManager();
  updateSummary();
}

function nextQuiz() {
  const total = getFilteredQuestions().length;
  progress.quizIndex = (progress.quizIndex + 1) % total;
  progress.quizAnswered = false;
  saveProgress();
  renderQuiz();
}

function setWeakQuiz() {
  const weakTopic = Object.entries(progress.weakTopics).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (!weakTopic) {
    progress.activeQuizFilter = "all";
  } else {
    const topic = topics.find((item) => item.label === weakTopic);
    progress.activeQuizFilter = topic?.id || "all";
  }
  progress.quizIndex = 0;
  progress.quizAnswered = false;
  saveProgress();
  renderFilters();
  renderQuiz();
}

function resetQuizStats() {
  progress.quizAttempts = 0;
  progress.quizCorrect = 0;
  progress.quizAnswered = false;
  progress.weakTopics = {};
  progress.questionStats = {};
  progress.reviewQuestionIds = [];
  saveProgress();
  renderQuiz();
  renderWeakTopics();
  renderQuestionManager();
  updateSummary();
}

function addWeakTopic(topicName) {
  progress.weakTopics[topicName] = (progress.weakTopics[topicName] || 0) + 1;
}

function addUnique(list, id) {
  if (!list.includes(id)) {
    list.push(id);
  }
}

function toggleId(list, id) {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

function removeQuestionReferences(id) {
  progress.userVerifiedQuestionIds = progress.userVerifiedQuestionIds.filter((item) => item !== id);
  progress.reviewQuestionIds = progress.reviewQuestionIds.filter((item) => item !== id);
  progress.bookmarkedQuestionIds = progress.bookmarkedQuestionIds.filter((item) => item !== id);
  delete progress.questionStats[id];
}

function setCustomQuestionMessage(message) {
  const target = document.querySelector("#customQuestionMessage");
  if (target) target.textContent = message;
}

function resetCustomQuestionForm(form) {
  form.reset();
  form.querySelector("#customQuestionDifficulty").value = "보통";
  form.querySelector("#customQuestionAnswer").value = "0";
  form.querySelector("#customQuestionTopic").value = "eda";
}

function handleCustomQuestionSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);
  const choices = [0, 1, 2, 3].map((index) => cleanText(formData.get(`choice${index}`)));
  const customQuestion = normalizeCustomQuestion({
    id: `custom-${Date.now()}`,
    topic: formData.get("topic"),
    difficulty: formData.get("difficulty"),
    sourceTitle: formData.get("sourceTitle"),
    question: formData.get("question"),
    choices,
    answerIndex: formData.get("answerIndex"),
    explanation: formData.get("explanation"),
    thinking: formData.get("thinking"),
  });

  if (!customQuestion) {
    setCustomQuestionMessage("문제, 선택지 4개, 해설을 모두 입력해야 저장됩니다.");
    return;
  }

  progress.customQuestions.push(customQuestion);
  addUnique(progress.userVerifiedQuestionIds, customQuestion.id);
  progress.managerStatusFilter = "verified";
  progress.managerTopicFilter = "all";
  progress.questionSearch = "";
  syncQuestionBank();
  saveProgress();
  resetCustomQuestionForm(form);
  renderStaticInfo();
  renderQuiz();
  renderQuestionManager();
  setCustomQuestionMessage("저장되었습니다. 문제 관리와 퀴즈에 바로 반영됐습니다.");
}

function deleteCustomQuestion(id) {
  const question = progress.customQuestions.find((item) => item.id === id);
  if (!question) return;

  const confirmed = window.confirm("직접 추가한 이 문제를 삭제할까요?");
  if (!confirmed) return;

  progress.customQuestions = progress.customQuestions.filter((item) => item.id !== id);
  removeQuestionReferences(id);
  if (progress.mockExam?.questionIds?.includes(id)) {
    progress.mockExam = null;
    stopMockTimer();
  }
  syncQuestionBank();
  saveProgress();
  renderStaticInfo();
  renderQuiz();
  renderQuestionManager();
  renderMockExam();
  updateSummary();
  setCustomQuestionMessage("직접 추가한 문제를 삭제했습니다.");
}

function answerMock(event) {
  const button = event.target.closest("[data-mock-choice-index]");
  if (!button || !progress.mockExam || progress.mockExam.status !== "active") return;

  const question = currentMockQuestion();
  progress.mockExam.answers[question.id] = Number(button.dataset.mockChoiceIndex);
  saveProgress();
  renderMockExam();
}

function nextMockQuestion() {
  if (!progress.mockExam || progress.mockExam.status !== "active") return;

  if (progress.mockExam.currentIndex >= progress.mockExam.questionIds.length - 1) {
    finishMockExam();
    return;
  }
  progress.mockExam.currentIndex += 1;
  saveProgress();
  renderMockExam();
}

function finishMockExam() {
  const exam = progress.mockExam;
  if (!exam) return;

  const questions = exam.questionIds.map((id) => questionBank.find((question) => question.id === id));
  let correct = 0;
  const byTopic = {};
  const weakSet = new Set();

  questions.forEach((question) => {
    const isCorrect = exam.answers[question.id] === question.answerIndex;
    byTopic[question.topicName] = byTopic[question.topicName] || { correct: 0, total: 0 };
    byTopic[question.topicName].total += 1;
    if (isCorrect) {
      correct += 1;
      byTopic[question.topicName].correct += 1;
    } else {
      weakSet.add(question.topicName);
      addWeakTopic(question.topicName);
      addUnique(progress.reviewQuestionIds, question.id);
    }
  });

  const score = Math.round((correct / questions.length) * 100);
  progress.mockScores.unshift({
    score,
    correct,
    total: questions.length,
    byTopic,
    weakTopics: Array.from(weakSet),
    completedAt: new Date().toISOString(),
  });
  progress.mockScores = progress.mockScores.slice(0, 5);
  progress.mockExam.status = "finished";
  stopMockTimer();
  saveProgress();
  renderMockExam();
  renderWeakTopics();
  renderQuestionManager();
  updateSummary();
}

function startMockTimer() {
  stopMockTimer();
  mockTimerId = window.setInterval(updateMockTimer, 1000);
}

function stopMockTimer() {
  if (mockTimerId) {
    window.clearInterval(mockTimerId);
    mockTimerId = null;
  }
}

function updateMockTimer() {
  const exam = progress.mockExam;
  if (!exam || exam.status !== "active") return;

  const elapsed = Math.floor((Date.now() - exam.startedAt) / 1000);
  const remaining = Math.max(0, MOCK_DURATION_SECONDS - elapsed);
  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");
  document.querySelector("#mockTimer").textContent = `${minutes}:${seconds}`;
  if (remaining === 0) finishMockExam();
}

function resetAllProgress() {
  const confirmed = window.confirm("이 브라우저에 저장된 AICE Basic 학습 기록을 모두 지울까요?");
  if (!confirmed) return;

  stopMockTimer();
  localStorage.removeItem(STORAGE_KEY);
  LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
  progress = cloneDefaultProgress();
  syncQuestionBank();
  saveProgress();
  renderAll();
}

function bindEvents() {
  document.querySelector("#topicFilters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-card-filter]");
    if (!button) return;
    progress.activeCardFilter = button.dataset.cardFilter;
    saveProgress();
    renderFilters();
    renderStudyCards();
  });

  document.querySelector("#quizFilters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-quiz-filter]");
    if (!button) return;
    progress.activeQuizFilter = button.dataset.quizFilter;
    progress.quizIndex = 0;
    progress.quizAnswered = false;
    saveProgress();
    renderFilters();
    renderQuiz();
  });

  document.querySelector("#managerTopicFilter").addEventListener("change", (event) => {
    progress.managerTopicFilter = event.target.value;
    saveProgress();
    renderQuestionManager();
  });

  document.querySelector("#managerStatusFilter").addEventListener("change", (event) => {
    progress.managerStatusFilter = event.target.value;
    saveProgress();
    renderQuestionManager();
  });

  document.querySelector("#questionSearch").addEventListener("input", (event) => {
    progress.questionSearch = event.target.value;
    saveProgress();
    renderQuestionManager();
  });

  document.querySelector("#questionList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-question-action]");
    if (!button) return;

    const id = button.dataset.questionId;
    const action = button.dataset.questionAction;

    if (action === "delete") {
      deleteCustomQuestion(id);
      return;
    }
    if (action === "verify") {
      progress.userVerifiedQuestionIds = toggleId(progress.userVerifiedQuestionIds, id);
    }
    if (action === "review") {
      progress.reviewQuestionIds = toggleId(progress.reviewQuestionIds, id);
    }
    if (action === "bookmark") {
      progress.bookmarkedQuestionIds = toggleId(progress.bookmarkedQuestionIds, id);
    }

    saveProgress();
    renderQuestionManager();
  });

  document.querySelector("#customQuestionForm").addEventListener("submit", handleCustomQuestionSubmit);

  document.querySelector("#studyCardList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-card-id]");
    if (!button) return;
    progress.activeCardId = button.dataset.cardId;
    saveProgress();
    renderStudyCards();
  });

  document.querySelector("#studyCardDetail").addEventListener("click", (event) => {
    if (!event.target.closest("#toggleCardButton")) return;
    const id = progress.activeCardId;
    progress.completedCardIds = progress.completedCardIds.includes(id)
      ? progress.completedCardIds.filter((cardId) => cardId !== id)
      : [...progress.completedCardIds, id];
    saveProgress();
    renderStudyCards();
    updateSummary();
  });

  document.querySelector("#quizChoices").addEventListener("click", answerQuiz);
  document.querySelector("#nextQuizButton").addEventListener("click", nextQuiz);
  document.querySelector("#weakQuizButton").addEventListener("click", setWeakQuiz);
  document.querySelector("#resetQuizButton").addEventListener("click", resetQuizStats);
  document.querySelector("#startMockButton").addEventListener("click", startMockExam);
  document.querySelector("#mockChoices").addEventListener("click", answerMock);
  document.querySelector("#nextMockButton").addEventListener("click", nextMockQuestion);
  document.querySelector("#finishMockButton").addEventListener("click", finishMockExam);
  document.querySelector("#mockResult").addEventListener("click", (event) => {
    if (!event.target.closest("#restartMockButton")) return;
    progress.mockExam = null;
    saveProgress();
    renderMockExam();
    updateSummary();
  });
  document.querySelector("#completeTodayButton").addEventListener("click", () => {
    progress.completedTodayDate = todayKey();
    saveProgress();
    updateSummary();
  });
  document.querySelector("#resetAllButton").addEventListener("click", resetAllProgress);
  document.querySelector("#clearAiduButton").addEventListener("click", () => {
    progress.aiduChecks = {};
    saveProgress();
    renderChecklist();
    updateSummary();
  });
  document.querySelector("#scenarioSelect").addEventListener("change", (event) => {
    progress.activeScenarioId = event.target.value;
    saveProgress();
    renderScenarioDetail();
  });
  document.querySelector("#aiduChecklist").addEventListener("change", (event) => {
    if (event.target.type !== "checkbox") return;
    progress.aiduChecks[event.target.id] = event.target.checked;
    saveProgress();
    updateSummary();
  });
  document.querySelector("#scenarioPrompts").addEventListener("input", (event) => {
    const textarea = event.target.closest("[data-note-key]");
    if (!textarea) return;
    progress.aiduNotes[textarea.dataset.noteKey] = textarea.value;
    saveProgress();
  });
}

function renderAll() {
  renderStaticInfo();
  renderFilters();
  renderStudyCards();
  renderQuiz();
  renderQuestionManager();
  renderWeakTopics();
  renderChecklist();
  renderScenarios();
  renderMockExam();
  updateSummary();
}

function init() {
  renderAll();
  bindEvents();
  if (progress.mockExam?.status === "active") startMockTimer();
}

init();
