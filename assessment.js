// ================================================================
// assessment.js — DSPM Assessment Form Logic
// ================================================================

var selectedResults = { GM: null, FM: null, RL: null, EL: null, PS: null };

function selectResult(domain, result) {
  selectedResults[domain] = result;
  document.getElementById(domain + '_result').value = result;

  var card = document.getElementById('domain-' + domain);
  card.classList.remove('selected-pass', 'selected-monitor', 'selected-delay');
  if (result === 'Pass')    card.classList.add('selected-pass');
  if (result === 'Monitor') card.classList.add('selected-monitor');
  if (result === 'Delay')   card.classList.add('selected-delay');

  var buttons = document.querySelectorAll('#' + domain.toLowerCase() + '-buttons .result-btn');
  buttons.forEach(function(btn) {
    btn.classList.remove('active');
    if ((btn.classList.contains('btn-pass')    && result === 'Pass') ||
        (btn.classList.contains('btn-monitor') && result === 'Monitor') ||
        (btn.classList.contains('btn-delay')   && result === 'Delay')) {
      btn.classList.add('active');
    }
  });
}

async function searchChild() {
  var child_id = document.getElementById('searchChildId').value.trim();
  var hn       = document.getElementById('searchHN').value.trim();

  if (!child_id && !hn) { showToast('กรุณากรอก Child ID หรือ HN', 'warn'); return; }

  var params = {};
  if (child_id) params.child_id = child_id;

  // Mock for demo
  var mockChild = {
    child_id: child_id || 'C_DEMO001',
    hn: hn || 'HN00100',
    full_name: 'ด.ช.สมชาย ใจดี',
    dob: '2023-07-15',
    gender: 'ชาย',
    hospital_id: 'H001',
    parent_name: 'นายสมศักดิ์ ใจดี',
    parent_phone: '081-234-5678'
  };

  displayChildInfo(mockChild);
}

