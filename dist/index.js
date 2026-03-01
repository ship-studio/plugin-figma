import { jsx as f, jsxs as y, Fragment as pe } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export const jsx=R.createElement;export const jsxs=R.createElement;export const Fragment=R.Fragment;";
import { useEffect as ne, useCallback as E, useState as T, useMemo as ze, useRef as te } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export default R;export const{useState,useEffect,useCallback,useRef,useMemo,useContext,createContext,createElement,Fragment}=R;";
const xe = window;
function re() {
  const e = xe.__SHIPSTUDIO_REACT__, t = xe.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__;
  return t && (e != null && e.useContext) ? e.useContext(t) : null;
}
const ae = "figma-plugin-styles", We = `
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
  ne(() => {
    if (!e) return;
    let s = document.getElementById(ae);
    return s || (s = document.createElement("style"), s.id = ae, s.textContent = We, document.head.appendChild(s)), () => {
      const a = document.getElementById(ae);
      a && a.remove();
    };
  }, [e]), ne(() => {
    if (!e) return;
    const s = (a) => {
      a.key === "Escape" && t();
    };
    return document.addEventListener("keydown", s), () => document.removeEventListener("keydown", s);
  }, [e, t]);
  const o = E(
    (s) => {
      s.target === s.currentTarget && t();
    },
    [t]
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
    /* @__PURE__ */ f("div", { className: "figma-plugin-modal-body", children: n })
  ] }) }) : null;
}
const je = "https://api.figma.com/v1";
async function Z(e, t, i, r) {
  const n = `${je}${t}`, o = Math.ceil(((r == null ? void 0 : r.timeout) ?? 3e4) / 1e3), s = [
    "-sS",
    "--max-time",
    String(o),
    "-H",
    `X-Figma-Token: ${i}`,
    n
  ], a = await e.exec("curl", s, {
    timeout: (r == null ? void 0 : r.timeout) ?? 12e4
  });
  if (a.exit_code !== 0)
    throw new Error(`Figma API request failed: ${a.stderr || `exit code ${a.exit_code}`}`);
  if (!a.stdout.trim())
    throw new Error("Empty response from Figma API");
  let u;
  try {
    u = JSON.parse(a.stdout);
  } catch {
    throw new Error(`Invalid JSON from Figma API: ${a.stdout.slice(0, 200)}`);
  }
  if (u.status && u.err)
    throw u.status === 429 ? new Error("Rate limited by Figma API. Try again in a moment.") : u.status === 403 ? new Error("Invalid or expired token. Please update your Figma token.") : u.status === 404 ? new Error("File not found. Check that the URL is correct and you have access.") : new Error(`Figma API error: ${u.err}`);
  return u;
}
async function be(e, t) {
  return Z(e, "/me", t);
}
async function Ge(e, t, i) {
  const r = await Z(e, `/files/${i}?depth=1`, t);
  return {
    name: r.name,
    pages: r.document.children.filter((n) => n.type === "CANVAS").map((n) => ({ id: n.id, name: n.name }))
  };
}
async function Ve(e, t, i, r) {
  const n = await Z(
    e,
    `/files/${i}/nodes?ids=${encodeURIComponent(r)}`,
    t,
    { timeout: 12e4 }
  ), o = n.nodes[r];
  if (!o) {
    const s = Object.keys(n.nodes), a = s.find(
      (u) => u.replace(/%3A/g, ":") === r || u === r.replace(/:/g, "%3A")
    );
    if (a)
      return {
        rootNode: n.nodes[a].document,
        components: n.nodes[a].components,
        styles: n.nodes[a].styles ?? {}
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
async function Ke(e, t, i) {
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
async function le(e, t, i, r, n = "png", o) {
  const s = r.map((d) => encodeURIComponent(d)).join(",");
  let a = `/images/${i}?ids=${s}&format=${n}`;
  return o != null && (a += `&scale=${o}`), n === "svg" && (a += "&svg_outline_text=true&svg_include_id=true&svg_simplify_stroke=true"), (await Z(
    e,
    a,
    t,
    { timeout: 12e4 }
  )).images;
}
async function Xe(e, t, i) {
  return (await Z(
    e,
    `/files/${i}/images`,
    t,
    { timeout: 12e4 }
  )).meta.images;
}
function Ze({ onTokenSaved: e }) {
  const t = re(), i = (t == null ? void 0 : t.shell) ?? null, [r, n] = T(""), [o, s] = T(!1), [a, u] = T(null), d = E(async () => {
    if (!i) return;
    const v = r.trim();
    if (!(!v || o)) {
      s(!0), u(null);
      try {
        const x = await be(i, v);
        e(v, x);
      } catch (x) {
        u((x == null ? void 0 : x.message) || "Failed to validate token. Please check and try again.");
      } finally {
        s(!1);
      }
    }
  }, [r, o, i, e]), g = E(
    (v) => {
      v.key === "Enter" && d();
    },
    [d]
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
          onChange: (v) => n(v.target.value),
          onKeyDown: g,
          disabled: o
        }
      ),
      a && /* @__PURE__ */ f("div", { className: "figma-plugin-error", children: a }),
      /* @__PURE__ */ f("div", { className: "figma-plugin-hint", children: "Token is stored locally in this project only." })
    ] }),
    /* @__PURE__ */ f(
      "button",
      {
        className: "btn-primary",
        onClick: d,
        disabled: !r.trim() || o,
        style: { width: "100%", marginTop: "4px" },
        children: o ? /* @__PURE__ */ y(pe, { children: [
          /* @__PURE__ */ f("span", { className: "figma-plugin-spinner", style: { marginRight: "8px", verticalAlign: "middle" } }),
          "Connecting..."
        ] }) : "Connect"
      }
    )
  ] });
}
function Ye({ currentUser: e, onTokenUpdated: t, onTokenRemoved: i, onBack: r }) {
  const n = re(), o = (n == null ? void 0 : n.shell) ?? null, [s, a] = T(""), [u, d] = T(!1), [g, v] = T(null), x = E(async () => {
    if (!o) return;
    const m = s.trim();
    if (!(!m || u)) {
      d(!0), v(null);
      try {
        const b = await be(o, m);
        t(m, b);
      } catch (b) {
        v((b == null ? void 0 : b.message) || "Failed to validate token. Please check and try again.");
      } finally {
        d(!1);
      }
    }
  }, [s, u, o, t]), N = E(
    (m) => {
      m.key === "Enter" && x();
    },
    [x]
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
          onChange: (m) => a(m.target.value),
          onKeyDown: N,
          disabled: u
        }
      ),
      g && /* @__PURE__ */ f("div", { className: "figma-plugin-error", children: g }),
      /* @__PURE__ */ f(
        "button",
        {
          className: "btn-primary",
          onClick: x,
          disabled: !s.trim() || u,
          style: { width: "100%", marginTop: "8px" },
          children: u ? /* @__PURE__ */ y(pe, { children: [
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
  const t = e.match(
    /figma\.com\/(file|design|proto|board)\/([A-Za-z0-9]+)/
  );
  if (!t) return null;
  const i = t[1], r = t[2];
  let n = null;
  const o = e.match(/[?&]node-id=([^&]+)/);
  return o && (n = decodeURIComponent(o[1]).replace(/-/g, ":")), { fileKey: r, nodeId: n, fileType: i };
}
function Je(e) {
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
function Qe(e) {
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
function et(e) {
  const t = {
    flexDirection: e.layoutMode === "HORIZONTAL" ? "row" : "column",
    justifyContent: Je(e.primaryAxisAlignItems),
    alignItems: Qe(e.counterAxisAlignItems),
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
function tt(e, t) {
  const i = t[e.componentId];
  let r;
  if (e.componentProperties) {
    const o = {};
    for (const [s, a] of Object.entries(e.componentProperties))
      (a.type === "VARIANT" || a.type === "BOOLEAN" || a.type === "TEXT") && (o[s] = a.value);
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
function Ce(e, t, i, r) {
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
  }), "layoutMode" in n && n.layoutMode && n.layoutMode !== "NONE" && (o.autoLayout = et(n)), "constraints" in n && n.constraints != null && (o.constraints = n.constraints), "minWidth" in n && n.minWidth != null && (o.minWidth = n.minWidth), "maxWidth" in n && n.maxWidth != null && (o.maxWidth = n.maxWidth), "minHeight" in n && n.minHeight != null && (o.minHeight = n.minHeight), "maxHeight" in n && n.maxHeight != null && (o.maxHeight = n.maxHeight), "preserveRatio" in n && n.preserveRatio != null && (o.preserveRatio = n.preserveRatio), "fills" in n && Array.isArray(n.fills) && (o.fills = n.fills), "strokes" in n && Array.isArray(n.strokes) && (o.strokes = n.strokes), "strokeWeight" in n && n.strokeWeight != null && (o.strokeWeight = n.strokeWeight), "effects" in n && Array.isArray(n.effects) && (o.effects = n.effects), "cornerRadius" in n && n.cornerRadius != null && (o.cornerRadius = n.cornerRadius), "rectangleCornerRadii" in n && Array.isArray(n.rectangleCornerRadii) && (o.rectangleCornerRadii = n.rectangleCornerRadii), "opacity" in n && n.opacity != null && n.opacity !== 1 && (o.opacity = n.opacity), "blendMode" in n && n.blendMode && n.blendMode !== "PASS_THROUGH" && n.blendMode !== "NORMAL" && (o.blendMode = n.blendMode), "isMask" in n && n.isMask === !0 && (o.isMask = !0), "styles" in n && n.styles && (o.styleRefs = n.styles), n.type) {
    case "TEXT":
      o.textContent = n.characters, n.style && (o.textStyle = n.style), n.styleOverrideTable && Object.keys(n.styleOverrideTable).length > 0 && (o.textStyleOverrides = n.styleOverrideTable);
      break;
    case "INSTANCE":
      return o.componentRef = tt(n, t), o;
    case "BOOLEAN_OPERATION":
      return o;
  }
  if ("children" in n && Array.isArray(n.children)) {
    const s = n.absoluteBoundingBox != null ? { x: n.absoluteBoundingBox.x, y: n.absoluteBoundingBox.y } : null, a = n.children.map((u) => Ce(u, t, i + 1, s)).filter((u) => u !== null);
    o.children = it(a);
  }
  return o;
}
function ge(e) {
  let t = 1;
  if (e.children && Array.isArray(e.children))
    for (const i of e.children)
      t += ge(i);
  return t;
}
function nt(e) {
  const t = e.componentRef, i = t.variantProperties ? JSON.stringify(t.variantProperties, Object.keys(t.variantProperties).sort()) : "";
  return `${t.componentId}::${i}`;
}
function it(e) {
  if (e.length === 0) return [];
  const t = /* @__PURE__ */ new Map();
  for (let n = 0; n < e.length; n++) {
    const o = e[n];
    if (o.componentRef) {
      const s = nt(o), a = t.get(s);
      a ? (a.count++, a.indices.push(n)) : t.set(s, { node: o, count: 1, indices: [n] });
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
function rt(e, t) {
  let i = 0;
  for (const n of e)
    i += ge(n);
  return {
    rootNodes: e.map((n) => Ce(n, t, 0, null)).filter((n) => n !== null),
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
function ot(e) {
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
function st(e, t) {
  const i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), u = [], d = /* @__PURE__ */ new Map();
  let g = 0, v = 0, x = 0;
  function N(l) {
    var h, P, z;
    if (l.fills && Array.isArray(l.fills)) {
      const c = lt(l, t);
      for (const p of l.fills)
        if (p.visible !== !1)
          if (p.type === "SOLID") {
            const C = { ...p.color };
            p.opacity != null && p.opacity !== 1 && (C.a = C.a * p.opacity);
            const I = X(C);
            ce(i, I, l.id, "fill", c);
          } else if ((h = p.type) != null && h.startsWith("GRADIENT_")) {
            const C = ot(p), I = C, R = r.get(I);
            R ? (R.usageCount++, R.nodeIds.push(l.id)) : (x++, r.set(I, {
              value: C,
              name: c ?? `gradient-${x}`,
              gradientType: p.type,
              usageCount: 1,
              nodeIds: [l.id]
            }));
          } else p.type === "IMAGE" && u.push({
            imageRef: p.imageRef,
            scaleMode: p.scaleMode,
            nodeId: l.id,
            nodeName: l.name
          });
    }
    if (l.strokes && Array.isArray(l.strokes)) {
      const c = ct(l, t);
      for (const p of l.strokes)
        if (p.visible !== !1 && p.type === "SOLID") {
          const C = { ...p.color };
          p.opacity != null && p.opacity !== 1 && (C.a = C.a * p.opacity);
          const I = X(C);
          ce(i, I, l.id, "stroke", c);
        }
    }
    if (l.effects && Array.isArray(l.effects)) {
      const c = dt(l, t);
      for (const p of l.effects)
        if (p.visible === !0 && (p.type === "DROP_SHADOW" || p.type === "INNER_SHADOW")) {
          const C = p.type === "DROP_SHADOW" ? "drop-shadow" : "inner-shadow", I = X(p.color), R = ((P = p.offset) == null ? void 0 : P.x) ?? 0, U = ((z = p.offset) == null ? void 0 : z.y) ?? 0, D = p.radius ?? 0, B = p.spread ?? 0, F = `${C}|${I}|${R}|${U}|${D}|${B}`, j = a.get(F);
          j ? (j.usageCount++, j.nodeIds.push(l.id)) : (v++, a.set(F, {
            type: C,
            color: I,
            offsetX: R,
            offsetY: U,
            blur: D,
            spread: B,
            name: c ?? `shadow-${v}`,
            usageCount: 1,
            nodeIds: [l.id]
          })), ce(i, I, l.id, "shadow", null);
        }
    }
    if (l.type === "TEXT" && l.textStyle) {
      const c = ut(l, t);
      if (we(n, l.textStyle, l.id, c), l.textStyleOverrides && typeof l.textStyleOverrides == "object")
        for (const p of Object.values(l.textStyleOverrides))
          we(n, p, l.id, null);
    }
    if (l.autoLayout) {
      const c = l.autoLayout;
      c.padding && (K(o, c.padding.top, "padding-top"), K(o, c.padding.right, "padding-right"), K(o, c.padding.bottom, "padding-bottom"), K(o, c.padding.left, "padding-left")), K(o, c.gap, "gap"), c.rowGap != null && K(o, c.rowGap, "row-gap");
    }
    if (l.cornerRadius != null || l.rectangleCornerRadii != null || at(l)) {
      const c = l.rectangleCornerRadii ? null : l.cornerRadius ?? null, p = l.rectangleCornerRadii ?? null;
      let C = null, I = null;
      if (l.strokes && Array.isArray(l.strokes)) {
        const D = l.strokes.find(
          (B) => B.visible !== !1 && B.type === "SOLID"
        );
        D && (C = X(D.color), I = l.strokeWeight ?? null);
      }
      const R = `${c}|${JSON.stringify(p)}|${C}|${I}`, U = s.get(R);
      U ? (U.usageCount++, U.nodeIds.push(l.id)) : (g++, s.set(R, {
        radius: c,
        cornerRadii: p,
        strokeColor: C,
        strokeWeight: I,
        name: `border-${g}`,
        usageCount: 1,
        nodeIds: [l.id]
      }));
    }
    if (l.componentRef) {
      const c = l.componentRef, p = `${c.componentName}::${JSON.stringify(c.variantProperties ?? {})}`, C = d.get(p), I = l.repeatCount ?? 1;
      if (C)
        C.usageCount += I;
      else {
        const R = {
          componentName: c.componentName,
          source: c.source,
          usageCount: I
        };
        c.description && (R.description = c.description), c.variantProperties && (R.variantProperties = c.variantProperties), d.set(p, R);
      }
    }
    if (l.children)
      for (const c of l.children)
        N(c);
  }
  for (const l of e)
    N(l);
  const m = Array.from(i.values()).map((l) => ({
    value: l.value,
    name: l.name,
    usageCount: l.usageCount,
    nodeIds: l.nodeIds,
    source: Array.from(l.source)
  }));
  m.sort((l, h) => h.usageCount - l.usageCount);
  const b = Array.from(r.values());
  b.sort((l, h) => h.usageCount - l.usageCount);
  const L = Array.from(n.values());
  L.sort((l, h) => h.usageCount - l.usageCount);
  const O = Array.from(o.values());
  O.sort((l, h) => l.value - h.value);
  const M = Array.from(s.values());
  M.sort((l, h) => h.usageCount - l.usageCount);
  const _ = Array.from(a.values());
  _.sort((l, h) => h.usageCount - l.usageCount);
  const A = Array.from(d.values());
  return A.sort((l, h) => h.usageCount - l.usageCount), {
    colors: m,
    gradients: b,
    typography: L,
    spacing: O,
    borders: M,
    shadows: _,
    imageFills: u,
    components: A
  };
}
function ce(e, t, i, r, n) {
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
function we(e, t, i, r) {
  const n = t.fontFamily ?? "Unknown", o = t.fontSize ?? 16, s = t.fontWeight ?? 400, a = t.lineHeightPx ?? null, u = t.letterSpacing ?? 0, d = `${n}|${o}|${s}|${a}|${u}`, g = e.get(d);
  if (g)
    g.usageCount++, g.nodeIds.includes(i) || g.nodeIds.push(i), r && g.name.startsWith(n) && (g.name = r);
  else {
    const v = `${n}-${o}-${s}`;
    e.set(d, {
      fontFamily: n,
      fontSize: o,
      fontWeight: s,
      lineHeight: a,
      letterSpacing: u,
      name: r ?? v,
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
function at(e) {
  return !e.strokes || !Array.isArray(e.strokes) ? !1 : e.strokes.some((t) => t.visible !== !1 && t.type === "SOLID");
}
function lt(e, t) {
  var r, n;
  const i = (r = e.styleRefs) == null ? void 0 : r.fill;
  return i ? ((n = t[i]) == null ? void 0 : n.name) ?? null : null;
}
function ct(e, t) {
  var r, n;
  const i = (r = e.styleRefs) == null ? void 0 : r.stroke;
  return i ? ((n = t[i]) == null ? void 0 : n.name) ?? null : null;
}
function ut(e, t) {
  var r, n;
  const i = (r = e.styleRefs) == null ? void 0 : r.text;
  return i ? ((n = t[i]) == null ? void 0 : n.name) ?? null : null;
}
function dt(e, t) {
  var r, n;
  const i = (r = e.styleRefs) == null ? void 0 : r.effect;
  return i ? ((n = t[i]) == null ? void 0 : n.name) ?? null : null;
}
const ft = 500, pt = 2e3;
function $e(e) {
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
      t.push(...$e(i));
  return t;
}
async function gt(e) {
  const { shell: t, token: i, fileKey: r, nodeId: n, scope: o } = e;
  let s, a, u;
  if (o === "node" || o === "frame") {
    if (!n)
      throw new Error(
        `Cannot extract ${o}: no node ID found in the URL. Paste a Figma URL that includes a node-id, or switch to "Entire Page" scope.`
      );
    const b = await Ve(t, i, r, n);
    s = [b.rootNode], a = b.components, u = b.styles;
  } else {
    const b = await Ke(t, i, r), L = b.rootNodes[0];
    s = (L == null ? void 0 : L.children) || [], a = b.components, u = b.styles;
  }
  let d = 0;
  for (const b of s)
    d += ge(b);
  let g;
  d > ft && (g = {
    nodeCount: d,
    message: `This selection has ~${d} nodes. Large extractions may produce verbose output.`
  });
  const v = [];
  for (const b of s)
    v.push(...$e(b));
  const x = rt(s, a);
  d > pt && (x.truncated = !0);
  const N = st(x.rootNodes, u), m = new Set(N.imageFills.map((b) => b.nodeId));
  for (const b of v)
    m.has(b.nodeId) || (m.add(b.nodeId), N.imageFills.push(b));
  return { extraction: x, tokens: N, fileKey: r, largeTreeWarning: g };
}
function G(e) {
  return e.toLowerCase().replace(/[/\s]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "") || "unnamed";
}
function mt(e) {
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
const ht = /* @__PURE__ */ new Set([
  "VECTOR",
  "BOOLEAN_OPERATION",
  "STAR",
  "POLYGON",
  "ELLIPSE"
]);
function ie(e) {
  var t;
  return ((t = e.fills) == null ? void 0 : t.some((i) => i.type === "IMAGE")) ?? !1;
}
function de(e) {
  var i;
  const t = (i = e.fills) == null ? void 0 : i.find((r) => r.type === "IMAGE");
  return t == null ? void 0 : t.imageRef;
}
function yt(e) {
  const t = e.componentRef, i = t.variantProperties ? Object.entries(t.variantProperties).sort(([r], [n]) => r.localeCompare(n)).map(([r, n]) => `${r}=${n}`).join(",") : "";
  return `${t.componentId}|${i}`;
}
function xt(e) {
  var t, i, r;
  return !((t = e.strokes) != null && t.some((n) => n.visible !== !1) || (i = e.fills) != null && i.some((n) => {
    var o;
    return n.visible !== !1 && ((o = n.type) == null ? void 0 : o.startsWith("GRADIENT_"));
  }) || ie(e) || (r = e.effects) != null && r.some((n) => n.visible !== !1));
}
function Te(e, t, i, r) {
  const n = [];
  if (!e.children) return n;
  for (const o of e.children) {
    if (ie(o)) {
      const s = t.get(o.id) ?? de(o);
      s && !r.has(s) && (r.add(s), t.has(o.id) && i.add(o.id), n.push({
        nodeId: o.id,
        nodeName: o.name,
        exportType: "png-fill",
        filename: G(o.name) + ".png",
        imageRef: s
      }));
    }
    n.push(...Te(o, t, i, r));
  }
  return n;
}
function Ie(e, t, i, r, n, o, s, a) {
  if (n.has(e.id)) {
    r.push({
      nodeId: e.id,
      nodeName: e.name,
      exportType: "png-render",
      filename: G(e.name) + ".png"
    });
    return;
  }
  if (e.type === "INSTANCE" && e.componentRef) {
    if (ie(e)) {
      const g = t.get(e.id) ?? de(e);
      if (t.has(e.id) && i.add(e.id), g && a.has(g)) return;
      g && a.add(g), r.push({
        nodeId: e.id,
        nodeName: e.name,
        exportType: "png-fill",
        filename: G(e.name) + ".png",
        imageRef: g
      });
      return;
    }
    const u = Te(e, t, i, a);
    for (const g of u)
      g.parentInstanceId = e.id;
    const d = yt(e);
    o.has(d) || (o.add(d), u.length === 0 && r.push({
      nodeId: e.id,
      nodeName: e.componentRef.componentName,
      exportType: "png-render",
      filename: G(e.componentRef.componentName) + ".png"
    }));
    for (const g of u)
      r.push(g);
    return;
  }
  if (ie(e)) {
    const u = t.get(e.id) ?? de(e);
    t.has(e.id) && i.add(e.id), r.push({
      nodeId: e.id,
      nodeName: e.name,
      exportType: "png-fill",
      filename: G(e.name) + ".png",
      imageRef: u
    });
    return;
  }
  if (e.type !== "LINE") {
    if (ht.has(e.type)) {
      const u = G(e.name) + ".svg";
      s.has(u) || (s.add(u), r.push({
        nodeId: e.id,
        nodeName: e.name,
        exportType: "svg",
        filename: u
      }));
      return;
    }
    if (e.type === "RECTANGLE") {
      if (xt(e)) return;
      const u = G(e.name) + ".svg";
      s.has(u) || (s.add(u), r.push({
        nodeId: e.id,
        nodeName: e.name,
        exportType: "svg",
        filename: u
      }));
      return;
    }
    if (e.children)
      for (const u of e.children)
        Ie(u, t, i, r, n, o, s, a);
  }
}
function wt(e, t, i = /* @__PURE__ */ new Set()) {
  const r = /* @__PURE__ */ new Map();
  for (const d of t)
    r.set(d.nodeId, d.imageRef);
  const n = [], o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set();
  for (const d of e)
    if (d.children)
      for (const g of d.children)
        Ie(g, r, o, n, i, s, a, u);
  for (const d of t)
    o.has(d.nodeId) || n.push({
      nodeId: d.nodeId,
      nodeName: d.nodeName,
      exportType: "png-fill",
      filename: G(d.nodeName) + ".png",
      imageRef: d.imageRef
    });
  return mt(n);
}
const vt = 5, bt = 3, Ct = 3, $t = /* @__PURE__ */ new Set([
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
  const t = /* @__PURE__ */ new Set(), i = [];
  for (const r of e)
    if (r.children)
      for (const n of r.children)
        Ne(n, t, i);
  return { compositionNodeIds: t, warnings: i };
}
function Ne(e, t, i) {
  if (It(e)) {
    t.add(e.id), me(e) && he(e, 0) ? i.push(`Auto-detected "${e.name}" as a composition`) : i.push(`Auto-detected "${e.name}" as an illustration (vector-only group)`);
    return;
  }
  if (e.children)
    for (const r of e.children)
      Ne(r, t, i);
}
function It(e) {
  return !!(me(e) && he(e, 0) || Nt(e));
}
function Nt(e) {
  return e.type !== "GROUP" && e.type !== "FRAME" || !e.children || e.children.length === 0 || !me(e) ? !1 : Re(e);
}
function Re(e) {
  if (!e.children) return !0;
  for (const t of e.children)
    if (!$t.has(t.type) || !Re(t)) return !1;
  return !0;
}
function me(e) {
  return !!(e.children && e.children.length >= vt || e.type === "BOOLEAN_OPERATION" || ke(e, 0) >= bt);
}
function he(e, t) {
  if (t > Ct) return !1;
  if (e.blendMode || e.isMask === !0 || e.opacity !== void 0 && e.opacity < 1) return !0;
  if (e.children) {
    for (const i of e.children)
      if (he(i, t + 1)) return !0;
  }
  return !1;
}
function ke(e, t) {
  if (!e.children || e.children.length === 0)
    return t;
  let i = t;
  for (const r of e.children) {
    const n = ke(r, t + 1);
    n > i && (i = n);
  }
  return i;
}
async function Rt(e, t) {
  const i = `${t}/.shipstudio/assets`, r = await e.exec("rm", ["-rf", i]);
  if (r.exit_code !== 0)
    throw new Error(`Failed to clean assets directory: ${r.stderr}`);
  const n = await e.exec("mkdir", ["-p", i]);
  if (n.exit_code !== 0)
    throw new Error(`Failed to create assets directory: ${n.stderr}`);
  return i;
}
async function Se(e, t, i) {
  const r = ["-sS", "-o", i, "--max-time", "30", "-L", t];
  if ((await e.exec("curl", r, { timeout: 35e3 })).exit_code === 0) return { success: !0 };
  const o = await e.exec("curl", r, { timeout: 35e3 });
  return o.exit_code === 0 ? { success: !0 } : {
    success: !1,
    error: o.stderr || `curl exit code ${o.exit_code}`
  };
}
async function kt(e, t, i, r) {
  const n = [], o = [];
  for (let s = 0; s < i.length; s++) {
    const { filename: a, url: u, nodeId: d, assetType: g, parentInstanceId: v } = i[s], x = `${t}/${a}`;
    r && r({
      current: s + 1,
      total: i.length,
      currentAsset: a,
      phase: "assets"
    });
    const N = await Se(e, u, x);
    if (N.success) {
      const m = { filename: a, path: x };
      d !== void 0 && (m.nodeId = d), g !== void 0 && (m.assetType = g), v !== void 0 && (m.parentInstanceId = v), n.push(m);
    } else
      o.push(`Failed to download ${a}: ${N.error}`);
  }
  return { downloaded: n, warnings: o };
}
async function St(e) {
  const { shell: t, token: i, fileKey: r, selectedNodeId: n, projectPath: o, rootNodes: s, imageFills: a, onProgress: u } = e, d = [], g = await Rt(t, o), { compositionNodeIds: v, warnings: x } = Tt(s);
  d.push(...x);
  const N = wt(s, a, v);
  u && u({ current: 0, total: N.length + 1, currentAsset: "preview.png", phase: "preview" });
  let m = `${g}/preview.png`;
  try {
    const p = (await le(t, i, r, [n], "png", 2))[n];
    if (p) {
      const C = await Se(t, p, m);
      C.success || (d.push(`Preview download failed: ${C.error}`), m = "");
    } else
      d.push("Figma could not render preview for this node"), m = "";
  } catch (c) {
    d.push(`Preview render failed: ${(c == null ? void 0 : c.message) || "Unknown error"}`), m = "";
  }
  const b = N.filter((c) => c.exportType === "svg");
  let L = {};
  if (b.length > 0)
    try {
      L = await le(t, i, r, b.map((c) => c.nodeId), "svg");
    } catch (c) {
      d.push(`SVG render API failed: ${(c == null ? void 0 : c.message) || "Unknown error"}`);
    }
  const O = N.filter((c) => c.exportType === "png-fill");
  let M = {};
  if (O.length > 0)
    try {
      M = await Xe(t, i, r);
    } catch (c) {
      d.push(`Image fills API failed: ${(c == null ? void 0 : c.message) || "Unknown error"}`);
    }
  const _ = N.filter((c) => c.exportType === "png-render");
  let A = {};
  if (_.length > 0)
    try {
      A = await le(t, i, r, _.map((c) => c.nodeId), "png", 2);
    } catch (c) {
      d.push(`Composition PNG render failed: ${(c == null ? void 0 : c.message) || "Unknown error"}`);
    }
  const l = new Set(v), h = [];
  for (const c of b) {
    const p = L[c.nodeId];
    p ? h.push({ filename: c.filename, url: p, nodeId: c.nodeId, assetType: "icon" }) : d.push(`No render URL for ${c.filename} (node ${c.nodeId})`);
  }
  for (const c of O)
    if (c.imageRef && M[c.imageRef]) {
      const p = { filename: c.filename, url: M[c.imageRef], nodeId: c.nodeId, assetType: "image" };
      c.parentInstanceId && (p.parentInstanceId = c.parentInstanceId), h.push(p);
    } else
      d.push(`No download URL for image fill ${c.filename} (ref: ${c.imageRef})`);
  for (const c of _) {
    const p = A[c.nodeId];
    if (p) {
      const C = l.has(c.nodeId) ? "composition" : "component";
      h.push({ filename: c.filename, url: p, nodeId: c.nodeId, assetType: C });
    } else
      d.push(`No render URL for ${c.filename} (node ${c.nodeId})`);
  }
  const { downloaded: P, warnings: z } = await kt(
    t,
    g,
    h,
    u
  );
  return d.push(...z), {
    assetsDir: g,
    previewPath: m,
    assets: P,
    warnings: d
  };
}
const At = /^(Frame|Group|Rectangle|Ellipse|Vector|Section|Instance|Line|Star|Polygon)\s*\d*$/i;
function Et(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e) {
    const r = Ee(i.name) ? [] : [i.name];
    Ae(i, r, t);
  }
  return t;
}
function Ae(e, t, i) {
  if (i.set(e.id, Lt(t)), !!e.children)
    for (const r of e.children) {
      const n = Ee(r.name) ? t : [...t, r.name];
      Ae(r, n, i);
    }
}
function Lt(e) {
  return e.length === 0 ? "" : e.length <= 4 ? e.join(" > ") : `${e[0]} > ... > ${e[e.length - 2]} > ${e[e.length - 1]}`;
}
function Ee(e) {
  return At.test(e);
}
const ve = 12e3;
function Pt(e) {
  return Math.ceil(e.length / 4);
}
function Ot(e) {
  const { extraction: t, exportResult: i, projectPath: r } = e, n = t.tokens, o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
  for (const m of i.assets)
    m.nodeId && (o.set(m.nodeId, m.filename), m.assetType === "composition" && s.add(m.nodeId)), m.parentInstanceId && !o.has(m.parentInstanceId) && o.set(m.parentInstanceId, m.filename);
  const a = e.rootNodes ?? t.extraction.rootNodes, u = Et(a), g = [
    Mt(e),
    Ft(),
    Ht(i.previewPath, r),
    Ut(t.extraction.rootNodes, o, s),
    Dt(n),
    Yt(n.components),
    qt(i.previewPath, i.assets, r, u)
  ].filter(Boolean).join(`

