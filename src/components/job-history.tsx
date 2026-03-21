"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ImageIcon, Clock, CheckCircle2, Loader2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Job {
  id: string
  name: string
  imageCount: number
  status: "completed" | "processing" | "pending"
  createdAt: string
  thumbnails?: string[]
}

interface JobHistoryProps {
  jobs: Job[]
}

function StackedThumbnails({ thumbnails }: { thumbnails: string[] }) {
  const cards = thumbnails.slice(0, 3)

  if (cards.length === 0) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
        <ImageIcon className="h-5 w-5 text-muted-foreground" />
      </div>
    )
  }

  // Fan config: [rotate, translateX, translateY, zIndex]
  const fan = [
    { rotate: "0deg", tx: "0px", ty: "0px", z: 3 },
    { rotate: "-4deg", tx: "-4px", ty: "1px", z: 2 },
    { rotate: "4deg", tx: "4px", ty: "1px", z: 1 },
  ]

  return (
    <div className="relative h-10 w-10 flex-shrink-0">
      {cards.map((url, i) => (
        <div
          key={i}
          className="absolute inset-0 overflow-hidden rounded-lg border border-border bg-secondary shadow-sm"
          style={{
            transform: `rotate(${fan[i].rotate}) translate(${fan[i].tx}, ${fan[i].ty})`,
            zIndex: fan[i].z,
            transformOrigin: "center center",
          }}
        >
          <Image
            src={url}
            alt={`Preview ${i + 1}`}
            fill
            className="object-cover"
            sizes="40px"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  )
}

export function JobHistory({ jobs }: JobHistoryProps) {
  const getStatusIcon = (status: Job["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-foreground" />
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      case "pending":
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusLabel = (status: Job["status"]) => {
    switch (status) {
      case "completed": return "Completed"
      case "processing": return "Processing"
      case "pending": return "Pending"
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Job History</h2>
        <Link
          href="/new"
          className="flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
        >
          Start new batch
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="mb-4 rounded-full bg-secondary p-4">
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="mb-6 text-muted-foreground">No jobs yet</p>
          <Link href="/new">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Process your first batch
            </Button>
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between p-4 transition-colors hover:bg-secondary/50"
            >
              <div className="flex items-center gap-4">
                <StackedThumbnails thumbnails={job.thumbnails ?? []} />
                <div>
                  <p className="font-medium text-card-foreground">{job.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {job.imageCount} image{job.imageCount !== 1 ? "s" : ""} • {job.createdAt}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                {getStatusIcon(job.status)}
                <span className="text-muted-foreground">{getStatusLabel(job.status)}</span>
                {job.status === "completed" && (
                  <a
                    href={`/api/jobs/${job.id}/download`}
                    className="flex items-center gap-1 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    <Download className="h-3.5 w-3.5" />
                    ZIP
                  </a>
                )}
                {job.status === "processing" && (
                  <Link
                    href={`/processing/${job.id}`}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    View
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
