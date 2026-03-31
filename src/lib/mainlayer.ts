import { MainlayerClient } from "@mainlayer/sdk";

let _client: MainlayerClient | null = null;

function getClient(): MainlayerClient {
  if (!_client) {
    const apiKey = process.env.MAINLAYER_API_KEY;
    if (!apiKey) {
      throw new Error("MAINLAYER_API_KEY environment variable is not set");
    }
    _client = new MainlayerClient({ apiKey });
  }
  return _client;
}

export interface UnlockResult {
  success: boolean;
  sessionToken?: string;
  expiresAt?: Date;
  error?: string;
}

export interface AccessCheckResult {
  hasAccess: boolean;
  contentSlug: string;
}

/**
 * Create a payment session for unlocking premium content.
 * Returns a session token valid for 24 hours.
 */
export async function createUnlockSession(contentSlug: string): Promise<UnlockResult> {
  try {
    const client = getClient();
    const resourceId = process.env.MAINLAYER_RESOURCE_ID;
    if (!resourceId) {
      throw new Error("MAINLAYER_RESOURCE_ID is not set");
    }

    const session = await client.resources.createSession({
      resourceId,
      metadata: { contentSlug },
    });

    return {
      success: true,
      sessionToken: session.token,
      expiresAt: session.expiresAt ? new Date(session.expiresAt) : undefined,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to create unlock session",
    };
  }
}

/**
 * Verify that a session token grants access to a given content slug.
 */
export async function verifyAccess(
  sessionToken: string,
  contentSlug: string
): Promise<AccessCheckResult> {
  try {
    const client = getClient();
    const result = await client.sessions.verify({
      token: sessionToken,
      metadata: { contentSlug },
    });

    return {
      hasAccess: result.valid,
      contentSlug,
    };
  } catch {
    return { hasAccess: false, contentSlug };
  }
}

/**
 * Consume one credit to unlock content (pay-per-read model).
 */
export async function consumeAccess(sessionToken: string, contentSlug: string): Promise<boolean> {
  try {
    const client = getClient();
    const resourceId = process.env.MAINLAYER_RESOURCE_ID;
    if (!resourceId) return false;

    await client.resources.consume({
      resourceId,
      quantity: 1,
      token: sessionToken,
      metadata: { contentSlug },
    });

    return true;
  } catch {
    return false;
  }
}
