"use client"

import Link from "next/link"
import { Progress } from "@/components/ui/progress"

interface UsageCardProps {
  used: number
  total: number
  month: string
  plan: string
  isFreeTrial?: boolean
}

export function UsageCard({ used, total, month, plan, isFreeTrial }: UsageCardProps) {
  const percentage = Math.min((used / total) * 100, 100)
  const remaining = total - used

  return (
    <div className="rounded-xl border border-border bg-card px-5 py-3">
      <div className="flex items-center gap-4">
        <span className="shrink-0 rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
          {plan}
        </span>
        <div className="flex-1 min-w-0">
          <Progress value={percentage} className="h-1.5 bg-secondary" />
        </div>
        <span className="shrink-0 text-sm text-muted-foreground whitespace-nowrap">
          <span className="font-semibold text-foreground">{used.toLocaleString()}</span> / {total.toLocaleString()} · {month}
        </span>
        {isFreeTrial && remaining <= 2 && (
          <Link
            href="/billing"
            className="shrink-0 text-sm font-medium text-foreground underline underline-offset-2 hover:text-muted-foreground whitespace-nowrap"
          >
            Upgrade
          </Link>
        )}
      </div>
    </div>
  )
}
