# v1.1 Stack Summary: What to Add, What to Build, What to Skip

**Milestone:** v1.1 Brief Quality & UX
**Research Date:** 2026-02-28
**Target:** Move from 80% to near-100% first-build accuracy

---

## TL;DR

**Add exactly 2 packages:**
1. **`zod@^4.3.6`** (mandatory) — Validates asset detection results
2. **`clsx@^2.0.0`** (optional) — Classname utility for UX redesign

**Don't add any other libraries.**

**The breakthrough for complex asset detection** comes from using **Figma's existing REST API capability** (arbitrary node rendering) + smarter detection algorithms, not new libraries.

---

## What's Needed for Each v1.1 Feature

### 1. Smarter Asset Detection (Complex Compositions)

| Aspect | What's Needed | New Library? |
|--------|---------------|------------|
| **Detect nested GROUPs** | Tree traversal + heuristic (>5 children, vector-only) | ❌ No |
| **Validate detection results** | Schema validation (nodeId, filename, complexity) | ✅ **zod** |
| **Render as PNG** | Existing `fetchImages()` API call | ❌ No |
| **Download assets** | Existing `downloadAssets()` function | ❌ No |
| **Map to layout** | Asset metadata in brief generation | ❌ No |

**Implementation:** Enhance `/src/assets/identify.ts` with `detectComplexCompositions()` function. Validate output with zod.

**Confidence:** HIGH

---

### 2. Improved Brief Instructions (Claude Code Best Practices)

| Aspect | What's Needed | New Library? |
|--------|---------------|------------|
| **Plan mode guidance** | Prose section in brief | ❌ No |
| **Verification instructions** | Prose section in brief | ❌ No |
| **Asset-to-layout mapping** | Enhanced assets table with layout paths | ❌ No |
| **Asset-only rule** | Documentation in brief | ❌ No |
| **Validate instruction templates** | Schema validation before serialization | ✅ **zod** (optional) |

**Implementation:** Enhance `/src/brief/generate.ts` with instruction sections. Use zod to validate template data (optional but recommended).

**Confidence:** HIGH

---

### 3. UX Simplification (Fewer Steps, Clearer Terminology)

| Aspect | What's Needed | New Library? |
|--------|---------------|------------|
| **Reduce form steps** | React component refactoring | ❌ No |
| **Clearer terminology** | Copy changes | ❌ No |
| **Conditional styling** | CSS classes + optional utility | ✅ **clsx** (optional) |
| **Tab-based results** | React component redesign | ❌ No |

**Implementation:** Refactor `/src/UI/ExtractionFlow.tsx` and related components. Optionally add clsx for conditional classnames.

**Confidence:** MEDIUM (UX improvements need user testing)

---

## Library Details

### zod ^4.3.6 (MANDATORY)

```typescript
// Example: Validating composition detection
import { z } from 'zod';

const CompositionSchema = z.object({
  nodeId: z.string(),
  nodeName: z.string(),
  childCount: z.number().min(3),
  containsVectorOnly: z.boolean(),
  shouldExportAsImage: z.boolean(),
});

// In detectComplexCompositions():
const compositions = identifyGROUPs(nodes); // raw detection
const validated = compositions.map(c => CompositionSchema.parse(c)); // safe for export
```

**Why:** Catches invalid asset metadata before rendering. Runtime safety for tree traversal results.

**Bundle impact:** +8 KB (v4.3.6 is optimized, 57% smaller than v3)

**Alternative:** Skip zod, use try-catch on manual validation. Works but less maintainable.

**Decision:** MANDATORY for v1.1. Already noted in v1.0 stack research but wasn't used. Elevate to required.

---

### clsx ^2.0.0 (OPTIONAL)

```typescript
// Example: UX state styling
import clsx from 'clsx';

<div className={clsx(
  'result-container',
  { 'is-loading': isExtracting },
  { 'has-warnings': warnings.length > 0 },
)}>
```

**Why:** Cleaner classname management for UI redesign with multiple states.

**Bundle impact:** +0.7 KB (negligible)

**Alternative:** Use inline conditionals: `className={isExtracting ? 'result-container is-loading' : 'result-container'}`

**Decision:** OPTIONAL but recommended if redesigning UI. Include if you value code clarity, skip if bundle size is critical.

---

## Stack Timeline

### What Changes in v1.1

**Before v1.1 release:**
```bash
npm install zod@^4.3.6
npm install clsx@^2.0.0  # optional
```

**Code changes:**
- `/src/assets/identify.ts` — Add composition detection
- `/src/brief/generate.ts` — Add instruction sections, asset-to-layout mapping
- `/src/UI/*.tsx` — Refactor extraction flow (optional clsx usage)

**No breaking changes to v1.0 functionality.** Existing extraction flow still works.

---

## What NOT to Add

