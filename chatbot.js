// ================================================================
// chatbot.js — AI Chatbot UI Logic
// ================================================================

var chatHistory = [];

async function sendMessage() {
  var input   = document.getElementById('chatInput');
  var message = input.value.trim();
  if (!message) return;

  appendMessage(message, 'user');
  input.value = '';

  showTyping();

  var childId  = document.getElementById('chatChildId').value.trim();
  var response = await getChatbotResponse(message, childId);

  hideTyping();
  appendMessage(response.text, 'bot', response.actions);
  chatHistory.push({ user: message, bot: response.text });
}

function sendQuickMessage(msg) {
  document.getElementById('chatInput').value = msg;
  sendMessage();
}

async function getChatbotResponse(message, childId) {
  // Local rule-based engine (mirrors backend chatbot.gs)
  var lc = message.toLowerCase();
  if (lc.includes('gm') || lc.includes('กล้ามเนื้อมัดใหญ่') || lc.includes('gross motor')) return gmResponse();
  if (lc.includes('fm') || lc.includes('กล้ามเนื้อมัดเล็ก') || lc.includes('fine motor'))  return fmResponse();
  if (lc.includes('rl') || lc.includes('el') || lc.includes('ภาษา') || lc.includes('พูด')) return languageResponse();
  if (lc.includes('ps') || lc.includes('สังคม') || lc.includes('อารมณ์'))                  return psResponse();
  if (lc.includes('ออทิสติก') || lc.includes('autism') || lc.includes('asd'))              return autismResponse();
  if (lc.includes('โภชนาการ') || lc.includes('อาหาร'))                                     return nutritionResponse();
  if (lc.includes('ส่งต่อ') || lc.includes('referral'))                                     return referralResponse();
  if (lc.includes('กระตุ้น') || lc.includes('กิจกรรม'))                                    return stimulationResponse();
  if (lc.includes('dspm') || lc.includes('คู่มือ'))                                         return dspmResponse();
  if (lc.includes('ช่วย') || lc.includes('help'))                                           return helpResponse();
  return defaultResponse(message);
}

