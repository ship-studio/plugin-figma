import { jsx as f, jsxs as y, Fragment as de } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export const jsx=R.createElement;export const jsxs=R.createElement;export const Fragment=R.Fragment;";
import { useEffect as ne, useCallback as O, useState as R, useMemo as We, useRef as te } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export default R;export const{useState,useEffect,useCallback,useRef,useMemo,useContext,createContext,createElement,Fragment}=R;";
const ye = window;
function ie() {
  const e = ye.__SHIPSTUDIO_REACT__, n = ye.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__;
  return n && (e != null && e.useContext) ? e.useContext(n) : null;
}
const se = "figma-plugin-styles", _e = `
.figma-plugin-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.figma-plugin-modal {
  width: 480px;
  max-height: 80vh;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.figma-plugin-modal-header {
  display: flex;
  flex-direction: row;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  gap: 12px;
  align-items: center;
}

.figma-plugin-modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.figma-plugin-modal-title {
  font-size: 15px;
  font-weight: 600;
}

.figma-plugin-input {
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
  font-size: 13px;
  box-sizing: border-box;
}

.figma-plugin-input:focus {
  outline: none;
  border-color: var(--accent, #0d99ff);
}

.figma-plugin-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 6px;
  display: block;
}

.figma-plugin-error {
  color: #e53e3e;
  font-size: 12px;
  margin-top: 6px;
}

.figma-plugin-success {
  color: #38a169;
  font-size: 12px;
  margin-top: 6px;
}

.figma-plugin-hint {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
}

.figma-plugin-section {
  margin-bottom: 16px;
}

.figma-plugin-radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.figma-plugin-radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  cursor: pointer;
}

.figma-plugin-file-info {
  padding: 10px 12px;
  border-radius: 6px;
  background: var(--bg-secondary);
  font-size: 12px;
  margin-top: 8px;
}

.figma-plugin-warning {
  padding: 10px 12px;
  border-radius: 6px;
  background: var(--bg-secondary);
  border: 1px solid #b45309;
  font-size: 12px;
  margin-top: 8px;
}

.figma-plugin-warning strong {
  color: #f59e0b;
  font-size: 12px;
  display: block;
  margin-bottom: 4px;
}

.figma-plugin-warning p {
  margin: 0 0 8px 0;
  color: var(--text-secondary);
  line-height: 1.4;
}

.figma-plugin-warning-actions {
  display: flex;
  gap: 8px;
}

.figma-plugin-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid var(--border);
  border-top-color: var(--accent, #0d99ff);
  border-radius: 50%;
  animation: figma-plugin-spin 0.6s linear infinite;
}

@keyframes figma-plugin-spin {
  to { transform: rotate(360deg); }
}
`;
function ze({ open: e, onClose: n, title: i, headerRight: r, children: t }) {
  ne(() => {
    if (!e) return;
    let s = document.getElementById(se);
    return s || (s = document.createElement("style"), s.id = se, s.textContent = _e, document.head.appendChild(s)), () => {
      const l = document.getElementById(se);
      l && l.remove();
    };
  }, [e]), ne(() => {
    if (!e) return;
    const s = (l) => {
      l.key === "Escape" && n();
    };
    return document.addEventListener("keydown", s), () => document.removeEventListener("keydown", s);
  }, [e, n]);
  const o = O(
    (s) => {
      s.target === s.currentTarget && n();
    },
    [n]
  );
  return e ? /* @__PURE__ */ f("div", { className: "figma-plugin-overlay", onClick: o, children: /* @__PURE__ */ y("div", { className: "figma-plugin-modal", children: [
    /* @__PURE__ */ y("div", { className: "figma-plugin-modal-header", children: [
      /* @__PURE__ */ f(
        "svg",
        {
          width: "16",
          height: "16",
          viewBox: "0 0 15 15",
          fill: "currentColor",
          children: /* @__PURE__ */ f(
            "path",
            {
              fillRule: "evenodd",
              clipRule: "evenodd",
              d: "M7.00005 2.04999H5.52505C4.71043 2.04999 4.05005 2.71037 4.05005 3.52499C4.05005 4.33961 4.71043 4.99999 5.52505 4.99999H7.00005V2.04999ZM7.00005 1.04999H8.00005H9.47505C10.842 1.04999 11.95 2.15808 11.95 3.52499C11.95 4.33163 11.5642 5.04815 10.9669 5.49999C11.5642 5.95184 11.95 6.66836 11.95 7.475C11.95 8.8419 10.842 9.95 9.47505 9.95C8.92236 9.95 8.41198 9.76884 8.00005 9.46266V9.95L8.00005 11.425C8.00005 12.7919 6.89195 13.9 5.52505 13.9C4.15814 13.9 3.05005 12.7919 3.05005 11.425C3.05005 10.6183 3.43593 9.90184 4.03317 9.44999C3.43593 8.99814 3.05005 8.28163 3.05005 7.475C3.05005 6.66836 3.43594 5.95184 4.03319 5.5C3.43594 5.04815 3.05005 4.33163 3.05005 3.52499C3.05005 2.15808 4.15814 1.04999 5.52505 1.04999H7.00005ZM8.00005 2.04999V4.99999H9.47505C10.2897 4.99999 10.95 4.33961 10.95 3.52499C10.95 2.71037 10.2897 2.04999 9.47505 2.04999H8.00005ZM5.52505 8.94998H7.00005L7.00005 7.4788L7.00005 7.475L7.00005 7.4712V6H5.52505C4.71043 6 4.05005 6.66038 4.05005 7.475C4.05005 8.28767 4.70727 8.94684 5.5192 8.94999L5.52505 8.94998ZM4.05005 11.425C4.05005 10.6123 4.70727 9.95315 5.5192 9.94999L5.52505 9.95H7.00005L7.00005 11.425C7.00005 12.2396 6.33967 12.9 5.52505 12.9C4.71043 12.9 4.05005 12.2396 4.05005 11.425ZM8.00005 7.47206C8.00164 6.65879 8.66141 6 9.47505 6C10.2897 6 10.95 6.66038 10.95 7.475C10.95 8.28962 10.2897 8.95 9.47505 8.95C8.66141 8.95 8.00164 8.29121 8.00005 7.47794V7.47206Z"
            }
          )
        }
      ),
      /* @__PURE__ */ f("span", { className: "figma-plugin-modal-title", children: i }),
      r && /* @__PURE__ */ f("div", { style: { marginLeft: "auto", display: "flex", alignItems: "center" }, children: r })
    ] }),
    /* @__PURE__ */ f("div", { className: "figma-plugin-modal-body", children: t })
  ] }) }) : null;
}
const De = "https://api.figma.com/v1";
async function Z(e, n, i, r) {
  const t = `${De}${n}`, o = Math.ceil(((r == null ? void 0 : r.timeout) ?? 3e4) / 1e3), s = [
    "-sS",
    "--max-time",
    String(o),
    "-H",
    `X-Figma-Token: ${i}`,
    t
  ], l = await e.exec("curl", s, {
    timeout: (r == null ? void 0 : r.timeout) ?? 12e4
  });
  if (l.exit_code !== 0)
    throw new Error(`Figma API request failed: ${l.stderr || `exit code ${l.exit_code}`}`);
  if (!l.stdout.trim())
    throw new Error("Empty response from Figma API");
  let u;
  try {
    u = JSON.parse(l.stdout);
  } catch {
    throw new Error(`Invalid JSON from Figma API: ${l.stdout.slice(0, 200)}`);
  }
  if (u.status && u.err)
    throw u.status === 429 ? new Error("Rate limited by Figma API. Try again in a moment.") : u.status === 403 ? new Error("Invalid or expired token. Please update your Figma token.") : u.status === 404 ? new Error("File not found. Check that the URL is correct and you have access.") : new Error(`Figma API error: ${u.err}`);
  return u;
}
async function Ce(e, n) {
  return Z(e, "/me", n);
}
async function je(e, n, i) {
  const r = await Z(e, `/files/${i}?depth=1`, n);
  return {
    name: r.name,
    pages: r.document.children.filter((t) => t.type === "CANVAS").map((t) => ({ id: t.id, name: t.name }))
  };
}
async function Ge(e, n, i, r) {
  const t = await Z(
    e,
    `/files/${i}/nodes?ids=${encodeURIComponent(r)}`,
    n,
    { timeout: 12e4 }
  ), o = t.nodes[r];
  if (!o) {
    const s = Object.keys(t.nodes), l = s.find(
      (u) => u.replace(/%3A/g, ":") === r || u === r.replace(/:/g, "%3A")
    );
    if (l)
      return {
        rootNode: t.nodes[l].document,
        components: t.nodes[l].components,
        styles: t.nodes[l].styles ?? {}
      };
    throw new Error(
      `Node "${r}" not found in API response. Available nodes: ${s.join(", ")}`
    );
  }
  return {
    rootNode: o.document,
    components: o.components,
    styles: o.styles ?? {}
  };
}
async function Ve(e, n, i) {
  const r = await Z(
    e,
    `/files/${i}`,
    n,
    { timeout: 12e4 }
  );
  return {
    rootNodes: r.document.children,
    components: r.components,
    styles: r.styles ?? {}
  };
}
async function ae(e, n, i, r, t = "png", o) {
  const s = r.map((m) => encodeURIComponent(m)).join(",");
  let l = `/images/${i}?ids=${s}&format=${t}`;
  return o != null && (l += `&scale=${o}`), t === "svg" && (l += "&svg_outline_text=true&svg_include_id=true&svg_simplify_stroke=true"), (await Z(
    e,
    l,
    n,
    { timeout: 12e4 }
  )).images;
}
async function Ke(e, n, i) {
  return (await Z(
    e,
    `/files/${i}/images`,
    n,
    { timeout: 12e4 }
  )).meta.images;
}
function Xe({ onTokenSaved: e }) {
  const n = ie(), i = (n == null ? void 0 : n.shell) ?? null, [r, t] = R(""), [o, s] = R(!1), [l, u] = R(null), m = O(async () => {
    if (!i) return;
    const p = r.trim();
    if (!(!p || o)) {
      s(!0), u(null);
      try {
        const h = await Ce(i, p);
        e(p, h);
      } catch (h) {
        u((h == null ? void 0 : h.message) || "Failed to validate token. Please check and try again.");
      } finally {
        s(!1);
      }
    }
  }, [r, o, i, e]), d = O(
    (p) => {
      p.key === "Enter" && m();
    },
    [m]
  );
  return /* @__PURE__ */ y("div", { children: [
    /* @__PURE__ */ y("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ f("h3", { style: { fontSize: "14px", fontWeight: 600, margin: "0 0 8px 0" }, children: "Connect to Figma" }),
      /* @__PURE__ */ y("p", { style: { fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 16px 0", lineHeight: 1.5 }, children: [
        "To get started, you need a Figma Personal Access Token.",
        " ",
        /* @__PURE__ */ f(
          "a",
          {
            href: "https://www.figma.com/developers/api#access-tokens",
            target: "_blank",
            rel: "noopener noreferrer",
            style: { color: "var(--accent, #0d99ff)" },
            children: "Generate one here"
          }
        ),
        '. Make sure "File content (Read)" scope is enabled.'
      ] })
    ] }),
    /* @__PURE__ */ y("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ f("label", { className: "figma-plugin-label", children: "Personal Access Token" }),
      /* @__PURE__ */ f(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: r,
          onChange: (p) => t(p.target.value),
          onKeyDown: d,
          disabled: o
        }
      ),
      l && /* @__PURE__ */ f("div", { className: "figma-plugin-error", children: l }),
      /* @__PURE__ */ f("div", { className: "figma-plugin-hint", children: "Token is stored locally in this project only." })
    ] }),
    /* @__PURE__ */ f(
      "button",
      {
        className: "btn-primary",
        onClick: m,
        disabled: !r.trim() || o,
        style: { width: "100%", marginTop: "4px" },
        children: o ? /* @__PURE__ */ y(de, { children: [
          /* @__PURE__ */ f("span", { className: "figma-plugin-spinner", style: { marginRight: "8px", verticalAlign: "middle" } }),
          "Connecting..."
        ] }) : "Connect"
      }
    )
  ] });
}
function Ze({ currentUser: e, onTokenUpdated: n, onTokenRemoved: i, onBack: r }) {
  const t = ie(), o = (t == null ? void 0 : t.shell) ?? null, [s, l] = R(""), [u, m] = R(!1), [d, p] = R(null), h = O(async () => {
    if (!o) return;
    const g = s.trim();
    if (!(!g || u)) {
      m(!0), p(null);
      try {
        const S = await Ce(o, g);
        n(g, S);
      } catch (S) {
        p((S == null ? void 0 : S.message) || "Failed to validate token. Please check and try again.");
      } finally {
        m(!1);
      }
    }
  }, [s, u, o, n]), b = O(
    (g) => {
      g.key === "Enter" && h();
    },
    [h]
  );
  return /* @__PURE__ */ y("div", { children: [
    /* @__PURE__ */ y(
      "button",
      {
        onClick: r,
        style: {
          background: "none",
          border: "none",
          color: "var(--accent, #0d99ff)",
          cursor: "pointer",
          padding: "0",
          fontSize: "12px",
          marginBottom: "12px",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px"
        },
        children: [
          /* @__PURE__ */ f("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ f("polyline", { points: "15 18 9 12 15 6" }) }),
          "Back"
        ]
      }
    ),
    /* @__PURE__ */ f("div", { className: "figma-plugin-section", children: /* @__PURE__ */ y("div", { className: "figma-plugin-success", style: { display: "flex", alignItems: "center", gap: "6px", marginTop: "0" }, children: [
      /* @__PURE__ */ f("span", { style: { fontSize: "10px" }, children: "●" }),
      "Connected as ",
      e.handle
    ] }) }),
    /* @__PURE__ */ y("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ f("label", { className: "figma-plugin-label", children: "Update Token" }),
      /* @__PURE__ */ f(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: s,
          onChange: (g) => l(g.target.value),
          onKeyDown: b,
          disabled: u
        }
      ),
      d && /* @__PURE__ */ f("div", { className: "figma-plugin-error", children: d }),
      /* @__PURE__ */ f(
        "button",
        {
          className: "btn-primary",
          onClick: h,
          disabled: !s.trim() || u,
          style: { width: "100%", marginTop: "8px" },
          children: u ? /* @__PURE__ */ y(de, { children: [
            /* @__PURE__ */ f("span", { className: "figma-plugin-spinner", style: { marginRight: "8px", verticalAlign: "middle" } }),
            "Validating..."
          ] }) : "Update"
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { className: "figma-plugin-section", style: { borderTop: "1px solid var(--border)", paddingTop: "16px" }, children: /* @__PURE__ */ f(
      "button",
      {
        className: "btn-secondary",
        onClick: i,
        style: { width: "100%" },
        children: "Disconnect"
      }
    ) })
  ] });
}
function qe(e) {
  const n = e.match(
    /figma\.com\/(file|design|proto|board)\/([A-Za-z0-9]+)/
  );
  if (!n) return null;
  const i = n[1], r = n[2];
  let t = null;
  const o = e.match(/[?&]node-id=([^&]+)/);
  return o && (t = decodeURIComponent(o[1]).replace(/-/g, ":")), { fileKey: r, nodeId: t, fileType: i };
}
function Ye(e) {
  switch (e) {
    case "MIN":
      return "flex-start";
    case "CENTER":
      return "center";
    case "MAX":
      return "flex-end";
    case "SPACE_BETWEEN":
      return "space-between";
    default:
      return "flex-start";
  }
}
function Je(e) {
  switch (e) {
    case "MIN":
      return "flex-start";
    case "CENTER":
      return "center";
    case "MAX":
      return "flex-end";
    case "BASELINE":
      return "baseline";
    default:
      return "flex-start";
  }
}
function Qe(e) {
  const n = {
    flexDirection: e.layoutMode === "HORIZONTAL" ? "row" : "column",
    justifyContent: Ye(e.primaryAxisAlignItems),
    alignItems: Je(e.counterAxisAlignItems),
    gap: e.itemSpacing ?? 0,
    padding: {
      top: e.paddingTop ?? 0,
      right: e.paddingRight ?? 0,
      bottom: e.paddingBottom ?? 0,
      left: e.paddingLeft ?? 0
    },
    flexWrap: e.layoutWrap === "WRAP" ? "wrap" : "nowrap"
  };
  return e.layoutWrap === "WRAP" && (n.rowGap = e.counterAxisSpacing ?? 0), n;
}
function et(e, n) {
  const i = n[e.componentId];
  let r;
  if (e.componentProperties) {
    const o = {};
    for (const [s, l] of Object.entries(e.componentProperties))
      (l.type === "VARIANT" || l.type === "BOOLEAN" || l.type === "TEXT") && (o[s] = l.value);
    Object.keys(o).length > 0 && (r = o);
  }
  const t = {
    componentId: e.componentId,
    componentName: (i == null ? void 0 : i.name) ?? e.name,
    isRemote: (i == null ? void 0 : i.remote) ?? !1,
    source: i != null && i.remote ? "library" : "local"
  };
  return i != null && i.description && (t.description = i.description), r && (t.variantProperties = r), e.overrides && (t.overrides = e.overrides), t;
}
function be(e, n, i, r) {
  const t = e;
  if (t.type === "SLICE") return null;
  const o = {
    id: t.id,
    name: t.name,
    type: t.type,
    visible: t.visible !== !1
    // defaults to true when undefined
  };
  switch (t.absoluteBoundingBox != null ? (o.width = t.absoluteBoundingBox.width, o.height = t.absoluteBoundingBox.height) : t.size != null && (o.width = t.size.x, o.height = t.size.y), "layoutSizingHorizontal" in t && (o.widthMode = t.layoutSizingHorizontal), "layoutSizingVertical" in t && (o.heightMode = t.layoutSizingVertical), "layoutPositioning" in t && t.layoutPositioning != null && (o.positioning = t.layoutPositioning), "layoutGrow" in t && t.layoutGrow === 1 && (o.layoutGrow = 1), "layoutAlign" in t && t.layoutAlign === "STRETCH" && (o.layoutAlign = "STRETCH"), o.positioning === "ABSOLUTE" && r != null && t.absoluteBoundingBox != null && (o.absoluteOffset = {
    top: Math.round(t.absoluteBoundingBox.y - r.y),
    left: Math.round(t.absoluteBoundingBox.x - r.x)
  }), "layoutMode" in t && t.layoutMode && t.layoutMode !== "NONE" && (o.autoLayout = Qe(t)), "constraints" in t && t.constraints != null && (o.constraints = t.constraints), "minWidth" in t && t.minWidth != null && (o.minWidth = t.minWidth), "maxWidth" in t && t.maxWidth != null && (o.maxWidth = t.maxWidth), "minHeight" in t && t.minHeight != null && (o.minHeight = t.minHeight), "maxHeight" in t && t.maxHeight != null && (o.maxHeight = t.maxHeight), "preserveRatio" in t && t.preserveRatio != null && (o.preserveRatio = t.preserveRatio), "fills" in t && Array.isArray(t.fills) && (o.fills = t.fills), "strokes" in t && Array.isArray(t.strokes) && (o.strokes = t.strokes), "strokeWeight" in t && t.strokeWeight != null && (o.strokeWeight = t.strokeWeight), "effects" in t && Array.isArray(t.effects) && (o.effects = t.effects), "cornerRadius" in t && t.cornerRadius != null && (o.cornerRadius = t.cornerRadius), "rectangleCornerRadii" in t && Array.isArray(t.rectangleCornerRadii) && (o.rectangleCornerRadii = t.rectangleCornerRadii), "opacity" in t && t.opacity != null && t.opacity !== 1 && (o.opacity = t.opacity), "blendMode" in t && t.blendMode && t.blendMode !== "PASS_THROUGH" && t.blendMode !== "NORMAL" && (o.blendMode = t.blendMode), "isMask" in t && t.isMask === !0 && (o.isMask = !0), "styles" in t && t.styles && (o.styleRefs = t.styles), t.type) {
    case "TEXT":
      o.textContent = t.characters, t.style && (o.textStyle = t.style), t.styleOverrideTable && Object.keys(t.styleOverrideTable).length > 0 && (o.textStyleOverrides = t.styleOverrideTable);
      break;
    case "INSTANCE":
      return o.componentRef = et(t, n), o;
    case "BOOLEAN_OPERATION":
      return o;
  }
  if ("children" in t && Array.isArray(t.children)) {
    const s = t.absoluteBoundingBox != null ? { x: t.absoluteBoundingBox.x, y: t.absoluteBoundingBox.y } : null, l = t.children.map((u) => be(u, n, i + 1, s)).filter((u) => u !== null);
    o.children = nt(l);
  }
  return o;
}
function pe(e) {
  let n = 1;
  if (e.children && Array.isArray(e.children))
    for (const i of e.children)
      n += pe(i);
  return n;
}
function tt(e) {
  const n = e.componentRef, i = n.variantProperties ? JSON.stringify(n.variantProperties, Object.keys(n.variantProperties).sort()) : "";
  return `${n.componentId}::${i}`;
}
function nt(e) {
  if (e.length === 0) return [];
  const n = /* @__PURE__ */ new Map();
  for (let t = 0; t < e.length; t++) {
    const o = e[t];
    if (o.componentRef) {
      const s = tt(o), l = n.get(s);
      l ? (l.count++, l.indices.push(t)) : n.set(s, { node: o, count: 1, indices: [t] });
    }
  }
  const i = /* @__PURE__ */ new Set();
  for (const t of n.values())
    if (t.count >= 3) {
      t.node.repeatCount = t.count;
      for (let o = 1; o < t.indices.length; o++)
        i.add(t.indices[o]);
    }
  const r = [];
  for (let t = 0; t < e.length; t++)
    i.has(t) || r.push(e[t]);
  return r;
}
function it(e, n) {
  let i = 0;
  for (const t of e)
    i += pe(t);
  return {
    rootNodes: e.map((t) => be(t, n, 0, null)).filter((t) => t !== null),
    nodeCount: i,
    truncated: !1
  };
}
function X(e) {
  const n = Math.round(e.r * 255), i = Math.round(e.g * 255), r = Math.round(e.b * 255);
  if (e.a >= 1)
    return `#${n.toString(16).padStart(2, "0")}${i.toString(16).padStart(2, "0")}${r.toString(16).padStart(2, "0")}`;
  const t = parseFloat(e.a.toFixed(2));
  return `rgba(${n}, ${i}, ${r}, ${t})`;
}
function rt(e) {
  const n = e.gradientStops.map((i) => `${X(i.color)} ${Math.round(i.position * 100)}%`).join(", ");
  switch (e.type) {
    case "GRADIENT_LINEAR": {
      const [i, r] = e.gradientHandlePositions, t = r.x - i.x, o = r.y - i.y, s = Math.atan2(o, t);
      return `linear-gradient(${(Math.round(s * 180 / Math.PI + 90) % 360 + 360) % 360}deg, ${n})`;
    }
    case "GRADIENT_RADIAL":
      return `radial-gradient(${n})`;
    case "GRADIENT_ANGULAR":
      return `conic-gradient(${n})`;
    case "GRADIENT_DIAMOND":
      return `/* diamond */ radial-gradient(${n})`;
    default:
      return `linear-gradient(${n})`;
  }
}
function ot(e, n) {
  const i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), u = [], m = /* @__PURE__ */ new Map();
  let d = 0, p = 0, h = 0;
  function b(c) {
    var x, L, _;
    if (c.fills && Array.isArray(c.fills)) {
      const C = at(c, n);
      for (const a of c.fills)
        if (a.visible !== !1)
          if (a.type === "SOLID") {
            const w = { ...a.color };
            a.opacity != null && a.opacity !== 1 && (w.a = w.a * a.opacity);
            const T = X(w);
            le(i, T, c.id, "fill", C);
          } else if ((x = a.type) != null && x.startsWith("GRADIENT_")) {
            const w = rt(a), T = w, P = r.get(T);
            P ? (P.usageCount++, P.nodeIds.push(c.id)) : (h++, r.set(T, {
              value: w,
              name: C ?? `gradient-${h}`,
              gradientType: a.type,
              usageCount: 1,
              nodeIds: [c.id]
            }));
          } else a.type === "IMAGE" && u.push({
            imageRef: a.imageRef,
            scaleMode: a.scaleMode,
            nodeId: c.id,
            nodeName: c.name
          });
    }
    if (c.strokes && Array.isArray(c.strokes)) {
      const C = lt(c, n);
      for (const a of c.strokes)
        if (a.visible !== !1 && a.type === "SOLID") {
          const w = { ...a.color };
          a.opacity != null && a.opacity !== 1 && (w.a = w.a * a.opacity);
          const T = X(w);
          le(i, T, c.id, "stroke", C);
        }
    }
    if (c.effects && Array.isArray(c.effects)) {
      const C = ut(c, n);
      for (const a of c.effects)
        if (a.visible === !0 && (a.type === "DROP_SHADOW" || a.type === "INNER_SHADOW")) {
          const w = a.type === "DROP_SHADOW" ? "drop-shadow" : "inner-shadow", T = X(a.color), P = ((L = a.offset) == null ? void 0 : L.x) ?? 0, U = ((_ = a.offset) == null ? void 0 : _.y) ?? 0, D = a.radius ?? 0, B = a.spread ?? 0, M = `${w}|${T}|${P}|${U}|${D}|${B}`, j = l.get(M);
          j ? (j.usageCount++, j.nodeIds.push(c.id)) : (p++, l.set(M, {
            type: w,
            color: T,
            offsetX: P,
            offsetY: U,
            blur: D,
            spread: B,
            name: C ?? `shadow-${p}`,
            usageCount: 1,
            nodeIds: [c.id]
          })), le(i, T, c.id, "shadow", null);
        }
    }
    if (c.type === "TEXT" && c.textStyle) {
      const C = ct(c, n);
      if (xe(t, c.textStyle, c.id, C), c.textStyleOverrides && typeof c.textStyleOverrides == "object")
        for (const a of Object.values(c.textStyleOverrides))
          xe(t, a, c.id, null);
    }
    if (c.autoLayout) {
      const C = c.autoLayout;
      C.padding && (K(o, C.padding.top, "padding-top"), K(o, C.padding.right, "padding-right"), K(o, C.padding.bottom, "padding-bottom"), K(o, C.padding.left, "padding-left")), K(o, C.gap, "gap"), C.rowGap != null && K(o, C.rowGap, "row-gap");
    }
    if (c.cornerRadius != null || c.rectangleCornerRadii != null || st(c)) {
      const C = c.rectangleCornerRadii ? null : c.cornerRadius ?? null, a = c.rectangleCornerRadii ?? null;
      let w = null, T = null;
      if (c.strokes && Array.isArray(c.strokes)) {
        const D = c.strokes.find(
          (B) => B.visible !== !1 && B.type === "SOLID"
        );
        D && (w = X(D.color), T = c.strokeWeight ?? null);
      }
      const P = `${C}|${JSON.stringify(a)}|${w}|${T}`, U = s.get(P);
      U ? (U.usageCount++, U.nodeIds.push(c.id)) : (d++, s.set(P, {
        radius: C,
        cornerRadii: a,
        strokeColor: w,
        strokeWeight: T,
        name: `border-${d}`,
        usageCount: 1,
        nodeIds: [c.id]
      }));
    }
    if (c.componentRef) {
      const C = c.componentRef, a = `${C.componentName}::${JSON.stringify(C.variantProperties ?? {})}`, w = m.get(a), T = c.repeatCount ?? 1;
      if (w)
        w.usageCount += T;
      else {
        const P = {
          componentName: C.componentName,
          source: C.source,
          usageCount: T
        };
        C.description && (P.description = C.description), C.variantProperties && (P.variantProperties = C.variantProperties), m.set(a, P);
      }
    }
    if (c.children)
      for (const C of c.children)
        b(C);
  }
  for (const c of e)
    b(c);
  const g = Array.from(i.values()).map((c) => ({
    value: c.value,
    name: c.name,
    usageCount: c.usageCount,
    nodeIds: c.nodeIds,
    source: Array.from(c.source)
  }));
  g.sort((c, x) => x.usageCount - c.usageCount);
  const S = Array.from(r.values());
  S.sort((c, x) => x.usageCount - c.usageCount);
  const I = Array.from(t.values());
  I.sort((c, x) => x.usageCount - c.usageCount);
  const A = Array.from(o.values());
  A.sort((c, x) => c.value - x.value);
  const H = Array.from(s.values());
  H.sort((c, x) => x.usageCount - c.usageCount);
  const W = Array.from(l.values());
  W.sort((c, x) => x.usageCount - c.usageCount);
  const E = Array.from(m.values());
  return E.sort((c, x) => x.usageCount - c.usageCount), {
    colors: g,
    gradients: S,
    typography: I,
    spacing: A,
    borders: H,
    shadows: W,
    imageFills: u,
    components: E
  };
}
function le(e, n, i, r, t) {
  const o = e.get(n);
  if (o)
    o.usageCount++, o.nodeIds.includes(i) || o.nodeIds.push(i), o.source.add(r), t && o.name.startsWith("color-") && (o.name = t);
  else {
    const s = `color-${n.replace(/^#/, "").replace(/[^a-f0-9]/gi, "")}`;
    e.set(n, {
      value: n,
      name: t ?? s,
      usageCount: 1,
      nodeIds: [i],
      source: /* @__PURE__ */ new Set([r])
    });
  }
}
function xe(e, n, i, r) {
  const t = n.fontFamily ?? "Unknown", o = n.fontSize ?? 16, s = n.fontWeight ?? 400, l = n.lineHeightPx ?? null, u = n.letterSpacing ?? 0, m = `${t}|${o}|${s}|${l}|${u}`, d = e.get(m);
  if (d)
    d.usageCount++, d.nodeIds.includes(i) || d.nodeIds.push(i), r && d.name.startsWith(t) && (d.name = r);
  else {
    const p = `${t}-${o}-${s}`;
    e.set(m, {
      fontFamily: t,
      fontSize: o,
      fontWeight: s,
      lineHeight: l,
      letterSpacing: u,
      name: r ?? p,
      usageCount: 1,
      nodeIds: [i]
    });
  }
}
function K(e, n, i) {
  if (n === 0) return;
  const r = e.get(n);
  r ? (r.usageCount++, r.sources.includes(i) || r.sources.push(i)) : e.set(n, {
    value: n,
    usageCount: 1,
    sources: [i]
  });
}
function st(e) {
  return !e.strokes || !Array.isArray(e.strokes) ? !1 : e.strokes.some((n) => n.visible !== !1 && n.type === "SOLID");
}
function at(e, n) {
  var r, t;
  const i = (r = e.styleRefs) == null ? void 0 : r.fill;
  return i ? ((t = n[i]) == null ? void 0 : t.name) ?? null : null;
}
function lt(e, n) {
  var r, t;
  const i = (r = e.styleRefs) == null ? void 0 : r.stroke;
  return i ? ((t = n[i]) == null ? void 0 : t.name) ?? null : null;
}
function ct(e, n) {
  var r, t;
  const i = (r = e.styleRefs) == null ? void 0 : r.text;
  return i ? ((t = n[i]) == null ? void 0 : t.name) ?? null : null;
}
function ut(e, n) {
  var r, t;
  const i = (r = e.styleRefs) == null ? void 0 : r.effect;
  return i ? ((t = n[i]) == null ? void 0 : t.name) ?? null : null;
}
const ft = 500, dt = 2e3;
function $e(e, n) {
  const i = [], r = e.type === "INSTANCE" ? e.id : n;
  if (e.fills && Array.isArray(e.fills))
    for (const t of e.fills)
      t.type === "IMAGE" && t.visible !== !1 && i.push({
        imageRef: t.imageRef,
        scaleMode: t.scaleMode ?? "FILL",
        nodeId: e.id,
        nodeName: e.name,
        parentInstanceId: n
      });
  if (e.children && Array.isArray(e.children))
    for (const t of e.children)
      i.push(...$e(t, r));
  return i;
}
function pt(e) {
  const n = /* @__PURE__ */ new Set();
  function i(t) {
    if (t.type === "TEXT") return !0;
    if (t.children && Array.isArray(t.children)) {
      for (const o of t.children)
        if (i(o)) return !0;
    }
    return !1;
  }
  function r(t) {
    if (t.type === "INSTANCE" && i(t) && n.add(t.id), t.children && Array.isArray(t.children))
      for (const o of t.children)
        r(o);
  }
  return r(e), n;
}
async function gt(e) {
  const { shell: n, token: i, fileKey: r, nodeId: t, scope: o } = e;
  let s, l, u;
  if (o === "node" || o === "frame") {
    if (!t)
      throw new Error(
        `Cannot extract ${o}: no node ID found in the URL. Paste a Figma URL that includes a node-id, or switch to "Entire Page" scope.`
      );
    const I = await Ge(n, i, r, t);
    s = [I.rootNode], l = I.components, u = I.styles;
  } else {
    const I = await Ve(n, i, r), A = I.rootNodes[0];
    s = (A == null ? void 0 : A.children) || [], l = I.components, u = I.styles;
  }
  let m = 0;
  for (const I of s)
    m += pe(I);
  let d;
  m > ft && (d = {
    nodeCount: m,
    message: `This selection has ~${m} nodes. Large extractions may produce verbose output.`
  });
  const p = [];
  for (const I of s)
    p.push(...$e(I));
  const h = /* @__PURE__ */ new Set();
  for (const I of s)
    for (const A of pt(I))
      h.add(A);
  const b = it(s, l);
  m > dt && (b.truncated = !0);
  const g = ot(b.rootNodes, u), S = new Set(g.imageFills.map((I) => I.nodeId));
  for (const I of p)
    S.has(I.nodeId) || (S.add(I.nodeId), g.imageFills.push(I));
  return { extraction: b, tokens: g, fileKey: r, largeTreeWarning: d, instancesWithText: h };
}
function G(e) {
  return e.toLowerCase().replace(/[/\s]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "") || "unnamed";
}
function mt(e) {
  const n = /* @__PURE__ */ new Map();
  return e.map((i) => {
    const r = n.get(i.filename) ?? 0;
    if (n.set(i.filename, r + 1), r === 0)
      return { ...i };
    const t = i.filename.lastIndexOf(".");
    if (t === -1)
      return { ...i, filename: `${i.filename}-${r + 1}` };
    const o = i.filename.slice(0, t), s = i.filename.slice(t);
    return { ...i, filename: `${o}-${r + 1}${s}` };
  });
}
const ht = /* @__PURE__ */ new Set([
  "VECTOR",
  "BOOLEAN_OPERATION",
  "STAR",
  "POLYGON",
  "ELLIPSE"
]);
function ue(e) {
  var n;
  return ((n = e.fills) == null ? void 0 : n.some((i) => i.type === "IMAGE")) ?? !1;
}
function we(e) {
  var i;
  const n = (i = e.fills) == null ? void 0 : i.find((r) => r.type === "IMAGE");
  return n == null ? void 0 : n.imageRef;
}
function yt(e) {
  const n = e.componentRef, i = n.variantProperties ? Object.entries(n.variantProperties).sort(([r], [t]) => r.localeCompare(t)).map(([r, t]) => `${r}=${t}`).join(",") : "";
  return `${n.componentId}|${i}`;
}
function xt(e) {
  var n, i, r;
  return !((n = e.strokes) != null && n.some((t) => t.visible !== !1) || (i = e.fills) != null && i.some((t) => {
    var o;
    return t.visible !== !1 && ((o = t.type) == null ? void 0 : o.startsWith("GRADIENT_"));
  }) || ue(e) || (r = e.effects) != null && r.some((t) => t.visible !== !1));
}
function wt(e) {
  return /Property\s+\d+=/i.test(e) ? e.split(",").map((n) => {
    const i = n.indexOf("=");
    if (i !== -1) {
      const r = n.slice(0, i).trim(), t = n.slice(i + 1).trim();
      if (/^Property\s+\d+$/i.test(r)) return t;
    }
    return n.trim();
  }).join(", ") : e;
}
function Ie(e, n, i, r, t, o, s, l, u, m) {
  if (t.has(e.id)) {
    r.push({
      nodeId: e.id,
      nodeName: e.name,
      exportType: "png-render",
      filename: G(e.name) + ".png"
    });
    return;
  }
  if (e.type === "INSTANCE" && e.componentRef) {
    if (ue(e)) {
      const b = n.get(e.id) ?? we(e);
      n.has(e.id) && i.add(e.id);
      const g = u.get(e.id) ?? [];
      for (const S of g) i.add(S.nodeId);
      if (b && l.has(b)) return;
      b && l.add(b), r.push({
        nodeId: e.id,
        nodeName: e.name,
        exportType: "png-fill",
        filename: G(e.name) + ".png",
        imageRef: b
      });
      return;
    }
    const d = u.get(e.id) ?? [];
    if (d.length > 0) {
      for (const b of d)
        i.add(b.nodeId), !l.has(b.imageRef) && (l.add(b.imageRef), r.push({
          nodeId: b.nodeId,
          nodeName: b.nodeName,
          exportType: "png-fill",
          filename: G(b.nodeName) + ".png",
          imageRef: b.imageRef,
          parentInstanceId: e.id
        }));
      return;
    }
    if (m.has(e.id))
      return;
    const p = wt(e.componentRef.componentName), h = yt(e);
    o.has(h) || (o.add(h), r.push({
      nodeId: e.id,
      nodeName: p,
      exportType: "png-render",
      filename: G(p) + ".png"
    }));
    return;
  }
  if (ue(e)) {
    const d = n.get(e.id) ?? we(e);
    n.has(e.id) && i.add(e.id), r.push({
      nodeId: e.id,
      nodeName: e.name,
      exportType: "png-fill",
      filename: G(e.name) + ".png",
      imageRef: d
    });
    return;
  }
  if (e.type !== "LINE") {
    if (ht.has(e.type)) {
      const d = G(e.name) + ".svg";
      s.has(d) || (s.add(d), r.push({
        nodeId: e.id,
        nodeName: e.name,
        exportType: "svg",
        filename: d
      }));
      return;
    }
    if (e.type === "RECTANGLE") {
      if (xt(e)) return;
      const d = G(e.name) + ".svg";
      s.has(d) || (s.add(d), r.push({
        nodeId: e.id,
        nodeName: e.name,
        exportType: "svg",
        filename: d
      }));
      return;
    }
    if (e.children)
      for (const d of e.children)
        Ie(d, n, i, r, t, o, s, l, u, m);
  }
}
function vt(e, n, i = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set()) {
  const t = /* @__PURE__ */ new Map();
  for (const p of n)
    t.set(p.nodeId, p.imageRef);
  const o = /* @__PURE__ */ new Map();
  for (const p of n)
    if (p.parentInstanceId) {
      let h = o.get(p.parentInstanceId);
      h || (h = [], o.set(p.parentInstanceId, h)), h.push(p);
    }
  const s = [], l = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set();
  for (const p of e)
    if (p.children)
      for (const h of p.children)
        Ie(h, t, l, s, i, u, m, d, o, r);
  for (const p of n)
    l.has(p.nodeId) || s.push({
      nodeId: p.nodeId,
      nodeName: p.nodeName,
      exportType: "png-fill",
      filename: G(p.nodeName) + ".png",
      imageRef: p.imageRef
    });
  return mt(s);
}
const Ct = 5, bt = 3, $t = 3, It = /* @__PURE__ */ new Set([
  "VECTOR",
  "ELLIPSE",
  "LINE",
  "STAR",
  "POLYGON",
  "RECTANGLE",
  "BOOLEAN_OPERATION",
  "GROUP",
  "FRAME"
]);
function Tt(e) {
  const n = /* @__PURE__ */ new Set(), i = [];
  for (const r of e)
    if (r.children)
      for (const t of r.children)
        Te(t, n, i);
  return { compositionNodeIds: n, warnings: i };
}
function Te(e, n, i) {
  if (Nt(e)) {
    n.add(e.id), ge(e) && me(e, 0) ? i.push(`Composition "${e.name}" — multi-layer group with blend/mask effects, exported as single PNG`) : i.push(`Illustration "${e.name}" — vector-only group (no text/instances), exported as single PNG`);
    return;
  }
  if (e.children)
    for (const r of e.children)
      Te(r, n, i);
}
function Nt(e) {
  return !!(ge(e) && me(e, 0) || Rt(e));
}
function Rt(e) {
  return e.type !== "GROUP" && e.type !== "FRAME" || !e.children || e.children.length === 0 || !ge(e) ? !1 : Ne(e);
}
function Ne(e) {
  if (!e.children) return !0;
  for (const n of e.children)
    if (!It.has(n.type) || !Ne(n)) return !1;
  return !0;
}
function ge(e) {
  return !!(e.children && e.children.length >= Ct || e.type === "BOOLEAN_OPERATION" || Re(e, 0) >= bt);
}
function me(e, n) {
  if (n > $t) return !1;
  if (e.blendMode || e.isMask === !0 || e.opacity !== void 0 && e.opacity < 1) return !0;
  if (e.children) {
    for (const i of e.children)
      if (me(i, n + 1)) return !0;
  }
  return !1;
}
function Re(e, n) {
  if (!e.children || e.children.length === 0)
    return n;
  let i = n;
  for (const r of e.children) {
    const t = Re(r, n + 1);
    t > i && (i = t);
  }
  return i;
}
async function St(e, n) {
  const i = `${n}/.shipstudio/assets`, r = await e.exec("rm", ["-rf", i]);
  if (r.exit_code !== 0)
    throw new Error(`Failed to clean assets directory: ${r.stderr}`);
  const t = await e.exec("mkdir", ["-p", i]);
  if (t.exit_code !== 0)
    throw new Error(`Failed to create assets directory: ${t.stderr}`);
  return i;
}
async function Se(e, n, i) {
  const r = ["-sS", "-o", i, "--max-time", "30", "-L", n];
  if ((await e.exec("curl", r, { timeout: 35e3 })).exit_code === 0) return { success: !0 };
  const o = await e.exec("curl", r, { timeout: 35e3 });
  return o.exit_code === 0 ? { success: !0 } : {
    success: !1,
    error: o.stderr || `curl exit code ${o.exit_code}`
  };
}
async function kt(e, n, i, r) {
  const t = [], o = [];
  for (let s = 0; s < i.length; s++) {
    const { filename: l, url: u, nodeId: m, assetType: d, parentInstanceId: p } = i[s], h = `${n}/${l}`;
    r && r({
      current: s + 1,
      total: i.length,
      currentAsset: l,
      phase: "assets"
    });
    const b = await Se(e, u, h);
    if (b.success) {
      const g = { filename: l, path: h };
      m !== void 0 && (g.nodeId = m), d !== void 0 && (g.assetType = d), p !== void 0 && (g.parentInstanceId = p), t.push(g);
    } else
      o.push(`Failed to download ${l}: ${b.error}`);
  }
  return { downloaded: t, warnings: o };
}
async function At(e) {
  const { shell: n, token: i, fileKey: r, selectedNodeId: t, projectPath: o, rootNodes: s, imageFills: l, instancesWithText: u, onProgress: m } = e, d = [], p = await St(n, o), { compositionNodeIds: h, warnings: b } = Tt(s);
  d.push(...b);
  const g = vt(s, l, h, u);
  m && m({ current: 0, total: g.length + 1, currentAsset: "preview.png", phase: "preview" });
  let S = `${p}/preview.png`;
  try {
    const w = (await ae(n, i, r, [t], "png", 2))[t];
    if (w) {
      const T = await Se(n, w, S);
      T.success || (d.push(`Preview download failed: ${T.error}`), S = "");
    } else
      d.push("Figma could not render preview for this node"), S = "";
  } catch (a) {
    d.push(`Preview render failed: ${(a == null ? void 0 : a.message) || "Unknown error"}`), S = "";
  }
  const I = g.filter((a) => a.exportType === "svg");
  let A = {};
  if (I.length > 0)
    try {
      A = await ae(n, i, r, I.map((a) => a.nodeId), "svg");
    } catch (a) {
      d.push(`SVG render API failed: ${(a == null ? void 0 : a.message) || "Unknown error"}`);
    }
  const H = g.filter((a) => a.exportType === "png-fill");
  let W = {};
  if (H.length > 0)
    try {
      W = await Ke(n, i, r);
    } catch (a) {
      d.push(`Image fills API failed: ${(a == null ? void 0 : a.message) || "Unknown error"}`);
    }
  const E = g.filter((a) => a.exportType === "png-render");
  let c = {};
  if (E.length > 0)
    try {
      c = await ae(n, i, r, E.map((a) => a.nodeId), "png", 2);
    } catch (a) {
      d.push(`Composition PNG render failed: ${(a == null ? void 0 : a.message) || "Unknown error"}`);
    }
  const x = new Set(h), L = [];
  for (const a of I) {
    const w = A[a.nodeId];
    w ? L.push({ filename: a.filename, url: w, nodeId: a.nodeId, assetType: "icon" }) : d.push(`No render URL for ${a.filename} (node ${a.nodeId})`);
  }
  for (const a of H)
    if (a.imageRef && W[a.imageRef]) {
      const w = { filename: a.filename, url: W[a.imageRef], nodeId: a.nodeId, assetType: "image" };
      a.parentInstanceId && (w.parentInstanceId = a.parentInstanceId), L.push(w);
    } else
      d.push(`No download URL for image fill ${a.filename} (ref: ${a.imageRef})`);
  for (const a of E) {
    const w = c[a.nodeId];
    if (w) {
      const T = x.has(a.nodeId) ? "composition" : "component";
      L.push({ filename: a.filename, url: w, nodeId: a.nodeId, assetType: T });
    } else
      d.push(`No render URL for ${a.filename} (node ${a.nodeId})`);
  }
  const { downloaded: _, warnings: C } = await kt(
    n,
    p,
    L,
    m
  );
  return d.push(...C), {
    assetsDir: p,
    previewPath: S,
    assets: _,
    warnings: d
  };
}
const Et = /^(Frame|Group|Rectangle|Ellipse|Vector|Section|Instance|Line|Star|Polygon)\s*\d*$/i;
function Lt(e) {
  const n = /* @__PURE__ */ new Map();
  for (const i of e) {
    const r = Ae(i.name) ? [] : [i.name];
    ke(i, r, n);
  }
  return n;
}
function ke(e, n, i) {
  if (i.set(e.id, Pt(n)), !!e.children)
    for (const r of e.children) {
      const t = Ae(r.name) ? n : [...n, r.name];
      ke(r, t, i);
    }
}
function Pt(e) {
  return e.length === 0 ? "" : e.length <= 4 ? e.join(" > ") : `${e[0]} > ... > ${e[e.length - 2]} > ${e[e.length - 1]}`;
}
function Ae(e) {
  return Et.test(e);
}
const ve = 12e3;
function Ot(e) {
  return Math.ceil(e.length / 4);
}
function Mt(e) {
  const { extraction: n, exportResult: i, projectPath: r } = e, t = n.tokens, o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
  for (const g of i.assets)
    g.nodeId && (o.set(g.nodeId, g.filename), g.assetType === "composition" && s.add(g.nodeId)), g.parentInstanceId && !o.has(g.parentInstanceId) && o.set(g.parentInstanceId, g.filename);
  const l = e.rootNodes ?? n.extraction.rootNodes, u = Lt(l), d = [
    Ft(e),
    Ht(),
    Ut(i.previewPath, r),
    Bt(n.extraction.rootNodes, o, s),
    jt(t),
    Yt(t.components),
    Jt(i.previewPath, i.assets, r, u)
  ].filter(Boolean).join(`

`), p = d.length, h = Ot(d), b = {
    nodeCount: n.extraction.nodeCount,
    colorCount: t.colors.length,
    fontCount: t.typography.length,
    assetCount: i.assets.length,
    estimatedTokens: h
  };
  return {
    markdown: d,
    charCount: p,
    estimatedTokens: h,
    stats: b
  };
}
function Ft(e) {
  var s;
  const { extraction: n, fileName: i, figmaUrl: r } = e, t = ((s = n.extraction.rootNodes[0]) == null ? void 0 : s.name) ?? "Untitled", o = e.date ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  return [
    "# Design Brief",
    "",
    `**File:** ${i}`,
    `**Frame:** ${t}`,
    `**Extracted:** ${o}`,
    `**Figma URL:** ${r}`
  ].join(`
`);
}
function Ht() {
  return [
    "## How to Use This Brief",
    "",
    "**Before building:** Read this brief fully. Plan your approach and ask clarifying questions before writing any code.",
    "**During building:** Use only the assets listed in the Assets section below -- if an asset is missing, ask the user rather than substituting or fabricating a replacement.",
    "**After building:** Compare your result against the Preview image above and verify that all design tokens and assets are correctly applied."
  ].join(`
`);
}
function Ut(e, n) {
  return e ? `## Preview

![Preview](${fe(e, n)})` : "";
}
function Bt(e, n, i) {
  const r = [];
  for (const t of e)
    Ee(t, 0, r, n, i);
  return r.length === 0 ? "" : `## Layout Tree

` + r.join(`
`);
}
function Ee(e, n, i, r, t) {
  if (e.visible !== !1) {
    if (t.has(e.id)) {
      const o = "  ".repeat(n), s = r.get(e.id), l = e.width != null && e.height != null ? ` ${Math.round(e.width)}x${Math.round(e.height)}` : "", u = s ? ` -> ${s}` : "";
      i.push(`${o}[Illustration] '${e.name}'${l}${u}`);
      return;
    }
    if (i.push(_t(e, n, r)), !e.componentRef && e.children)
      for (const o of e.children)
        Ee(o, n + 1, i, r, t);
  }
}
function Wt(e) {
  return e.charAt(0).toUpperCase() + e.slice(1).toLowerCase();
}
function Le(e) {
  return /Property\s+\d+=/i.test(e) ? e.split(",").map((n) => {
    const i = n.indexOf("=");
    if (i !== -1) {
      const r = n.slice(0, i).trim(), t = n.slice(i + 1).trim();
      if (/^Property\s+\d+$/i.test(r)) return t;
    }
    return n.trim();
  }).join(", ") : e;
}
function _t(e, n, i) {
  const r = "  ".repeat(n), t = [];
  if (e.componentRef) {
    let l = `Instance "${Le(e.componentRef.componentName)}"`;
    if (e.repeatCount && e.repeatCount > 1 && (l += ` x${e.repeatCount} (repeated)`), e.componentRef.variantProperties && Object.keys(e.componentRef.variantProperties).length > 0) {
      const m = Object.entries(e.componentRef.variantProperties).map(([d, p]) => /^Property\s+\d+$/i.test(d) ? String(p) : `${d}: ${p}`).join(", ");
      l += ` (${m})`;
    }
    const u = i == null ? void 0 : i.get(e.id);
    u && (l += ` -> ${u}`), t.push(l);
  } else if (e.type === "TEXT") {
    const s = e.textContent ?? "", l = s.length > 200 ? s.slice(0, 200) + "..." : s;
    let u = "";
    e.textStyle && (u = ` (${e.textStyle.fontFamily} ${e.textStyle.fontSize}/${e.textStyle.fontWeight})`), t.push(`Text '${l}'${u}`);
  } else
    t.push(`${Wt(e.type)} '${e.name}'`);
  if (e.autoLayout) {
    const s = e.autoLayout, l = [s.flexDirection];
    s.gap > 0 && l.push(`gap: ${s.gap}`), s.justifyContent !== "flex-start" && l.push(`justify: ${s.justifyContent}`), s.alignItems !== "flex-start" && l.push(`align: ${s.alignItems}`);
    const u = Dt(s.padding);
    u && l.push(u), s.flexWrap === "wrap" && l.push("wrap"), t.push(`(${l.join(", ")})`);
  }
  e.width != null && e.height != null && t.push(`${Math.round(e.width)}x${Math.round(e.height)}`), e.positioning === "ABSOLUTE" && (e.absoluteOffset ? t.push(`[absolute] top:${e.absoluteOffset.top} left:${e.absoluteOffset.left}`) : t.push("[absolute]"));
  const o = zt(e);
  return o && t.push(o), `${r}${t.join(" ")}`;
}
function ce(e) {
  if (!e) return null;
  for (const n of e)
    if (n.visible !== !1 && n.type === "SOLID" && n.color) {
      const i = n.opacity ?? 1, r = { ...n.color, a: (n.color.a ?? 1) * i };
      return X(r);
    }
  return null;
}
function zt(e) {
  var i;
  const n = [];
  if (e.widthMode === "FILL" && n.push("w:fill"), e.heightMode === "FILL" && n.push("h:fill"), e.widthMode === "HUG" && n.push("w:hug"), e.heightMode === "HUG" && n.push("h:hug"), e.type !== "TEXT") {
    const r = ce(e.fills);
    r && r !== "#ffffff" && r !== "#000000" ? n.push(`bg:${r}`) : r && n.push(`bg:${r}`);
  }
  if (e.type === "TEXT") {
    const r = ce(e.fills);
    r && n.push(`color:${r}`);
  }
  if (e.cornerRadius && e.cornerRadius > 0 && n.push(`r:${Math.round(e.cornerRadius)}`), e.strokeWeight && e.strokeWeight > 0 && ((i = e.strokes) != null && i.length)) {
    const r = ce(e.strokes);
    r && n.push(`border:${e.strokeWeight}px ${r}`);
  }
  return e.layoutGrow === 1 && n.push("flex-grow:1"), e.layoutAlign === "STRETCH" && n.push("align-self:stretch"), e.opacity != null && e.opacity < 1 && n.push(`opacity:${e.opacity.toFixed(2)}`), n.length === 0 ? null : `{${n.join(" ")}}`;
}
function Dt(e) {
  return e.top === 0 && e.right === 0 && e.bottom === 0 && e.left === 0 ? null : e.top === e.bottom && e.left === e.right && e.top === e.left ? `padding: ${e.top}` : e.top === e.bottom && e.left === e.right ? `padding: ${e.top} ${e.left}` : `padding: ${e.top} ${e.right} ${e.bottom} ${e.left}`;
}
function jt(e) {
  const n = [];
  return e.colors.length > 0 && n.push(Gt(e.colors)), e.gradients.length > 0 && n.push(Vt(e.gradients)), e.typography.length > 0 && n.push(Kt(e.typography)), e.spacing.length > 0 && n.push(Xt(e.spacing)), e.borders.length > 0 && n.push(Zt(e.borders)), e.shadows.length > 0 && n.push(qt(e.shadows)), n.length === 0 ? "" : `## Design Tokens

` + n.join(`

`);
}
function Gt(e) {
  return [
    "### Colors",
    "",
    "| Name | Value | Usage |",
    "|------|-------|-------|",
    ...e.map((i) => `| ${i.name} | ${i.value} | ${i.usageCount} |`)
  ].join(`
`);
}
function Vt(e) {
  return [
    "### Gradients",
    "",
    "| Name | Value | Usage |",
    "|------|-------|-------|",
    ...e.map((i) => `| ${i.name} | ${i.value} | ${i.usageCount} |`)
  ].join(`
`);
}
function Kt(e) {
  return [
    "### Typography",
    "",
    "| Name | Font | Size | Weight | Line Height |",
    "|------|------|------|--------|-------------|",
    ...e.map((i) => {
      const r = i.lineHeight !== null ? `${i.lineHeight}px` : "auto";
      return `| ${i.name} | ${i.fontFamily} | ${i.fontSize}px | ${i.fontWeight} | ${r} |`;
    })
  ].join(`
`);
}
function Xt(e) {
  return [
    "### Spacing",
    "",
    "| Value | Sources | Usage |",
    "|-------|---------|-------|",
    ...e.map((i) => `| ${i.value}px | ${i.sources.join(", ")} | ${i.usageCount} |`)
  ].join(`
`);
}
function Zt(e) {
  return [
    "### Borders",
    "",
    "| Name | Radius | Stroke | Usage |",
    "|------|--------|--------|-------|",
    ...e.map((i) => {
      const r = i.radius !== null ? `${i.radius}px` : i.cornerRadii ? i.cornerRadii.map((o) => `${o}px`).join(" ") : "--", t = i.strokeWeight !== null && i.strokeColor !== null ? `${i.strokeWeight}px ${i.strokeColor}` : "--";
      return `| ${i.name} | ${r} | ${t} | ${i.usageCount} |`;
    })
  ].join(`
`);
}
function qt(e) {
  return [
    "### Shadows",
    "",
    "| Name | Type | Value | Usage |",
    "|------|------|-------|-------|",
    ...e.map((i) => {
      const r = `${i.offsetX}px ${i.offsetY}px ${i.blur}px ${i.spread}px ${i.color}`;
      return `| ${i.name} | ${i.type} | ${r} | ${i.usageCount} |`;
    })
  ].join(`
`);
}
function Yt(e) {
  return e.length === 0 ? "" : [
    "## Components",
    "",
    "| Component | Source | Variants | Usage |",
    "|-----------|--------|----------|-------|",
    ...e.map((i) => {
      const r = Le(i.componentName), t = i.variantProperties && Object.keys(i.variantProperties).length > 0 ? Object.entries(i.variantProperties).map(([o, s]) => /^Property\s+\d+$/i.test(o) ? String(s) : `${o}: ${s}`).join(", ") : "--";
      return `| ${r} | ${i.source} | ${t} | ${i.usageCount} |`;
    })
  ].join(`
`);
}
function Jt(e, n, i, r) {
  if (!e && n.length === 0) return "";
  const t = [];
  if (e) {
    const o = fe(e, i), s = o.split("/").pop() ?? o;
    t.push(`| ${s} | Preview | -- | ${o} |`);
  }
  for (const o of n) {
    const s = fe(o.path, i), l = Qt(o.assetType);
    let u = "--";
    o.nodeId && (u = r.get(o.nodeId) || o.parentInstanceId && r.get(o.parentInstanceId) || "--"), t.push(`| ${o.filename} | ${l} | ${u} | ${s} |`);
  }
  return [
    "## Assets",
    "",
    "| File | Type | Location | Path |",
    "|------|------|----------|------|",
    ...t
  ].join(`
`);
}
function Qt(e) {
  switch (e) {
    case "icon":
      return "Icon";
    case "image":
      return "Image";
    case "composition":
      return "Composition";
    case "component":
      return "Component";
    default:
      return "File";
  }
}
function fe(e, n) {
  return e.startsWith(n + "/") ? e.slice(n.length + 1) : e;
}
async function en(e, n, i) {
  const r = `${n}/brief.md`, t = btoa(unescape(encodeURIComponent(i))), o = await e.exec("bash", [
    "-c",
    `echo '${t}' | base64 -d > '${r}'`
  ]);
  if (o.exit_code !== 0)
    throw new Error(`Failed to save brief: ${o.stderr}`);
}
async function tn(e, n) {
  const i = btoa(unescape(encodeURIComponent(n))), r = await e.exec("bash", [
    "-c",
    `echo '${i}' | base64 -d | pbcopy`
  ]);
  if (r.exit_code !== 0)
    throw new Error(`Clipboard copy failed: ${r.stderr}`);
}
function nn(e) {
  const n = { frames: 0, components: [], textNodes: 0, hiddenNodes: 0 }, i = /* @__PURE__ */ new Map();
  function r(t) {
    if (t.visible || n.hiddenNodes++, (t.type === "FRAME" || t.type === "GROUP" || t.type === "SECTION") && n.frames++, t.type === "TEXT" && n.textNodes++, t.componentRef) {
      const o = t.componentRef.componentName, s = t.repeatCount ?? 1;
      i.set(o, (i.get(o) ?? 0) + s);
    }
    t.children && t.children.forEach(r);
  }
  return e.forEach(r), n.components = Array.from(i.entries()).map(([t, o]) => ({ name: t, count: o })).sort((t, o) => o.count - t.count), n;
}
function Pe({ nodes: e, depth: n = 0, maxDepth: i = 2 }) {
  return n >= i ? null : /* @__PURE__ */ f("div", { style: { paddingLeft: n > 0 ? "12px" : "0", borderLeft: n > 0 ? "1px solid var(--border)" : "none" }, children: e.map((r, t) => {
    const o = r.componentRef ? `<${r.componentRef.componentName}${r.repeatCount ? ` x${r.repeatCount}` : ""}>` : r.type === "TEXT" ? `"${(r.textContent ?? "").slice(0, 30)}${(r.textContent ?? "").length > 30 ? "..." : ""}"` : r.name, s = r.autoLayout ? `${r.autoLayout.flexDirection}` : r.type === "INSTANCE" ? "component" : r.type.toLowerCase();
    return /* @__PURE__ */ y("div", { style: { fontSize: "11px", lineHeight: 1.7 }, children: [
      /* @__PURE__ */ y("span", { style: { color: "var(--text-muted)" }, children: [
        s,
        " "
      ] }),
      /* @__PURE__ */ f("span", { style: { color: r.visible === !1 ? "var(--text-muted)" : "var(--text-primary)" }, children: o }),
      r.visible === !1 && /* @__PURE__ */ f("span", { style: { color: "var(--text-muted)", marginLeft: "4px" }, children: "(hidden)" }),
      r.children && r.children.length > 0 && n + 1 < i && /* @__PURE__ */ f(Pe, { nodes: r.children, depth: n + 1, maxDepth: i }),
      r.children && r.children.length > 0 && n + 1 >= i && /* @__PURE__ */ y("span", { style: { color: "var(--text-muted)", fontSize: "11px", marginLeft: "12px" }, children: [
        "(",
        r.children.length,
        " children)"
      ] })
    ] }, r.id || t);
  }) });
}
function rn({ token: e }) {
  const n = ie(), i = (n == null ? void 0 : n.shell) ?? null, r = (n == null ? void 0 : n.actions) ?? null, [t, o] = R(""), [s, l] = R(null), u = s != null && s.nodeId ? "node" : "page", [m, d] = R(null), [p, h] = R(!1), [b, g] = R(null), [S, I] = R(!1), [A, H] = R(null), [W, E] = R(null), [c, x] = R(!1), [L, _] = R(!1), [C, a] = R(!1), [w, T] = R(null), [P, U] = R(null), [D, B] = R(!1), [M, j] = R(null), [he, q] = R(null), Y = We(
    () => A ? nn(A.rootNodes) : null,
    [A]
  ), V = te(null), z = te(i);
  z.current = i;
  const re = te(0), Q = te(0), ee = O(async (v) => {
    var k, $;
    if (!(!z.current || !s)) {
      a(!0), T(null), U(null);
      try {
        const N = await At({
          shell: z.current,
          token: e,
          fileKey: v.fileKey,
          selectedNodeId: s.nodeId || ((k = v.extraction.rootNodes[0]) == null ? void 0 : k.id) || "0:0",
          projectPath: (($ = n == null ? void 0 : n.project) == null ? void 0 : $.path) ?? ".",
          rootNodes: v.extraction.rootNodes,
          imageFills: v.tokens.imageFills,
          instancesWithText: v.instancesWithText,
          onProgress: T
        });
        if (U(N), r) {
          const J = N.assets.length, F = N.warnings.length, oe = `Exported ${J} asset${J !== 1 ? "s" : ""}${F > 0 ? ` (${F} warning${F !== 1 ? "s" : ""})` : ""}`;
          r.showToast(oe, F > 0 ? "info" : "success");
        }
        B(!0), j(null), q(null), setTimeout(() => {
          var J;
          try {
            const F = Mt({
              extraction: v,
              exportResult: N,
              projectPath: ((J = n == null ? void 0 : n.project) == null ? void 0 : J.path) ?? ".",
              fileName: (m == null ? void 0 : m.name) ?? "Untitled",
              figmaUrl: t,
              rootNodes: v.extraction.rootNodes
            });
            j(F), B(!1), z.current && en(z.current, N.assetsDir, F.markdown).catch((oe) => {
              console.error("Brief save failed:", oe);
            }), r && r.showToast(
              `Brief ready: ${F.stats.nodeCount} layers, ${F.stats.assetCount} assets, ~${Math.round(F.stats.estimatedTokens / 1e3)}K tokens`,
              "success"
            );
          } catch (F) {
            q((F == null ? void 0 : F.message) || "Brief generation failed"), B(!1);
          }
        }, 0);
      } catch (N) {
        r && r.showToast(`Asset export failed: ${(N == null ? void 0 : N.message) || "Unknown error"}`, "error");
      } finally {
        a(!1), T(null);
      }
    }
  }, [e, s, n, r, m, t]), Oe = O(
    (v) => {
      const k = v.target.value;
      if (o(k), !k.trim()) {
        l(null), d(null), g(null), h(!1), H(null), E(null), x(!1), _(!1), V.current = null, U(null), a(!1), T(null), j(null), B(!1), q(null);
        return;
      }
      const $ = qe(k);
      if (!$) {
        l(null), d(null), g("Please paste a valid Figma URL (file, design, proto, or board link)"), h(!1);
        return;
      }
      l($), g(null), d(null), H(null), E(null), x(!1), _(!1), V.current = null, U(null), a(!1), T(null), j(null), B(!1), q(null);
    },
    []
  );
  ne(() => {
    if (!s || !z.current) return;
    const v = ++re.current, k = z.current;
    h(!0), d(null), g(null), (async () => {
      try {
        const $ = await je(k, e, s.fileKey);
        re.current === v && (d($), h(!1));
      } catch ($) {
        if (re.current === v) {
          const N = ($ == null ? void 0 : $.message) || "Failed to validate file access.";
          N.includes("403") || N.includes("Invalid or expired") ? g("Cannot access this file. Check that your token has File content (Read) scope.") : N.includes("404") || N.includes("not found") ? g("File not found. Check that the URL is correct.") : N.includes("429") || N.includes("Rate limited") ? g("Rate limited by Figma. Please wait a moment and try again.") : g(N), h(!1);
        }
      }
    })();
  }, [s, e]);
  const Me = O(() => {
    const v = z.current;
    if (!v || !s) return;
    const k = ++Q.current;
    I(!0), H(null), g(null), E(null), x(!1), V.current = null, U(null), a(!1), T(null), j(null), B(!1), q(null), (async () => {
      try {
        const $ = await gt({
          shell: v,
          token: e,
          fileKey: s.fileKey,
          nodeId: s.nodeId,
          scope: u
        });
        if (Q.current !== k) return;
        if ($.largeTreeWarning) {
          V.current = $, E($.largeTreeWarning), x(!0), I(!1);
          return;
        }
        H($.extraction), r && r.showToast(`Extracted ${$.extraction.nodeCount} layers`, "success"), ee($);
      } catch ($) {
        if (Q.current !== k) return;
        const N = ($ == null ? void 0 : $.message) || "Extraction failed.";
        N.includes("403") || N.includes("Invalid or expired") ? g("Cannot access this file. Check that your token has File content (Read) scope.") : N.includes("404") || N.includes("not found") ? g("File not found. Check that the URL is correct.") : N.includes("429") || N.includes("Rate limited") ? g("Rate limited by Figma. Please wait a moment and try again.") : N.includes("timeout") || N.includes("timed out") ? g("Request timed out. Try a smaller selection or check your connection.") : g(N);
      } finally {
        Q.current === k && I(!1);
      }
    })();
  }, [s, e, u, r, ee]), Fe = O(() => {
    const v = V.current;
    v && (x(!1), E(null), H(v.extraction), V.current = null, r && r.showToast(`Extracted ${v.extraction.nodeCount} layers`, "success"), ee(v));
  }, [r, ee]), He = O(() => {
    x(!1), E(null), V.current = null;
  }, []), Ue = O(async () => {
    if (!(!M || !z.current))
      try {
        await tn(z.current, M.markdown), r && r.showToast("Brief copied to clipboard", "success");
      } catch (v) {
        r && r.showToast(`Copy failed: ${(v == null ? void 0 : v.message) || "Unknown error"}`, "error");
      }
  }, [M, r]), Be = !s || !m || p || S || C || D;
  return /* @__PURE__ */ y("div", { children: [
    /* @__PURE__ */ y("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ f("label", { className: "figma-plugin-label", children: "Figma URL" }),
      /* @__PURE__ */ f(
        "input",
        {
          className: "figma-plugin-input",
          type: "text",
          placeholder: "https://www.figma.com/design/...",
          value: t,
          onChange: Oe
        }
      ),
      b && /* @__PURE__ */ f("div", { className: "figma-plugin-error", children: b })
    ] }),
    s && /* @__PURE__ */ f("div", { className: "figma-plugin-section", children: /* @__PURE__ */ y("div", { className: "figma-plugin-file-info", children: [
      p && /* @__PURE__ */ y("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: m ? "8px" : "0" }, children: [
        /* @__PURE__ */ f("span", { className: "figma-plugin-spinner" }),
        /* @__PURE__ */ f("span", { style: { color: "var(--text-secondary)" }, children: "Checking access..." })
      ] }),
      m && /* @__PURE__ */ y("div", { style: { marginBottom: "8px" }, children: [
        /* @__PURE__ */ f("div", { style: { fontWeight: 600, fontSize: "13px", marginBottom: "4px" }, children: m.name }),
        /* @__PURE__ */ y("div", { style: { color: "var(--text-secondary)" }, children: [
          m.pages.length,
          " page",
          m.pages.length !== 1 ? "s" : ""
        ] })
      ] }),
      !p && /* @__PURE__ */ y("div", { style: { color: "var(--text-muted)", lineHeight: 1.6 }, children: [
        /* @__PURE__ */ y("div", { children: [
          "File key: ",
          s.fileKey
        ] }),
        /* @__PURE__ */ y("div", { children: [
          "Node: ",
          s.nodeId || "None (file-level)"
        ] }),
        /* @__PURE__ */ y("div", { children: [
          "Type: ",
          s.fileType
        ] })
      ] })
    ] }) }),
    s && m && !p && /* @__PURE__ */ f("div", { className: "figma-plugin-section", children: /* @__PURE__ */ f("div", { style: { color: "var(--text-secondary)", fontSize: "12px" }, children: s.nodeId ? "Will extract the selected element" : "Will extract the whole page — select a specific element in Figma to narrow scope" }) }),
    c && W && /* @__PURE__ */ f("div", { className: "figma-plugin-section", children: /* @__PURE__ */ y("div", { className: "figma-plugin-warning", children: [
      /* @__PURE__ */ y("strong", { children: [
        W.nodeCount,
        " layers detected"
      ] }),
      /* @__PURE__ */ f("p", { children: "Large selections may take longer and produce verbose output. Continue?" }),
      /* @__PURE__ */ y("div", { className: "figma-plugin-warning-actions", children: [
        /* @__PURE__ */ f("button", { className: "btn-primary", onClick: Fe, children: "Continue" }),
        /* @__PURE__ */ f("button", { className: "btn-secondary", onClick: He, children: "Cancel" })
      ] })
    ] }) }),
    he && /* @__PURE__ */ f("div", { className: "figma-plugin-section", children: /* @__PURE__ */ f("div", { className: "figma-plugin-error", children: he }) }),
    M && A && Y && P && /* @__PURE__ */ f("div", { className: "figma-plugin-section", children: /* @__PURE__ */ y("div", { className: "figma-plugin-file-info", children: [
      /* @__PURE__ */ y("div", { style: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }, children: [
        /* @__PURE__ */ f("span", { style: { color: "#38a169" }, children: "✓" }),
        /* @__PURE__ */ f("span", { style: { fontWeight: 600, fontSize: "13px" }, children: "Brief ready" }),
        A.truncated && /* @__PURE__ */ f("span", { style: { color: "#f59e0b", fontSize: "11px" }, children: "(truncated)" })
      ] }),
      /* @__PURE__ */ f(
        "button",
        {
          className: "btn-primary",
          onClick: Ue,
          style: { width: "100%", marginBottom: "12px" },
          children: "Copy Brief to Clipboard"
        }
      ),
      /* @__PURE__ */ y("div", { style: { color: "var(--text-secondary)", fontSize: "12px", lineHeight: 1.6 }, children: [
        M.stats.nodeCount,
        " layers ·",
        " ",
        M.stats.assetCount,
        " assets ·",
        " ",
        /* @__PURE__ */ y("span", { style: {
          color: M.stats.estimatedTokens > ve ? "#f59e0b" : "inherit"
        }, children: [
          "~",
          Math.round(M.stats.estimatedTokens / 1e3),
          "K tokens"
        ] })
      ] }),
      (() => {
        const v = P.assets.filter((k) => k.assetType === "composition").length;
        return v > 0 ? /* @__PURE__ */ y("div", { style: { marginTop: "8px", fontSize: "12px", color: "#f59e0b" }, children: [
          v,
          " composition",
          v !== 1 ? "s" : "",
          " exported as PNG"
        ] }) : null;
      })(),
      M.stats.estimatedTokens > ve && /* @__PURE__ */ y("div", { className: "figma-plugin-warning", style: { marginTop: "8px" }, children: [
        /* @__PURE__ */ f("strong", { children: "This brief is large" }),
        /* @__PURE__ */ f("p", { children: "Consider extracting a smaller section for better results." })
      ] }),
      Y.components.length > 0 && /* @__PURE__ */ y("div", { style: { marginTop: "10px" }, children: [
        /* @__PURE__ */ f("div", { style: { color: "var(--text-muted)", fontSize: "11px", marginBottom: "4px" }, children: "Components" }),
        /* @__PURE__ */ y("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px" }, children: [
          Y.components.slice(0, 8).map((v) => /* @__PURE__ */ y(
            "span",
            {
              style: {
                fontSize: "11px",
                padding: "2px 6px",
                borderRadius: "4px",
                background: "var(--bg-primary)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)"
              },
              children: [
                v.name,
                v.count > 1 ? ` x${v.count}` : ""
              ]
            },
            v.name
          )),
          Y.components.length > 8 && /* @__PURE__ */ y("span", { style: { fontSize: "11px", color: "var(--text-muted)", padding: "2px 4px" }, children: [
            "+",
            Y.components.length - 8,
            " more"
          ] })
        ] })
      ] }),
      P.warnings.length > 0 && (() => {
        const v = Array.from(P.warnings).map(
          ($) => typeof $ == "string" ? $ : JSON.stringify($)
        );
        v.filter(($) => $.startsWith('Composition "') || $.startsWith('Illustration "'));
        const k = v.filter(($) => !$.startsWith('Composition "') && !$.startsWith('Illustration "'));
        return k.length > 0 ? /* @__PURE__ */ y("div", { style: { marginTop: "8px", fontSize: "11px", color: "#f59e0b" }, children: [
          k.length,
          " warning",
          k.length !== 1 ? "s" : "",
          ":",
          /* @__PURE__ */ y("ul", { style: { margin: "4px 0 0 16px", padding: 0 }, children: [
            k.slice(0, 5).map(($, N) => /* @__PURE__ */ f("li", { children: $ }, N)),
            k.length > 5 && /* @__PURE__ */ y("li", { children: [
              "...and ",
              k.length - 5,
              " more"
            ] })
          ] })
        ] }) : null;
      })(),
      /* @__PURE__ */ f(
        "button",
        {
          onClick: () => _(!L),
          style: {
            background: "none",
            border: "none",
            color: "var(--accent, #0d99ff)",
            fontSize: "11px",
            cursor: "pointer",
            padding: "4px 0",
            marginTop: "8px"
          },
          children: L ? "Hide tree" : "Show tree preview"
        }
      ),
      L && /* @__PURE__ */ f("div", { style: { marginTop: "6px", padding: "8px", background: "var(--bg-primary)", borderRadius: "4px", border: "1px solid var(--border)", maxHeight: "200px", overflowY: "auto" }, children: /* @__PURE__ */ f(Pe, { nodes: A.rootNodes }) }),
      /* @__PURE__ */ f("div", { style: { color: "var(--text-muted)", fontSize: "11px", marginTop: "8px", textAlign: "center" }, children: "Also saved to .shipstudio/assets/brief.md" })
    ] }) }),
    (() => {
      const v = S || C || D, k = S ? "Extracting layout..." : C ? (w == null ? void 0 : w.phase) === "preview" ? "Rendering preview..." : `Exporting assets${w != null && w.total ? ` (${w.current ?? 0}/${w.total})` : ""}...` : D ? "Generating brief..." : M ? "Get New Brief" : "Get Brief";
      return /* @__PURE__ */ y(
        "button",
        {
          className: M && !v ? "btn-secondary" : "btn-primary",
          onClick: Me,
          disabled: Be,
          style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
          children: [
            v && /* @__PURE__ */ f("span", { className: "figma-plugin-spinner", style: { width: "14px", height: "14px", borderWidth: "2px" } }),
            k
          ]
        }
      );
    })()
  ] });
}
function on({ onClick: e }) {
  return /* @__PURE__ */ f(
    "button",
    {
      onClick: e,
      title: "Settings",
      style: {
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "2px",
        color: "var(--text-secondary)",
        display: "flex",
        alignItems: "center"
      },
      children: /* @__PURE__ */ y(
        "svg",
        {
          width: "14",
          height: "14",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          children: [
            /* @__PURE__ */ f("circle", { cx: "12", cy: "12", r: "3" }),
            /* @__PURE__ */ f("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" })
          ]
        }
      )
    }
  );
}
function sn() {
  const e = ie(), n = (e == null ? void 0 : e.storage) ?? null, i = (e == null ? void 0 : e.actions) ?? null, [r, t] = R(!1), [o, s] = R(null), [l, u] = R(null), [m, d] = R(!1), [p, h] = R("main");
  ne(() => {
    if (!n) return;
    let c = !1;
    return (async () => {
      try {
        const x = await n.read();
        !c && typeof x.figmaToken == "string" && (s(x.figmaToken), typeof x.figmaUserHandle == "string" && u({ id: "", handle: x.figmaUserHandle, img_url: "" }));
      } catch (x) {
        console.error("[figma] Failed to read storage:", x);
      } finally {
        c || d(!0);
      }
    })(), () => {
      c = !0;
    };
  }, [n]);
  const b = O(() => t(!0), []), g = O(() => {
    t(!1), h("main");
  }, []), S = O(async (c, x) => {
    if (!(!n || !i))
      try {
        const L = await n.read();
        await n.write({ ...L, figmaToken: c, figmaUserHandle: x.handle }), s(c), u(x), h("main"), i.showToast(`Connected as ${x.handle}`, "success");
      } catch {
        i.showToast("Failed to save token. Please try again.", "error");
      }
  }, [n, i]), I = O(async (c, x) => {
    if (!(!n || !i))
      try {
        const L = await n.read();
        await n.write({ ...L, figmaToken: c, figmaUserHandle: x.handle }), s(c), u(x), h("main"), i.showToast(`Token updated — connected as ${x.handle}`, "success");
      } catch {
        i.showToast("Failed to save token. Please try again.", "error");
      }
  }, [n, i]), A = O(async () => {
    if (!(!n || !i))
      try {
        const c = await n.read(), { figmaToken: x, figmaUserHandle: L, ..._ } = c;
        await n.write(_), s(null), u(null), h("main"), i.showToast("Disconnected from Figma", "info");
      } catch {
        i.showToast("Failed to remove token. Please try again.", "error");
      }
  }, [n, i]), H = "Figma", W = o ? /* @__PURE__ */ f(on, { onClick: () => h("settings") }) : void 0;
  let E = null;
  return m && (o ? p === "settings" && l ? E = /* @__PURE__ */ f(
    Ze,
    {
      currentUser: l,
      onTokenUpdated: I,
      onTokenRemoved: A,
      onBack: () => h("main")
    }
  ) : E = /* @__PURE__ */ f(rn, { token: o }) : E = /* @__PURE__ */ f(Xe, { onTokenSaved: S })), /* @__PURE__ */ y(de, { children: [
    /* @__PURE__ */ f(
      "button",
      {
        onClick: b,
        title: "Figma Design Brief",
        className: "toolbar-icon-btn",
        children: /* @__PURE__ */ f(
          "svg",
          {
            width: "14",
            height: "14",
            viewBox: "0 0 15 15",
            fill: "currentColor",
            children: /* @__PURE__ */ f(
              "path",
              {
                fillRule: "evenodd",
                clipRule: "evenodd",
                d: "M7.00005 2.04999H5.52505C4.71043 2.04999 4.05005 2.71037 4.05005 3.52499C4.05005 4.33961 4.71043 4.99999 5.52505 4.99999H7.00005V2.04999ZM7.00005 1.04999H8.00005H9.47505C10.842 1.04999 11.95 2.15808 11.95 3.52499C11.95 4.33163 11.5642 5.04815 10.9669 5.49999C11.5642 5.95184 11.95 6.66836 11.95 7.475C11.95 8.8419 10.842 9.95 9.47505 9.95C8.92236 9.95 8.41198 9.76884 8.00005 9.46266V9.95L8.00005 11.425C8.00005 12.7919 6.89195 13.9 5.52505 13.9C4.15814 13.9 3.05005 12.7919 3.05005 11.425C3.05005 10.6183 3.43593 9.90184 4.03317 9.44999C3.43593 8.99814 3.05005 8.28163 3.05005 7.475C3.05005 6.66836 3.43594 5.95184 4.03319 5.5C3.43594 5.04815 3.05005 4.33163 3.05005 3.52499C3.05005 2.15808 4.15814 1.04999 5.52505 1.04999H7.00005ZM8.00005 2.04999V4.99999H9.47505C10.2897 4.99999 10.95 4.33961 10.95 3.52499C10.95 2.71037 10.2897 2.04999 9.47505 2.04999H8.00005ZM5.52505 8.94998H7.00005L7.00005 7.4788L7.00005 7.475L7.00005 7.4712V6H5.52505C4.71043 6 4.05005 6.66038 4.05005 7.475C4.05005 8.28767 4.70727 8.94684 5.5192 8.94999L5.52505 8.94998ZM4.05005 11.425C4.05005 10.6123 4.70727 9.95315 5.5192 9.94999L5.52505 9.95H7.00005L7.00005 11.425C7.00005 12.2396 6.33967 12.9 5.52505 12.9C4.71043 12.9 4.05005 12.2396 4.05005 11.425ZM8.00005 7.47206C8.00164 6.65879 8.66141 6 9.47505 6C10.2897 6 10.95 6.66038 10.95 7.475C10.95 8.28962 10.2897 8.95 9.47505 8.95C8.66141 8.95 8.00164 8.29121 8.00005 7.47794V7.47206Z"
              }
            )
          }
        )
      }
    ),
    /* @__PURE__ */ f(
      ze,
      {
        open: r,
        onClose: g,
        title: H,
        headerRight: W,
        children: E
      }
    )
  ] });
}
const cn = "Figma", un = {
  toolbar: sn
};
function fn() {
  console.log("[figma] Plugin activated");
}
function dn() {
  console.log("[figma] Plugin deactivated");
}
export {
  cn as name,
  fn as onActivate,
  dn as onDeactivate,
  un as slots
};
