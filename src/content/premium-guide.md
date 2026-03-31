# Advanced Integration Guide

*This content is gated behind a Mainlayer paywall.*

## Advanced Patterns

### Webhook Integration

Set up webhooks to sync payment events with your database:

```typescript
// pages/api/webhooks/mainlayer.ts
export async function POST(req: Request) {
  const event = await req.json();

  switch (event.type) {
    case "payment.completed":
      await db.users.update({
        where: { email: event.customer.email },
        data: { premiumUntil: event.expiresAt },
      });
      break;
  }
}
```

### Per-Article Pricing

Different prices for different content sections:

```typescript
const CONTENT_PRICES = {
  "advanced-typescript": 4.99,
  "performance-deep-dive": 9.99,
  "architecture-patterns": 14.99,
};
```

### Team Licenses

Allow organizations to purchase access for their entire team:

```typescript
const session = await client.resources.createSession({
  resourceId,
  seats: teamSize,
  metadata: { contentSlug, orgId },
});
```

### Analytics

Track which premium sections drive the most conversions:

```typescript
await client.events.track({
  event: "content_unlocked",
  properties: { slug: contentSlug, referrer: document.referrer },
});
```

## Production Checklist

- [ ] Set `MAINLAYER_API_KEY` in environment
- [ ] Configure webhook endpoint
- [ ] Set up content access expiry
- [ ] Add rate limiting to `/api/unlock`
- [ ] Test with Mainlayer test mode keys
- [ ] Monitor via Mainlayer dashboard at mainlayer.fr
