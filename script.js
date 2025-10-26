
// Data parts mapping to audio file names (use the files you uploaded in sounds/)
const PARTS = {
  cpu: {
    title: 'CPU (Bộ xử lý trung tâm)',
    text: 'CPU là trung tâm xử lý lệnh của máy tính. Nó thực hiện phép toán, xử lý lệnh từ chương trình và điều phối hoạt động giữa các thiết bị. Tốc độ xử lý ảnh hưởng trực tiếp tới hiệu năng chạy chương trình.',
    audio: 'sounds/cpu.mp3'
  },
  ram: {
    title: 'RAM (Bộ nhớ truy cập ngẫu nhiên)',
    text: 'RAM lưu trữ dữ liệu tạm thời khi chương trình chạy. RAM rất nhanh nhưng khi tắt nguồn dữ liệu trong RAM sẽ bị mất. RAM giúp CPU truy cập dữ liệu và chương trình nhanh hơn.',
    audio: 'sounds/ram.mp3'
  },
  mainboard: {
    title: 'Mainboard (Bo mạch chủ)',
    text: 'Mainboard là bản mạch chính kết nối tất cả các bộ phận: CPU, RAM, ổ cứng, card đồ họa và các thiết bị ngoại vi. Mainboard cung cấp khe cắm, giao tiếp và các chuẩn kết nối.',
    audio: 'sounds/mainboard.mp3'
  },
  hdd: {
    title: 'Ổ cứng HDD / SSD',
    text: 'Ổ cứng (HDD hoặc SSD) lưu trữ dữ liệu lâu dài: hệ điều hành, chương trình và tập tin của người dùng. SSD nhanh hơn HDD nhiều lần nhờ bộ nhớ flash.',
    audio: 'sounds/hdd.mp3'
  },
  psu: {
    title: 'PSU (Nguồn máy tính)',
    text: 'PSU cung cấp điện cho toàn bộ hệ thống, chuyển đổi điện lưới sang các mức điện áp ổn định cho mainboard, ổ cứng và các linh kiện khác. Nguồn kém có thể gây lỗi và giảm tuổi thọ phần cứng.',
    audio: 'sounds/psu.mp3'
  },
  monitor: {
    title: 'Màn hình (Monitor)',
    text: 'Màn hình hiển thị hình ảnh do card đồ họa xuất ra. Độ phân giải và tần số quét ảnh ảnh hưởng tới chất lượng và mượt của hình ảnh hiển thị.',
    audio: 'sounds/monitor.mp3'
  },
  keyboard: {
    title: 'Bàn phím',
    text: 'Bàn phím là thiết bị nhập liệu chính, cho phép người dùng nhập văn bản và điều khiển máy tính bằng phím chức năng.',
    audio: 'sounds/keyboard.mp3'
  },
  mouse: {
    title: 'Chuột',
    text: 'Chuột giúp điều khiển con trỏ trên màn hình, chọn đối tượng và thao tác trên giao diện đồ họa.',
    audio: 'sounds/mouse.mp3'
  },
  case: {
    title: 'Vỏ máy (Case)',
    text: 'Vỏ máy bảo vệ các linh kiện bên trong, cung cấp khe gắn, không gian cho tản nhiệt và các vị trí gắn ổ cứng, nguồn.',
    audio: 'sounds/case.mp3'
  }
};

// SpeechSynthesis
const synth = window.speechSynthesis || null;
let viVoice = null;
function findVietnameseVoice(){
  if(!synth) return null;
  const voices = synth.getVoices();
  viVoice = voices.find(v => v.lang && v.lang.startsWith('vi')) || voices.find(v=>v.name && v.name.toLowerCase().includes('vietnam'));
  return viVoice;
}
if(synth){ findVietnameseVoice(); speechSynthesis.onvoiceschanged = ()=> findVietnameseVoice(); }

function playAudioOrTTS(partKey){
  const part = PARTS[partKey];
  if(!part) return;
  const infoEl = document.getElementById('info');
  infoEl.innerHTML = '<strong>'+part.title+'</strong><p style="margin:6px 0 0">'+part.text+'</p>';
  // Try to play audio file first (if exists)
  const audio = new Audio(part.audio);
  audio.play().catch(err=>{
    // fallback to TTS
    if(synth){
      const u = new SpeechSynthesisUtterance(part.title + '. ' + part.text);
      if(viVoice) u.voice = viVoice;
      u.lang = (viVoice && viVoice.lang)? viVoice.lang : 'vi-VN';
      synth.cancel();
      synth.speak(u);
    } else {
      console.log('No audio and no TTS support');
    }
  });
}

