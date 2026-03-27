import { kv } from '@vercel/kv'

export const config = {
  runtime: 'edge',
}

export default async function handler(request) {
  try {
    const count = await kv.incr('visitor_count')
    
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
