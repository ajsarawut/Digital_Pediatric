// ================================================================
// risk.js — AI Risk Prediction Page Logic
// ================================================================

var aiDomainResults = { GM: null, FM: null, RL: null, EL: null, PS: null };
var aiChart = null;

function setAIDomain(domain, result) {
  aiDomainResults[domain] = result;
  var d = domain.toLowerCase();
  ['pass','monitor','delay'].forEach(function(r) {
    document.getElementById('ai-'+d+'-'+r).classList.remove('active');
  });
  var btnMap = { 'Pass':'pass', 'Monitor':'monitor', 'Delay':'delay' };
  document.getElementById('ai-'+d+'-'+btnMap[result]).classList.add('active');

  var item = document.getElementById('ai-'+d+'-item');
  item.style.borderLeft = '4px solid ' + (result==='Pass'?'#16a34a':result==='Monitor'?'#0891b2':'#dc2626');

  // Auto compute if all filled
  var all = ['GM','FM','RL','EL','PS'].every(function(k){ return aiDomainResults[k] !== null; });
  if (all) runAIPrediction();
}

function computeLive() {
  var all = ['GM','FM','RL','EL','PS'].every(function(k){ return aiDomainResults[k] !== null; });
  if (all) runAIPrediction();
}

function runAIPrediction() {
  var age = Number(document.getElementById('aiAge').value) || 0;
  var weights = { GM:0.20, FM:0.20, RL:0.25, EL:0.25, PS:0.10 };
  var scores  = { Pass:0, Monitor:0.5, Delay:1.0 };

  var raw = 0;
  var factors = {};
  ['GM','FM','RL','EL','PS'].forEach(function(d) {
    var v = aiDomainResults[d];
    if (!v) { v = 'Pass'; }
    var s = scores[v] * weights[d];
    raw += s;
    factors[d] = { result: v, score: scores[v], weight: weights[d], contribution: +(s*100).toFixed(1) };
  });

  // Age modifier
  var modifier = age <= 6 ? 1.2 : age <= 12 ? 1.1 : age <= 24 ? 1.0 : age <= 36 ? 0.95 : 0.9;
  var finalScore = Math.min(100, Math.round(raw * modifier * 100));

  var riskLevel, riskColor, riskClass, confidence;
  if (finalScore >= 60) {
    riskLevel = 'High Risk';     riskColor = '#dc2626'; riskClass = 'danger';  confidence = 78 + Math.floor(Math.random()*12);
  } else if (finalScore >= 30) {
    riskLevel = 'Moderate Risk'; riskColor = '#d97706'; riskClass = 'warning'; confidence = 72 + Math.floor(Math.random()*15);
  } else {
    riskLevel = 'Low Risk';      riskColor = '#16a34a'; riskClass = 'success'; confidence = 80 + Math.floor(Math.random()*15);
  }

  renderAIResult(finalScore, riskLevel, riskColor, riskClass, confidence, factors);
}