function displayChildInfo(child) {
  var age = computeAgeMonths(child.dob);
  var infoEl = document.getElementById('childInfo');
  infoEl.style.display = 'block';
  infoEl.innerHTML =
    '<div class="alert-clinical alert-normal">' +
    '<i class="bi bi-person-check-fill text-success fs-5"></i>' +
    '<div>' +
    '<strong>' + child.full_name + '</strong> &nbsp;|&nbsp; HN: ' + (child.hn||'—') +
    ' &nbsp;|&nbsp; เพศ: ' + (child.gender||'—') +
    ' &nbsp;|&nbsp; วันเกิด: ' + (child.dob||'—') +
    ' &nbsp;|&nbsp; <strong>อายุ: ' + age + ' เดือน</strong>' +
    ' &nbsp;|&nbsp; ผู้ปกครอง: ' + (child.parent_name||'—') +
    '</div></div>';

  document.getElementById('assessChildId').value = child.child_id;
  document.getElementById('assessAge').value = age;

  var today = new Date().toISOString().split('T')[0];
  document.getElementById('assessDate').value = today;

  document.getElementById('assessmentForm').style.display = 'block';
  document.getElementById('assessmentForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function computeAgeMonths(dob) {
  if (!dob) return 0;
  var birth = new Date(dob);
  var now   = new Date();
  return Math.floor((now - birth) / (1000 * 60 * 60 * 24 * 30.4375));
}

async function submitAssessment() {
  var child_id = document.getElementById('assessChildId').value;
  var date     = document.getElementById('assessDate').value;
  var age      = document.getElementById('assessAge').value;

  if (!child_id || !date || !age) { showToast('กรุณากรอกข้อมูลให้ครบ', 'warn'); return; }

  var domains = ['GM','FM','RL','EL','PS'];
  for (var i = 0; i < domains.length; i++) {
    if (!selectedResults[domains[i]]) {
      showToast('กรุณาเลือกผลการประเมิน ' + domains[i], 'warn');
      return;
    }
  }

  var payload = {
    child_id:        child_id,
    assessment_date: date,
    age_months:      Number(age),
    GM_result:       selectedResults.GM,
    FM_result:       selectedResults.FM,
    RL_result:       selectedResults.RL,
    EL_result:       selectedResults.EL,
    PS_result:       selectedResults.PS,
    assessor:        document.getElementById('assessor').value,
    notes:           document.getElementById('assessNotes').value
  };

  // Compute locally for demo
  var dspmResult = computeDSPMLocal(payload);
  var aiResult   = computeAILocal(payload);

  displayResults(payload, dspmResult, aiResult);
  showToast('บันทึกผลการประเมินสำเร็จ', 'success');
}

function computeDSPMLocal(b) {
  var delayCount = 0, monitorCount = 0, delayDomains = [], monitorDomains = [];
  ['GM','FM','RL','EL','PS'].forEach(function(d) {
    if (b[d+'_result'] === 'Delay')   { delayCount++;   delayDomains.push(d); }
    if (b[d+'_result'] === 'Monitor') { monitorCount++; monitorDomains.push(d); }
  });

  var risk_level, color, action;
  if (delayCount >= 2)       { risk_level='High Risk Developmental Delay'; color='danger';  action='ส่งต่อผู้เชี่ยวชาญด้านพัฒนาการเด็กโดยด่วน'; }
  else if (delayCount === 1) { risk_level='Moderate Risk';                 color='warning'; action='นัดติดตามผลภายใน 1 เดือน และกระตุ้นพัฒนาการ'; }
  else if (monitorCount >= 1){ risk_level='Development Monitoring';        color='info';    action='ติดตามพัฒนาการต่อเนื่อง นัดประเมินซ้ำ 3 เดือน'; }
  else                       { risk_level='Normal Development';            color='success'; action='ดูแลต่อเนื่องตามปกติ นัดตรวจสุขภาพตามกำหนด'; }

  return { risk_level:risk_level, color:color, action:action, delay_count:delayCount, delay_domains:delayDomains, monitor_domains:monitorDomains };
}

function computeAILocal(b) {
  var weights = {GM:0.20, FM:0.20, RL:0.25, EL:0.25, PS:0.10};
  var scores  = {Pass:0, Monitor:0.5, Delay:1.0};
  var raw = 0;
  ['GM','FM','RL','EL','PS'].forEach(function(d) { raw += (scores[b[d+'_result']]||0) * weights[d]; });
  var score = Math.round(raw * 100);
  var level = score >= 60 ? 'High Risk' : score >= 30 ? 'Moderate Risk' : 'Low Risk';
  var color = score >= 60 ? 'danger' : score >= 30 ? 'warning' : 'success';
  return { risk_score: score, risk_level: level, color: color };
}

function displayResults(payload, dspm, ai) {
  var colorMap = { success:'#16a34a', info:'#0891b2', warning:'#d97706', danger:'#dc2626' };
  var bgMap    = { success:'#dcfce7', info:'#e0f2fe', warning:'#fef3c7', danger:'#fee2e2' };
  var html =
    '<div class="result-card result-' + dspm.color + '">' +
    '<div class="row">' +
    '<div class="col-md-6">' +
    '<h4 style="color:' + colorMap[dspm.color] + '"><i class="bi bi-clipboard2-pulse-fill me-2"></i>ผล DSPM</h4>' +
    '<h5 class="mt-3">' + dspm.risk_level + '</h5>' +
    '<p class="mt-2"><strong>แนวทาง:</strong> ' + dspm.action + '</p>' +
    (dspm.delay_domains.length ? '<p><strong>Domain ที่ล่าช้า:</strong> ' + dspm.delay_domains.join(', ') + '</p>' : '') +
    '</div>' +
    '<div class="col-md-3 text-center">' +
    '<h6>AI Risk Score</h6>' +
    '<div style="font-size:48px;font-weight:800;color:' + colorMap[ai.color] + '">' + ai.risk_score + '</div>' +
    '<div class="text-muted">' + ai.risk_level + '</div>' +
    '</div>' +
    '<div class="col-md-3 text-center">' +
    '<h6>โดเมนที่ประเมิน</h6>' +
    ['GM','FM','RL','EL','PS'].map(function(d) {
      var r = payload[d+'_result'];
      return '<div class="d-flex justify-content-between mb-1"><small>' + d + '</small>' + getResultBadge(r) + '</div>';
    }).join('') +
    '</div>' +
    '</div>' +
    '</div>';

  var el = document.getElementById('resultDisplay');
  el.style.display = 'block';
  el.innerHTML = html;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function clearForm() {
  selectedResults = { GM: null, FM: null, RL: null, EL: null, PS: null };
  ['GM','FM','RL','EL','PS'].forEach(function(d) {
    document.getElementById(d+'_result').value = '';
    document.getElementById('domain-'+d).classList.remove('selected-pass','selected-monitor','selected-delay');
    document.querySelectorAll('#'+d.toLowerCase()+'-buttons .result-btn').forEach(function(b){ b.classList.remove('active'); });
  });
  document.getElementById('assessNotes').value = '';
  document.getElementById('resultDisplay').style.display = 'none';
}
