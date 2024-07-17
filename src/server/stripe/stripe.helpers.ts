export function formatAmountForDisplay(amount: number, currency: string): string {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  })
  return numberFormat.format(amount)
}

export function formatAmountForStripe(amount: number, currency: string): number {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
      style: 'currency',
      currency,
      currencyDisplay: 'symbol',
    }),
    parts = numberFormat.formatToParts(amount)
  let zeroDecimalCurrency = true
  parts.forEach((part) => {
    if (part.type === 'decimal') zeroDecimalCurrency = false
  })

  return zeroDecimalCurrency ? amount : Math.round(amount * 100)
}

export function formatAmountFromStripe(amount: number, currency: string): number {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
      style: 'currency',
      currency,
      currencyDisplay: 'symbol',
    }),
    parts = numberFormat.formatToParts(amount)
  let zeroDecimalCurrency = true

  parts.forEach((part) => {
    if (part.type === 'decimal') zeroDecimalCurrency = false
  })

  return zeroDecimalCurrency ? amount : +(amount / 100).toFixed(2)
}
