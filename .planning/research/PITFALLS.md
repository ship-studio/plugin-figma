# Pitfalls Research: v1.1 Figma Extraction Plugin

**Milestone:** v1.1 Brief Quality & UX (asset detection, instruction engineering, UX simplification)
**Researched:** 2026-02-28
**Confidence:** HIGH

This research identifies common mistakes when ADDING smarter asset detection, brief instruction engineering, and UX simplification to the existing Figma extraction plugin. The plugin currently works for ~80% of cases. The goal is to close the remaining 20% gap without breaking what already works.

---

## Critical Pitfalls

### Pitfall 1: Over-Exporting Everything as Images

**What goes wrong:**
Heuristic for "what should be exported as an image" is too aggressive. Plugin exports every group, vector, or nested structure as a PNG, bloating the brief and asset directory. Claude Code receives 50+ asset files instead of 10, making it harder to understand which asset goes where. Many exports are unnecessary (simple text with background color that could be semantic HTML).

**Why it happens:**
The intent is to catch complex illustrations that were previously described textually (the core v1.0 gap). But determining "complex enough to export" requires nuanced heuristics:
- Is a 3-layer group with 2 vectors + text "complex"?
- Is a button with drop shadow alone worth exporting?
- Is a simple icon really unsalvageable as SVG?

Developers lean toward "safe" by exporting everything, betting that more context is better. This backfires—Claude Code gets confused by asset overload.

**How to avoid:**
- Define explicit heuristics BEFORE implementation:
  - Only export groups with 3+ nested children AND at least one of: gradient, mask, blur, complex path
  - Never export single rectangles, circles, or text layers
  - Only export illustrations/complex compositions; not UI chrome (buttons, cards, etc.)
- Test heuristics on diverse designs: simple app UI, complex illustration pages, design systems
- Measure: track "% of exported assets used in brief" across test files. Aim for >80%.
- Add debug mode showing WHY each asset was exported

**Warning signs:**
- Asset directory has >30 files for a single design
- Brief mentions only 5-10 assets but 30 are exported
- Claude Code reports "too many image options, unclear which to use"
- SVG icons are exported as PNG instead of staying as SVG
- Simple UI elements (buttons, cards, text) are exported as images

**Phase to address:**
Asset detection heuristics must be validated in a dedicated testing phase BEFORE merging. Phase: "Asset Detection Validation"

---

### Pitfall 2: Under-Exporting Complex Compositions

**What goes wrong:**
Heuristics are too conservative. Complex nested illustrations (10+ layers of vectors, groups, paths) still aren't detected as "export as image." Plugin describes them textually, Claude Code tries to recreate from description and fabricates a replacement.

This is the CORE v1.0 problem the milestone is trying to solve.

**Why it happens:**
Hard to predict what "complex" means without domain knowledge. Same 5-layer structure might be:
- Complex illustration that needs export
- Button component that doesn't

Context matters—developers build heuristics without real examples, then realize they missed cases during testing.

**How to avoid:**
- Collect 5-10 real Figma files where v1.0 "failed" (exported as text, Claude Code fabricated)
- Analyze: what do problem cases have in common? (depth? vector count? node types?)
- Build heuristic FROM these examples, not from theory
- During testing, specifically validate: "all v1.0 problem cases now export as images"
- Add manual override: UI button "export this frame as image" for edge cases

**Warning signs:**
- Testing finds cases where complex illustrations still export as text
- Claude Code still fabricating replacements on certain design types
- Brief mentions "nested vector group" but no corresponding image
- Heuristics feel arbitrary

**Phase to address:**
Heuristic design phase must include real problem cases. Phase: "Asset Detection Design"

---

### Pitfall 3: Instructions Too Long, Too Conflicting, or Not Followed

**What goes wrong:**
Brief includes 5+ detailed instructions for Claude Code. Claude Code follows some but ignores others. Instructions conflict subtly ("enter plan mode" + "ask clarifying questions" can mean different flows). Result: Brief feels prescriptive but Claude Code doesn't actually follow all of it.

**Why it happens:**
More explicit instructions don't always mean better outcomes. According to Claude's prompt engineering docs:
- Long instruction lists cause models to "lose" instructions in the noise
- Instructions should be concise, prioritized, and conflict-free
- Too many process instructions can confuse agentic behavior

Developers add instructions to feel thorough, not realizing they're reducing compliance.

**How to avoid:**
- Limit instructions to 2-3 core behaviors (max 4)
- Prioritize: if instruction matters most for accuracy, it goes first
- Test instruction clarity before committing brief template
- Consider instructions as hypothesis, not gospel—verify with A/B testing
- Use example format, not imperative ("Good approach: ask clarifying questions..." vs "You MUST ask...")

