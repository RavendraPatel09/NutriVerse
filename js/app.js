// NutriVerse · UI logic — data, rendering, filters, reveals, interactions

/* ---------- data ---------- */
const MEALS = [
  { name: 'Grilled Salmon Power Bowl', emoji: '🐟', img: 'salmon,bowl,rice',     cat: 'lunch',     tag: 'High-protein', kcal: 520, p: 42, c: 38, f: 18, rating: 4.9, time: 25 },
  { name: 'Avocado Egg Toast',         emoji: '🥑', img: 'avocado,toast,egg',    cat: 'breakfast', tag: 'Keto-friendly', kcal: 340, p: 18, c: 22, f: 21, rating: 4.7, time: 10 },
  { name: 'Mediterranean Chickpea Bowl', emoji: '🥙', img: 'chickpea,mediterranean,bowl', cat: 'lunch', tag: 'Vegan',  kcal: 410, p: 16, c: 58, f: 12, rating: 4.8, time: 20 },
  { name: 'Greek Yogurt Berry Parfait',emoji: '🫐', img: 'yogurt,berries,parfait', cat: 'snack',   tag: 'Low-fat',      kcal: 210, p: 20, c: 26, f: 4,  rating: 4.6, time: 5  },
  { name: 'Lean Chicken Stir-Fry',     emoji: '🍗', img: 'chicken,stirfry,vegetables', cat: 'dinner', tag: 'High-protein', kcal: 480, p: 45, c: 34, f: 14, rating: 4.9, time: 22 },
  { name: 'Overnight Protein Oats',    emoji: '🥣', img: 'oats,porridge,bowl', cat: 'breakfast', tag: 'Post-workout', kcal: 380, p: 28, c: 48, f: 9,  rating: 4.8, time: 5  },
  { name: 'Zucchini Turkey Boats',     emoji: '🥒', img: 'zucchini,stuffed,baked', cat: 'dinner',  tag: 'Low-carb',     kcal: 360, p: 38, c: 16, f: 17, rating: 4.5, time: 30 },
  { name: 'Almond Energy Bites',       emoji: '🍫', img: 'energy,protein,balls', photo: 'https://images.unsplash.com/photo-1678554500191-3885a6fbf8c2?w=640&h=420&fit=crop&q=80', cat: 'snack', tag: 'Gluten-free',  kcal: 180, p: 8,  c: 18, f: 11, rating: 4.7, time: 8  },
  { name: 'Sweet Potato Veggie Hash',  emoji: '🍠', img: 'sweet,potato,hash', cat: 'breakfast', tag: 'Vegan',    kcal: 300, p: 22, c: 18, f: 16, rating: 4.6, time: 12 },
];

// real food photo: a hand-picked `photo` URL wins; otherwise a keyword-matched
// LoremFlickr image with a stable per-meal seed. emoji is the fallback.
function mealImg(m) {
  if (m.photo) return m.photo;
  const lock = [...m.name].reduce((a, c) => a + c.charCodeAt(0), 0);
  return `https://loremflickr.com/640/420/${m.img}?lock=${lock}`;
}

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
  <article class="card" data-cat="${m.cat}" data-name="${m.name}">
    <div class="card-img">
      <span class="ph">${m.emoji}</span>
      <img class="card-photo" src="${mealImg(m)}" alt="${m.name}" loading="lazy" onerror="this.remove()" />
      <span class="card-tag">${m.tag}</span>
      <button class="card-fav" type="button" aria-label="Save">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M12 20s-7-4.35-9.33-8.5C1.1 8.6 2.6 5.5 5.6 5.5c1.8 0 3 1 2.9 1 .9-1 2.1-1.6 3.5-1.6 3 0 4.5 3.1 2.9 6C18.9 15.65 12 20 12 20Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
      </button>
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

/* ---------- scroll reveal (GSAP ScrollTrigger, IO fallback) ---------- */
const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
const useGsap = !!(gsap && ScrollTrigger);

