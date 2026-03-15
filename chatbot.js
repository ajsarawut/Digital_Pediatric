/**
 * PediAI Platform — AI Chatbot JavaScript
 * ผู้ช่วย AI สำหรับพยาบาลกุมารเวช
 */

const PEDI_KNOWLEDGE = {
  dspm: {
    keywords: ['dspm', 'คู่มือ', 'เฝ้าระวัง', 'ส่งเสริมพัฒนาการ'],
    response: `
<strong>📋 DSPM คืออะไร?</strong><br><br>
<strong>DSPM (Developmental Surveillance and Promotion Manual)</strong> หรือ <em>คู่มือเฝ้าระวังและส่งเสริมพัฒนาการเด็กปฐมวัย</em> เป็นเครื่องมือที่พัฒนาโดยกรมอนามัย กระทรวงสาธารณสุข<br><br>
<strong>วัตถุประสงค์:</strong>
<ul>
<li>ติดตามพัฒนาการเด็กอายุ 0-5 ปี อย่างครอบคลุม</li>
<li>ตรวจจับพัฒนาการล่าช้าตั้งแต่เนิ่นๆ</li>
<li>ให้คำแนะนำส่งเสริมพัฒนาการแก่ผู้ปกครอง</li>
</ul>
<strong>5 ด้านหลักที่ประเมิน:</strong>
<ul>
<li>🏃 <strong>GM</strong> — Gross Motor (กล้ามเนื้อมัดใหญ่)</li>
<li>✋ <strong>FM</strong> — Fine Motor (กล้ามเนื้อมัดเล็ก)</li>
<li>👂 <strong>RL</strong> — Receptive Language (ภาษารับรู้)</li>
<li>💬 <strong>EL</strong> — Expressive Language (ภาษาแสดงออก)</li>
<li>👥 <strong>PS</strong> — Personal Social (สังคม/ช่วยเหลือตนเอง)</li>
</ul>`
  },
  
  referral: {
    keywords: ['ส่งต่อ', 'referral', 'เกณฑ์ส่งต่อ', 'กุมารแพทย์'],
    response: `
<strong>📋 เกณฑ์การส่งต่อผู้ป่วยเด็กที่มีพัฒนาการล่าช้า</strong><br><br>
<strong>🔴 ส่งต่อทันที (Immediate Referral):</strong>
<ul>
<li>พัฒนาการล่าช้า ≥ 2 ด้าน</li>
<li>ถดถอยของพัฒนาการที่เคยทำได้แล้ว</li>
<li>ไม่พูดคำที่มีความหมายเมื่ออายุ 16 เดือน</li>
<li>ไม่พูดประโยค 2 คำเมื่ออายุ 24 เดือน</li>
<li>สงสัย Autism Spectrum Disorder</li>
</ul>
<strong>🟡 ส่งต่อตามนัด (Scheduled Referral):</strong>
<ul>
<li>พัฒนาการล่าช้า 1 ด้าน + ปัจจัยเสี่ยง</li>
<li>ติดตาม 2-3 ครั้งแล้วยังไม่ดีขึ้น</li>
<li>ผู้ปกครองกังวลอย่างมีเหตุผล</li>
</ul>
<strong>สถานที่ส่งต่อ:</strong> คลินิกพัฒนาการเด็ก, นักกายภาพบำบัด, นักแก้ไขการพูด, จิตแพทย์เด็ก`
  },

  vaccine: {
    keywords: ['วัคซีน', 'vaccine', 'ฉีด', 'ภูมิคุ้มกัน'],
    response: `
<strong>💉 วัคซีนตามแผนการสร้างเสริมภูมิคุ้มกันโรค (EPI) สำหรับเด็ก</strong><br><br>
<table style="width:100%;font-size:13px;border-collapse:collapse">
<tr style="background:rgba(15,76,129,0.1)"><th style="padding:6px 8px;text-align:left">อายุ</th><th style="padding:6px 8px;text-align:left">วัคซีน</th></tr>
<tr><td style="padding:5px 8px;border-bottom:1px solid #eee">แรกเกิด</td><td style="padding:5px 8px;border-bottom:1px solid #eee">BCG, HBV ครั้งที่ 1</td></tr>
<tr><td style="padding:5px 8px;border-bottom:1px solid #eee">1 เดือน</td><td style="padding:5px 8px;border-bottom:1px solid #eee">HBV ครั้งที่ 2</td></tr>
<tr><td style="padding:5px 8px;border-bottom:1px solid #eee">2 เดือน</td><td style="padding:5px 8px;border-bottom:1px solid #eee">DTP-HB-Hib, IPV, Rota</td></tr>
<tr><td style="padding:5px 8px;border-bottom:1px solid #eee">4 เดือน</td><td style="padding:5px 8px;border-bottom:1px solid #eee">DTP-HB-Hib, IPV, Rota</td></tr>
<tr><td style="padding:5px 8px;border-bottom:1px solid #eee">6 เดือน</td><td style="padding:5px 8px;border-bottom:1px solid #eee">DTP-HB-Hib, OPV, Rota</td></tr>
<tr><td style="padding:5px 8px;border-bottom:1px solid #eee">9-12 เดือน</td><td style="padding:5px 8px;border-bottom:1px solid #eee">MMR ครั้งที่ 1, JE</td></tr>
<tr><td style="padding:5px 8px;border-bottom:1px solid #eee">18 เดือน</td><td style="padding:5px 8px;border-bottom:1px solid #eee">DTP-HB-Hib กระตุ้น, OPV</td></tr>
<tr><td style="padding:5px 8px">2.5 ปี</td><td style="padding:5px 8px">JE กระตุ้น</td></tr>
</table>`
  },

  nutrition: {
    keywords: ['โภชนาการ', 'อาหาร', 'นม', 'กินอาหาร', 'เลี้ยงลูก'],
    response: `
<strong>🥗 โภชนาการสำหรับเด็กปฐมวัย 1-3 ปี</strong><br><br>
<strong>ข้าว/แป้ง:</strong> 3-4 ทัพพีต่อวัน<br>
<strong>โปรตีน:</strong> ปลา ไข่ เนื้อสัตว์ ถั่ว 2-3 มื้อ<br>
<strong>ผัก:</strong> 1-2 ทัพพีต่อวัน<br>
<strong>ผลไม้:</strong> 1-2 ส่วนต่อวัน<br>
<strong>นม:</strong> 2-3 แก้วต่อวัน (นมวัวหลัง 1 ปี)<br><br>
<strong>⚠️ สิ่งที่ควรหลีกเลี่ยง:</strong>
<ul>
<li>น้ำหวาน น้ำอัดลม ลูกอม</li>
<li>อาหารรสเค็มจัด หวานจัด</li>
<li>อาหารแข็งที่อาจสำลัก (ถั่ว องุ่นทั้งเม็ด)</li>
</ul>
<strong>💡 เคล็ดลับ:</strong> ให้เด็กนั่งรับประทานอาหารพร้อมครอบครัว ฝึกใช้ช้อนด้วยตัวเอง`
  },

  autism: {
    keywords: ['ออทิสติก', 'autism', 'asd', 'สัญญาณเตือน', 'ไม่สบตา'],
    response: `
<strong>⚠️ สัญญาณเตือนออทิสติก (ASD) ที่ต้องระวัง</strong><br><br>
<strong>อายุ 12 เดือน:</strong>
<ul>
<li>ไม่ชี้นิ้ว ไม่โบกมือ</li>
<li>ไม่ตอบสนองต่อชื่อตัวเอง</li>
<li>ไม่แสดงอารมณ์ทางหน้าตา</li>
</ul>
<strong>อายุ 18-24 เดือน:</strong>
<ul>
<li>ไม่มีภาษาพูด หรือสูญเสียทักษะภาษาที่มีแล้ว</li>
<li>ไม่เล่น make-believe / symbolic play</li>
<li>สบตาน้อยมาก ไม่แบ่งปันความสนใจ</li>
<li>ยึดติดพฤติกรรมซ้ำๆ</li>
</ul>
<strong>🔴 ถ้าพบสัญญาณเหล่านี้:</strong> ส่งต่อจิตแพทย์เด็กหรือกุมารแพทย์พัฒนาการทันที ไม่ต้อง "รอดูก่อน"`
  },

  activities: {
    keywords: ['กิจกรรม', 'กระตุ้น', 'ส่งเสริม', 'เล่น', 'พัฒนา'],
    response: `
<strong>🎮 กิจกรรมส่งเสริมพัฒนาการตามวัย</strong><br><br>
<strong>🏃 GM (กล้ามเนื้อมัดใหญ่):</strong>
<ul>
<li>0-1 ปี: นอนคว่ำ Tummy Time, ช่วยนั่ง</li>
<li>1-2 ปี: เดิน ปีนป่าย โยนบอล</li>
<li>2-3 ปี: วิ่ง กระโดด ปั่นจักรยาน</li>
</ul>
<strong>✋ FM (กล้ามเนื้อมัดเล็ก):</strong>
<ul>
<li>ปั้นดิน ฉีกกระดาษ วาดรูป ร้อยลูกปัด</li>
</ul>
<strong>💬 ภาษา (RL/EL):</strong>
<ul>
<li>อ่านนิทานทุกวัน พูดคุยระหว่างทำกิจกรรม</li>
<li>ร้องเพลง เล่าเรื่อง ถามคำถาม</li>
</ul>
<strong>👥 สังคม (PS):</strong>
<ul>
<li>เล่นกับเพื่อน เล่นบทบาทสมมุติ ฝึกช่วยเหลือตัวเอง</li>
</ul>`
  }
};

