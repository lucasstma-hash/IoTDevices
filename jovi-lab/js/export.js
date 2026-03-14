// ===== EXCEL EXPORT =====
function exportXlsx(id) {
  const r = loadReviews().find(x => x.id === id);
  if (!r) return;
  const sm   = DEFS[r.type].scoreMap;
  const secs = DEFS[r.type].sections.filter(s => s.k !== 'photo' && s.k !== 'verdict');

  const rows = [
    ['Smartphone & IoT Lab — Review Export'], [''],
    ['Device', `${r.brand || ''} ${r.model || ''}`],
    ['Type', TYPE_LABELS[r.type]],
    ['Price (BRL)', r.retail_price || ''],
    ['Positioning', r.positioning || ''],
    ['Overall Score', calcOverall(r) || ''],
    [''], ['CATEGORY SCORES'], ['Category', 'Score']
  ];
  Object.entries(sm).forEach(([k, lbl]) => rows.push([lbl, r[k] || '']));
  rows.push([''], ['DETAILED FIELDS', 'Value']);
  secs.forEach(sec => {
    rows.push([sec.t, '']);
    (sec.f || []).forEach(f => { if (r[f.k]) rows.push(['  ' + f.l, r[f.k]]); });
  });
  rows.push([''], ['VERDICT', '']);
  if (r.pros)          rows.push(['Pros', r.pros]);
  if (r.cons)          rows.push(['Cons', r.cons]);
  if (r.final_verdict) rows.push(['Final Verdict', r.final_verdict]);

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 35 }, { wch: 55 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Review');
  XLSX.writeFile(wb, `${(r.brand||'device').replace(/ /g,'_')}_${(r.model||'review').replace(/ /g,'_')}_review.xlsx`);
}

function exportComparisonXlsx() {
  const compared = loadReviews().filter(r => selIds.includes(r.id));
  if (!compared.length) return;
  const sm = DEFS[curTab].scoreMap;

  const headers = ['Field', ...compared.map(r => `${r.brand || ''} ${r.model || ''}`)];
  const rows = [
    headers,
    ['Type', ...compared.map(r => TYPE_LABELS[r.type])],
    ['Price (BRL)', ...compared.map(r => r.retail_price || '')],
    ['Overall Score', ...compared.map(r => calcOverall(r) || '')],
    [''], ['SCORES']
  ];
  Object.entries(sm).forEach(([k, lbl]) => rows.push([lbl, ...compared.map(r => r[k] || '')]));
  rows.push([''], ['DETAILS']);
  const secs = DEFS[curTab].sections.filter(s => s.k !== 'photo' && s.k !== 'verdict');
  secs.forEach(sec => {
    (sec.f || []).forEach(f => {
      if (compared.some(r => r[f.k])) rows.push([f.l, ...compared.map(r => r[f.k] || '')]);
    });
  });
  rows.push(['']);
  [['Pros','pros'],['Cons','cons'],['Final Verdict','final_verdict']].forEach(([lbl,k]) => {
    if (compared.some(r => r[k])) rows.push([lbl, ...compared.map(r => r[k] || '')]);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 30 }, ...compared.map(() => ({ wch: 38 }))];
  XLSX.utils.book_append_sheet(wb, ws, 'Comparison');
  XLSX.writeFile(wb, `${TYPE_LABELS[curTab].replace(/ /g,'_')}_comparison.xlsx`);
}

// ===== POWERPOINT HELPERS =====
function hex(color) { return color.replace('#', ''); }
function pScore(v) { return !v ? '374151' : v >= 8 ? '22c55e' : v >= 5 ? 'f59e0b' : 'ef4444'; }

