

## Plan: Create 6 Rendered Markdown Resume Templates with Distinct Styling

### Overview
Create 6 professionally designed resume templates that use **Mustache-templated Markdown** rendered via `react-markdown` (already installed). Each template will have a unique visual style achieved through custom CSS applied to the rendered markdown output.

### Template Collection

| # | Template Name | Style Description | Color Scheme |
|---|---------------|-------------------|--------------|
| 1 | **Clean Minimal** | Ultra-clean, lots of whitespace, subtle dividers | Slate gray + Blue accent |
| 2 | **Bold Executive** | Strong headers, bordered sections, formal | Navy + Gold accent |
| 3 | **Modern Gradient** | Gradient header, rounded skill badges | Indigo to Purple gradient |
| 4 | **Classic Professional** | Traditional serif fonts, underlined sections | Black + Burgundy accent |
| 5 | **Tech Terminal** | Monospace font, code-style formatting | Dark gray + Green accent |
| 6 | **Elegant Sidebar** | Left color bar accent, contemporary layout | Teal + Coral accent |

### Architecture

```text
+-------------------+     +----------------------+     +------------------+
| resume_templates  | --> | MarkdownRenderer.tsx | --> | Styled HTML      |
| (DB: json_content)|     | (Mustache + remark)  |     | (Custom CSS)     |
+-------------------+     +----------------------+     +------------------+
        |                          |
        v                          v
  markdown_template         ResumeData props
  theme config              injected via Mustache
  custom CSS
```

### Database Schema (json_content structure)

Each template will store its configuration in the `json_content` column:

```json
{
  "type": "markdown",
  "markdown_template": "# {{contact.name}}\n**{{contact.title}}**\n...",
  "theme": {
    "primaryColor": "#1e293b",
    "accentColor": "#3b82f6",
    "fontFamily": "Inter, sans-serif",
    "headingFont": "Inter, sans-serif"
  },
  "css": ".resume-md h1 { font-size: 2rem; ... }"
}
```

### Implementation Steps

**Step 1: Create MarkdownResumeRenderer Component**

New file: `src/components/templates/MarkdownResumeRenderer.tsx`

This component will:
- Accept template config (markdown_template, theme, css) and ResumeData
- Use Mustache to inject resume data into the markdown template
- Render the processed markdown using `react-markdown`
- Apply custom CSS styling from the template config
- Support scale prop for thumbnail previews

**Step 2: Update CanvaStyleRenderer to Detect Markdown Templates**

Modify `src/components/templates/CanvaStyleRenderer.tsx` to:
- Check if `template.type === 'markdown'`
- Delegate rendering to the new `MarkdownResumeRenderer` component
- Pass through scale and data props

**Step 3: Update TemplateThumbnail for Markdown Support**

Modify `src/components/dashboard/TemplateThumbnail.tsx` to:
- Detect markdown template type
- Render appropriately scaled preview

**Step 4: Create Database Migration with 6 Templates**

New migration: `supabase/migrations/[timestamp]_seed_markdown_templates.sql`

Insert 6 templates with unique markdown and CSS styling.

### Template Markdown Structure (Sample)

```markdown
# {{contact.name}}
**{{contact.title}}**

{{contact.email}} | {{contact.phone}} | {{contact.location}}
{{#contact.linkedin}}| [LinkedIn]({{contact.linkedin}}){{/contact.linkedin}}

---

## Professional Summary

{{summary}}

---

## Experience

{{#experience}}
### {{title}}
**{{company}}** | {{startDate}} - {{endDate}}

{{#responsibilities}}
- {{.}}
{{/responsibilities}}

{{/experience}}

---

## Education

{{#education}}
**{{degree}}** - {{institution}} ({{startYear}} - {{endYear}})
{{/education}}

---

## Skills

{{#skills}}{{.}}{{^last}} | {{/last}}{{/skills}}
```

### Individual Template Designs

#### 1. Clean Minimal
- **Font**: Inter, sans-serif
- **Colors**: text-slate-800, accent-blue-500
- **CSS**: Large h1, minimal borders, generous line-height, subtle horizontal rules

#### 2. Bold Executive
- **Font**: Georgia, serif (headings), Arial (body)
- **Colors**: Navy (#0f172a), Gold (#b45309) accent
- **CSS**: Bold uppercase section headers, box borders, formal spacing

#### 3. Modern Gradient
- **Font**: Poppins, sans-serif
- **Colors**: Indigo-to-purple gradient header
- **CSS**: Rounded skill badges, gradient top banner, contemporary cards

#### 4. Classic Professional
- **Font**: Times New Roman, serif
- **Colors**: Black text, Burgundy (#881337) accent
- **CSS**: Underlined section headers, traditional layout, conservative styling

#### 5. Tech Terminal
- **Font**: JetBrains Mono, monospace
- **Colors**: Dark gray (#1f2937), Green (#22c55e) accent
- **CSS**: Code-style bullets, terminal-inspired headers, monospace throughout

#### 6. Elegant Sidebar
- **Font**: Lato, sans-serif
- **Colors**: Teal (#0d9488), Coral (#f97316) accent
- **CSS**: Left color bar, two-tone section headers, modern geometric feel

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/components/templates/MarkdownResumeRenderer.tsx` | Create | New markdown template renderer with Mustache + react-markdown |
| `src/components/templates/CanvaStyleRenderer.tsx` | Modify | Add markdown type detection and delegation |
| `src/components/dashboard/TemplateThumbnail.tsx` | Modify | Support markdown template preview |
| `supabase/migrations/[timestamp]_seed_markdown_templates.sql` | Create | Insert 6 markdown templates |

### Technical Details

**MarkdownResumeRenderer Component Structure:**
```tsx
interface MarkdownTemplateConfig {
  type: 'markdown';
  markdown_template: string;
  theme: {
    primaryColor: string;
    accentColor: string;
    fontFamily: string;
    headingFont?: string;
  };
  css: string;
}

// Injects ResumeData into Mustache template
// Renders with ReactMarkdown
// Applies scoped CSS via style tag
```

**Benefits of Rendered Markdown:**
1. **ATS-Optimized** - Clean semantic HTML output (h1, h2, p, ul, li)
2. **Maintainable** - Human-readable template format
3. **Flexible Styling** - Full CSS control per template
4. **Fast Rendering** - Less JavaScript processing than complex React components
5. **Export-Friendly** - Clean HTML for PDF/DOCX conversion

