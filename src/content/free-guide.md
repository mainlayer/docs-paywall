# Getting Started Guide

Welcome! This guide is free and available to everyone.

## Introduction

This documentation template shows how to gate premium content using Mainlayer.
Free sections like this one are accessible to all visitors.

## Basic Concepts

### What is Mainlayer?

Mainlayer is a payment infrastructure that lets you accept payments for
digital products, APIs, and content without writing billing code.

### How the Paywall Works

1. Visitors can read free content immediately
2. Premium sections show a paywall gate
3. Visitors click "Unlock" and complete payment via Mainlayer
4. A session token is issued and stored client-side
5. Premium content renders for the duration of the session

## Installation

```bash
npm install @mainlayer/sdk
```

## Basic Setup

```typescript
import { MainlayerClient } from "@mainlayer/sdk";

const client = new MainlayerClient({
  apiKey: process.env.MAINLAYER_API_KEY,
});
```

## Next Steps

Continue to the [Premium Guide](/docs/premium-guide) to learn advanced
patterns (requires a license).
