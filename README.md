# Ironfeast — Static site scaffold

This repository contains a minimal static scaffold for Ironfeast.tv intended for Netlify hosting.

Quick start

1. Install dev deps:

```powershell
npm install
```

2. Local dev with Astro:

```powershell
npm run dev
```

3. Build for Netlify (produces `dist/`):

```powershell
npm run build
```

4. Run Netlify local dev (functions):

```powershell
npm run start:netlify
```

Deployment: connect this repo to Netlify and ensure `publish` is `dist` (see `netlify.toml`).

Files added / changed

- `src/pages/` — Astro pages (home, gaming, labs, blog)
- `src/layouts/BaseLayout.astro` — base layout used by pages
- `astro.config.mjs` — Astro configuration with Netlify Functions adapter
- `tsconfig.json` — TypeScript config for Astro
- `package.json` — updated with Astro scripts and deps
- `netlify/functions/hello.js` — example serverless function (kept)
- `public/` — static assets (CSS/JS) are still served as-is
