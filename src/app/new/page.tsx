"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { Header } from "@/components/header"
import { Dropzone } from "@/components/dropzone"
import { BackgroundOptions, type BackgroundOption } from "@/components/background-options"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"

interface TrialStatus {
  used: number
  limit: number
  remaining: number
  exhausted: boolean
}

export default function NewBatchPage() {
  const router = useRouter()
  const { isSignedIn } = useUser()
  const [files, setFiles] = useState<File[]>([])
  const [backgroundOption, setBackgroundOption] = useState<BackgroundOption>("white")
  const [customColor, setCustomColor] = useState("#ffffff")
  const [isProcessing, setIsProcessing] = useState(false)
  const [trial, setTrial] = useState<TrialStatus | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  useEffect(() => {
    if (!isSignedIn) {
      fetch("/api/trial").then((r) => r.json()).then(setTrial).catch(() => {})
    }
  }, [isSignedIn])

  const trialExhausted = !isSignedIn && trial?.exhausted

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles)
    setErrorMessage(null)
    setShowUpgradePrompt(false)
  }

  const handleProcess = async () => {
    if (files.length === 0) return
    setIsProcessing(true)
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

      // Handle specific error cases with inline UI
      if (data.error === "plan_limit_reached" || data.error === "plan_limit_would_exceed" ||
          data.error === "free_trial_exhausted" || data.error === "free_trial_would_exceed") {
        setShowUpgradePrompt(true)
        return
      }

      if (data.error === "Sign in required") {
        setErrorMessage("Please sign in to process images.")
        return
      }

      setErrorMessage("Something went wrong. Please try again.")
    } catch (err) {
      console.error(err)
      setErrorMessage("Upload failed. Check your connection and try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showDashboard />

      <main className="mx-auto max-w-3xl px-6 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">New Batch</h1>
          <p className="mt-1 text-muted-foreground">
            Remove backgrounds from product photos in bulk
          </p>
        </div>

        {/* Free trial banner */}
        {!isSignedIn && trial && (
          <div className={`rounded-xl border px-4 py-3 mb-6 text-sm ${trial.exhausted ? "border-destructive/50 bg-destructive/10" : "border-border bg-secondary"}`}>
            {trial.exhausted ? (
              <div>
                <p className="font-medium text-foreground">Your 5 free images have been used.</p>
                <p className="text-muted-foreground mt-1">
                  <Link href="/sign-up" className="underline hover:text-foreground">Create a free account</Link> to get 1,000 images/month.
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Free trial: <span className="font-semibold text-foreground">{trial.remaining} image{trial.remaining !== 1 ? "s" : ""} remaining</span> · <Link href="/sign-up" className="underline hover:text-foreground">Sign up for more</Link>
              </p>
            )}
          </div>
        )}

        <div className="space-y-8">
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

          {trialExhausted ? (
            <div className="space-y-3">
              <Link href="/sign-up" className="block w-full">
                <Button className="w-full py-6 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90">
                  Create free account to continue
                </Button>
              </Link>
              <Link href="/sign-in" className="block w-full">
                <Button variant="outline" className="w-full py-6 text-base font-medium">
                  Already have an account? Sign in
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Upgrade prompt — shown when plan limit hit */}
              {showUpgradePrompt && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 px-4 py-3">
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-200">You have reached your plan limit</p>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
                    Upgrade your plan to process more images this month.
                  </p>
                  <Link href="/pricing" className="inline-block mt-2 text-sm font-medium text-amber-900 dark:text-amber-200 underline underline-offset-2">
                    View plans
                  </Link>
                </div>
              )}

              {/* General error */}
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
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading {files.length} image{files.length !== 1 ? "s" : ""}...
                  </>
                ) : files.length > 0 ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Process {files.length} image{files.length !== 1 ? "s" : ""}
                  </>
                ) : (
                  "Select images to process"
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="mt-12 rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-card-foreground">How it works</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              { step: "1", title: "Upload", desc: "Drop your product images" },
              { step: "2", title: "Process", desc: "AI removes backgrounds instantly" },
              { step: "3", title: "Download", desc: "Get clean results as a ZIP" },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                  {item.step}
                </div>
                <div>
                  <p className="font-medium text-card-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
