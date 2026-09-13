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