function appendMessage(text, role, actions) {
  var container = document.getElementById('chatMessages');
  var div = document.createElement('div');
  div.className = 'chat-msg ' + (role === 'bot' ? 'bot-msg' : 'user-msg');

  var time = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

  var icon = role === 'bot' ? 'robot' : 'person-fill';
  var actionsHTML = '';
  if (actions && actions.length) {
    actionsHTML = '<div class="mt-2 d-flex flex-wrap gap-1">' +
      actions.map(function(a) {
        return '<button class="btn btn-sm btn-outline-primary" onclick="sendQuickMessage(\'' + a + '\')">' + a + '</button>';
      }).join('') + '</div>';
  }

  div.innerHTML =
    '<div class="msg-avatar"><i class="bi bi-' + icon + '"></i></div>' +
    '<div class="msg-bubble">' +
    '<div class="msg-text">' + escapeHtml(text).replace(/\n/g,'<br>') + actionsHTML + '</div>' +
    '<div class="msg-time">' + time + '</div>' +
    '</div>';

  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function showTyping() {
  var container = document.getElementById('chatMessages');
  var div = document.createElement('div');
  div.className = 'chat-msg bot-msg';
  div.id = 'typingIndicator';
  div.innerHTML =
    '<div class="msg-avatar"><i class="bi bi-robot"></i></div>' +
    '<div class="msg-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>';
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function hideTyping() {
  var el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ----------------------------------------------------------------
// Response templates (mirrors chatbot.gs)
// ----------------------------------------------------------------
function gmResponse() {
  return { text: '🏃 กล้ามเนื้อมัดใหญ่ (Gross Motor — GM)\n\nพัฒนาการด้านการเคลื่อนไหวร่างกายส่วนใหญ่\n\n📌 Milestone สำคัญ:\n• 2-3 เดือน: ชันคอได้\n• 6 เดือน: นั่งได้เมื่อประคอง\n• 12 เดือน: เดินได้โดยจูงมือ\n• 18 เดือน: เดินได้คนเดียว\n• 24 เดือน: วิ่งได้\n• 36 เดือน: กระโดดได้\n\n🎮 กิจกรรมกระตุ้น: Tummy time, เล่นลูกบอล, ปีนป่าย', actions:['ดู Milestone เพิ่มเติม','กิจกรรมกระตุ้น GM'] };
}
function fmResponse() {
  return { text: '✋ กล้ามเนื้อมัดเล็ก (Fine Motor — FM)\n\n📌 Milestone:\n• 3-4 เดือน: จับของได้\n• 6 เดือน: ถ่ายของจากมือหนึ่งไปอีกมือ\n• 12 เดือน: หยิบของเล็กด้วยนิ้วหัวแม่มือและนิ้วชี้\n• 18 เดือน: วาดเส้นได้\n• 24 เดือน: ต่อบล็อก 6 ก้อน\n• 36 เดือน: ตัดกระดาษได้\n\n🎮 กิจกรรมกระตุ้น: ปั้นดินน้ำมัน, วาดรูป, ร้อยลูกปัด', actions:['กิจกรรมกระตุ้น FM'] };
}
function languageResponse() {
  return { text: '💬 พัฒนาการด้านภาษา\n\n🔵 RL (Receptive) — การรับรู้ภาษา: เข้าใจ ฟัง ทำตามคำสั่ง\n🟢 EL (Expressive) — การแสดงออก: พูด บอกความต้องการ\n\n📌 Milestone:\n• 6 เดือน: ส่งเสียงโต้ตอบ\n• 12 เดือน: พูด 1-2 คำได้\n• 18 เดือน: พูดได้ 10-20 คำ\n• 24 เดือน: พูดประโยค 2 คำ\n• 36 เดือน: พูดประโยค 3-4 คำ\n\n⚠️ Red Flags: ไม่พูดเลยเมื่ออายุ 16 เดือน', actions:['Red Flags ภาษา','ส่งต่อ Speech Therapy'] };
}
function psResponse() {
  return { text: '🤝 พัฒนาการสังคม-อารมณ์ (Personal Social — PS)\n\n📌 Milestone:\n• 2 เดือน: ยิ้มตอบสนอง\n• 12 เดือน: โบกมือ บ๊ายบาย\n• 18 เดือน: ใช้ช้อนได้\n• 24 เดือน: เล่นขนานกับเด็กคนอื่น\n• 36 เดือน: เล่นร่วมกับเพื่อนได้\n\n⚠️ Red Flags: ไม่สบตา ไม่ยิ้มตอบ ไม่สนใจสังคม', actions:['ดู Red Flags','กิจกรรมกระตุ้น PS'] };
}
function autismResponse() {
  return { text: '🔍 Autism Spectrum Disorder (ASD)\n\n📋 เครื่องมือคัดกรอง:\n• M-CHAT — อายุ 16-30 เดือน\n• CARS (Childhood Autism Rating Scale)\n\n⚠️ Red Flags ที่ต้องส่งปรึกษา:\n• ไม่ส่งเสียงหรือชี้นิ้วเมื่อ 12 เดือน\n• ไม่พูดคำเดี่ยวเมื่อ 16 เดือน\n• สูญเสียทักษะที่เคยมี\n• ไม่สบตา ไม่ตอบสนองชื่อ\n\n🏥 ส่งต่อ: กุมารแพทย์พัฒนาการ หรือจิตแพทย์เด็ก', actions:['เกณฑ์ส่งต่อ ASD','ทำ M-CHAT'] };
}
function nutritionResponse() {
  return { text: '🥗 โภชนาการเพื่อส่งเสริมพัฒนาการ\n\n👶 0-6 เดือน: นมแม่อย่างเดียว\n🍼 6-12 เดือน: อาหารเสริม + นมแม่\n🍽️ 1-3 ปี: อาหาร 5 หมู่ครบถ้วน\n\n⚠️ เฝ้าระวัง:\n• ขาดธาตุเหล็ก\n• ขาดสังกะสี\n• ภาวะทุพโภชนาการ (stunting)', actions:[] };
}
function referralResponse() {
  return { text: '🏥 เกณฑ์การส่งต่อ\n\n🔴 ส่งต่อด่วน:\n• High Risk (2+ domain ล่าช้า)\n• สูญเสียทักษะที่เคยทำได้\n\n🟡 ส่งต่อภายใน 1 เดือน:\n• Moderate Risk (1 domain ล่าช้า)\n\n🏥 ส่งต่อไปยัง:\n1. กุมารแพทย์พัฒนาการ\n2. นักกิจกรรมบำบัด (OT)\n3. นักแก้ไขการพูด (ST)\n4. นักกายภาพบำบัด (PT)', actions:['พิมพ์ใบส่งต่อ'] };
}
function stimulationResponse() {
  return { text: '🎯 หลักการกระตุ้นพัฒนาการ\n\n✅ 5 หลักการ:\n1. ทำทุกวัน\n2. ด้วยความรักและอบอุ่น\n3. เหมาะกับวัย\n4. หลากหลาย ทุก domain\n5. ติดตามผลต่อเนื่อง\n\n🌟 กิจกรรมแนะนำ:\n• อ่านหนังสือทุกวัน\n• เล่นนอกบ้าน\n• ร้องเพลงและดนตรี\n• ลด Screen Time', actions:['กิจกรรมตามช่วงอายุ'] };
}
function dspmResponse() {
  return { text: '📚 DSPM (คู่มือเฝ้าระวังและส่งเสริมพัฒนาการเด็กปฐมวัย)\n\nจัดทำโดยกรมอนามัย กระทรวงสาธารณสุข\n\n📋 5 ด้านพัฒนาการ:\n1. GM — กล้ามเนื้อมัดใหญ่\n2. FM — กล้ามเนื้อมัดเล็ก\n3. RL — ภาษาที่รับรู้\n4. EL — ภาษาที่แสดงออก\n5. PS — สังคม-อารมณ์\n\n🎯 ช่วงอายุประเมิน: ทุก Well Child Visit', actions:['เริ่มประเมิน DSPM'] };
}
function helpResponse() {
  return { text: '👋 ผมช่วยคุณได้เรื่องเหล่านี้:\n\n🔹 "กล้ามเนื้อมัดใหญ่" — ข้อมูล GM\n🔹 "กล้ามเนื้อมัดเล็ก" — ข้อมูล FM\n🔹 "พัฒนาการภาษา" — RL/EL\n🔹 "พัฒนาการสังคม" — PS\n🔹 "ออทิสติก" — การคัดกรอง ASD\n🔹 "โภชนาการ" — คำแนะนำอาหาร\n🔹 "ส่งต่อ" — เกณฑ์การส่งต่อ\n🔹 "กระตุ้นพัฒนาการ" — กิจกรรม\n🔹 "DSPM" — ความรู้คู่มือ', actions:['GM domain','FM domain','ภาษา','ส่งต่อ'] };
}
function defaultResponse(msg) {
  return { text: 'ขอบคุณสำหรับคำถามครับ 🙏\n\nสำหรับ "' + msg + '" ผมแนะนำให้ลองถามเกี่ยวกับ:\n• พัฒนาการ 5 ด้าน (GM, FM, RL, EL, PS)\n• Milestone เด็กแต่ละวัย\n• กิจกรรมกระตุ้นพัฒนาการ\n• เกณฑ์การส่งต่อ\n\nพิมพ์ "ช่วย" เพื่อดูรายการทั้งหมดครับ', actions:['ดูรายการคำถาม'] };
}