if (useGsap) {
  gsap.registerPlugin(ScrollTrigger);
  // everything except the hero (hero gets its own intro timeline)
  const revealEls = gsap.utils.toArray('.reveal').filter(el => !el.closest('.hero'));
  gsap.set(revealEls, { opacity: 0, y: 30 });
  ScrollTrigger.batch(revealEls, {
    start: 'top 88%',
    onEnter: batch => gsap.to(batch, {
      opacity: 1, y: 0, duration: .8, stagger: .09, ease: 'power3.out', overwrite: true,
    }),
  });
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in')); // un-hide via CSS too
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

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

/* ====================================================================
   GSAP motion layer — hero intro, magnetic buttons, aurora drift
   ==================================================================== */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (useGsap && !reduce) {
  // hero intro timeline
  gsap.set('.hero-inner', { opacity: 1 });
  gsap.timeline({ defaults: { ease: 'power3.out', duration: .9 } })
    .from('.eyebrow',        { y: 24, opacity: 0 })
    .from('.hero-title',     { y: 36, opacity: 0 }, '-=.55')
    .from('.hero-sub',       { y: 26, opacity: 0 }, '-=.6')
    .from('.search',         { y: 26, opacity: 0, scale: .98 }, '-=.6')
    .from('.chip',           { y: 18, opacity: 0, stagger: .05 }, '-=.5')
    .from('.hero-stats > div', { y: 18, opacity: 0, stagger: .1 }, '-=.5')
    .from('.scroll-cue',     { opacity: 0 }, '-=.3');

  // drifting colourful aurora blobs
  gsap.utils.toArray('.aurora .blob').forEach((b, i) => {
    gsap.to(b, {
      xPercent: i % 2 ? 14 : -14, yPercent: i % 2 ? -12 : 12, scale: 1.18,
      duration: 8 + i * 2, repeat: -1, yoyo: true, ease: 'sine.inOut',
    });
  });

  // magnetic primary buttons (pull toward the cursor)
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * .3, y: (e.clientY - r.top - r.height / 2) * .45, duration: .4, ease: 'power3.out' });
    });
    btn.addEventListener('pointerleave', () => gsap.to(btn, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.4)' }));
  });
}

// keep scroll triggers aligned after dynamic meal grid changes
if (useGsap) {
  const g = document.getElementById('meal-grid');
  new MutationObserver(() => ScrollTrigger.refresh()).observe(g, { childList: true });
}

/* ====================================================================
   FEATURE · Meal detail modal
   ==================================================================== */
const modal = document.getElementById('meal-modal');
const modalCard = document.getElementById('modal-card');

function mealBenefits(m) {
  const b = [];
  if (m.p >= 30) b.push(`High protein (${m.p}g) — ideal for muscle repair`);
  else if (m.p >= 18) b.push(`Solid protein hit (${m.p}g)`);
  if (m.c <= 20) b.push('Low-carb friendly');
  if (m.kcal <= 350) b.push('Light on calories — great for a cut');
  if (m.f <= 10) b.push('Low in fat');
  if (m.time <= 10) b.push(`Quick to make — only ${m.time} min`);
  b.push(`${m.tag} option · rated ${m.rating}★`);
  return b.slice(0, 4);
}

function openMeal(m) {
  modalCard.innerHTML = `
    <button class="modal-x" data-close aria-label="Close">✕</button>
    <div class="modal-hero"><span class="ph">${m.emoji}</span><img class="card-photo" src="${mealImg(m)}" alt="${m.name}" loading="lazy" onerror="this.remove()" /><span class="card-tag" style="top:1rem;left:1rem;z-index:3">${m.tag}</span></div>
    <div class="modal-body">
      <h3>${m.name}</h3>
      <div class="m-meta"><span class="star">★</span> ${m.rating} · ${m.time} min · ${m.kcal} kcal · ${m.cat}</div>
      <div class="macros">
        <div class="macro"><b>${m.p}g</b><span>Protein</span></div>
        <div class="macro"><b>${m.c}g</b><span>Carbs</span></div>
        <div class="macro"><b>${m.f}g</b><span>Fats</span></div>
      </div>
      <ul class="m-benefits">${mealBenefits(m).map(x => `<li>${x}</li>`).join('')}</ul>
      <div class="modal-actions">
        <button class="btn btn-primary" type="button" data-close>Add to plan</button>
        <button class="btn btn-outline" type="button" id="modal-ai">✨ Ask AI about this</button>
      </div>
    </div>`;
  modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
  modalCard.querySelector('#modal-ai').addEventListener('click', () => {
    closeModal(); openAI(); aiAsk(`Tell me more about ${m.name} and when I should eat it`);
  });
}
function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }
modal.addEventListener('click', e => {
  if (e.target.closest('[data-close]') || e.target.classList.contains('modal-back')) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeAI(); } });

