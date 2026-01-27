import { NextResponse } from 'next/server'

const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN

export async function GET() {
  // If Shopify credentials are not configured, return empty array
  if (!SHOPIFY_STORE_URL || !SHOPIFY_ACCESS_TOKEN) {
    return NextResponse.json({
      products: [],
      message: 'Shopify no está configurado. Usando productos de demostración.'
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

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching Shopify products:', error)
    return NextResponse.json(
      {
        products: [],
        error: 'Error connecting to Shopify'
      },
      { status: 500 }
    )
  }
}
