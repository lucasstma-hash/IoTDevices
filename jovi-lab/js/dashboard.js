// ===== DASHBOARD STATE =====
let selIds = [];
let radarChart = null, barChart = null;

function renderDash() {
  const list = loadReviews().filter(r => r.type === curTab);

  document.getElementById('dash-chips').innerHTML = list.map((r, i) => {
    const idx = selIds.indexOf(r.id);
    const on  = idx !== -1;
    const ov  = calcOverall(r);
    return `<div class="d-chip ${on ? 'on' : ''}" onclick="toggleDashChip('${r.id}')">
      <div class="d-chip-dot" style="background:${on ? CHART_COLORS[idx] : '#374151'}"></div>
      <span>${r.brand || ''} ${r.model || 'Device'}</span>
      ${ov ? `<span class="d-chip-score">${ov}</span>` : ''}
    </div>`;
  }).join('');

  renderDashBody();
}

function toggleDashChip(id) {
  if (selIds.includes(id)) selIds = selIds.filter(x => x !== id);
  else if (selIds.length < 6) selIds.push(id);
  renderDash();
}

function renderDashBody() {
  const allReviews = loadReviews();
  const compared   = allReviews.filter(r => selIds.includes(r.id));
  const body       = document.getElementById('dash-body');

  if (!compared.length) {
    body.innerHTML = '<p class="hint-text" style="text-align:center;padding:28px">Select at least one device above</p>';
    return;
  }

  const sm = DEFS[curTab].scoreMap;
  const theadCols = compared.map((w, i) =>
    `<th style="color:${CHART_COLORS[selIds.indexOf(w.id)]}">${(w.brand || '') + ' ' + (w.model || '')}</th>`
  ).join('');

  const tableRows = Object.entries(sm).map(([k, lbl]) => {
    const cells = compared.map(w => {
      const v = w[k];
      return `<td style="text-align:center"><span class="s-badge ${scoreClass(v)}">${v ?? '—'}</span></td>`;
    }).join('');
    return `<tr><td>${lbl}</td>${cells}</tr>`;
  }).join('');

  const ovrCells = compared.map(w => {
    const v = calcOverall(w);
    return `<td style="text-align:center"><span class="s-badge ${scoreClass(v)}" style="font-size:12px">${v ?? '—'}</span></td>`;
  }).join('');

  // Pros/Cons cards
  const pcCards = compared.filter(w => w.pros || w.cons).map(w => `
    <div class="accordion" style="margin-bottom:8px">
      <div style="padding:13px 15px">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px">
          <div class="d-chip-dot" style="background:${CHART_COLORS[selIds.indexOf(w.id)]}"></div>
          <span style="font-size:13px;font-weight:600">${w.brand || ''} ${w.model || ''}</span>
        </div>
        <div class="pc-grid">
          ${w.pros ? `<div class="pc-box" style="background:#0d422022;border:1px solid #2ea04322"><div style="font-size:10px;font-weight:700;color:#3fb950">✓ PROS</div><p>${w.pros}</p></div>` : ''}
          ${w.cons ? `<div class="pc-box" style="background:#3d0c1222;border:1px solid #da363322"><div style="font-size:10px;font-weight:700;color:#f85149">✗ CONS</div><p>${w.cons}</p></div>` : ''}
        </div>
      </div>
    </div>`).join('');

  body.innerHTML = `
    <div class="dash-card">
      <div class="dash-card-title">Overall Score</div>
      <div style="position:relative;height:${Math.max(120, compared.length * 50)}px">
        <canvas id="barChart"></canvas>
      </div>
    </div>

    ${compared.length >= 2 ? `
    <div class="dash-card">
      <div class="dash-card-title">Category Radar</div>
      <div style="position:relative;height:260px">
        <canvas id="radarChart"></canvas>
      </div>
    </div>` : ''}

    <div class="dash-card">
      <div class="dash-card-title">Category Breakdown</div>
      <div style="overflow-x:auto">
        <table class="comp-table">
          <thead><tr><th style="text-align:left;color:#6e7681;font-size:10px">Category</th>${theadCols}</tr></thead>
          <tbody>
            ${tableRows}
            <tr class="ovr-row">
              <td style="color:#e6edf3">Overall</td>${ovrCells}
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    ${pcCards}

    <div class="export-row">
      <button class="btn-export" onclick="exportComparisonXlsx()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Export Excel
      </button>
      <button class="btn-export" onclick="exportDashPptx()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
        Export PowerPoint
      </button>
    </div>`;

  // Charts
  setTimeout(() => {
    const bcEl = document.getElementById('barChart');
    const rcEl = document.getElementById('radarChart');

    const bLabels = compared.map(w => ((w.brand || '') + ' ' + (w.model || '')).slice(0, 15));
    const bData   = compared.map(w => calcOverall(w) || 0);
    const bBg     = compared.map(w => CHART_COLORS[selIds.indexOf(w.id)]);

    const rLabels = Object.values(sm);
    const rDS     = compared.map((w, i) => ({
      label: (w.model || 'Device'),
      data:  Object.keys(sm).map(k => w[k] || 0),
      backgroundColor: CHART_COLORS[selIds.indexOf(w.id)] + '22',
      borderColor:     CHART_COLORS[selIds.indexOf(w.id)],
      pointBackgroundColor: CHART_COLORS[selIds.indexOf(w.id)],
      borderWidth: 2, pointRadius: 3
    }));

    if (bcEl) {
      if (barChart) barChart.destroy();
      barChart = new Chart(bcEl, {
        type: 'bar',
        data: { labels: bLabels, datasets: [{ data: bData, backgroundColor: bBg, borderRadius: 6, borderSkipped: false }] },
        options: {
          indexAxis: 'y', responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { min:0, max:10, ticks:{color:'#8b949e',font:{size:10}}, grid:{color:'#21262d'} },
            y: { ticks:{color:'#8b949e',font:{size:10}}, grid:{display:false} }
          }
        }
      });
    }

    if (rcEl && compared.length >= 2) {
      if (radarChart) radarChart.destroy();
      radarChart = new Chart(rcEl, {
        type: 'radar',
        data: { labels: rLabels, datasets: rDS },
        options: {
          responsive: true, maintainAspectRatio: false,
          scales: {
            r: {
              min: 0, max: 10,
              ticks: { display: false },
              grid: { color: '#21262d' },
              angleLines: { color: '#21262d' },
              pointLabels: { color: '#8b949e', font: { size: 9 } }
            }
          },
          plugins: { legend: { labels: { color: '#8b949e', font: { size: 10 }, boxWidth: 10 } } }
        }
      });
    }
  }, 80);
}
