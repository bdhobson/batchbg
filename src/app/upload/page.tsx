'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

type OutputType = 'white' | 'transparent' | 'custom';

export default function UploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [outputType, setOutputType] = useState<OutputType>('white');
  const [customColor, setCustomColor] = useState('#ff0000');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((newFiles: File[]) => {
    const valid = newFiles.filter((f) =>
      ['image/jpeg', 'image/png', 'image/webp'].includes(f.type)
    );
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size));
      return [...prev, ...valid.filter((f) => !existing.has(f.name + f.size))];
    });
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      addFiles(Array.from(e.dataTransfer.files));
    },
    [addFiles]
  );

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('outputType', outputType);
      if (outputType === 'custom') formData.append('outputColor', customColor);
      files.forEach((f) => formData.append('images', f));

      const res = await fetch('/api/jobs', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.jobId) {
        router.push(`/processing/${data.jobId}`);
      } else {
        alert('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Upload failed: ' + String(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">BatchBG</h1>
        <p className="text-gray-400 mb-8">Remove backgrounds from product photos in bulk.</p>

        {/* Drop zone */}
        <div
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-500'
          }`}
        >
          <div className="text-5xl mb-4">📁</div>
          <p className="text-lg font-medium">Drop images here or click to browse</p>
          <p className="text-gray-400 mt-1">JPG, PNG, WEBP · up to 500 images</p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => addFiles(Array.from(e.target.files || []))}
          />
        </div>

        {/* File count */}
        {files.length > 0 && (
          <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
            <span>{files.length} file{files.length !== 1 ? 's' : ''} · {formatSize(totalSize)}</span>
            <button onClick={() => setFiles([])} className="text-red-400 hover:text-red-300">Clear all</button>
          </div>
        )}

        {/* File list (first 10) */}
        {files.length > 0 && (
          <div className="mt-3 max-h-48 overflow-y-auto rounded-lg border border-gray-800 divide-y divide-gray-800">
            {files.slice(0, 20).map((f, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2 text-sm">
                <span className="truncate text-gray-300">{f.name}</span>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-gray-500">{formatSize(f.size)}</span>
                  <button onClick={() => removeFile(i)} className="text-gray-600 hover:text-red-400">✕</button>
                </div>
              </div>
            ))}
            {files.length > 20 && (
              <div className="px-4 py-2 text-sm text-gray-500">…and {files.length - 20} more</div>
            )}
          </div>
        )}

        {/* Output selector */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Background Output</h2>
          <div className="flex gap-3">
            {(['white', 'transparent', 'custom'] as OutputType[]).map((type) => (
              <button
                key={type}
                onClick={() => setOutputType(type)}
                className={`flex-1 py-3 rounded-lg border font-medium capitalize transition-colors ${
                  outputType === type
                    ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                    : 'border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                {type === 'white' && '⬜ White'}
                {type === 'transparent' && '🔲 Transparent'}
                {type === 'custom' && '🎨 Custom'}
              </button>
            ))}
          </div>

          {outputType === 'custom' && (
            <div className="mt-4 flex items-center gap-4">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-12 h-12 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="text-gray-300 font-mono">{customColor}</span>
              <span className="text-gray-500 text-sm">Selected background color</span>
            </div>
          )}
        </div>

        {/* Process button */}
        <button
          onClick={handleProcess}
          disabled={files.length === 0 || uploading}
          className="mt-8 w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold text-lg transition-colors"
        >
          {uploading ? 'Uploading…' : `Process ${files.length > 0 ? files.length + ' image' + (files.length !== 1 ? 's' : '') : ''}`}
        </button>
      </div>
    </main>
  );
}
