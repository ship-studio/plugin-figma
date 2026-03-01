import { jsx as u, jsxs as y, Fragment as de } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export const jsx=R.createElement;export const jsxs=R.createElement;export const Fragment=R.Fragment;";
import { useEffect as te, useCallback as L, useState as N, useMemo as _e, useRef as ee } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export default R;export const{useState,useEffect,useCallback,useRef,useMemo,useContext,createContext,createElement,Fragment}=R;";
const he = window;
function ie() {
  const e = he.__SHIPSTUDIO_REACT__, t = he.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__;
  return t && (e != null && e.useContext) ? e.useContext(t) : null;
}
const oe = "figma-plugin-styles", ze = `
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
function De({ open: e, onClose: t, title: i, headerRight: r, children: n }) {
  te(() => {
    if (!e) return;
    let s = document.getElementById(oe);
    return s || (s = document.createElement("style"), s.id = oe, s.textContent = ze, document.head.appendChild(s)), () => {
      const l = document.getElementById(oe);
      l && l.remove();
    };
  }, [e]), te(() => {
    if (!e) return;
    const s = (l) => {
      l.key === "Escape" && t();
    };
    return document.addEventListener("keydown", s), () => document.removeEventListener("keydown", s);
  }, [e, t]);
  const o = L(
    (s) => {
      s.target === s.currentTarget && t();
    },
    [t]
  );
  return e ? /* @__PURE__ */ u("div", { className: "figma-plugin-overlay", onClick: o, children: /* @__PURE__ */ y("div", { className: "figma-plugin-modal", children: [
    /* @__PURE__ */ y("div", { className: "figma-plugin-modal-header", children: [
      /* @__PURE__ */ u(
        "svg",
        {
          width: "16",
          height: "16",
          viewBox: "0 0 15 15",
          fill: "currentColor",
          children: /* @__PURE__ */ u(
            "path",
            {
              fillRule: "evenodd",
              clipRule: "evenodd",
              d: "M7.00005 2.04999H5.52505C4.71043 2.04999 4.05005 2.71037 4.05005 3.52499C4.05005 4.33961 4.71043 4.99999 5.52505 4.99999H7.00005V2.04999ZM7.00005 1.04999H8.00005H9.47505C10.842 1.04999 11.95 2.15808 11.95 3.52499C11.95 4.33163 11.5642 5.04815 10.9669 5.49999C11.5642 5.95184 11.95 6.66836 11.95 7.475C11.95 8.8419 10.842 9.95 9.47505 9.95C8.92236 9.95 8.41198 9.76884 8.00005 9.46266V9.95L8.00005 11.425C8.00005 12.7919 6.89195 13.9 5.52505 13.9C4.15814 13.9 3.05005 12.7919 3.05005 11.425C3.05005 10.6183 3.43593 9.90184 4.03317 9.44999C3.43593 8.99814 3.05005 8.28163 3.05005 7.475C3.05005 6.66836 3.43594 5.95184 4.03319 5.5C3.43594 5.04815 3.05005 4.33163 3.05005 3.52499C3.05005 2.15808 4.15814 1.04999 5.52505 1.04999H7.00005ZM8.00005 2.04999V4.99999H9.47505C10.2897 4.99999 10.95 4.33961 10.95 3.52499C10.95 2.71037 10.2897 2.04999 9.47505 2.04999H8.00005ZM5.52505 8.94998H7.00005L7.00005 7.4788L7.00005 7.475L7.00005 7.4712V6H5.52505C4.71043 6 4.05005 6.66038 4.05005 7.475C4.05005 8.28767 4.70727 8.94684 5.5192 8.94999L5.52505 8.94998ZM4.05005 11.425C4.05005 10.6123 4.70727 9.95315 5.5192 9.94999L5.52505 9.95H7.00005L7.00005 11.425C7.00005 12.2396 6.33967 12.9 5.52505 12.9C4.71043 12.9 4.05005 12.2396 4.05005 11.425ZM8.00005 7.47206C8.00164 6.65879 8.66141 6 9.47505 6C10.2897 6 10.95 6.66038 10.95 7.475C10.95 8.28962 10.2897 8.95 9.47505 8.95C8.66141 8.95 8.00164 8.29121 8.00005 7.47794V7.47206Z"
            }
          )
        }
      ),
      /* @__PURE__ */ u("span", { className: "figma-plugin-modal-title", children: i }),
      r && /* @__PURE__ */ u("div", { style: { marginLeft: "auto", display: "flex", alignItems: "center" }, children: r })
    ] }),
    /* @__PURE__ */ u("div", { className: "figma-plugin-modal-body", children: n })
  ] }) }) : null;
}
const We = "https://api.figma.com/v1";
async function Z(e, t, i, r) {
  const n = `${We}${t}`, o = Math.ceil(((r == null ? void 0 : r.timeout) ?? 3e4) / 1e3), s = [
    "-sS",
    "--max-time",
    String(o),
    "-H",
    `X-Figma-Token: ${i}`,
    n
  ], l = await e.exec("curl", s, {
    timeout: (r == null ? void 0 : r.timeout) ?? 12e4
  });
  if (l.exit_code !== 0)
    throw new Error(`Figma API request failed: ${l.stderr || `exit code ${l.exit_code}`}`);
  if (!l.stdout.trim())
    throw new Error("Empty response from Figma API");
  let a;
  try {
    a = JSON.parse(l.stdout);
  } catch {
    throw new Error(`Invalid JSON from Figma API: ${l.stdout.slice(0, 200)}`);
  }
  if (a.status && a.err)
    throw a.status === 429 ? new Error("Rate limited by Figma API. Try again in a moment.") : a.status === 403 ? new Error("Invalid or expired token. Please update your Figma token.") : a.status === 404 ? new Error("File not found. Check that the URL is correct and you have access.") : new Error(`Figma API error: ${a.err}`);
  return a;
}
async function we(e, t) {
  return Z(e, "/me", t);
}
async function je(e, t, i) {
  const r = await Z(e, `/files/${i}?depth=1`, t);
  return {
    name: r.name,
    pages: r.document.children.filter((n) => n.type === "CANVAS").map((n) => ({ id: n.id, name: n.name }))
  };
}
async function Ge(e, t, i, r) {
  const n = await Z(
    e,
    `/files/${i}/nodes?ids=${encodeURIComponent(r)}`,
    t,
    { timeout: 12e4 }
  ), o = n.nodes[r];
  if (!o) {
    const s = Object.keys(n.nodes), l = s.find(
      (a) => a.replace(/%3A/g, ":") === r || a === r.replace(/:/g, "%3A")
    );
    if (l)
      return {
        rootNode: n.nodes[l].document,
        components: n.nodes[l].components,
        styles: n.nodes[l].styles ?? {}
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
async function Ve(e, t, i) {
  const r = await Z(
    e,
    `/files/${i}`,
    t,
    { timeout: 12e4 }
  );
  return {
    rootNodes: r.document.children,
    components: r.components,
    styles: r.styles ?? {}
  };
}
async function se(e, t, i, r, n = "png", o) {
  const s = r.map((d) => encodeURIComponent(d)).join(",");
  let l = `/images/${i}?ids=${s}&format=${n}`;
  return o != null && (l += `&scale=${o}`), n === "svg" && (l += "&svg_outline_text=true&svg_include_id=true&svg_simplify_stroke=true"), (await Z(
    e,
    l,
    t,
    { timeout: 12e4 }
  )).images;
}
async function Ke(e, t, i) {
  return (await Z(
    e,
    `/files/${i}/images`,
    t,
    { timeout: 12e4 }
  )).meta.images;
}
function Xe({ onTokenSaved: e }) {
  const t = ie(), i = (t == null ? void 0 : t.shell) ?? null, [r, n] = N(""), [o, s] = N(!1), [l, a] = N(null), d = L(async () => {
    if (!i) return;
    const b = r.trim();
    if (!(!b || o)) {
      s(!0), a(null);
      try {
        const w = await we(i, b);
        e(b, w);
      } catch (w) {
        a((w == null ? void 0 : w.message) || "Failed to validate token. Please check and try again.");
      } finally {
        s(!1);
      }
    }
  }, [r, o, i, e]), p = L(
    (b) => {
      b.key === "Enter" && d();
    },
    [d]
  );
  return /* @__PURE__ */ y("div", { children: [
    /* @__PURE__ */ y("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ u("h3", { style: { fontSize: "14px", fontWeight: 600, margin: "0 0 8px 0" }, children: "Connect to Figma" }),
      /* @__PURE__ */ y("p", { style: { fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 16px 0", lineHeight: 1.5 }, children: [
        "To get started, you need a Figma Personal Access Token.",
        " ",
        /* @__PURE__ */ u(
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
      /* @__PURE__ */ u("label", { className: "figma-plugin-label", children: "Personal Access Token" }),
      /* @__PURE__ */ u(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: r,
          onChange: (b) => n(b.target.value),
          onKeyDown: p,
          disabled: o
        }
      ),
      l && /* @__PURE__ */ u("div", { className: "figma-plugin-error", children: l }),
      /* @__PURE__ */ u("div", { className: "figma-plugin-hint", children: "Token is stored locally in this project only." })
    ] }),
    /* @__PURE__ */ u(
      "button",
      {
        className: "btn-primary",
        onClick: d,
        disabled: !r.trim() || o,
        style: { width: "100%", marginTop: "4px" },
        children: o ? /* @__PURE__ */ y(de, { children: [
          /* @__PURE__ */ u("span", { className: "figma-plugin-spinner", style: { marginRight: "8px", verticalAlign: "middle" } }),
          "Connecting..."
        ] }) : "Connect"
      }
    )
  ] });
}
function Ze({ currentUser: e, onTokenUpdated: t, onTokenRemoved: i, onBack: r }) {
  const n = ie(), o = (n == null ? void 0 : n.shell) ?? null, [s, l] = N(""), [a, d] = N(!1), [p, b] = N(null), w = L(async () => {
    if (!o) return;
    const g = s.trim();
    if (!(!g || a)) {
      d(!0), b(null);
      try {
        const C = await we(o, g);
        t(g, C);
      } catch (C) {
        b((C == null ? void 0 : C.message) || "Failed to validate token. Please check and try again.");
      } finally {
        d(!1);
      }
    }
  }, [s, a, o, t]), R = L(
    (g) => {
      g.key === "Enter" && w();
    },
    [w]
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
          /* @__PURE__ */ u("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ u("polyline", { points: "15 18 9 12 15 6" }) }),
          "Back"
        ]
      }
    ),
    /* @__PURE__ */ u("div", { className: "figma-plugin-section", children: /* @__PURE__ */ y("div", { className: "figma-plugin-success", style: { display: "flex", alignItems: "center", gap: "6px", marginTop: "0" }, children: [
      /* @__PURE__ */ u("span", { style: { fontSize: "10px" }, children: "●" }),
      "Connected as ",
      e.handle
    ] }) }),
    /* @__PURE__ */ y("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ u("label", { className: "figma-plugin-label", children: "Update Token" }),
      /* @__PURE__ */ u(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: s,
          onChange: (g) => l(g.target.value),
          onKeyDown: R,
          disabled: a
        }
      ),
      p && /* @__PURE__ */ u("div", { className: "figma-plugin-error", children: p }),
      /* @__PURE__ */ u(
        "button",
        {
          className: "btn-primary",
          onClick: w,
          disabled: !s.trim() || a,
          style: { width: "100%", marginTop: "8px" },
          children: a ? /* @__PURE__ */ y(de, { children: [
            /* @__PURE__ */ u("span", { className: "figma-plugin-spinner", style: { marginRight: "8px", verticalAlign: "middle" } }),
            "Validating..."
          ] }) : "Update"
        }
      )
    ] }),
    /* @__PURE__ */ u("div", { className: "figma-plugin-section", style: { borderTop: "1px solid var(--border)", paddingTop: "16px" }, children: /* @__PURE__ */ u(
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
function Ye(e) {
  const t = e.match(
    /figma\.com\/(file|design|proto|board)\/([A-Za-z0-9]+)/
  );
  if (!t) return null;
  const i = t[1], r = t[2];
  let n = null;
  const o = e.match(/[?&]node-id=([^&]+)/);
  return o && (n = decodeURIComponent(o[1]).replace(/-/g, ":")), { fileKey: r, nodeId: n, fileType: i };
}
function qe(e) {
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
  const t = {
    flexDirection: e.layoutMode === "HORIZONTAL" ? "row" : "column",
    justifyContent: qe(e.primaryAxisAlignItems),
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
  return e.layoutWrap === "WRAP" && (t.rowGap = e.counterAxisSpacing ?? 0), t;
}
function et(e, t) {
  const i = t[e.componentId];
  let r;
  if (e.componentProperties) {
    const o = {};
    for (const [s, l] of Object.entries(e.componentProperties))
      (l.type === "VARIANT" || l.type === "BOOLEAN" || l.type === "TEXT") && (o[s] = l.value);
    Object.keys(o).length > 0 && (r = o);
  }
  const n = {
    componentId: e.componentId,
    componentName: (i == null ? void 0 : i.name) ?? e.name,
    isRemote: (i == null ? void 0 : i.remote) ?? !1,
    source: i != null && i.remote ? "library" : "local"
  };
  return i != null && i.description && (n.description = i.description), r && (n.variantProperties = r), e.overrides && (n.overrides = e.overrides), n;
}
function ve(e, t, i, r) {
  const n = e;
  if (n.type === "SLICE") return null;
  const o = {
    id: n.id,
    name: n.name,
    type: n.type,
    visible: n.visible !== !1
    // defaults to true when undefined
  };
  switch (n.absoluteBoundingBox != null ? (o.width = n.absoluteBoundingBox.width, o.height = n.absoluteBoundingBox.height) : n.size != null && (o.width = n.size.x, o.height = n.size.y), "layoutSizingHorizontal" in n && (o.widthMode = n.layoutSizingHorizontal), "layoutSizingVertical" in n && (o.heightMode = n.layoutSizingVertical), "layoutPositioning" in n && n.layoutPositioning != null && (o.positioning = n.layoutPositioning), "layoutGrow" in n && n.layoutGrow === 1 && (o.layoutGrow = 1), "layoutAlign" in n && n.layoutAlign === "STRETCH" && (o.layoutAlign = "STRETCH"), o.positioning === "ABSOLUTE" && r != null && n.absoluteBoundingBox != null && (o.absoluteOffset = {
    top: Math.round(n.absoluteBoundingBox.y - r.y),
    left: Math.round(n.absoluteBoundingBox.x - r.x)
  }), "layoutMode" in n && n.layoutMode && n.layoutMode !== "NONE" && (o.autoLayout = Qe(n)), "constraints" in n && n.constraints != null && (o.constraints = n.constraints), "minWidth" in n && n.minWidth != null && (o.minWidth = n.minWidth), "maxWidth" in n && n.maxWidth != null && (o.maxWidth = n.maxWidth), "minHeight" in n && n.minHeight != null && (o.minHeight = n.minHeight), "maxHeight" in n && n.maxHeight != null && (o.maxHeight = n.maxHeight), "preserveRatio" in n && n.preserveRatio != null && (o.preserveRatio = n.preserveRatio), "fills" in n && Array.isArray(n.fills) && (o.fills = n.fills), "strokes" in n && Array.isArray(n.strokes) && (o.strokes = n.strokes), "strokeWeight" in n && n.strokeWeight != null && (o.strokeWeight = n.strokeWeight), "effects" in n && Array.isArray(n.effects) && (o.effects = n.effects), "cornerRadius" in n && n.cornerRadius != null && (o.cornerRadius = n.cornerRadius), "rectangleCornerRadii" in n && Array.isArray(n.rectangleCornerRadii) && (o.rectangleCornerRadii = n.rectangleCornerRadii), "opacity" in n && n.opacity != null && n.opacity !== 1 && (o.opacity = n.opacity), "blendMode" in n && n.blendMode && n.blendMode !== "PASS_THROUGH" && n.blendMode !== "NORMAL" && (o.blendMode = n.blendMode), "isMask" in n && n.isMask === !0 && (o.isMask = !0), "styles" in n && n.styles && (o.styleRefs = n.styles), n.type) {
    case "TEXT":
      o.textContent = n.characters, n.style && (o.textStyle = n.style), n.styleOverrideTable && Object.keys(n.styleOverrideTable).length > 0 && (o.textStyleOverrides = n.styleOverrideTable);
      break;
    case "INSTANCE":
      return o.componentRef = et(n, t), o;
    case "BOOLEAN_OPERATION":
      return o;
  }
  if ("children" in n && Array.isArray(n.children)) {
    const s = n.absoluteBoundingBox != null ? { x: n.absoluteBoundingBox.x, y: n.absoluteBoundingBox.y } : null, l = n.children.map((a) => ve(a, t, i + 1, s)).filter((a) => a !== null);
    o.children = nt(l);
  }
  return o;
}
function fe(e) {
  let t = 1;
  if (e.children && Array.isArray(e.children))
    for (const i of e.children)
      t += fe(i);
  return t;
}
function tt(e) {
  const t = e.componentRef, i = t.variantProperties ? JSON.stringify(t.variantProperties, Object.keys(t.variantProperties).sort()) : "";
  return `${t.componentId}::${i}`;
}
function nt(e) {
  if (e.length === 0) return [];
  const t = /* @__PURE__ */ new Map();
  for (let n = 0; n < e.length; n++) {
    const o = e[n];
    if (o.componentRef) {
      const s = tt(o), l = t.get(s);
      l ? (l.count++, l.indices.push(n)) : t.set(s, { node: o, count: 1, indices: [n] });
    }
  }
  const i = /* @__PURE__ */ new Set();
  for (const n of t.values())
    if (n.count >= 3) {
      n.node.repeatCount = n.count;
      for (let o = 1; o < n.indices.length; o++)
        i.add(n.indices[o]);
    }
  const r = [];
  for (let n = 0; n < e.length; n++)
    i.has(n) || r.push(e[n]);
  return r;
}
function it(e, t) {
  let i = 0;
  for (const n of e)
    i += fe(n);
  return {
    rootNodes: e.map((n) => ve(n, t, 0, null)).filter((n) => n !== null),
    nodeCount: i,
    truncated: !1
  };
}
function X(e) {
  const t = Math.round(e.r * 255), i = Math.round(e.g * 255), r = Math.round(e.b * 255);
  if (e.a >= 1)
    return `#${t.toString(16).padStart(2, "0")}${i.toString(16).padStart(2, "0")}${r.toString(16).padStart(2, "0")}`;
  const n = parseFloat(e.a.toFixed(2));
  return `rgba(${t}, ${i}, ${r}, ${n})`;
}
function rt(e) {
  const t = e.gradientStops.map((i) => `${X(i.color)} ${Math.round(i.position * 100)}%`).join(", ");
  switch (e.type) {
    case "GRADIENT_LINEAR": {
      const [i, r] = e.gradientHandlePositions, n = r.x - i.x, o = r.y - i.y, s = Math.atan2(o, n);
      return `linear-gradient(${(Math.round(s * 180 / Math.PI + 90) % 360 + 360) % 360}deg, ${t})`;
    }
    case "GRADIENT_RADIAL":
      return `radial-gradient(${t})`;
    case "GRADIENT_ANGULAR":
      return `conic-gradient(${t})`;
    case "GRADIENT_DIAMOND":
      return `/* diamond */ radial-gradient(${t})`;
    default:
      return `linear-gradient(${t})`;
  }
}
function ot(e, t) {
  const i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), a = [], d = /* @__PURE__ */ new Map();
  let p = 0, b = 0, w = 0;
  function R(c) {
    var x, M, f;
    if (c.fills && Array.isArray(c.fills)) {
      const h = at(c, t);
      for (const m of c.fills)
        if (m.visible !== !1)
          if (m.type === "SOLID") {
            const I = { ...m.color };
            m.opacity != null && m.opacity !== 1 && (I.a = I.a * m.opacity);
            const S = X(I);
            ae(i, S, c.id, "fill", h);
          } else if ((x = m.type) != null && x.startsWith("GRADIENT_")) {
            const I = rt(m), S = I, k = r.get(S);
            k ? (k.usageCount++, k.nodeIds.push(c.id)) : (w++, r.set(S, {
              value: I,
              name: h ?? `gradient-${w}`,
              gradientType: m.type,
              usageCount: 1,
              nodeIds: [c.id]
            }));
          } else m.type === "IMAGE" && a.push({
            imageRef: m.imageRef,
            scaleMode: m.scaleMode,
            nodeId: c.id,
            nodeName: c.name
          });
    }
    if (c.strokes && Array.isArray(c.strokes)) {
      const h = lt(c, t);
      for (const m of c.strokes)
        if (m.visible !== !1 && m.type === "SOLID") {
          const I = { ...m.color };
          m.opacity != null && m.opacity !== 1 && (I.a = I.a * m.opacity);
          const S = X(I);
          ae(i, S, c.id, "stroke", h);
        }
    }
    if (c.effects && Array.isArray(c.effects)) {
      const h = ut(c, t);
      for (const m of c.effects)
        if (m.visible === !0 && (m.type === "DROP_SHADOW" || m.type === "INNER_SHADOW")) {
          const I = m.type === "DROP_SHADOW" ? "drop-shadow" : "inner-shadow", S = X(m.color), k = ((M = m.offset) == null ? void 0 : M.x) ?? 0, U = ((f = m.offset) == null ? void 0 : f.y) ?? 0, D = m.radius ?? 0, B = m.spread ?? 0, H = `${I}|${S}|${k}|${U}|${D}|${B}`, W = l.get(H);
          W ? (W.usageCount++, W.nodeIds.push(c.id)) : (b++, l.set(H, {
            type: I,
            color: S,
            offsetX: k,
            offsetY: U,
            blur: D,
            spread: B,
            name: h ?? `shadow-${b}`,
            usageCount: 1,
            nodeIds: [c.id]
          })), ae(i, S, c.id, "shadow", null);
        }
    }
    if (c.type === "TEXT" && c.textStyle) {
      const h = ct(c, t);
      if (ye(n, c.textStyle, c.id, h), c.textStyleOverrides && typeof c.textStyleOverrides == "object")
        for (const m of Object.values(c.textStyleOverrides))
          ye(n, m, c.id, null);
    }
    if (c.autoLayout) {
      const h = c.autoLayout;
      h.padding && (K(o, h.padding.top, "padding-top"), K(o, h.padding.right, "padding-right"), K(o, h.padding.bottom, "padding-bottom"), K(o, h.padding.left, "padding-left")), K(o, h.gap, "gap"), h.rowGap != null && K(o, h.rowGap, "row-gap");
    }
    if (c.cornerRadius != null || c.rectangleCornerRadii != null || st(c)) {
      const h = c.rectangleCornerRadii ? null : c.cornerRadius ?? null, m = c.rectangleCornerRadii ?? null;
      let I = null, S = null;
      if (c.strokes && Array.isArray(c.strokes)) {
        const D = c.strokes.find(
          (B) => B.visible !== !1 && B.type === "SOLID"
        );
        D && (I = X(D.color), S = c.strokeWeight ?? null);
      }
      const k = `${h}|${JSON.stringify(m)}|${I}|${S}`, U = s.get(k);
      U ? (U.usageCount++, U.nodeIds.push(c.id)) : (p++, s.set(k, {
        radius: h,
        cornerRadii: m,
        strokeColor: I,
        strokeWeight: S,
        name: `border-${p}`,
        usageCount: 1,
        nodeIds: [c.id]
      }));
    }
    if (c.componentRef) {
      const h = c.componentRef, m = `${h.componentName}::${JSON.stringify(h.variantProperties ?? {})}`, I = d.get(m), S = c.repeatCount ?? 1;
      if (I)
        I.usageCount += S;
      else {
        const k = {
          componentName: h.componentName,
          source: h.source,
          usageCount: S
        };
        h.description && (k.description = h.description), h.variantProperties && (k.variantProperties = h.variantProperties), d.set(m, k);
      }
    }
    if (c.children)
      for (const h of c.children)
        R(h);
  }
  for (const c of e)
    R(c);
  const g = Array.from(i.values()).map((c) => ({
    value: c.value,
    name: c.name,
    usageCount: c.usageCount,
    nodeIds: c.nodeIds,
    source: Array.from(c.source)
  }));
  g.sort((c, x) => x.usageCount - c.usageCount);
  const C = Array.from(r.values());
  C.sort((c, x) => x.usageCount - c.usageCount);
  const P = Array.from(n.values());
  P.sort((c, x) => x.usageCount - c.usageCount);
  const O = Array.from(o.values());
  O.sort((c, x) => c.value - x.value);
  const F = Array.from(s.values());
  F.sort((c, x) => x.usageCount - c.usageCount);
  const _ = Array.from(l.values());
  _.sort((c, x) => x.usageCount - c.usageCount);
  const E = Array.from(d.values());
  return E.sort((c, x) => x.usageCount - c.usageCount), {
    colors: g,
    gradients: C,
    typography: P,
    spacing: O,
    borders: F,
    shadows: _,
    imageFills: a,
    components: E
  };
}
function ae(e, t, i, r, n) {
  const o = e.get(t);
  if (o)
    o.usageCount++, o.nodeIds.includes(i) || o.nodeIds.push(i), o.source.add(r), n && o.name.startsWith("color-") && (o.name = n);
  else {
    const s = `color-${t.replace(/^#/, "").replace(/[^a-f0-9]/gi, "")}`;
    e.set(t, {
      value: t,
      name: n ?? s,
      usageCount: 1,
      nodeIds: [i],
      source: /* @__PURE__ */ new Set([r])
    });
  }
}
function ye(e, t, i, r) {
  const n = t.fontFamily ?? "Unknown", o = t.fontSize ?? 16, s = t.fontWeight ?? 400, l = t.lineHeightPx ?? null, a = t.letterSpacing ?? 0, d = `${n}|${o}|${s}|${l}|${a}`, p = e.get(d);
  if (p)
    p.usageCount++, p.nodeIds.includes(i) || p.nodeIds.push(i), r && p.name.startsWith(n) && (p.name = r);
  else {
    const b = `${n}-${o}-${s}`;
    e.set(d, {
      fontFamily: n,
      fontSize: o,
      fontWeight: s,
      lineHeight: l,
      letterSpacing: a,
      name: r ?? b,
      usageCount: 1,
      nodeIds: [i]
    });
  }
}
function K(e, t, i) {
  if (t === 0) return;
  const r = e.get(t);
  r ? (r.usageCount++, r.sources.includes(i) || r.sources.push(i)) : e.set(t, {
    value: t,
    usageCount: 1,
    sources: [i]
  });
}
function st(e) {
  return !e.strokes || !Array.isArray(e.strokes) ? !1 : e.strokes.some((t) => t.visible !== !1 && t.type === "SOLID");
}
function at(e, t) {
  var r, n;
  const i = (r = e.styleRefs) == null ? void 0 : r.fill;
  return i ? ((n = t[i]) == null ? void 0 : n.name) ?? null : null;
}
function lt(e, t) {
  var r, n;
  const i = (r = e.styleRefs) == null ? void 0 : r.stroke;
  return i ? ((n = t[i]) == null ? void 0 : n.name) ?? null : null;
}
function ct(e, t) {
  var r, n;
  const i = (r = e.styleRefs) == null ? void 0 : r.text;
  return i ? ((n = t[i]) == null ? void 0 : n.name) ?? null : null;
}
function ut(e, t) {
  var r, n;
  const i = (r = e.styleRefs) == null ? void 0 : r.effect;
  return i ? ((n = t[i]) == null ? void 0 : n.name) ?? null : null;
}
const dt = 500, ft = 2e3;
function be(e) {
  const t = [];
  if (e.fills && Array.isArray(e.fills))
    for (const i of e.fills)
      i.type === "IMAGE" && i.visible !== !1 && t.push({
        imageRef: i.imageRef,
        scaleMode: i.scaleMode ?? "FILL",
        nodeId: e.id,
        nodeName: e.name
      });
  if (e.children && Array.isArray(e.children))
    for (const i of e.children)
      t.push(...be(i));
  return t;
}
async function pt(e) {
  const { shell: t, token: i, fileKey: r, nodeId: n, scope: o } = e;
  let s, l, a;
  if (o === "node" || o === "frame") {
    if (!n)
      throw new Error(
        `Cannot extract ${o}: no node ID found in the URL. Paste a Figma URL that includes a node-id, or switch to "Entire Page" scope.`
      );
    const C = await Ge(t, i, r, n);
    s = [C.rootNode], l = C.components, a = C.styles;
  } else {
    const C = await Ve(t, i, r), P = C.rootNodes[0];
    s = (P == null ? void 0 : P.children) || [], l = C.components, a = C.styles;
  }
  let d = 0;
  for (const C of s)
    d += fe(C);
  let p;
  d > dt && (p = {
    nodeCount: d,
    message: `This selection has ~${d} nodes. Large extractions may produce verbose output.`
  });
  const b = [];
  for (const C of s)
    b.push(...be(C));
  const w = it(s, l);
  d > ft && (w.truncated = !0);
  const R = ot(w.rootNodes, a), g = new Set(R.imageFills.map((C) => C.nodeId));
  for (const C of b)
    g.has(C.nodeId) || (g.add(C.nodeId), R.imageFills.push(C));
  return { extraction: w, tokens: R, fileKey: r, largeTreeWarning: p };
}
function j(e) {
  return e.toLowerCase().replace(/[/\s]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "") || "unnamed";
}
function gt(e) {
  const t = /* @__PURE__ */ new Map();
  return e.map((i) => {
    const r = t.get(i.filename) ?? 0;
    if (t.set(i.filename, r + 1), r === 0)
      return { ...i };
    const n = i.filename.lastIndexOf(".");
    if (n === -1)
      return { ...i, filename: `${i.filename}-${r + 1}` };
    const o = i.filename.slice(0, n), s = i.filename.slice(n);
    return { ...i, filename: `${o}-${r + 1}${s}` };
  });
}
const mt = /* @__PURE__ */ new Set([
  "VECTOR",
  "BOOLEAN_OPERATION",
  "STAR",
  "POLYGON",
  "ELLIPSE"
]);
function ne(e) {
  var t;
  return ((t = e.fills) == null ? void 0 : t.some((i) => i.type === "IMAGE")) ?? !1;
}
function ce(e) {
  var i;
  const t = (i = e.fills) == null ? void 0 : i.find((r) => r.type === "IMAGE");
  return t == null ? void 0 : t.imageRef;
}
function ht(e) {
  const t = e.componentRef, i = t.variantProperties ? Object.entries(t.variantProperties).sort(([r], [n]) => r.localeCompare(n)).map(([r, n]) => `${r}=${n}`).join(",") : "";
  return `${t.componentId}|${i}`;
}
function yt(e) {
  var t, i, r;
  return !((t = e.strokes) != null && t.some((n) => n.visible !== !1) || (i = e.fills) != null && i.some((n) => {
    var o;
    return n.visible !== !1 && ((o = n.type) == null ? void 0 : o.startsWith("GRADIENT_"));
  }) || ne(e) || (r = e.effects) != null && r.some((n) => n.visible !== !1));
}
function Ce(e, t, i, r) {
  const n = [];
  if (!e.children) return n;
  for (const o of e.children) {
    if (ne(o)) {
      const s = t.get(o.id) ?? ce(o);
      s && !r.has(s) && (r.add(s), t.has(o.id) && i.add(o.id), n.push({
        nodeId: o.id,
        nodeName: o.name,
        exportType: "png-fill",
        filename: j(o.name) + ".png",
        imageRef: s
      }));
    }
    n.push(...Ce(o, t, i, r));
  }
  return n;
}
function $e(e, t, i, r, n, o, s, l) {
  if (n.has(e.id)) {
    r.push({
      nodeId: e.id,
      nodeName: e.name,
      exportType: "png-render",
      filename: j(e.name) + ".png"
    });
    return;
  }
  if (e.type === "INSTANCE" && e.componentRef) {
    if (ne(e)) {
      const p = t.get(e.id) ?? ce(e);
      if (t.has(e.id) && i.add(e.id), p && l.has(p)) return;
      p && l.add(p), r.push({
        nodeId: e.id,
        nodeName: e.name,
        exportType: "png-fill",
        filename: j(e.name) + ".png",
        imageRef: p
      });
      return;
    }
    const a = Ce(e, t, i, l);
    for (const p of a)
      p.parentInstanceId = e.id;
    const d = ht(e);
    o.has(d) || (o.add(d), a.length === 0 && r.push({
      nodeId: e.id,
      nodeName: e.componentRef.componentName,
      exportType: "png-render",
      filename: j(e.componentRef.componentName) + ".png"
    }));
    for (const p of a)
      r.push(p);
    return;
  }
  if (ne(e)) {
    const a = t.get(e.id) ?? ce(e);
    t.has(e.id) && i.add(e.id), r.push({
      nodeId: e.id,
      nodeName: e.name,
      exportType: "png-fill",
      filename: j(e.name) + ".png",
      imageRef: a
    });
    return;
  }
  if (e.type !== "LINE") {
    if (mt.has(e.type)) {
      const a = j(e.name) + ".svg";
      s.has(a) || (s.add(a), r.push({
        nodeId: e.id,
        nodeName: e.name,
        exportType: "svg",
        filename: a
      }));
      return;
    }
    if (e.type === "RECTANGLE") {
      if (yt(e)) return;
      const a = j(e.name) + ".svg";
      s.has(a) || (s.add(a), r.push({
        nodeId: e.id,
        nodeName: e.name,
        exportType: "svg",
        filename: a
      }));
      return;
    }
    if (e.children)
      for (const a of e.children)
        $e(a, t, i, r, n, o, s, l);
  }
}
function xt(e, t, i = /* @__PURE__ */ new Set()) {
  const r = /* @__PURE__ */ new Map();
  for (const d of t)
    r.set(d.nodeId, d.imageRef);
  const n = [], o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
  for (const d of e)
    if (d.children)
      for (const p of d.children)
        $e(p, r, o, n, i, s, l, a);
  for (const d of t)
    o.has(d.nodeId) || n.push({
      nodeId: d.nodeId,
      nodeName: d.nodeName,
      exportType: "png-fill",
      filename: j(d.nodeName) + ".png",
      imageRef: d.imageRef
    });
  return gt(n);
}
const wt = 5, vt = 3, bt = 3, Ct = /* @__PURE__ */ new Set([
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
function $t(e) {
  const t = /* @__PURE__ */ new Set(), i = [];
  for (const r of e)
    if (r.children)
      for (const n of r.children)
        Te(n, t, i);
  return { compositionNodeIds: t, warnings: i };
}
function Te(e, t, i) {
  if (Tt(e)) {
    t.add(e.id), pe(e) && ge(e, 0) ? i.push(`Auto-detected "${e.name}" as a composition`) : i.push(`Auto-detected "${e.name}" as an illustration (vector-only group)`);
    return;
  }
  if (e.children)
    for (const r of e.children)
      Te(r, t, i);
}
function Tt(e) {
  return !!(pe(e) && ge(e, 0) || It(e));
}
function It(e) {
  return e.type !== "GROUP" && e.type !== "FRAME" || !e.children || e.children.length === 0 || !pe(e) ? !1 : Ie(e);
}
function Ie(e) {
  if (!e.children) return !0;
  for (const t of e.children)
    if (!Ct.has(t.type) || !Ie(t)) return !1;
  return !0;
}
function pe(e) {
  return !!(e.children && e.children.length >= wt || e.type === "BOOLEAN_OPERATION" || Ne(e, 0) >= vt);
}
function ge(e, t) {
  if (t > bt) return !1;
  if (e.blendMode || e.isMask === !0 || e.opacity !== void 0 && e.opacity < 1) return !0;
  if (e.children) {
    for (const i of e.children)
      if (ge(i, t + 1)) return !0;
  }
  return !1;
}
function Ne(e, t) {
  if (!e.children || e.children.length === 0)
    return t;
  let i = t;
  for (const r of e.children) {
    const n = Ne(r, t + 1);
    n > i && (i = n);
  }
  return i;
}
async function Nt(e) {
  const t = await e.exec("mktemp", ["-d", "-t", "shipstudio-assets"]);
  if (t.exit_code !== 0)
    throw new Error(`Failed to create temp directory: ${t.stderr}`);
  return t.stdout.trim();
}
async function Re(e, t, i) {
  const r = ["-sS", "-o", i, "--max-time", "30", "-L", t];
  if ((await e.exec("curl", r, { timeout: 35e3 })).exit_code === 0) return { success: !0 };
  const o = await e.exec("curl", r, { timeout: 35e3 });
  return o.exit_code === 0 ? { success: !0 } : {
    success: !1,
    error: o.stderr || `curl exit code ${o.exit_code}`
  };
}
async function Rt(e, t, i, r) {
  const n = [], o = [];
  for (let s = 0; s < i.length; s++) {
    const { filename: l, url: a, nodeId: d, assetType: p, parentInstanceId: b } = i[s], w = `${t}/${l}`;
    r && r({
      current: s + 1,
      total: i.length,
      currentAsset: l,
      phase: "assets"
    });
    const R = await Re(e, a, w);
    if (R.success) {
      const g = { filename: l, path: w };
      d !== void 0 && (g.nodeId = d), p !== void 0 && (g.assetType = p), b !== void 0 && (g.parentInstanceId = b), n.push(g);
    } else
      o.push(`Failed to download ${l}: ${R.error}`);
  }
  return { downloaded: n, warnings: o };
}
async function St(e) {
  const { shell: t, token: i, fileKey: r, selectedNodeId: n, rootNodes: o, imageFills: s, onProgress: l } = e, a = [], d = await Nt(t), { compositionNodeIds: p, warnings: b } = $t(o);
  a.push(...b);
  const w = xt(o, s, p);
  l && l({ current: 0, total: w.length + 1, currentAsset: "preview.png", phase: "preview" });
  let R = `${d}/preview.png`;
  try {
    const h = (await se(t, i, r, [n], "png", 2))[n];
    if (h) {
      const m = await Re(t, h, R);
      m.success || (a.push(`Preview download failed: ${m.error}`), R = "");
    } else
      a.push("Figma could not render preview for this node"), R = "";
  } catch (f) {
    a.push(`Preview render failed: ${(f == null ? void 0 : f.message) || "Unknown error"}`), R = "";
  }
  const g = w.filter((f) => f.exportType === "svg");
  let C = {};
  if (g.length > 0)
    try {
      C = await se(t, i, r, g.map((f) => f.nodeId), "svg");
    } catch (f) {
      a.push(`SVG render API failed: ${(f == null ? void 0 : f.message) || "Unknown error"}`);
    }
  const P = w.filter((f) => f.exportType === "png-fill");
  let O = {};
  if (P.length > 0)
    try {
      O = await Ke(t, i, r);
    } catch (f) {
      a.push(`Image fills API failed: ${(f == null ? void 0 : f.message) || "Unknown error"}`);
    }
  const F = w.filter((f) => f.exportType === "png-render");
  let _ = {};
  if (F.length > 0)
    try {
      _ = await se(t, i, r, F.map((f) => f.nodeId), "png", 2);
    } catch (f) {
      a.push(`Composition PNG render failed: ${(f == null ? void 0 : f.message) || "Unknown error"}`);
    }
  const E = new Set(p), c = [];
  for (const f of g) {
    const h = C[f.nodeId];
    h ? c.push({ filename: f.filename, url: h, nodeId: f.nodeId, assetType: "icon" }) : a.push(`No render URL for ${f.filename} (node ${f.nodeId})`);
  }
  for (const f of P)
    if (f.imageRef && O[f.imageRef]) {
      const h = { filename: f.filename, url: O[f.imageRef], nodeId: f.nodeId, assetType: "image" };
      f.parentInstanceId && (h.parentInstanceId = f.parentInstanceId), c.push(h);
    } else
      a.push(`No download URL for image fill ${f.filename} (ref: ${f.imageRef})`);
  for (const f of F) {
    const h = _[f.nodeId];
    if (h) {
      const m = E.has(f.nodeId) ? "composition" : "component";
      c.push({ filename: f.filename, url: h, nodeId: f.nodeId, assetType: m });
    } else
      a.push(`No render URL for ${f.filename} (node ${f.nodeId})`);
  }
  const { downloaded: x, warnings: M } = await Rt(
    t,
    d,
    c,
    l
  );
  return a.push(...M), {
    assetsDir: d,
    previewPath: R,
    assets: x,
    warnings: a
  };
}
const kt = /^(Frame|Group|Rectangle|Ellipse|Vector|Section|Instance|Line|Star|Polygon)\s*\d*$/i;
function At(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e) {
    const r = ke(i.name) ? [] : [i.name];
    Se(i, r, t);
  }
  return t;
}
function Se(e, t, i) {
  if (i.set(e.id, Et(t)), !!e.children)
    for (const r of e.children) {
      const n = ke(r.name) ? t : [...t, r.name];
      Se(r, n, i);
    }
}
function Et(e) {
  return e.length === 0 ? "" : e.length <= 4 ? e.join(" > ") : `${e[0]} > ... > ${e[e.length - 2]} > ${e[e.length - 1]}`;
}
function ke(e) {
  return kt.test(e);
}
const xe = 12e3;
function Lt(e) {
  return Math.ceil(e.length / 4);
}
function Pt(e) {
  const { extraction: t, exportResult: i, projectPath: r } = e, n = t.tokens, o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
  for (const g of i.assets)
    g.nodeId && (o.set(g.nodeId, g.filename), g.assetType === "composition" && s.add(g.nodeId)), g.parentInstanceId && !o.has(g.parentInstanceId) && o.set(g.parentInstanceId, g.filename);
  const l = e.rootNodes ?? t.extraction.rootNodes, a = At(l), p = [
    Ot(e),
    Mt(),
    Ft(i.previewPath, r),
    Ht(t.extraction.rootNodes, o, s),
    Dt(n),
    Zt(n.components),
    Yt(i.previewPath, i.assets, r, a)
  ].filter(Boolean).join(`

`), b = p.length, w = Lt(p), R = {
    nodeCount: t.extraction.nodeCount,
    colorCount: n.colors.length,
    fontCount: n.typography.length,
    assetCount: i.assets.length,
    estimatedTokens: w
  };
  return {
    markdown: p,
    charCount: b,
    estimatedTokens: w,
    stats: R
  };
}
function Ot(e) {
  var s;
  const { extraction: t, fileName: i, figmaUrl: r } = e, n = ((s = t.extraction.rootNodes[0]) == null ? void 0 : s.name) ?? "Untitled", o = e.date ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  return [
    "# Design Brief",
    "",
    `**File:** ${i}`,
    `**Frame:** ${n}`,
    `**Extracted:** ${o}`,
    `**Figma URL:** ${r}`
  ].join(`
`);
}
function Mt() {
  return [
    "## How to Use This Brief",
    "",
    "**Before building:** Read this brief fully. Plan your approach and ask clarifying questions before writing any code.",
    "**During building:** Use only the assets listed in the Assets section below -- if an asset is missing, ask the user rather than substituting or fabricating a replacement.",
    "**After building:** Compare your result against the Preview image above and verify that all design tokens and assets are correctly applied."
  ].join(`
`);
}
function Ft(e, t) {
  return e ? `## Preview

![Preview](${ue(e, t)})` : "";
}
function Ht(e, t, i) {
  const r = [];
  for (const n of e)
    Ae(n, 0, r, t, i);
  return r.length === 0 ? "" : `## Layout Tree

` + r.join(`
`);
}
function Ae(e, t, i, r, n) {
  if (e.visible !== !1) {
    if (n.has(e.id)) {
      const o = "  ".repeat(t), s = r.get(e.id), l = e.width != null && e.height != null ? ` ${Math.round(e.width)}x${Math.round(e.height)}` : "", a = s ? ` -> ${s}` : "";
      i.push(`${o}[Illustration] '${e.name}'${l}${a}`);
      return;
    }
    if (i.push(Bt(e, t, r)), !e.componentRef && e.children)
      for (const o of e.children)
        Ae(o, t + 1, i, r, n);
  }
}
function Ut(e) {
  return e.charAt(0).toUpperCase() + e.slice(1).toLowerCase();
}
function Ee(e) {
  return /Property\s+\d+=/i.test(e) ? e.split(",").map((t) => {
    const i = t.indexOf("=");
    if (i !== -1) {
      const r = t.slice(0, i).trim(), n = t.slice(i + 1).trim();
      if (/^Property\s+\d+$/i.test(r)) return n;
    }
    return t.trim();
  }).join(", ") : e;
}
function Bt(e, t, i) {
  const r = "  ".repeat(t), n = [];
  if (e.componentRef) {
    let l = `Instance "${Ee(e.componentRef.componentName)}"`;
    if (e.repeatCount && e.repeatCount > 1 && (l += ` x${e.repeatCount} (repeated)`), e.componentRef.variantProperties && Object.keys(e.componentRef.variantProperties).length > 0) {
      const d = Object.entries(e.componentRef.variantProperties).map(([p, b]) => /^Property\s+\d+$/i.test(p) ? String(b) : `${p}: ${b}`).join(", ");
      l += ` (${d})`;
    }
    const a = i == null ? void 0 : i.get(e.id);
    a && (l += ` -> ${a}`), n.push(l);
  } else if (e.type === "TEXT") {
    const s = e.textContent ?? "", l = s.length > 200 ? s.slice(0, 200) + "..." : s;
    let a = "";
    e.textStyle && (a = ` (${e.textStyle.fontFamily} ${e.textStyle.fontSize}/${e.textStyle.fontWeight})`), n.push(`Text '${l}'${a}`);
  } else
    n.push(`${Ut(e.type)} '${e.name}'`);
  if (e.autoLayout) {
    const s = e.autoLayout, l = [s.flexDirection];
    s.gap > 0 && l.push(`gap: ${s.gap}`), s.justifyContent !== "flex-start" && l.push(`justify: ${s.justifyContent}`), s.alignItems !== "flex-start" && l.push(`align: ${s.alignItems}`);
    const a = zt(s.padding);
    a && l.push(a), s.flexWrap === "wrap" && l.push("wrap"), n.push(`(${l.join(", ")})`);
  }
  e.width != null && e.height != null && n.push(`${Math.round(e.width)}x${Math.round(e.height)}`), e.positioning === "ABSOLUTE" && (e.absoluteOffset ? n.push(`[absolute] top:${e.absoluteOffset.top} left:${e.absoluteOffset.left}`) : n.push("[absolute]"));
  const o = _t(e);
  return o && n.push(o), `${r}${n.join(" ")}`;
}
function le(e) {
  if (!e) return null;
  for (const t of e)
    if (t.visible !== !1 && t.type === "SOLID" && t.color) {
      const i = t.opacity ?? 1, r = { ...t.color, a: (t.color.a ?? 1) * i };
      return X(r);
    }
  return null;
}
function _t(e) {
  var i;
  const t = [];
  if (e.widthMode === "FILL" && t.push("w:fill"), e.heightMode === "FILL" && t.push("h:fill"), e.widthMode === "HUG" && t.push("w:hug"), e.heightMode === "HUG" && t.push("h:hug"), e.type !== "TEXT") {
    const r = le(e.fills);
    r && r !== "#ffffff" && r !== "#000000" ? t.push(`bg:${r}`) : r && t.push(`bg:${r}`);
  }
  if (e.type === "TEXT") {
    const r = le(e.fills);
    r && t.push(`color:${r}`);
  }
  if (e.cornerRadius && e.cornerRadius > 0 && t.push(`r:${Math.round(e.cornerRadius)}`), e.strokeWeight && e.strokeWeight > 0 && ((i = e.strokes) != null && i.length)) {
    const r = le(e.strokes);
    r && t.push(`border:${e.strokeWeight}px ${r}`);
  }
  return e.layoutGrow === 1 && t.push("flex-grow:1"), e.layoutAlign === "STRETCH" && t.push("align-self:stretch"), e.opacity != null && e.opacity < 1 && t.push(`opacity:${e.opacity.toFixed(2)}`), t.length === 0 ? null : `{${t.join(" ")}}`;
}
function zt(e) {
  return e.top === 0 && e.right === 0 && e.bottom === 0 && e.left === 0 ? null : e.top === e.bottom && e.left === e.right && e.top === e.left ? `padding: ${e.top}` : e.top === e.bottom && e.left === e.right ? `padding: ${e.top} ${e.left}` : `padding: ${e.top} ${e.right} ${e.bottom} ${e.left}`;
}
function Dt(e) {
  const t = [];
  return e.colors.length > 0 && t.push(Wt(e.colors)), e.gradients.length > 0 && t.push(jt(e.gradients)), e.typography.length > 0 && t.push(Gt(e.typography)), e.spacing.length > 0 && t.push(Vt(e.spacing)), e.borders.length > 0 && t.push(Kt(e.borders)), e.shadows.length > 0 && t.push(Xt(e.shadows)), t.length === 0 ? "" : `## Design Tokens

` + t.join(`

`);
}
function Wt(e) {
  return [
    "### Colors",
    "",
    "| Name | Value | Usage |",
    "|------|-------|-------|",
    ...e.map((i) => `| ${i.name} | ${i.value} | ${i.usageCount} |`)
  ].join(`
`);
}
function jt(e) {
  return [
    "### Gradients",
    "",
    "| Name | Value | Usage |",
    "|------|-------|-------|",
    ...e.map((i) => `| ${i.name} | ${i.value} | ${i.usageCount} |`)
  ].join(`
`);
}
function Gt(e) {
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
function Vt(e) {
  return [
    "### Spacing",
    "",
    "| Value | Sources | Usage |",
    "|-------|---------|-------|",
    ...e.map((i) => `| ${i.value}px | ${i.sources.join(", ")} | ${i.usageCount} |`)
  ].join(`
`);
}
function Kt(e) {
  return [
    "### Borders",
    "",
    "| Name | Radius | Stroke | Usage |",
    "|------|--------|--------|-------|",
    ...e.map((i) => {
      const r = i.radius !== null ? `${i.radius}px` : i.cornerRadii ? i.cornerRadii.map((o) => `${o}px`).join(" ") : "--", n = i.strokeWeight !== null && i.strokeColor !== null ? `${i.strokeWeight}px ${i.strokeColor}` : "--";
      return `| ${i.name} | ${r} | ${n} | ${i.usageCount} |`;
    })
  ].join(`
`);
}
function Xt(e) {
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
function Zt(e) {
  return e.length === 0 ? "" : [
    "## Components",
    "",
    "| Component | Source | Variants | Usage |",
    "|-----------|--------|----------|-------|",
    ...e.map((i) => {
      const r = Ee(i.componentName), n = i.variantProperties && Object.keys(i.variantProperties).length > 0 ? Object.entries(i.variantProperties).map(([o, s]) => /^Property\s+\d+$/i.test(o) ? String(s) : `${o}: ${s}`).join(", ") : "--";
      return `| ${r} | ${i.source} | ${n} | ${i.usageCount} |`;
    })
  ].join(`
`);
}
function Yt(e, t, i, r) {
  if (!e && t.length === 0) return "";
  const n = [];
  if (e) {
    const o = ue(e, i), s = o.split("/").pop() ?? o;
    n.push(`| ${s} | Preview | -- | ${o} |`);
  }
  for (const o of t) {
    const s = ue(o.path, i), l = qt(o.assetType);
    let a = "--";
    o.nodeId && (a = r.get(o.nodeId) || o.parentInstanceId && r.get(o.parentInstanceId) || "--"), n.push(`| ${o.filename} | ${l} | ${a} | ${s} |`);
  }
  return [
    "## Assets",
    "",
    "| File | Type | Location | Path |",
    "|------|------|----------|------|",
    ...n
  ].join(`
`);
}
function qt(e) {
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
function ue(e, t) {
  return e.startsWith(t + "/") ? e.slice(t.length + 1) : e;
}
async function Jt(e, t, i) {
  const r = `${t}/brief.md`, n = btoa(unescape(encodeURIComponent(i))), o = await e.exec("bash", [
    "-c",
    `echo '${n}' | base64 -d > '${r}'`
  ]);
  if (o.exit_code !== 0)
    throw new Error(`Failed to save brief: ${o.stderr}`);
}
async function Qt(e, t) {
  const i = btoa(unescape(encodeURIComponent(t))), r = await e.exec("bash", [
    "-c",
    `echo '${i}' | base64 -d | pbcopy`
  ]);
  if (r.exit_code !== 0)
    throw new Error(`Clipboard copy failed: ${r.stderr}`);
}
function en(e) {
  const t = { frames: 0, components: [], textNodes: 0, hiddenNodes: 0 }, i = /* @__PURE__ */ new Map();
  function r(n) {
    if (n.visible || t.hiddenNodes++, (n.type === "FRAME" || n.type === "GROUP" || n.type === "SECTION") && t.frames++, n.type === "TEXT" && t.textNodes++, n.componentRef) {
      const o = n.componentRef.componentName, s = n.repeatCount ?? 1;
      i.set(o, (i.get(o) ?? 0) + s);
    }
    n.children && n.children.forEach(r);
  }
  return e.forEach(r), t.components = Array.from(i.entries()).map(([n, o]) => ({ name: n, count: o })).sort((n, o) => o.count - n.count), t;
}
function Le({ nodes: e, depth: t = 0, maxDepth: i = 2 }) {
  return t >= i ? null : /* @__PURE__ */ u("div", { style: { paddingLeft: t > 0 ? "12px" : "0", borderLeft: t > 0 ? "1px solid var(--border)" : "none" }, children: e.map((r, n) => {
    const o = r.componentRef ? `<${r.componentRef.componentName}${r.repeatCount ? ` x${r.repeatCount}` : ""}>` : r.type === "TEXT" ? `"${(r.textContent ?? "").slice(0, 30)}${(r.textContent ?? "").length > 30 ? "..." : ""}"` : r.name, s = r.autoLayout ? `${r.autoLayout.flexDirection}` : r.type === "INSTANCE" ? "component" : r.type.toLowerCase();
    return /* @__PURE__ */ y("div", { style: { fontSize: "11px", lineHeight: 1.7 }, children: [
      /* @__PURE__ */ y("span", { style: { color: "var(--text-muted)" }, children: [
        s,
        " "
      ] }),
      /* @__PURE__ */ u("span", { style: { color: r.visible === !1 ? "var(--text-muted)" : "var(--text-primary)" }, children: o }),
      r.visible === !1 && /* @__PURE__ */ u("span", { style: { color: "var(--text-muted)", marginLeft: "4px" }, children: "(hidden)" }),
      r.children && r.children.length > 0 && t + 1 < i && /* @__PURE__ */ u(Le, { nodes: r.children, depth: t + 1, maxDepth: i }),
      r.children && r.children.length > 0 && t + 1 >= i && /* @__PURE__ */ y("span", { style: { color: "var(--text-muted)", fontSize: "11px", marginLeft: "12px" }, children: [
        "(",
        r.children.length,
        " children)"
      ] })
    ] }, r.id || n);
  }) });
}
function tn({ token: e }) {
  const t = ie(), i = (t == null ? void 0 : t.shell) ?? null, r = (t == null ? void 0 : t.actions) ?? null, [n, o] = N(""), [s, l] = N(null), a = s != null && s.nodeId ? "node" : "page", [d, p] = N(null), [b, w] = N(!1), [R, g] = N(null), [C, P] = N(!1), [O, F] = N(null), [_, E] = N(null), [c, x] = N(!1), [M, f] = N(!1), [h, m] = N(!1), [I, S] = N(null), [k, U] = N(null), [D, B] = N(!1), [H, W] = N(null), [me, Y] = N(null), q = _e(
    () => O ? en(O.rootNodes) : null,
    [O]
  ), G = ee(null), z = ee(i);
  z.current = i;
  const re = ee(0), J = ee(0), Q = L(async (v) => {
    var A;
    if (!(!z.current || !s)) {
      m(!0), S(null), U(null);
      try {
        const $ = await St({
          shell: z.current,
          token: e,
          fileKey: v.fileKey,
          selectedNodeId: s.nodeId || ((A = v.extraction.rootNodes[0]) == null ? void 0 : A.id) || "0:0",
          rootNodes: v.extraction.rootNodes,
          imageFills: v.tokens.imageFills,
          onProgress: S
        });
        if (U($), r) {
          const T = $.assets.length, V = $.warnings.length, Be = `Exported ${T} asset${T !== 1 ? "s" : ""}${V > 0 ? ` (${V} warning${V !== 1 ? "s" : ""})` : ""}`;
          r.showToast(Be, V > 0 ? "info" : "success");
        }
        B(!0), W(null), Y(null), setTimeout(() => {
          try {
            const T = Pt({
              extraction: v,
              exportResult: $,
              projectPath: $.assetsDir,
              fileName: (d == null ? void 0 : d.name) ?? "Untitled",
              figmaUrl: n,
              rootNodes: v.extraction.rootNodes
            });
            W(T), B(!1), z.current && Jt(z.current, $.assetsDir, T.markdown).catch((V) => {
              console.error("Brief save failed:", V);
            }), r && r.showToast(
              `Brief ready: ${T.stats.nodeCount} layers, ${T.stats.assetCount} assets, ~${Math.round(T.stats.estimatedTokens / 1e3)}K tokens`,
              "success"
            );
          } catch (T) {
            Y((T == null ? void 0 : T.message) || "Brief generation failed"), B(!1);
          }
        }, 0);
      } catch ($) {
        r && r.showToast(`Asset export failed: ${($ == null ? void 0 : $.message) || "Unknown error"}`, "error");
      } finally {
        m(!1), S(null);
      }
    }
  }, [e, s, t, r, d, n]), Pe = L(
    (v) => {
      const A = v.target.value;
      if (o(A), !A.trim()) {
        l(null), p(null), g(null), w(!1), F(null), E(null), x(!1), f(!1), G.current = null, U(null), m(!1), S(null), W(null), B(!1), Y(null);
        return;
      }
      const $ = Ye(A);
      if (!$) {
        l(null), p(null), g("Please paste a valid Figma URL (file, design, proto, or board link)"), w(!1);
        return;
      }
      l($), g(null), p(null), F(null), E(null), x(!1), f(!1), G.current = null, U(null), m(!1), S(null), W(null), B(!1), Y(null);
    },
    []
  );
  te(() => {
    if (!s || !z.current) return;
    const v = ++re.current, A = z.current;
    w(!0), p(null), g(null), (async () => {
      try {
        const $ = await je(A, e, s.fileKey);
        re.current === v && (p($), w(!1));
      } catch ($) {
        if (re.current === v) {
          const T = ($ == null ? void 0 : $.message) || "Failed to validate file access.";
          T.includes("403") || T.includes("Invalid or expired") ? g("Cannot access this file. Check that your token has File content (Read) scope.") : T.includes("404") || T.includes("not found") ? g("File not found. Check that the URL is correct.") : T.includes("429") || T.includes("Rate limited") ? g("Rate limited by Figma. Please wait a moment and try again.") : g(T), w(!1);
        }
      }
    })();
  }, [s, e]);
  const Oe = L(() => {
    const v = z.current;
    if (!v || !s) return;
    const A = ++J.current;
    P(!0), F(null), g(null), E(null), x(!1), G.current = null, U(null), m(!1), S(null), W(null), B(!1), Y(null), (async () => {
      try {
        const $ = await pt({
          shell: v,
          token: e,
          fileKey: s.fileKey,
          nodeId: s.nodeId,
          scope: a
        });
        if (J.current !== A) return;
        if ($.largeTreeWarning) {
          G.current = $, E($.largeTreeWarning), x(!0), P(!1);
          return;
        }
        F($.extraction), r && r.showToast(`Extracted ${$.extraction.nodeCount} layers`, "success"), Q($);
      } catch ($) {
        if (J.current !== A) return;
        const T = ($ == null ? void 0 : $.message) || "Extraction failed.";
        T.includes("403") || T.includes("Invalid or expired") ? g("Cannot access this file. Check that your token has File content (Read) scope.") : T.includes("404") || T.includes("not found") ? g("File not found. Check that the URL is correct.") : T.includes("429") || T.includes("Rate limited") ? g("Rate limited by Figma. Please wait a moment and try again.") : T.includes("timeout") || T.includes("timed out") ? g("Request timed out. Try a smaller selection or check your connection.") : g(T);
      } finally {
        J.current === A && P(!1);
      }
    })();
  }, [s, e, a, r, Q]), Me = L(() => {
    const v = G.current;
    v && (x(!1), E(null), F(v.extraction), G.current = null, r && r.showToast(`Extracted ${v.extraction.nodeCount} layers`, "success"), Q(v));
  }, [r, Q]), Fe = L(() => {
    x(!1), E(null), G.current = null;
  }, []), He = L(async () => {
    if (!(!H || !z.current))
      try {
        await Qt(z.current, H.markdown), r && r.showToast("Brief copied to clipboard", "success");
      } catch (v) {
        r && r.showToast(`Copy failed: ${(v == null ? void 0 : v.message) || "Unknown error"}`, "error");
      }
  }, [H, r]), Ue = !s || !d || b || C || h || D;
  return /* @__PURE__ */ y("div", { children: [
    /* @__PURE__ */ y("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ u("label", { className: "figma-plugin-label", children: "Figma URL" }),
      /* @__PURE__ */ u(
        "input",
        {
          className: "figma-plugin-input",
          type: "text",
          placeholder: "https://www.figma.com/design/...",
          value: n,
          onChange: Pe
        }
      ),
      R && /* @__PURE__ */ u("div", { className: "figma-plugin-error", children: R })
    ] }),
    s && /* @__PURE__ */ u("div", { className: "figma-plugin-section", children: /* @__PURE__ */ y("div", { className: "figma-plugin-file-info", children: [
      b && /* @__PURE__ */ y("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: d ? "8px" : "0" }, children: [
        /* @__PURE__ */ u("span", { className: "figma-plugin-spinner" }),
        /* @__PURE__ */ u("span", { style: { color: "var(--text-secondary)" }, children: "Checking access..." })
      ] }),
      d && /* @__PURE__ */ y("div", { style: { marginBottom: "8px" }, children: [
        /* @__PURE__ */ u("div", { style: { fontWeight: 600, fontSize: "13px", marginBottom: "4px" }, children: d.name }),
        /* @__PURE__ */ y("div", { style: { color: "var(--text-secondary)" }, children: [
          d.pages.length,
          " page",
          d.pages.length !== 1 ? "s" : ""
        ] })
      ] }),
      !b && /* @__PURE__ */ y("div", { style: { color: "var(--text-muted)", lineHeight: 1.6 }, children: [
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
    s && d && !b && /* @__PURE__ */ u("div", { className: "figma-plugin-section", children: /* @__PURE__ */ u("div", { style: { color: "var(--text-secondary)", fontSize: "12px" }, children: s.nodeId ? "Will extract the selected element" : "Will extract the whole page — select a specific element in Figma to narrow scope" }) }),
    c && _ && /* @__PURE__ */ u("div", { className: "figma-plugin-section", children: /* @__PURE__ */ y("div", { className: "figma-plugin-warning", children: [
      /* @__PURE__ */ y("strong", { children: [
        _.nodeCount,
        " layers detected"
      ] }),
      /* @__PURE__ */ u("p", { children: "Large selections may take longer and produce verbose output. Continue?" }),
      /* @__PURE__ */ y("div", { className: "figma-plugin-warning-actions", children: [
        /* @__PURE__ */ u("button", { className: "btn-primary", onClick: Me, children: "Continue" }),
        /* @__PURE__ */ u("button", { className: "btn-secondary", onClick: Fe, children: "Cancel" })
      ] })
    ] }) }),
    me && /* @__PURE__ */ u("div", { className: "figma-plugin-section", children: /* @__PURE__ */ u("div", { className: "figma-plugin-error", children: me }) }),
    H && O && q && k && /* @__PURE__ */ u("div", { className: "figma-plugin-section", children: /* @__PURE__ */ y("div", { className: "figma-plugin-file-info", children: [
      /* @__PURE__ */ y("div", { style: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }, children: [
        /* @__PURE__ */ u("span", { style: { color: "#38a169" }, children: "✓" }),
        /* @__PURE__ */ u("span", { style: { fontWeight: 600, fontSize: "13px" }, children: "Brief ready" }),
        O.truncated && /* @__PURE__ */ u("span", { style: { color: "#f59e0b", fontSize: "11px" }, children: "(truncated)" })
      ] }),
      /* @__PURE__ */ u(
        "button",
        {
          className: "btn-primary",
          onClick: He,
          style: { width: "100%", marginBottom: "12px" },
          children: "Copy Brief to Clipboard"
        }
      ),
      /* @__PURE__ */ y("div", { style: { color: "var(--text-secondary)", fontSize: "12px", lineHeight: 1.6 }, children: [
        H.stats.nodeCount,
        " layers ·",
        " ",
        H.stats.assetCount,
        " assets ·",
        " ",
        /* @__PURE__ */ y("span", { style: {
          color: H.stats.estimatedTokens > xe ? "#f59e0b" : "inherit"
        }, children: [
          "~",
          Math.round(H.stats.estimatedTokens / 1e3),
          "K tokens"
        ] })
      ] }),
      (() => {
        const v = k.assets.filter((A) => A.assetType === "composition").length;
        return v > 0 ? /* @__PURE__ */ y("div", { style: { marginTop: "8px", fontSize: "12px", color: "#f59e0b" }, children: [
          v,
          " composition",
          v !== 1 ? "s" : "",
          " exported as PNG"
        ] }) : null;
      })(),
      H.stats.estimatedTokens > xe && /* @__PURE__ */ y("div", { className: "figma-plugin-warning", style: { marginTop: "8px" }, children: [
        /* @__PURE__ */ u("strong", { children: "This brief is large" }),
        /* @__PURE__ */ u("p", { children: "Consider extracting a smaller section for better results." })
      ] }),
      q.components.length > 0 && /* @__PURE__ */ y("div", { style: { marginTop: "10px" }, children: [
        /* @__PURE__ */ u("div", { style: { color: "var(--text-muted)", fontSize: "11px", marginBottom: "4px" }, children: "Components" }),
        /* @__PURE__ */ y("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px" }, children: [
          q.components.slice(0, 8).map((v) => /* @__PURE__ */ y(
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
          q.components.length > 8 && /* @__PURE__ */ y("span", { style: { fontSize: "11px", color: "var(--text-muted)", padding: "2px 4px" }, children: [
            "+",
            q.components.length - 8,
            " more"
          ] })
        ] })
      ] }),
      k.warnings.length > 0 && /* @__PURE__ */ y("div", { style: { marginTop: "8px", fontSize: "11px", color: "#f59e0b" }, children: [
        k.warnings.length,
        " warning",
        k.warnings.length !== 1 ? "s" : "",
        ":",
        /* @__PURE__ */ y("ul", { style: { margin: "4px 0 0 16px", padding: 0 }, children: [
          k.warnings.slice(0, 5).map((v, A) => /* @__PURE__ */ u("li", { children: String(v) }, A)),
          k.warnings.length > 5 && /* @__PURE__ */ y("li", { children: [
            "...and ",
            k.warnings.length - 5,
            " more"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ u(
        "button",
        {
          onClick: () => f(!M),
          style: {
            background: "none",
            border: "none",
            color: "var(--accent, #0d99ff)",
            fontSize: "11px",
            cursor: "pointer",
            padding: "4px 0",
            marginTop: "8px"
          },
          children: M ? "Hide tree" : "Show tree preview"
        }
      ),
      M && /* @__PURE__ */ u("div", { style: { marginTop: "6px", padding: "8px", background: "var(--bg-primary)", borderRadius: "4px", border: "1px solid var(--border)", maxHeight: "200px", overflowY: "auto" }, children: /* @__PURE__ */ u(Le, { nodes: O.rootNodes }) }),
      /* @__PURE__ */ y("div", { style: { color: "var(--text-muted)", fontSize: "11px", marginTop: "8px", textAlign: "center" }, children: [
        "Also saved to ",
        k.assetsDir,
        "/brief.md"
      ] })
    ] }) }),
    (() => {
      const v = C || h || D, A = C ? "Extracting layout..." : h ? (I == null ? void 0 : I.phase) === "preview" ? "Rendering preview..." : `Exporting assets${I != null && I.total ? ` (${I.current ?? 0}/${I.total})` : ""}...` : D ? "Generating brief..." : H ? "Get New Brief" : "Get Brief";
      return /* @__PURE__ */ y(
        "button",
        {
          className: H && !v ? "btn-secondary" : "btn-primary",
          onClick: Oe,
          disabled: Ue,
          style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
          children: [
            v && /* @__PURE__ */ u("span", { className: "figma-plugin-spinner", style: { width: "14px", height: "14px", borderWidth: "2px" } }),
            A
          ]
        }
      );
    })()
  ] });
}
function nn({ onClick: e }) {
  return /* @__PURE__ */ u(
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
            /* @__PURE__ */ u("circle", { cx: "12", cy: "12", r: "3" }),
            /* @__PURE__ */ u("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" })
          ]
        }
      )
    }
  );
}
function rn() {
  const e = ie(), t = (e == null ? void 0 : e.storage) ?? null, i = (e == null ? void 0 : e.actions) ?? null, [r, n] = N(!1), [o, s] = N(null), [l, a] = N(null), [d, p] = N(!1), [b, w] = N("main");
  te(() => {
    if (!t) return;
    let c = !1;
    return (async () => {
      try {
        const x = await t.read();
        !c && typeof x.figmaToken == "string" && (s(x.figmaToken), typeof x.figmaUserHandle == "string" && a({ id: "", handle: x.figmaUserHandle, img_url: "" }));
      } catch (x) {
        console.error("[figma] Failed to read storage:", x);
      } finally {
        c || p(!0);
      }
    })(), () => {
      c = !0;
    };
  }, [t]);
  const R = L(() => n(!0), []), g = L(() => {
    n(!1), w("main");
  }, []), C = L(async (c, x) => {
    if (!(!t || !i))
      try {
        const M = await t.read();
        await t.write({ ...M, figmaToken: c, figmaUserHandle: x.handle }), s(c), a(x), w("main"), i.showToast(`Connected as ${x.handle}`, "success");
      } catch {
        i.showToast("Failed to save token. Please try again.", "error");
      }
  }, [t, i]), P = L(async (c, x) => {
    if (!(!t || !i))
      try {
        const M = await t.read();
        await t.write({ ...M, figmaToken: c, figmaUserHandle: x.handle }), s(c), a(x), w("main"), i.showToast(`Token updated — connected as ${x.handle}`, "success");
      } catch {
        i.showToast("Failed to save token. Please try again.", "error");
      }
  }, [t, i]), O = L(async () => {
    if (!(!t || !i))
      try {
        const c = await t.read(), { figmaToken: x, figmaUserHandle: M, ...f } = c;
        await t.write(f), s(null), a(null), w("main"), i.showToast("Disconnected from Figma", "info");
      } catch {
        i.showToast("Failed to remove token. Please try again.", "error");
      }
  }, [t, i]), F = "Figma", _ = o ? /* @__PURE__ */ u(nn, { onClick: () => w("settings") }) : void 0;
  let E = null;
  return d && (o ? b === "settings" && l ? E = /* @__PURE__ */ u(
    Ze,
    {
      currentUser: l,
      onTokenUpdated: P,
      onTokenRemoved: O,
      onBack: () => w("main")
    }
  ) : E = /* @__PURE__ */ u(tn, { token: o }) : E = /* @__PURE__ */ u(Xe, { onTokenSaved: C })), /* @__PURE__ */ y(de, { children: [
    /* @__PURE__ */ u(
      "button",
      {
        onClick: R,
        title: "Figma Design Brief",
        className: "toolbar-icon-btn",
        children: /* @__PURE__ */ u(
          "svg",
          {
            width: "14",
            height: "14",
            viewBox: "0 0 15 15",
            fill: "currentColor",
            children: /* @__PURE__ */ u(
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
    /* @__PURE__ */ u(
      De,
      {
        open: r,
        onClose: g,
        title: F,
        headerRight: _,
        children: E
      }
    )
  ] });
}
const an = "Figma", ln = {
  toolbar: rn
};
function cn() {
  console.log("[figma] Plugin activated");
}
function un() {
  console.log("[figma] Plugin deactivated");
}
export {
  an as name,
  cn as onActivate,
  un as onDeactivate,
  ln as slots
};