// ===== SINGLE REVIEW PPTX =====
function exportSinglePptx(id) {
  const r = loadReviews().find(x => x.id === id);
  if (!r) return;
  const sm     = DEFS[r.type].scoreMap;
  const ov     = calcOverall(r);
  const accent = hex(TYPE_COLORS[r.type]);
  const pres   = new PptxGenJS();
  pres.layout  = 'LAYOUT_WIDE';

  // ── Slide 1: Cover ──
  const s1 = pres.addSlide();
  s1.background = { color: '0d1117' };
  s1.addShape(pres.ShapeType.rect, { x:0, y:0, w:0.07, h:7.5, fill:{ color: accent } });
  s1.addText(TYPE_LABELS[r.type] + ' Review', { x:0.35, y:1.1, w:10, h:0.45, fontSize:13, color:'6e7681', fontFace:'Calibri' });
  s1.addText((r.brand||'') + (r.model ? ' ' + r.model : ''), { x:0.35, y:1.55, w:10, h:1.1, fontSize:40, bold:true, color:'e6edf3', fontFace:'Calibri' });
  if (r.positioning) s1.addText(r.positioning + (r.retail_price ? '  ·  R$ ' + parseInt(r.retail_price).toLocaleString('pt-BR') : ''), { x:0.35, y:2.75, w:8, h:0.38, fontSize:15, color:'8b949e', fontFace:'Calibri' });
  if (ov) {
    s1.addShape(pres.ShapeType.rect, { x:0.35, y:3.3, w:2.4, h:1.9, fill:{ color:'161b22' }, line:{ color:'21262d', width:1 } });
    s1.addText('Overall Score', { x:0.35, y:3.4, w:2.4, h:0.3, fontSize:10, color:'6e7681', align:'center', fontFace:'Calibri' });
    s1.addText(String(ov), { x:0.35, y:3.68, w:2.4, h:0.82, fontSize:52, bold:true, color:pScore(ov), align:'center', fontFace:'Calibri' });
    s1.addText('/10', { x:0.35, y:4.45, w:2.4, h:0.28, fontSize:12, color:'6e7681', align:'center', fontFace:'Calibri' });
  }
  if (r.final_verdict) s1.addText('"' + r.final_verdict + '"', { x:3.05, y:3.3, w:9.85, h:1.9, fontSize:14, color:'9ca3af', italic:true, fontFace:'Calibri', valign:'middle', wrap:true });
  s1.addText('Smartphone & IoT Lab  ·  JOVI', { x:0.35, y:6.9, w:12, h:0.35, fontSize:9, color:'374151', fontFace:'Calibri' });

  // ── Slide 2: Category Scores ──
  const s2 = pres.addSlide();
  s2.background = { color: '0d1117' };
  s2.addShape(pres.ShapeType.rect, { x:0, y:0, w:13.3, h:0.65, fill:{ color:'161b22' } });
  s2.addText('Category Scores', { x:0.35, y:0.1, w:12, h:0.45, fontSize:17, bold:true, color:'e6edf3', fontFace:'Calibri' });
  const ents = Object.entries(sm);
  const cols = Math.min(4, ents.length);
  const cw = 12.3 / cols;
  ents.forEach(([k, lbl], i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const x = 0.35 + col * cw, y = 0.85 + row * 1.55;
    const v  = r[k] || 0;
    const co = pScore(v);
    s2.addShape(pres.ShapeType.rect, { x, y, w:cw-0.1, h:1.45, fill:{ color:'161b22' }, line:{ color:'21262d', width:1 } });
    s2.addText(lbl, { x:x+0.1, y:y+0.1, w:cw-0.3, h:0.28, fontSize:10, color:'8b949e', fontFace:'Calibri' });
    s2.addText(v ? String(v) : '—', { x:x+0.1, y:y+0.35, w:cw-0.3, h:0.65, fontSize:34, bold:true, color:co, fontFace:'Calibri' });
    if (v) {
      const bw = (cw - 0.3) * (v / 10);
      s2.addShape(pres.ShapeType.rect, { x:x+0.1, y:y+1.08, w:bw, h:0.09, fill:{ color:co } });
      s2.addShape(pres.ShapeType.rect, { x:x+0.1+bw, y:y+1.08, w:(cw-0.3)-bw, h:0.09, fill:{ color:'21262d' } });
    }
  });

  // ── Slide 3: Pros & Cons ──
  if (r.pros || r.cons) {
    const s3 = pres.addSlide();
    s3.background = { color: '0d1117' };
    s3.addShape(pres.ShapeType.rect, { x:0, y:0, w:13.3, h:0.65, fill:{ color:'161b22' } });
    s3.addText('Pros & Cons', { x:0.35, y:0.1, w:12, h:0.45, fontSize:17, bold:true, color:'e6edf3', fontFace:'Calibri' });
    if (r.pros) {
      s3.addShape(pres.ShapeType.rect, { x:0.35, y:0.8, w:5.9, h:5.9, fill:{ color:'0d422022' } });
      s3.addShape(pres.ShapeType.rect, { x:0.35, y:0.8, w:0.06, h:5.9, fill:{ color:'2ea043' } });
      s3.addText('✓  PROS', { x:0.5, y:0.9, w:5.6, h:0.35, fontSize:12, bold:true, color:'3fb950', fontFace:'Calibri' });
      s3.addText(r.pros, { x:0.5, y:1.32, w:5.6, h:5.2, fontSize:13, color:'c9d1d9', fontFace:'Calibri', valign:'top', wrap:true });
    }
    if (r.cons) {
      s3.addShape(pres.ShapeType.rect, { x:6.8, y:0.8, w:5.9, h:5.9, fill:{ color:'3d0c1222' } });
      s3.addShape(pres.ShapeType.rect, { x:6.8, y:0.8, w:0.06, h:5.9, fill:{ color:'da3633' } });
      s3.addText('✗  CONS', { x:6.95, y:0.9, w:5.6, h:0.35, fontSize:12, bold:true, color:'f85149', fontFace:'Calibri' });
      s3.addText(r.cons, { x:6.95, y:1.32, w:5.6, h:5.2, fontSize:13, color:'c9d1d9', fontFace:'Calibri', valign:'top', wrap:true });
    }
  }

  // ── Slide 4: Full Details ──
  const secs = DEFS[r.type].sections.filter(s => s.k !== 'photo' && s.k !== 'verdict');
  const filledSecs = secs.filter(s => (s.f || []).some(f => r[f.k] && r[f.k] !== ''));
  if (filledSecs.length) {
    const s4 = pres.addSlide();
    s4.background = { color: '0d1117' };
    s4.addShape(pres.ShapeType.rect, { x:0, y:0, w:13.3, h:0.65, fill:{ color:'161b22' } });
    s4.addText('Full Review Details', { x:0.35, y:0.1, w:12, h:0.45, fontSize:17, bold:true, color:'e6edf3', fontFace:'Calibri' });
    const half = Math.ceil(filledSecs.length / 2);
    let yL = 0.85, yR = 0.85;
    const addBlock = (sec, x, yRef) => {
      const filled = (sec.f || []).filter(f => r[f.k] && r[f.k] !== '');
      if (!filled.length) return yRef;
      const sv = sec.sk ? r[sec.sk] : null;
      const blockH = 0.3 + filled.length * 0.34;
      if (yRef + blockH > 7.1) return yRef;
      const co = sv >= 8 ? '3fb950' : sv >= 5 ? 'e3b341' : sv ? 'f85149' : '6e7681';
      s4.addShape(pres.ShapeType.rect, { x, y:yRef, w:6.1, h:blockH+0.1, fill:{ color:'161b22' }, line:{ color:'21262d', width:0.5 } });
      s4.addText(sec.n + '. ' + sec.t + (sv ? '  [' + sv + ']' : ''), { x:x+0.1, y:yRef+0.05, w:5.8, h:0.24, fontSize:9, bold:true, color:co, fontFace:'Calibri' });
      filled.forEach((f, fi) => {
        s4.addText(f.l + ':', { x:x+0.1, y:yRef+0.3+fi*0.34, w:2.4, h:0.3, fontSize:9, color:'6e7681', fontFace:'Calibri' });
        s4.addText(String(r[f.k]).slice(0, 42), { x:x+2.6, y:yRef+0.3+fi*0.34, w:3.4, h:0.3, fontSize:9, bold:true, color:'e6edf3', fontFace:'Calibri' });
      });
      return yRef + blockH + 0.18;
    };
    filledSecs.slice(0, half).forEach(s => { yL = addBlock(s, 0.35, yL); });
    filledSecs.slice(half).forEach(s  => { yR = addBlock(s, 6.85, yR); });
  }

  pres.writeFile({ fileName: `${(r.brand||'device').replace(/ /g,'_')}_${(r.model||'review').replace(/ /g,'_')}_review.pptx` });
}

