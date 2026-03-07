"use client"

import { ArrowRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface UsageCardProps {
  used: number
  total: number
  month: string
  plan: string
}

export function UsageCard({ used, total, month, plan }: UsageCardProps) {
  const percentage = (used / total) * 100

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Usage This Month</h2>
          <p className="text-sm text-muted-foreground">{month}</p>
        </div>
        <span className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          {plan}
        </span>
      </div>

      <div className="mt-6">
        <div className="flex items-baseline justify-between">
          <span className="text-4xl font-bold tracking-tight text-card-foreground">{used}</span>
          <span className="text-sm text-muted-foreground">{total} included</span>
        </div>

        <div className="mt-4">
          <Progress value={percentage} className="h-1.5 bg-secondary" />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {used} of {total} images processed
          </span>
          <button className="flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground">
            Upgrade plan
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
