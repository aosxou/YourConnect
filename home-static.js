// 정적 Home 페이지 동적 렌더링 스크립트
// 데이터 정의
const mentors = [
  { name: '평점', rating: 4.78, ratingCount: 40, title: '멘토 이름 : 이서준', field: '전문 분야 : IT/백엔드 개발자', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { name: '평점', rating: 4.8, ratingCount: 52, title: '멘토명 : 박현우', field: '전문 분야 : 금융/전략 기획', image: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { name: '평점', rating: 4.68, ratingCount: 48, title: '멘토명 : 배한결', field: '전문 분야 : 경영 컨설턴트/재무', image: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { name: '평점', rating: 4.72, ratingCount: 35, title: '멘토명 : 정재윤', field: '전문 분야 : AI 개발자/연구원', image: 'https://randomuser.me/api/portraits/men/4.jpg' },
  { name: '평점', rating: 4.82, ratingCount: 61, title: '멘토명 : 서유진', field: '전문 분야 : 인사(HR)/전문 커리어 코치', image: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { name: '평점', rating: 4.67, ratingCount: 54, title: '멘토명 : 최가은', field: '전문 분야 : 데이터 분석가/PM', image: 'https://randomuser.me/api/portraits/women/2.jpg' }
];

const jobPostings = [
  { company: '유한대', badge: '유명기업', title: '보령 대기업 IT 디지털 기획 과장, 차장급 구함 (국가리언)', deadline: '1월 오늘까지 - 12/20(월)', tags: ['대졸이상','통신업','경력5년','통신관리','소프트웨어'], detail: '경력 기간 이상 · 대졸 이상 · 서울 > 송파구' },
  { company: '안마영', badge: '다양한그룹 외주 기업 개발자 모집 인원', title: '[대전/2개월/유성] 대기업 솔루션 연계 프로젝트 개발자 고급 모집', deadline: '1월 오늘까지 - 10/30(월)', tags: ['서류전형','면접전형','시험면접','인적성검사'], detail: '임금/복지/4대보험 경력 10년 이상 - 학력무관 - 서울 > 송파구' }
];

const qnaList = [
  { category: '이력서', views: '3일전', author: 'ㅇㅇㄱ 개발자님', title: 'RN 개발자 커리어 어떻게 쌓아올까요?', tags: ['#react','#native','#진로고민','#코딩','#실무'] },
  { category: '이력서', views: '14일전', author: 'ㅇㅇ개발자님', title: 'iOS 개발자 코드스 플랫폼(RN) 전환 어떻게 ...', tags: ['#react','#native','#진로고민','#코딩','#실무'] },
  { category: '이력서', views: '15일전', author: 'ㅇㅇ개발자님', title: '웹 프론트 앤도 도전 중인데, Firebase말고도 ...', tags: ['#react','#프론트','#javascript','#개발자','#실무'] },
  { category: '이력서', views: '3일전', author: 'ㅇㅇ개발자님', title: '4학년 취준생인데 이번 플젝을 프로젝트 써도 될까요?', tags: ['#코딩','#프로젝트외주'] }
];

function renderMentors() {
  const grid = document.getElementById('mentor-grid-home');
  if (!grid) return;
  grid.innerHTML = mentors.map(m => `
    <div class="mentor-card-home">
      <div class="mentor-header-actions">
        <button class="detail-btn" data-name="${m.title}">상세 정보</button>
        <button class="apply-btn-home" data-name="${m.title}">멘토링 신청</button>
      </div>
      <img src="${m.image}" alt="${m.title}" class="mentor-avatar" />
      <div class="mentor-rating">
        <span class="label">${m.name}</span>
        <span class="star">⭐</span>
        <span class="score">${m.rating}</span>
        <span class="count">(${m.ratingCount})</span>
      </div>
      <h3 class="mentor-name">${m.title}</h3>
      <p class="mentor-field">${m.field}</p>
    </div>
  `).join('');
}

function renderJobs() {
  const list = document.getElementById('job-list-home');
  if (!list) return;
  list.innerHTML = jobPostings.map(j => `
    <div class="job-card-home">
      <div class="job-header">
        <span class="company-name">${j.company}</span>
        <span class="company-badge">${j.badge}</span>
      </div>
      <h3 class="job-title">${j.title}</h3>
      <p class="job-deadline">${j.deadline}</p>
      <div class="job-tags">${j.tags.map(t => `<span class='job-tag'>${t}</span>`).join('')}</div>
      <p class="job-detail">${j.detail}</p>
      <div class="job-actions">
        <button class="bookmark-btn" aria-label="즐겨찾기">☆</button>
        <button class="apply-btn-job">지원 공고 확인</button>
      </div>
    </div>
  `).join('');
}

function renderQnA() {
  const box = document.getElementById('qna-list');
  if (!box) return;
  box.innerHTML = qnaList.map(q => `
    <div class="qna-card">
      <div class="qna-header">
        <span class="qna-category">${q.category}</span>
        <span class="qna-views">${q.views}</span>
        <span class="qna-author">${q.author}</span>
      </div>
      <h3 class="qna-title" title="${q.title}">${q.title}</h3>
      <div class="qna-tags">${q.tags.map(t => `<span class='qna-tag'>${t}</span>`).join('')}</div>
    </div>
  `).join('');
}

function wireEvents() {
  // 멘토 상세/신청 버튼 예시 핸들러
  document.addEventListener('click', (e) => {
    if (e.target.matches('.detail-btn')) {
      alert(`${e.target.dataset.name} 상세 정보 (추후 구현)`);
    }
    if (e.target.matches('.apply-btn-home')) {
      alert(`${e.target.dataset.name} 멘토링 신청 (추후 구현)`);
    }
    if (e.target.matches('.apply-btn-job')) {
      alert('채용 공고 상세 (추후 구현)');
    }
    if (e.target.matches('.bookmark-btn')) {
      e.target.textContent = e.target.textContent === '☆' ? '★' : '☆';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderMentors();
  renderJobs();
  renderQnA();
  wireEvents();
});
