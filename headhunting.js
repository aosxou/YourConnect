// State management for all selectable grids
const state = {
    selectedRanks: [],
    selectedCareers: [],
    selectedJobs: [],
    selectedCompanies: [],
    selectedRegions: []
};

// Data for all grids
const data = {
    ranks: [
        "과장·차장급", "부장급", "팀장/매니저/실장", "파트장/그룹장",
        "임원/CEO", "주임·대리급", "본부장/센터장"
    ],
    careers: ["1년~3년", "3년~5년", "5년~7년", "7년~10년", "10년~15년", "15년~"],
    jobs: [
        // 개발자 그룹
        "개발자",
        "FE (프론트엔드)",
        "BE (백엔드)",
        "App (모바일 앱 개발)",
        "Data Engineer/Data Scientist",
        "",
        // 개발자 상세 그룹
        "DevOps (시스템 운영/배포 엔지니어)",
        "",
        // 기획자 그룹
        "PM/PO/기획자",
        "서비스 기획",
        "PO (프로덕트 오너)",
        "PM (프로젝트/프로덕트 매니저)",
        "",
        // 디자이너 그룹
        "UI/UX",
        "BX (브랜드 경험 디자이너)",
        "그래픽 디자이너",
        "모션 디자이너",
        "",
        // 데이터 그룹
        "데이터 분석가",
        "데이터 엔지니어",
        "머신러닝 엔지니어",
        "",
        // 인프라 그룹
        "인프라/클라우드",
        "클라우드",
        "보안",
        "",
        // QA 그룹
        "QA/테스터",
        "QA 테스트 엔지니어",
        "",
        // 마케터 그룹
        "마케터",
        "콘텐츠",
        "브랜드",
        "성장 마케터",
        "",
        // 경영/운영 그룹
        "경영/운영",
        "사업전략",
        "운영 매니저",
        "",
        // HR 그룹
        "HR/리크루터",
        "HR 매니저",
        "리크루터"
    ],
    companies: ["대기업", "중견기업", "중소기업", "외국계", "공기업", "벤처기업"],
    regions: [
        "전국", "서울", "경기", "인천", "대전", "세종", "충남", "충북", "광주",
        "전남", "전북", "대구", "경북", "부산", "울산", "경남", "강원", "제주"
    ]
};

// Maximum selections per category
function getMaxSelection(category) {
    const maxSelections = {
        ranks: 3,
        careers: 1,
        jobs: 5,
        companies: 2,
        regions: 2
    };
    return maxSelections[category];
}

// DOM elements
const elements = {
    ranksGrid: document.getElementById('ranks-grid'),
    careersGrid: document.getElementById('careers-grid'),
    jobsGrid: document.getElementById('jobs-grid'),
    companiesGrid: document.getElementById('companies-grid'),
    regionsGrid: document.getElementById('regions-grid'),
    ranksCount: document.getElementById('ranks-count'),
    careersCount: document.getElementById('careers-count'),
    jobsCount: document.getElementById('jobs-count'),
    companiesCount: document.getElementById('companies-count'),
    regionsCount: document.getElementById('regions-count')
};

// Toggle selection is handled by event delegation (see listener below)


// Render buttons for a category
function renderButtons(category) {
    const gridElement = elements[`${category}Grid`];
    if (!gridElement) return;

    const items = data[category];
    const capitalized = category.charAt(0).toUpperCase() + category.slice(1);

    gridElement.innerHTML = items.map(item => {
        // Separator / group break
        if (item === "") {
            return '<button class="separator"></button>';
        }

        return `
            <button type="button" data-value="${item}">${item}</button>
        `;
    }).join('');
}

// Update counters
function updateCounters() {
    Object.keys(state).forEach(key => {
        const category = key.replace('selected', '').toLowerCase();
        const countElement = elements[`${category}Count`];
        if (countElement) {
            countElement.textContent = state[key].length;
        }
    });
}

// Initialize all grids
document.addEventListener('DOMContentLoaded', () => {
    ['ranks', 'careers', 'jobs', 'companies', 'regions'].forEach(category => {
        renderButtons(category);
    });
    updateCounters();
});

// Event delegation: toggle .selected when any grid or options button is clicked
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.grid button, .options button');
    if (!btn) return;
    if (btn.classList.contains('separator')) return; // ignore separators
    btn.classList.toggle('selected');
});
