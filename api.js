/**
 * PediAI Platform — API Client (JavaScript)
 * ติดต่อ Google Apps Script Backend
 */

// ===== CONFIG =====
const API_CONFIG = {
  // แทนที่ด้วย URL ของ Google Apps Script ที่ Deploy แล้ว
  BASE_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
  TIMEOUT: 15000,
  VERSION: '2.4.1'
};

// ===== DEMO DATA (ใช้เมื่อยังไม่ได้เชื่อม Backend จริง) =====
const DEMO_MODE = true; // เปลี่ยนเป็น false เมื่อเชื่อม GAS จริง

// ===== API HELPERS =====
async function apiRequest(endpoint, method = 'GET', data = null) {
  if (DEMO_MODE) {
    return getDemoData(endpoint, data);
  }
  try {
    const url = `${API_CONFIG.BASE_URL}?action=${endpoint}`;
    const options = {
      method: method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (data && method === 'POST') {
      options.body = JSON.stringify(data);
    }
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (err) {
    console.error('API Error:', err);
    return { status: 'error', message: err.message };
  }
}

// ===== PUBLIC API FUNCTIONS =====

async function addChild(childData) {
  return apiRequest('addChild', 'POST', childData);
}

async function addAssessment(assessmentData) {
  return apiRequest('addAssessment', 'POST', assessmentData);
}

async function getChildren() {
  return apiRequest('getChildren');
}

async function getAssessments() {
  return apiRequest('getAssessments');
}

async function analyzeDSPM(gm, fm, rl, el, ps) {
  if (DEMO_MODE) {
    return analyzeDSPMLocal(gm, fm, rl, el, ps);
  }
  return apiRequest('analyzeDSPM', 'GET', { gm, fm, rl, el, ps });
}

async function getAIRiskPrediction(params) {
  if (DEMO_MODE) {
    return computeAIRiskLocal(params);
  }
  return apiRequest('getAIRiskPrediction', 'GET', params);
}

async function getHospitalDashboard(hospitalId = 'all') {
  return apiRequest('getHospitalDashboard', 'GET', { hospital_id: hospitalId });
}

async function getProvincialDashboard() {
  return apiRequest('getProvincialDashboard');
}

async function getPopulationAnalytics() {
  return apiRequest('getPopulationAnalytics');
}

async function exportResearchData(filters) {
  return apiRequest('exportResearchData', 'GET', filters);
}

// ===== DSPM CLINICAL DECISION ENGINE (Client-side) =====
function analyzeDSPMLocal(gm, fm, rl, el, ps) {
  const domains = { gm, fm, rl, el, ps };
  const domainNames = { gm: 'GM กล้ามเนื้อมัดใหญ่', fm: 'FM กล้ามเนื้อมัดเล็ก', rl: 'RL ภาษารับรู้', el: 'EL ภาษาแสดงออก', ps: 'PS สังคม/ช่วยเหลือตนเอง' };
  
  const delayCount = Object.values(domains).filter(v => v === 'ล่าช้า').length;
  const monitorCount = Object.values(domains).filter(v => v === 'ติดตาม').length;
  const delayedDomains = Object.entries(domains).filter(([k, v]) => v === 'ล่าช้า').map(([k]) => domainNames[k]);
  const monitorDomains = Object.entries(domains).filter(([k, v]) => v === 'ติดตาม').map(([k]) => domainNames[k]);

  let risk_level, risk_class, risk_icon, recommendations;

  if (delayCount >= 2) {
    risk_level = 'สงสัยพัฒนาการล่าช้า (High Risk)';
    risk_class = 'high';
    risk_icon = '🔴';
    recommendations = [
      'ส่งต่อแพทย์กุมารแพทย์พัฒนาการทันที',
      'นัดติดตามภายใน 1 เดือน',
      'แนะนำกระตุ้นพัฒนาการโดยนักกายภาพบำบัด',
      'ประเมินซ้ำด้วย Denver II',
      'แจ้งผู้ปกครองและให้คำแนะนำกิจกรรมกระตุ้น'
    ];
  } else if (delayCount === 1) {
    risk_level = 'ความเสี่ยงปานกลาง (Moderate Risk)';
    risk_class = 'moderate';
    risk_icon = '🟡';
    recommendations = [
      'นัดติดตามพัฒนาการใน 2-3 เดือน',
      'แนะนำกิจกรรมกระตุ้นพัฒนาการตามด้านที่ล่าช้า',
      'ให้ความรู้ผู้ปกครองเรื่องการส่งเสริมพัฒนาการ',
      'บันทึกและติดตามอย่างใกล้ชิด'
    ];
  } else if (monitorCount > 0) {
    risk_level = 'ติดตามพัฒนาการ (Monitoring)';
    risk_class = 'moderate';
    risk_icon = '🟠';
    recommendations = [
      'นัดติดตามในการตรวจครั้งถัดไปตามตาราง',
      'แนะนำกิจกรรมส่งเสริมพัฒนาการตามวัย',
      'แนะนำผู้ปกครองสังเกตพัฒนาการที่บ้าน'
    ];
  } else {
    risk_level = 'พัฒนาการปกติ (Normal)';
    risk_class = 'normal';
    risk_icon = '🟢';
    recommendations = [
      'พัฒนาการสมวัยทุกด้าน',
      'ให้ความรู้ส่งเสริมพัฒนาการตามวัยแก่ผู้ปกครอง',
      'นัดติดตามตามตารางคลินิกสุขภาพเด็กดี'
    ];
  }

  return {
    status: 'success',
    data: {
      risk_level, risk_class, risk_icon,
      delay_count: delayCount,
      monitor_count: monitorCount,
      delayed_domains: delayedDomains,
      monitor_domains: monitorDomains,
      recommendations,
      domains
    }
  };
}

// ===== AI RISK SCORING ENGINE (Client-side) =====
function computeAIRiskLocal(params) {
  const { gm, fm, rl, el, ps, age, birthWeight, gestAge, prevHistory, familyHistory } = params;
  
  // Domain weights (ตามความสำคัญทางคลินิก)
  const weights = { gm: 0.20, fm: 0.18, rl: 0.22, el: 0.22, ps: 0.18 };
  
  // Score ตาม result
  const domainScores = { 'ปกติ': 1.0, 'ติดตาม': 0.5, 'ล่าช้า': 0.0 };
  
  // คำนวณ domain score
  const domainInput = { gm, fm, rl, el, ps };
  let baseScore = 0;
  Object.entries(domainInput).forEach(([domain, result]) => {
    const score = domainScores[result] ?? 1.0;
    baseScore += score * weights[domain];
  });

  // Risk factors
  let riskPenalty = 0;
  if (birthWeight && birthWeight < 2500) riskPenalty += 0.08; // LBW
  if (gestAge && gestAge < 37) riskPenalty += 0.06;           // Preterm
  if (prevHistory === '1') riskPenalty += 0.06;
  if (prevHistory === '2') riskPenalty += 0.12;
  if (familyHistory === '1') riskPenalty += 0.04;
  
  // Age-specific risk boost
  const ageMo = parseInt(age) || 0;
  let ageModifier = 0;
  if (ageMo <= 12) ageModifier = 0.02; // Critical period
  else if (ageMo <= 24) ageModifier = 0.01;

  const finalScore = Math.max(0, Math.min(1, baseScore - riskPenalty + ageModifier));
  const riskPercent = Math.round((1 - finalScore) * 100);
  
  let riskLevel, riskClass, riskIcon;
  if (riskPercent >= 60) { riskLevel = 'ความเสี่ยงสูง (High Risk)'; riskClass = 'high'; riskIcon = '🔴'; }
  else if (riskPercent >= 30) { riskLevel = 'ความเสี่ยงปานกลาง (Moderate Risk)'; riskClass = 'moderate'; riskIcon = '🟡'; }
  else { riskLevel = 'ความเสี่ยงต่ำ (Low Risk)'; riskClass = 'low'; riskIcon = '🟢'; }

  // Feature contributions
  const contributions = [
    { label: 'GM — กล้ามเนื้อมัดใหญ่', value: Math.round(weights.gm * (1 - (domainScores[gm] ?? 1)) * 100), domain: gm },
    { label: 'FM — กล้ามเนื้อมัดเล็ก', value: Math.round(weights.fm * (1 - (domainScores[fm] ?? 1)) * 100), domain: fm },
    { label: 'RL — ภาษารับรู้', value: Math.round(weights.rl * (1 - (domainScores[rl] ?? 1)) * 100), domain: rl },
    { label: 'EL — ภาษาแสดงออก', value: Math.round(weights.el * (1 - (domainScores[el] ?? 1)) * 100), domain: el },
    { label: 'PS — สังคม/ช่วยเหลือตนเอง', value: Math.round(weights.ps * (1 - (domainScores[ps] ?? 1)) * 100), domain: ps },
  ];

  return {
    status: 'success',
    data: { risk_score: riskPercent, risk_level: riskLevel, risk_class: riskClass, risk_icon: riskIcon, contributions, params }
  };
}

// ===== DEMO DATA GENERATOR =====
function getDemoData(endpoint, params = {}) {
  const hospitals = [
    { id: 'H001', name: 'รพ.สุราษฎร์ธานี', district: 'เมือง', total: 420, normal: 356, monitor: 41, delay: 23 },
    { id: 'H002', name: 'รพ.เกาะสมุย', district: 'เกาะสมุย', total: 318, normal: 271, monitor: 29, delay: 18 },
    { id: 'H003', name: 'รพ.ไชยา', district: 'ไชยา', total: 215, normal: 185, monitor: 20, delay: 10 },
    { id: 'H004', name: 'รพ.ท่าฉาง', district: 'ท่าฉาง', total: 178, normal: 153, monitor: 18, delay: 7 },
    { id: 'H005', name: 'รพ.พุนพิน', district: 'พุนพิน', total: 153, normal: 124, monitor: 18, delay: 11 },
  ];

  const names = ['ด.ช.ธีรพงศ์ สุขใจ','ด.ญ.ปภัสรา มีสุข','ด.ช.กฤตภาส ใจดี','ด.ญ.ณัชชา สมบูรณ์','ด.ช.ปุณณวิช ชัยเจริญ','ด.ญ.ภัทรธิดา วงษ์ทอง','ด.ช.อรรถพล พิทักษ์','ด.ญ.ลลิตา เพ็ชรรัตน์'];
  const outcomes = ['ปกติ','ปกติ','ปกติ','ปกติ','ปกติ','ติดตาม','ติดตาม','สงสัยล่าช้า'];
  const aiRisks = ['ต่ำ','ต่ำ','ต่ำ','ต่ำ','ปานกลาง','ปานกลาง','สูง','ต่ำ'];
  const domains = ['ปกติ','ปกติ','ปกติ','ปกติ','ล่าช้า','ติดตาม'];

  if (endpoint === 'getPopulationAnalytics' || endpoint === 'getChildren') {
    const rows = names.map((name, i) => ({
      id: `C${String(i+1).padStart(3,'0')}`,
      name, age: `${12 + i*4} เดือน`,
      gm: domains[i % domains.length],
      fm: domains[(i+1) % domains.length],
      rl: domains[(i+2) % domains.length],
      el: domains[(i+3) % domains.length],
      ps: domains[(i+4) % domains.length],
      outcome: outcomes[i], ai_risk: aiRisks[i],
      hospital: hospitals[i % hospitals.length].name,
      date: `${2567 - (i%2)}-${String((i%12)+1).padStart(2,'0')}-${String((i%28)+1).padStart(2,'0')}`,
      dspm_outcome: outcomes[i],
      ai_risk_level: aiRisks[i]
    }));
    return { status: 'success', data: { children: rows, summary: { total: 1284, normal: 1089, monitor: 126, delay: 69 } } };
  }

  if (endpoint === 'getHospitalDashboard') {
    return { status: 'success', data: { hospitals } };
  }

  if (endpoint === 'getProvincialDashboard') {
    return { status: 'success', data: { hospitals, province: 'สุราษฎร์ธานี', total: 1284, normal: 1089, monitor: 126, delay: 69 } };
  }

  return { status: 'success', data: {} };
}

// ===== UTILITY FUNCTIONS =====
function calculateAge(dob) {
  if (!dob) return '';
  const birth = new Date(dob);
  const now = new Date();
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (years > 0) return `${years} ปี ${remMonths} เดือน (${months} เดือน)`;
  return `${months} เดือน`;
}

function generateChildId() {
  return 'C' + Date.now().toString().slice(-6);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const thYear = d.getFullYear() + 543;
  return `${d.getDate()}/${d.getMonth()+1}/${thYear}`;
}

function getOutcomeBadge(outcome) {
  const map = {
    'ปกติ': '<span class="badge-normal">✅ ปกติ</span>',
    'ติดตาม': '<span class="badge-monitor">👁 ติดตาม</span>',
    'สงสัยล่าช้า': '<span class="badge-delay">⚠️ สงสัยล่าช้า</span>',
    'ล่าช้ารุนแรง': '<span class="badge-delay">🔴 ล่าช้ารุนแรง</span>'
  };
  return map[outcome] || `<span class="badge bg-secondary">${outcome}</span>`;
}

function getRiskBadge(risk) {
  const map = {
    'ต่ำ': '<span class="badge-low-risk">🟢 ต่ำ</span>',
    'ปานกลาง': '<span class="badge-mod-risk">🟡 ปานกลาง</span>',
    'สูง': '<span class="badge-high-risk">🔴 สูง</span>'
  };
  return map[risk] || `<span class="badge bg-secondary">${risk}</span>`;
}

function showToast(message, type = 'success') {
  const el = document.createElement('div');
  const colors = { success: '#06d6a0', error: '#ef233c', warning: '#ffd60a', info: '#0f4c81' };
  el.innerHTML = `<div style="position:fixed;top:80px;right:20px;z-index:9999;background:${colors[type]||'#333'};color:#fff;padding:12px 20px;border-radius:10px;font-family:Sarabun,sans-serif;font-size:14px;font-weight:600;box-shadow:0 4px 20px rgba(0,0,0,0.2);animation:slideIn 0.3s ease">${message}</div>`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}
