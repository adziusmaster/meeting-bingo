// Google Play Billing via the Digital Goods API (available in TWA/Chrome on Android)
// https://developer.chrome.com/docs/android/trusted-web-activity/receive-payments-play-billing/

const PLAY_BILLING = 'https://play.google.com/billing'

export const THEME_SKUS = {
  sunset:        'theme_sunset',
  ocean:         'theme_ocean',
  midnight_rose: 'theme_midnight_rose',
  arctic:        'theme_arctic',
} as const

export type ThemeSku = (typeof THEME_SKUS)[keyof typeof THEME_SKUS]

/** Returns true when running inside a TWA with Play Billing available. */
export async function isBillingSupported(): Promise<boolean> {
  if (!('getDigitalGoodsService' in window)) return false
  try {
    const svc = await (window as any).getDigitalGoodsService(PLAY_BILLING)
    return !!svc
  } catch {
    return false
  }
}

async function getService(): Promise<any> {
  if (!('getDigitalGoodsService' in window)) throw new Error('Digital Goods API not available')
  const svc = await (window as any).getDigitalGoodsService(PLAY_BILLING)
  if (!svc) throw new Error('Play Billing not available')
  return svc
}

/**
 * Triggers the Google Play purchase flow for a single SKU.
 * Returns the purchase token on success.
 * Throws if the purchase fails or is cancelled.
 */
export async function purchaseTheme(skuId: ThemeSku): Promise<string> {
  const svc = await getService()
  const details = await svc.getDetails([skuId])
  if (!details.length) throw new Error(`Product ${skuId} not found in Play catalog`)

  const request = new PaymentRequest(
    [{ supportedMethods: PLAY_BILLING, data: { sku: skuId } }],
    { total: { label: 'Total', amount: { currency: 'USD', value: '0' } } },
  )

  const response = await request.show()
  await response.complete('success')
  return response.details.token as string
}

/**
 * Returns the list of SKU IDs the user has already purchased.
 * Call on app start to restore purchases.
 */
export async function getOwnedSkus(): Promise<string[]> {
  try {
    const svc = await getService()
    const purchases: Array<{ itemId: string }> = await svc.listPurchases()
    return purchases.map(p => p.itemId)
  } catch {
    return []
  }
}
