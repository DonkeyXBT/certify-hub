"use client"

interface OrgBrandStylesProps {
  primaryColor?: string | null
}

export function OrgBrandStyles({ primaryColor }: OrgBrandStylesProps) {
  if (!primaryColor) return null

  return (
    <style>{`
      :root {
        --primary: ${primaryColor};
        --sidebar-primary: ${primaryColor};
      }
    `}</style>
  )
}
