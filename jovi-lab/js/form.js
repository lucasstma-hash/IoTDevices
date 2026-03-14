// ===== FORM STATE =====
let formData = {};
let formPhotoURL = null;
let editingReviewId = null;

// ===== BUILD ACCORDIONS =====
function buildAccordions() {
  const secs = DEFS[curTab].sections;
  const container = document.getElementById('acc-sections');
  container.innerHTML = secs.map(sec => {
    const isOpen = sec.k === 'photo';
    return `
    <div class="accordion" id="acc-${sec.k}">
      <div class="acc-header" onclick="toggleAcc('${sec.k}')">
        <div class="acc-left">
          <div class="acc-num">${sec.n}</div>
          <span class="acc-title">${sec.t}</span>
        </div>
        <div class="acc-meta">
          <span class="acc-score-badge" id="asb-${sec.k}"></span>
          <span class="acc-arrow ${isOpen ? 'open' : ''}" id="aar-${sec.k}">⌄</span>
        </div>
      </div>
      <div class="acc-body ${isOpen ? 'open' : ''}" id="ab-${sec.k}">
        ${sec.k === 'photo'    ? buildPhotoSection() :
          sec.k === 'verdict' ? buildVerdictSection() :
          buildFields(sec) + (sec.sk ? buildRatingBlock(sec.k, sec.sk) : '')}
      </div>
    </div>`;
  }).join('');
}

function toggleAcc(k) {
  document.getElementById('ab-' + k).classList.toggle('open');
  document.getElementById('aar-' + k).classList.toggle('open');
}

// ===== PHOTO SECTION =====
function buildPhotoSection() {
  return `<div class="field-block">
    <div class="field-label">Product Photo</div>
    <div class="photo-upload-wrap" id="photo-wrap">
      <label class="photo-upload">
        <svg viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
        <span>Tap to upload photo</span>
        <span class="sub">JPG, PNG, WEBP</span>
        <input type="file" accept="image/*" onchange="handlePhoto(event)">
      </label>
    </div>
  </div>`;
}

function handlePhoto(e) {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    formPhotoURL = ev.target.result;
    document.getElementById('photo-wrap').innerHTML = `
      <img class="photo-preview" src="${formPhotoURL}" onclick="clearPhoto()" title="Click to remove" alt="Product photo">
      <span class="photo-remove" onclick="clearPhoto()">✕ Remove photo</span>`;
  };
  reader.readAsDataURL(file);
}

function clearPhoto() {
  formPhotoURL = null;
  document.getElementById('photo-wrap').innerHTML = `
    <label class="photo-upload">
      <svg viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
      <span>Tap to upload photo</span>
      <span class="sub">JPG, PNG, WEBP</span>
      <input type="file" accept="image/*" onchange="handlePhoto(event)">
    </label>`;
}

// ===== FIELD BUILDER =====
function buildFields(sec) {
  return (sec.f || []).map(f => {
    const hint = f.h ? `<div class="field-hint">${f.h}</div>` : '';
    if (f.tp === 'ta')  return `<div class="field-block"><div class="field-label">${f.l}</div>${hint}<textarea id="ff-${f.k}" placeholder="Write your notes here..." oninput="fd('${f.k}', this.value)"></textarea></div>`;
    if (f.tp === 'sel') return `<div class="field-block"><div class="field-label">${f.l}</div>${hint}<select id="ff-${f.k}" onchange="fd('${f.k}', this.value)"><option value="">Select...</option>${(f.o||[]).map(o=>`<option>${o}</option>`).join('')}</select></div>`;
    if (f.tp === 'num') return `<div class="field-block"><div class="field-label">${f.l}</div>${hint}<input type="number" id="ff-${f.k}" placeholder="${f.h||''}" oninput="fd('${f.k}', this.value)"></div>`;
    return `<div class="field-block"><div class="field-label">${f.l}</div>${hint}<input type="text" id="ff-${f.k}" placeholder="${f.h||''}" oninput="fd('${f.k}', this.value)"></div>`;
  }).join('');
}

// ===== RATING BLOCK =====
function buildRatingBlock(secK, storeK) {
  const btns = [1,2,3,4,5,6,7,8,9,10].map(n =>
    `<button type="button" class="rb" data-sec="${secK}" data-sk="${storeK}" data-n="${n}" onclick="setScore(this)">${n}</button>`
  ).join('');
  return `<div class="field-block">
    <div class="field-label" style="margin-bottom:6px">Section Score</div>
    <div class="rating-row" id="rr-${secK}">
      ${btns}
      <span class="rating-score-label" id="rsl-${secK}"></span>
    </div>
  </div>`;
}

// ===== SET SCORE — KEY FIX =====
function setScore(btn) {
  const secK  = btn.getAttribute('data-sec');
  const storeK = btn.getAttribute('data-sk');
  const n     = parseInt(btn.getAttribute('data-n'), 10);

  formData[storeK] = n;

  // Update all buttons in this rating row
  const row = document.getElementById('rr-' + secK);
  row.querySelectorAll('.rb').forEach(b => {
    const bN = parseInt(b.getAttribute('data-n'), 10);
    b.className = 'rb'; // reset
    if (bN <= n) {
      b.classList.add('selected');
      if (n >= 8) { /* green — default */ }
      else if (n >= 5) b.classList.add('range-yellow');
      else b.classList.add('range-red');
    }
    if (bN === n) b.classList.add('active-btn');
  });

  // Score label  "9/10"
  const label = document.getElementById('rsl-' + secK);
  if (label) {
    label.textContent = n + '/10';
    label.className = 'rating-score-label ' + (n >= 8 ? 'green' : n >= 5 ? 'yellow' : 'red');
  }

  // Section badge in accordion header
  const badge = document.getElementById('asb-' + secK);
  if (badge) {
    badge.style.display = 'inline-block';
    badge.textContent = n + '/10';
    badge.className = 'acc-score-badge ' + (n >= 8 ? 's-g' : n >= 5 ? 's-y' : 's-r');
  }

  // Update overall score display
  updateOverallDisplay();
}