let conversationHistory = [];

document.addEventListener('DOMContentLoaded', () => {
  // Chat input enter key
});

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input?.value?.trim();
  if (!text) return;
  
  appendUserMessage(text);
  input.value = '';
  
  document.getElementById('quickPrompts')?.style && (document.getElementById('quickPrompts').style.display = 'none');
  
  showTyping();
  setTimeout(() => {
    hideTyping();
    const response = generateResponse(text);
    appendBotMessage(response);
  }, 800 + Math.random() * 600);
}

function sendQuick(text) {
  document.getElementById('chatInput').value = text;
  sendMessage();
}

function appendUserMessage(text) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  const time = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  const el = document.createElement('div');
  el.className = 'message user-message';
  el.innerHTML = `
    <div class="msg-avatar"><i class="fas fa-user-nurse"></i></div>
    <div>
      <div class="msg-bubble">${escapeHtml(text)}</div>
      <div class="msg-time" style="text-align:right">${time}</div>
    </div>`;
  container.appendChild(el);
  scrollToBottom();
}

function appendBotMessage(html) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  const time = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  const el = document.createElement('div');
  el.className = 'message bot-message';
  el.innerHTML = `
    <div class="msg-avatar"><i class="fas fa-robot"></i></div>
    <div>
      <div class="msg-bubble">${html}</div>
      <div class="msg-time">${time}</div>
    </div>`;
  container.appendChild(el);
  scrollToBottom();
}

