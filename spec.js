// 상태 관리
const state = {
    selectedRanks: [],
    selectedCareers: [],
    selectedJobs: [],
    selectedCompanies: [],
    selectedRegions: []
};

// 데이터
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
        "서울", "경기", "인천", "대전", "세종", "충남", "충북", "광주",
        "전남", "전북", "대구", "경북", "부산", "울산", "경남", "강원", "제주"
    ]
};

// DOM 요소
const elements = {
    ranksGrid: document.getElementById('ranks-grid'),
    careersGrid: document.getElementById('careers-grid'),
    jobsGrid: document.getElementById('jobs-grid'),
    companiesGrid: document.getElementById('companies-grid'),
    regionsGrid: document.getElementById('regions-grid'),
    companiesCount: document.getElementById('companies-count'),
    regionsCount: document.getElementById('regions-count'),
    jobsCount: document.getElementById('jobs-count'),
    saveButton: document.getElementById('save-button')
};

// 토글 선택 함수
function toggleSelect(item, category, max = null) {
    const key = `selected${category}`;
    const selectedItems = state[key];

    // 단일 선택 모드: 이미 선택된 항목 클릭 시 해제, 다른 항목 클릭 시 교체
    if (selectedItems.includes(item)) {
        state[key] = [];
    } else {
        state[key] = [item];
    }

    // UI 업데이트
    renderButtons(category.toLowerCase());
    updateCounters();
}

// 버튼 렌더링 함수
function renderButtons(category) {
    const gridElement = elements[`${category}Grid`];
    const items = data[category];
    const capitalized = category.charAt(0).toUpperCase() + category.slice(1);
    const selectedItems = state[`selected${capitalized}`];

    gridElement.innerHTML = items.map(item => {
        // separator / group break
        if (item === "") {
            return '<button class="separator"></button>';
        }

        const isSelected = selectedItems.includes(item);
        // 단일 선택: 하나 선택되면 다른 버튼들 비활성화
        const isDisabled = !isSelected && selectedItems.length > 0;
        
        return `
            <button
                class="${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}"
                onclick="toggleSelect('${item}', '${capitalized}', ${getMaxSelection(category)})"
                ${isDisabled ? 'disabled' : ''}
            >
                ${item}
            </button>
        `;
    }).join('');
}

// 최대 선택 개수 반환
function getMaxSelection(category) {
    const maxSelections = {
        ranks: 1,
        careers: 1,
        jobs: 1,
        companies: 1,
        regions: 1
    };
    return maxSelections[category];
}

// 카운터 업데이트
function updateCounters() {
    elements.companiesCount.textContent = state.selectedCompanies.length;
    elements.regionsCount.textContent = state.selectedRegions.length;
    if (elements.jobsCount) elements.jobsCount.textContent = state.selectedJobs.length;
}

// 저장 버튼 이벤트 핸들러
function handleSave() {
    // Show modal (same design as profile.html). On confirm, navigate to profile.html
    const modal = document.getElementById('saveModal');
    const okBtn = document.getElementById('modalOk');
    if (modal) {
        modal.setAttribute('aria-hidden', 'false');
        modal.classList.add('open');

        // Ensure we don't register multiple handlers
        okBtn.onclick = function () {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            // Navigate to profile page in same folder
            window.location.href = './profile.html';
        };
    } else {
        // Fallback: if modal is not present, use confirm as before
        const ok = confirm("✅ 수정사항이 저장되었습니다!\n\n확인을 누르면 프로필 페이지로 이동합니다.");
        if (ok) window.location.href = './profile.html';
    }
}

// 초기화 함수
function initialize() {
    // 모든 그리드 렌더링
    ['ranks', 'careers', 'jobs', 'companies', 'regions'].forEach(category => {
        renderButtons(category);
    });

    // 저장 버튼 이벤트 리스너
    elements.saveButton.addEventListener('click', handleSave);
    // 초기 카운터 업데이트
    updateCounters();
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', initialize);