// open a meal modal when a card (not its heart) is clicked
document.getElementById('meal-grid').addEventListener('click', e => {
  if (e.target.closest('.card-fav')) return;
  const card = e.target.closest('.card');
  if (!card) return;
  const m = MEALS.find(x => x.name === card.dataset.name);
  if (m) openMeal(m);
});

/* ====================================================================
   FEATURE · AI Macro Calculator (Mifflin–St Jeor)
   ==================================================================== */
const calcForm = document.getElementById('calc-form');
let lastTargets = null;
const $ = id => document.getElementById(id);

if (calcForm) {
  calcForm.addEventListener('submit', e => {
    e.preventDefault();
    const age = +$('c-age').value, sex = $('c-sex').value, w = +$('c-weight').value, h = +$('c-height').value;
    const act = +$('c-activity').value, goal = +$('c-goal').value;
    const bmr = 10 * w + 6.25 * h - 5 * age + (sex === 'male' ? 5 : -161);
    const target = Math.round(bmr * act * (1 + goal));
    const pG = Math.round(w * (goal < 0 ? 2.2 : 2.0));      // higher protein on a cut
    const fG = Math.round(target * 0.25 / 9);
    const cG = Math.max(0, Math.round((target - pG * 4 - fG * 9) / 4));
    const pPct = Math.round(pG * 4 / target * 100), fPct = Math.round(fG * 9 / target * 100);
    const cPct = Math.max(0, 100 - pPct - fPct);
    $('r-cal').textContent = target.toLocaleString();
    $('r-p').textContent = pG + 'g'; $('r-c').textContent = cG + 'g'; $('r-f').textContent = fG + 'g';
    $('r-pp').textContent = pPct + '%'; $('r-cp').textContent = cPct + '%'; $('r-fp').textContent = fPct + '%';
    const goalText = goal < 0 ? 'fat loss' : goal > 0 ? 'muscle gain' : 'maintenance';
    $('r-note').textContent = `Estimated with Mifflin–St Jeor. ${pG}g protein supports your ${goalText} goal — spread it across 4–5 meals for best results.`;
    const res = $('calc-result'); res.hidden = false;
    if (useGsap) gsap.fromTo(res, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .5, ease: 'power3.out' });
    lastTargets = { target, pG, cG, fG, goalText };
  });
  $('r-ai').addEventListener('click', () => {
    openAI();
    aiAsk(lastTargets
      ? `Plan meals for ${lastTargets.target} kcal a day with ${lastTargets.pG}g protein for ${lastTargets.goalText}`
      : 'Help me plan my meals');
  });
}

/* ====================================================================
   FEATURE · NutriAI assistant (keyword reasoning over the meal data)
   ==================================================================== */
const aiPanel = document.getElementById('ai-panel');
const aiMsgs = document.getElementById('ai-msgs');
const aiForm = document.getElementById('ai-form');
const aiText = document.getElementById('ai-text');
let aiGreeted = false;

function openAI() {
  aiPanel.classList.add('open'); aiPanel.setAttribute('aria-hidden', 'false');
  if (!aiGreeted) {
    aiGreeted = true;
    botSay("Hey! I'm <b>NutriAI</b> 🥑 — tell me your goal, a diet style (vegan, keto, high-protein…) or a meal type, and I'll recommend foods from our kitchen. Pick a suggestion below 👇");
  }
  setTimeout(() => aiText.focus(), 320);
}
function closeAI() { aiPanel.classList.remove('open'); aiPanel.setAttribute('aria-hidden', 'true'); }
$('ai-fab').addEventListener('click', () => aiPanel.classList.contains('open') ? closeAI() : openAI());
$('ai-close').addEventListener('click', closeAI);