`), v = g.length, x = Pt(g), N = {
    nodeCount: t.extraction.nodeCount,
    colorCount: n.colors.length,
    fontCount: n.typography.length,
    assetCount: i.assets.length,
    estimatedTokens: x
  };
  return {
    markdown: g,
    charCount: v,
    estimatedTokens: x,
    stats: N
  };
}
function Mt(e) {
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
function Ft() {
  return [
    "## How to Use This Brief",
    "",
    "**Before building:** Read this brief fully. Plan your approach and ask clarifying questions before writing any code.",
    "**During building:** Use only the assets listed in the Assets section below -- if an asset is missing, ask the user rather than substituting or fabricating a replacement.",
    "**After building:** Compare your result against the Preview image above and verify that all design tokens and assets are correctly applied."
  ].join(`
`);
}
function Ht(e, t) {
  return e ? `## Preview

![Preview](${fe(e, t)})` : "";
}
function Ut(e, t, i) {
  const r = [];
  for (const n of e)
    Le(n, 0, r, t, i);
  return r.length === 0 ? "" : `## Layout Tree

` + r.join(`
`);
}
function Le(e, t, i, r, n) {
  if (e.visible !== !1) {
    if (n.has(e.id)) {
      const o = "  ".repeat(t), s = r.get(e.id), a = e.width != null && e.height != null ? ` ${Math.round(e.width)}x${Math.round(e.height)}` : "", u = s ? ` -> ${s}` : "";
      i.push(`${o}[Illustration] '${e.name}'${a}${u}`);
      return;
    }
    if (i.push(_t(e, t, r)), !e.componentRef && e.children)
      for (const o of e.children)
        Le(o, t + 1, i, r, n);
  }
}
function Bt(e) {
  return e.charAt(0).toUpperCase() + e.slice(1).toLowerCase();
}
function Pe(e) {
  return /Property\s+\d+=/i.test(e) ? e.split(",").map((t) => {
    const i = t.indexOf("=");
    if (i !== -1) {
      const r = t.slice(0, i).trim(), n = t.slice(i + 1).trim();
      if (/^Property\s+\d+$/i.test(r)) return n;
    }
    return t.trim();
  }).join(", ") : e;
}
function _t(e, t, i) {
  const r = "  ".repeat(t), n = [];
  if (e.componentRef) {
    let a = `Instance "${Pe(e.componentRef.componentName)}"`;
    if (e.repeatCount && e.repeatCount > 1 && (a += ` x${e.repeatCount} (repeated)`), e.componentRef.variantProperties && Object.keys(e.componentRef.variantProperties).length > 0) {
      const d = Object.entries(e.componentRef.variantProperties).map(([g, v]) => /^Property\s+\d+$/i.test(g) ? String(v) : `${g}: ${v}`).join(", ");
      a += ` (${d})`;
    }
    const u = i == null ? void 0 : i.get(e.id);
    u && (a += ` -> ${u}`), n.push(a);
  } else if (e.type === "TEXT") {
    const s = e.textContent ?? "", a = s.length > 200 ? s.slice(0, 200) + "..." : s;
    let u = "";
    e.textStyle && (u = ` (${e.textStyle.fontFamily} ${e.textStyle.fontSize}/${e.textStyle.fontWeight})`), n.push(`Text '${a}'${u}`);
  } else
    n.push(`${Bt(e.type)} '${e.name}'`);
  if (e.autoLayout) {
    const s = e.autoLayout, a = [s.flexDirection];
    s.gap > 0 && a.push(`gap: ${s.gap}`), s.justifyContent !== "flex-start" && a.push(`justify: ${s.justifyContent}`), s.alignItems !== "flex-start" && a.push(`align: ${s.alignItems}`);
    const u = Wt(s.padding);
    u && a.push(u), s.flexWrap === "wrap" && a.push("wrap"), n.push(`(${a.join(", ")})`);
  }
  e.width != null && e.height != null && n.push(`${Math.round(e.width)}x${Math.round(e.height)}`), e.positioning === "ABSOLUTE" && (e.absoluteOffset ? n.push(`[absolute] top:${e.absoluteOffset.top} left:${e.absoluteOffset.left}`) : n.push("[absolute]"));
  const o = zt(e);
  return o && n.push(o), `${r}${n.join(" ")}`;
}
function ue(e) {
  if (!e) return null;
  for (const t of e)
    if (t.visible !== !1 && t.type === "SOLID" && t.color) {
      const i = t.opacity ?? 1, r = { ...t.color, a: (t.color.a ?? 1) * i };
      return X(r);
    }
  return null;
}
function zt(e) {
  var i;
  const t = [];
  if (e.widthMode === "FILL" && t.push("w:fill"), e.heightMode === "FILL" && t.push("h:fill"), e.widthMode === "HUG" && t.push("w:hug"), e.heightMode === "HUG" && t.push("h:hug"), e.type !== "TEXT") {
    const r = ue(e.fills);
    r && r !== "#ffffff" && r !== "#000000" ? t.push(`bg:${r}`) : r && t.push(`bg:${r}`);
  }
  if (e.type === "TEXT") {
    const r = ue(e.fills);
    r && t.push(`color:${r}`);
  }
  if (e.cornerRadius && e.cornerRadius > 0 && t.push(`r:${Math.round(e.cornerRadius)}`), e.strokeWeight && e.strokeWeight > 0 && ((i = e.strokes) != null && i.length)) {
    const r = ue(e.strokes);
    r && t.push(`border:${e.strokeWeight}px ${r}`);
  }
  return e.layoutGrow === 1 && t.push("flex-grow:1"), e.layoutAlign === "STRETCH" && t.push("align-self:stretch"), e.opacity != null && e.opacity < 1 && t.push(`opacity:${e.opacity.toFixed(2)}`), t.length === 0 ? null : `{${t.join(" ")}}`;
}
function Wt(e) {
  return e.top === 0 && e.right === 0 && e.bottom === 0 && e.left === 0 ? null : e.top === e.bottom && e.left === e.right && e.top === e.left ? `padding: ${e.top}` : e.top === e.bottom && e.left === e.right ? `padding: ${e.top} ${e.left}` : `padding: ${e.top} ${e.right} ${e.bottom} ${e.left}`;
}
function Dt(e) {
  const t = [];
  return e.colors.length > 0 && t.push(jt(e.colors)), e.gradients.length > 0 && t.push(Gt(e.gradients)), e.typography.length > 0 && t.push(Vt(e.typography)), e.spacing.length > 0 && t.push(Kt(e.spacing)), e.borders.length > 0 && t.push(Xt(e.borders)), e.shadows.length > 0 && t.push(Zt(e.shadows)), t.length === 0 ? "" : `## Design Tokens

