/**
 * PediAI Platform — Dashboard & Charts JavaScript
 * Chart.js Visualizations สำหรับแดชบอร์ด
 */

// ===== Chart.js Global Config =====
Chart.defaults.font.family = "'Sarabun', 'IBM Plex Sans Thai', sans-serif";
Chart.defaults.font.size = 13;
Chart.defaults.color = '#6c757d';

const COLORS = {
  primary: '#0f4c81', secondary: '#00b4d8', accent: '#06d6a0',
  danger: '#ef233c', warning: '#ffd60a', purple: '#7209b7',
  pink: '#f72585', darkblue: '#4361ee', cyan: '#4cc9f0',
  orange: '#fb8500', teal: '#2ec4b6',
  normal: '#06d6a0', monitor: '#ffd60a', delay: '#ef233c',
  alpha: (color, a) => color + Math.round(a*255).toString(16).padStart(2,'0')
};

// ===== MAIN DASHBOARD INIT =====
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('domainChart')) initMainDashboard();
});

async function initMainDashboard() {
  loadRecentTable();
  renderDomainChart();
  renderAgeGroupChart();
  renderTrendChart();
  renderRiskPieChart();
  updateHeroStats();
}

function updateHeroStats() {
  const stats = { total: 1284, normal: 1089, delay: 69 };
  ['heroTotal','heroNormal','heroDelay'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.textContent = Object.values(stats)[i].toLocaleString('th-TH');
  });
}

// ===== CHART 1: Domain Bar Chart =====
function renderDomainChart() {
  const ctx = document.getElementById('domainChart');
  if (!ctx) return;
  const data = {
    labels: ['GM\nกล้ามเนื้อมัดใหญ่', 'FM\nกล้ามเนื้อมัดเล็ก', 'RL\nภาษารับรู้', 'EL\nภาษาแสดงออก', 'PS\nสังคม'],
    normal: [92, 88, 78, 74, 90],
    monitor: [5, 7, 12, 14, 7],
    delay: [3, 5, 10, 12, 3]
  };
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['GM\nกล้ามเนื้อมัดใหญ่', 'FM\nกล้ามเนื้อมัดเล็ก', 'RL\nภาษารับรู้', 'EL\nภาษาแสดงออก', 'PS\nสังคม'],
      datasets: [
        { label: 'ปกติ', data: data.normal, backgroundColor: '#06d6a050', borderColor: '#06d6a0', borderWidth: 2, borderRadius: 6 },
        { label: 'ติดตาม', data: data.monitor, backgroundColor: '#ffd60a50', borderColor: '#ffd60a', borderWidth: 2, borderRadius: 6 },
        { label: 'ล่าช้า', data: data.delay, backgroundColor: '#ef233c40', borderColor: '#ef233c', borderWidth: 2, borderRadius: 6 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { position: 'bottom', labels: { font: { size: 12 }, padding: 16 } } },
      scales: {
        y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' }, grid: { color: '#f0f0f0' } },
        x: { grid: { display: false } }
      }
    }
  });
}

