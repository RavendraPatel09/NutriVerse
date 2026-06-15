# NutriVerse 🥗

**Eat smart. Live strong.** — a dark-themed platform to discover healthy meals, vetted nutrition products, personalized diet plans, and fitness-oriented food recommendations.

Built as a fast, dependency-free static site with an interactive **Three.js** hero experience.

## ✨ Features

- **3D hero background** (Three.js) — a breathing glowing core, orbiting macro nodes, a 1,300-particle nutrient field, mouse parallax and scroll reactivity. Respects `prefers-reduced-motion`.
- **Smart discovery** — search + diet chips (Vegan, Keto, High-protein…) that filter the meal grid.
- **Category filters** — Breakfast / Lunch / Dinner / Snacks with staggered reveals.
- **Meal cards** with macro breakdowns (protein / carbs / fats), ratings, and favorites.
- **Diet plans**, **vetted product grid**, **how-it-works** steps, animated counters, and scroll-reveal throughout.
- **Fully responsive** with a glassmorphism dark UI.

## 🗂 Structure

```
nutriverse/
├── index.html        # markup & sections
├── css/styles.css    # design system, layout, responsive
└── js/
    ├── scene.js      # Three.js hero background
    └── app.js        # data, rendering, filters, interactions
```

## 🚀 Run locally

ES modules + import maps require `http://` (not `file://`):

```bash
# Python
python -m http.server 5173

# or Node
npx serve .
```

Then open <http://localhost:5173>.

## 🛠 Tech

- HTML5 · CSS3 (custom properties, glassmorphism) · vanilla JS (ES modules)
- [Three.js](https://threejs.org/) r161 via CDN — no build step required

## 📋 Customizing

- Meals & products are plain arrays at the top of [`js/app.js`](js/app.js).
- Accent colors are CSS variables at the top of [`css/styles.css`](css/styles.css).

---

© 2026 NutriVerse · Crafted for healthier humans.
