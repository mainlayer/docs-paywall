# docs-paywall

[![CI](https://github.com/mainlayer/docs-paywall/actions/workflows/ci.yml/badge.svg)](https://github.com/mainlayer/docs-paywall/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Next.js documentation site with **gated premium articles** powered by [Mainlayer](https://mainlayer.fr). Free articles are public; premium articles show a clean paywall until purchase. Build an audience with free content, monetize with premium deep-dives.

## 5-Minute Setup

### 1. Clone and install

```bash
git clone https://github.com/mainlayer/docs-paywall
cd docs-paywall
npm install
```

### 2. Set up Mainlayer

Create a Mainlayer account at [mainlayer.fr](https://mainlayer.fr):
- Create a resource
- Copy API key and Resource ID

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```bash
MAINLAYER_API_KEY=ml_live_xxxxxxxxxxxxx
MAINLAYER_RESOURCE_ID=res_xxxxxxxxxxxxx
```

### 4. Run locally

```bash
npm run dev
# Visit:
# - http://localhost:3000/docs/free-guide (public)
# - http://localhost:3000/docs/premium-guide (gated)
```

## Adding Gated Articles

### 1. Create markdown file

Add a new article to `src/content/`:

```markdown
# Advanced Techniques

This is premium content...
```

### 2. Gate it (one line of code)

In `src/app/docs/[slug]/page.tsx`, add to `PREMIUM_SLUGS`:

```typescript
const PREMIUM_SLUGS = new Set([
  "premium-guide",
  "advanced-techniques"  // ← Add here
]);
```

### 3. Done

The `<PaywallGate>` component:
- Checks if article is in `PREMIUM_SLUGS`
- Shows paywall if yes
- Stores token in sessionStorage
- Renders article if token valid

Free articles have zero overhead.

## Architecture

### Flow diagram

```
Visitor navigates to /docs/premium-guide

1. page.tsx checks PREMIUM_SLUGS
   ├─ If not premium → render normally
   └─ If premium → wrap with <PaywallGate>

2. PaywallGate (client-side)
   ├─ Check sessionStorage for auth token
   ├─ Token valid? → show article
   └─ No token? → show paywall UI

3. User clicks "Unlock"
   ├─ POST /api/unlock
   ├─ Server creates Mainlayer session
   ├─ Token returned to client
   ├─ Stored in sessionStorage
   └─ Article renders

4. Token expires
   ├─ After 24 hours, shows paywall again
   └─ User clicks "Refresh" to get new token
```

### File structure

```
src/
├── app/
│   ├── layout.tsx                    # Nav bar
│   ├── docs/[slug]/page.tsx          # Article loader
│   └── api/unlock/route.ts           # Payment session API
├── components/
│   └── PaywallGate.tsx               # Paywall UI component
├── lib/
│   └── mainlayer.ts                  # Mainlayer SDK
└── content/
    ├── free-guide.md                 # Free articles
    └── premium-guide.md              # Gated articles
```

## Monetization Model

| Visitor Type | Experience | You Earn |
|--------------|-----------|----------|
| Free article reader | Full access | Nothing |
| Premium article interest | Sees paywall | $5-$500 per unlock |
| Subscriber | Monthly access | Recurring revenue |

## Deployment

### Vercel (recommended)

```bash
npx vercel
# Set MAINLAYER_API_KEY and MAINLAYER_RESOURCE_ID in dashboard
```

### Docker / Self-hosted

```bash
npm run build
npm run start
# Set env vars before starting
```

### Environment variables

Set these in your hosting platform:
- `MAINLAYER_API_KEY`
- `MAINLAYER_RESOURCE_ID`

No secrets stored in source code.