// ===== CHART 2: Age Group Donut =====
function renderAgeGroupChart() {
  const ctx = document.getElementById('ageGroupChart');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['0-1 ปี', '1-2 ปี', '2-3 ปี', '3-5 ปี'],
      datasets: [{
        data: [12, 23, 19, 15],
        backgroundColor: [COLORS.secondary, COLORS.warning, COLORS.danger, COLORS.purple],
        borderWidth: 3, borderColor: '#fff', hoverOffset: 8
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: true, cutout: '65%',
      plugins: {
        legend: { position: 'bottom', labels: { padding: 16, font: { size: 12 } } },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed} ราย` } }
      }
    }
  });
}

// ===== CHART 3: Monthly Trend Line =====
function renderTrendChart() {
  const ctx = document.getElementById('trendChart');
  if (!ctx) return;
  const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        { label: 'ปกติ', data: [88,90,89,92,91,94,93,95,92,90,88,87], borderColor: COLORS.normal, backgroundColor: COLORS.normal+'20', tension: 0.4, fill: true, borderWidth: 2.5 },
        { label: 'ติดตาม', data: [8,7,8,6,7,4,5,3,5,7,8,9], borderColor: COLORS.warning, backgroundColor: COLORS.warning+'20', tension: 0.4, fill: false, borderWidth: 2, borderDash: [5,3] },
        { label: 'ล่าช้า', data: [4,3,3,2,2,2,2,2,3,3,4,4], borderColor: COLORS.danger, backgroundColor: COLORS.danger+'10', tension: 0.4, fill: false, borderWidth: 2, borderDash: [8,4] }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { position: 'bottom', labels: { padding: 16, font: { size: 12 } } } },
      scales: {
        y: { beginAtZero: true, max: 110, ticks: { callback: v => v + '%' }, grid: { color: '#f0f0f0' } },
        x: { grid: { display: false } }
      }
    }
  });
}

// ===== CHART 4: AI Risk Pie =====
function renderRiskPieChart() {
  const ctx = document.getElementById('riskPieChart');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['ความเสี่ยงต่ำ', 'ความเสี่ยงปานกลาง', 'ความเสี่ยงสูง'],
      datasets: [{ data: [72, 19, 9], backgroundColor: [COLORS.normal, COLORS.warning, COLORS.danger], borderWidth: 3, borderColor: '#fff', hoverOffset: 6 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  });
}

// ===== RECENT TABLE =====
function loadRecentTable() {
  const tbody = document.getElementById('recentTable');
  if (!tbody) return;
  const demoData = getDemoData('getPopulationAnalytics');
  const children = demoData.data.children || [];
  tbody.innerHTML = children.slice(0, 10).map(c => `
    <tr>
      <td><code style="color:var(--primary);font-weight:700">${c.id}</code></td>
      <td class="fw-600">${c.name}</td>
      <td>${c.age}</td>
      <td>${domainBadge(c.gm)}</td>
      <td>${domainBadge(c.fm)}</td>
      <td>${domainBadge(c.rl)}</td>
      <td>${domainBadge(c.el)}</td>
      <td>${domainBadge(c.ps)}</td>
      <td>${getOutcomeBadge(c.outcome)}</td>
      <td>${getRiskBadge(c.ai_risk)}</td>
      <td>${c.date}</td>
      <td><button class="btn btn-xs btn-outline-primary" style="font-size:11px;padding:3px 8px" onclick="showDetail('${c.id}')"><i class="fas fa-eye"></i></button></td>
    </tr>
  `).join('');
}

function domainBadge(val) {
  if (val === 'ปกติ') return '<span style="color:#06d6a0;font-weight:700;font-size:12px">✅</span>';
  if (val === 'ล่าช้า') return '<span style="color:#ef233c;font-weight:700;font-size:12px">❌</span>';
  return '<span style="color:#c9a900;font-weight:700;font-size:12px">👁</span>';
}

function showDetail(id) {
  alert(`รายละเอียดเด็ก ID: ${id}\n(เชื่อม Backend จริงเพื่อดูข้อมูลเต็ม)`);
}

// ===== HOSPITAL DASHBOARD =====
function initHospitalDashboard() {
  renderHospitalCompareChart();
  renderHospitalTrendChart();
  renderHospitalDomainChart();
  loadHospitalTable();
  loadHospitalRanking();
}

function renderHospitalCompareChart() {
  const ctx = document.getElementById('hospitalCompareChart');
  if (!ctx) return;
  const hospitals = ['รพ.สุราษฎร์ธานี','รพ.เกาะสมุย','รพ.ไชยา','รพ.ท่าฉาง','รพ.พุนพิน'];
  const normal = [84.8, 85.2, 86.0, 86.0, 81.0];
  const monitor = [9.8, 9.1, 9.3, 10.1, 11.8];
  const delay = [5.5, 5.7, 4.7, 3.9, 7.2];
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: hospitals,
      datasets: [
        { label: 'ปกติ (%)', data: normal, backgroundColor: '#06d6a050', borderColor: '#06d6a0', borderWidth: 2, borderRadius: 6 },
        { label: 'ติดตาม (%)', data: monitor, backgroundColor: '#ffd60a50', borderColor: '#ffd60a', borderWidth: 2, borderRadius: 6 },
        { label: 'ล่าช้า (%)', data: delay, backgroundColor: '#ef233c40', borderColor: '#ef233c', borderWidth: 2, borderRadius: 6 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' }, stacked: false },
        x: { stacked: false }
      }
    }
  });
}

function renderHospitalTrendChart() {
  const ctx = document.getElementById('hospitalTrendChart');
  if (!ctx) return;
  const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.'];
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        { label: 'รพ.สุราษฎร์ธานี', data: [6,5.5,5.8,5.3,5.5,5.5], borderColor: COLORS.primary, tension: 0.4, borderWidth: 2.5 },
        { label: 'รพ.เกาะสมุย', data: [7,6.5,6.2,5.9,5.8,5.7], borderColor: COLORS.secondary, tension: 0.4, borderWidth: 2 },
        { label: 'รพ.ไชยา', data: [5,5.2,4.8,5.0,4.7,4.7], borderColor: COLORS.accent, tension: 0.4, borderWidth: 2 },
        { label: 'รพ.พุนพิน', data: [8,7.8,7.5,7.3,7.3,7.2], borderColor: COLORS.danger, tension: 0.4, borderWidth: 2 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { position: 'bottom' } },
      scales: { y: { ticks: { callback: v => v + '%' }, title: { display: true, text: 'อัตราล่าช้า (%)' } } }
    }
  });
}

function renderHospitalDomainChart() {
  const ctx = document.getElementById('hospitalDomainChart');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['GM', 'FM', 'RL', 'EL', 'PS'],
      datasets: [
        { label: 'รพ.สุราษฎร์ธานี', data: [3,5,10,12,3], backgroundColor: 'rgba(15,76,129,0.15)', borderColor: COLORS.primary, borderWidth: 2 },
        { label: 'รพ.เกาะสมุย', data: [4,6,11,13,4], backgroundColor: 'rgba(0,180,216,0.15)', borderColor: COLORS.secondary, borderWidth: 2 },
        { label: 'รพ.พุนพิน', data: [5,7,13,15,5], backgroundColor: 'rgba(239,35,60,0.1)', borderColor: COLORS.danger, borderWidth: 2 }
      ]
    },
    options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom' } } }
  });
}

function loadHospitalTable() {
  const tbody = document.getElementById('hospitalTableBody');
  if (!tbody) return;
  const data = getDemoData('getHospitalDashboard').data.hospitals;
  tbody.innerHTML = data.map(h => {
    const rate = ((h.delay / h.total) * 100).toFixed(1);
    return `<tr>
      <td class="fw-bold">${h.name}</td>
      <td>สุราษฎร์ธานี</td>
      <td>${h.total.toLocaleString('th-TH')}</td>
      <td><span style="color:#06d6a0;font-weight:600">${h.normal}</span></td>
      <td><span style="color:#b89400;font-weight:600">${h.monitor}</span></td>
      <td><span style="color:#ef233c;font-weight:600">${h.delay}</span></td>
      <td><span class="${parseFloat(rate) > 6 ? 'badge-delay' : parseFloat(rate) > 4 ? 'badge-monitor' : 'badge-normal'}">${rate}%</span></td>
      <td>${Math.round(h.delay * 0.6)}</td>
    </tr>`;
  }).join('');
}

function loadHospitalRanking() {
  const el = document.getElementById('hospitalRankList');
  if (!el) return;
  const data = [
    { name: 'รพ.ไชยา', rate: '4.7%', rank: 1 },
    { name: 'รพ.ท่าฉาง', rate: '3.9%', rank: 2 },
    { name: 'รพ.สุราษฎร์ธานี', rate: '5.5%', rank: 3 },
    { name: 'รพ.เกาะสมุย', rate: '5.7%', rank: 4 },
    { name: 'รพ.พุนพิน', rate: '7.2%', rank: 5 }
  ];
  el.innerHTML = data.map(h => `
    <div class="hospital-rank-item rank-${h.rank}">
      <div class="rank-num">${h.rank}</div>
      <div class="rank-name">${h.name}</div>
      <div class="rank-pct">${h.rate}</div>
    </div>
  `).join('');
}

function filterHospitalData() {
  showToast('กรองข้อมูล...', 'info');
}

// ===== PROVINCIAL DASHBOARD =====
function initProvincialDashboard() {
  renderProvinceChart();
  renderProvincePieChart();
  renderProvinceTrendChart();
  loadProvinceTable();
}

function renderProvinceChart() {
  const ctx = document.getElementById('provinceChart');
  if (!ctx) return;
  const districts = ['เมือง','เกาะสมุย','ไชยา','ท่าฉาง','พุนพิน'];
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: districts,
      datasets: [
        { label: 'ปกติ', data: [356,271,185,153,124], backgroundColor: '#06d6a060', borderColor: '#06d6a0', borderWidth: 2, borderRadius: 6 },
        { label: 'ติดตาม', data: [41,29,20,18,18], backgroundColor: '#ffd60a60', borderColor: '#ffd60a', borderWidth: 2, borderRadius: 6 },
        { label: 'สงสัยล่าช้า', data: [23,18,10,7,11], backgroundColor: '#ef233c50', borderColor: '#ef233c', borderWidth: 2, borderRadius: 6 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true, indexAxis: 'y',
      plugins: { legend: { position: 'bottom' } },
      scales: { x: { stacked: false }, y: { stacked: false } }
    }
  });
}

function renderProvincePieChart() {
  const ctx = document.getElementById('provincePieChart');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['พัฒนาการปกติ', 'ติดตาม', 'สงสัยล่าช้า'],
      datasets: [{ data: [1089, 126, 69], backgroundColor: [COLORS.normal, COLORS.warning, COLORS.danger], borderWidth: 3, borderColor: '#fff' }]
    },
    options: { responsive: true, cutout: '60%', plugins: { legend: { position: 'bottom' } } }
  });
}

function renderProvinceTrendChart() {
  const ctx = document.getElementById('provinceTrendChart');
  if (!ctx) return;
  const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        { label: 'จำนวนประเมินทั้งหมด', data: [95,88,102,98,110,105,112,108,99,103,97,107], borderColor: COLORS.primary, backgroundColor: COLORS.primary+'20', fill: true, tension: 0.4, borderWidth: 2.5 },
        { label: 'พบล่าช้า', data: [6,5,7,5,6,5,5,4,6,6,7,7], borderColor: COLORS.danger, tension: 0.4, borderWidth: 2, yAxisID: 'y2' }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        y: { title: { display: true, text: 'จำนวนประเมิน' } },
        y2: { type: 'linear', display: true, position: 'right', title: { display: true, text: 'พบล่าช้า' }, grid: { drawOnChartArea: false } }
      }
    }
  });
}

function loadProvinceTable() {
  const tbody = document.getElementById('provinceTableBody');
  if (!tbody) return;
  const data = [
    { district: 'เมือง', hospital: 'รพ.สุราษฎร์ธานี', total: 420, normal: 356, monitor: 41, delay: 23, lowRisk: 378, highRisk: 12 },
    { district: 'เกาะสมุย', hospital: 'รพ.เกาะสมุย', total: 318, normal: 271, monitor: 29, delay: 18, lowRisk: 286, highRisk: 10 },
    { district: 'ไชยา', hospital: 'รพ.ไชยา', total: 215, normal: 185, monitor: 20, delay: 10, lowRisk: 196, highRisk: 6 },
    { district: 'ท่าฉาง', hospital: 'รพ.ท่าฉาง', total: 178, normal: 153, monitor: 18, delay: 7, lowRisk: 165, highRisk: 4 },
    { district: 'พุนพิน', hospital: 'รพ.พุนพิน', total: 153, normal: 124, monitor: 18, delay: 11, lowRisk: 132, highRisk: 9 }
  ];
  tbody.innerHTML = data.map(r => {
    const rate = ((r.delay / r.total) * 100).toFixed(1);
    return `<tr>
      <td class="fw-bold">${r.district}</td>
      <td>${r.hospital}</td>
      <td>${r.total}</td>
      <td style="color:#06d6a0;font-weight:600">${r.normal}</td>
      <td style="color:#b89400;font-weight:600">${r.monitor}</td>
      <td style="color:#ef233c;font-weight:600">${r.delay}</td>
      <td><span class="badge-monitor">${rate}%</span></td>
      <td style="color:#06d6a0;font-weight:600">${r.lowRisk}</td>
      <td style="color:#ef233c;font-weight:600">${r.highRisk}</td>
    </tr>`;
  }).join('');
}

// ===== RESEARCH PAGE =====
function initResearchPage() {
  loadPreviewTable();
  setDefaultDates();
}

function setDefaultDates() {
  const today = new Date();
  const yearAgo = new Date(); yearAgo.setFullYear(today.getFullYear() - 1);
  const toEl = document.getElementById('dateTo');
  const fromEl = document.getElementById('dateFrom');
  if (toEl) toEl.valueAsDate = today;
  if (fromEl) fromEl.valueAsDate = yearAgo;
}

function loadPreviewTable() {
  const tbody = document.getElementById('previewBody');
  if (!tbody) return;
  const children = getDemoData('getPopulationAnalytics').data.children || [];
  tbody.innerHTML = children.slice(0, 8).map(c => `
    <tr>
      <td><code>${c.id}</code></td>
      <td>${c.age.replace(' เดือน','')}</td>
      <td>${c.name.includes('ด.ช') ? 'ชาย' : 'หญิง'}</td>
      <td>${c.gm}</td><td>${c.fm}</td><td>${c.rl}</td><td>${c.el}</td><td>${c.ps}</td>
      <td>${c.dspm_outcome}</td>
      <td>${Math.floor(Math.random()*60)+5}</td>
      <td>${c.ai_risk_level}</td>
      <td>${c.hospital.replace('โรงพยาบาล','รพ.')}</td>
      <td>${c.date}</td>
    </tr>
  `).join('');
}

function exportResearchData() {
  const format = document.querySelector('input[name="exportFormat"]:checked')?.value || 'csv';
  const children = getDemoData('getPopulationAnalytics').data.children || [];
  
  if (format === 'csv') {
    const headers = 'child_id,age_months,gender,gm_result,fm_result,rl_result,el_result,ps_result,dspm_outcome,ai_risk_score,ai_risk_level,hospital,date';
    const rows = children.map(c =>
      `${c.id},${c.age.replace(/[^0-9]/g,'').trim()},${c.name.includes('ด.ช') ? 'ชาย' : 'หญิง'},${c.gm},${c.fm},${c.rl},${c.el},${c.ps},${c.dspm_outcome},${Math.floor(Math.random()*60)+5},${c.ai_risk_level},${c.hospital},${c.date}`
    ).join('\n');
    const blob = new Blob(['\uFEFF' + headers + '\n' + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `PediAI_Research_Data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
    showToast('✅ ส่งออก CSV สำเร็จ!', 'success');
  } else if (format === 'json') {
    const jsonData = JSON.stringify({ metadata: { platform: 'PediAI', version: '2.4.1', exportDate: new Date().toISOString(), totalRecords: children.length }, data: children }, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `PediAI_Research_Data_${new Date().toISOString().split('T')[0]}.json`;
    a.click(); URL.revokeObjectURL(url);
    showToast('✅ ส่งออก JSON สำเร็จ!', 'success');
  } else {
    showToast('📊 ส่งออก Excel — ต้องเชื่อม Backend จริง', 'info');
  }
}