| Avoided Library | Why | Cost of Adding |
|---|---|---|
| **sharp / jimp / canvas** | Image processing in browser is impossible. Figma API renders images. | +500 KB (not viable in plugin) |
| **openai / anthropic SDK** | Plugin prepares context, Claude Code generates. No API calls needed. | +50 KB (unnecessary) |
| **react-hook-form / formik** | Form simplification means fewer fields. useState() is enough. | +30 KB (overkill) |
| **Markdown parser** | Plugin generates markdown, doesn't parse it. | +50 KB (unnecessary) |
| **Tree visualization** | Layout tree renders as indented text, not visual component. | +100 KB (unnecessary) |

**Total cost of not adding:** Save 730+ KB in bundle size by skipping these. Current project is 66.54 KB; can afford ~9 KB additions, not 730 KB.

---

## Quality Gates

**Before shipping v1.1:**

- [ ] Composition detection tests pass (validate >5 children heuristic, vector-only detection)
- [ ] zod validation tests (ensure malformed assets are caught)
- [ ] Brief generation tests (instruction sections are well-formed markdown)
- [ ] Asset-to-layout mapping verified (each asset has correct path in brief)
- [ ] UX flow tested (users can extract in <2 minutes, clearer terminology)
- [ ] Bundle size check: `npm run build && du -h dist/index.js` (expect ~75 KB)
- [ ] All existing v1.0 tests still pass
- [ ] No new linting errors or type errors

---

## Installation Commands

```bash
# 1. Install zod (mandatory)
npm install zod@^4.3.6

# 2. Optionally install clsx
npm install clsx@^2.0.0

# 3. Verify types
npx tsc --noEmit

# 4. Run tests
npm test

# 5. Check bundle size
npm run build && du -h dist/index.js
```

---

## Decision Matrix

**Use this to decide zod vs. no zod, clsx vs. no clsx:**

### zod Decision

| Scenario | Decision |
|----------|----------|
| "I want runtime validation of asset metadata" | **Add zod** ✅ |
| "I'm concerned about bundle size" | Still **add zod** (only +8 KB) |
| "I want to skip optional validations" | Still **add zod** (use selectively) |
| **Any production scenario** | **Add zod** (safety > tiny KB) |

**Recommendation: MANDATORY**

### clsx Decision

| Scenario | Decision |
|----------|----------|
| "I'm redesigning the UI with multiple conditional states" | **Add clsx** ✅ |
| "I'm keeping the existing UI structure" | **Skip clsx** (inline conditionals fine) |
| "I like clean code but hate extra dependencies" | **Skip clsx** (fallback works) |
| "Bundle size is critical" | **Skip clsx** (save 0.7 KB) |

**Recommendation: OPTIONAL (recommended if redesigning)**

---

## Roadmap Implications

### Phase Ordering

**Phase 1: Asset Detection (Week 1)**
- Add zod
- Implement `detectComplexCompositions()`
- Enhance `identifyAssets()` to include compositions
- Write tests

**Phase 2: Brief Instructions (Week 2)**
- Add Claude Code guidance sections
- Implement asset-to-layout mapping
- Enhance brief generation
- Validate instruction templates (optional zod)

**Phase 3: UX Redesign (Week 2-3)**
- Optionally add clsx
- Refactor extraction flow
- Simplify terminology
- User testing

**Phase 4: Polish & Release (Week 3-4)**
- Bundle size check
- All tests passing
- Documentation updates
- Release v1.1

---

## Success Metrics

**v1.1 is complete when:**

1. **Accuracy:** Complex illustrations are exported as PNG, not described textually
2. **Brief quality:** Users see Claude Code best practices (plan mode, verification)
3. **Asset mapping:** Brief explicitly shows where each asset belongs in layout
4. **UX:** Extraction takes <2 minutes with clear terminology
5. **Performance:** Bundle remains <100 KB
6. **Reliability:** All tests pass, no new bugs

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|------------|-----------|
| **zod validation too strict** | Low | Gradual rollout, fallback to warnings not errors |
| **Composition detection heuristic misses cases** | Medium | Gather user feedback, refine thresholds in v1.2 |
| **Brief instructions confuse users** | Low | Test with 2-3 users before release |
| **UX redesign breaks existing workflow** | Low | Provide "classic mode" toggle, default to new |
| **Bundle bloat** | Low | zod is optimized (~8 KB), acceptable trade-off |

---

## Next Steps

1. **Approve this stack recommendation**
2. **Schedule user research** (test composition detection heuristics, brief clarity)
3. **Assign Phase 1 (asset detection)** — Can start immediately, no blockers
4. **Assign Phase 2 (brief instructions)** — Depends on Phase 1, no new info needed
5. **Assign Phase 3 (UX redesign)** — Depends on phases 1-2, schedule user testing

---

*v1.1 Stack Summary — Research completed 2026-02-28*
*Prepared for roadmap creation and phase planning*