**Warning signs:**
- Brief reads like a procedural manual (10+ steps)
- Claude Code behavior inconsistent
- Users report briefs feel "over-engineered" or "bossy"
- Instruction compliance drops as brief grows longer (>300 words)

**Phase to address:**
Brief instruction template testing phase. Phase: "Brief Instruction A/B Testing"

---

### Pitfall 4: Asset-to-Layout Mapping Is Incomplete or Confusing

**What goes wrong:**
Brief includes asset list and layout structure, but doesn't explicitly tie assets to layout positions. Claude Code sees layout and assets separately but doesn't know which asset goes where. Claude Code guesses, picks wrong asset, or uses multiple. Brief tried to help but failed.

**Why it happens:**
Asset mapping is hard because:
- Layout tree structure != asset file names
- Multiple assets can be relevant to same element
- Export process generates asset names; brief must reference them correctly
- Easy to misalign: brief says "header-icon.svg" but plugin exported "header_icon_2.svg"

Developers assume "if I include layout + assets, mapping is obvious" — it usually isn't.

**How to avoid:**
- Explicit mapping notation in brief: for each exported asset, include:
  - Asset file name (exact, matching export)
  - Where it belongs in layout (exact path)
  - Why it was exported
  - Fallback if not used
- Test mapping clarity: show asset table to someone unfamiliar with design. Can they identify where each asset goes?
- Validate: did Claude Code use all exported assets correctly?

**Warning signs:**
- Claude Code uses only 50% of exported assets
- Brief mentions asset but layout doesn't reference it (orphaned assets)
- Claude Code asks "where does this asset go?" in generated code
- Multiple assets seem to do the same job (redundant exports)

**Phase to address:**
Asset mapping notation + testing phase. Phase: "Asset-to-Layout Mapping Validation"

---

### Pitfall 5: UX Simplification Breaks Advanced Workflows

**What goes wrong:**
Plugin removes "advanced" options:
- No "choose extraction scope"
- No "asset settings"
- No "token deduplication options"
- No "preview PNG" checkbox

Power users needed these. New simplified UI prevents customization. Users can't refine briefs, must start over.

Or: simplification hides necessary information. Results screen shows only "Copy to clipboard" but doesn't show which assets were exported, which layers were skipped, or where files were saved.

**Why it happens:**
Simplification targets "most common case" — extract a frame, get a brief, done. But design extraction has legitimate advanced use cases:
- Extract subset of complex page
- Skip certain layers
- Customize token deduplication
- Verify what was exported before using brief

Removing options feels like progress but removes user control.

**How to avoid:**
- Separate concerns:
  - Quick path (default): Paste URL, click "Extract", get brief. Hide advanced options.
  - Advanced path (opt-in): Click "Options", reveal extraction scope, asset filtering, token settings
  - Hide, don't remove
- Information hiding (progressive disclosure):
  - Results screen defaults to "Quick view"
  - Users can expand "Details" to see assets, skipped layers, file locations
  - Information is still there; not in your face
- Test with power users before shipping simplification
- Golden rule: simplification = less friction for common case, NOT removal of capability

**Warning signs:**
- User feedback: "I used to do X, now I can't"
- Power users avoid the plugin
- Users export, then manually edit brief
- Feature requests for "advanced mode"
- Users switching to old version

**Phase to address:**
UX simplification must be validated with new AND power users. Phase: "UX Simplification User Testing"

---

### Pitfall 6: Brief Instructions Conflict with Claude Code's Actual Capabilities

**What goes wrong:**
Brief instructs Claude Code to do something it's not good at:
- Instruction: "Ask clarifying questions about edge cases"
  - Reality: Claude Code asks 5 questions, most are already in brief. Feels redundant, slows down build.
- Instruction: "Verify output against PNG preview"
  - Reality: Claude Code can't easily open and compare PNG. Instruction is ignored or followed poorly.
- Instruction: "Replicate exact spacing from design tokens"
  - Reality: Tokens are approximate; exact matching is impossible. Claude Code tries and fails.

**Why it happens:**
Instruction engineering for Claude Code is evolving. Developers write instructions based on intuition, not validated experience. What sounds good in theory often doesn't work because:
- Claude Code has different strengths/weaknesses than humans
- Context limits make verbosity expensive
- Some instructions conflict with Claude Code's agentic nature

**How to avoid:**
- Create instruction hypothesis, test with real Claude Code use:
  - Before: Brief with instruction X
  - After: Brief without instruction X
  - Measure: time to complete, output quality, user satisfaction
  - Keep instruction only if A/B test shows improvement
