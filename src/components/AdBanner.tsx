import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const ADSENSE_CLIENT = 'ca-pub-6700431049727613'
const ADSENSE_SLOT   = '8840499341'

declare global {
  interface Window { adsbygoogle: unknown[] }
}

interface AdBannerProps {
  format?: 'auto' | 'rectangle'
}

export default function AdBanner({ format = 'auto' }: AdBannerProps) {
  const pushed = useRef(false)

  useEffect(() => {
    if (pushed.current || !import.meta.env.PROD) return
    try {
      pushed.current = true
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // AdSense script not yet loaded — safe to ignore
    }
  }, [])

  if (!import.meta.env.PROD) return null

  const isSquare = format === 'rectangle'

  return (
    <Box sx={{ width: '100%', mt: 1.5, ...(isSquare && { maxWidth: 300, mx: 'auto' }) }}>
      <Typography
        variant="caption"
        sx={{ display: 'block', textAlign: 'center', mb: 0.5, opacity: 0.35, letterSpacing: '0.08em' }}
      >
        ADVERTISEMENT
      </Typography>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...(isSquare && { width: '100%', height: 250 }) }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={ADSENSE_SLOT}
        data-ad-format={format}
        data-full-width-responsive={isSquare ? 'false' : 'true'}
      />
    </Box>
  )
}
