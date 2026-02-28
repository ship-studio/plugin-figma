# v1.1 Stack Research Index

**Purpose:** Navigate research documents for v1.1 (Brief Quality & UX)
**Created:** 2026-02-28
**Target Audience:** Project leads, developers, roadmap planners

---

## Quick Links

| Document | Purpose | For Whom | Read Time |
|----------|---------|----------|-----------|
| **V11_STACK_SUMMARY.md** | TL;DR: What to add, what to build, what to skip | PMs, architects | 5 min |
| **STACK_v11_ADDITIONS.md** | Detailed analysis of new libraries and features | Developers, tech leads | 20 min |
| **V11_IMPLEMENTATION_PATTERNS.md** | Code examples and integration guide | Developers | 30 min |
| **STACK.md** | v1.0 baseline (core technologies) | Reference | 10 min |

---

## Document Purpose

### 1. V11_STACK_SUMMARY.md
**Read this first if you're:**
- Planning v1.1 roadmap
- Deciding what to build vs. skip
- Assessing risk and bundle impact
- Quick decision-making (5 min)

**Key decisions:**
- Add zod (MANDATORY, +8 KB)
- Add clsx (OPTIONAL, +0.7 KB)
- Don't add image processing libraries
- Asset detection uses existing Figma API capability

---

### 2. STACK_v11_ADDITIONS.md
**Read this for:**
- Understanding why zod is needed
- Details on composition detection algorithm
- Claude Code best practices to add to brief
- UX simplification approach
- Integration points with v1.0

**Key findings:**
- Composition detection is pure algorithms, not libraries
- Brief instructions inform from official Claude Code docs
- UX simplification doesn't require new libraries
- Zod validates detection results (runtime safety)

---

### 3. V11_IMPLEMENTATION_PATTERNS.md
**Read this for:**
- Copy-paste code examples
- Type definitions for compositions
- Integration test patterns
- Deployment checklist
- File structure and what changes

**Key content:**
- Zod schema definitions
- Composition detection function
- Brief instruction builders
- UX component refactoring
- Test examples

---

### 4. STACK.md (Reference)
**Existing v1.0 research. Includes:**
- Core framework (React 18, TypeScript, Vite)
- Figma REST API types (@figma/rest-api-spec)
- Custom curl wrapper (shell.exec)
- Authentication (PAT)
- URL parsing patterns
- Rate limit handling

**Status:** UNCHANGED for v1.1. Use as baseline.

---

## How to Use This Research

### Scenario 1: "I need to decide if we're doing zod"
1. Read V11_STACK_SUMMARY.md (decision matrix section)
2. Skim STACK_v11_ADDITIONS.md (why zod helps)
3. **Decision:** zod is MANDATORY (+8 KB, essential for validation)

### Scenario 2: "I'm implementing composition detection"
1. Read V11_STACK_SUMMARY.md (high-level approach)
2. Read STACK_v11_ADDITIONS.md (algorithm details)
3. Read V11_IMPLEMENTATION_PATTERNS.md (code patterns, tests)
4. Start coding from patterns