` + t.join(`

`);
}
function jt(e) {
  return [
    "### Colors",
    "",
    "| Name | Value | Usage |",
    "|------|-------|-------|",
    ...e.map((i) => `| ${i.name} | ${i.value} | ${i.usageCount} |`)
  ].join(`
`);
}
function Gt(e) {
  return [
    "### Gradients",
    "",
    "| Name | Value | Usage |",
    "|------|-------|-------|",
    ...e.map((i) => `| ${i.name} | ${i.value} | ${i.usageCount} |`)
  ].join(`
`);
}
function Vt(e) {
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
function Kt(e) {
  return [
    "### Spacing",
    "",
    "| Value | Sources | Usage |",
    "|-------|---------|-------|",
    ...e.map((i) => `| ${i.value}px | ${i.sources.join(", ")} | ${i.usageCount} |`)
  ].join(`
`);
}
function Xt(e) {
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
function Zt(e) {
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
      const r = Pe(i.componentName), n = i.variantProperties && Object.keys(i.variantProperties).length > 0 ? Object.entries(i.variantProperties).map(([o, s]) => /^Property\s+\d+$/i.test(o) ? String(s) : `${o}: ${s}`).join(", ") : "--";
      return `| ${r} | ${i.source} | ${n} | ${i.usageCount} |`;
    })
  ].join(`
