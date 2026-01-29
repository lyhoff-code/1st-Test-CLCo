import { NextResponse } from 'next/server'

const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN

// Demo products for when Shopify is not configured
const DEMO_PRODUCTS = [
  {
    id: 'demo-1',
    title: 'Premium Wireless Headphones',
    description: 'Experience crystal-clear audio with our premium wireless headphones. Features active noise cancellation, 30-hour battery life, and ultra-comfortable memory foam ear cushions.',
    handle: 'premium-wireless-headphones',
    images: {
      edges: [
        { node: { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', altText: 'Headphones' } }
      ]
    },
    priceRange: {
      minVariantPrice: { amount: '149.99', currencyCode: 'USD' }
    },
    variants: {
      edges: [
        { node: { id: 'v1', title: 'Black', price: { amount: '149.99', currencyCode: 'USD' } } },
        { node: { id: 'v2', title: 'White', price: { amount: '149.99', currencyCode: 'USD' } } }
      ]
    }
  },
  {
    id: 'demo-2',
    title: 'Smart Fitness Watch',
    description: 'Track your fitness goals with precision. Heart rate monitoring, GPS tracking, sleep analysis, and 7-day battery life. Water resistant up to 50 meters.',
    handle: 'smart-fitness-watch',
    images: {
      edges: [
        { node: { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', altText: 'Smart Watch' } }
      ]
    },
    priceRange: {
      minVariantPrice: { amount: '299.99', currencyCode: 'USD' }
    },
    variants: {
      edges: [
        { node: { id: 'v3', title: 'Space Gray', price: { amount: '299.99', currencyCode: 'USD' } } }
      ]
    }
  },
  {
    id: 'demo-3',
    title: 'Organic Skincare Set',
    description: 'Pamper your skin with our all-natural organic skincare collection. Includes cleanser, toner, moisturizer, and serum. Perfect for all skin types.',
    handle: 'organic-skincare-set',
    images: {
      edges: [
        { node: { url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800', altText: 'Skincare Products' } }
      ]
    },
    priceRange: {
      minVariantPrice: { amount: '89.99', currencyCode: 'USD' }
    },
    variants: {
      edges: [
        { node: { id: 'v4', title: 'Standard Set', price: { amount: '89.99', currencyCode: 'USD' } } }
      ]
    }
  },
  {
    id: 'demo-4',
    title: 'Minimalist Leather Wallet',
    description: 'Sleek and functional. Genuine full-grain leather wallet with RFID protection. Holds up to 8 cards and features a slim profile design.',
    handle: 'minimalist-leather-wallet',
    images: {
      edges: [
        { node: { url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800', altText: 'Leather Wallet' } }
      ]
    },
    priceRange: {
      minVariantPrice: { amount: '59.99', currencyCode: 'USD' }
    },
    variants: {
      edges: [
        { node: { id: 'v5', title: 'Brown', price: { amount: '59.99', currencyCode: 'USD' } } },
        { node: { id: 'v6', title: 'Black', price: { amount: '59.99', currencyCode: 'USD' } } }
      ]
    }
  },
  {
    id: 'demo-5',
    title: 'Portable Bluetooth Speaker',
    description: '360° immersive sound in a compact design. 24-hour playtime, waterproof IPX7, and built-in microphone for hands-free calls.',
    handle: 'portable-bluetooth-speaker',
    images: {
      edges: [
        { node: { url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800', altText: 'Bluetooth Speaker' } }
      ]
    },
    priceRange: {
      minVariantPrice: { amount: '79.99', currencyCode: 'USD' }
    },
    variants: {
      edges: [
        { node: { id: 'v7', title: 'Midnight Blue', price: { amount: '79.99', currencyCode: 'USD' } } }
      ]
    }
  },
  {
    id: 'demo-6',
    title: 'Eco-Friendly Water Bottle',
    description: 'Stay hydrated sustainably. Double-wall vacuum insulation keeps drinks cold for 24h or hot for 12h. Made from recycled stainless steel.',
    handle: 'eco-friendly-water-bottle',
    images: {
      edges: [
        { node: { url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800', altText: 'Water Bottle' } }
      ]
    },
    priceRange: {
      minVariantPrice: { amount: '34.99', currencyCode: 'USD' }
    },
    variants: {
      edges: [
        { node: { id: 'v8', title: 'Ocean Blue', price: { amount: '34.99', currencyCode: 'USD' } } },
        { node: { id: 'v9', title: 'Forest Green', price: { amount: '34.99', currencyCode: 'USD' } } }
      ]
    }
  }
]

export async function GET() {
  // If Shopify credentials are not configured, return demo products
  if (!SHOPIFY_STORE_URL || !SHOPIFY_ACCESS_TOKEN) {
    return NextResponse.json({
      products: DEMO_PRODUCTS,
      isDemo: true,
      message: 'Using demo products. Configure Shopify in Settings to use your real products.'
    })
  }

  try {
    const query = `
      {
        products(first: 20) {
          edges {
            node {
              id
              title
              description
              handle
              images(first: 5) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    `

    const response = await fetch(
      `https://${SHOPIFY_STORE_URL}/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
        },
        body: JSON.stringify({ query }),
      }
    )

    if (!response.ok) {
      throw new Error('Error fetching from Shopify')
    }

    const data = await response.json()

    if (data.errors) {
      console.error('Shopify GraphQL errors:', data.errors)
      throw new Error('Shopify GraphQL error')
    }

    const products = data.data.products.edges.map((edge: { node: unknown }) => edge.node)

    return NextResponse.json({
      products,
      isDemo: false
    })
  } catch (error) {
    console.error('Error fetching Shopify products:', error)
    // Return demo products on error
    return NextResponse.json({
      products: DEMO_PRODUCTS,
      isDemo: true,
      error: 'Error connecting to Shopify. Using demo products.',
    })
  }
}
