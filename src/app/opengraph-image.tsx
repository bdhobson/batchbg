import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#fafaf9',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Subtle grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, #d6d3d1 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            opacity: 0.4,
          }}
        />

        {/* Logo + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, zIndex: 1 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: '#1c1917',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 38,
              fontWeight: 800,
              color: 'white',
            }}
          >
            B
          </div>
          <span style={{ color: '#1c1917', fontSize: 56, fontWeight: 800, letterSpacing: '-2px' }}>
            Backdrop
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 38,
            fontWeight: 700,
            color: '#1c1917',
            marginBottom: 16,
            letterSpacing: '-0.5px',
            zIndex: 1,
          }}
        >
          Bulk background removal for{' '}
          <span style={{ borderBottom: '4px solid #1c1917' }}>product photos.</span>
        </div>

        {/* Sub-tagline */}
        <div style={{ fontSize: 24, color: '#78716c', marginBottom: 48, zIndex: 1 }}>
          Upload 500 photos. Get clean images back in minutes.
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: 16, zIndex: 1 }}>
          {['No per-image fees', 'White & transparent bg', 'ZIP download'].map((label) => (
            <div
              key={label}
              style={{
                background: '#1c1917',
                borderRadius: 999,
                padding: '10px 24px',
                color: '#fafaf9',
                fontSize: 20,
                fontWeight: 500,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
