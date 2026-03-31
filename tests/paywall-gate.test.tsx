/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PaywallGate from "../src/components/PaywallGate";

// Mock sessionStorage
const mockSessionStorage: Record<string, string> = {};
Object.defineProperty(window, "sessionStorage", {
  value: {
    getItem: jest.fn((key: string) => mockSessionStorage[key] ?? null),
    setItem: jest.fn((key: string, val: string) => { mockSessionStorage[key] = val; }),
    removeItem: jest.fn((key: string) => { delete mockSessionStorage[key]; }),
    clear: jest.fn(() => { Object.keys(mockSessionStorage).forEach(k => delete mockSessionStorage[k]); }),
  },
  writable: true,
});

// Mock fetch
global.fetch = jest.fn();

describe("PaywallGate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.sessionStorage.clear();
    Object.keys(mockSessionStorage).forEach(k => delete mockSessionStorage[k]);
  });

  it("shows locked state when no session token exists", async () => {
    render(
      <PaywallGate contentSlug="premium-guide">
        <p>Premium content</p>
      </PaywallGate>
    );

    await waitFor(() => {
      expect(screen.getByTestId("paywall-gate")).toBeInTheDocument();
    });

    expect(screen.queryByText("Premium content")).not.toBeInTheDocument();
  });

  it("shows children when session token is valid", async () => {
    // Stored token
    mockSessionStorage["mainlayer_session_premium-guide"] = "valid-token";

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ hasAccess: true }),
    });

    render(
      <PaywallGate contentSlug="premium-guide">
        <p>Premium content</p>
      </PaywallGate>
    );

    await waitFor(() => {
      expect(screen.getByText("Premium content")).toBeInTheDocument();
    });
  });

  it("shows locked state when token is invalid", async () => {
    mockSessionStorage["mainlayer_session_premium-guide"] = "bad-token";

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ hasAccess: false }),
    });

    render(
      <PaywallGate contentSlug="premium-guide">
        <p>Premium content</p>
      </PaywallGate>
    );

    await waitFor(() => {
      expect(screen.getByTestId("paywall-gate")).toBeInTheDocument();
    });
  });

  it("shows preview text when provided", async () => {
    render(
      <PaywallGate contentSlug="premium-guide" preview="This is a preview of the content...">
        <p>Premium content</p>
      </PaywallGate>
    );

    await waitFor(() => {
      expect(screen.getByText("This is a preview of the content...")).toBeInTheDocument();
    });
  });

  it("unlocks content after successful payment", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => ({ success: true, sessionToken: "new-token" }),
      });

    render(
      <PaywallGate contentSlug="premium-guide">
        <p>Premium content</p>
      </PaywallGate>
    );

    await waitFor(() => screen.getByTestId("paywall-gate"));

    fireEvent.click(screen.getByText("Unlock with Mainlayer"));

    await waitFor(() => {
      expect(screen.getByText("Premium content")).toBeInTheDocument();
    });
  });

  it("shows error message when payment fails", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => ({ success: false, error: "Payment declined" }),
      });

    render(
      <PaywallGate contentSlug="premium-guide">
        <p>Premium content</p>
      </PaywallGate>
    );

    await waitFor(() => screen.getByTestId("paywall-gate"));

    fireEvent.click(screen.getByText("Unlock with Mainlayer"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Payment declined");
    });
  });
});
