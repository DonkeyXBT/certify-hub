"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface GapChartsProps {
  assessment: any
}

const STATUS_COLORS: Record<string, string> = {
  COMPLIANT: "#22c55e",
  PARTIALLY_COMPLIANT: "#eab308",
  NON_COMPLIANT: "#ef4444",
  NOT_ASSESSED: "#9ca3af",
}

export function GapCharts({ assessment }: GapChartsProps) {
  const statusCounts = assessment.responses.reduce(
    (acc: Record<string, number>, r: any) => {
      acc[r.complianceStatus] = (acc[r.complianceStatus] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const pieData = Object.entries(statusCounts).map(([name, value]) => ({
    name: name.replace(/_/g, " "),
    value,
    color: STATUS_COLORS[name] || "#6b7280",
  }))

  const clauseMaturity = assessment.responses
    .filter((r: any) => r.clause && r.maturityLevel)
    .reduce(
      (acc: Record<string, { clause: string; total: number; count: number }>, r: any) => {
        const key = r.clause!.number
        if (!acc[key]) acc[key] = { clause: key, total: 0, count: 0 }
        acc[key].total += r.maturityLevel!
        acc[key].count += 1
        return acc
      },
      {} as Record<string, { clause: string; total: number; count: number }>
    )

  const barData = Object.values(clauseMaturity as Record<string, { clause: string; total: number; count: number }>)
    .map((c) => ({ clause: c.clause, maturity: Math.round((c.total / c.count) * 10) / 10 }))
    .sort((a, b) => a.clause.localeCompare(b.clause, undefined, { numeric: true }))

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Compliance Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Average Maturity by Clause</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="clause" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="maturity" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {assessment.overallScore !== null && (
        <Card className="md:col-span-2">
          <CardContent className="pt-6 text-center">
            <div className="text-4xl font-bold">{Math.round(assessment.overallScore)}%</div>
            <p className="text-sm text-muted-foreground mt-1">Overall Compliance Score</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
