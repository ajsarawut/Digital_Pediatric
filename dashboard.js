// ================================================================
// dashboard.js — Chart.js Visualizations & Dashboard Logic
// ================================================================

var charts = {};

async function loadDashboard() {
  try {
    // ใช้ mock data สำหรับ Demo (ลบ comment เพื่อใช้ API จริง)
    // var res = await api_getPopAnalytics();
    var res = getMockDashboardData();

    if (res.status !== 'success') { showToast('โหลดข้อมูลไม่สำเร็จ', 'error'); return; }
    var d = res.data;

    renderKPIs(d.national_summary);
    renderDomainChart(d.delay_by_domain);
    renderRiskPie(d.national_summary);
    renderTrendChart(d.monthly_trend);
    renderAgeChart(d.by_age_group);
    renderHospitalChart(d.by_hospital);
    renderProvinceChart(d.by_province);
    renderRecentTable(getMockRecentCases());

  } catch (err) {
    console.error('Dashboard error:', err);
    showToast('เกิดข้อผิดพลาด: ' + err.message, 'error');
  }
}

// ----------------------------------------------------------------
// KPIs
// ----------------------------------------------------------------
function renderKPIs(s) {
  setText('kpiTotal',       s.total_children.toLocaleString());
  setText('kpiAssess',      s.total_assessments.toLocaleString() + ' การประเมิน');
  setText('kpiNormal',      s.normal.count.toLocaleString());
  setText('kpiNormalPct',   s.normal.pct + '%');
  setText('kpiMonitor',     s.monitoring.count.toLocaleString());
  setText('kpiMonitorPct',  s.monitoring.pct + '%');
  setText('kpiModerate',    s.moderate.count.toLocaleString());
  setText('kpiModeratePct', s.moderate.pct + '%');
  setText('kpiHigh',        s.high_risk.count.toLocaleString());
  setText('kpiHighPct',     s.high_risk.pct + '%');
}

// ----------------------------------------------------------------
// Domain Delay Bar Chart
// ----------------------------------------------------------------
function renderDomainChart(domainData) {
  if (charts.domain) { charts.domain.destroy(); }
  var labels  = ['GM\nมัดใหญ่', 'FM\nมัดเล็ก', 'RL\nรับรู้ภาษา', 'EL\nแสดงออก', 'PS\nสังคม'];
  var delays  = ['GM','FM','RL','EL','PS'].map(function(d){ return domainData[d] ? domainData[d].delay : 0; });
  var monitors= ['GM','FM','RL','EL','PS'].map(function(d){ return domainData[d] ? domainData[d].monitor: 0; });

  var ctx = document.getElementById('domainChart').getContext('2d');
  charts.domain = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['GM กล้ามเนื้อมัดใหญ่', 'FM กล้ามเนื้อมัดเล็ก', 'RL รับรู้ภาษา', 'EL แสดงออก', 'PS สังคม-อารมณ์'],
      datasets: [
        { label: 'ล่าช้า (Delay)', data: delays,   backgroundColor: 'rgba(220,38,38,0.7)',   borderColor: '#dc2626', borderWidth: 1.5, borderRadius: 4 },
        { label: 'ติดตาม (Monitor)',data: monitors, backgroundColor: 'rgba(8,145,178,0.6)',   borderColor: '#0891b2', borderWidth: 1.5, borderRadius: 4 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top', labels: { font: { family: 'Sarabun', size: 13 } } } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: 'Sarabun', size: 12 } } },
        y: { beginAtZero: true, ticks: { font: { family: 'Sarabun', size: 12 } }, grid: { color: '#f1f5f9' } }
      }
    }
  });
}

// ----------------------------------------------------------------
// Risk Pie Chart
// ----------------------------------------------------------------
function renderRiskPie(s) {
  if (charts.pie) { charts.pie.destroy(); }
  var ctx = document.getElementById('riskPieChart').getContext('2d');
  charts.pie = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['ปกติ', 'เฝ้าระวัง', 'เสี่ยงปานกลาง', 'เสี่ยงสูง'],
      datasets: [{
        data: [s.normal.count, s.monitoring.count, s.moderate.count, s.high_risk.count],
        backgroundColor: ['#16a34a','#0891b2','#d97706','#dc2626'],
        borderWidth: 2, borderColor: '#ffffff',
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: { position: 'bottom', labels: { font: { family: 'Sarabun', size: 12 }, padding: 16, usePointStyle: true } },
        tooltip: { callbacks: {
          label: function(c){ return ' ' + c.label + ': ' + c.raw.toLocaleString() + ' (' + ((c.raw/c.dataset.data.reduce(function(a,b){return a+b;},0))*100).toFixed(1) + '%)'; }
        }}
      }
    }
  });
}

