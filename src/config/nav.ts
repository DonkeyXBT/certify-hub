import {
  LayoutDashboard,
  Shield,
  ClipboardCheck,
  AlertTriangle,
  Lock,
  FileText,
  Search,
  FileCheck,
  CheckSquare,
  Table,
  Wrench,
  GraduationCap,
  BarChart3,
  Settings,
} from "lucide-react"
import type { NavGroup } from "@/types"

export function getNavItems(orgSlug: string): NavGroup[] {
  return [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          href: `/org/${orgSlug}`,
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Compliance",
      items: [
        {
          title: "Frameworks",
          href: `/org/${orgSlug}/frameworks`,
          icon: Shield,
        },
        {
          title: "Assessments",
          href: `/org/${orgSlug}/assessments`,
          icon: ClipboardCheck,
        },
        {
          title: "SoA",
          href: `/org/${orgSlug}/soa`,
          icon: Table,
          description: "Statement of Applicability",
        },
        {
          title: "Controls",
          href: `/org/${orgSlug}/controls`,
          icon: Lock,
        },
      ],
    },
    {
      title: "Risk & Audit",
      items: [
        {
          title: "Risk Register",
          href: `/org/${orgSlug}/risks`,
          icon: AlertTriangle,
        },
        {
          title: "Audits",
          href: `/org/${orgSlug}/audits`,
          icon: Search,
        },
        {
          title: "CAPA",
          href: `/org/${orgSlug}/capa`,
          icon: Wrench,
          description: "Corrective & Preventive Actions",
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          title: "Documents",
          href: `/org/${orgSlug}/documents`,
          icon: FileText,
        },
        {
          title: "Evidence",
          href: `/org/${orgSlug}/evidence`,
          icon: FileCheck,
        },
        {
          title: "Tasks",
          href: `/org/${orgSlug}/tasks`,
          icon: CheckSquare,
        },
        {
          title: "Training",
          href: `/org/${orgSlug}/training`,
          icon: GraduationCap,
        },
      ],
    },
    {
      title: "Analytics",
      items: [
        {
          title: "Reports",
          href: `/org/${orgSlug}/reports`,
          icon: BarChart3,
        },
      ],
    },
    {
      title: "Administration",
      items: [
        {
          title: "Settings",
          href: `/org/${orgSlug}/settings`,
          icon: Settings,
          minRole: "ADMIN",
        },
      ],
    },
  ]
}
