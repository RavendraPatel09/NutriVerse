// NutriVerse · UI logic — data, rendering, filters, reveals, interactions

/* ---------- data ---------- */
const MEALS = [
  { name: 'Grilled Salmon Power Bowl', emoji: '🐟', cat: 'lunch',     tag: 'High-protein', kcal: 520, p: 42, c: 38, f: 18, rating: 4.9, time: 25 },
  { name: 'Avocado Egg Toast',         emoji: '🥑', cat: 'breakfast', tag: 'Keto-friendly', kcal: 340, p: 18, c: 22, f: 21, rating: 4.7, time: 10 },
  { name: 'Quinoa Buddha Bowl',        emoji: '🥗', cat: 'lunch',     tag: 'Vegan',        kcal: 410, p: 16, c: 58, f: 12, rating: 4.8, time: 20 },
  { name: 'Greek Yogurt Berry Parfait',emoji: '🫐', cat: 'snack',     tag: 'Low-fat',      kcal: 210, p: 20, c: 26, f: 4,  rating: 4.6, time: 5  },
  { name: 'Lean Chicken Stir-Fry',     emoji: '🍗', cat: 'dinner',    tag: 'High-protein', kcal: 480, p: 45, c: 34, f: 14, rating: 4.9, time: 22 },
  { name: 'Overnight Protein Oats',    emoji: '🥣', cat: 'breakfast', tag: 'Post-workout', kcal: 380, p: 28, c: 48, f: 9,  rating: 4.8, time: 5  },
  { name: 'Zucchini Turkey Boats',     emoji: '🥒', cat: 'dinner',    tag: 'Low-carb',     kcal: 360, p: 38, c: 16, f: 17, rating: 4.5, time: 30 },
  { name: 'Almond Energy Bites',       emoji: '🌰', cat: 'snack',     tag: 'Gluten-free',  kcal: 180, p: 8,  c: 18, f: 11, rating: 4.7, time: 8  },
  { name: 'Tofu Veggie Scramble',      emoji: '🍳', cat: 'breakfast', tag: 'Vegan',        kcal: 300, p: 22, c: 18, f: 16, rating: 4.6, time: 12 },
];

const PRODUCTS = [
  { name: 'Whey Isolate Pro',   cat: 'Protein',     emoji: '🥛', price: '$39' },
  { name: 'Daily Greens',       cat: 'Superfood',   emoji: '🌿', price: '$29' },
  { name: 'Omega-3 Ultra',      cat: 'Essentials',  emoji: '🐠', price: '$22' },
  { name: 'Creatine Mono',      cat: 'Performance', emoji: '⚡', price: '$25' },
  { name: 'Plant Protein',      cat: 'Protein',     emoji: '🌱', price: '$34' },
  { name: 'Magnesium + Zinc',   cat: 'Recovery',    emoji: '💤', price: '$18' },
  { name: 'Electrolyte Mix',    cat: 'Hydration',   emoji: '💧', price: '$15' },
  { name: 'Collagen Peptides',  cat: 'Wellness',    emoji: '✨', price: '$28' },
];

/* ---------- render meals ---------- */
const grid = document.getElementById('meal-grid');
function mealCard(m) {
  return `
  <article class="card" data-cat="${m.cat}">
    <div class="card-img">
      <span class="card-tag">${m.tag}</span>
      <button class="card-fav" type="button" aria-label="Save">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M12 20s-7-4.35-9.33-8.5C1.1 8.6 2.6 5.5 5.6 5.5c1.8 0 3 1 2.9 1 .9-1 2.1-1.6 3.5-1.6 3 0 4.5 3.1 2.9 6C18.9 15.65 12 20 12 20Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
      </button>
      ${m.emoji}
    </div>
    <div class="card-body">
      <h3>${m.name}</h3>
      <div class="card-meta"><span class="star">★</span> ${m.rating} · ${m.time} min · ${m.kcal} kcal</div>
      <div class="macros">
        <div class="macro"><b>${m.p}g</b><span>Protein</span></div>
        <div class="macro"><b>${m.c}g</b><span>Carbs</span></div>
        <div class="macro"><b>${m.f}g</b><span>Fats</span></div>
      </div>
    </div>
  </article>`;
}
function renderMeals(filter = 'all') {
  const list = filter === 'all' ? MEALS : MEALS.filter(m => m.cat === filter);
  grid.innerHTML = list.map(mealCard).join('');
  // re-bind fav buttons
  grid.querySelectorAll('.card-fav').forEach(b =>
    b.addEventListener('click', e => { e.stopPropagation(); b.classList.toggle('active'); }));
  // stagger-reveal new cards
  grid.querySelectorAll('.card').forEach((c, i) => {
    c.style.opacity = 0; c.style.transform = 'translateY(20px)';
    c.style.transition = 'opacity .5s, transform .5s';
    c.style.transitionDelay = (i * 0.05) + 's';
    requestAnimationFrame(() => requestAnimationFrame(() => { c.style.opacity = 1; c.style.transform = 'none'; }));
  });
}
renderMeals();

/* ---------- filters ---------- */
document.getElementById('filters').addEventListener('click', e => {
  const btn = e.target.closest('.filter');
  if (!btn) return;
  document.querySelectorAll('.filter').forEach(f => f.classList.remove('is-active'));
  btn.classList.add('is-active');
  renderMeals(btn.dataset.filter);
});

/* ---------- render products ---------- */
document.getElementById('product-row').innerHTML = PRODUCTS.map(p => `
  <article class="product">
    <div class="product-img">${p.emoji}</div>
    <h3>${p.name}</h3>
    <div class="product-cat">${p.cat}</div>
    <div class="product-row">
      <span class="product-price">${p.price}</span>
      <button class="btn btn-outline" type="button">Add</button>
    </div>
  </article>`).join('');

/* ---------- search (filters meals by text) ---------- */
const searchInput = document.getElementById('search-input');
document.getElementById('search').addEventListener('submit', () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) { renderMeals(); return; }
  const list = MEALS.filter(m =>
    m.name.toLowerCase().includes(q) || m.tag.toLowerCase().includes(q) || m.cat.includes(q));
  grid.innerHTML = list.length ? list.map(mealCard).join('')
    : `<p style="grid-column:1/-1;text-align:center;color:var(--muted)">No matches for “${q}”. Try a tag like “vegan” or “high-protein”.</p>`;
  grid.querySelectorAll('.card-fav').forEach(b =>
    b.addEventListener('click', e => { e.stopPropagation(); b.classList.toggle('active'); }));
  document.getElementById('meals').scrollIntoView({ behavior: 'smooth' });
});

/* chips -> seed search */
document.getElementById('chips').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  searchInput.value = chip.textContent;
  document.getElementById('search').dispatchEvent(new Event('submit'));
});

/* ---------- scroll reveal ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- animated counters ---------- */
const counters = document.querySelectorAll('[data-count]');
const cObserver = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    const target = +el.dataset.count;
    const dur = 1400; const start = performance.now();
    const tick = (now) => {
      const prog = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - prog, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (prog < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(tick);
    cObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => cObserver.observe(c));

/* ---------- nav scroll state + mobile menu ---------- */
const nav = document.getElementById('nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 30), { passive: true });
document.getElementById('burger').addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
