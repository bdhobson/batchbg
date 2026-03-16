"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"

interface HeaderProps {
  showNewBatch?: boolean
  showDashboard?: boolean
  showBilling?: boolean
}

export function Header({ showNewBatch = false, showDashboard = false, showBilling = false }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">B</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">Backdrop</span>
        </Link>

        <div className="flex items-center gap-3">
          {showDashboard && (
            <Link href="/dashboard">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Dashboard
              </Button>
            </Link>
          )}
          {showBilling && (
            <Link href="/billing">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Billing
              </Button>
            </Link>
          )}
          {showNewBatch && (
            <Link href="/new">
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                New Batch
              </Button>
            </Link>
          )}
          <UserButton />
        </div>
      </div>
    </header>
  )
}
