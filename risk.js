/**
 * PediAI Platform — AI Risk Prediction JavaScript
 */

function runAIRisk() {
  const params = {
    gm: document.getElementById('risk_gm')?.value === '0' ? 'ล่าช้า' : document.getElementById('risk_gm')?.value === '1' ? 'ติดตาม' : 'ปกติ',
    fm: document.getElementById('risk_fm')?.value === '0' ? 'ล่าช้า' : document.getElementById('risk_fm')?.value === '1' ? 'ติดตาม' : 'ปกติ',
    rl: document.getElementById('risk_rl')?.value === '0' ? 'ล่าช้า' : document.getElementById('risk_rl')?.value === '1' ? 'ติดตาม' : 'ปกติ',
    el: document.getElementById('risk_el')?.value === '0' ? 'ล่าช้า' : document.getElementById('risk_el')?.value === '1' ? 'ติดตาม' : 'ปกติ',
    ps: document.getElementById('risk_ps')?.value === '0' ? 'ล่าช้า' : document.getElementById('risk_ps')?.value === '1' ? 'ติดตาม' : 'ปกติ',
    age: document.getElementById('risk_age')?.value || 24,
    birthWeight: document.getElementById('risk_bw')?.value,
    gestAge: document.getElementById('risk_ga')?.value,
    prevHistory: document.getElementById('risk_prev')?.value || '0',
    familyHistory: document.getElementById('risk_family')?.value || '0'
  };

  const result = computeAIRiskLocal(params);
  if (result.status === 'success') {
    renderAIRiskResult(result.data);
  }
}

function renderAIRiskResult(data) {
  const panel = document.getElementById('aiRiskResult');
  if (!panel) return;

  const colors = { low: 'var(--accent)', moderate: '#b89400', high: 'var(--danger)' };
  const bgColors = { low: 'rgba(6,214,160,0.08)', moderate: 'rgba(255,214,10,0.08)', high: 'rgba(239,35,60,0.08)' };
  const color = colors[data.risk_class] || '#333';

  const dspmResult = analyzeDSPMLocal(data.params.gm, data.params.fm, data.params.rl, data.params.el, data.params.ps);
  const dspm = dspmResult.data;

  panel.innerHTML = `
    <!-- Risk Score Circle -->
    <div class="risk-result-box ${data.risk_class} text-center">
      <div class="risk-score-circle" style="border: 4px solid ${color}">
        <div style="color:${color};font-size:28px;font-weight:900">${data.risk_score}</div>
        <span style="color:${color}">/ 100</span>
      </div>
      <h5 style="color:${color};font-weight:800;margin-top:12px">${data.risk_icon} ${data.risk_level}</h5>
      <p style="color:var(--text-muted);font-size:13px;margin:0">คะแนนความเสี่ยงจาก AI Model (0 = ต่ำ, 100 = สูง)</p>
    </div>

    <!-- DSPM Outcome -->
    <div class="dspm-outcome-card ${dspm.risk_class} mb-3">
      <div style="font-size:28px">${dspm.risk_icon}</div>
      <div>
        <div class="dspm-label">ผล DSPM Clinical Decision</div>
        <div class="dspm-desc fw-bold" style="font-size:14px;color:${colors[dspm.risk_class]}">${dspm.risk_level}</div>
        <div class="dspm-desc">ล่าช้า ${dspm.delay_count} ด้าน · ติดตาม ${dspm.monitor_count} ด้าน</div>
      </div>
    </div>

    <!-- Feature Contributions -->
    <h6 style="font-weight:700;color:var(--primary);margin-bottom:12px"><i class="fas fa-chart-bar me-2"></i>ปัจจัยที่มีผลต่อคะแนน AI</h6>
    <div style="margin-bottom:16px">
      ${data.contributions.map(c => {
        const pct = c.value;
        const barColor = c.domain === 'ล่าช้า' ? 'var(--danger)' : c.domain === 'ติดตาม' ? 'var(--warning)' : 'var(--accent)';
        return `
        <div style="margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:3px">
            <span style="font-weight:600">${c.label}</span>
            <span style="color:${barColor};font-weight:700">${c.domain} (+${pct})</span>
          </div>
          <div style="height:8px;background:#f0f0f0;border-radius:4px;overflow:hidden">
            <div style="height:100%;width:${Math.min(pct*5, 100)}%;background:${barColor};border-radius:4px;transition:width 0.6s ease"></div>
          </div>
        </div>`;
      }).join('')}
    </div>

    <!-- Recommendations -->
    <div style="background:#f8fafc;border-radius:10px;padding:14px;border-left:4px solid ${color}">
      <h6 style="font-weight:700;color:var(--primary);margin-bottom:10px"><i class="fas fa-clipboard-list me-2"></i>คำแนะนำทางคลินิก</h6>
      <ul style="margin:0;padding-left:18px">
        ${dspm.recommendations.map(r => `<li style="margin-bottom:5px;font-size:14px">${r}</li>`).join('')}
      </ul>
    </div>

    <!-- Actions -->
    <div class="d-flex gap-2 mt-3 flex-wrap">
      <a href="assessment.html" class="btn btn-sm btn-primary"><i class="fas fa-clipboard-check me-1"></i>ไปประเมินเต็มรูปแบบ</a>
      <a href="chatbot.html" class="btn btn-sm btn-outline-primary"><i class="fas fa-robot me-1"></i>ถามผู้ช่วย AI</a>
    </div>
  `;

  showToast(`✅ AI วิเคราะห์แล้ว: ${data.risk_level}`, 'success');
}