// ===== VERDICT SECTION =====
function buildVerdictSection() {
  return `
  <div class="field-block">
    <div class="field-label">Overall Score (auto-calculated)</div>
    <div class="field-hint">Average of all section scores</div>
    <div class="overall-box" id="overall-box">
      <span class="overall-box-num" id="overall-num">—</span>
      <span class="overall-box-denom">/10</span>
    </div>
  </div>
  <div class="field-block"><div class="field-label">Pros</div><div class="field-hint">Top strengths of this device</div><textarea id="ff-pros" placeholder="Top strengths..." oninput="fd('pros', this.value)"></textarea></div>
  <div class="field-block"><div class="field-label">Cons</div><div class="field-hint">Main weaknesses or deal-breakers</div><textarea id="ff-cons" placeholder="Main weaknesses..." oninput="fd('cons', this.value)"></textarea></div>
  <div class="field-block"><div class="field-label">Final Verdict</div><div class="field-hint">Your overall conclusion and who you'd recommend this to</div><textarea id="ff-verdict" placeholder="Your conclusion..." oninput="fd('final_verdict', this.value)"></textarea></div>`;
}

function updateOverallDisplay() {
  const sm = DEFS[curTab].scoreMap;
  const vals = Object.keys(sm).map(k => formData[k]).filter(v => v && v > 0);
  const ov = vals.length ? Math.round((vals.reduce((a,b) => a + b, 0) / vals.length) * 10) / 10 : null;
  const box = document.getElementById('overall-box');
  const num = document.getElementById('overall-num');
  if (!box || !num) return;
  const cls = scoreBoxClass(ov);
  box.className = 'overall-box' + (cls ? ' ' + cls : '');
  num.className = 'overall-box-num' + (cls ? ' ' + cls : '');
  num.textContent = ov !== null ? String(ov) : '—';
}

// ===== FORM DATA =====
function fd(k, v) {
  formData[k] = v;
  if (k === 'brand' || k === 'model') {
    const title = ((formData.brand || '') + (formData.model ? ' ' + formData.model : '')).trim();
    document.getElementById('add-title').textContent = title || 'New Review';
  }
}

function collectReview(completed) {
  const secs = DEFS[curTab].sections;
  const r = { ...formData, type: curTab, completed, photo: formPhotoURL };
  if (!r.id) r.id = editingReviewId || genId();
  // Collect all textarea/input/select values too (in case user typed without triggering oninput on some)
  secs.forEach(sec => {
    (sec.f || []).forEach(f => {
      const el = document.getElementById('ff-' + f.k);
      if (el && el.value) r[f.k] = el.value;
    });
  });
  ['pros', 'cons', 'final_verdict'].forEach(k => {
    const el = document.getElementById('ff-' + k);
    if (el) r[k] = el.value;
  });
  return r;
}

// ===== POPULATE FORM for editing =====
function populateForm(r) {
  formData = { ...r };
  formPhotoURL = r.photo || null;
  editingReviewId = r.id;

  // Wait for DOM to be built, then fill
  setTimeout(() => {
    const secs = DEFS[r.type].sections;
    // Photo
    if (r.photo) {
      const pw = document.getElementById('photo-wrap');
      if (pw) pw.innerHTML = `<img class="photo-preview" src="${r.photo}" onclick="clearPhoto()" alt="Photo"><span class="photo-remove" onclick="clearPhoto()">✕ Remove photo</span>`;
    }
    // Fields
    secs.forEach(sec => {
      (sec.f || []).forEach(f => {
        const el = document.getElementById('ff-' + f.k);
        if (el && r[f.k] !== undefined) el.value = r[f.k];
      });
      // Restore ratings
      if (sec.sk && r[sec.sk]) {
        const n = r[sec.sk];
        const row = document.getElementById('rr-' + sec.k);
        if (row) {
          row.querySelectorAll('.rb').forEach(b => {
            const bN = parseInt(b.getAttribute('data-n'), 10);
            b.className = 'rb';
            if (bN <= n) {
              b.classList.add('selected');
              if (n < 5) b.classList.add('range-red');
              else if (n < 8) b.classList.add('range-yellow');
            }
            if (bN === n) b.classList.add('active-btn');
          });
          const lbl = document.getElementById('rsl-' + sec.k);
          if (lbl) { lbl.textContent = n + '/10'; lbl.className = 'rating-score-label ' + (n >= 8 ? 'green' : n >= 5 ? 'yellow' : 'red'); }
          const badge = document.getElementById('asb-' + sec.k);
          if (badge) { badge.style.display = 'inline-block'; badge.textContent = n + '/10'; badge.className = 'acc-score-badge ' + (n >= 8 ? 's-g' : n >= 5 ? 's-y' : 's-r'); }
        }
      }
    });
    ['pros','cons','final_verdict'].forEach(k => {
      const el = document.getElementById('ff-' + k);
      if (el && r[k]) el.value = r[k];
    });
    updateOverallDisplay();
  }, 50);
}
