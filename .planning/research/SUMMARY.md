# Research Summary: v1.3 Asset Completeness & Spacing Accuracy

**Domain:** Figma design extraction plugin (existing codebase enhancement)
**Researched:** 2026-03-01
**Overall confidence:** HIGH

## Executive Summary

v1.3 addresses two systematic gaps discovered through real-world usage of the Ship Studio Figma Plugin. The first gap is that assets inside component instances (background images, nested logos, photos inside cards) are invisible to the export pipeline because both `normalize.ts` and `identify.ts` treat INSTANCE nodes as opaque leaf nodes, stopping all traversal. The second gap is that spacing values are only extracted from auto-layout frames, leaving manually positioned frames -- common in real Figma files -- with no spacing information for Claude Code to work from.

Both gaps have clean solutions that work within the existing architecture. The Figma REST API already returns full children and fills for INSTANCE nodes (confirmed via the `@figma/rest-api-spec` type definitions -- `InstanceNode` extends `FrameTraits` which includes `HasChildrenTrait` and `HasGeometryTrait`). No additional API calls are needed. The fix involves removing an intentional v1.0 simplification (early return for instances) and adding bounding-box arithmetic for spacing inference.

The FEATURES.md research (completed earlier) additionally identified several low-complexity differentiators: `layoutGrow` (flex: 1) detection, `layoutAlign: STRETCH` detection, and absolute position offsets for absolutely-positioned elements. These complement the core spacing work and provide Claude Code with much more complete flex child information.

A third v1.3 requirement -- the plugin icon -- is a trivial configuration change unrelated to the extraction pipeline.

The total scope is small: 5-6 files modified, 0 new files. The changes are additive to existing modules. The pipeline structure (identify -> export -> download) remains identical.

## Key Findings

**Stack:** No new dependencies needed. All changes use existing TypeScript, existing Figma REST API responses, and existing pipeline infrastructure.

**Architecture:** Two surgical modifications to `normalize.ts` (recurse into INSTANCE children, add bounding-box spacing inference) and one modification to `identify.ts` (scan instance children for IMAGE fills). Brief generator and token collector get minor additive changes. No new modules.

**Critical pitfall:** Changing INSTANCE traversal in `normalize.ts` affects all downstream consumers. The brief generator's layout tree MUST continue to treat instances as leaf nodes (existing guard at line 163 of `generate.ts` handles this). Token collection will now walk into instance children, which is desired (finds more imageFills) but must be regression-tested.

## Implications for Roadmap

Based on research, suggested phase structure:

1. **Instance Children in Layout Tree** - Foundation change
   - Addresses: Prerequisite for all instance asset detection
   - Avoids: Building on top of a tree that lacks instance children
   - Risk: Medium -- changes tree shape visible to all downstream consumers
   - Mitigation: Existing guards in brief generator prevent layout tree disruption

2. **Deep Asset Detection Inside Instances** - Core feature
   - Addresses: Missing images inside components (the primary user-facing problem)
   - Avoids: Over-extraction of SVGs inside components
   - Depends on: Phase 1 (needs children present on LayoutNodes)

3. **Spacing & Layout Accuracy** - Independent improvement
   - Addresses: Missing spacing info for non-auto-layout frames, absolute position offsets, flex child properties (layoutGrow, layoutAlign)
   - Avoids: Treating inferred values as authoritative (uses `~` prefix for inferred values)
   - Independent: Can be built in parallel with Phases 1-2

4. **Plugin Icon** - Polish
   - Addresses: Visual identity in Ship Studio toolbar
   - Independent: No pipeline changes

**Phase ordering rationale:**
- Phase 1 must precede Phase 2 (asset detection needs children in the tree)
- Phase 3 is independent and could be built before, during, or after Phases 1-2
- Phase 4 is trivial and can slot anywhere

**Research flags for phases:**
- Phase 1: Needs careful regression testing -- changes affect all downstream consumers
- Phase 2: Standard pattern, unlikely to need additional research
- Phase 3: Bounding-box spacing inference may need tuning with real designs (edge cases with overlapping elements, rotated frames). The `layoutGrow`/`layoutAlign` parts are straightforward property reads.
- Phase 4: No research needed, configuration only

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | No new dependencies, all existing tech |
| Features | HIGH | Gaps clearly identified from code analysis and FEATURES.md research |
| Architecture | HIGH | API types confirmed via @figma/rest-api-spec, integration points mapped to specific lines |
| Pitfalls | HIGH | Downstream impact assessed file-by-file |
| Spacing inference | MEDIUM | Bounding-box arithmetic is sound but real-world edge cases need testing |

## Gaps to Address

- **Rotation handling in spacing inference** -- Rotated frames have `absoluteBoundingBox` that represents the axis-aligned bounding box, not the visual bounds. Spacing computed from rotated frames may be inaccurate. Phase-specific research if this proves to be an issue.
- **absoluteRenderBounds vs absoluteBoundingBox** -- Should spacing inference use `absoluteBoundingBox` (layout intent) or `absoluteRenderBounds` (visual appearance)? Recommend `absoluteBoundingBox` for layout spacing.
- **Instance deduplication with image fills** -- Two instances of the same component might have different image fill overrides. Need to verify that the image fill is extracted from the right instance.
- **RECTANGLE export filtering** -- FEATURES.md identified that many RECTANGLE nodes exported as SVG are actually simple colored dividers that should be CSS. Worth considering as a bonus cleanup in this milestone.
