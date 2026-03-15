/**
 * PediAI Platform — Assessment JavaScript
 * DSPM Assessment Engine + Step Wizard
 */

let currentStep = 1;
let childData = {};

document.addEventListener('DOMContentLoaded', () => {
  const dobInput = document.getElementById('childDOB');
  if (dobInput) {
    dobInput.addEventListener('change', () => {
      const age = calculateAge(dobInput.value);
      document.getElementById('childAge').value = age;
      const monthMatch = age.match(/\((\d+) เดือน\)/);
      if (monthMatch) {
        const months = parseInt(monthMatch[1]);
        document.getElementById('dspmagebadge').textContent = `อายุ: ${months} เดือน | ชุดคำถาม DSPM สำหรับเด็ก ${getDSPMSet(months)}`;
      }
    });
  }
});

function getDSPMSet(months) {
  if (months <= 2) return 'แรกเกิด-2 เดือน';
  if (months <= 4) return '2-4 เดือน';
  if (months <= 6) return '4-6 เดือน';
  if (months <= 9) return '6-9 เดือน';
  if (months <= 12) return '9-12 เดือน';
  if (months <= 18) return '12-18 เดือน';
  if (months <= 24) return '18-24 เดือน';
  if (months <= 30) return '24-30 เดือน';
  if (months <= 36) return '30-36 เดือน';
  if (months <= 42) return '36-42 เดือน';
  if (months <= 48) return '42-48 เดือน';
  if (months <= 54) return '48-54 เดือน';
  if (months <= 60) return '54-60 เดือน';
  return '60+ เดือน';
}

function goToStep1() {
  showStep(1);
}

function goToStep2() {
  const name = document.getElementById('childName')?.value?.trim();
  const dob = document.getElementById('childDOB')?.value;
  const gender = document.getElementById('childGender')?.value;
  const hospital = document.getElementById('hospitalSelect')?.value;

  if (!name || !dob || !gender || !hospital) {
    showToast('⚠️ กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน', 'warning');
    return;
  }

  childData = {
    id: generateChildId(),
    name, dob, gender, hospital,
    birthWeight: document.getElementById('birthWeight')?.value,
    gestAge: document.getElementById('gestAge')?.value,
    parentName: document.getElementById('parentName')?.value,
    parentPhone: document.getElementById('parentPhone')?.value,
    assessorName: document.getElementById('assessorName')?.value,
    assessDate: new Date().toISOString().split('T')[0]
  };

  const ageEl = document.getElementById('childAge');
  if (ageEl) {
    childData.ageText = ageEl.value;
    const monthMatch = ageEl.value.match(/\((\d+) เดือน\)/);
    if (monthMatch) childData.ageMonths = parseInt(monthMatch[1]);
  }

  showStep(2);
  showToast(`✅ บันทึกข้อมูล ${name} แล้ว`, 'success');
}

async function analyzeAndShowResult() {
  const gm = document.querySelector('input[name="gm_result"]:checked')?.value;
  const fm = document.querySelector('input[name="fm_result"]:checked')?.value;
  const rl = document.querySelector('input[name="rl_result"]:checked')?.value;
  const el = document.querySelector('input[name="el_result"]:checked')?.value;
  const ps = document.querySelector('input[name="ps_result"]:checked')?.value;

  if (!gm || !fm || !rl || !el || !ps) {
    showToast('⚠️ กรุณาเลือกผลการประเมินทุกด้านให้ครบ', 'warning');
    return;
  }

  // DSPM Analysis
  const dspmResult = analyzeDSPMLocal(gm, fm, rl, el, ps);
  
  // AI Risk
  const aiResult = computeAIRiskLocal({
    gm, fm, rl, el, ps,
    age: childData.ageMonths || 24,
    birthWeight: childData.birthWeight,
    gestAge: childData.gestAge,
    prevHistory: '0',
    familyHistory: '0'
  });

  const note = document.getElementById('assessmentNote')?.value || '';
  
  showStep(3);
  renderResultPanel(dspmResult.data, aiResult.data, childData, gm, fm, rl, el, ps, note);
  showToast('✅ วิเคราะห์ผลสำเร็จ!', 'success');
}

