// State management for all selectable grids
const state = {
    selectedRanks: [],
    selectedCareers: [],
    selectedJobs: [],
    selectedCompanies: [],
    selectedRegions: [],
    searchKeyword: '',
    currentPage: 1,
    itemsPerPage: 9
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

// Job parent-child hierarchy (parent -> children array)
const jobHierarchy = {
    "개발자": ["FE (프론트엔드)", "BE (백엔드)", "App (모바일 앱 개발)", "Data Engineer/Data Scientist", "DevOps (시스템 운영/배포 엔지니어)"],
    "PM/PO/기획자": ["서비스 기획", "PO (프로덕트 오너)", "PM (프로젝트/프로덕트 매니저)"],
    "UI/UX": ["BX (브랜드 경험 디자이너)", "그래픽 디자이너", "모션 디자이너"],
    "데이터 분석가": ["데이터 엔지니어", "머신러닝 엔지니어"],
    "인프라/클라우드": ["클라우드", "보안"],
    "마케터": ["콘텐츠", "브랜드", "성장 마케터"],
    "경영/운영": ["사업전략", "운영 매니저"],
    "HR/리크루터": ["HR 매니저", "리크루터"]
};

// Helper: get parent of a job if exists
function getJobParent(job) {
    for (const [parent, children] of Object.entries(jobHierarchy)) {
        if (children.includes(job)) return parent;
    }
    return null;
}

// Helper: check if a job should be disabled due to hierarchy
function isJobDisabledByHierarchy(job, selectedJobs) {
    // If job is a parent and any child is selected → disable parent
    if (jobHierarchy[job]) {
        return jobHierarchy[job].some(child => selectedJobs.includes(child));
    }
    // If job is a child and parent is selected → disable child
    const parent = getJobParent(job);
    if (parent && selectedJobs.includes(parent)) {
        return true;
    }
    return false;
}

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
    const selectedItems = state[`selected${capitalized}`];
    const max = getMaxSelection(category);
    const atMax = selectedItems.length >= max;

    gridElement.innerHTML = items.map(item => {
        // Separator / group break
        if (item === "") {
            return '<button class="separator"></button>';
        }

        const isSelected = selectedItems.includes(item);
        let disabled = false;
        
        // For jobs category, check hierarchy
        if (category === 'jobs') {
            disabled = isJobDisabledByHierarchy(item, selectedItems);
        }
        
        // For regions category, check "전국" logic
        if (category === 'regions') {
            if (item === '전국') {
                // Disable "전국" if any other region is selected
                disabled = selectedItems.some(r => r !== '전국');
            } else {
                // Disable other regions if "전국" is selected
                disabled = selectedItems.includes('전국');
            }
        }
        
        // Also disable if at max and not already selected
        if (!isSelected && atMax) {
            disabled = true;
        }

        const disabledClass = disabled ? 'disabled' : '';
        const disabledAttr = disabled ? 'disabled' : '';
        return `
            <button type="button" data-value="${item}" class="${isSelected ? 'selected' : ''} ${disabledClass}" ${disabledAttr}>${item}</button>
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

// Update "선택된 조건" summary chips
function updateSelectedSummary() {
    const selectedSection = document.querySelector('section.selected');
    if (!selectedSection) return;

    // Ensure chips container exists
    let chips = selectedSection.querySelector('.selected-chips');
    let placeholder = selectedSection.querySelector('.selected-placeholder');
    if (!chips) {
        chips = document.createElement('div');
        chips.className = 'selected-chips';
        selectedSection.appendChild(chips);
    }

    // Collect all selected items across categories (only array properties)
    const all = [];
    const categories = ['selectedRanks', 'selectedCareers', 'selectedJobs', 'selectedCompanies', 'selectedRegions'];
    
    categories.forEach(key => {
        const category = key.replace('selected', '').toLowerCase();
        const capitalized = category.charAt(0).toUpperCase() + category.slice(1);
        state[key].forEach(value => {
            all.push({ category, capitalized, value });
        });
    });

    if (all.length === 0) {
        chips.innerHTML = '';
        chips.style.display = 'none';
        if (placeholder) {
            placeholder.style.display = 'block';
        }
        return;
    }

    chips.style.display = 'flex';
    if (placeholder) {
        placeholder.style.display = 'none';
    }

    chips.innerHTML = all.map(item => `
        <span class="chip" data-category="${item.category}" data-value="${item.value}">
          ${item.value}
          <button class="chip-remove" aria-label="삭제">×</button>
        </span>
    `).join('');
}

// Initialize all grids
document.addEventListener('DOMContentLoaded', () => {
    ['ranks', 'careers', 'jobs', 'companies', 'regions'].forEach(category => {
        renderButtons(category);
    });
    updateCounters();
    updateSelectedSummary();
    
    // Show pagination on initial load and set to page 1
    const pagination = document.querySelector('.pagination');
    if (pagination) {
        pagination.style.display = 'flex';
        // Initialize pagination to page 1 with prev button disabled
        updatePagination();
    }
});

// Event delegation: toggle .selected when any grid or options button is clicked
// Toggle selection with max enforcement
function toggleSelect(category, value) {
    const capitalized = category.charAt(0).toUpperCase() + category.slice(1);
    const key = `selected${capitalized}`;
    const list = state[key];
    const max = getMaxSelection(category);

    const idx = list.indexOf(value);
    if (idx >= 0) {
        list.splice(idx, 1);
    } else {
        // Check if selection is blocked by hierarchy (jobs only)
        if (category === 'jobs') {
            if (isJobDisabledByHierarchy(value, list)) {
                return; // Cannot select due to parent/child conflict
            }
        }
        
        // Check if selection is blocked by "전국" logic (regions only)
        if (category === 'regions') {
            if (value === '전국' && list.length > 0) {
                return; // Cannot select "전국" if other regions are selected
            }
            if (value !== '전국' && list.includes('전국')) {
                return; // Cannot select other regions if "전국" is selected
            }
        }
        
        if (list.length >= max) {
            // Reached max; do nothing
            return;
        }
        list.push(value);
    }

    // Rerender affected grid, counters, and summary
    renderButtons(category);
    updateCounters();
    updateSelectedSummary();
    
    // Apply filtering based on selected conditions
    applyCurrentFilter();
}

// Grid button click handler (event delegation)
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.grid button');
    if (!btn) return;
    if (btn.classList.contains('separator')) return;

    const grid = btn.closest('.grid');
    if (!grid || !grid.id.endsWith('-grid')) return;
    const category = grid.id.replace('-grid', '');
    const value = btn.dataset.value || btn.textContent.trim();
    toggleSelect(category, value);
});

// Chip remove handler
document.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.chip-remove');
    if (!removeBtn) return;
    const chip = removeBtn.closest('.chip');
    if (!chip) return;
    const category = chip.dataset.category;
    const value = chip.dataset.value;

    const capitalized = category.charAt(0).toUpperCase() + category.slice(1);
    const key = `selected${capitalized}`;
    state[key] = state[key].filter(v => v !== value);
    renderButtons(category);
    updateCounters();
    updateSelectedSummary();
    
    // Apply filtering based on updated conditions
    applyCurrentFilter();
});

// Search functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const keyword = searchInput.value.trim();
            
            // Check if search input is empty
            if (!keyword) {
                alert('검색어를 작성해주세요.');
                return; // Do not proceed with search
            }
            
            state.searchKeyword = keyword;
            state.currentPage = 1; // Reset to first page on new search
            filterJobCards();
        });
        
        // Also trigger search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const keyword = searchInput.value.trim();
                
                // Check if search input is empty
                if (!keyword) {
                    alert('검색어를 작성해주세요.');
                    return; // Do not proceed with search
                }
                
                state.searchKeyword = keyword;
                state.currentPage = 1; // Reset to first page on new search
                filterJobCards();
            }
        });
    }
    
    // Reset button functionality
    if (resetBtn && searchInput) {
        resetBtn.addEventListener('click', () => {
            // Clear search input
            searchInput.value = '';
            // Reset search state
            state.searchKeyword = '';
            state.currentPage = 1;
            
            // If there are selected conditions, apply condition filter
            // Otherwise show all cards
            const hasConditions = state.selectedRanks.length > 0 || 
                                  state.selectedCareers.length > 0 || 
                                  state.selectedJobs.length > 0 || 
                                  state.selectedCompanies.length > 0 || 
                                  state.selectedRegions.length > 0;
            
            if (hasConditions) {
                // Apply condition filtering
                filterJobCardsByConditions();
            } else {
                // Show all job cards
                const jobCards = document.querySelectorAll('.job-card');
                jobCards.forEach(card => {
                    card.style.display = 'flex';
                });
                // Reset total count
                const totalCountEl = document.getElementById('total-count');
                if (totalCountEl) {
                    totalCountEl.textContent = '총 6,402건';
                }
                // Show pagination with all buttons enabled
                const pagination = document.querySelector('.pagination');
                if (pagination) {
                    pagination.style.display = 'flex';
                    
                    // Reset pagination buttons to initial state
                    const paginationNums = document.querySelectorAll('.pagination-num');
                    paginationNums.forEach((btn, index) => {
                        btn.classList.remove('disabled');
                        btn.disabled = false;
                        btn.classList.toggle('active', index === 0); // First page active
                    });
                    
                    // Set prev/next buttons
                    const prevBtn = document.querySelector('.pagination-prev');
                    const nextBtn = document.querySelector('.pagination-next');
                    if (prevBtn) {
                        prevBtn.classList.add('disabled');
                        prevBtn.disabled = true; // Disable prev on first page
                    }
                    if (nextBtn) {
                        nextBtn.classList.remove('disabled');
                        nextBtn.disabled = false;
                    }
                }
            }
        });
    }
    
    // Pagination click handlers
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('pagination-num')) {
            const page = parseInt(e.target.dataset.page);
            if (!isNaN(page)) {
                state.currentPage = page;
                applyCurrentFilter();
            }
        }
        
        if (e.target.classList.contains('pagination-prev')) {
            if (state.currentPage > 1) {
                state.currentPage--;
                applyCurrentFilter();
            }
        }
        
        if (e.target.classList.contains('pagination-next')) {
            const totalPages = getTotalPages();
            if (state.currentPage < totalPages) {
                state.currentPage++;
                applyCurrentFilter();
            }
        }
    });
});

// Get total number of pages based on visible cards
function getTotalPages() {
    const allCards = document.querySelectorAll('.job-card');
    let visibleCount = 0;
    
    // Count currently visible cards
    allCards.forEach(card => {
        const style = window.getComputedStyle(card);
        if (style.display !== 'none') {
            visibleCount++;
        }
    });
    
    return Math.ceil(visibleCount / state.itemsPerPage);
}

// Update pagination UI
function updatePagination() {
    const totalPages = getTotalPages();
    const paginationNums = document.querySelectorAll('.pagination-num');
    const prevBtn = document.querySelector('.pagination-prev');
    const nextBtn = document.querySelector('.pagination-next');
    
    // Check if showing default total count (6,402)
    const totalCountEl = document.getElementById('total-count');
    const isDefaultTotal = totalCountEl && totalCountEl.textContent === '총 6,402건';
    
    // Update number buttons
    paginationNums.forEach((btn, index) => {
        const pageNum = index + 1;
        
        // If default total, enable all 5 pages
        if (isDefaultTotal || pageNum <= totalPages) {
            btn.classList.remove('disabled');
            btn.disabled = false;
            btn.classList.toggle('active', pageNum === state.currentPage);
        } else {
            btn.classList.add('disabled');
            btn.disabled = true;
            btn.classList.remove('active');
        }
    });
    
    // Update prev/next buttons
    if (prevBtn) {
        if (state.currentPage <= 1) {
            prevBtn.classList.add('disabled');
            prevBtn.disabled = true;
        } else {
            prevBtn.classList.remove('disabled');
            prevBtn.disabled = false;
        }
    }
    
    if (nextBtn) {
        // If default total, always enable next button (unless on last page)
        if (isDefaultTotal) {
            if (state.currentPage >= 5) {
                nextBtn.classList.add('disabled');
                nextBtn.disabled = true;
            } else {
                nextBtn.classList.remove('disabled');
                nextBtn.disabled = false;
            }
        } else {
            if (state.currentPage >= totalPages) {
                nextBtn.classList.add('disabled');
                nextBtn.disabled = true;
            } else {
                nextBtn.classList.remove('disabled');
                nextBtn.disabled = false;
            }
        }
    }
}

// Filter job cards based on search keyword
function filterJobCards() {
    const jobCards = document.querySelectorAll('.job-card');
    const keyword = state.searchKeyword.toLowerCase();
    const totalCountEl = document.getElementById('total-count');
    
    // 항상 메시지 상태 확인 및 초기화
    let noResultMsg = document.querySelector('.no-result-message');
    
    if (!keyword) {
        // No keyword: show all cards, no pagination
        jobCards.forEach(card => {
            card.style.display = 'flex';
        });
        
        if (totalCountEl) {
            totalCountEl.textContent = '총 6,402건';
        }
        
        // 메시지 숨김
        if (noResultMsg) {
            noResultMsg.style.display = 'none';
        }
        
        // Hide pagination when no search
        const pagination = document.querySelector('.pagination');
        if (pagination) {
            pagination.style.display = 'none';
        }
        
        return;
    }
    
    // Filter and paginate cards
    let visibleCards = [];
    jobCards.forEach(card => {
        const title = card.querySelector('.job-info h4')?.textContent.toLowerCase() || '';
        const details = card.querySelector('.job-info p')?.textContent.toLowerCase() || '';
        const fullText = title + ' ' + details;
        
        if (fullText.includes(keyword)) {
            visibleCards.push(card);
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update total count
    const totalVisible = visibleCards.length;
    if (totalCountEl) {
        totalCountEl.textContent = `총 ${totalVisible}건`;
    }
    
    // 0건일 때 메시지 표시/숨김 처리 (검색어 기반)
    if (!noResultMsg) {
        noResultMsg = document.querySelector('.no-result-message');
    }
    if (totalVisible === 0) {
        if (!noResultMsg) {
            noResultMsg = document.createElement('div');
            noResultMsg.className = 'no-result-message';
            noResultMsg.textContent = '조건에 일치하는 공고가 존재하지 않습니다.';
            const jobList = document.querySelector('.job-list');
            const pagination = document.querySelector('.pagination');
            if (jobList && pagination) {
                jobList.insertBefore(noResultMsg, pagination);
            }
        }
        noResultMsg.style.display = 'block';
    } else {
        if (noResultMsg) {
            noResultMsg.style.display = 'none';
        }
    }
    
    // Show pagination if needed (45+ items or more than one page needed)
    const pagination = document.querySelector('.pagination');
    if (pagination) {
        if (totalVisible === 0) {
            pagination.style.display = 'none';
        } else if (totalVisible >= 45 || totalVisible > state.itemsPerPage) {
            pagination.style.display = 'flex';
        } else {
            pagination.style.display = 'none';
        }
    }
    
    // Apply pagination to visible cards
    const startIdx = (state.currentPage - 1) * state.itemsPerPage;
    const endIdx = startIdx + state.itemsPerPage;
    
    visibleCards.forEach((card, index) => {
        if (index >= startIdx && index < endIdx) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update pagination UI
    updatePagination();
}

// Filter job cards based on selected conditions (auto-filter)
function filterJobCardsByConditions() {
    const jobCards = document.querySelectorAll('.job-card');
    const totalCountEl = document.getElementById('total-count');
    
    // 메시지 요소를 함수 시작 부분에서 가져오기
    let noResultMsg = document.querySelector('.no-result-message');
    
    // Check if any conditions are selected
    const hasConditions = state.selectedRanks.length > 0 || 
                          state.selectedCareers.length > 0 || 
                          state.selectedJobs.length > 0 || 
                          state.selectedCompanies.length > 0 || 
                          state.selectedRegions.length > 0;
    
    if (!hasConditions) {
        // No conditions: show all cards
        jobCards.forEach(card => {
            card.style.display = 'flex';
        });
        
        if (totalCountEl) {
            totalCountEl.textContent = '총 6,402건';
        }
        
        // 메시지 숨김
        if (noResultMsg) {
            noResultMsg.style.display = 'none';
        }
        
        // Hide pagination when no filter
        const pagination = document.querySelector('.pagination');
        if (pagination) {
            pagination.style.display = 'none';
        }
        
        return;
    }
    
    // Create keyword sets for matching
    const rankKeywords = new Set(state.selectedRanks.map(r => r.toLowerCase()));
    const careerKeywords = new Set(state.selectedCareers.map(c => c.toLowerCase()));
    const jobKeywords = new Set(state.selectedJobs.map(j => j.toLowerCase()));
    const companyKeywords = new Set(state.selectedCompanies.map(c => c.toLowerCase()));
    const regionKeywords = new Set(state.selectedRegions.map(r => r.toLowerCase()));
    
    // Filter cards
    let visibleCards = [];
    jobCards.forEach(card => {
        const title = card.querySelector('.job-info h4')?.textContent.toLowerCase() || '';
        const details = card.querySelector('.job-info p')?.textContent.toLowerCase() || '';
        const fullText = title + ' ' + details;
        
        let matches = true;
        
        // Check rank conditions (OR logic within category)
        if (rankKeywords.size > 0) {
            let rankMatch = false;
            for (const keyword of rankKeywords) {
                if (fullText.includes(keyword)) {
                    rankMatch = true;
                    break;
                }
            }
            if (!rankMatch) matches = false;
        }
        
        // Check career conditions
        if (careerKeywords.size > 0) {
            let careerMatch = false;
            for (const keyword of careerKeywords) {
                // Extract just the numbers for matching (e.g., "3년~5년" -> "3", "5")
                const yearMatch = keyword.match(/(\d+)년/g);
                if (yearMatch) {
                    for (const year of yearMatch) {
                        if (fullText.includes(year)) {
                            careerMatch = true;
                            break;
                        }
                    }
                }
                if (careerMatch) break;
            }
            if (!careerMatch) matches = false;
        }
        
        // Check job conditions
        if (jobKeywords.size > 0) {
            let jobMatch = false;
            for (const keyword of jobKeywords) {
                // Handle shortened forms and variations
                if (keyword.includes('fe') || keyword.includes('프론트엔드')) {
                    if (fullText.includes('프론트엔드') || fullText.includes('frontend') || fullText.includes('fe')) {
                        jobMatch = true;
                        break;
                    }
                } else if (keyword.includes('be') || keyword.includes('백엔드')) {
                    if (fullText.includes('백엔드') || fullText.includes('backend') || fullText.includes('be') || fullText.includes('java')) {
                        jobMatch = true;
                        break;
                    }
                } else if (keyword.includes('개발')) {
                    if (fullText.includes('개발')) {
                        jobMatch = true;
                        break;
                    }
                } else if (keyword.includes('pm') || keyword.includes('기획')) {
                    if (fullText.includes('pm') || fullText.includes('기획')) {
                        jobMatch = true;
                        break;
                    }
                } else if (keyword.includes('it')) {
                    if (fullText.includes('it')) {
                        jobMatch = true;
                        break;
                    }
                } else if (fullText.includes(keyword)) {
                    jobMatch = true;
                    break;
                }
            }
            if (!jobMatch) matches = false;
        }
        
        // Check company conditions
        if (companyKeywords.size > 0) {
            let companyMatch = false;
            for (const keyword of companyKeywords) {
                if (fullText.includes(keyword)) {
                    companyMatch = true;
                    break;
                }
            }
            if (!companyMatch) matches = false;
        }
        
        // Check region conditions
        if (regionKeywords.size > 0) {
            let regionMatch = false;
            for (const keyword of regionKeywords) {
                if (keyword === '전국' || fullText.includes(keyword)) {
                    regionMatch = true;
                    break;
                }
            }
            if (!regionMatch) matches = false;
        }
        
        if (matches) {
            visibleCards.push(card);
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update total count
    const totalVisible = visibleCards.length;
    if (totalCountEl) {
        totalCountEl.textContent = `총 ${totalVisible}건`;
    }
    
    // 0건일 때 메시지 표시/숨김 처리 (조건 필터 기반)
    if (!noResultMsg) {
        noResultMsg = document.querySelector('.no-result-message');
    }
    if (totalVisible === 0) {
        if (!noResultMsg) {
            noResultMsg = document.createElement('div');
            noResultMsg.className = 'no-result-message';
            noResultMsg.textContent = '조건에 일치하는 공고가 존재하지 않습니다.';
            const jobList = document.querySelector('.job-list');
            const pagination = document.querySelector('.pagination');
            if (jobList && pagination) {
                jobList.insertBefore(noResultMsg, pagination);
            }
        }
        noResultMsg.style.display = 'block';
    } else {
        if (noResultMsg) {
            noResultMsg.style.display = 'none';
        }
    }
    
    // Show pagination if needed (45+ items or more than one page needed)
    const pagination = document.querySelector('.pagination');
    if (pagination) {
        if (totalVisible === 0) {
            pagination.style.display = 'none';
        } else if (totalVisible >= 45 || totalVisible > state.itemsPerPage) {
            pagination.style.display = 'flex';
        } else {
            pagination.style.display = 'none';
        }
    }
    
    // Apply pagination to visible cards
    state.currentPage = 1; // Reset to first page when filter changes
    const startIdx = (state.currentPage - 1) * state.itemsPerPage;
    const endIdx = startIdx + state.itemsPerPage;
    
    visibleCards.forEach((card, index) => {
        if (index >= startIdx && index < endIdx) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update pagination UI
    updatePagination();
}

// Helper function to apply current filter state (used by pagination)
function applyCurrentFilter() {
    // Check if search keyword exists
    if (state.searchKeyword) {
        filterJobCards();
        return;
    }
    
    // Check if any conditions are selected
    const hasConditions = state.selectedRanks.length > 0 || 
                          state.selectedCareers.length > 0 || 
                          state.selectedJobs.length > 0 || 
                          state.selectedCompanies.length > 0 || 
                          state.selectedRegions.length > 0;
    
    if (hasConditions) {
        filterJobCardsByConditions();
        return;
    }
    
    // No filters: show all cards
    const jobCards = document.querySelectorAll('.job-card');
    jobCards.forEach(card => {
        card.style.display = 'flex';
    });
    
    const totalCountEl = document.getElementById('total-count');
    if (totalCountEl) {
        totalCountEl.textContent = '총 6,402건';
    }
    
    // Reset to page 1
    state.currentPage = 1;
    
    const pagination = document.querySelector('.pagination');
    if (pagination) {
        pagination.style.display = 'flex'; // Show pagination on initial state
        
        // Reset pagination buttons to initial state (all enabled, page 1 active)
        const paginationNums = document.querySelectorAll('.pagination-num');
        paginationNums.forEach((btn, index) => {
            btn.classList.remove('disabled');
            btn.disabled = false;
            btn.classList.toggle('active', index === 0); // First page active
        });
        
        // Enable prev/next buttons
        const prevBtn = document.querySelector('.pagination-prev');
        const nextBtn = document.querySelector('.pagination-next');
        if (prevBtn) {
            prevBtn.classList.add('disabled');
            prevBtn.disabled = true; // Disable prev on first page
        }
        if (nextBtn) {
            nextBtn.classList.remove('disabled');
            nextBtn.disabled = false;
        }
    }
}

// 드롭다운 토글 기능
document.addEventListener('DOMContentLoaded', function() {
    const collapsibleLabel = document.querySelector('.collapsible-label');
    const collapsibleContent = document.querySelector('.collapsible-content');
    const toggleBtn = document.querySelector('.toggle-btn');
    const toggleText = document.querySelector('.toggle-text');

    if (collapsibleLabel && collapsibleContent && toggleBtn && toggleText) {
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            collapsibleContent.classList.toggle('collapsed');
            toggleBtn.classList.toggle('expanded');
            
            if (toggleBtn.classList.contains('expanded')) {
                toggleText.textContent = '접기';
            } else {
                toggleText.textContent = '펼쳐보기';
            }
        });
    }
    
    // 보유 스펙 검색 버튼 기능
    const specSearchBtn = document.querySelector('.spec-search-btn');
    if (specSearchBtn) {
        specSearchBtn.addEventListener('click', function() {
            filterJobsBySpec();
        });
    }
});

// 보유 스펙 기반 필터링 함수
function filterJobsBySpec() {
    const allJobCards = document.querySelectorAll('.job-card');
    let visibleCount = 0;
    
    // 검색어 입력창 초기화
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // 보유 스펙에서 선택된 값들 가져오기 (하드코딩된 예시값)
    const specRank = "파트장/그룹장";
    const specCareer = "3~5년"; // 3, 4, 5년 해당
    const specCompany = "중견기업";
    const specJob = "개발자";
    const specRegion = "서울";
    
    // 경력 범위 파싱
    const careerRange = parseCareerRange(specCareer);
    
    allJobCards.forEach(card => {
        const jobInfo = card.querySelector('.job-info p').textContent;
        
        // 각 조건 체크
        const matchesCareer = checkCareerMatch(jobInfo, careerRange);
        const matchesCompany = checkCompanyMatch(card.querySelector('.job-info h4').textContent, specCompany);
        const matchesJob = checkJobMatch(jobInfo, specJob);
        const matchesRegion = checkRegionMatch(jobInfo, specRegion);
        
        // 모든 조건이 맞으면 표시
        if (matchesCareer && matchesCompany && matchesJob && matchesRegion) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // 총 건수 업데이트
    const totalCountEl = document.getElementById('total-count');
    if (totalCountEl) {
        totalCountEl.textContent = `총 ${visibleCount}건`;
    }
    
    // 페이지네이션 업데이트
    updatePaginationForSpec(visibleCount);
    
    // 0건일 때 메시지 표시
    let noResultMsg = document.querySelector('.no-result-message');
    if (visibleCount === 0) {
        if (!noResultMsg) {
            noResultMsg = document.createElement('div');
            noResultMsg.className = 'no-result-message';
            noResultMsg.textContent = '조건에 일치하는 공고가 존재하지 않습니다.';
            const jobList = document.querySelector('.job-list');
            const pagination = document.querySelector('.pagination');
            if (jobList && pagination) {
                jobList.insertBefore(noResultMsg, pagination);
            }
        }
        noResultMsg.style.display = 'block';
    } else {
        if (noResultMsg) {
            noResultMsg.style.display = 'none';
        }
    }
}

// 보유 스펙 검색 결과에 따른 페이지네이션 업데이트
function updatePaginationForSpec(totalCount) {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;
    
    // 0건이면 페이지네이션 숨기기
    if (totalCount === 0) {
        pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'flex';
    
    // 페이지당 9건 기준으로 필요한 페이지 수 계산
    const itemsPerPage = 9;
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    
    // 페이지 번호 버튼들 가져오기
    const pageButtons = pagination.querySelectorAll('.pagination-num');
    const prevBtn = pagination.querySelector('.pagination-prev');
    const nextBtn = pagination.querySelector('.pagination-next');
    
    // 각 페이지 버튼 활성화/비활성화
    pageButtons.forEach((btn, index) => {
        const pageNum = index + 1;
        if (pageNum <= totalPages) {
            btn.style.display = 'inline-block';
            btn.disabled = false;
            btn.classList.remove('disabled');
            // 첫 페이지 활성화
            if (pageNum === 1) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        } else {
            btn.style.display = 'none';
        }
    });
    
    // 이전/다음 버튼 상태
    if (prevBtn) {
        prevBtn.classList.add('disabled');
        prevBtn.disabled = true;
    }
    
    if (nextBtn) {
        if (totalPages <= 1) {
            nextBtn.classList.add('disabled');
            nextBtn.disabled = true;
        } else {
            nextBtn.classList.remove('disabled');
            nextBtn.disabled = false;
        }
    }
}

// 경력 범위 파싱 (예: "3~5년" -> [3, 4, 5])
function parseCareerRange(careerStr) {
    if (careerStr === "1년~3년") return [1, 2, 3];
    if (careerStr === "3년~5년") return [3, 4, 5];
    if (careerStr === "5년~7년") return [5, 6, 7];
    if (careerStr === "7년~10년") return [7, 8, 9, 10];
    if (careerStr === "10년~15년") return [10, 11, 12, 13, 14, 15];
    if (careerStr === "15년~") return Array.from({length: 20}, (_, i) => i + 15); // 15~35년
    return [];
}

// 경력 매칭 체크
function checkCareerMatch(jobInfo, careerRange) {
    // "경력: 5년 이상" 또는 "경력: 3년" 등의 패턴 파싱
    const careerMatch = jobInfo.match(/경력:\s*(\d+)년/);
    if (!careerMatch) return false;
    
    const jobCareerYears = parseInt(careerMatch[1]);
    return careerRange.includes(jobCareerYears);
}

// 기업 형태 매칭 체크
function checkCompanyMatch(jobTitle, specCompany) {
    const companyKeywords = {
        "대기업": ["대기업"],
        "중견기업": ["중견기업"],
        "중소기업": ["중소기업"],
        "외국계": ["외국계"],
        "공기업": ["공기업", "공공기관"],
        "벤처기업": ["벤처", "스타트업"]
    };
    
    const keywords = companyKeywords[specCompany] || [];
    return keywords.some(keyword => jobTitle.includes(keyword));
}

// 직무 매칭 체크
function checkJobMatch(jobInfo, specJob) {
    // "직무: 프론트엔드 개발" 등의 패턴에서 직무 추출
    const jobMatch = jobInfo.match(/직무:\s*([^|]+)/);
    if (!jobMatch) return false;
    
    const jobText = jobMatch[1].trim();
    
    // 직무 키워드 매칭
    const jobKeywords = {
        "개발자": ["개발", "프론트엔드", "백엔드", "풀스택", "FE", "BE"],
        "PM/PO/기획자": ["기획", "PM", "PO"],
        "데이터 분석가": ["데이터", "분석"],
        "인프라/클라우드": ["인프라", "클라우드", "시스템", "운영"],
        "UI/UX": ["디자인", "UI", "UX"],
        "마케터": ["마케팅", "마케터"],
        "QA/테스터": ["QA", "테스트"],
        "HR/리크루터": ["HR", "인사"]
    };
    
    const keywords = jobKeywords[specJob] || [specJob];
    return keywords.some(keyword => jobText.includes(keyword));
}

// 지역 매칭 체크
function checkRegionMatch(jobInfo, specRegion) {
    // "지역: 서울" 등의 패턴에서 지역 추출
    const regionMatch = jobInfo.match(/지역:\s*([^|]+)/);
    if (!regionMatch) return false;
    
    const regionText = regionMatch[1].trim();
    return regionText.includes(specRegion);
}

