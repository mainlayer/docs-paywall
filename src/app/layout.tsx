import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Docs — Powered by Mainlayer",
  description: "Documentation with free and premium sections",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            color: #1a1a1a;
            line-height: 1.6;
          }
          nav { margin-bottom: 2rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 1rem; }
          nav a { margin-right: 1.5rem; text-decoration: none; color: #6366f1; }
          .paywall-gate {
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 2rem;
            text-align: center;
            background: linear-gradient(135deg, #f9fafb 0%, #f0f4ff 100%);
          }
          .paywall-preview { position: relative; overflow: hidden; max-height: 200px; }
          .paywall-fade {
            position: absolute; bottom: 0; left: 0; right: 0;
            height: 80px;
            background: linear-gradient(transparent, #f9fafb);
          }
          .paywall-cta h3 { margin-top: 1rem; font-size: 1.25rem; }
          .paywall-unlock-btn {
            background: #6366f1; color: white; border: none;
            padding: 0.75rem 2rem; border-radius: 8px; font-size: 1rem;
            cursor: pointer; margin-top: 1rem;
          }
          .paywall-unlock-btn:hover { background: #4f46e5; }
          .paywall-unlock-btn:disabled { opacity: 0.6; cursor: not-allowed; }
          .paywall-footer { font-size: 0.8rem; color: #6b7280; margin-top: 1rem; }
          .paywall-error { color: #ef4444; font-size: 0.9rem; }
          .paywall-loading { color: #6b7280; padding: 1rem; text-align: center; }
        `}</style>
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
          <a href="/docs/free-guide">Free Guide</a>
          <a href="/docs/premium-guide">Premium Guide</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
