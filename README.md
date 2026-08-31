# Ankit Raj — Portfolio

Personal portfolio site built from scratch with plain **HTML, CSS and JavaScript** — no framework, no build step.

**Live sections:** Hero · About · Skills · Projects · Education · Certificates · Achievements · Contact

## Features

- Responsive single-page layout (desktop → mobile)
- Light / dark theme toggle, remembered in `localStorage`
- Typing role animation, animated counters and scroll-reveal via `IntersectionObserver`
- Animated skill proficiency bars
- Timeline-style education journey with semester-wise coursework
- Contact form that composes a pre-filled email
- Accessible: skip link, keyboard-navigable menu, `prefers-reduced-motion` support

## Structure

```
index.html     — all page markup
styles.css     — design tokens, layout, components, responsive rules
script.js      — theme, nav, typing, counters, reveals, contact form
assets/        — profile photo + resume PDF
```

## Run locally

Open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000

## Deploy

Static site — deploy the repo root to GitHub Pages, Netlify or Vercel with no build command.

## Contact

- Email: ankitrajjgupta02@gmail.com
- LinkedIn: https://www.linkedin.com/in/ankitaj02/
- GitHub: https://github.com/Ankitrajofficial
