"use client"

import { useCallback, useState } from "react"
import { Upload, X, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface DropzoneProps {
  files: File[]
  onFilesChange: (files: File[]) => void
}

export function Dropzone({ files, onFilesChange }: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      )
      onFilesChange([...files, ...droppedFiles])
    },
    [files, onFilesChange]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selectedFiles = Array.from(e.target.files)
        onFilesChange([...files, ...selectedFiles])
      }
    },
    [files, onFilesChange]
  )

  const removeFile = useCallback(
    (index: number) => {
      onFilesChange(files.filter((_, i) => i !== index))
    },
    [files, onFilesChange]
  )

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all",
          isDragOver
            ? "border-foreground bg-secondary/50"
            : "border-border bg-card hover:border-muted-foreground hover:bg-secondary/30"
        )}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-xl bg-secondary p-4">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-lg font-medium text-foreground">
              Drop images here or click to browse
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              JPG, PNG, WEBP • up to 500 images
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-card-foreground">
              {files.length} image{files.length !== 1 ? "s" : ""} selected
            </p>
            <button
              onClick={() => onFilesChange([])}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Clear all
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {files.slice(0, 11).map((file, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-lg bg-secondary"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute right-1 top-1 rounded-full bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3 text-foreground" />
                </button>
              </div>
            ))}
            {files.length > 11 && (
              <div className="flex aspect-square items-center justify-center rounded-lg bg-secondary">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-5 w-5 text-muted-foreground" />
                  <span className="mt-1 text-xs text-muted-foreground">
                    +{files.length - 11} more
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
