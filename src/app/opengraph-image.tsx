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
        }}
      >
        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
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
          <div style={{ display: 'flex', color: '#1c1917', fontSize: 56, fontWeight: 800, letterSpacing: '-2px' }}>
            Backdrop
          </div>
        </div>

        {/* Tagline */}
        <div style={{ display: 'flex', fontSize: 38, fontWeight: 700, color: '#1c1917', marginBottom: 16 }}>
          Bulk background removal for product photos.
        </div>

        {/* Sub-tagline */}
        <div style={{ display: 'flex', fontSize: 24, color: '#78716c', marginBottom: 48 }}>
          Upload 500 photos. Get clean images back in minutes.
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ display: 'flex', background: '#1c1917', borderRadius: 999, padding: '10px 24px', color: '#fafaf9', fontSize: 20, fontWeight: 500 }}>
            No per-image fees
          </div>
          <div style={{ display: 'flex', background: '#1c1917', borderRadius: 999, padding: '10px 24px', color: '#fafaf9', fontSize: 20, fontWeight: 500 }}>
            White &amp; transparent bg
          </div>
          <div style={{ display: 'flex', background: '#1c1917', borderRadius: 999, padding: '10px 24px', color: '#fafaf9', fontSize: 20, fontWeight: 500 }}>
            ZIP download
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
