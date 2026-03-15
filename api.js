// ================================================================
// api.js — API Client สำหรับ Google Apps Script Backend
// ================================================================

// ⚠️ ตั้งค่า URL ของ Google Apps Script Web App ที่นี่
var API_BASE_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

// ----------------------------------------------------------------
// HTTP Helpers
// ----------------------------------------------------------------
async function apiGet(action, params) {
  params = params || {};
  params.action = action;
  var qs = Object.keys(params).map(function(k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
  }).join('&');
  var url = API_BASE_URL + '?' + qs;
  try {
    var res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.error('API GET Error:', err);
    return { status: 'error', message: err.message };
  }
}

async function apiPost(action, data) {
  data = data || {};
  data.action = action;
  try {
    var res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err) {
    console.error('API POST Error:', err);
    return { status: 'error', message: err.message };
  }
}

// ----------------------------------------------------------------
// API Functions
// ----------------------------------------------------------------
function api_addChild(data)          { return apiPost('addChild', data); }
function api_addAssessment(data)     { return apiPost('addAssessment', data); }
function api_getChildren(params)     { return apiGet('getChildren', params); }
function api_getAssessments(params)  { return apiGet('getAssessments', params); }
function api_analyzeDSPM(params)     { return apiGet('analyzeDSPM', params); }
function api_getHospitalDash(params) { return apiGet('getHospitalDash', params); }
function api_getProvincialDash(params){ return apiGet('getProvincialDash', params); }
function api_getPopAnalytics()       { return apiGet('getPopAnalytics', {}); }
function api_getAIRisk(params)       { return apiGet('getAIRisk', params); }
function api_exportResearch(params)  { return apiGet('exportResearch', params); }
function api_getHospitals()          { return apiGet('getHospitals', {}); }
function api_getProvinces()          { return apiGet('getProvinces', {}); }
function api_chatbot(params)         { return apiGet('chatbot', params); }

// ----------------------------------------------------------------
// Mock Data — ใช้สำหรับ Demo เมื่อยังไม่ได้ตั้งค่า API
// ----------------------------------------------------------------
function getMockDashboardData() {
  return {
    status: 'success',
    data: {
      national_summary: {
        total_children: 1847,
        total_assessments: 4312,
        normal:     { count: 2893, pct: 67.1 },
        monitoring: { count: 648,  pct: 15.0 },
        moderate:   { count: 518,  pct: 12.0 },
        high_risk:  { count: 253,  pct: 5.9 },
        delay_rate: 17.9
      },
      delay_by_domain: {
        GM: { delay: 198, monitor: 142, total: 4312 },
        FM: { delay: 215, monitor: 168, total: 4312 },
        RL: { delay: 287, monitor: 203, total: 4312 },
        EL: { delay: 312, monitor: 224, total: 4312 },
        PS: { delay: 156, monitor: 118, total: 4312 }
      },
      by_age_group: [
        { label: '0-6 เดือน',   total: 312, high_risk: 8,  delay_rate: 2.6 },
        { label: '7-12 เดือน',  total: 486, high_risk: 24, delay_rate: 4.9 },
        { label: '13-24 เดือน', total: 892, high_risk: 87, delay_rate: 9.8 },
        { label: '25-36 เดือน', total: 784, high_risk: 74, delay_rate: 9.4 },
        { label: '37-60 เดือน', total: 1134,high_risk: 48, delay_rate: 4.2 },
        { label: '>60 เดือน',   total: 704, high_risk: 12, delay_rate: 1.7 }
      ],
      by_hospital: [
        { hospital_name: 'รพ.เด็ก กรุงเทพ',     total_children: 624, high_risk: 89, delay_rate: 14.3 },
        { hospital_name: 'รพ.มหาราช เชียงใหม่',  total_children: 481, high_risk: 62, delay_rate: 12.9 },
        { hospital_name: 'รพ.ขอนแก่น',           total_children: 368, high_risk: 48, delay_rate: 13.0 },
        { hospital_name: 'รพ.สงขลานครินทร์',     total_children: 287, high_risk: 35, delay_rate: 12.2 },
        { hospital_name: 'รพ.ชลบุรี',            total_children: 187, high_risk: 19, delay_rate: 10.2 }
      ],
      by_province: [
        { province_name: 'กรุงเทพมหานคร', total_children: 624, high_risk: 89, delay_rate: 14.3 },
        { province_name: 'เชียงใหม่',     total_children: 481, high_risk: 62, delay_rate: 12.9 },
        { province_name: 'ขอนแก่น',       total_children: 368, high_risk: 48, delay_rate: 13.0 },
        { province_name: 'สงขลา',         total_children: 287, high_risk: 35, delay_rate: 12.2 },
        { province_name: 'ชลบุรี',        total_children: 187, high_risk: 19, delay_rate: 10.2 }
      ],
      monthly_trend: [
        { label:'8/2024', total:284, high_risk:18, delay_rate:6.3 },
        { label:'9/2024', total:312, high_risk:22, delay_rate:7.1 },
        { label:'10/2024',total:298, high_risk:19, delay_rate:6.4 },
        { label:'11/2024',total:341, high_risk:26, delay_rate:7.6 },
        { label:'12/2024',total:378, high_risk:28, delay_rate:7.4 },
        { label:'1/2025', total:362, high_risk:24, delay_rate:6.6 }
      ]
    }
  };
}

