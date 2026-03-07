"use client"

import { Check, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export type BackgroundOption = "white" | "transparent" | "custom"

interface BackgroundOptionsProps {
  selected: BackgroundOption
  onSelect: (option: BackgroundOption) => void
}

const options: { value: BackgroundOption; label: string; premium?: boolean }[] = [
  { value: "white", label: "White" },
  { value: "transparent", label: "Transparent" },
  { value: "custom", label: "Custom", premium: true },
]

export function BackgroundOptions({ selected, onSelect }: BackgroundOptionsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">Background Output</h3>
      <div className="grid grid-cols-3 gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={cn(
              "relative flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3.5 text-sm font-medium transition-all",
              selected === option.value
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-card-foreground hover:border-muted-foreground hover:bg-secondary"
            )}
          >
            {selected === option.value && (
              <Check className="h-4 w-4" />
            )}
            {option.premium && selected !== option.value && (
              <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
