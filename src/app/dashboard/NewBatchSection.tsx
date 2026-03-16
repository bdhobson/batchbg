"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Dropzone } from "@/components/dropzone"
import { BackgroundOptions, type BackgroundOption } from "@/components/background-options"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"

interface NewBatchSectionProps {
  planLimitReached: boolean
}

export function NewBatchSection({ planLimitReached }: NewBatchSectionProps) {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [backgroundOption, setBackgroundOption] = useState<BackgroundOption>("white")
  const [customColor, setCustomColor] = useState("#ffffff")
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(planLimitReached)

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles)
    setErrorMessage(null)
    if (!planLimitReached) setShowUpgradePrompt(false)
  }

  const handleProcess = async () => {
    if (files.length === 0) return
    setIsProcessing(true)
    setErrorMessage(null)
    try {
      const formData = new FormData()
      formData.append("outputType", backgroundOption)
      if (backgroundOption === "custom") formData.append("outputColor", customColor)
      files.forEach((f) => formData.append("images", f))

      const res = await fetch("/api/jobs", { method: "POST", body: formData })
      const data = await res.json()

      if (data.jobId) {
        router.push(`/processing/${data.jobId}`)
        return
      }

      if (data.error === "plan_limit_reached" || data.error === "plan_limit_would_exceed") {
        setShowUpgradePrompt(true)
        return
      }

      setErrorMessage(data.message || "Something went wrong. Please try again.")
    } catch (err) {
      console.error(err)
      setErrorMessage("Upload failed. Check your connection and try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-5">
      <Dropzone files={files} onFilesChange={handleFilesChange} />

      <BackgroundOptions selected={backgroundOption} onSelect={setBackgroundOption} />

      {backgroundOption === "custom" && (
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
          <input
            type="color"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent"
          />
          <span className="text-sm text-muted-foreground font-mono">{customColor}</span>
          <span className="text-sm text-muted-foreground">Custom background color</span>
        </div>
      )}

      {showUpgradePrompt && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 px-4 py-3">
          <p className="text-sm font-medium text-amber-900 dark:text-amber-200">You&apos;ve reached your plan limit</p>
          <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">Upgrade to process more images this month.</p>
          <Link href="/billing" className="inline-block mt-2 text-sm font-medium text-amber-900 dark:text-amber-200 underline underline-offset-2">
            Manage billing
          </Link>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
          <p className="text-sm text-destructive">{errorMessage}</p>
        </div>
      )}

      <Button
        onClick={handleProcess}
        disabled={files.length === 0 || isProcessing || showUpgradePrompt}
        className="w-full py-6 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-secondary disabled:text-muted-foreground"
      >
        {isProcessing ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading {files.length} image{files.length !== 1 ? "s" : ""}...</>
        ) : files.length > 0 ? (
          <><Sparkles className="mr-2 h-4 w-4" />Process {files.length} image{files.length !== 1 ? "s" : ""}</>
        ) : (
          "Select images to process"
        )}
      </Button>
    </div>
  )
}
