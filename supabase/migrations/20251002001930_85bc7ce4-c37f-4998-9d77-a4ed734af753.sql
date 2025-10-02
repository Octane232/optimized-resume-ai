-- Enable RLS on resume_templates if not already enabled
ALTER TABLE resume_templates ENABLE ROW LEVEL SECURITY;

-- Allow all users to view templates (they're meant to be public)
CREATE POLICY "Anyone can view templates" 
ON resume_templates 
FOR SELECT 
USING (true);

-- Optional: Add a policy for admins to manage templates (if needed later)
CREATE POLICY "Service role can manage templates" 
ON resume_templates 
FOR ALL 
USING (true) 
WITH CHECK (true);