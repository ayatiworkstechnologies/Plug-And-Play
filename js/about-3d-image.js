const card = document.getElementById('gpCard');
const glare = document.getElementById('gpGlare');

card.addEventListener('mousemove', e => {
  const r = card.getBoundingClientRect();
  const nx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
  const ny = (e.clientY - r.top - r.height / 2) / (r.height / 2);

  card.style.transform = `perspective(900px) rotateX(${-ny * 13}deg) rotateY(${nx * 17}deg) scale(1.04) translateZ(14px)`;
  card.style.boxShadow = `${nx * 22}px ${ny * 16 + 18}px 55px rgba(199,166,75,0.55), 0 0 60px rgba(199,166,75,0.28)`;

  const gx = ((e.clientX - r.left) / r.width * 100).toFixed(1);
  const gy = ((e.clientY - r.top) / r.height * 100).toFixed(1);
  glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,220,100,0.18), transparent 58%)`;
});

card.addEventListener('mouseleave', () => {
  card.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0px)`;
  card.style.boxShadow = `0 0 25px rgba(199,166,75,0.45), 0 0 60px rgba(199,166,75,0.22)`;
});