const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
function userSay(t) { const d = document.createElement('div'); d.className = 'msg user'; d.textContent = t; aiMsgs.appendChild(d); aiScroll(); }
function botSay(html) { const d = document.createElement('div'); d.className = 'msg bot'; d.innerHTML = html; aiMsgs.appendChild(d); aiScroll(); return d; }
function aiScroll() { aiMsgs.scrollTop = aiMsgs.scrollHeight; }
function aiTyping() { const d = document.createElement('div'); d.className = 'typing'; d.innerHTML = '<i></i><i></i><i></i>'; aiMsgs.appendChild(d); aiScroll(); return d; }

// NOTE: this is a local rule-based "brain". To use real AI, replace aiThink()
// with a fetch() to the Claude API (model: claude-opus-4-8) on your backend.
function aiThink(q) {
  const s = q.toLowerCase();
  const tagKeys = ['vegan', 'keto', 'low-carb', 'low carb', 'gluten', 'high-protein', 'protein', 'post-workout', 'post workout'];
  const wantTag = tagKeys.find(k => s.includes(k));
  const cats = ['breakfast', 'lunch', 'dinner', 'snack'];
  const wantCat = cats.find(c => s.includes(c));
  const lose = /(lose|fat loss|cut|slim|weight loss|lean|deficit)/.test(s);
  const gain = /(gain|bulk|muscle|mass|build|surplus|strong)/.test(s);
  const calo = /(calorie|macro|how many|tdee|bmr|kcal)/.test(s);

  let pool = MEALS.slice();
  if (wantTag) pool = pool.filter(m => m.tag.toLowerCase().includes(wantTag.replace(' ', '-')));
  if (wantCat) pool = pool.filter(m => m.cat === wantCat);
  if (!pool.length) pool = MEALS.slice();
  if (lose) pool.sort((a, b) => a.kcal - b.kcal || b.p - a.p);
  else if (gain) pool.sort((a, b) => b.kcal - a.kcal);
  else pool.sort((a, b) => b.rating - a.rating);
  const picks = pool.slice(0, 3);

  let intro;
  if (calo) intro = 'Great question! Use the <b>AI Macro Calculator</b> above for exact numbers. Meanwhile, here are balanced picks:';
  else if (lose) intro = 'For fat loss, lean high-protein, lower-calorie meals keep you full. Try these:';
  else if (gain) intro = 'To build muscle, go calorie-dense with strong protein. These work well:';
  else if (wantTag && wantCat) intro = `Here are ${wantTag} ${wantCat} ideas:`;
  else if (wantTag) intro = `Top ${wantTag} options coming up:`;
  else if (wantCat) intro = `Great ${wantCat} picks for you:`;
  else intro = "Here are some highly-rated meals I think you'll love:";
  return { intro, picks };
}

function aiAsk(text) {
  if (!aiPanel.classList.contains('open')) openAI();
  userSay(text); aiText.value = '';
  const typing = aiTyping();
  setTimeout(() => {
    typing.remove();
    const { intro, picks } = aiThink(text);
    const cards = picks.map(m =>
      `<div class="m-meal" data-name="${esc(m.name)}"><span class="e">${m.emoji}</span>
        <div><b>${esc(m.name)}</b><span>${m.kcal} kcal · ${m.p}g protein · ${m.tag}</span></div></div>`).join('');
    const node = botSay(`${intro}${cards}`);
    node.querySelectorAll('.m-meal').forEach(el => el.addEventListener('click', () => {
      const m = MEALS.find(x => x.name === el.dataset.name);
      if (m) { closeAI(); openMeal(m); }
    }));
  }, 650 + Math.random() * 500);
}

aiForm.addEventListener('submit', e => { e.preventDefault(); const t = aiText.value.trim(); if (t) aiAsk(t); });
$('ai-quick').addEventListener('click', e => { const b = e.target.closest('button'); if (b) aiAsk(b.textContent); });