// Attach hotspots
document.querySelectorAll('.hotspot').forEach(h=>{
  h.addEventListener('click', ()=>{
    const key = h.dataset.part;
    playAudioOrTTS(key);
  });
});

// Chatbot (simple rules)
const chatEl = document.getElementById('chat');
const qinput = document.getElementById('qinput');
const sendBtn = document.getElementById('send');
const voiceBtn = document.getElementById('voiceBtn');
function appendMsg(role, html){
  const d = document.createElement('div');
  d.className = 'msg ' + (role==='me'?'me':'');
  d.innerHTML = '<strong>' + (role==='me'? 'Bạn' : 'Trợ lý') + ':</strong> ' + html;
  chatEl.appendChild(d); chatEl.scrollTop = chatEl.scrollHeight;
}
function botAnswer(text){
  const t = text.toLowerCase();
  if(t.includes('cpu')) return PARTS.cpu.text;
  if(t.includes('ram')) return PARTS.ram.text;
  if(t.includes('main')||t.includes('bo mach')||t.includes('mainboard')) return PARTS.mainboard.text;
  if(t.includes('hdd')||t.includes('ssd')||t.includes('ổ cứng')) return PARTS.hdd.text;
  if(t.includes('nguồn')||t.includes('psu')) return PARTS.psu.text;
  if(t.includes('màn hình')||t.includes('monitor')) return PARTS.monitor.text;
  if(t.includes('bàn phím')||t.includes('phím')) return PARTS.keyboard.text;
  if(t.includes('chuột')) return PARTS.mouse.text;
  if(t.includes('kết nối')||t.includes('connect')) return 'Các bộ phận kết nối qua Mainboard: CPU vào socket, RAM vào khe DIMM, ổ cứng qua SATA hoặc M.2, card đồ họa vào khe PCIe.';
  if(t.includes('ram') && t.includes('ssd')) return 'RAM là bộ nhớ tạm thời; SSD là lưu trữ lâu dài.';
  if(t.includes('quiz')||t.includes('bài kiểm tra')) return 'Bạn có thể mở phần Quiz bằng nút "Làm Quiz" để làm 10 câu trắc nghiệm.';
  return 'Mình chưa hiểu rõ, bạn thử hỏi lại cụ thể hơn (ví dụ: \"CPU dùng để làm gì?\")';
}
sendBtn.addEventListener('click', ()=>{
  const v = qinput.value.trim(); if(!v) return;
  appendMsg('me', escapeHtml(v)); qinput.value='';
  const ans = botAnswer(v);
  setTimeout(()=>{ appendMsg('bot', escapeHtml(ans)); speak(ans); }, 300);
});
qinput.addEventListener('keydown', e=>{ if(e.key==='Enter') sendBtn.click(); });

// Voice recognition
let recognition = null;
if('webkitSpeechRecognition' in window || 'SpeechRecognition' in window){
  const Recon = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new Recon();
  recognition.lang = 'vi-VN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  voiceBtn.addEventListener('click', ()=>{
    try{ recognition.start(); voiceBtn.textContent='🎙️...'; }catch(e){ alert('Không thể bật micro.'); }
  });
  recognition.onresult = (ev)=>{
    const spoken = ev.results[0][0].transcript;
    appendMsg('me', escapeHtml(spoken));
    const ans = botAnswer(spoken);
    appendMsg('bot', escapeHtml(ans));
    speak(ans);
    voiceBtn.textContent='🎤';
  };
  recognition.onerror = (ev)=>{ voiceBtn.textContent='🎤'; alert('Lỗi nhận giọng nói: ' + (ev.error || 'unknown')); };
  recognition.onend = ()=>{ voiceBtn.textContent='🎤'; };
} else {
  voiceBtn.addEventListener('click', ()=> alert('Trình duyệt không hỗ trợ nhận dạng giọng nói. Dùng Chrome hoặc nhập bằng bàn phím.'));
}

// TTS speak helper
const synth = window.speechSynthesis || null;
let viVoice = null;
function findVietnameseVoice(){ if(!synth) return null; const voices=synth.getVoices(); viVoice = voices.find(v=>v.lang&&v.lang.startsWith('vi'))||voices.find(v=>v.name&&v.name.toLowerCase().includes('vietnam')); return viVoice; }
if(synth){ findVietnameseVoice(); speechSynthesis.onvoiceschanged = ()=> findVietnameseVoice(); }
function speak(txt){ if(!synth) return; const u=new SpeechSynthesisUtterance(txt); if(viVoice) u.voice=viVoice; u.lang=(viVoice&&viVoice.lang)?viVoice.lang:'vi-VN'; synth.cancel(); synth.speak(u); }

