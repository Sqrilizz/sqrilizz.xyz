import { kv } from '@vercel/kv'

export const config = {
  runtime: 'edge',
}

export default async function handler(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const visitorKey = `visitor:${ip}`
    
    const isNewVisitor = await kv.set(visitorKey, '1', { nx: true })
    
    if (isNewVisitor) {
      await kv.incr('visitor_count')
    }
    
    const count = await kv.get('visitor_count') || 0
    
    return new Response(
      JSON.stringify({
        success: true,
        totalCount: count
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
