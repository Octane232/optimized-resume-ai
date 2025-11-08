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
    // Verify secret token for security
    const { secret } = await req.json().catch(() => ({}));
    const expectedSecret = Deno.env.get('SEED_SECRET');
    
    if (!expectedSecret || secret !== expectedSecret) {
      console.error('Unauthorized seed attempt');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const templates = [
      // Classic Templates - 10 unique designs
      {
        name: 'Timeless Professional',
        description: 'Classic serif font with elegant borders - perfect for law and finance',
        category: 'classic',
        json_content: {
          sections: [
            {
              type: 'header',
              styles: { padding: '40px', backgroundColor: '#ffffff', borderBottom: '3px double #1e293b', textAlign: 'center' },
              children: [
                { type: 'text', content: '{{contact.name}}', styles: { fontSize: '36px', fontWeight: '700', color: '#1e293b', marginBottom: '8px', fontFamily: 'Georgia, serif', letterSpacing: '2px' } },
                { type: 'text', content: '{{contact.title}}', styles: { fontSize: '16px', color: '#64748b', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '3px' } },
                { type: 'contact', styles: { display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '13px', color: '#475569' }, children: [{ content: '{{contact.email}}' }, { content: '{{contact.phone}}' }, { content: '{{contact.location}}' }] }
              ]
            }
          ]
        },
        template: {},
        styles: {},
        is_premium: false
      },
      {
        name: 'Corporate Standard',
        description: 'Traditional left-aligned layout with subtle gray accents',
        category: 'classic',
        json_content: {
          sections: [
            {
              type: 'header',
              styles: { padding: '32px 40px', backgroundColor: '#f8fafc', borderLeft: '8px solid #334155' },
              children: [
                { type: 'text', content: '{{contact.name}}', styles: { fontSize: '32px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' } },
                { type: 'text', content: '{{contact.title}}', styles: { fontSize: '18px', color: '#475569', marginBottom: '16px' } },
                { type: 'contact', styles: { display: 'flex', gap: '16px', fontSize: '14px', color: '#64748b' }, children: [{ content: '{{contact.email}}' }, { content: '{{contact.phone}}' }] }
              ]
            }
          ]
        },
        template: {},
        styles: {},
        is_premium: false
      },
      {
        name: 'Executive Formal',
        description: 'Sophisticated black and white design with gold accents',
        category: 'classic',
        json_content: {
          sections: [
            {
              type: 'header',
              styles: { padding: '48px 40px', backgroundColor: '#000000', color: '#ffffff' },
              children: [
                { type: 'text', content: '{{contact.name}}', styles: { fontSize: '38px', fontWeight: '700', marginBottom: '10px', borderBottom: '2px solid #d4af37', display: 'inline-block', paddingBottom: '8px' } },
                { type: 'text', content: '{{contact.title}}', styles: { fontSize: '18px', color: '#d4af37', marginBottom: '20px', fontWeight: '500' } },
                { type: 'contact', styles: { display: 'flex', gap: '18px', fontSize: '13px', opacity: '0.9' }, children: [{ content: '{{contact.email}}' }, { content: '{{contact.phone}}' }] }
              ]
            }
          ]
        },
        template: {},
        styles: {},
        is_premium: false
      },
      {
        name: 'Academic CV',
        description: 'Traditional academic format with clear section headers',
        category: 'classic',
        json_content: {
          sections: [
            {
              type: 'header',
              styles: { padding: '36px', backgroundColor: '#ffffff', borderBottom: '1px solid #cbd5e1', textAlign: 'center' },
              children: [
                { type: 'text', content: '{{contact.name}}', styles: { fontSize: '28px', fontWeight: '600', color: '#1e293b', marginBottom: '6px', fontFamily: 'Times New Roman, serif' } },
                { type: 'text', content: '{{contact.title}}', styles: { fontSize: '16px', color: '#64748b', marginBottom: '18px', fontStyle: 'italic' } },
                { type: 'contact', styles: { display: 'flex', justifyContent: 'center', gap: '14px', fontSize: '13px', color: '#475569' }, children: [{ content: '{{contact.email}}' }, { content: '{{contact.phone}}' }] }
              ]
            }
          ]
        },
        template: {},
        styles: {},
        is_premium: false
      },
      {
        name: 'Professional Blue',
        description: 'Clean design with navy blue header and structured layout',
        category: 'classic',
        json_content: {
          sections: [
            {
              type: 'header',
              styles: { padding: '36px 40px', backgroundColor: '#1e3a8a', color: '#ffffff' },
              children: [
                { type: 'text', content: '{{contact.name}}', styles: { fontSize: '34px', fontWeight: '700', marginBottom: '8px' } },
                { type: 'text', content: '{{contact.title}}', styles: { fontSize: '18px', marginBottom: '18px', opacity: '0.95' } },
                { type: 'contact', styles: { display: 'flex', gap: '16px', fontSize: '14px', opacity: '0.9' }, children: [{ content: '{{contact.email}}' }, { content: '{{contact.phone}}' }, { content: '{{contact.location}}' }] }
              ]
            }
          ]
        },
        template: {},
        styles: {},
        is_premium: false
      },
      {
        name: 'Minimalist Classic',
        description: 'Ultra-clean design with maximum white space and subtle lines',
        category: 'classic',
        json_content: {
          sections: [
            {
              type: 'header',
              styles: { padding: '44px 50px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' },
              children: [
                { type: 'text', content: '{{contact.name}}', styles: { fontSize: '32px', fontWeight: '600', color: '#0f172a', marginBottom: '10px', letterSpacing: '0.5px' } },
                { type: 'text', content: '{{contact.title}}', styles: { fontSize: '16px', color: '#64748b', marginBottom: '24px' } },
                { type: 'contact', styles: { display: 'flex', gap: '20px', fontSize: '13px', color: '#94a3b8' }, children: [{ content: '{{contact.email}}' }, { content: '{{contact.phone}}' }] }
              ]
            }
          ]
        },
        template: {},
        styles: {},
        is_premium: false
      },
      {
        name: 'Traditional Sidebar',
        description: 'Classic two-column layout with left sidebar for contact info',
        category: 'classic',
        json_content: {
          sections: [
            {
              type: 'columns',
              styles: { display: 'grid', gridTemplateColumns: '280px 1fr' },
              children: [
                {
                  type: 'sidebar',
                  styles: { backgroundColor: '#f1f5f9', padding: '40px 28px', borderRight: '2px solid #cbd5e1' },
                  children: [
                    { type: 'text', content: '{{contact.name}}', styles: { fontSize: '24px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' } },
                    { type: 'text', content: '{{contact.title}}', styles: { fontSize: '14px', color: '#64748b', marginBottom: '24px' } }
                  ]
                }
              ]
            }
          ]
        },
        template: {},
        styles: {},
        is_premium: false
      },
      {
        name: 'Formal Document',
        description: 'Document-style resume with clear hierarchy and structure',
        category: 'classic',
        json_content: {
          sections: [
            {
              type: 'header',
              styles: { padding: '32px 45px', backgroundColor: '#ffffff', borderBottom: '4px solid #0f172a' },
              children: [
                { type: 'text', content: '{{contact.name}}', styles: { fontSize: '30px', fontWeight: '700', color: '#0f172a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' } },
                { type: 'text', content: '{{contact.title}}', styles: { fontSize: '16px', color: '#475569', marginBottom: '16px' } },
                { type: 'contact', styles: { display: 'flex', gap: '18px', fontSize: '13px', color: '#64748b' }, children: [{ content: '{{contact.email}}' }, { content: '{{contact.phone}}' }, { content: '{{contact.location}}' }] }
              ]
            }
          ]
        },
        template: {},
        styles: {},
        is_premium: false
      },
      {
        name: 'Banking Professional',
        description: 'Conservative design with green accents perfect for financial sector',
        category: 'classic',
        json_content: {
          sections: [
            {
              type: 'header',
              styles: { padding: '38px 40px', backgroundColor: '#f8fafb', borderTop: '6px solid #065f46' },
              children: [
                { type: 'text', content: '{{contact.name}}', styles: { fontSize: '34px', fontWeight: '700', color: '#064e3b', marginBottom: '8px' } },
                { type: 'text', content: '{{contact.title}}', styles: { fontSize: '17px', color: '#047857', marginBottom: '18px' } },
                { type: 'contact', styles: { display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280' }, children: [{ content: '{{contact.email}}' }, { content: '{{contact.phone}}' }] }
              ]
            }
          ]
        },
        template: {},
        styles: {},
        is_premium: false
      },
      {
        name: 'Refined Elegance',
        description: 'Sophisticated design with burgundy accents and refined typography',
        category: 'classic',
        json_content: {
          sections: [
            {
              type: 'header',
              styles: { padding: '40px', backgroundColor: '#fef2f2', borderBottom: '3px solid #7f1d1d', textAlign: 'center' },
              children: [
                { type: 'text', content: '{{contact.name}}', styles: { fontSize: '35px', fontWeight: '700', color: '#7f1d1d', marginBottom: '10px', fontFamily: 'Georgia, serif' } },
                { type: 'text', content: '{{contact.title}}', styles: { fontSize: '16px', color: '#991b1b', marginBottom: '20px' } },
                { type: 'contact', styles: { display: 'flex', justifyContent: 'center', gap: '18px', fontSize: '13px', color: '#b91c1c' }, children: [{ content: '{{contact.email}}' }, { content: '{{contact.phone}}' }] }
              ]
            }
          ]
        },
        template: {},
        styles: {},
        is_premium: false
      },

      // Tech Templates - 10 unique designs
      {
        name: 'Terminal Pro',
        description: 'Dark terminal-inspired design perfect for developers',
        category: 'tech',
        json_content: {
          theme: {
            primaryColor: 'hsl(142, 76%, 36%)',
            secondaryColor: 'hsl(210, 50%, 60%)',
            accentColor: 'hsl(48, 100%, 67%)',
            backgroundColor: 'hsl(220, 13%, 13%)',
            textColor: 'hsl(0, 0%, 85%)',
            fontFamily: "'JetBrains Mono', 'Courier New', monospace"
          },
          sections: [
            {
              type: 'header',
              style: { backgroundColor: 'hsl(142, 76%, 36%)', color: 'hsl(220, 13%, 13%)', padding: '32px', borderRadius: '0' },
              children: [
                { type: 'text', content: '{{contact.name}}', style: { fontSize: '36px', fontWeight: 'bold', marginBottom: '4px' } },
                { type: 'text', content: '{{contact.title}}', style: { fontSize: '18px', opacity: '0.9' } },
                { type: 'text', content: '{{contact.email}} | {{contact.phone}} | {{contact.location}}', style: { fontSize: '14px', marginTop: '12px' } }
              ]
            },
            {
              type: 'main',
              style: { padding: '32px' },
              children: [
                {
                  type: 'section',
                  title: '> About',
                  style: { marginBottom: '24px' },
                  children: [
                    { type: 'text', content: '{{summary}}', style: { backgroundColor: 'hsl(0, 0%, 15%)', padding: '16px', borderRadius: '4px', borderLeft: '4px solid hsl(142, 76%, 36%)' } }
                  ]
                },
                {
                  type: 'section',
                  title: '> Skills',
                  style: { marginBottom: '24px' },
                  children: [
                    { type: 'skills', style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', backgroundColor: 'hsl(0, 0%, 15%)', padding: '16px', borderRadius: '4px' } }
                  ]
                },
                { type: 'experience', titlePrefix: '> Experience', style: { marginBottom: '24px' } },
                { type: 'education', titlePrefix: '> Education' }
              ]
            }
          ]
        },
        template: {},
        styles: {},
        is_premium: false
      },
      {
        name: 'Code Editor',
        description: 'VS Code inspired layout with syntax highlighting colors',
        category: 'tech',
        json_content: {
          theme: {
            primaryColor: 'hsl(213, 96%, 64%)',
            secondaryColor: 'hsl(137, 100%, 40%)',
            accentColor: 'hsl(355, 100%, 61%)',
            backgroundColor: 'hsl(230, 21%, 11%)',
            textColor: 'hsl(220, 14%, 71%)',
            fontFamily: "'Fira Code', 'Consolas', monospace"
          },
          sections: [
            {
              type: 'columns',
              style: { display: 'flex', gap: '0' },
              children: [
                {
                  type: 'sidebar',
                  style: { width: '35%', backgroundColor: 'hsl(235, 18%, 16%)', padding: '32px' },
                  children: [
                    { type: 'text', content: '{{contact.name}}', style: { fontSize: '28px', fontWeight: 'bold', color: 'hsl(213, 96%, 64%)', marginBottom: '8px' } },
                    { type: 'text', content: '{{contact.title}}', style: { fontSize: '16px', color: 'hsl(137, 100%, 40%)', marginBottom: '24px' } },
                    { type: 'contact', style: { marginBottom: '24px', fontSize: '13px' } },
                    {
                      type: 'section',
                      title: '// Skills',
                      style: { marginBottom: '24px' },
                      children: [
                        { type: 'skills', style: { display: 'flex', flexDirection: 'column', gap: '8px' } }
                      ]
                    },
                    { type: 'education', titlePrefix: '// Education' }
                  ]
                },
                {
                  type: 'main',
                  style: { width: '65%', padding: '32px', backgroundColor: 'hsl(230, 21%, 11%)' },
                  children: [
                    {
                      type: 'section',
                      title: '/* About */',
                      style: { marginBottom: '24px' },
                      children: [
                        { type: 'text', content: '{{summary}}', style: { lineHeight: '1.6' } }
                      ]
                    },
                    { type: 'experience', titlePrefix: '/* Experience */' }
                  ]
                }
              ]
            }
          ]
        },
        template: {},
        styles: {},
        is_premium: false
      },
      {
        name: 'Neon Dev',
        description: 'Futuristic cyberpunk design with neon accents',
        category: 'tech',
        json_content: {
          theme: {
            primaryColor: 'hsl(316, 100%, 50%)',
            secondaryColor: 'hsl(180, 100%, 50%)',
            accentColor: 'hsl(60, 100%, 50%)',
            backgroundColor: 'hsl(240, 10%, 5%)',
            textColor: 'hsl(180, 100%, 90%)',
            fontFamily: "'Orbitron', 'Arial Black', sans-serif"
          },
          sections: [
            {
              type: 'header',
              style: { 
                background: 'linear-gradient(135deg, hsl(316, 100%, 50%), hsl(180, 100%, 50%))', 
                color: 'hsl(240, 10%, 5%)', 
                padding: '40px',
                borderBottom: '3px solid hsl(60, 100%, 50%)'
              },
              children: [
                { type: 'text', content: '{{contact.name}}', style: { fontSize: '42px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' } },
                { type: 'text', content: '{{contact.title}}', style: { fontSize: '20px', marginTop: '8px', textTransform: 'uppercase' } }
              ]
            },
            {
              type: 'main',
              style: { padding: '32px' },
              children: [
                {
                  type: 'section',
                  title: '⚡ Contact',
                  style: { marginBottom: '24px', borderLeft: '4px solid hsl(316, 100%, 50%)', paddingLeft: '16px' },
                  children: [
                    { type: 'contact', style: { display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '14px' } }
                  ]
                },
                {
                  type: 'section',
                  title: '⚡ Profile',
                  style: { marginBottom: '24px', borderLeft: '4px solid hsl(180, 100%, 50%)', paddingLeft: '16px' },
                  children: [
                    { type: 'text', content: '{{summary}}', style: { lineHeight: '1.7' } }
                  ]
                },
                {
                  type: 'section',
                  title: '⚡ Tech Stack',
                  style: { marginBottom: '24px', borderLeft: '4px solid hsl(60, 100%, 50%)', paddingLeft: '16px' },
                  children: [
                    { type: 'skills', style: { display: 'flex', flexWrap: 'wrap', gap: '8px' } }
                  ]
                },
                { type: 'experience', titlePrefix: '⚡ Experience', style: { marginBottom: '24px' } },
                { type: 'education', titlePrefix: '⚡ Education' }
              ]
            }
          ]
        },
        template: {},
        styles: {},
        is_premium: true
      },
      {
        name: 'Minimal Dev',
        description: 'Ultra-clean minimal design for modern developers',
        category: 'tech',
        json_content: {
          theme: {
            primaryColor: 'hsl(0, 0%, 10%)',
            secondaryColor: 'hsl(210, 100%, 50%)',
            accentColor: 'hsl(0, 0%, 60%)',
            backgroundColor: 'hsl(0, 0%, 100%)',
            textColor: 'hsl(0, 0%, 20%)',
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif"
          },
          sections: [
            {
              type: 'header',
              style: { borderBottom: '2px solid hsl(0, 0%, 10%)', padding: '40px 32px 24px 32px' },
              children: [
                { type: 'text', content: '{{contact.name}}', style: { fontSize: '48px', fontWeight: '700', marginBottom: '8px' } },
                { type: 'text', content: '{{contact.title}}', style: { fontSize: '20px', color: 'hsl(0, 0%, 40%)' } }
              ]
            },
            {
              type: 'main',
              style: { padding: '32px', maxWidth: '900px', margin: '0 auto' },
              children: [
                { type: 'contact', style: { marginBottom: '32px', display: 'flex', gap: '24px', fontSize: '14px', color: 'hsl(0, 0%, 40%)' } },
                {
                  type: 'section',
                  title: 'About',
                  style: { marginBottom: '32px' },
                  children: [
                    { type: 'text', content: '{{summary}}', style: { lineHeight: '1.8', fontSize: '15px' } }
                  ]
                },
                {
                  type: 'section',
                  title: 'Skills',
                  style: { marginBottom: '32px' },
                  children: [
                    { type: 'skills', style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '14px' } }
                  ]
                },
                { type: 'experience', titlePrefix: 'Experience', style: { marginBottom: '32px' } },
                { type: 'education', titlePrefix: 'Education' }
              ]
            }
          ]
        },
        template: {},
        styles: {},
        is_premium: false
      },
      {
        name: 'Matrix',
        description: 'Inspired by The Matrix with green-on-black aesthetic',
        category: 'tech',
        json_content: {
          theme: {
            primaryColor: 'hsl(120, 100%, 40%)',
            secondaryColor: 'hsl(120, 100%, 25%)',
            accentColor: 'hsl(120, 100%, 60%)',
            backgroundColor: 'hsl(0, 0%, 0%)',
            textColor: 'hsl(120, 100%, 70%)',
            fontFamily: "'Courier New', 'Courier', monospace"
          },
          sections: [
            {
              type: 'header',
              style: { backgroundColor: 'hsl(120, 100%, 25%)', padding: '32px', borderBottom: '2px solid hsl(120, 100%, 40%)' },
              children: [
                { type: 'text', content: '> {{contact.name}}', style: { fontSize: '38px', fontWeight: 'bold', color: 'hsl(120, 100%, 90%)' } },
                { type: 'text', content: '> {{contact.title}}', style: { fontSize: '18px', marginTop: '8px', color: 'hsl(120, 100%, 80%)' } }
              ]
            },
            {
              type: 'main',
              style: { padding: '32px', backgroundColor: 'hsl(120, 10%, 8%)' },
              children: [
                {
                  type: 'section',
                  title: '$ whoami',
                  style: { marginBottom: '24px', padding: '16px', backgroundColor: 'hsl(0, 0%, 0%)', border: '1px solid hsl(120, 100%, 25%)' },
                  children: [
                    { type: 'contact', style: { fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '4px' } }
                  ]
                },
                {
                  type: 'section',
                  title: '$ cat about.txt',
                  style: { marginBottom: '24px', padding: '16px', backgroundColor: 'hsl(0, 0%, 0%)', border: '1px solid hsl(120, 100%, 25%)' },
                  children: [
                    { type: 'text', content: '{{summary}}', style: { fontSize: '14px', lineHeight: '1.6' } }
                  ]
                },
                {
                  type: 'section',
                  title: '$ ls skills/',
                  style: { marginBottom: '24px', padding: '16px', backgroundColor: 'hsl(0, 0%, 0%)', border: '1px solid hsl(120, 100%, 25%)' },
                  children: [
                    { type: 'skills', style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '14px' } }
                  ]
                },
                { type: 'experience', titlePrefix: '$ cat experience.log', style: { marginBottom: '24px' } },
                { type: 'education', titlePrefix: '$ cat education.txt' }
              ]
            }
          ]
        },
        template: {},
        styles: {},
        is_premium: true
      },
      {
        name: 'GitHub Profile',
        description: 'Markdown-inspired design like a GitHub README',
        category: 'tech',
        json_content: {
          theme: {
            primaryColor: 'hsl(212, 100%, 48%)',
            secondaryColor: 'hsl(215, 58%, 25%)',
            accentColor: 'hsl(137, 55%, 70%)',
            backgroundColor: 'hsl(0, 0%, 98%)',
            textColor: 'hsl(215, 58%, 25%)',
            fontFamily: "-apple-system, 'Segoe UI', sans-serif"
          },
          sections: [
            {
              type: 'header',
              style: { padding: '32px', borderBottom: '1px solid hsl(210, 18%, 87%)' },
              children: [
                { type: 'text', content: '# {{contact.name}}', style: { fontSize: '40px', fontWeight: '600', marginBottom: '8px' } },
                { type: 'text', content: '### {{contact.title}}', style: { fontSize: '20px', color: 'hsl(215, 20%, 45%)' } }
              ]
            },
            {
              type: 'main',
              style: { padding: '32px', maxWidth: '1000px', margin: '0 auto' },
              children: [
                {
                  type: 'section',
                  title: '## 📫 Contact',
                  style: { marginBottom: '24px' },
                  children: [
                    { type: 'contact', style: { display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '14px', padding: '12px', backgroundColor: 'hsl(210, 29%, 97%)', borderRadius: '6px' } }
                  ]
                },
                {
                  type: 'section',
                  title: '## 👨‍💻 About Me',
                  style: { marginBottom: '24px' },
                  children: [
                    { type: 'text', content: '{{summary}}', style: { lineHeight: '1.7', fontSize: '15px' } }
                  ]
                },
                {
                  type: 'section',
                  title: '## 🛠️ Tech Stack',
                  style: { marginBottom: '24px' },
                  children: [
                    { type: 'skills', style: { display: 'flex', flexWrap: 'wrap', gap: '8px' } }
                  ]
                },
                { type: 'experience', titlePrefix: '## 💼 Experience', style: { marginBottom: '24px' } },
                { type: 'education', titlePrefix: '## 🎓 Education' }
              ]
            }
          ]
        },
        template: {},
        styles: {},
        is_premium: false
      },
      {
        name: 'Gradient Tech',
        description: 'Modern gradient design with vibrant colors',
        category: 'tech',
        json_content: {
          theme: {
            primaryColor: 'hsl(271, 100%, 60%)',
            secondaryColor: 'hsl(197, 100%, 63%)',
            accentColor: 'hsl(340, 100%, 65%)',
            backgroundColor: 'hsl(240, 20%, 12%)',
            textColor: 'hsl(0, 0%, 95%)',
            fontFamily: "'Poppins', 'Arial', sans-serif"
          },
          sections: [
            {
              type: 'header',
              style: { 
                background: 'linear-gradient(135deg, hsl(271, 100%, 60%), hsl(197, 100%, 63%))', 
                padding: '48px 32px',
                clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)'
              },
              children: [
                { type: 'text', content: '{{contact.name}}', style: { fontSize: '44px', fontWeight: '700', color: 'white' } },
                { type: 'text', content: '{{contact.title}}', style: { fontSize: '20px', marginTop: '8px', color: 'hsla(0, 0%, 100%, 0.9)' } },
                { type: 'contact', style: { marginTop: '16px', fontSize: '14px', color: 'hsla(0, 0%, 100%, 0.85)' } }
              ]
            },
            {
              type: 'main',
              style: { padding: '32px' },
              children: [
                {
                  type: 'section',
                  title: 'Profile',
                  style: { marginBottom: '28px' },
                  children: [
                    { 
                      type: 'text', 
                      content: '{{summary}}', 
                      style: { 
                        lineHeight: '1.7', 
                        padding: '20px',
                        background: 'linear-gradient(135deg, hsla(271, 100%, 60%, 0.1), hsla(197, 100%, 63%, 0.1))',
                        borderRadius: '12px',
                        borderLeft: '4px solid hsl(271, 100%, 60%)'
                      } 
                    }
                  ]
                },
                {
                  type: 'section',
                  title: 'Skills',
                  style: { marginBottom: '28px' },
                  children: [
                    { type: 'skills', style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' } }
                  ]
                },
                { type: 'experience', titlePrefix: 'Experience', style: { marginBottom: '28px' } },
                { type: 'education', titlePrefix: 'Education' }
              ]
            }
          ]
        },
        template: {},
        styles: {},
        is_premium: true
      },
      {
        name: 'Boxed Developer',
        description: 'Card-based layout with distinct sections',
        category: 'tech',
        json_content: {
          theme: {
            primaryColor: 'hsl(217, 91%, 60%)',
            secondaryColor: 'hsl(158, 64%, 52%)',
            accentColor: 'hsl(45, 100%, 51%)',
            backgroundColor: 'hsl(220, 18%, 20%)',
            textColor: 'hsl(0, 0%, 90%)',
            fontFamily: "'Roboto', 'Arial', sans-serif"
          },
          sections: [
            {
              type: 'header',
              style: { backgroundColor: 'hsl(217, 91%, 60%)', color: 'white', padding: '40px', textAlign: 'center' },
              children: [
                { type: 'text', content: '{{contact.name}}', style: { fontSize: '42px', fontWeight: '700', marginBottom: '8px' } },
                { type: 'text', content: '{{contact.title}}', style: { fontSize: '18px', opacity: '0.95' } }
              ]
            },
            {
              type: 'main',
              style: { padding: '32px', display: 'grid', gap: '20px' },
              children: [
                {
                  type: 'section',
                  title: 'Contact Information',
                  style: { backgroundColor: 'hsl(220, 18%, 25%)', padding: '20px', borderRadius: '8px', border: '1px solid hsl(220, 18%, 30%)' },
                  children: [
                    { type: 'contact', style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '14px' } }
                  ]
                },
                {
                  type: 'section',
                  title: 'Professional Summary',
                  style: { backgroundColor: 'hsl(220, 18%, 25%)', padding: '20px', borderRadius: '8px', border: '1px solid hsl(220, 18%, 30%)' },
                  children: [
                    { type: 'text', content: '{{summary}}', style: { lineHeight: '1.7' } }
                  ]
                },
                {
                  type: 'section',
                  title: 'Technical Skills',
                  style: { backgroundColor: 'hsl(220, 18%, 25%)', padding: '20px', borderRadius: '8px', border: '1px solid hsl(220, 18%, 30%)' },
                  children: [
                    { type: 'skills', style: { display: 'flex', flexWrap: 'wrap', gap: '10px' } }
                  ]
                },
                {
                  type: 'section',
                  title: 'Work Experience',
                  style: { backgroundColor: 'hsl(220, 18%, 25%)', padding: '20px', borderRadius: '8px', border: '1px solid hsl(220, 18%, 30%)' },
                  children: [
                    { type: 'experience' }
                  ]
                },
                {
                  type: 'section',
                  title: 'Education',
                  style: { backgroundColor: 'hsl(220, 18%, 25%)', padding: '20px', borderRadius: '8px', border: '1px solid hsl(220, 18%, 30%)' },
                  children: [
                    { type: 'education' }
                  ]
                }
              ]
            }
          ]
        },
        template: {},
        styles: {},
        is_premium: false
      },
      {
        name: 'Split Dev',
        description: 'Bold split-screen design with contrasting sections',
        category: 'tech',
        json_content: {
          theme: {
            primaryColor: 'hsl(14, 100%, 57%)',
            secondaryColor: 'hsl(195, 100%, 39%)',
            accentColor: 'hsl(48, 100%, 50%)',
            backgroundColor: 'hsl(0, 0%, 100%)',
            textColor: 'hsl(0, 0%, 20%)',
            fontFamily: "'Montserrat', 'Arial', sans-serif"
          },
          sections: [
            {
              type: 'columns',
              style: { display: 'flex', minHeight: '100vh' },
              children: [
                {
                  type: 'sidebar',
                  style: { width: '40%', backgroundColor: 'hsl(195, 100%, 39%)', color: 'white', padding: '40px' },
                  children: [
                    { type: 'text', content: '{{contact.name}}', style: { fontSize: '36px', fontWeight: '700', marginBottom: '12px' } },
                    { type: 'text', content: '{{contact.title}}', style: { fontSize: '18px', marginBottom: '32px', opacity: '0.9' } },
                    {
                      type: 'section',
                      title: 'Contact',
                      style: { marginBottom: '32px', paddingBottom: '24px', borderBottom: '2px solid hsla(0, 0%, 100%, 0.3)' },
                      children: [
                        { type: 'contact', style: { fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' } }
                      ]
                    },
                    {
                      type: 'section',
                      title: 'Skills',
                      style: { marginBottom: '32px' },
                      children: [
                        { type: 'skills', style: { display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' } }
                      ]
                    },
                    { type: 'education', titlePrefix: 'Education' }
                  ]
                },
                {
                  type: 'main',
                  style: { width: '60%', padding: '40px', backgroundColor: 'hsl(0, 0%, 98%)' },
                  children: [
                    {
                      type: 'section',
                      title: 'About Me',
                      style: { marginBottom: '32px', paddingBottom: '24px', borderBottom: '3px solid hsl(14, 100%, 57%)' },
                      children: [
                        { type: 'text', content: '{{summary}}', style: { lineHeight: '1.8', fontSize: '15px' } }
                      ]
                    },
                    { type: 'experience', titlePrefix: 'Experience' }
                  ]
                }
              ]
            }
          ]
        },
        template: {},
        styles: {},
        is_premium: true
      },
      {
        name: 'Dev Timeline',
        description: 'Timeline-based layout highlighting career progression',
        category: 'tech',
        json_content: {
          theme: {
            primaryColor: 'hsl(262, 90%, 60%)',
            secondaryColor: 'hsl(200, 100%, 45%)',
            accentColor: 'hsl(32, 100%, 50%)',
            backgroundColor: 'hsl(0, 0%, 97%)',
            textColor: 'hsl(0, 0%, 15%)',
            fontFamily: "'Nunito', 'Arial', sans-serif"
          },
          sections: [
            {
              type: 'header',
              style: { 
                background: 'linear-gradient(90deg, hsl(262, 90%, 60%), hsl(200, 100%, 45%))',
                color: 'white',
                padding: '40px',
                position: 'relative'
              },
              children: [
                { type: 'text', content: '{{contact.name}}', style: { fontSize: '46px', fontWeight: '800', marginBottom: '8px' } },
                { type: 'text', content: '{{contact.title}}', style: { fontSize: '20px', fontWeight: '300' } }
              ]
            },
            {
              type: 'main',
              style: { padding: '40px 32px' },
              children: [
                {
                  type: 'grid',
                  style: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', marginBottom: '32px' },
                  children: [
                    {
                      type: 'section',
                      title: 'Contact',
                      children: [
                        { type: 'contact', style: { fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' } }
                      ]
                    },
                    {
                      type: 'section',
                      title: 'Summary',
                      children: [
                        { type: 'text', content: '{{summary}}', style: { lineHeight: '1.7' } }
                      ]
                    }
                  ]
                },
                {
                  type: 'section',
                  title: 'Technical Skills',
                  style: { marginBottom: '32px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px hsla(0, 0%, 0%, 0.1)' },
                  children: [
                    { type: 'skills', style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '14px' } }
                  ]
                },
                {
                  type: 'section',
                  title: 'Career Timeline',
                  style: { 
                    borderLeft: '4px solid hsl(262, 90%, 60%)', 
                    paddingLeft: '32px',
                    marginBottom: '32px'
                  },
                  children: [
                    { type: 'experience' }
                  ]
                },
                {
                  type: 'section',
                  title: 'Education',
                  style: { padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px hsla(0, 0%, 0%, 0.1)' },
                  children: [
                    { type: 'education' }
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
