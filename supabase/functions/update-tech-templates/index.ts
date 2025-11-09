import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const techTemplates = [
      {
        name: 'Terminal Pro',
        json_content: {
          theme: {
            primaryColor: 'hsl(142, 76%, 36%)',
            secondaryColor: 'hsl(0, 0%, 15%)',
            accentColor: 'hsl(142, 71%, 45%)',
            backgroundColor: 'hsl(220, 13%, 13%)',
            textColor: 'hsl(142, 76%, 80%)',
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
                    { type: 'text', content: '{{summary}}', style: { backgroundColor: 'hsl(0, 0%, 15%)', padding: '16px', borderLeft: '4px solid hsl(142, 76%, 36%)', borderRadius: '4px' } }
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
                { type: 'projects', titlePrefix: '> Projects', style: { marginBottom: '24px' } },
                { type: 'education', titlePrefix: '> Education' }
              ]
            }
          ]
        }
      },
      {
        name: 'Code Editor',
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
                    { type: 'contact', style: { fontSize: '13px', marginBottom: '24px' } },
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
                  style: { width: '65%', backgroundColor: 'hsl(230, 21%, 11%)', padding: '32px' },
                  children: [
                    {
                      type: 'section',
                      title: '/* About */',
                      style: { marginBottom: '24px' },
                      children: [
                        { type: 'text', content: '{{summary}}', style: { lineHeight: '1.6' } }
                      ]
                    },
                    { type: 'experience', titlePrefix: '/* Experience */', style: { marginBottom: '24px' } },
                    { type: 'projects', titlePrefix: '/* Projects */' }
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        name: 'Minimal Dev',
        json_content: {
          theme: {
            primaryColor: 'hsl(0, 0%, 10%)',
            secondaryColor: 'hsl(0, 0%, 40%)',
            accentColor: 'hsl(0, 0%, 20%)',
            backgroundColor: 'hsl(0, 0%, 100%)',
            textColor: 'hsl(0, 0%, 10%)',
            fontFamily: "'Inter', -apple-system, sans-serif"
          },
          sections: [
            {
              type: 'header',
              style: { padding: '40px 32px 24px 32px', borderBottom: '2px solid hsl(0, 0%, 10%)' },
              children: [
                { type: 'text', content: '{{contact.name}}', style: { fontSize: '48px', fontWeight: '700', marginBottom: '8px' } },
                { type: 'text', content: '{{contact.title}}', style: { fontSize: '20px', color: 'hsl(0, 0%, 40%)' } }
              ]
            },
            {
              type: 'main',
              style: { padding: '32px', maxWidth: '900px', margin: '0 auto' },
              children: [
                { type: 'contact', style: { display: 'flex', gap: '24px', fontSize: '14px', color: 'hsl(0, 0%, 40%)', marginBottom: '32px' } },
                {
                  type: 'section',
                  title: 'About',
                  style: { marginBottom: '32px' },
                  children: [
                    { type: 'text', content: '{{summary}}', style: { fontSize: '15px', lineHeight: '1.8' } }
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
                { type: 'projects', titlePrefix: 'Projects', style: { marginBottom: '32px' } },
                { type: 'education', titlePrefix: 'Education' }
              ]
            }
          ]
        }
      },
      {
        name: 'GitHub Profile',
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
                    { type: 'contact', style: { display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '12px', backgroundColor: 'hsl(210, 29%, 97%)', borderRadius: '6px', fontSize: '14px' } }
                  ]
                },
                {
                  type: 'section',
                  title: '## 👨‍💻 About Me',
                  style: { marginBottom: '24px' },
                  children: [
                    { type: 'text', content: '{{summary}}', style: { fontSize: '15px', lineHeight: '1.7' } }
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
                { type: 'projects', titlePrefix: '## 🚀 Projects', style: { marginBottom: '24px' } },
                { type: 'education', titlePrefix: '## 🎓 Education' }
              ]
            }
          ]
        }
      },
      {
        name: 'Matrix',
        json_content: {
          theme: {
            primaryColor: 'hsl(120, 100%, 50%)',
            secondaryColor: 'hsl(120, 100%, 80%)',
            accentColor: 'hsl(120, 100%, 40%)',
            backgroundColor: 'hsl(120, 10%, 8%)',
            textColor: 'hsl(120, 100%, 80%)',
            fontFamily: "'Courier New', 'Consolas', monospace"
          },
          sections: [
            {
              type: 'header',
              style: { padding: '32px', backgroundColor: 'hsl(120, 100%, 25%)', borderBottom: '2px solid hsl(120, 100%, 40%)' },
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
                    { type: 'contact', style: { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px' } }
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
                { type: 'projects', titlePrefix: '$ ls projects/', style: { marginBottom: '24px' } },
                { type: 'education', titlePrefix: '$ cat education.txt' }
              ]
            }
          ]
        }
      },
      {
        name: 'Gradient Tech',
        json_content: {
          theme: {
            primaryColor: 'hsl(271, 100%, 60%)',
            secondaryColor: 'hsl(197, 100%, 63%)',
            accentColor: 'hsl(271, 76%, 53%)',
            backgroundColor: 'hsl(0, 0%, 100%)',
            textColor: 'hsl(220, 13%, 18%)',
            fontFamily: "'Poppins', -apple-system, sans-serif"
          },
          sections: [
            {
              type: 'header',
              style: { padding: '48px 32px', background: 'linear-gradient(135deg, hsl(271, 100%, 60%), hsl(197, 100%, 63%))', clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)' },
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
                    { type: 'text', content: '{{summary}}', style: { padding: '20px', borderLeft: '4px solid hsl(271, 100%, 60%)', borderRadius: '12px', background: 'linear-gradient(135deg, hsla(271, 100%, 60%, 0.1), hsla(197, 100%, 63%, 0.1))', lineHeight: '1.7' } }
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
                { type: 'projects', titlePrefix: 'Projects', style: { marginBottom: '28px' } },
                { type: 'education', titlePrefix: 'Education' }
              ]
            }
          ]
        }
      }
    ];

    // Update each template
    for (const template of techTemplates) {
      const { error } = await supabase
        .from('resume_templates')
        .update({ 
          json_content: template.json_content,
          template: template.json_content 
        })
        .eq('name', template.name)
        .eq('category', 'tech');

      if (error) {
        console.error(`Error updating ${template.name}:`, error);
        throw error;
      }
    }

    return new Response(
      JSON.stringify({ message: 'Tech templates updated successfully', count: techTemplates.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
