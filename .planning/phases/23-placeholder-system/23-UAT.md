---
status: complete
phase: 23-placeholder-system
source: 23-01-SUMMARY.md
started: 2026-03-01T18:00:00Z
updated: 2026-03-01T18:15:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Placeholders section appears in brief
expected: Generate a brief from any Figma design. The brief output should contain a "## Placeholders" section appearing after the "## Assets" section. It should be the last section in the brief.
result: pass

### 2. Detection criteria instructs Claude Code what to look for
expected: The Placeholders section tells Claude Code to compare the preview image against the Assets table and identify elements that appear to be photographs, logos, icons, or illustrations but have no matching file in the Assets table. It should say to only flag clearly visible elements — skip uncertain cases.
result: pass

### 3. Placeholder box styling instructions
expected: The section instructs Claude Code to create dashed-border (2px dashed) placeholder boxes with a muted color that fits the site's design context, a light semi-transparent background tint, centered label with reference name and dimensions, and sizing that matches the element's intended dimensions from the layout.
result: pass

### 4. Bracketed reference naming convention
expected: The section defines a naming system using square brackets — descriptive names like [hero-bg], [team-photo], [social-linkedin-icon]. Duplicate element types should be auto-numbered: [team-photo-1], [team-photo-2]. The label inside the box shows the name plus dimensions, e.g. "[hero-bg] 1200x600".
result: pass

### 5. Placeholder summary table format
expected: The section instructs Claude Code to output a summary table after building, with columns: Reference | Description | Expected Size. An example row should be shown (e.g., [hero-bg] | Hero section background image | 1200x600).
result: pass

### 6. Follow-up workflow examples
expected: The section includes 1-2 example prompts showing users how to replace placeholders, such as "Replace [hero-bg] with hero.jpg" or "Replace [social-linkedin-icon] with this SVG file".
result: pass

### 7. Instructions updated — no more "ask the user"
expected: The "How to Use This Brief" section no longer says "ask the user rather than substituting or fabricating a replacement." Instead, it references the Placeholders section — something like "create a placeholder box instead — see the Placeholders section below."
result: pass

## Summary

total: 7
passed: 7
issues: 0
pending: 0
skipped: 0

## Gaps

[none]