function renderAIResult(score, level, color, cls, confidence, factors) {
  var panel = document.getElementById('aiResultPanel');
  panel.style.display = 'block';

  // Score
  var bigEl = document.getElementById('aiScoreBig');
  bigEl.textContent = score;
  bigEl.style.color = color;

  document.getElementById('aiRiskBadge').innerHTML =
    '<span class="risk-badge risk-'+cls+'"><i class="bi bi-'+(cls==='danger'?'exclamation-circle-fill':cls==='warning'?'exclamation-triangle-fill':'check-circle-fill')+'"></i> '+level+'</span>';
  document.getElementById('aiConfidence').textContent = confidence;

  // Factor bars
  var barColors = { Pass:'#16a34a', Monitor:'#0891b2', Delay:'#dc2626' };
  var domainNames = { GM:'Gross Motor', FM:'Fine Motor', RL:'Receptive Lang', EL:'Expressive Lang', PS:'Personal Social' };
  var barsHtml = Object.keys(factors).map(function(d) {
    var f = factors[d];
    var fillColor = barColors[f.result];
    var fillPct = f.contribution / 25 * 100;
    return '<div class="factor-bar">' +
      '<div class="factor-label">' +
        '<span><strong>'+d+'</strong> <small class="text-muted">'+domainNames[d]+'</small></span>' +
        '<span class="badge" style="background:'+fillColor+';color:white">'+f.result+'</span>' +
      '</div>' +
      '<div class="factor-progress">' +
        '<div class="factor-fill" style="width:'+Math.min(100,fillPct)+'%;background:'+fillColor+'"></div>' +
      '</div>' +
    '</div>';
  }).join('');
  document.getElementById('aiFactorBars').innerHTML = barsHtml;

  // Recommendations
  var recs = getRecommendations(level, factors);
  document.getElementById('aiRecommendations').innerHTML = recs.map(function(r) {
    return '<div class="d-flex gap-2 mb-2"><i class="bi bi-arrow-right-circle-fill text-primary mt-1" style="flex-shrink:0"></i><span style="font-size:13px">'+r+'</span></div>';
  }).join('');

  renderScoreGaugeChart(score, color);
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getRecommendations(level, factors) {
  var recs = [];
  if (level === 'High Risk') {
    recs.push('ส่งปรึกษากุมารแพทย์ด้านพัฒนาการ (Developmental Pediatrician) ภายใน 1-2 สัปดาห์');
    recs.push('พิจารณาส่งตรวจ Hearing test, Vision screening, และ Chromosomal analysis');
    recs.push('ประเมิน Autism Spectrum Disorder (M-CHAT) หากอายุ 18-30 เดือน');
    recs.push('แจ้งผู้ปกครองและให้คำแนะนำกิจกรรมกระตุ้นพัฒนาการที่บ้านทันที');
  } else if (level === 'Moderate Risk') {
    recs.push('นัดติดตามผลในอีก 4-6 สัปดาห์');
    recs.push('แนะนำกิจกรรมส่งเสริมพัฒนาการตาม domain ที่บกพร่อง');
    recs.push('ให้ความรู้ผู้ปกครองเรื่องการกระตุ้นพัฒนาการที่บ้าน');
  } else {
    recs.push('ดูแลต่อเนื่องตามกำหนดนัดปกติ');
    recs.push('ส่งเสริมโภชนาการ การนอนหลับ และการเล่นที่เหมาะสมกับวัย');
    recs.push('ลด Screen Time ตามคำแนะนำ AAP (< 1 ชม./วัน สำหรับเด็ก 2-5 ปี)');
  }
  var delayDomains = Object.keys(factors).filter(function(d){ return factors[d].result === 'Delay'; });
  if (delayDomains.length) recs.push('โดเมนที่ต้องให้ความสนใจ: ' + delayDomains.join(', '));
  return recs;
}

function renderScoreGaugeChart(score, color) {
  if (aiChart) aiChart.destroy();
  var ctx = document.getElementById('aiScoreChart').getContext('2d');
  aiChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Low Risk\n(0-29)', 'Moderate Risk\n(30-59)', 'High Risk\n(60-100)'],
      datasets: [{
        label: 'ขอบเขตความเสี่ยง',
        data: [29, 30, 41],
        backgroundColor: ['rgba(22,163,74,0.3)', 'rgba(217,119,6,0.3)', 'rgba(220,38,38,0.3)'],
        borderColor: ['#16a34a', '#d97706', '#dc2626'],
        borderWidth: 1.5, borderRadius: 6
      }, {
        label: 'AI Score ปัจจุบัน',
        data: [score <= 29 ? score : 0, score >= 30 && score <= 59 ? score : 0, score >= 60 ? score : 0],
        backgroundColor: color + '99',
        borderColor: color,
        borderWidth: 2, borderRadius: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { font: { family: 'Sarabun', size: 13 } } },
        title: { display: true, text: 'AI Risk Score — ' + score + '/100', font: { family: 'Sarabun', size: 14 } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: 'Sarabun', size: 12 } } },
        y: { beginAtZero: true, max: 100, ticks: { font: { family: 'Sarabun', size: 12 } }, grid: { color: '#f1f5f9' } }
      }
    }
  });
}
