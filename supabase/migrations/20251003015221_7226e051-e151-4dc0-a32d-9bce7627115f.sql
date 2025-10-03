-- Update all templates to be in the modern category with proper organization

UPDATE public.resume_templates 
SET category = 'modern'
WHERE name IN (
  'Blue Modern Professional',
  'Purple Creative Gradient',
  'Minimalist Clean',
  'Teal Tech Modern',
  'Elegant Rose Gold',
  'Bold Orange Creative',
  'Navy Corporate Elite',
  'Indigo Executive Prestige',
  'Emerald Business Pro',
  'Red Bold Impact'
);

-- Update descriptions to emphasize modern styling
UPDATE public.resume_templates 
SET description = 'Modern blue gradient header with sidebar layout - perfect for professional careers'
WHERE name = 'Blue Modern Professional';

UPDATE public.resume_templates 
SET description = 'Modern purple gradient with grid layout - ideal for creative professionals'
WHERE name = 'Purple Creative Gradient';

UPDATE public.resume_templates 
SET description = 'Modern ultra-clean design with perfect spacing - timeless and professional'
WHERE name = 'Minimalist Clean';

UPDATE public.resume_templates 
SET description = 'Modern teal gradient with geometric sections - perfect for tech roles'
WHERE name = 'Teal Tech Modern';

UPDATE public.resume_templates 
SET description = 'Modern rose gold accents with elegant typography - sophisticated and stylish'
WHERE name = 'Elegant Rose Gold';

UPDATE public.resume_templates 
SET description = 'Modern vibrant orange with dynamic cards - bold and attention-grabbing'
WHERE name = 'Bold Orange Creative';

UPDATE public.resume_templates 
SET description = 'Modern navy design with luxury feel - premium corporate presentation'
WHERE name = 'Navy Corporate Elite';

UPDATE public.resume_templates 
SET description = 'Modern indigo gradient with luxury cards - distinguished executive style'
WHERE name = 'Indigo Executive Prestige';

UPDATE public.resume_templates 
SET description = 'Modern emerald green with clean layout - fresh professional approach'
WHERE name = 'Emerald Business Pro';

UPDATE public.resume_templates 
SET description = 'Modern red gradient with asymmetric layout - eye-catching and bold'
WHERE name = 'Red Bold Impact';