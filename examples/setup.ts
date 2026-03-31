/**
 * Example: Setting up docs-paywall
 *
 * This file shows the configuration needed to add a paywall
 * to your Next.js documentation site.
 */

// 1. Environment variables required:
//
//    MAINLAYER_API_KEY=mlk_xxxxxxxxxxxxxxxx
//    MAINLAYER_RESOURCE_ID=res_xxxxxxxxxxxxxxxx
//
// Set these in .env.local for development and in your hosting
// provider's environment settings for production.

// 2. Mark content as premium in src/app/docs/[slug]/page.tsx:
//
//    const PREMIUM_SLUGS = new Set([
//      "advanced-guide",
//      "enterprise-patterns",
//      "performance-deep-dive",
//    ]);

// 3. Create a resource on mainlayer.fr:
//    - Set a price (e.g. $9.99 one-time or $4.99/month)
//    - Copy the resource ID to MAINLAYER_RESOURCE_ID

// 4. Add more content files to src/content/:
//    - Free content: src/content/getting-started.md
//    - Premium content: src/content/advanced-guide.md  ← add slug to PREMIUM_SLUGS

// 5. Customize the PaywallGate component for your brand:
//    - Edit src/components/PaywallGate.tsx
//    - Update the unlock button style, copy, and pricing message

// 6. Deploy and test:
//    npm run build && npm start

export {};