// Quiz data and logic (same as earlier)
const QUIZ = [
  {q:'Thiết bị nào thực hiện lệnh và phép toán chính trong máy tính?', opts:['RAM','CPU','Ổ cứng','Mainboard'], a:1},
  {q:'RAM có đặc điểm nào sau đây?', opts:['Lưu trữ lâu dài','Lưu tạm thời khi bật nguồn','Cung cấp điện','Hiển thị hình ảnh'], a:1},
  {q:'Thiết bị nào lưu trữ dữ liệu lâu dài?', opts:['CPU','Màn hình','Ổ cứng (HDD/SSD)','Chuột'], a:2},
  {q:'Mainboard có chức năng gì chính?', opts:['Kết nối các bộ phận','Lưu trữ người dùng','Tản nhiệt CPU','Hiển thị hình ảnh'], a:0},
  {q:'PSU có nhiệm vụ gì?', opts:['Cung cấp điện ổn định','Lưu trữ dữ liệu','Xử lý lệnh','Hiển thị ảnh'], a:0},
  {q:'Khi tắt nguồn, dữ liệu trên RAM sẽ:', opts:['Vẫn còn','Mất đi','Tự lưu','Chuyển sang CPU'], a:1},
  {q:'Kết nối nào thường dùng cho ổ SSD hiện đại tốc độ cao?', opts:['SATA','IDE','M.2 NVMe','PS/2'], a:2},
  {q:'Thiết bị nào là thiết bị đầu vào (input)?', opts:['Màn hình','Bàn phím','Ổ cứng','Card đồ họa'], a:1},
  {q:'Tại sao cần nguồn (PSU) tốt?', opts:['Tăng hiệu năng CPU','Cung cấp điện ổn định, bảo vệ phần cứng','Lưu trữ nhiều hơn','Hiển thị đẹp hơn'], a:1},
  {q:'Khi muốn nâng cấp để chạy phần mềm nặng, nên ưu tiên nâng cấp:', opts:['Chuột','RAM hoặc CPU','Màn hình','Vỏ máy'], a:1}
];
const quizModal = document.getElementById('quizModal');
const qNo = document.getElementById('qNo'); const qText = document.getElementById('qText'); const choicesEl = document.getElementById('choices');
const prevBtn = document.getElementById('prevBtn'); const nextBtn = document.getElementById('nextBtn'); const skipBtn = document.getElementById('skipBtn'); const finishBtn = document.getElementById('finishBtn');
let idx = 0; let answers = new Array(QUIZ.length).fill(null);
document.getElementById('btn-quiz').addEventListener('click', ()=>{ idx=0; openQuiz(); renderQ(); });
function openQuiz(){ quizModal.classList.add('open'); }
function closeQuiz(){ quizModal.classList.remove('open'); }
function renderQ(){ const item = QUIZ[idx]; qNo.textContent = (idx+1); qText.textContent = item.q; choicesEl.innerHTML = ''; item.opts.forEach((opt,i)=>{ const d=document.createElement('div'); d.className = 'choice' + (answers[idx]===i? ' selected':''); d.textContent = opt; d.addEventListener('click', ()=>{ answers[idx]=i; renderQ(); }); choicesEl.appendChild(d); }); prevBtn.disabled = idx===0; nextBtn.style.display = idx===QUIZ.length-1? 'none':'inline-block'; finishBtn.style.display = idx===QUIZ.length-1? 'inline-block':'none'; }
prevBtn.addEventListener('click', ()=>{ if(idx>0) idx--; renderQ(); });
nextBtn.addEventListener('click', ()=>{ if(idx<QUIZ.length-1) idx++; renderQ(); });
skipBtn.addEventListener('click', ()=>{ answers[idx]=null; if(idx<QUIZ.length-1) idx++; renderQ(); });
finishBtn.addEventListener('click', finishQuiz);
function finishQuiz(){ let score=0; for(let i=0;i<QUIZ.length;i++) if(answers[i]===QUIZ[i].a) score++; closeQuiz(); const result = 'Bạn hoàn thành quiz! Điểm: ' + score + ' / ' + QUIZ.length; alert(result); appendMsg('bot', result); speak('Bạn đã hoàn thành bài kiểm tra. Điểm của bạn là ' + score + ' trên ' + QUIZ.length); }
// close if click outside
quizModal.addEventListener('click', (e)=>{ if(e.target===quizModal) closeQuiz(); });
function escapeHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
