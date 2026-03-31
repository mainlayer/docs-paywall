"use client";

import React, { useState, useEffect } from "react";

interface PaywallGateProps {
  contentSlug: string;
  preview?: string;
  children: React.ReactNode;
}

interface UnlockState {
  status: "checking" | "locked" | "unlocked" | "error";
  error?: string;
}

const SESSION_KEY = "mainlayer_session";

export default function PaywallGate({ contentSlug, preview, children }: PaywallGateProps) {
  const [state, setState] = useState<UnlockState>({ status: "checking" });

  useEffect(() => {
    const storedToken = sessionStorage.getItem(`${SESSION_KEY}_${contentSlug}`);
    if (storedToken) {
      // Verify stored token
      fetch(`/api/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", token: storedToken, contentSlug }),
      })
        .then((r) => r.json())
        .then((data) => {
          setState({ status: data.hasAccess ? "unlocked" : "locked" });
        })
        .catch(() => setState({ status: "locked" }));
    } else {
      setState({ status: "locked" });
    }
  }, [contentSlug]);

  const handleUnlock = async () => {
    setState({ status: "checking" });

    try {
      const res = await fetch(`/api/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", contentSlug }),
      });

      const data = await res.json();

      if (data.success && data.sessionToken) {
        // In a real flow: redirect to Mainlayer payment page
        // Here we simulate a successful payment for demo purposes
        sessionStorage.setItem(`${SESSION_KEY}_${contentSlug}`, data.sessionToken);
        setState({ status: "unlocked" });
      } else {
        setState({ status: "error", error: data.error || "Payment failed" });
      }
    } catch (err) {
      setState({ status: "error", error: "Network error. Please try again." });
    }
  };

  if (state.status === "checking") {
    return (
      <div className="paywall-loading" aria-busy="true">
        <span>Checking access...</span>
      </div>
    );
  }

  if (state.status === "unlocked") {
    return <>{children}</>;
  }

  return (
    <div className="paywall-gate" data-testid="paywall-gate">
      {preview && (
        <div className="paywall-preview">
          <p>{preview}</p>
          <div className="paywall-fade" aria-hidden="true" />
        </div>
      )}

      <div className="paywall-cta">
        <div className="paywall-lock-icon" aria-hidden="true">🔒</div>
        <h3>Premium Content</h3>
        <p>Unlock full access to continue reading.</p>

        {state.status === "error" && (
          <p className="paywall-error" role="alert">
            {state.error}
          </p>
        )}

        <button
          className="paywall-unlock-btn"
          onClick={handleUnlock}
          disabled={state.status === "checking"}
        >
          Unlock with Mainlayer
        </button>

        <p className="paywall-footer">
          Powered by{" "}
          <a href="https://mainlayer.fr" target="_blank" rel="noopener noreferrer">
            Mainlayer
          </a>
        </p>
      </div>
    </div>
  );
}