function renderResultPanel(dspm, ai, child, gm, fm, rl, el, ps, note) {
  const panel = document.getElementById('resultContent');
  if (!panel) return;

  const domainIcons = { gm: 'fas fa-running', fm: 'fas fa-hand-paper', rl: 'fas fa-ear-listen', el: 'fas fa-comment-dots', ps: 'fas fa-users' };
  const domainLabels = { gm: 'GM กล้ามเนื้อมัดใหญ่', fm: 'FM กล้ามเนื้อมัดเล็ก', rl: 'RL ภาษารับรู้', el: 'EL ภาษาแสดงออก', ps: 'PS สังคม' };
  const domains = { gm, fm, rl, el, ps };

  const resultColor = dspm.risk_class === 'normal' ? 'var(--accent)' : dspm.risk_class === 'high' ? 'var(--danger)' : 'var(--warning)';

  panel.innerHTML = `
    <!-- Child Info -->
    <div class="row g-3 mb-4">
      <div class="col-12">
        <div style="background:#f8fafc;border-radius:10px;padding:14px 16px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
          <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,var(--primary),var(--secondary));display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px">
            <i class="fas fa-child"></i>
          </div>
          <div style="flex:1">
            <div style="font-size:18px;font-weight:800;color:var(--primary)">${child.name}</div>
            <div style="font-size:13px;color:var(--text-muted)">${child.id} · ${child.ageText} · ${child.gender} · ${child.hospital}</div>
          </div>
          <div style="font-size:12px;color:var(--text-muted)">วันที่ประเมิน: ${child.assessDate}</div>
        </div>
      </div>
    </div>

    <div class="row g-3 mb-4">
      <!-- DSPM Result -->
      <div class="col-md-6">
        <div class="dspm-outcome-card ${dspm.risk_class}">
          <div class="dspm-icon" style="font-size:36px">${dspm.risk_icon}</div>
          <div>
            <div class="dspm-label">ผลการประเมิน DSPM</div>
            <div class="dspm-desc" style="font-size:15px;font-weight:700;color:${resultColor}">${dspm.risk_level}</div>
            <div class="dspm-desc">ล่าช้า ${dspm.delay_count} ด้าน · ติดตาม ${dspm.monitor_count} ด้าน</div>
          </div>
        </div>
      </div>

      <!-- AI Risk Result -->
      <div class="col-md-6">
        <div class="dspm-outcome-card ${ai.risk_class}">
          <div class="dspm-icon"><i class="fas fa-brain" style="font-size:30px;color:${ai.risk_class==='high'?'var(--danger)':ai.risk_class==='moderate'?'var(--warning)':'var(--accent)'}"></i></div>
          <div>
            <div class="dspm-label">AI Risk Score</div>
            <div style="font-size:28px;font-weight:800;color:${ai.risk_class==='high'?'var(--danger)':ai.risk_class==='moderate'?'#b89400':'var(--accent)'}">${ai.risk_score}<small style="font-size:14px">/100</small></div>
            <div class="dspm-desc">${ai.risk_level}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Domain Results Grid -->
    <div class="row g-2 mb-4">
      <div class="col-12"><h6 style="font-weight:700;color:var(--primary)"><i class="fas fa-tasks me-2"></i>ผลรายด้าน DSPM</h6></div>
      ${Object.entries(domains).map(([k, v]) => {
        const color = v === 'ปกติ' ? 'var(--accent)' : v === 'ล่าช้า' ? 'var(--danger)' : 'var(--warning)';
        const bg = v === 'ปกติ' ? 'rgba(6,214,160,0.08)' : v === 'ล่าช้า' ? 'rgba(239,35,60,0.08)' : 'rgba(255,214,10,0.1)';
        const icon = v === 'ปกติ' ? 'check-circle' : v === 'ล่าช้า' ? 'times-circle' : 'eye';
        return `<div class="col-6 col-md-4 col-lg-2-4">
          <div style="background:${bg};border-radius:10px;padding:12px;text-align:center;border:1.5px solid ${color}30">
            <i class="${domainIcons[k]}" style="font-size:20px;color:${color};margin-bottom:6px"></i>
            <div style="font-size:12px;font-weight:700;color:var(--text-main)">${domainLabels[k].split(' ')[0]}</div>
            <div style="font-size:11px;color:var(--text-muted)">${domainLabels[k].slice(3)}</div>
            <div style="margin-top:6px"><i class="fas fa-${icon}" style="color:${color};font-size:16px"></i> <strong style="color:${color};font-size:13px">${v}</strong></div>
          </div>
        </div>`;
      }).join('')}
    </div>

    <!-- Recommendations -->
    <div class="row g-3 mb-4">
      <div class="col-md-6">
        <div style="background:#f8fafc;border-radius:10px;padding:16px">
          <h6 style="font-weight:700;color:var(--primary);margin-bottom:12px"><i class="fas fa-clipboard-list me-2"></i>คำแนะนำทางคลินิก</h6>
          <ul style="margin:0;padding-left:18px">
            ${dspm.recommendations.map(r => `<li style="margin-bottom:6px;font-size:14px">${r}</li>`).join('')}
          </ul>
        </div>
      </div>
      <div class="col-md-6">
        <div style="background:#f0f9ff;border-radius:10px;padding:16px;border-left:4px solid var(--secondary)">
          <h6 style="font-weight:700;color:var(--secondary);margin-bottom:12px"><i class="fas fa-lightbulb me-2"></i>AI แนะนำกิจกรรมส่งเสริม</h6>
          ${generateStimulationActivities(gm, fm, rl, el, ps)}
        </div>
      </div>
    </div>

    ${note ? `<div class="mb-4"><div style="background:#fffdf0;border-radius:10px;padding:14px;border:1px solid var(--warning)40"><strong><i class="fas fa-sticky-note me-2"></i>หมายเหตุ:</strong> ${note}</div></div>` : ''}

    <!-- Action Buttons -->
    <div class="d-flex gap-3 flex-wrap justify-content-end">
      <button class="btn btn-outline-secondary" onclick="printResult()"><i class="fas fa-print me-2"></i>พิมพ์รายงาน</button>
      <button class="btn btn-outline-primary" onclick="goToStep1()"><i class="fas fa-plus me-2"></i>ประเมินรายใหม่</button>
      <a href="chatbot.html" class="btn btn-success"><i class="fas fa-robot me-2"></i>ถามผู้ช่วย AI เพิ่มเติม</a>
      <button class="btn btn-primary" onclick="saveAssessment()"><i class="fas fa-save me-2"></i>บันทึกผล</button>
    </div>
  `;
}

