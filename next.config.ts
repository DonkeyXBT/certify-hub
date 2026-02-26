import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent MIME type sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Clickjacking protection — also reinforced by CSP frame-ancestors below
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Limit referrer information sent to other origins
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Disable browser features this app doesn't use
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=()",
  },
  // Force HTTPS for 2 years (including subdomains) — only meaningful in production
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Content Security Policy
  // Notes:
  //   - 'unsafe-inline' for scripts is required by Next.js App Router hydration (no nonce strategy in use)
  //   - 'unsafe-inline' for styles is required by Tailwind CSS v4
  //   - va.vercel-scripts.com serves the Vercel Analytics script
  //   - vitals.vercel-insights.com receives Vercel Analytics beacon data
  //   - img-src allows https: broadly because user avatars and org logos may be hosted externally
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self'",
      "connect-src 'self' https://vitals.vercel-insights.com",
      "frame-src 'none'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
