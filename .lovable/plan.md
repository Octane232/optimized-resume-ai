# Preserve Resume Design During Optimization

## Goal
Make optimization change resume wording only. The downloaded DOCX must retain the uploaded template’s fonts, bold text, spacing, layout, and other styling, with no visible Markdown symbols such as `**text**`.

## Changes
- Strengthen the suggestion instructions so generated replacements are plain text only, without Markdown or formatting commands.
- Sanitize generated and manually edited replacements before previewing or applying them, removing Markdown wrappers while retaining the words.
- Update DOCX replacement logic to distribute replacement text across the paragraph’s existing styled text runs instead of placing everything in the first run. This preserves bold, italic, font, size, color, and template structure as closely as possible.
- Make the design-preserving DOCX the only optimized download path so optimization never rebuilds the resume as a plain template.

## Verification
- Test a DOCX paragraph containing mixed regular and bold text.
- Confirm optimization preserves the document package and run formatting, while the replacement contains no `**` markers.
- Check the project build after the change.

## Technical details
The Word file remains the original DOCX ZIP package. Only text nodes in `word/document.xml` are updated; paragraph and run properties are retained. Replacement text will be assigned proportionally across existing text runs so styling boundaries remain present.