### Scenario 3: "I'm doing UX redesign"
1. Read V11_STACK_SUMMARY.md (what's needed for UX)
2. Read STACK_v11_ADDITIONS.md (UX simplification section)
3. Read V11_IMPLEMENTATION_PATTERNS.md (React component patterns)
4. Decide: clsx or inline conditionals?

### Scenario 4: "I'm writing the brief improvement section"
1. Read V11_STACK_SUMMARY.md (brief instructions overview)
2. Read STACK_v11_ADDITIONS.md (Claude Code best practices)
3. Read V11_IMPLEMENTATION_PATTERNS.md (instruction template builders)
4. Copy patterns, customize for your design

---

## Key Research Findings

### What's New in v1.1

| Feature | Status | Key Finding |
|---------|--------|------------|
| **Asset Detection** | Algorithm enhancement | No new libraries needed. Use Figma's existing arbitrary-node rendering + composition heuristics |
| **Brief Instructions** | Content addition | Add Claude Code guidance, asset-to-layout mapping. Pure prose, optional zod validation |
| **UX Simplification** | Component refactor | Reduce steps, clearer terminology. Optional clsx for conditional styling |

### Libraries to Add

| Library | Mandatory? | Why | Bundle Impact |
|---------|-----------|-----|----------------|
| **zod** | ✅ YES | Validates asset detection results | +8 KB |
| **clsx** | ❌ OPTIONAL | Cleaner conditional classnames | +0.7 KB |

### What NOT to Add

- Image processing (sharp, jimp) — Figma API already renders
- LLM libraries — Plugin prepares context only
- Form libraries — Simple useState() is enough
- Tree visualization — Render as text
- Markdown parsers — Generate only, don't parse

---

## Implementation Order

### Phase 1: Asset Detection (Week 1)
1. Read V11_IMPLEMENTATION_PATTERNS.md (composition detection patterns)
2. Implement `detectComplexCompositions()` in `/src/assets/composition.ts`
3. Add zod validation
4. Write tests
5. Integrate with `identifyAssets()`

### Phase 2: Brief Instructions (Week 2)
1. Read STACK_v11_ADDITIONS.md (Claude Code best practices)
2. Implement instruction builders in `/src/brief/instructions.ts`
3. Integrate with `generateBrief()`
4. Add asset-to-layout mapping
5. Validate with zod

### Phase 3: UX Redesign (Week 2-3)
1. Read V11_STACK_SUMMARY.md (UX simplification)
2. Refactor `/src/UI/ExtractionFlow.tsx`
3. Implement tab-based results
4. Optionally add clsx
5. User testing

### Phase 4: Testing & Release (Week 3-4)
1. All tests passing
2. Bundle size check
3. Code review
4. Release v1.1

---

## Confidence Levels

| Area | Level | Why |
|------|-------|-----|
| **Asset Detection Approach** | HIGH | Figma REST API verified, algorithm is straightforward |
| **Library Choices (zod)** | HIGH | Industry standard, verified in Context7 |
| **Brief Instructions** | HIGH | Based on official Claude Code docs (2026) |
| **UX Patterns** | MEDIUM | Community consensus, needs user testing |
| **Clsx vs. Inline** | LOW | Either approach works; clsx is optional |

---

## Next Steps

1. **Approve stack recommendation**
   - Read V11_STACK_SUMMARY.md decision matrix
   - Decision: zod YES, clsx OPTIONAL?

2. **Schedule user research**
   - Test composition detection heuristics (>5 children, vector-only)
   - Test brief clarity (Claude Code instructions, asset mapping)
   - Gather feedback on UX simplification

3. **Assign developers to phases**
   - Phase 1 (asset detection) — can start immediately
   - Phase 2 (brief instructions) — depends on phase 1, no new blockers
   - Phase 3 (UX redesign) — parallel with phases 1-2

4. **Prepare for implementation**
   - Install zod: `npm install zod@^4.3.6`
   - Create files: `/src/assets/composition.ts`, `/src/brief/instructions.ts`
   - Copy code patterns from V11_IMPLEMENTATION_PATTERNS.md

---

## FAQ

**Q: Do we really need zod?**
A: For validation safety, yes. Could skip it and use try-catch, but zod is minimal (+8 KB) and prevents bugs. MANDATORY.

**Q: Should we add clsx?**
A: Only if redesigning UI with many conditional states. Optional but recommended for code clarity.

**Q: Why not use a fancy image processing library?**
A: Figma API already renders images. Plugin runs in browser, not Node.js. No need for local processing.

**Q: Will asset detection break existing v1.0 functionality?**
A: No. It's additive. Existing SVG/PNG-fill logic unchanged. Compositions are new export type.

**Q: How long will v1.1 take?**
A: 2-3 weeks: Phase 1 (1 week) + Phase 2 (1 week) + Phase 3 (1 week optional) + testing/release (1 week).

**Q: Can we do phases 1-3 in parallel?**
A: Phase 1 and 2 are somewhat independent. Phase 3 (UX) is mostly independent. But phase 1 results inform phase 2, so overlap is fine but not parallel.

---

## Research Methodology

- **Figma REST API:** Verified via official developer docs (developers.figma.com)
- **Zod:** Verified via Context7, npm, and official docs (zod.dev)
- **Claude Code best practices:** Official documentation (code.claude.com)
- **UX patterns:** Community consensus and research (2026 sources)

All findings include confidence levels. No assumptions presented as facts.

---

## Contact & Questions

For questions about this research:
1. Check the FAQ section above
2. Review the relevant document (use links above)
3. Consult original sources (URLs provided in each document)

---

*v1.1 Stack Research Index*
*Complete: 2026-02-28*
