const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const button = document.querySelector('#moreReasons');
const extra = document.querySelector('#extraReasons');
button.addEventListener('click', () => {
  const isOpen = extra.classList.toggle('open');
  button.innerHTML = isOpen ? 'guardar os motivos <span>−</span>' : 'ver os outros 13 motivos <span>+</span>';
  if (isOpen) extra.querySelectorAll('li').forEach((item, i) => setTimeout(() => item.classList.add('shown'), i * 65));
});

const petalBox = document.querySelector('#petals');
for (let i = 0; i < 14; i++) {
  const petal = document.createElement('i');
  petal.style.setProperty('--x', `${Math.random() * 100}vw`);
  petal.style.setProperty('--delay', `${Math.random() * -16}s`);
  petal.style.setProperty('--duration', `${12 + Math.random() * 10}s`);
  petal.style.setProperty('--size', `${5 + Math.random() * 7}px`);
  petalBox.appendChild(petal);
}

const holdHeart = document.querySelector('#holdHeart');
const ringProgress = document.querySelector('#ringProgress');
const holdLabel = document.querySelector('#holdLabel');
const secretModal = document.querySelector('#secretModal');
const typedSecret = document.querySelector('#typedSecret');
const heartBurst = document.querySelector('#heartBurst');
const secretText = 'Se algum dia você esquecer o quanto é especial, volte aqui. Você é o meu acaso mais bonito, meu abraço preferido e a pessoa com quem eu quero colecionar todas as próximas versões da vida.';
let holdStart = 0;
let holdFrame;
let unlocked = false;

function animateHold(now) {
  const progress = Math.min((now - holdStart) / 3000, 1);
  ringProgress.style.strokeDashoffset = 333 - (333 * progress);
  holdHeart.style.setProperty('--hold', progress);
  holdLabel.textContent = progress < .34 ? 'só mais um pouquinho…' : progress < .72 ? 'está quase abrindo…' : 'meu coração é seu';
  if (progress >= 1) return unlockSecret();
  holdFrame = requestAnimationFrame(animateHold);
}

function startHold(event) {
  if (unlocked) return unlockSecret();
  event.preventDefault();
  holdStart = performance.now();
  holdHeart.classList.add('holding');
  holdFrame = requestAnimationFrame(animateHold);
}

function cancelHold() {
  if (unlocked) return;
  cancelAnimationFrame(holdFrame);
  holdHeart.classList.remove('holding');
  ringProgress.style.strokeDashoffset = 333;
  holdHeart.style.setProperty('--hold', 0);
  holdLabel.textContent = 'pressione e segure';
}

function unlockSecret() {
  cancelAnimationFrame(holdFrame);
  unlocked = true;
  holdHeart.classList.remove('holding');
  holdHeart.classList.add('unlocked');
  holdLabel.textContent = 'aberto com amor ♡';
  if (navigator.vibrate) navigator.vibrate([60, 50, 120]);
  createHeartBurst();
  secretModal.classList.add('open');
  document.body.classList.add('modal-open');
  typedSecret.textContent = '';
  setTimeout(typeSecret, 650);
}

function typeSecret() {
  let index = 0;
  const timer = setInterval(() => {
    typedSecret.textContent += secretText[index++] || '';
    if (index >= secretText.length) clearInterval(timer);
  }, 24);
}

function createHeartBurst() {
  heartBurst.innerHTML = '';
  for (let i = 0; i < 28; i++) {
    const heart = document.createElement('i');
    heart.textContent = Math.random() > .35 ? '♥' : '✦';
    heart.style.setProperty('--angle', `${(360 / 28) * i + Math.random() * 18}deg`);
    heart.style.setProperty('--distance', `${90 + Math.random() * 190}px`);
    heart.style.setProperty('--delay', `${Math.random() * .25}s`);
    heartBurst.appendChild(heart);
  }
}

function closeSecret() {
  secretModal.classList.remove('open');
  document.body.classList.remove('modal-open');
}

