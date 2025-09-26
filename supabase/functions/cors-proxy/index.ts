import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

console.log(`Function "cors-proxy" up and running!`)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the target URL from query parameters
    const url = new URL(req.url)
    const targetUrl = url.searchParams.get('url')

    if (!targetUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing target URL parameter' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Forward the request to the target URL
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        // Remove host header to avoid conflicts
        ...Object.fromEntries(
          Array.from(req.headers.entries()).filter(([key]) =>
            !['host', 'origin', 'referer'].includes(key.toLowerCase())
          )
        ),
        // Add Supabase auth headers if available
        ...(req.headers.get('authorization') && {
          'Authorization': req.headers.get('authorization')
        }),
        ...(req.headers.get('apikey') && {
          'apikey': req.headers.get('apikey')
        })
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    })

    // Return the response with CORS headers
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...corsHeaders,
        ...Object.fromEntries(
          Array.from(response.headers.entries()).filter(([key]) =>
            !['set-cookie', 'connection', 'keep-alive', 'proxy-authenticate'].includes(key.toLowerCase())
          )
        ),
      },
    })

  } catch (error) {
    console.error('CORS proxy error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