function showTyping() {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'message bot-message typing-indicator';
  el.id = 'typingEl';
  el.innerHTML = `
    <div class="msg-avatar"><i class="fas fa-robot"></i></div>
    <div class="msg-bubble" style="padding:12px 18px">
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    </div>`;
  container.appendChild(el);
  scrollToBottom();
}

function hideTyping() {
  document.getElementById('typingEl')?.remove();
}

function scrollToBottom() {
  const c = document.getElementById('chatMessages');
  if (c) c.scrollTop = c.scrollHeight;
}

function clearChat() {
  const c = document.getElementById('chatMessages');
  if (c) c.innerHTML = '';
  document.getElementById('quickPrompts')?.style && (document.getElementById('quickPrompts').style.display = 'flex');
  showToast('ล้างแชทเรียบร้อย', 'info');
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function generateResponse(text) {
  const lower = text.toLowerCase();
  
  // Check knowledge base
  for (const [key, entry] of Object.entries(PEDI_KNOWLEDGE)) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return entry.response;
    }
  }

  // DSPM Analysis request
  if (lower.includes('วิเคราะห์') && (lower.includes('gm') || lower.includes('fm') || lower.includes('dspm') || lower.includes('ล่าช้า'))) {
    return analyzeDSPMFromText(text);
  }

  // Greetings
  if (lower.includes('สวัสดี') || lower.includes('hello') || lower.includes('hi')) {
    return '👋 สวัสดีครับ! ผมพร้อมช่วยท่านด้านพัฒนาการเด็กและ DSPM ครับ กรุณาถามคำถามหรือเลือกหัวข้อที่สนใจ';
  }

  // Default intelligent response
  return generateIntelligentResponse(text);
}

