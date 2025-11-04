import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const templates = [
      {
        name: 'Traditional Professional',
        description: 'Clean, timeless design perfect for conservative industries like finance and accounting',
        category: 'classic',
        json_content: {
          sections: [
            {
              type: 'header',
              styles: { padding: '32px', backgroundColor: '#f8f9fa', borderBottom: '3px solid #2563eb' },
              children: [
                { type: 'text', content: '{{contact.name}}', styles: { fontSize: '32px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' } },
                { type: 'text', content: '{{contact.title}}', styles: { fontSize: '18px', color: '#64748b', marginBottom: '16px' } },
                { type: 'contact', styles: { display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '14px', color: '#475569' }, children: [{ content: '{{contact.email}}' }, { content: '{{contact.phone}}' }, { content: '{{contact.location}}' }, { content: '{{contact.linkedin}}' }] }
              ]
            },
            {
              type: 'summary',
              styles: { padding: '24px 32px', backgroundColor: '#ffffff' },
              children: [
                { type: 'text', content: 'Professional Summary', styles: { fontSize: '20px', fontWeight: '600', color: '#1e293b', marginBottom: '12px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' } },
                { type: 'text', content: '{{summary}}', styles: { fontSize: '14px', lineHeight: '1.6', color: '#334155' } }
              ]
            }
          ]
        },
        template: {},
        styles: {},
        is_premium: false
      },
      {
        name: 'Minimalist Pro',
        description: 'Clean lines and modern typography for contemporary roles in marketing and consulting',
        category: 'modern',
        json_content: {
          sections: [
            {
              type: 'header',
              styles: { padding: '40px 32px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#ffffff' },
              children: [
                { type: 'text', content: '{{contact.name}}', styles: { fontSize: '36px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.5px' } },
                { type: 'text', content: '{{contact.title}}', styles: { fontSize: '20px', opacity: '0.95', marginBottom: '20px' } }
              ]
            }
          ]
        },
        template: {},
        styles: {},
        is_premium: false
      },
      {
        name: 'Designer Portfolio',
        description: 'Vibrant and creative layout for design professionals and creative roles',
        category: 'creative',
        json_content: {
          sections: [
            {
              type: 'header',
              styles: { padding: '40px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)', paddingBottom: '60px' },
              children: [
                { type: 'text', content: '{{contact.name}}', styles: { fontSize: '42px', fontWeight: '800', color: '#ffffff', marginBottom: '8px', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' } }
              ]
            }
          ]
        },
        template: {},
        styles: {},
        is_premium: false
      },
      {
        name: 'CEO Excellence',
        description: 'Premium design for top-tier executive positions and C-suite roles',
        category: 'executive',
        json_content: {
          sections: [
            {
              type: 'header',
              styles: { padding: '48px 40px', backgroundColor: '#1e293b', borderBottom: '4px solid #d4af37' },
              children: [
                { type: 'text', content: '{{contact.name}}', styles: { fontSize: '38px', fontWeight: '700', color: '#ffffff', marginBottom: '8px', letterSpacing: '0.5px' } }
              ]
            }
          ]
        },
        template: {},
        styles: {},
        is_premium: false
      },
      {
        name: 'Software Engineer',
        description: 'Tech-focused design highlighting technical skills and projects',
        category: 'tech',
        json_content: {
          sections: [
            {
              type: 'header',
              styles: { padding: '36px 32px', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)', borderBottom: '3px solid #3b82f6' },
              children: [
                { type: 'text', content: '{{contact.name}}', styles: { fontSize: '34px', fontWeight: '700', color: '#ffffff', marginBottom: '8px', fontFamily: 'monospace' } }
              ]
            }
          ]
        },
        template: {},
        styles: {},
        is_premium: false
      },
      {
        name: 'Centered Elegance',
        description: 'Sophisticated center-aligned layout for formal presentations',
        category: 'classic',
        json_content: {
          sections: [
            {
              type: 'header',
              styles: { padding: '40px', textAlign: 'center', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' },
              children: [
                { type: 'text', content: '{{contact.name}}', styles: { fontSize: '36px', fontWeight: '700', color: '#111827', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase' } }
              ]
            }
          ]
        },
        template: {},
        styles: {},
        is_premium: false
      },
      {
        name: 'Split Column',
        description: 'Efficient two-column layout maximizing space utilization',
        category: 'modern',
        json_content: {
          sections: [
            {
              type: 'columns',
              styles: { display: 'grid', gridTemplateColumns: '300px 1fr', minHeight: '100vh' },
              children: [
                {
                  type: 'sidebar',
                  styles: { backgroundColor: '#1e3a8a', color: '#ffffff', padding: '40px 24px' },
                  children: [
                    { type: 'header', children: [{ type: 'text', content: '{{contact.name}}', styles: { fontSize: '28px', fontWeight: '700', marginBottom: '8px' } }] }
                  ]
                }
              ]
            }
          ]
        },
        template: {},
        styles: {},
        is_premium: false
      }
    ]

    // Insert templates
    const { data, error } = await supabaseClient
      .from('resume_templates')
      .upsert(templates, { onConflict: 'name' })
      .select()

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ success: true, templates: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
