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
