export const siteConfig = {
  name: "Certifi by Cyfenced",
  description:
    "GRC platform for ISO certification management by Cyfenced. Streamline your compliance journey with gap assessments, risk management, document control, audit tracking, and more.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://gcrtool.cyfenced.nl",
  ogImage: "/og.png",
  links: {
    docs: "/docs",
    support: "/support",
  },
  creator: "Cyfenced",
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