function getMockRecentCases() {
  return [
    { child_name:'ด.ช.สมชาย ใจดี', hn:'HN00123', assessment:{age_months:18, GM_result:'Delay', FM_result:'Delay', RL_result:'Pass', EL_result:'Monitor', PS_result:'Pass', risk_level:'High Risk Developmental Delay', assessment_date:'2025-01-15'} },
    { child_name:'ด.ญ.สมหญิง รักไทย', hn:'HN00456', assessment:{age_months:24, GM_result:'Pass', FM_result:'Monitor', RL_result:'Delay', EL_result:'Delay', PS_result:'Monitor', risk_level:'High Risk Developmental Delay', assessment_date:'2025-01-14'} },
    { child_name:'ด.ช.วิชัย มั่นคง', hn:'HN00789', assessment:{age_months:12, GM_result:'Pass', FM_result:'Pass', RL_result:'Monitor', EL_result:'Pass', PS_result:'Delay', risk_level:'Moderate Risk', assessment_date:'2025-01-13'} }
  ];
}

// ----------------------------------------------------------------
// Utility Functions
// ----------------------------------------------------------------
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('mainContent').classList.toggle('sidebar-open');
}

function showToast(msg, type) {
  type = type || 'info';
  var el = document.createElement('div');
  el.className = 'toast-msg';
  el.textContent = msg;
  if (!document.querySelector('.toast-container')) {
    var tc = document.createElement('div');
    tc.className = 'toast-container';
    document.body.appendChild(tc);
  }
  document.querySelector('.toast-container').appendChild(el);
  setTimeout(function(){ el.remove(); }, 3500);
}

function getRiskBadgeHTML(risk_level) {
  var map = {
    'Normal Development':           ['risk-normal',   'bi-check-circle-fill', 'ปกติ'],
    'Development Monitoring':       ['risk-monitor',  'bi-eye-fill',          'เฝ้าระวัง'],
    'Moderate Risk':                ['risk-moderate', 'bi-exclamation-triangle-fill', 'เสี่ยงปานกลาง'],
    'High Risk Developmental Delay':['risk-high',     'bi-exclamation-circle-fill',   'เสี่ยงสูง']
  };
  var v = map[risk_level] || ['risk-monitor','bi-question-circle','ไม่ทราบ'];
  return '<span class="risk-badge ' + v[0] + '"><i class="bi ' + v[1] + '"></i>' + v[2] + '</span>';
}

function getResultBadge(result) {
  if (result === 'Pass')    return '<span class="badge bg-success">ผ่าน</span>';
  if (result === 'Monitor') return '<span class="badge bg-info text-white">ติดตาม</span>';
  if (result === 'Delay')   return '<span class="badge bg-danger">ล่าช้า</span>';
  return '<span class="badge bg-secondary">—</span>';
}
