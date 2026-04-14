import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// Replace these with your real values from Google AdSense after approval.
// Publisher ID format:  ca-pub-XXXXXXXXXXXXXXXX
// Ad slot format:       XXXXXXXXXX
const ADSENSE_CLIENT = 'ca-pub-1727174985536828'
const ADSENSE_SLOT   = '8840499341'

declare global {
  interface Window { adsbygoogle: unknown[] }
}

export default function AdBanner() {
  const pushed = useRef(false)

  useEffect(() => {
    // Only push once per mount, and never in dev
    if (pushed.current || !import.meta.env.PROD) return
    if (ADSENSE_CLIENT.includes('REPLACE_ME')) return
    try {
      pushed.current = true
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // AdSense script not yet loaded — safe to ignore
    }
  }, [])

  // Render nothing in dev or before IDs are configured
  if (!import.meta.env.PROD || ADSENSE_CLIENT.includes('REPLACE_ME')) return null

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Typography
        variant="caption"
        sx={{ display: 'block', textAlign: 'center', mb: 0.5, opacity: 0.35, letterSpacing: '0.08em' }}
      >
        ADVERTISEMENT
      </Typography>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={ADSENSE_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </Box>
  )
}