`);
}
function qt(e, t, i, r) {
  if (!e && t.length === 0) return "";
  const n = [];
  if (e) {
    const o = fe(e, i), s = o.split("/").pop() ?? o;
    n.push(`| ${s} | Preview | -- | ${o} |`);
  }
  for (const o of t) {
    const s = fe(o.path, i), a = Jt(o.assetType);
    let u = "--";
    o.nodeId && (u = r.get(o.nodeId) || o.parentInstanceId && r.get(o.parentInstanceId) || "--"), n.push(`| ${o.filename} | ${a} | ${u} | ${s} |`);
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
function Jt(e) {
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
function fe(e, t) {
  return e.startsWith(t + "/") ? e.slice(t.length + 1) : e;
}
async function Qt(e, t, i) {
  const r = `${t}/brief.md`, n = btoa(unescape(encodeURIComponent(i))), o = await e.exec("bash", [
    "-c",
    `echo '${n}' | base64 -d > '${r}'`
  ]);
  if (o.exit_code !== 0)
    throw new Error(`Failed to save brief: ${o.stderr}`);
}
async function en(e, t) {
  const i = btoa(unescape(encodeURIComponent(t))), r = await e.exec("bash", [
    "-c",
    `echo '${i}' | base64 -d | pbcopy`
  ]);
  if (r.exit_code !== 0)
    throw new Error(`Clipboard copy failed: ${r.stderr}`);
}
function tn(e) {
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
function Oe({ nodes: e, depth: t = 0, maxDepth: i = 2 }) {
  return t >= i ? null : /* @__PURE__ */ f("div", { style: { paddingLeft: t > 0 ? "12px" : "0", borderLeft: t > 0 ? "1px solid var(--border)" : "none" }, children: e.map((r, n) => {
    const o = r.componentRef ? `<${r.componentRef.componentName}${r.repeatCount ? ` x${r.repeatCount}` : ""}>` : r.type === "TEXT" ? `"${(r.textContent ?? "").slice(0, 30)}${(r.textContent ?? "").length > 30 ? "..." : ""}"` : r.name, s = r.autoLayout ? `${r.autoLayout.flexDirection}` : r.type === "INSTANCE" ? "component" : r.type.toLowerCase();
    return /* @__PURE__ */ y("div", { style: { fontSize: "11px", lineHeight: 1.7 }, children: [
      /* @__PURE__ */ y("span", { style: { color: "var(--text-muted)" }, children: [
        s,
        " "
      ] }),
      /* @__PURE__ */ f("span", { style: { color: r.visible === !1 ? "var(--text-muted)" : "var(--text-primary)" }, children: o }),
      r.visible === !1 && /* @__PURE__ */ f("span", { style: { color: "var(--text-muted)", marginLeft: "4px" }, children: "(hidden)" }),
      r.children && r.children.length > 0 && t + 1 < i && /* @__PURE__ */ f(Oe, { nodes: r.children, depth: t + 1, maxDepth: i }),
      r.children && r.children.length > 0 && t + 1 >= i && /* @__PURE__ */ y("span", { style: { color: "var(--text-muted)", fontSize: "11px", marginLeft: "12px" }, children: [
        "(",
        r.children.length,
        " children)"
      ] })
    ] }, r.id || n);
  }) });
}
function nn({ token: e }) {
  const t = re(), i = (t == null ? void 0 : t.shell) ?? null, r = (t == null ? void 0 : t.actions) ?? null, [n, o] = T(""), [s, a] = T(null), u = s != null && s.nodeId ? "node" : "page", [d, g] = T(null), [v, x] = T(!1), [N, m] = T(null), [b, L] = T(!1), [O, M] = T(null), [_, A] = T(null), [l, h] = T(!1), [P, z] = T(!1), [c, p] = T(!1), [C, I] = T(null), [R, U] = T(null), [D, B] = T(!1), [F, j] = T(null), [ye, Y] = T(null), q = ze(
    () => O ? tn(O.rootNodes) : null,
    [O]
  ), V = te(null), W = te(i);
  W.current = i;
  const oe = te(0), Q = te(0), ee = E(async (w) => {
    var S, k;
    if (!(!W.current || !s)) {
      p(!0), I(null), U(null);
      try {
        const $ = await St({
          shell: W.current,
          token: e,
          fileKey: w.fileKey,
          selectedNodeId: s.nodeId || ((S = w.extraction.rootNodes[0]) == null ? void 0 : S.id) || "0:0",
          projectPath: ((k = t == null ? void 0 : t.project) == null ? void 0 : k.path) ?? ".",
          rootNodes: w.extraction.rootNodes,
          imageFills: w.tokens.imageFills,
          onProgress: I
        });
        if (U($), r) {
          const J = $.assets.length, H = $.warnings.length, se = `Exported ${J} asset${J !== 1 ? "s" : ""}${H > 0 ? ` (${H} warning${H !== 1 ? "s" : ""})` : ""}`;
          r.showToast(se, H > 0 ? "info" : "success");
        }
        B(!0), j(null), Y(null), setTimeout(() => {
          var J;
          try {
            const H = Ot({
              extraction: w,
              exportResult: $,
              projectPath: ((J = t == null ? void 0 : t.project) == null ? void 0 : J.path) ?? ".",
              fileName: (d == null ? void 0 : d.name) ?? "Untitled",
              figmaUrl: n,
              rootNodes: w.extraction.rootNodes
            });
            j(H), B(!1), W.current && Qt(W.current, $.assetsDir, H.markdown).catch((se) => {
              console.error("Brief save failed:", se);
            }), r && r.showToast(
              `Brief ready: ${H.stats.nodeCount} layers, ${H.stats.assetCount} assets, ~${Math.round(H.stats.estimatedTokens / 1e3)}K tokens`,
              "success"
            );
          } catch (H) {
            Y((H == null ? void 0 : H.message) || "Brief generation failed"), B(!1);
          }
        }, 0);
      } catch ($) {
        r && r.showToast(`Asset export failed: ${($ == null ? void 0 : $.message) || "Unknown error"}`, "error");
      } finally {
        p(!1), I(null);
      }
    }
  }, [e, s, t, r, d, n]), Me = E(
    (w) => {
      const S = w.target.value;
      if (o(S), !S.trim()) {
        a(null), g(null), m(null), x(!1), M(null), A(null), h(!1), z(!1), V.current = null, U(null), p(!1), I(null), j(null), B(!1), Y(null);
        return;
      }
      const k = qe(S);
      if (!k) {
        a(null), g(null), m("Please paste a valid Figma URL (file, design, proto, or board link)"), x(!1);
        return;
      }
      a(k), m(null), g(null), M(null), A(null), h(!1), z(!1), V.current = null, U(null), p(!1), I(null), j(null), B(!1), Y(null);
    },
    []
  );
  ne(() => {
    if (!s || !W.current) return;
    const w = ++oe.current, S = W.current;
    x(!0), g(null), m(null), (async () => {
      try {
        const k = await Ge(S, e, s.fileKey);
        oe.current === w && (g(k), x(!1));
      } catch (k) {
        if (oe.current === w) {
          const $ = (k == null ? void 0 : k.message) || "Failed to validate file access.";
          $.includes("403") || $.includes("Invalid or expired") ? m("Cannot access this file. Check that your token has File content (Read) scope.") : $.includes("404") || $.includes("not found") ? m("File not found. Check that the URL is correct.") : $.includes("429") || $.includes("Rate limited") ? m("Rate limited by Figma. Please wait a moment and try again.") : m($), x(!1);
        }
      }
    })();
  }, [s, e]);
  const Fe = E(() => {
    const w = W.current;
    if (!w || !s) return;
    const S = ++Q.current;
    L(!0), M(null), m(null), A(null), h(!1), V.current = null, U(null), p(!1), I(null), j(null), B(!1), Y(null), (async () => {
      try {
        const k = await gt({
          shell: w,
          token: e,
          fileKey: s.fileKey,
          nodeId: s.nodeId,
          scope: u
        });
        if (Q.current !== S) return;
        if (k.largeTreeWarning) {
          V.current = k, A(k.largeTreeWarning), h(!0), L(!1);
          return;
        }
        M(k.extraction), r && r.showToast(`Extracted ${k.extraction.nodeCount} layers`, "success"), ee(k);
      } catch (k) {
        if (Q.current !== S) return;
        const $ = (k == null ? void 0 : k.message) || "Extraction failed.";
        $.includes("403") || $.includes("Invalid or expired") ? m("Cannot access this file. Check that your token has File content (Read) scope.") : $.includes("404") || $.includes("not found") ? m("File not found. Check that the URL is correct.") : $.includes("429") || $.includes("Rate limited") ? m("Rate limited by Figma. Please wait a moment and try again.") : $.includes("timeout") || $.includes("timed out") ? m("Request timed out. Try a smaller selection or check your connection.") : m($);
      } finally {
        Q.current === S && L(!1);
      }
    })();
  }, [s, e, u, r, ee]), He = E(() => {
    const w = V.current;
    w && (h(!1), A(null), M(w.extraction), V.current = null, r && r.showToast(`Extracted ${w.extraction.nodeCount} layers`, "success"), ee(w));
  }, [r, ee]), Ue = E(() => {
    h(!1), A(null), V.current = null;
  }, []), Be = E(async () => {
    if (!(!F || !W.current))
      try {
        await en(W.current, F.markdown), r && r.showToast("Brief copied to clipboard", "success");
      } catch (w) {
        r && r.showToast(`Copy failed: ${(w == null ? void 0 : w.message) || "Unknown error"}`, "error");
      }
  }, [F, r]), _e = !s || !d || v || b || c || D;
  return /* @__PURE__ */ y("div", { children: [
    /* @__PURE__ */ y("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ f("label", { className: "figma-plugin-label", children: "Figma URL" }),
      /* @__PURE__ */ f(
        "input",
        {
          className: "figma-plugin-input",
          type: "text",
          placeholder: "https://www.figma.com/design/...",
          value: n,
          onChange: Me
        }
      ),
      N && /* @__PURE__ */ f("div", { className: "figma-plugin-error", children: N })
    ] }),
    s && /* @__PURE__ */ f("div", { className: "figma-plugin-section", children: /* @__PURE__ */ y("div", { className: "figma-plugin-file-info", children: [
      v && /* @__PURE__ */ y("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: d ? "8px" : "0" }, children: [
        /* @__PURE__ */ f("span", { className: "figma-plugin-spinner" }),
        /* @__PURE__ */ f("span", { style: { color: "var(--text-secondary)" }, children: "Checking access..." })
      ] }),
      d && /* @__PURE__ */ y("div", { style: { marginBottom: "8px" }, children: [
        /* @__PURE__ */ f("div", { style: { fontWeight: 600, fontSize: "13px", marginBottom: "4px" }, children: d.name }),
        /* @__PURE__ */ y("div", { style: { color: "var(--text-secondary)" }, children: [
          d.pages.length,
          " page",
          d.pages.length !== 1 ? "s" : ""
        ] })
      ] }),
      !v && /* @__PURE__ */ y("div", { style: { color: "var(--text-muted)", lineHeight: 1.6 }, children: [
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
    s && d && !v && /* @__PURE__ */ f("div", { className: "figma-plugin-section", children: /* @__PURE__ */ f("div", { style: { color: "var(--text-secondary)", fontSize: "12px" }, children: s.nodeId ? "Will extract the selected element" : "Will extract the whole page — select a specific element in Figma to narrow scope" }) }),
    l && _ && /* @__PURE__ */ f("div", { className: "figma-plugin-section", children: /* @__PURE__ */ y("div", { className: "figma-plugin-warning", children: [
      /* @__PURE__ */ y("strong", { children: [
        _.nodeCount,
        " layers detected"
      ] }),
      /* @__PURE__ */ f("p", { children: "Large selections may take longer and produce verbose output. Continue?" }),
      /* @__PURE__ */ y("div", { className: "figma-plugin-warning-actions", children: [
        /* @__PURE__ */ f("button", { className: "btn-primary", onClick: He, children: "Continue" }),
        /* @__PURE__ */ f("button", { className: "btn-secondary", onClick: Ue, children: "Cancel" })
      ] })
    ] }) }),
    ye && /* @__PURE__ */ f("div", { className: "figma-plugin-section", children: /* @__PURE__ */ f("div", { className: "figma-plugin-error", children: ye }) }),
    F && O && q && R && /* @__PURE__ */ f("div", { className: "figma-plugin-section", children: /* @__PURE__ */ y("div", { className: "figma-plugin-file-info", children: [
      /* @__PURE__ */ y("div", { style: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }, children: [
        /* @__PURE__ */ f("span", { style: { color: "#38a169" }, children: "✓" }),
        /* @__PURE__ */ f("span", { style: { fontWeight: 600, fontSize: "13px" }, children: "Brief ready" }),
        O.truncated && /* @__PURE__ */ f("span", { style: { color: "#f59e0b", fontSize: "11px" }, children: "(truncated)" })
      ] }),
      /* @__PURE__ */ f(
        "button",
        {
          className: "btn-primary",
          onClick: Be,
          style: { width: "100%", marginBottom: "12px" },
          children: "Copy Brief to Clipboard"
        }
      ),
      /* @__PURE__ */ y("div", { style: { color: "var(--text-secondary)", fontSize: "12px", lineHeight: 1.6 }, children: [
        F.stats.nodeCount,
        " layers ·",
        " ",
        F.stats.assetCount,
        " assets ·",
        " ",
        /* @__PURE__ */ y("span", { style: {
          color: F.stats.estimatedTokens > ve ? "#f59e0b" : "inherit"
        }, children: [
          "~",
          Math.round(F.stats.estimatedTokens / 1e3),
          "K tokens"
        ] })
      ] }),
      (() => {
        const w = R.assets.filter((S) => S.assetType === "composition").length;
        return w > 0 ? /* @__PURE__ */ y("div", { style: { marginTop: "8px", fontSize: "12px", color: "#f59e0b" }, children: [
          w,
          " composition",
          w !== 1 ? "s" : "",
          " exported as PNG"
        ] }) : null;
      })(),
      F.stats.estimatedTokens > ve && /* @__PURE__ */ y("div", { className: "figma-plugin-warning", style: { marginTop: "8px" }, children: [
        /* @__PURE__ */ f("strong", { children: "This brief is large" }),
        /* @__PURE__ */ f("p", { children: "Consider extracting a smaller section for better results." })
      ] }),
      q.components.length > 0 && /* @__PURE__ */ y("div", { style: { marginTop: "10px" }, children: [
        /* @__PURE__ */ f("div", { style: { color: "var(--text-muted)", fontSize: "11px", marginBottom: "4px" }, children: "Components" }),
        /* @__PURE__ */ y("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px" }, children: [
          q.components.slice(0, 8).map((w) => /* @__PURE__ */ y(
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
                w.name,
                w.count > 1 ? ` x${w.count}` : ""
              ]
            },
            w.name
          )),
          q.components.length > 8 && /* @__PURE__ */ y("span", { style: { fontSize: "11px", color: "var(--text-muted)", padding: "2px 4px" }, children: [
            "+",
            q.components.length - 8,
            " more"
          ] })
        ] })
      ] }),
      R.warnings.length > 0 && /* @__PURE__ */ y("div", { style: { marginTop: "8px", fontSize: "11px", color: "#f59e0b" }, children: [
        R.warnings.length,
        " warning",
        R.warnings.length !== 1 ? "s" : "",
        ":",
        /* @__PURE__ */ y("ul", { style: { margin: "4px 0 0 16px", padding: 0 }, children: [
          R.warnings.slice(0, 5).map((w, S) => /* @__PURE__ */ f("li", { children: String(w) }, S)),
          R.warnings.length > 5 && /* @__PURE__ */ y("li", { children: [
            "...and ",
            R.warnings.length - 5,
            " more"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ f(
        "button",
        {
          onClick: () => z(!P),
          style: {
            background: "none",
            border: "none",
            color: "var(--accent, #0d99ff)",
            fontSize: "11px",
            cursor: "pointer",
            padding: "4px 0",
            marginTop: "8px"
          },
          children: P ? "Hide tree" : "Show tree preview"
        }
      ),
      P && /* @__PURE__ */ f("div", { style: { marginTop: "6px", padding: "8px", background: "var(--bg-primary)", borderRadius: "4px", border: "1px solid var(--border)", maxHeight: "200px", overflowY: "auto" }, children: /* @__PURE__ */ f(Oe, { nodes: O.rootNodes }) }),
      /* @__PURE__ */ f("div", { style: { color: "var(--text-muted)", fontSize: "11px", marginTop: "8px", textAlign: "center" }, children: "Also saved to .shipstudio/assets/brief.md" })
    ] }) }),
    (() => {
      const w = b || c || D, S = b ? "Extracting layout..." : c ? (C == null ? void 0 : C.phase) === "preview" ? "Rendering preview..." : `Exporting assets${C != null && C.total ? ` (${C.current ?? 0}/${C.total})` : ""}...` : D ? "Generating brief..." : F ? "Get New Brief" : "Get Brief";
      return /* @__PURE__ */ y(
        "button",
        {
          className: F && !w ? "btn-secondary" : "btn-primary",
          onClick: Fe,
          disabled: _e,
          style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
          children: [
            w && /* @__PURE__ */ f("span", { className: "figma-plugin-spinner", style: { width: "14px", height: "14px", borderWidth: "2px" } }),
            S
          ]
        }
      );
    })()
  ] });
}
function rn({ onClick: e }) {
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
function on() {
  const e = re(), t = (e == null ? void 0 : e.storage) ?? null, i = (e == null ? void 0 : e.actions) ?? null, [r, n] = T(!1), [o, s] = T(null), [a, u] = T(null), [d, g] = T(!1), [v, x] = T("main");
  ne(() => {
    if (!t) return;
    let l = !1;
    return (async () => {
      try {
        const h = await t.read();
        !l && typeof h.figmaToken == "string" && (s(h.figmaToken), typeof h.figmaUserHandle == "string" && u({ id: "", handle: h.figmaUserHandle, img_url: "" }));
      } catch (h) {
        console.error("[figma] Failed to read storage:", h);
      } finally {
        l || g(!0);
      }
    })(), () => {
      l = !0;
    };
  }, [t]);
  const N = E(() => n(!0), []), m = E(() => {
    n(!1), x("main");
  }, []), b = E(async (l, h) => {
    if (!(!t || !i))
      try {
        const P = await t.read();
        await t.write({ ...P, figmaToken: l, figmaUserHandle: h.handle }), s(l), u(h), x("main"), i.showToast(`Connected as ${h.handle}`, "success");
      } catch {
        i.showToast("Failed to save token. Please try again.", "error");
      }
  }, [t, i]), L = E(async (l, h) => {
    if (!(!t || !i))
      try {
        const P = await t.read();
        await t.write({ ...P, figmaToken: l, figmaUserHandle: h.handle }), s(l), u(h), x("main"), i.showToast(`Token updated — connected as ${h.handle}`, "success");
      } catch {
        i.showToast("Failed to save token. Please try again.", "error");
      }
  }, [t, i]), O = E(async () => {
    if (!(!t || !i))
      try {
        const l = await t.read(), { figmaToken: h, figmaUserHandle: P, ...z } = l;
        await t.write(z), s(null), u(null), x("main"), i.showToast("Disconnected from Figma", "info");
      } catch {
        i.showToast("Failed to remove token. Please try again.", "error");
      }
  }, [t, i]), M = "Figma", _ = o ? /* @__PURE__ */ f(rn, { onClick: () => x("settings") }) : void 0;
  let A = null;
  return d && (o ? v === "settings" && a ? A = /* @__PURE__ */ f(
    Ye,
    {
      currentUser: a,
      onTokenUpdated: L,
      onTokenRemoved: O,
      onBack: () => x("main")
    }
  ) : A = /* @__PURE__ */ f(nn, { token: o }) : A = /* @__PURE__ */ f(Ze, { onTokenSaved: b })), /* @__PURE__ */ y(pe, { children: [
    /* @__PURE__ */ f(
      "button",
      {
        onClick: N,
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
      De,
      {
        open: r,
        onClose: m,
        title: M,
        headerRight: _,
        children: A
      }
    )
  ] });
}
const ln = "Figma", cn = {
  toolbar: on
};
function un() {
  console.log("[figma] Plugin activated");
}
function dn() {
  console.log("[figma] Plugin deactivated");
}
export {
  ln as name,
  un as onActivate,
  dn as onDeactivate,
  cn as slots
};
