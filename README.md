# Portfolio (AI-assisted)

A personal portfolio website built iteratively with help from different AI tools. This repository will track the code, design decisions, and iterations as the site evolves from first draft to a polished, deployed portfolio.

## Tech stack

- TypeScript
- Angular (2+)
- Java
- Spring Boot
- React (this portfolio UI)
- Vite
- Ant Design
- React Router

## Getting started (pnpm)

```bash
corepack pnpm install
corepack pnpm dev
```

## Gemini Chat (optional)

Create `.env.local` from `.env.example` and set:

- `VITE_GEMINI_API_KEY`
- `VITE_GEMINI_MODEL` (optional, default: `gemini-2.5-flash`)

Build:

```bash
corepack pnpm build
corepack pnpm preview
```

## Deploy to Vercel

- **Framework**: Vite
- **Build command**: `corepack pnpm build`
- **Output directory**: `dist`

SPA routing (`react-router-dom`) is supported via `vercel.json` rewrites.

If/when you enable chat in production, add this environment variable in Vercel:

- `VITE_GEMINI_API_KEY`

## Planned features

- **Homepage**: short intro + featured projects
- **Cover Letter**: case studies with screenshots, tech stack, and links
- **Contact**: email + social links (and optional contact form)