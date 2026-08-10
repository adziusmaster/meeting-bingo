import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { FLAGS } from '../flags'

const ADSENSE_CLIENT = 'ca-pub-6700431049727613'
const ADSENSE_SLOT   = '2274482181'

declare global {
  interface Window { adsbygoogle: unknown[] }
}

interface AdBannerProps {
  format?: 'auto' | 'rectangle'
}

const LOADER_SRC =
  `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`

/**
 * Inject the AdSense loader on demand.
 *
 * It is deliberately NOT in index.html: a global loader lets Auto ads place ads
 * on every screen, including login / lobby / settings / "waiting for host",
 * which have no publisher content and breach AdSense policy. Loading it only
 * where an ad slot actually renders keeps ads off those screens.
 */
function ensureLoader() {
  if (document.querySelector(`script[src^="${LOADER_SRC}"]`)) return
  const s = document.createElement('script')
  s.async = true
  s.src = LOADER_SRC
  s.crossOrigin = 'anonymous'
  document.head.appendChild(s)
}

export default function AdBanner({ format = 'auto' }: AdBannerProps) {
  const pushed = useRef(false)

  useEffect(() => {
    if (pushed.current || !import.meta.env.PROD || !FLAGS.ADS_ENABLED) return
    try {
      pushed.current = true
      ensureLoader()
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // AdSense script not yet loaded — safe to ignore
    }
  }, [])

  if (!import.meta.env.PROD || !FLAGS.ADS_ENABLED) return null

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