- Validate instructions against Claude's capabilities:
  - "Ask clarifying questions" — is this actually necessary if brief is already specific?
  - "Verify output" — can Claude Code actually verify a PNG in its workflow?
  - "Use only provided assets" — is it necessary if brief context makes this obvious?
- Version instructions like code with changelog
- Consult prompt engineering best practices:
  - Shorter instructions (2-3) work better than longer lists
  - Positive framing works better than constraints
  - Examples work better than imperatives

**Warning signs:**
- Users report briefs feel "over-engineered" or "micromanaging"
- Claude Code ignores instructions
- Instructions conflict
- A/B testing shows no improvement from new instructions
- Instructions are longer than the design context itself

**Phase to address:**
Instruction template validation via A/B testing. Phase: "Brief Instruction Testing & Refinement"

---

### Pitfall 7: Asset Heuristics Break on Edge Cases (Rotations, Masks, Nested Masks)

**What goes wrong:**
Heuristic works on "normal" designs but breaks on edge cases:
- Rotated vector groups (heuristic checks nesting, ignores rotation)
- Masks or clip paths (doesn't detect mask complexity)
- Nested masks (very complex, looks simple in tree)
- Boolean operations (union, subtract, intersect)

Some complex designs export correctly; edge cases still fail.

**Why it happens:**
Figma's document model is complex. Heuristics built without accounting for:
- VectorNode with vectorNetwork (custom paths)
- BlendMixin and effects (gradients, blur, shadows)
- MaskMixin and clipping
- InstanceNode properties (components behave differently)

Easy to miss edge cases without deep Figma API knowledge.

**How to avoid:**
- Study Figma API node types:
  - Read Figma's plugin API docs (VectorNode, InstanceNode, BlendMixin, MaskMixin)
  - Understand what makes each "complex enough to export"
- Instrument heuristic with debug logging:
  - Log: "NodeType: GroupNode, Children: 5, HasBlend: true, HasMask: false → EXPORT"
- Test on diverse Figma files:
  - Simple app UI
  - Complex illustration
  - Design system file
  - File with edge cases: rotations, masks, Boolean ops
- Create regression test suite:
  - For each edge case found, add test file
  - Prevent regression when heuristic is updated
- Consider explicit node type handling

**Warning signs:**
- Heuristic works on most designs but fails on specific types
- Debug logs show missed complexity
- Testing finds new edge case almost every session
- Heuristic rules feel like workarounds

**Phase to address:**
Edge case testing phase. Phase: "Asset Detection Edge Case Testing"

---

### Pitfall 8: Figma API Rate Limiting Causes Extraction Failures on Complex Designs

**What goes wrong:**
Plugin extracts complex 100+ layer design. Figma REST API has rate limits:
- Dev tier: 25-100 requests/minute
- Pulling full tree + all image exports = 50-150 API calls
- Plugin hits 429 rate limit partway through, extraction fails
- User sees error but not told to retry later

Alternative: plugin takes 2+ minutes because of rate limit backoff; user thinks plugin hung.

**Why it happens:**
Figma API enforces rate limiting via leaky bucket. Plugin makes:
1. GET /v1/files/{file_id}
2. GET /v1/files/{file_id}/nodes
3. GET /v1/images
4. Multiple GET requests to CloudFront

Each design element + asset = multiple API calls. Complex designs hit limits fast.

Developers might not implement:
- Retry logic with exponential backoff
- Request batching (Figma supports fetching multiple nodes in one call)
- Image caching

**How to avoid:**
- Implement batch requests aggressively:
  - Instead of: GET each node separately
  - Do: GET multiple nodes in one request
  - Reduces 100 calls → 5-10 calls
- Implement retry logic with exponential backoff
- Cache image exports:
  - Store URLs in plugin storage
  - Reuse cached URLs if design hasn't changed
- Measure API call efficiency:
  - Log: "calls_made, api_time, image_downloads"
  - Target: complex design (100 layers) should be <30 API calls total
- Set user expectations:
  - UI: "Extracting design... (calls: 5/50)"
  - Show progress so user doesn't think plugin hung
  - If rate limited: clear message + countdown

**Warning signs:**
- Extraction fails on large/complex designs
- Plugin takes 2+ minutes
- No error message when rate limit hit
- Plugin doesn't retry
- API call count seems high (>50 calls for <50 layers)

**Phase to address:**
Performance & reliability testing phase. Phase: "API Performance & Rate Limit Handling"

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Skip edge case testing for heuristics | Faster MVP launch | Heuristics fail on real designs, must be rewritten | Never |
| Export everything as image | Fewer missed exports | Brief bloat, asset confusion, Claude Code misses instruction | Only as temporary validation; must constrain before shipping |
| Long instruction lists (5+ behaviors) | Feels thorough | Claude Code ignores instructions, brief feels prescriptive | Never |
| Skip instruction A/B testing | Faster iteration | Instructions don't improve accuracy | Never |
| Ignore Figma API rate limiting | Simpler implementation | Fails on complex designs, poor UX | Never |
| Hide advanced options completely | Cleaner UI | Power users lose workflows | Never |
| Skip asset mapping in brief | Simpler template | Claude Code guesses wrong asset placement | Never |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|-----------------|
| **Figma REST API → Plugin** | Assuming all nodes are simple; missing VectorNode, BlendMixin, MaskMixin complexity | Read Figma plugin API docs, understand each node type's complexity markers, test on diverse file types |
| **Asset export → Brief inclusion** | Exporting asset but not mapping it to layout | Explicit mapping: "Asset X belongs in Layout Y because Z" |
| **Instruction template → Claude Code** | Writing instructions without testing if Claude Code follows them | A/B test instruction changes: before vs after, measure impact |
| **Rate limiting → User experience** | Silent failure or vague error when API limit hit | Implement retry logic, show progress, clear error message with guidance |
| **UX simplification → Power user workflows** | Removing features under guise of simplification | Separate quick path (default) from advanced path (opt-in toggle) |
| **Heuristic → Real designs** | Building heuristic from theory, testing on synthetic examples | Start with real problem cases from v1.0 feedback |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Exporting all layers as images | Asset directory has 50+ files, Claude Code confused | Only export groups with 3+ children + complexity; aim for <20 assets | Heuristic too aggressive |
| No API request batching | Plugin takes 2+ min on complex design, API limit hit frequently | Batch requests, reduce 100 calls → 10 calls | Complex designs (100+ layers) |
| No image caching | User extracts same design twice, both times slow | Cache image URLs in plugin storage | Repeated extractions |
| Over-specified instructions | Instructions longer than design context, Claude Code ignores them | Limit to 2-3 core instructions, A/B test | Brief instructions grow beyond 300 words |
| Deep nesting in brief | Layout tree is 10+ levels deep, Claude Code loses context | Flatten tree, use explicit asset-to-layout mapping | Complex designs with many groups |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|-----------|
| Storing Figma PAT without encryption | PAT visible in browser dev tools, localStorage dumps | Encrypt token before storage, access only when needed, never log |
| Embedding design content in brief | Screenshots may contain sensitive design or proprietary patterns | Brief includes structure + tokens + assets only, not design screenshots |
| Logging asset names/design structure | Logs may be sent to error tracking, revealing design info | Sanitize logs, log only error codes and counts, not content |
| Not validating Figma API response | Malicious or corrupted response causes failures | Validate response structure, handle null/undefined gracefully |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Hidden complexity in simplified UI | Users don't understand what plugin does or where options are | Progressive disclosure: show quick path by default, reveal details on demand |
| No feedback during extraction | Plugin seems hung, user force-closes and retries | Show progress: "Extracting... 5/50 layers", "Downloading assets..." |
| Results screen overwhelms | Users don't know where to start or what's important | Use tiered information: headline, summary, expandable details |
| Instructions conflict or feel micromanaging | Users feel brief is bossy, ignore instructions | Limit to 2-3 core behaviors, frame as helpful guidance |
| Asset names auto-generated and meaningless | Users see "Group 42", "Vector 5"; can't identify assets | Export with context-aware names: "hero-illustration", "accent-shape" |
| Manual verification is tedious | Users can't verify "did plugin extract everything?" before using brief | Add checklist to results: "Layers: 50, Assets: 10, Tokens: 25. Complete?" |

---

## "Looks Done But Isn't" Checklist

- [ ] **Asset Detection:** Heuristic validated. Problem cases from v1.0 are exported as images; no over-export bloat on simple designs. Tested on 3+ diverse designs.
- [ ] **Asset Mapping:** Every exported asset explicitly mapped to layout position. Brief reader can identify where each asset belongs. Tested with unfamiliar user.
- [ ] **Brief Instructions:** A/B tested instruction template. Instructions improve accuracy/speed measurably, don't conflict, <300 words total. Claude Code compliance >80%.
- [ ] **Rate Limiting:** API calls batched; extraction works on complex designs (100+ layers) without hitting rate limits or taking >60 seconds. Retry + backoff implemented.
- [ ] **UX Simplification:** Tested with both new AND power users. No workflows broken; advanced options available via toggle. Users understand what plugin does.
- [ ] **Results Screen:** Tiered information; no overwhelming details. Progress feedback during extraction. Clear, actionable error messages.
- [ ] **Asset Naming:** Exported assets have meaningful names, not auto-generated IDs. Users can identify "hero-illustration.png" vs "accent-shape.svg" without looking them up.
- [ ] **Image Caching:** Repeated extractions use cached image URLs; second extraction is 5-10x faster than first.

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Over-exporting bloats brief (50+ assets) | HIGH | Redefine heuristic; identify unnecessary assets; batch cleanup. Or: revert to v1.0 logic, ship "conservative export" mode |
| Heuristic still misses complex designs | HIGH | Debug problem designs; reverse-engineer failures; rewrite heuristic; extensive retesting |
| Instructions don't improve accuracy | MEDIUM | A/B test revealed no improvement; revert to minimal instructions or redesign based on test data |
| Rate limiting causes extraction failures | MEDIUM | Implement batching + retry logic; measure API call reduction; retest on complex designs |
| UX simplification breaks power user workflow | HIGH | Restore advanced options via toggle; test with power users |
| Asset mapping is still unclear | MEDIUM | Redesign mapping notation; add visual examples; test with unfamiliar user |
| Instructions too long, Claude Code ignores them | LOW | Trim to 2-3 core behaviors; test compliance improves |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Over/Under-exporting | **Asset Detection Heuristic Design** | Test on 3+ diverse designs; measure % assets used in Claude output; validate v1.0 problem cases export correctly |
| Incomplete asset mapping | **Asset-to-Layout Mapping Design** | Brief reader identifies where each asset goes; Claude Code uses >80% of assets correctly |
| Instructions ineffective | **Brief Instruction A/B Testing** | A/B test before/after; measure accuracy, speed, satisfaction; ship only if improvement clear |
| API rate limiting | **API Performance & Rate Limit Testing** | Complex design (100+ layers) extracts in <60s without hitting limits; batching + retry implemented |
| UX simplification breaks workflows | **UX Simplification User Testing** | Test with new and power users; no workflows broken; advanced options available and discoverable |
| Edge case heuristics fail | **Asset Detection Edge Case Testing** | Test suite for edge cases (masks, rotations, Boolean ops); heuristic handles each; prevent regression |
| Figma API misunderstandings | **Figma API Integration Testing** | Validate node type handling (VectorNode, MaskMixin, BlendMixin); test on diverse file types |
| Hidden UX complexity | **UX Simplification Design & Testing** | Progressive disclosure validated; quick path feels simple; details available on demand |

---

## Sources

**Prompt Engineering & Instruction Design:**
- [Claude Prompt Engineering Best Practices - Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- [AI-Assisted Development Best Practices 2026 - DEV Community](https://dev.to/austinwdigital/ai-assisted-development-in-2026-best-practices-real-risks-and-the-new-bar-for-engineers-3fom)
- [Prompt Engineering Best Practices 2026 - Thomas Wiegold](https://thomas-wiegold.com/blog/prompt-engineering-best-practices-2026/)

**Claude Code Best Practices:**
- [Best Practices for Claude Code](https://code.claude.com/docs/en/best-practices)
- [Claude Vision for Document Analysis - GetStream](https://getstream.io/blog/anthropic-claude-visual-reasoning/)

**Figma API & Asset Export:**
- [Figma REST API Rate Limits - Official Docs](https://developers.figma.com/docs/rest-api/rate-limits/)
- [Exporting Vectors with Figma API - iAdvize Engineering](https://medium.com/iadvize-engineering/using-figma-api-to-extract-illustrations-and-icons-34e0c7c230fa)
- [Best Figma Plugins for Vector Export 2026](https://svgmaker.io/blogs/best-figma-plugins-for-vector-illustration-and-clean-svg-export-2026)

**UX Simplification & Complexity:**
- [Norman's Law in UX: How Complexity Hides in Simplicity - UX Bulletin](https://www.ux-bulletin.com/normans-law-ux/)
- [Design-to-Code Workflows - UXPin](https://www.uxpin.com/studio/blog/how-no-code-export-tools-simplify-design-to-code-workflows/)

**Design-to-Code Export Common Issues:**
- [Best Design to Code Tools - GeekFlare](https://geekflare.com/software/best-design-to-code-tools/)

---

*Pitfalls research for: Ship Studio Figma Plugin v1.1 (Asset Detection, Instruction Engineering, UX Simplification)*
*Researched: 2026-02-28*