// ----------------------------------------------------------------
// Monthly Trend Line Chart
// ----------------------------------------------------------------
function renderTrendChart(trend) {
  if (charts.trend) { charts.trend.destroy(); }
  var ctx = document.getElementById('trendChart').getContext('2d');
  charts.trend = new Chart(ctx, {
    type: 'line',
    data: {
      labels: trend.map(function(t){ return t.label; }),
      datasets: [
        {
          label: 'การประเมินทั้งหมด', data: trend.map(function(t){ return t.total; }),
          borderColor: '#1a7be4', backgroundColor: 'rgba(26,123,228,0.1)',
          tension: 0.4, fill: true, pointRadius: 4, pointHoverRadius: 6
        },
        {
          label: 'เสี่ยงสูง', data: trend.map(function(t){ return t.high_risk; }),
          borderColor: '#dc2626', backgroundColor: 'rgba(220,38,38,0.08)',
          tension: 0.4, fill: true, pointRadius: 4, pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top', labels: { font: { family: 'Sarabun', size: 12 } } } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: 'Sarabun', size: 12 } } },
        y: { beginAtZero: true, ticks: { font: { family: 'Sarabun', size: 12 } }, grid: { color: '#f1f5f9' } }
      }
    }
  });
}

// ----------------------------------------------------------------
// Age Group Bar Chart
// ----------------------------------------------------------------
function renderAgeChart(ageData) {
  if (charts.age) { charts.age.destroy(); }
  var ctx = document.getElementById('ageChart').getContext('2d');
  charts.age = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ageData.map(function(a){ return a.label; }),
      datasets: [
        { label: 'จำนวนทั้งหมด', data: ageData.map(function(a){ return a.total; }),
          backgroundColor: 'rgba(26,123,228,0.5)', borderColor: '#1a7be4', borderWidth: 1.5, borderRadius: 4 },
        { label: 'เสี่ยงสูง', data: ageData.map(function(a){ return a.high_risk; }),
          backgroundColor: 'rgba(220,38,38,0.65)', borderColor: '#dc2626', borderWidth: 1.5, borderRadius: 4 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top', labels: { font: { family: 'Sarabun', size: 12 } } } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: 'Sarabun', size: 11 }, maxRotation: 0 } },
        y: { beginAtZero: true, ticks: { font: { family: 'Sarabun', size: 12 } }, grid: { color: '#f1f5f9' } }
      }
    }
  });
}

// ----------------------------------------------------------------
// Hospital Comparison
// ----------------------------------------------------------------
function renderHospitalChart(hospitals) {
  if (charts.hospital) { charts.hospital.destroy(); }
  var ctx = document.getElementById('hospitalChart').getContext('2d');
  charts.hospital = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: hospitals.map(function(h){ return h.hospital_name; }),
      datasets: [{
        label: 'อัตราพัฒนาการล่าช้า (%)',
        data: hospitals.map(function(h){ return h.delay_rate; }),
        backgroundColor: hospitals.map(function(h){ return h.delay_rate > 12 ? 'rgba(220,38,38,0.65)' : h.delay_rate > 8 ? 'rgba(217,119,6,0.65)' : 'rgba(22,163,74,0.65)'; }),
        borderWidth: 0, borderRadius: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, ticks: { font: { family: 'Sarabun', size: 12 }, callback: function(v){ return v + '%'; } }, grid: { color: '#f1f5f9' } },
        y: { grid: { display: false }, ticks: { font: { family: 'Sarabun', size: 12 } } }
      }
    }
  });
}

// ----------------------------------------------------------------
// Province Chart
// ----------------------------------------------------------------
function renderProvinceChart(provinces) {
  if (charts.province) { charts.province.destroy(); }
  var ctx = document.getElementById('provinceChart').getContext('2d');
  var colors = ['#1a7be4','#0891b2','#16a34a','#d97706','#dc2626','#7c3aed','#db2777','#059669'];
  charts.province = new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: provinces.map(function(p){ return p.province_name; }),
      datasets: [{
        data: provinces.map(function(p){ return p.total_children; }),
        backgroundColor: colors.slice(0, provinces.length).map(function(c){ return c + '99'; }),
        borderColor: colors.slice(0, provinces.length),
        borderWidth: 1.5
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { font: { family: 'Sarabun', size: 11 }, padding: 8 } } }
    }
  });
}

// ----------------------------------------------------------------
// Recent High-Risk Table
// ----------------------------------------------------------------
function renderRecentTable(cases) {
  var tbody = document.getElementById('recentTableBody');
  if (!cases || !cases.length) {
    tbody.innerHTML = '<tr><td colspan="10" class="text-center py-4 text-muted">ไม่พบข้อมูล</td></tr>';
    return;
  }
  tbody.innerHTML = cases.map(function(c) {
    var a = c.assessment;
    return '<tr>' +
      '<td><strong>' + (c.child_name||'N/A') + '</strong></td>' +
      '<td><code>' + (c.hn||'—') + '</code></td>' +
      '<td>' + (a.age_months||'—') + ' เดือน</td>' +
      '<td>' + getResultBadge(a.GM_result) + '</td>' +
      '<td>' + getResultBadge(a.FM_result) + '</td>' +
      '<td>' + getResultBadge(a.RL_result) + '</td>' +
      '<td>' + getResultBadge(a.EL_result) + '</td>' +
      '<td>' + getResultBadge(a.PS_result) + '</td>' +
      '<td>' + getRiskBadgeHTML(a.risk_level) + '</td>' +
      '<td>' + (a.assessment_date||'—') + '</td>' +
    '</tr>';
  }).join('');
}

// ----------------------------------------------------------------
// Utility
// ----------------------------------------------------------------
function setText(id, val) {
  var el = document.getElementById(id);
  if (el) el.textContent = val;
}
