export type MonthlyPlan = {
  name: string
  credits: number
  price: number
  description: string
  highlight?: boolean
  features: string[]
  cta: string
}

export type CreditBundle = {
  credits: number
  price: number
  description: string
  features: string[]
  cta: string
}

export const monthlyPlans: MonthlyPlan[] = [
  {
    name: 'Lite',
    credits: 40,
    price: 9.99,
    description: 'Best for founders, creators, and occasional product shoots.',
    features: [
      '40 full-resolution cutouts every month',
      'Transparent PNG exports',
      'Commercial-friendly workflow',
      'Recent activity for repeat work',
    ],
    cta: 'Start Lite',
  },
  {
    name: 'Pro',
    credits: 200,
    price: 42.99,
    description: 'Built for ecommerce teams and daily creative production.',
    highlight: true,
    features: [
      '200 credits refreshed monthly',
      'Lower effective cost per image',
      'Priority processing experience',
      'Ideal for catalog and campaign work',
    ],
    cta: 'Choose Pro',
  },
  {
    name: 'Volume+',
    credits: 500,
    price: 94.99,
    description: 'For high-volume operations that need predictable throughput.',
    features: [
      '500 credits every month',
      'High-throughput background removal',
      'Usage visibility for repeat workflows',
      'Great fit for agencies and marketplaces',
    ],
    cta: 'Scale with Volume+',
  },
]

export const creditBundles: CreditBundle[] = [
  {
    credits: 3,
    price: 3.49,
    description: 'A low-friction trial for one-off edits.',
    features: [
      '1 image = 1 credit',
      'Credits never expire',
      'Great for quick experiments',
    ],
    cta: 'Buy 3 credits',
  },
  {
    credits: 10,
    price: 9.99,
    description: 'For occasional cleanup, mockups, and social assets.',
    features: [
      'Simple pay-as-you-go option',
      'No recurring charge',
      'Perfect for light usage',
    ],
    cta: 'Buy 10 credits',
  },
  {
    credits: 75,
    price: 54.99,
    description: 'A flexible bundle for project-based production bursts.',
    features: [
      'Useful for campaign launches',
      'Better value than small bundles',
      'Keep credits for future use',
    ],
    cta: 'Buy 75 credits',
  },
  {
    credits: 200,
    price: 109.99,
    description: 'For teams with heavier but non-subscription demand.',
    features: [
      'Ideal for seasonal spikes',
      'No monthly commitment',
      'Pairs well with agency workflows',
    ],
    cta: 'Buy 200 credits',
  },
]

export const pricingHighlights = [
  '1 image = 1 credit',
  'One-time credits never expire',
  'Monthly credits renew every billing cycle',
  'Annual billing can be layered in later with a discount',
]

export function formatUsd(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price)
}
