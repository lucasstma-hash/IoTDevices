// ===== DETAIL PAGE =====
function showDetail(id) {
  const r = loadReviews().find(x => x.id === id);
  if (!r) return;

  const ov = calcOverall(r);
  const c  = scoreColor(ov);
  const sm = DEFS[r.type].scoreMap;
  const circ = 2 * Math.PI * 34;
  const dash = ov ? (circ * ov / 10).toFixed(1) : '0';

  // Score bars
  const bars = Object.entries(sm).map(([k, lbl]) => {
    const v = r[k] || 0;
    return `<div class="score-bar-row">
      <span class="score-bar-name">${lbl}</span>
      <div class="score-bar-track"><div class="score-bar-fill" style="width:${v*10}%;background:${barColor(v)}"></div></div>
      <span class="score-bar-val" style="color:${barColor(v)}">${v || '—'}</span>
    </div>`;
  }).join('');

  // Full section details
  const secs = DEFS[r.type].sections.filter(s => s.k !== 'photo' && s.k !== 'verdict');
  const fullDetails = secs.map(sec => {
    const filled = (sec.f || []).filter(f => r[f.k] && r[f.k] !== '');
    if (!filled.length) return '';
    const sv = sec.sk ? r[sec.sk] : null;
    const rows = filled.map(f => `<tr>
      <td class="dt-key">${f.l}</td>
      <td class="dt-val">${r[f.k]}</td>
    </tr>`).join('');
    return `<div style="margin-bottom:14px">
      <div class="detail-section-header">
        ${sec.n}. ${sec.t.toUpperCase()}
        ${sv ? `<span class="s-badge ${scoreClass(sv)}">${sv}</span>` : ''}
      </div>
      <table class="details-table">${rows}</table>
    </div>`;
  }).join('');

  const typeCls = { smartphone:'type-p', smartwatch:'type-s', tws:'type-t', iot:'type-i' };

  document.getElementById('detail-body').innerHTML = `
    <div class="detail-hero">
      ${r.photo ? `<img class="detail-hero-photo" src="${r.photo}" alt="${r.model || ''}">` : ''}
      <div class="detail-hero-body">
        <div class="detail-hero-info">
          <div class="detail-brand">${r.brand || '—'}</div>
          <div class="detail-model">${r.model || 'New Device'}</div>
          <div class="detail-price">
            ${r.retail_price ? `<span>R$ ${parseInt(r.retail_price).toLocaleString('pt-BR')}</span><span style="color:#374151">·</span>` : ''}
            <span class="type-badge ${typeCls[r.type]}">${TYPE_LABELS[r.type]}</span>
            ${r.positioning ? `<span style="font-size:10px;color:#6e7681">· ${r.positioning}</span>` : ''}
          </div>
        </div>
        <div class="detail-ring">
          <svg width="78" height="78" viewBox="0 0 78 78">
            <circle cx="39" cy="39" r="34" fill="none" stroke="#21262d" stroke-width="5"/>
            <circle cx="39" cy="39" r="34" fill="none" stroke="${c}" stroke-width="5"
              stroke-dasharray="${dash} ${circ.toFixed(1)}" stroke-linecap="round"/>
          </svg>
          <div style="z-index:1;text-align:center">
            <div class="detail-ring-score" style="color:${c}">${ov ?? '—'}</div>
            <div class="detail-ring-denom">/10</div>
          </div>
        </div>
      </div>
      ${r.final_verdict ? `<div class="detail-verdict">"${r.final_verdict}"</div>` : ''}
    </div>

    <div class="accordion" style="margin-bottom:10px">
      <div style="padding:14px 16px">
        <div class="dash-card-title">Category Scores</div>
        ${bars}
      </div>
    </div>

    ${(r.pros || r.cons) ? `
    <div class="accordion" style="margin-bottom:10px">
      <div style="padding:14px 16px">
        <div class="dash-card-title">Pros &amp; Cons</div>
        <div class="pc-grid">
          ${r.pros ? `<div class="pc-box" style="background:#0d422022;border:1px solid #2ea04322"><div style="font-size:10px;font-weight:700;color:#3fb950">✓ PROS</div><p>${r.pros}</p></div>` : ''}
          ${r.cons ? `<div class="pc-box" style="background:#3d0c1222;border:1px solid #da363322"><div style="font-size:10px;font-weight:700;color:#f85149">✗ CONS</div><p>${r.cons}</p></div>` : ''}
        </div>
      </div>
    </div>` : ''}

    ${fullDetails ? `
    <div class="accordion" style="margin-bottom:10px">
      <div style="padding:14px 16px">
        <div class="dash-card-title">Full Review Details</div>
        ${fullDetails}
      </div>
    </div>` : ''}

    <div class="action-row">
      <button class="btn-del-sm" onclick="deleteAndGoHome('${r.id}')">Delete</button>
      <button class="btn-export" onclick="exportXlsx('${r.id}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Excel
      </button>
      <button class="btn-export" onclick="exportSinglePptx('${r.id}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
        PowerPoint
      </button>
      <button class="btn-export" onclick="goEditReview('${r.id}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        Edit
      </button>
      <button class="btn-outline" onclick="goHome()">Back</button>
    </div>`;

  showPage('detail');
}

function deleteAndGoHome(id) {
  if (!confirm('Delete this review permanently?')) return;
  deleteReview(id);
  goHome();
}
