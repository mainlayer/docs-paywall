# docs-paywall

[![CI](https://github.com/mainlayer/docs-paywall/actions/workflows/ci.yml/badge.svg)](https://github.com/mainlayer/docs-paywall/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Next.js documentation site with **gated premium content** powered by [Mainlayer](https://mainlayer.fr).

Free sections are public. Premium sections show a paywall gate until the reader pays.

## Quick Start

```bash
npm install
cp .env.example .env.local
# Add your MAINLAYER_API_KEY and MAINLAYER_RESOURCE_ID
npm run dev
```

Visit `http://localhost:3000/docs/free-guide` (free) and `http://localhost:3000/docs/premium-guide` (paywalled).

## Environment Variables

```bash
MAINLAYER_API_KEY=mlk_xxxxxxxxxxxxxxxx
MAINLAYER_RESOURCE_ID=res_xxxxxxxxxxxxxxxx
```

## Adding Premium Content

1. Create a markdown file in `src/content/my-article.md`
2. Add the slug to `PREMIUM_SLUGS` in `src/app/docs/[slug]/page.tsx`:
   ```typescript
   const PREMIUM_SLUGS = new Set(["premium-guide", "my-article"]);
   ```
3. Done — the `PaywallGate` component handles the rest.

## How It Works

```
Visitor → /docs/premium-guide
  → page.tsx checks PREMIUM_SLUGS
  → wraps content in <PaywallGate>
  → PaywallGate checks sessionStorage for token
  → No token: shows paywall UI
  → User clicks "Unlock" → POST /api/unlock (action=create)
  → Server calls Mainlayer to create a payment session
  → Token stored in sessionStorage
  → Content renders
```

## Architecture

```
src/
├── app/
│   ├── layout.tsx                  # Root layout with nav
│   ├── docs/[slug]/page.tsx        # Doc page with paywall logic
│   └── api/unlock/route.ts         # Mainlayer payment API
├── components/
│   └── PaywallGate.tsx             # Client-side paywall component
├── lib/
│   └── mainlayer.ts                # Mainlayer SDK wrapper
└── content/
    ├── free-guide.md               # Free content
    └── premium-guide.md            # Gated premium content
```

## Deploy

Works with any Next.js host (Vercel, Netlify, etc.). Set environment variables in your hosting dashboard.

Get your API key at [mainlayer.fr](https://mainlayer.fr).
