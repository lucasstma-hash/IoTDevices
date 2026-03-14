// ===== APP STATE =====
let curTab = 'smartphone';

// ===== PAGE ROUTING =====
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  window.scrollTo(0, 0);
}

function goHome() {
  showPage('home');
  renderList();
}

function goAdd() {
  formData = {};
  formPhotoURL = null;
  editingReviewId = null;
  document.getElementById('add-title').textContent = 'New Review';
  document.getElementById('add-sub').textContent = TYPE_LABELS[curTab] + ' · Draft';
  document.getElementById('btn-complete').style.background = TYPE_COLORS[curTab];
  buildAccordions();
  showPage('add');
}

function goEditReview(id) {
  const r = loadReviews().find(x => x.id === id);
  if (!r) return;
  formData = { ...r };
  formPhotoURL = r.photo || null;
  editingReviewId = r.id;
  document.getElementById('add-title').textContent = (r.brand || '') + (r.model ? ' ' + r.model : '');
  document.getElementById('add-sub').textContent = TYPE_LABELS[r.type] + ' · Editing';
  document.getElementById('btn-complete').style.background = TYPE_COLORS[r.type];
  buildAccordions();
  populateForm(r);
  showPage('add');
}

function goDash() {
  selIds = loadReviews().filter(r => r.type === curTab).slice(0, 3).map(r => r.id);
  renderDash();
  showPage('dash');
}

// ===== TAB SWITCHING =====
function switchTab(tab, btn) {
  curTab = tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('cta-banner').style.background = TYPE_COLORS[tab];
  document.getElementById('cta-title').textContent = 'New ' + TYPE_LABELS[tab] + ' Review';
  renderList();
}

// ===== REVIEW LIST =====
function renderList() {
  const list = loadReviews().filter(r => r.type === curTab);
  const el   = document.getElementById('reviews-list');

  if (!list.length) {
    el.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="5" y="2" width="14" height="20" rx="2"/>
          <line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="13" y2="13"/>
        </svg>
        <p>No ${TYPE_LABELS[curTab]} reviews yet</p>
      </div>`;
    return;
  }

  el.innerHTML = list.map(r => {
    const ov   = calcOverall(r);
    const c    = scoreColor(ov);
    const circ = 2 * Math.PI * 17;
    const dash = ov ? (circ * ov / 10).toFixed(1) : '0';

    return `
    <div class="review-card" onclick="showDetail('${r.id}')">
      <div class="review-thumb">
        ${r.photo
          ? `<img src="${r.photo}" alt="${r.model || ''}">`
          : `<span style="font-size:18px">${EMOJIS[r.type]}</span>`}
      </div>
      <div class="review-info">
        <div class="review-brand">${r.brand || '—'}</div>
        <div class="review-model">${r.model || 'New Device'}</div>
        <div class="review-meta">
          ${r.retail_price ? `<span>R$ ${parseInt(r.retail_price).toLocaleString('pt-BR')}</span><span>·</span>` : ''}
          <span class="type-badge ${TYPE_CLASS[r.type]}">${TYPE_LABELS[r.type]}</span>
          <span>·</span>
          <span class="status-dot" style="background:${r.completed ? '#2ea043' : '#d29922'}"></span>
          <span>${r.completed ? 'Completed' : 'Draft'}</span>
        </div>
      </div>
      <div class="score-ring">
        <svg width="42" height="42" viewBox="0 0 42 42">
          <circle cx="21" cy="21" r="17" fill="none" stroke="#21262d" stroke-width="3"/>
          <circle cx="21" cy="21" r="17" fill="none" stroke="${c}" stroke-width="3"
            stroke-dasharray="${dash} ${circ.toFixed(1)}" stroke-linecap="round"/>
        </svg>
        <span class="score-ring-num" style="color:${c}">${ov ?? '—'}</span>
      </div>
    </div>`;
  }).join('');
}

// ===== SAVE ACTIONS =====
function quickSave() {
  const r = collectReview(false);
  updateReview(r);
  document.getElementById('add-title').textContent = (r.brand || '') + (r.model ? ' ' + r.model : '');
  // Flash saved
  const btn = document.querySelector('.save-icon-btn');
  btn.style.color = '#3fb950';
  setTimeout(() => { btn.style.color = ''; }, 1200);
}

function saveDraft() {
  const r = collectReview(false);
  updateReview(r);
  goHome();
}

function saveComplete() {
  const r = collectReview(true);
  updateReview(r);
  showDetail(r.id);
}

function deleteCurrentReview() {
  if (!editingReviewId) return;
  if (!confirm('Delete this review permanently?')) return;
  deleteReview(editingReviewId);
  editingReviewId = null;
  goHome();
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Set initial CTA color
  document.getElementById('cta-banner').style.background = TYPE_COLORS[curTab];
  renderList();
});