// ===== DASHBOARD COMPARISON PPTX =====
function exportDashPptx() {
  const compared = loadReviews().filter(r => selIds.includes(r.id));
  if (!compared.length) return;
  const sm     = DEFS[curTab].scoreMap;
  const accent = hex(TYPE_COLORS[curTab]);
  const pres   = new PptxGenJS();
  pres.layout  = 'LAYOUT_WIDE';

  // ── Slide 1: Comparison Cover ──
  const s1 = pres.addSlide();
  s1.background = { color: '0d1117' };
  s1.addShape(pres.ShapeType.rect, { x:0, y:0, w:13.3, h:0.95, fill:{ color:'161b22' } });
  s1.addShape(pres.ShapeType.rect, { x:0, y:0, w:0.07, h:7.5, fill:{ color: accent } });
  s1.addText(TYPE_LABELS[curTab] + ' Comparison Dashboard', { x:0.28, y:0.14, w:12.5, h:0.5, fontSize:20, bold:true, color:'e6edf3', fontFace:'Calibri' });
  s1.addText('Smartphone & IoT Lab  ·  JOVI', { x:0.28, y:0.6, w:12, h:0.28, fontSize:10, color:'6e7681', fontFace:'Calibri' });
  const cw2 = 12.2 / compared.length;
  compared.forEach((r, i) => {
    const ov = calcOverall(r);
    const x  = 0.35 + i * cw2;
    const co = pScore(ov);
    s1.addShape(pres.ShapeType.rect, { x, y:1.1, w:cw2-0.15, h:5.8, fill:{ color:'161b22' }, line:{ color:CHART_COLORS[i].replace('#',''), width:1 } });
    s1.addShape(pres.ShapeType.rect, { x, y:1.1, w:cw2-0.15, h:0.06, fill:{ color:CHART_COLORS[i].replace('#','') } });
    s1.addText(r.brand || '', { x:x+0.1, y:1.28, w:cw2-0.3, h:0.28, fontSize:9, color:'8b949e', fontFace:'Calibri' });
    s1.addText(r.model || '', { x:x+0.1, y:1.55, w:cw2-0.3, h:0.5, fontSize:15, bold:true, color:'e6edf3', fontFace:'Calibri', wrap:true });
    if (r.retail_price) s1.addText('R$ ' + parseInt(r.retail_price).toLocaleString('pt-BR'), { x:x+0.1, y:2.1, w:cw2-0.3, h:0.26, fontSize:10, color:'6e7681', fontFace:'Calibri' });
    s1.addText(ov ? String(ov) : '—', { x:x+0.1, y:2.45, w:cw2-0.3, h:0.9, fontSize:46, bold:true, color:co, align:'center', fontFace:'Calibri' });
    s1.addText('/10', { x:x+0.1, y:3.3, w:cw2-0.3, h:0.28, fontSize:10, color:'6e7681', align:'center', fontFace:'Calibri' });
    if (r.final_verdict) s1.addText('"' + r.final_verdict.slice(0, 90) + '"', { x:x+0.1, y:3.7, w:cw2-0.3, h:2.9, fontSize:9, color:'8b949e', italic:true, fontFace:'Calibri', valign:'top', wrap:true });
  });

  // ── Slide 2: Scores Grid ──
  const s2 = pres.addSlide();
  s2.background = { color: '0d1117' };
  s2.addShape(pres.ShapeType.rect, { x:0, y:0, w:13.3, h:0.65, fill:{ color:'161b22' } });
  s2.addText('Category Scores Comparison', { x:0.35, y:0.1, w:12, h:0.45, fontSize:17, bold:true, color:'e6edf3', fontFace:'Calibri' });
  const ents = Object.entries(sm);
  const colW = 12.2 / (compared.length + 1);
  // Headers
  compared.forEach((r, ci) => {
    s2.addText((r.model || '').slice(0, 12), { x:0.35+(ci+1)*colW, y:0.7, w:colW-0.1, h:0.28, fontSize:10, bold:true, color:CHART_COLORS[ci].replace('#',''), align:'center', fontFace:'Calibri' });
  });
  ents.forEach(([k, lbl], ri) => {
    const y = 1.05 + ri * 0.58;
    s2.addText(lbl, { x:0.35, y:y+0.14, w:colW-0.1, h:0.33, fontSize:10, bold:true, color:'c9d1d9', fontFace:'Calibri' });
    compared.forEach((r, ci) => {
      const v = r[k], x = 0.35 + (ci+1) * colW;
      const co = pScore(v);
      s2.addShape(pres.ShapeType.rect, { x, y, w:colW-0.12, h:0.53, fill:{ color:'161b22' }, line:{ color:'21262d', width:0.5 } });
      s2.addText(v ? String(v) : '—', { x:x+0.08, y:y+0.05, w:colW-0.28, h:0.31, fontSize:17, bold:true, color:co, align:'center', fontFace:'Calibri' });
      if (v) { const bw = (colW-0.28)*(v/10); s2.addShape(pres.ShapeType.rect, { x:x+0.08, y:y+0.42, w:bw, h:0.07, fill:{ color:co } }); }
    });
    s2.addShape(pres.ShapeType.rect, { x:0.35, y:y+0.53, w:12.2, h:0.02, fill:{ color:'21262d' } });
  });

  // ── Slide 3: Pros & Cons per device ──
  const s3 = pres.addSlide();
  s3.background = { color: '0d1117' };
  s3.addShape(pres.ShapeType.rect, { x:0, y:0, w:13.3, h:0.65, fill:{ color:'161b22' } });
  s3.addText('Pros & Cons', { x:0.35, y:0.1, w:12, h:0.45, fontSize:17, bold:true, color:'e6edf3', fontFace:'Calibri' });
  const pcW = 12.2 / compared.length;
  compared.forEach((r, i) => {
    const x = 0.35 + i * pcW;
    s3.addShape(pres.ShapeType.rect, { x, y:0.78, w:pcW-0.12, h:0.05, fill:{ color:CHART_COLORS[i].replace('#','') } });
    s3.addText(r.model || '', { x:x+0.05, y:0.88, w:pcW-0.22, h:0.28, fontSize:10, bold:true, color:'e6edf3', fontFace:'Calibri' });
    if (r.pros) { s3.addShape(pres.ShapeType.rect, { x:x+0.05, y:1.22, w:pcW-0.22, h:2.7, fill:{ color:'0d422022' } }); s3.addShape(pres.ShapeType.rect, { x:x+0.05, y:1.22, w:0.05, h:2.7, fill:{ color:'2ea043' } }); s3.addText('PROS', { x:x+0.17, y:1.27, w:pcW-0.38, h:0.25, fontSize:8, bold:true, color:'3fb950', fontFace:'Calibri' }); s3.addText(r.pros, { x:x+0.17, y:1.56, w:pcW-0.38, h:2.2, fontSize:10, color:'c9d1d9', fontFace:'Calibri', valign:'top', wrap:true }); }
    if (r.cons) { s3.addShape(pres.ShapeType.rect, { x:x+0.05, y:4.1, w:pcW-0.22, h:2.7, fill:{ color:'3d0c1222' } }); s3.addShape(pres.ShapeType.rect, { x:x+0.05, y:4.1, w:0.05, h:2.7, fill:{ color:'da3633' } }); s3.addText('CONS', { x:x+0.17, y:4.15, w:pcW-0.38, h:0.25, fontSize:8, bold:true, color:'f85149', fontFace:'Calibri' }); s3.addText(r.cons, { x:x+0.17, y:4.44, w:pcW-0.38, h:2.2, fontSize:10, color:'c9d1d9', fontFace:'Calibri', valign:'top', wrap:true }); }
  });

  pres.writeFile({ fileName: `${TYPE_LABELS[curTab].replace(/ /g,'_')}_comparison.pptx` });
}
