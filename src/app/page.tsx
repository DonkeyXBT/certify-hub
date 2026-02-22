import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, CheckCircle, BarChart3, FileText } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Shield className="h-6 w-6" />
            CertifyHub
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            ISO Certification
            <br />
            <span className="text-primary">Made Simple</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            CertifyHub is the all-in-one GRC platform for managing ISO 27001 and ISO 9001
            certifications. Streamline compliance, manage risks, and ace your audits.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/register">Start free trial</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </section>

        <section className="border-t bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Shield, title: "Framework Management", description: "Built-in ISO 27001:2022 and ISO 9001:2015 frameworks with all clauses and controls." },
                { icon: BarChart3, title: "Risk Management", description: "5x5 risk matrix, risk register, treatment plans, and control mapping." },
                { icon: CheckCircle, title: "Audit Management", description: "Plan audits, auto-generate checklists, record findings, track remediation." },
                { icon: FileText, title: "Document Control", description: "Version tracking, approval workflows, and review cycle management." },
              ].map((feature) => (
                <div key={feature.title} className="rounded-lg border bg-background p-6">
                  <feature.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} CertifyHub. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
