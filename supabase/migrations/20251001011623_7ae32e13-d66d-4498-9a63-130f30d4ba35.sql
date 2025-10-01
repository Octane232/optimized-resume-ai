-- Drop the html_content column and add json_content
ALTER TABLE public.resume_templates 
DROP COLUMN IF EXISTS html_content;

ALTER TABLE public.resume_templates 
ADD COLUMN json_content jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Add template layout type column for Canva-style themes
ALTER TABLE public.resume_templates 
ADD COLUMN layout_type text DEFAULT 'modern';

-- Add style settings column
ALTER TABLE public.resume_templates 
ADD COLUMN style_settings jsonb DEFAULT '{}'::jsonb;

-- Update existing templates to use JSON format (sample data)
UPDATE public.resume_templates
SET json_content = '{
  "layout": "modern",
  "theme": {
    "primaryColor": "#3B82F6",
    "secondaryColor": "#1E40AF",
    "accentColor": "#F59E0B",
    "backgroundColor": "#FFFFFF",
    "textColor": "#1F2937",
    "fontFamily": "Inter"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "padding": "48px",
        "backgroundColor": "gradient",
        "textAlign": "center"
      },
      "content": {
        "name": "{{fullName}}",
        "title": "{{title}}",
        "contact": {
          "email": "{{email}}",
          "phone": "{{phone}}",
          "location": "{{location}}",
          "linkedin": "{{linkedin}}"
        }
      }
    },
    {
      "id": "summary",
      "type": "summary",
      "style": {
        "padding": "24px",
        "fontSize": "16px"
      },
      "content": {
        "text": "{{summary}}"
      }
    },
    {
      "id": "experience",
      "type": "experience",
      "style": {
        "padding": "24px",
        "itemSpacing": "24px"
      },
      "content": {
        "items": "{{experiences}}"
      }
    },
    {
      "id": "skills",
      "type": "skills",
      "style": {
        "padding": "24px",
        "display": "tags",
        "columns": 3
      },
      "content": {
        "items": "{{skills}}"
      }
    },
    {
      "id": "education",
      "type": "education",
      "style": {
        "padding": "24px",
        "itemSpacing": "16px"
      },
      "content": {
        "items": "{{education}}"
      }
    }
  ]
}'::jsonb,
style_settings = '{
  "paperSize": "A4",
  "margins": {
    "top": 20,
    "right": 20,
    "bottom": 20,
    "left": 20
  },
  "spacing": {
    "section": 32,
    "item": 16,
    "line": 1.5
  },
  "typography": {
    "headingSize": 32,
    "subheadingSize": 20,
    "bodySize": 14,
    "smallSize": 12
  }
}'::jsonb
WHERE name IN ('Modern', 'Classic', 'Creative', 'Executive');

-- Insert new Canva-style templates
INSERT INTO public.resume_templates (name, category, description, json_content, layout_type, style_settings, is_popular, color_class)
VALUES 
('Canva Minimal', 'minimal', 'Clean and minimalist design inspired by Canva', 
'{
  "layout": "minimal",
  "theme": {
    "primaryColor": "#000000",
    "secondaryColor": "#6B7280",
    "accentColor": "#EF4444",
    "backgroundColor": "#FFFFFF",
    "textColor": "#111827",
    "fontFamily": "Helvetica"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "padding": "32px",
        "borderBottom": "2px solid #E5E7EB",
        "textAlign": "left"
      }
    },
    {
      "id": "columns",
      "type": "columns",
      "columns": [
        {
          "width": "30%",
          "sections": ["contact", "skills", "languages"]
        },
        {
          "width": "70%",
          "sections": ["summary", "experience", "education", "projects"]
        }
      ]
    }
  ]
}'::jsonb, 'minimal', 
'{
  "paperSize": "A4",
  "colorScheme": "monochrome",
  "designStyle": "minimal"
}'::jsonb, true, 'from-gray-500 to-gray-600'),

('Canva Colorful', 'creative', 'Vibrant and colorful design with modern layout', 
'{
  "layout": "colorful",
  "theme": {
    "primaryColor": "#8B5CF6",
    "secondaryColor": "#EC4899",
    "accentColor": "#F59E0B",
    "backgroundColor": "#FEF3C7",
    "textColor": "#1F2937",
    "fontFamily": "Poppins"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "padding": "64px",
        "background": "gradient-radial",
        "textAlign": "center",
        "borderRadius": "24px"
      }
    },
    {
      "id": "grid",
      "type": "grid",
      "columns": 2,
      "gap": "32px",
      "sections": ["summary", "skills", "experience", "education"]
    }
  ]
}'::jsonb, 'colorful',
'{
  "paperSize": "A4",
  "colorScheme": "vibrant",
  "designStyle": "creative"
}'::jsonb, false, 'from-purple-500 to-pink-500'),

('Canva Professional', 'professional', 'Sophisticated design for executives', 
'{
  "layout": "professional",
  "theme": {
    "primaryColor": "#0F172A",
    "secondaryColor": "#475569",
    "accentColor": "#0EA5E9",
    "backgroundColor": "#F8FAFC",
    "textColor": "#0F172A",
    "fontFamily": "Georgia"
  },
  "sections": [
    {
      "id": "sidebar",
      "type": "sidebar",
      "position": "left",
      "width": "35%",
      "backgroundColor": "#0F172A",
      "textColor": "#FFFFFF",
      "sections": ["photo", "contact", "skills", "certifications"]
    },
    {
      "id": "main",
      "type": "main",
      "sections": ["header", "summary", "experience", "education", "achievements"]
    }
  ]
}'::jsonb, 'professional',
'{
  "paperSize": "A4",
  "colorScheme": "professional",
  "designStyle": "executive"
}'::jsonb, true, 'from-slate-700 to-slate-900');