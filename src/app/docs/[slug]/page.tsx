import { notFound } from "next/navigation";
import * as fs from "fs";
import * as path from "path";
import PaywallGate from "@/components/PaywallGate";
import React from "react";

const CONTENT_DIR = path.join(process.cwd(), "src/content");

const PREMIUM_SLUGS = new Set(["premium-guide"]);

interface PageProps {
  params: { slug: string };
}

function parseMarkdown(content: string): { title: string; body: string } {
  const lines = content.split("\n");
  const titleLine = lines.find((l) => l.startsWith("# "));
  const title = titleLine ? titleLine.replace(/^# /, "") : "Untitled";
  const body = content.replace(/^# .+\n/, "").trim();
  return { title, body };
}

// Very simple markdown-to-html (replace with a proper parser in production)
function markdownToHtml(md: string): string {
  return md
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/```[\w]*\n([\s\S]+?)```/g, "<pre><code>$1</code></pre>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^- \[ \] (.+)$/gm, "<li>☐ $1</li>")
    .replace(/^- \[x\] (.+)$/gm, "<li>☑ $1</li>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[h|l|p|u|o|c|b|s])/gm, "");
}

export default function DocsPage({ params }: PageProps) {
  const { slug } = params;

  // Sanitize slug
  const safeSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "");
  if (safeSlug !== slug) notFound();

  const filePath = path.join(CONTENT_DIR, `${safeSlug}.md`);

  let rawContent: string;
  try {
    rawContent = fs.readFileSync(filePath, "utf-8");
  } catch {
    notFound();
  }

  const { title, body } = parseMarkdown(rawContent);
  const html = markdownToHtml(body);
  const isPremium = PREMIUM_SLUGS.has(safeSlug);

  const preview = isPremium
    ? body.split("\n").slice(0, 3).join("\n")
    : undefined;

  const content = (
    <article>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );

  if (isPremium) {
    return (
      <PaywallGate contentSlug={safeSlug} preview={preview}>
        {content}
      </PaywallGate>
    );
  }

  return content;
}

export async function generateStaticParams() {
  const files = fs.readdirSync(CONTENT_DIR);
  return files
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ slug: f.replace(".md", "") }));
}