function analyzeDSPMFromText(text) {
  const lower = text.toLowerCase();
  const gm = lower.includes('gm ล่าช้า') || lower.includes('gm: ล่าช้า') ? 'ล่าช้า' : lower.includes('gm ติดตาม') ? 'ติดตาม' : 'ปกติ';
  const fm = lower.includes('fm ล่าช้า') || lower.includes('fm: ล่าช้า') ? 'ล่าช้า' : lower.includes('fm ติดตาม') ? 'ติดตาม' : 'ปกติ';
  const rl = lower.includes('rl ล่าช้า') || lower.includes('rl: ล่าช้า') ? 'ล่าช้า' : lower.includes('rl ติดตาม') ? 'ติดตาม' : 'ปกติ';
  const el = lower.includes('el ล่าช้า') || lower.includes('el: ล่าช้า') ? 'ล่าช้า' : lower.includes('el ติดตาม') ? 'ติดตาม' : 'ปกติ';
  const ps = lower.includes('ps ล่าช้า') || lower.includes('ps: ล่าช้า') ? 'ล่าช้า' : lower.includes('ps ติดตาม') ? 'ติดตาม' : 'ปกติ';

  const result = analyzeDSPMLocal(gm, fm, rl, el, ps);
  const d = result.data;

  return `
<strong>🧠 ผลการวิเคราะห์ DSPM โดย AI</strong><br><br>
<strong>ผลรายด้าน:</strong> GM: ${gm} | FM: ${fm} | RL: ${rl} | EL: ${el} | PS: ${ps}<br><br>
<div style="padding:10px 14px;background:${d.risk_class==='normal'?'rgba(6,214,160,0.1)':d.risk_class==='high'?'rgba(239,35,60,0.1)':'rgba(255,214,10,0.1)'};border-radius:8px;margin:8px 0">
${d.risk_icon} <strong>${d.risk_level}</strong><br>
<small>พบล่าช้า ${d.delay_count} ด้าน | ติดตาม ${d.monitor_count} ด้าน</small>
</div>
<strong>คำแนะนำ:</strong>
<ul>${d.recommendations.map(r => `<li>${r}</li>`).join('')}</ul>`;
}

function generateIntelligentResponse(text) {
  const responses = [
    `ขอบคุณสำหรับคำถามครับ เรื่อง "<em>${text.slice(0,40)}...</em>"<br><br>
สำหรับข้อมูลพัฒนาการเด็กเพิ่มเติม ท่านสามารถ:<br>
<ul>
<li>ใช้ฟังก์ชัน "วิเคราะห์ DSPM ด่วน" ด้านขวา</li>
<li>เลือกหัวข้อจากเมนูด่วนด้านล่าง</li>
<li>ไปที่หน้า <a href="assessment.html" style="color:var(--secondary)">ประเมินพัฒนาการ DSPM</a></li>
</ul>
หรือลองถามคำถามที่เฉพาะเจาะจงมากขึ้นครับ เช่น "กิจกรรม GM สำหรับเด็ก 2 ปี" หรือ "เกณฑ์ส่งต่อพัฒนาการล่าช้า"`,
  ];
  return responses[0];
}

// Quick DSPM Analysis from sidebar
function quickDSPMAnalysis() {
  const gm = document.getElementById('q_gm')?.value || 'ปกติ';
  const fm = document.getElementById('q_fm')?.value || 'ปกติ';
  const rl = document.getElementById('q_rl')?.value || 'ปกติ';
  const el = document.getElementById('q_el')?.value || 'ปกติ';
  const ps = document.getElementById('q_ps')?.value || 'ปกติ';
  const age = document.getElementById('q_age')?.value || '24';

  const text = `วิเคราะห์ผล DSPM: GM ${gm}, FM ${fm}, RL ${rl}, EL ${el}, PS ${ps} (อายุ ${age} เดือน)`;
  sendQuick(text);
}
