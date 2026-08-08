
 # 🌌 Galaxy Portfolio

A 3D, galaxy-themed personal portfolio built with **Three.js** and **Vite** — a hand-built spiral particle galaxy sits behind your content as a scroll-driven scene, with the camera gliding between waypoints as you scroll through each section.

**Live site:** _add your Vercel URL here_

---

## ✨ Features

- **Particle galaxy background** — 22,000 particles arranged into spiral arms, generated procedurally (no external assets), color-graded from core to edge.
- **Scroll-driven camera path** — the camera eases between predefined waypoints as you scroll, so each section feels like a different vantage point in the same 3D space.
- **Mouse parallax** — subtle tilt on the galaxy as you move your cursor.
- **Floating 3D ornaments** — wireframe icosahedron, torus knot, octahedron, and torus shapes drift and spin through the scene.
- **Flip cards** — project cards rotate in 3D on hover (desktop) or tap (mobile) to reveal a longer description on the back.
- **Icon-based contact row** — GitHub, HuggingFace, LinkedIn, email, and phone as glass-style icon buttons.
- **Fully responsive**, no external icon libraries or heavy dependencies beyond `three`.

---

## 🛠 Tech Stack

- [Three.js](https://threejs.org/) — 3D rendering
- [Vite](https://vitejs.dev/) — build tool & dev server
- Vanilla JavaScript, HTML, CSS (no framework)

---

## 📁 Project Structure

```
galaxy-portfolio/
├── index.html          # page structure & content sections
├── src/
│   ├── main.js          # scene setup, scroll-camera, render loop
│   ├── galaxy.js         # particle galaxy, starfield & floating shapes
│   └── style.css         # design tokens, layout, flip-card & icon styles
├── public/
│   └── favicon.svg
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)

### Installation

```bash
git clone https://github.com/akshra09/-galaxy-portfolio.git
cd -galaxy-portfolio
npm install
```

### Development

```bash
npm run dev
```

Opens a local dev server (typically `http://localhost:5173`) with hot-reload.

### Production Build

```bash
npm run build
```

Outputs a static, deployable site to `dist/`.

---

## 🎨 Customization

- **Colors:** edit the CSS custom properties at the top of `src/style.css` (`--nebula-purple`, `--nebula-pink`, `--star-cyan`, etc.)
- **Galaxy shape:** tweak parameters passed to `createGalaxy()` in `src/main.js` — `count`, `branches`, `spin`, `radius`, `randomness`.
- **Content:** edit sections directly in `index.html` — hero text, about copy, project cards, skills, and contact links.
- **Contact info:** replace the placeholder values in the Signal section of `index.html` (`LINKEDIN_URL_HERE`, `YOUR_EMAIL_HERE`, `YOUR_PHONE_HERE`) with your real details.

---

## 📦 Deployment

This project deploys cleanly to [Vercel](https://vercel.com) or [Netlify](https://netlify.com) with zero configuration — both auto-detect Vite and use `npm run build` → `dist/` out of the box.

---

## 📄 License

Personal portfolio project — feel free to fork for your own use, but please swap out the content for your own.