holdHeart.addEventListener('pointerdown', startHold);
holdHeart.addEventListener('pointerup', cancelHold);
holdHeart.addEventListener('pointercancel', cancelHold);
holdHeart.addEventListener('pointerleave', cancelHold);
holdHeart.addEventListener('contextmenu', (event) => event.preventDefault());
document.querySelector('#secretClose').addEventListener('click', closeSecret);
secretModal.addEventListener('click', (event) => { if (event.target === secretModal) closeSecret(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeSecret(); });

// Raspadinha tátil: revela uma memória conforme o dedo percorre a foto.
const scratchCanvas = document.querySelector('#scratchCanvas');
const scratchWrap = document.querySelector('#scratchWrap');
const scratchSkip = document.querySelector('#scratchSkip');
const scratchInstruction = document.querySelector('#scratchInstruction');
const scratchSparkles = document.querySelector('#scratchSparkles');
const scratchContext = scratchCanvas.getContext('2d', { willReadFrequently: true });
let scratching = false;
let scratchDone = false;
let scratchChecks = 0;

function prepareScratch() {
  if (scratchDone) return;
  const box = scratchWrap.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  scratchCanvas.width = Math.round(box.width * ratio);
  scratchCanvas.height = Math.round(box.height * ratio);
  scratchContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  const gradient = scratchContext.createLinearGradient(0, 0, box.width, box.height);
  gradient.addColorStop(0, '#d8899d'); gradient.addColorStop(1, '#7d2947');
  scratchContext.fillStyle = gradient;
  scratchContext.fillRect(0, 0, box.width, box.height);
  scratchContext.fillStyle = 'rgba(255,255,255,.92)';
  scratchContext.textAlign = 'center';
  scratchContext.textBaseline = 'middle';
  scratchContext.font = `${Math.min(34, box.width / 10)}px Sacramento`;
  scratchContext.fillText('um segredo escondido aqui ♡', box.width / 2, box.height / 2);
  scratchContext.font = '10px DM Sans';
  scratchContext.letterSpacing = '3px';
  scratchContext.fillText('RASPE COM CARINHO', box.width / 2, box.height / 2 + 42);
  for (let i = 0; i < 55; i++) {
    scratchContext.globalAlpha = .08 + Math.random() * .14;
    scratchContext.fillStyle = '#fff';
    scratchContext.beginPath();
    scratchContext.arc(Math.random() * box.width, Math.random() * box.height, Math.random() * 2 + .5, 0, Math.PI * 2);
    scratchContext.fill();
  }
  scratchContext.globalAlpha = 1;
}

function scratchAt(event) {
  if (!scratching || scratchDone) return;
  event.preventDefault();
  const rect = scratchCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  scratchContext.globalCompositeOperation = 'destination-out';
  scratchContext.beginPath();
  scratchContext.arc(x, y, Math.max(28, rect.width * .075), 0, Math.PI * 2);
  scratchContext.fill();
  scratchInstruction.classList.add('hidden');
  if (++scratchChecks % 9 === 0) checkScratchProgress();
}

function checkScratchProgress() {
  const pixels = scratchContext.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height).data;
  let clear = 0;
  for (let i = 3; i < pixels.length; i += 64) if (pixels[i] < 40) clear++;
  if (clear / (pixels.length / 64) > .42) finishScratch();
}

function finishScratch() {
  if (scratchDone) return;
  scratchDone = true;
  scratching = false;
  scratchWrap.classList.add('discovered');
  scratchInstruction.innerHTML = '<i>♡</i><span>você encontrou mais um pedacinho do meu coração</span>';
  scratchInstruction.classList.remove('hidden');
  scratchSkip.hidden = true;
  if (navigator.vibrate) navigator.vibrate(80);
  for (let i = 0; i < 20; i++) {
    const sparkle = document.createElement('i');
    sparkle.textContent = i % 3 ? '✦' : '♥';
    sparkle.style.setProperty('--sx', `${Math.random() * 100}%`);
    sparkle.style.setProperty('--sy', `${Math.random() * 100}%`);
    sparkle.style.setProperty('--sd', `${Math.random() * .5}s`);
    scratchSparkles.appendChild(sparkle);
  }
}

scratchCanvas.addEventListener('pointerdown', (event) => { scratching = true; scratchCanvas.setPointerCapture(event.pointerId); scratchAt(event); });
scratchCanvas.addEventListener('pointermove', scratchAt);
scratchCanvas.addEventListener('pointerup', () => { scratching = false; checkScratchProgress(); });
scratchCanvas.addEventListener('pointercancel', () => { scratching = false; });
scratchSkip.addEventListener('click', finishScratch);
new ResizeObserver(prepareScratch).observe(scratchWrap);
