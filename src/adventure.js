const call = document.querySelector('#loveCall');
const callAgain = document.querySelector('#callAgain');
const counter = document.querySelector('#huntCounter');
const countLabel = document.querySelector('#heartCount');
const toast = document.querySelector('#loveToast');
const constellation = document.querySelector('#constellationModal');
const starCanvas = document.querySelector('#starCanvas');
let found = 0;
let toastTimer;
let starAnimation;

const messages = [
  'Seu sorriso ainda é minha parte favorita do dia.', 'Você deixa tudo mais bonito sem nem perceber.',
  'Seu abraço é meu endereço preferido.', 'Eu escolheria você em todas as versões da vida.',
  'A sua risada mora de graça na minha cabeça.', 'Amar você é a minha coincidência favorita.',
  'Você é poesia até quando acha que não é.', 'Meu futuro favorito começa com “nós”.',
  'Com você, até o silêncio vira companhia.', 'Eu amo a paz que encontro no seu olhar.',
  'O mundo acertou muito quando fez você.', 'Meu coração reconheceu você antes de mim.',
  'Você transforma dias comuns em lembranças.', 'Ainda fico feliz só por saber que você existe.',
  'Quero conhecer todas as suas próximas versões.', 'Seu jeitinho é meu detalhe favorito no universo.',
  'Minha saudade sempre sabe o caminho até você.', 'Você é casa, aventura e destino ao mesmo tempo.',
  'O último coração sempre foi seu.'
];

const placements = [
  ['.hero',12,31],['.hero',86,68],['.letter',88,42],['.letter',11,83],
  ['.reasons',93,28],['.reasons',7,56],['.reasons',86,88],['.scratch-section',9,34],['.scratch-section',91,72],
  ['.memories',7,22],['.memories',91,51],['.memories',47,88],['.heart-vault',9,55],['.heart-vault',90,20],
  ['.playlist',8,30],['.playlist',91,75],['.finale',10,25],['.finale',89,44],['.finale',51,83]
];

function showCall() { call.classList.add('ringing'); callAgain.classList.remove('visible'); document.body.classList.add('call-open'); }
function hideCall() { call.classList.remove('ringing'); document.body.classList.remove('call-open'); callAgain.classList.add('visible'); }
function startHunt() {
  hideCall();
  if (counter.classList.contains('active')) return;
  counter.classList.add('active');
  placements.forEach(([selector,x,y], index) => {
    const host = document.querySelector(selector);
    host.classList.add('hunt-host');
    const heart = document.createElement('button');
    heart.className = 'hunt-heart'; heart.innerHTML = '<span>♥</span>';
    heart.style.left = `${x}%`; heart.style.top = `${y}%`;
    heart.setAttribute('aria-label', `Coração escondido ${index + 1}`);
    heart.addEventListener('click', () => collectHeart(heart, index));
    host.appendChild(heart);
  });
  showToast('Sua missão: encontre os 19 corações escondidos pelo nosso mundo ♡', true);
}

function collectHeart(heart, index) {
  if (heart.classList.contains('found')) return;
  heart.classList.add('found'); found++; countLabel.textContent = found;
  if (navigator.vibrate) navigator.vibrate(35);
  showToast(`<b>${String(found).padStart(2,'0')}.</b> ${messages[index]}`);
  if (found === 19) setTimeout(openConstellation, 1100);
}

function showToast(message, long = false) {
  clearTimeout(toastTimer); toast.innerHTML = message; toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), long ? 5000 : 3000);
}

function openConstellation() {
  constellation.classList.add('open'); document.body.classList.add('modal-open');
  counter.classList.remove('active'); drawStars();
}

function closeConstellation() {
  constellation.classList.remove('open'); document.body.classList.remove('modal-open');
  cancelAnimationFrame(starAnimation);
}

function drawStars() {
  const ctx = starCanvas.getContext('2d');
  const ratio = Math.min(devicePixelRatio || 1, 2);
  const resize = () => { starCanvas.width = innerWidth * ratio; starCanvas.height = innerHeight * ratio; ctx.setTransform(ratio,0,0,ratio,0,0); };
  resize();
  const stars = Array.from({length:90},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.8+.3,a:Math.random()}));
  const heart = Array.from({length:19},(_,i)=>{const t=Math.PI*2*i/19;return{x:innerWidth/2+Math.sin(t)**3*Math.min(14,innerWidth/28),y:innerHeight*.42-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))*Math.min(12,innerWidth/32)}});
  let start;
  function frame(now){start??=now;const p=Math.min((now-start)/2600,1);ctx.clearRect(0,0,innerWidth,innerHeight);stars.forEach(s=>{ctx.globalAlpha=.25+s.a*.6;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,7);ctx.fill()});ctx.globalAlpha=p*.75;ctx.strokeStyle='#eeb3c3';ctx.lineWidth=1;ctx.beginPath();heart.forEach((s,i)=>i?ctx.lineTo(s.x,s.y):ctx.moveTo(s.x,s.y));ctx.closePath();ctx.stroke();heart.forEach((s,i)=>{if(i/19>p)return;ctx.globalAlpha=.6+Math.sin(now/300+i)*.3;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(s.x,s.y,3.2,0,7);ctx.fill()});ctx.globalAlpha=1;starAnimation=requestAnimationFrame(frame)}
  starAnimation=requestAnimationFrame(frame);
}

document.querySelector('#acceptCall').addEventListener('click', startHunt);
document.querySelector('#declineCall').addEventListener('click', hideCall);
callAgain.addEventListener('click', showCall);
document.querySelector('#constellationClose').addEventListener('click', closeConstellation);
setTimeout(showCall, 4500);
