# Portfolio (AI-assisted)

A personal portfolio website built iteratively with help from different AI tools. This repository tracks the code, design decisions, and iterations as the site evolves from first draft to a polished, deployed portfolio.

## Tech stack

This portfolio UI is built with:

- React 19 + TypeScript
- Vite
- Ant Design (theming via `ConfigProvider`)
- React Router

> The skills surfaced in the site itself (Angular, Java, Spring Boot, …) describe Elen's professional experience, not the stack of this repository.

## Getting started (pnpm)

```bash
corepack pnpm install
corepack pnpm dev
```

## Environment variables

Create `.env.local` from `.env.example`. Everything here uses the `VITE_` prefix and is bundled into the client — values are visible to anyone who opens DevTools on the deployed site. Use only API keys you're comfortable rotating, and rotate them if a deployment leaks them.

- `VITE_GEMINI_API_KEY` — required for the chat feature
- `VITE_GEMINI_MODEL` (optional, default: `gemini-2.5-flash`)
- `VITE_DID_API_KEY` — required for the D-ID avatar feature
- `VITE_DID_SOURCE_URL` — a public portrait URL passed to D-ID
- `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_CV_PATH`, `VITE_GITHUB_PROFILE`, `VITE_LINKED_IN_PROFILE`

## Build

```bash
corepack pnpm build
corepack pnpm preview
```

## Deploy to Vercel

- **Framework**: Vite
- **Install command**: `corepack pnpm install`
- **Build command**: `corepack pnpm build`
- **Output directory**: `dist`

Set the `VITE_*` variables in your Vercel project settings. SPA routing (`react-router-dom`) is supported via `vercel.json` rewrites.

## Planned features

- **Homepage**: short intro + featured projects
- **Cover Letter**: case studies with screenshots, tech stack, and links
- **Contact**: email + social links (and optional contact form)
