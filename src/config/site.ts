export const siteConfig = {
  name: "CertifyHub",
  description:
    "Multi-tenant GRC platform for ISO certification management. Streamline your compliance journey with gap assessments, risk management, document control, audit tracking, and more.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og.png",
  links: {
    docs: "/docs",
    support: "/support",
  },
  creator: "CertifyHub",
  keywords: [
    "ISO 27001",
    "ISO 9001",
    "ISO 14001",
    "GRC",
    "compliance",
    "certification",
    "risk management",
    "audit management",
    "document control",
    "information security",
    "ISMS",
  ],
} as const

export type SiteConfig = typeof siteConfig