function generateStimulationActivities(gm, fm, rl, el, ps) {
  const activities = {
    gm_delay: ['เล่นลูกบอล โยนรับ ตีลูกบอล', 'ปีนป่ายสนามเด็กเล่น', 'เดินบนเส้นตรง ฝึกทรงตัว', 'เต้นรำตามเพลง'],
    fm_delay: ['ปั้นดินน้ำมัน ขยำกระดาษ', 'ระบายสี วาดรูป', 'ต่อเลโก้ บล็อคขนาดเล็ก', 'ใช้กรรไกรตัดกระดาษ'],
    rl_delay: ['อ่านนิทานทุกวัน ชี้ภาพ', 'เล่นเกมฟังคำสั่ง Simon Says', 'ร้องเพลงเด็กพร้อมท่าทาง', 'ถามตอบง่ายๆ ทุกวัน'],
    el_delay: ['พูดคุยกับเด็กบ่อยๆ ทุกกิจกรรม', 'ให้เด็กบอกความต้องการด้วยคำพูด', 'อ่านนิทานและให้เด็กเล่าต่อ', 'ลดการใช้หน้าจอ เพิ่มการพูดคุย'],
    ps_delay: ['เล่นกับเพื่อนวัยเดียวกัน', 'ฝึกแต่งตัวช่วยเหลือตัวเอง', 'มอบหมายงานเล็กๆ น้อยๆ ให้ทำ', 'เล่นบทบาทสมมุติ'],
    normal: ['อ่านนิทานก่อนนอน', 'เล่นกับเด็กวัยเดียวกัน', 'กิจกรรมเสรีกลางแจ้ง']
  };

  const items = [];
  if (gm === 'ล่าช้า' || gm === 'ติดตาม') items.push(...activities.gm_delay.slice(0,2).map(a => `🏃 ${a}`));
  if (fm === 'ล่าช้า' || fm === 'ติดตาม') items.push(...activities.fm_delay.slice(0,2).map(a => `✋ ${a}`));
  if (rl === 'ล่าช้า' || rl === 'ติดตาม') items.push(...activities.rl_delay.slice(0,2).map(a => `👂 ${a}`));
  if (el === 'ล่าช้า' || el === 'ติดตาม') items.push(...activities.el_delay.slice(0,2).map(a => `💬 ${a}`));
  if (ps === 'ล่าช้า' || ps === 'ติดตาม') items.push(...activities.ps_delay.slice(0,2).map(a => `👥 ${a}`));
  
  if (items.length === 0) items.push(...activities.normal.map(a => `⭐ ${a}`));

  return `<ul style="margin:0;padding-left:18px">${items.slice(0,5).map(a => `<li style="margin-bottom:5px;font-size:13px">${a}</li>`).join('')}</ul>`;
}

function showStep(step) {
  currentStep = step;
  document.querySelectorAll('[id^="stepPanel"]').forEach(el => el.classList.add('d-none'));
  document.querySelectorAll('[id^="step-ind-"]').forEach(el => el.classList.remove('active','done'));
  
  document.getElementById(`stepPanel${step}`)?.classList.remove('d-none');
  
  for (let i = 1; i < step; i++) document.getElementById(`step-ind-${i}`)?.classList.add('done');
  document.getElementById(`step-ind-${step}`)?.classList.add('active');
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
  if (confirm('ต้องการรีเซ็ตฟอร์มทั้งหมดหรือไม่?')) {
    document.querySelectorAll('input, select, textarea').forEach(el => {
      if (el.type === 'radio' || el.type === 'checkbox') el.checked = false;
      else el.value = '';
    });
    childData = {};
    showStep(1);
    showToast('รีเซ็ตฟอร์มเรียบร้อย', 'info');
  }
}

function saveAssessment() {
  showToast('✅ บันทึกข้อมูลสำเร็จ (ต้องเชื่อม Backend จริงเพื่อบันทึกถาวร)', 'success');
  setTimeout(() => { location.href = 'index.html'; }, 2000);
}

function printResult() {
  window.print();
}
