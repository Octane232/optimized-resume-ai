-- Delete 4 tech templates (keeping best 6)
DELETE FROM resume_templates 
WHERE id IN (
  'eae59328-13e1-4848-b5b8-5275d2965726',  -- Boxed Developer
  '3179d81a-94b6-411c-8bed-d8ac52d4751d',  -- Dev Timeline
  '72945754-c4ce-42ab-a5a7-319a860c5bbd',  -- Neon Dev
  'f00c47b2-b458-418b-8cb1-a06dc889ea3c'   -- Split Dev
);

-- Update remaining templates with proper template and styles fields
UPDATE resume_templates
SET 
  template = json_content,
  styles = CASE name
    WHEN 'Terminal Pro' THEN '{"font": "JetBrains Mono", "primaryColor": "#22c55e", "backgroundColor": "#1c1c1c"}'::jsonb
    WHEN 'Code Editor' THEN '{"font": "Fira Code", "primaryColor": "#60a5fa", "backgroundColor": "#1e293b"}'::jsonb
    WHEN 'Minimal Dev' THEN '{"font": "Inter", "primaryColor": "#1a1a1a", "backgroundColor": "#ffffff"}'::jsonb
    WHEN 'GitHub Profile' THEN '{"font": "system-ui", "primaryColor": "#0969da", "backgroundColor": "#f6f8fa"}'::jsonb
    WHEN 'Matrix' THEN '{"font": "Courier New", "primaryColor": "#00ff00", "backgroundColor": "#000000"}'::jsonb
    WHEN 'Gradient Tech' THEN '{"font": "Poppins", "primaryColor": "#a855f7", "backgroundColor": "#1e1b2e"}'::jsonb
  END
WHERE category = 'tech' AND name IN ('Terminal Pro', 'Code Editor', 'Minimal Dev', 'GitHub Profile', 'Matrix', 'Gradient Tech');