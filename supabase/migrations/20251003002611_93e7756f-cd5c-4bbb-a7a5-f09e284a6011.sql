-- Update the first template with the preview image
UPDATE resume_templates 
SET preview_image = '/templates/modern-template-preview.jpg'
WHERE id = (SELECT id FROM resume_templates ORDER BY created_at DESC LIMIT 1);