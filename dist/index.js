import { jsx as l, jsxs as d, Fragment as ne } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export const jsx=R.createElement;export const jsxs=R.createElement;export const Fragment=R.Fragment;";
import { useEffect as J, useCallback as L, useState as C, useMemo as be, useRef as q } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export default R;export const{useState,useEffect,useCallback,useRef,useMemo,useContext,createContext,createElement,Fragment}=R;";
const re = window;
function Z() {
  const t = re.__SHIPSTUDIO_REACT__, n = re.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__;
  return n && (t != null && t.useContext) ? t.useContext(n) : null;
}
const ee = "figma-plugin-styles", Ne = `
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
function ke({ open: t, onClose: n, title: o, headerRight: e, children: i }) {
  J(() => {
    if (!t) return;
    let s = document.getElementById(ee);
    return s || (s = document.createElement("style"), s.id = ee, s.textContent = Ne, document.head.appendChild(s)), () => {
      const c = document.getElementById(ee);
      c && c.remove();
    };
  }, [t]), J(() => {
    if (!t) return;
    const s = (c) => {
      c.key === "Escape" && n();
    };
    return document.addEventListener("keydown", s), () => document.removeEventListener("keydown", s);
  }, [t, n]);
  const r = L(
    (s) => {
      s.target === s.currentTarget && n();
    },
    [n]
  );
  return t ? /* @__PURE__ */ l("div", { className: "figma-plugin-overlay", onClick: r, children: /* @__PURE__ */ d("div", { className: "figma-plugin-modal", children: [
    /* @__PURE__ */ d("div", { className: "figma-plugin-modal-header", children: [
      /* @__PURE__ */ d(
        "svg",
        {
          width: "16",
          height: "16",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          children: [
            /* @__PURE__ */ l("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1" }),
            /* @__PURE__ */ l("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1" }),
            /* @__PURE__ */ l("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1" }),
            /* @__PURE__ */ l("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1" })
          ]
        }
      ),
      /* @__PURE__ */ l("span", { className: "figma-plugin-modal-title", children: o }),
      e && /* @__PURE__ */ l("div", { style: { marginLeft: "auto", display: "flex", alignItems: "center" }, children: e })
    ] }),
    /* @__PURE__ */ l("div", { className: "figma-plugin-modal-body", children: i })
  ] }) }) : null;
}
const Ce = "https://api.figma.com/v1";
async function j(t, n, o, e) {
  const i = `${Ce}${n}`, r = Math.ceil(((e == null ? void 0 : e.timeout) ?? 3e4) / 1e3), s = [
    "-sS",
    "--max-time",
    String(r),
    "-H",
    `X-Figma-Token: ${o}`,
    i
  ], c = await t.exec("curl", s, {
    timeout: (e == null ? void 0 : e.timeout) ?? 12e4
  });
  if (c.exit_code !== 0)
    throw new Error(`Figma API request failed: ${c.stderr || `exit code ${c.exit_code}`}`);
  if (!c.stdout.trim())
    throw new Error("Empty response from Figma API");
  let u;
  try {
    u = JSON.parse(c.stdout);
  } catch {
    throw new Error(`Invalid JSON from Figma API: ${c.stdout.slice(0, 200)}`);
  }
  if (u.status && u.err)
    throw u.status === 429 ? new Error("Rate limited by Figma API. Try again in a moment.") : u.status === 403 ? new Error("Invalid or expired token. Please update your Figma token.") : u.status === 404 ? new Error("File not found. Check that the URL is correct and you have access.") : new Error(`Figma API error: ${u.err}`);
  return u;
}
async function le(t, n) {
  return j(t, "/me", n);
}
async function Ie(t, n, o) {
  const e = await j(t, `/files/${o}?depth=1`, n);
  return {
    name: e.name,
    pages: e.document.children.filter((i) => i.type === "CANVAS").map((i) => ({ id: i.id, name: i.name }))
  };
}
async function Te(t, n, o, e) {
  const i = await j(
    t,
    `/files/${o}/nodes?ids=${encodeURIComponent(e)}`,
    n,
    { timeout: 12e4 }
  ), r = i.nodes[e];
  if (!r) {
    const s = Object.keys(i.nodes), c = s.find(
      (u) => u.replace(/%3A/g, ":") === e || u === e.replace(/:/g, "%3A")
    );
    if (c)
      return {
        rootNode: i.nodes[c].document,
        components: i.nodes[c].components,
        styles: i.nodes[c].styles ?? {}
      };
    throw new Error(
      `Node "${e}" not found in API response. Available nodes: ${s.join(", ")}`
    );
  }
  return {
    rootNode: r.document,
    components: r.components,
    styles: r.styles ?? {}
  };
}
async function Ae(t, n, o) {
  const e = await j(
    t,
    `/files/${o}`,
    n,
    { timeout: 12e4 }
  );
  return {
    rootNodes: e.document.children,
    components: e.components,
    styles: e.styles ?? {}
  };
}
async function ae(t, n, o, e, i = "png", r) {
  const s = e.map((f) => encodeURIComponent(f)).join(",");
  let c = `/images/${o}?ids=${s}&format=${i}`;
  return r != null && (c += `&scale=${r}`), i === "svg" && (c += "&svg_outline_text=true&svg_include_id=true&svg_simplify_stroke=true"), (await j(
    t,
    c,
    n,
    { timeout: 12e4 }
  )).images;
}
async function Re(t, n, o) {
  return (await j(
    t,
    `/files/${o}/images`,
    n,
    { timeout: 12e4 }
  )).meta.images;
}
function Se({ onTokenSaved: t }) {
  const n = Z(), o = (n == null ? void 0 : n.shell) ?? null, [e, i] = C(""), [r, s] = C(!1), [c, u] = C(null), f = L(async () => {
    if (!o) return;
    const x = e.trim();
    if (!(!x || r)) {
      s(!0), u(null);
      try {
        const v = await le(o, x);
        t(x, v);
      } catch (v) {
        u((v == null ? void 0 : v.message) || "Failed to validate token. Please check and try again.");
      } finally {
        s(!1);
      }
    }
  }, [e, r, o, t]), y = L(
    (x) => {
      x.key === "Enter" && f();
    },
    [f]
  );
  return /* @__PURE__ */ d("div", { children: [
    /* @__PURE__ */ d("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ l("h3", { style: { fontSize: "14px", fontWeight: 600, margin: "0 0 8px 0" }, children: "Connect to Figma" }),
      /* @__PURE__ */ d("p", { style: { fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 16px 0", lineHeight: 1.5 }, children: [
        "To get started, you need a Figma Personal Access Token.",
        " ",
        /* @__PURE__ */ l(
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
    /* @__PURE__ */ d("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ l("label", { className: "figma-plugin-label", children: "Personal Access Token" }),
      /* @__PURE__ */ l(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: e,
          onChange: (x) => i(x.target.value),
          onKeyDown: y,
          disabled: r
        }
      ),
      c && /* @__PURE__ */ l("div", { className: "figma-plugin-error", children: c }),
      /* @__PURE__ */ l("div", { className: "figma-plugin-hint", children: "Token is stored locally in this project only." })
    ] }),
    /* @__PURE__ */ l(
      "button",
      {
        className: "btn-primary",
        onClick: f,
        disabled: !e.trim() || r,
        style: { width: "100%", marginTop: "4px" },
        children: r ? /* @__PURE__ */ d(ne, { children: [
          /* @__PURE__ */ l("span", { className: "figma-plugin-spinner", style: { marginRight: "8px", verticalAlign: "middle" } }),
          "Connecting..."
        ] }) : "Connect"
      }
    )
  ] });
}
function Ee({ currentUser: t, onTokenUpdated: n, onTokenRemoved: o, onBack: e }) {
  const i = Z(), r = (i == null ? void 0 : i.shell) ?? null, [s, c] = C(""), [u, f] = C(!1), [y, x] = C(null), v = L(async () => {
    if (!r) return;
    const R = s.trim();
    if (!(!R || u)) {
      f(!0), x(null);
      try {
        const w = await le(r, R);
        n(R, w);
      } catch (w) {
        x((w == null ? void 0 : w.message) || "Failed to validate token. Please check and try again.");
      } finally {
        f(!1);
      }
    }
  }, [s, u, r, n]), b = L(
    (R) => {
      R.key === "Enter" && v();
    },
    [v]
  );
  return /* @__PURE__ */ d("div", { children: [
    /* @__PURE__ */ d(
      "button",
      {
        onClick: e,
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
          /* @__PURE__ */ l("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ l("polyline", { points: "15 18 9 12 15 6" }) }),
          "Back"
        ]
      }
    ),
    /* @__PURE__ */ l("div", { className: "figma-plugin-section", children: /* @__PURE__ */ d("div", { className: "figma-plugin-success", style: { display: "flex", alignItems: "center", gap: "6px", marginTop: "0" }, children: [
      /* @__PURE__ */ l("span", { style: { fontSize: "10px" }, children: "●" }),
      "Connected as ",
      t.handle
    ] }) }),
    /* @__PURE__ */ d("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ l("label", { className: "figma-plugin-label", children: "Update Token" }),
      /* @__PURE__ */ l(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: s,
          onChange: (R) => c(R.target.value),
          onKeyDown: b,
          disabled: u
        }
      ),
      y && /* @__PURE__ */ l("div", { className: "figma-plugin-error", children: y }),
      /* @__PURE__ */ l(
        "button",
        {
          className: "btn-primary",
          onClick: v,
          disabled: !s.trim() || u,
          style: { width: "100%", marginTop: "8px" },
          children: u ? /* @__PURE__ */ d(ne, { children: [
            /* @__PURE__ */ l("span", { className: "figma-plugin-spinner", style: { marginRight: "8px", verticalAlign: "middle" } }),
            "Validating..."
          ] }) : "Update"
        }
      )
    ] }),
    /* @__PURE__ */ l("div", { className: "figma-plugin-section", style: { borderTop: "1px solid var(--border)", paddingTop: "16px" }, children: /* @__PURE__ */ l(
      "button",
      {
        className: "btn-secondary",
        onClick: o,
        style: { width: "100%" },
        children: "Disconnect"
      }
    ) })
  ] });
}
function $e(t) {
  const n = t.match(
    /figma\.com\/(file|design|proto|board)\/([A-Za-z0-9]+)/
  );
  if (!n) return null;
  const o = n[1], e = n[2];
  let i = null;
  const r = t.match(/[?&]node-id=([^&]+)/);
  return r && (i = decodeURIComponent(r[1]).replace(/-/g, ":")), { fileKey: e, nodeId: i, fileType: o };
}
function Le(t) {
  switch (t) {
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
function Pe(t) {
  switch (t) {
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
function Fe(t) {
  const n = {
    flexDirection: t.layoutMode === "HORIZONTAL" ? "row" : "column",
    justifyContent: Le(t.primaryAxisAlignItems),
    alignItems: Pe(t.counterAxisAlignItems),
    gap: t.itemSpacing ?? 0,
    padding: {
      top: t.paddingTop ?? 0,
      right: t.paddingRight ?? 0,
      bottom: t.paddingBottom ?? 0,
      left: t.paddingLeft ?? 0
    },
    flexWrap: t.layoutWrap === "WRAP" ? "wrap" : "nowrap"
  };
  return t.layoutWrap === "WRAP" && (n.rowGap = t.counterAxisSpacing ?? 0), n;
}
function Oe(t, n) {
  const o = n[t.componentId];
  let e;
  if (t.componentProperties) {
    const r = {};
    for (const [s, c] of Object.entries(t.componentProperties))
      (c.type === "VARIANT" || c.type === "BOOLEAN" || c.type === "TEXT") && (r[s] = c.value);
    Object.keys(r).length > 0 && (e = r);
  }
  const i = {
    componentId: t.componentId,
    componentName: (o == null ? void 0 : o.name) ?? t.name,
    isRemote: (o == null ? void 0 : o.remote) ?? !1,
    source: o != null && o.remote ? "library" : "local"
  };
  return o != null && o.description && (i.description = o.description), e && (i.variantProperties = e), t.overrides && (i.overrides = t.overrides), i;
}
function ce(t, n, o) {
  const e = t;
  if (e.type === "SLICE") return null;
  const i = {
    id: e.id,
    name: e.name,
    type: e.type,
    visible: e.visible !== !1
    // defaults to true when undefined
  };
  switch (e.absoluteBoundingBox != null ? (i.width = e.absoluteBoundingBox.width, i.height = e.absoluteBoundingBox.height) : e.size != null && (i.width = e.size.x, i.height = e.size.y), "layoutSizingHorizontal" in e && (i.widthMode = e.layoutSizingHorizontal), "layoutSizingVertical" in e && (i.heightMode = e.layoutSizingVertical), "layoutPositioning" in e && e.layoutPositioning != null && (i.positioning = e.layoutPositioning), "layoutMode" in e && e.layoutMode && e.layoutMode !== "NONE" && (i.autoLayout = Fe(e)), "constraints" in e && e.constraints != null && (i.constraints = e.constraints), "minWidth" in e && e.minWidth != null && (i.minWidth = e.minWidth), "maxWidth" in e && e.maxWidth != null && (i.maxWidth = e.maxWidth), "minHeight" in e && e.minHeight != null && (i.minHeight = e.minHeight), "maxHeight" in e && e.maxHeight != null && (i.maxHeight = e.maxHeight), "preserveRatio" in e && e.preserveRatio != null && (i.preserveRatio = e.preserveRatio), "fills" in e && Array.isArray(e.fills) && (i.fills = e.fills), "strokes" in e && Array.isArray(e.strokes) && (i.strokes = e.strokes), "strokeWeight" in e && e.strokeWeight != null && (i.strokeWeight = e.strokeWeight), "effects" in e && Array.isArray(e.effects) && (i.effects = e.effects), "cornerRadius" in e && e.cornerRadius != null && (i.cornerRadius = e.cornerRadius), "rectangleCornerRadii" in e && Array.isArray(e.rectangleCornerRadii) && (i.rectangleCornerRadii = e.rectangleCornerRadii), "opacity" in e && e.opacity != null && e.opacity !== 1 && (i.opacity = e.opacity), "styles" in e && e.styles && (i.styleRefs = e.styles), e.type) {
    case "TEXT":
      i.textContent = e.characters, e.style && (i.textStyle = e.style), e.styleOverrideTable && Object.keys(e.styleOverrideTable).length > 0 && (i.textStyleOverrides = e.styleOverrideTable);
      break;
    case "INSTANCE":
      return i.componentRef = Oe(e, n), i;
    case "BOOLEAN_OPERATION":
      return i;
  }
  if ("children" in e && Array.isArray(e.children)) {
    const r = e.children.map((s) => ce(s, n)).filter((s) => s !== null);
    i.children = Ue(r);
  }
  return i;
}
function ie(t) {
  let n = 1;
  if (t.children && Array.isArray(t.children))
    for (const o of t.children)
      n += ie(o);
  return n;
}
function ze(t) {
  const n = t.componentRef, o = n.variantProperties ? JSON.stringify(n.variantProperties, Object.keys(n.variantProperties).sort()) : "";
  return `${n.componentId}::${o}`;
}
function Ue(t) {
  if (t.length === 0) return [];
  const n = /* @__PURE__ */ new Map();
  for (let i = 0; i < t.length; i++) {
    const r = t[i];
    if (r.componentRef) {
      const s = ze(r), c = n.get(s);
      c ? (c.count++, c.indices.push(i)) : n.set(s, { node: r, count: 1, indices: [i] });
    }
  }
  const o = /* @__PURE__ */ new Set();
  for (const i of n.values())
    if (i.count >= 3) {
      i.node.repeatCount = i.count;
      for (let r = 1; r < i.indices.length; r++)
        o.add(i.indices[r]);
    }
  const e = [];
  for (let i = 0; i < t.length; i++)
    o.has(i) || e.push(t[i]);
  return e;
}
function _e(t, n) {
  let o = 0;
  for (const i of t)
    o += ie(i);
  return {
    rootNodes: t.map((i) => ce(i, n)).filter((i) => i !== null),
    nodeCount: o,
    truncated: !1
  };
}
function V(t) {
  const n = Math.round(t.r * 255), o = Math.round(t.g * 255), e = Math.round(t.b * 255);
  if (t.a >= 1)
    return `#${n.toString(16).padStart(2, "0")}${o.toString(16).padStart(2, "0")}${e.toString(16).padStart(2, "0")}`;
  const i = parseFloat(t.a.toFixed(2));
  return `rgba(${n}, ${o}, ${e}, ${i})`;
}
function Me(t) {
  const n = t.gradientStops.map((o) => `${V(o.color)} ${Math.round(o.position * 100)}%`).join(", ");
  switch (t.type) {
    case "GRADIENT_LINEAR": {
      const [o, e] = t.gradientHandlePositions, i = e.x - o.x, r = e.y - o.y, s = Math.atan2(r, i);
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
function We(t, n) {
  const o = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), u = [], f = /* @__PURE__ */ new Map();
  let y = 0, x = 0, v = 0;
  function b(a) {
    var m, $, B;
    if (a.fills && Array.isArray(a.fills)) {
      const h = He(a, n);
      for (const g of a.fills)
        if (g.visible !== !1)
          if (g.type === "SOLID") {
            const N = { ...g.color };
            g.opacity != null && g.opacity !== 1 && (N.a = N.a * g.opacity);
            const T = V(N);
            te(o, T, a.id, "fill", h);
          } else if ((m = g.type) != null && m.startsWith("GRADIENT_")) {
            const N = Me(g), T = N, S = e.get(T);
            S ? (S.usageCount++, S.nodeIds.push(a.id)) : (v++, e.set(T, {
              value: N,
              name: h ?? `gradient-${v}`,
              gradientType: g.type,
              usageCount: 1,
              nodeIds: [a.id]
            }));
          } else g.type === "IMAGE" && u.push({
            imageRef: g.imageRef,
            scaleMode: g.scaleMode,
            nodeId: a.id,
            nodeName: a.name
          });
    }
    if (a.strokes && Array.isArray(a.strokes)) {
      const h = Be(a, n);
      for (const g of a.strokes)
        if (g.visible !== !1 && g.type === "SOLID") {
          const N = { ...g.color };
          g.opacity != null && g.opacity !== 1 && (N.a = N.a * g.opacity);
          const T = V(N);
          te(o, T, a.id, "stroke", h);
        }
    }
    if (a.effects && Array.isArray(a.effects)) {
      const h = je(a, n);
      for (const g of a.effects)
        if (g.visible === !0 && (g.type === "DROP_SHADOW" || g.type === "INNER_SHADOW")) {
          const N = g.type === "DROP_SHADOW" ? "drop-shadow" : "inner-shadow", T = V(g.color), S = (($ = g.offset) == null ? void 0 : $.x) ?? 0, E = ((B = g.offset) == null ? void 0 : B.y) ?? 0, M = g.radius ?? 0, O = g.spread ?? 0, W = `${N}|${T}|${S}|${E}|${M}|${O}`, D = c.get(W);
          D ? (D.usageCount++, D.nodeIds.push(a.id)) : (x++, c.set(W, {
            type: N,
            color: T,
            offsetX: S,
            offsetY: E,
            blur: M,
            spread: O,
            name: h ?? `shadow-${x}`,
            usageCount: 1,
            nodeIds: [a.id]
          })), te(o, T, a.id, "shadow", null);
        }
    }
    if (a.type === "TEXT" && a.textStyle) {
      const h = Ge(a, n);
      if (se(i, a.textStyle, a.id, h), a.textStyleOverrides && typeof a.textStyleOverrides == "object")
        for (const g of Object.values(a.textStyleOverrides))
          se(i, g, a.id, null);
    }
    if (a.autoLayout) {
      const h = a.autoLayout;
      h.padding && (G(r, h.padding.top, "padding-top"), G(r, h.padding.right, "padding-right"), G(r, h.padding.bottom, "padding-bottom"), G(r, h.padding.left, "padding-left")), G(r, h.gap, "gap"), h.rowGap != null && G(r, h.rowGap, "row-gap");
    }
    if (a.cornerRadius != null || a.rectangleCornerRadii != null || De(a)) {
      const h = a.rectangleCornerRadii ? null : a.cornerRadius ?? null, g = a.rectangleCornerRadii ?? null;
      let N = null, T = null;
      if (a.strokes && Array.isArray(a.strokes)) {
        const M = a.strokes.find(
          (O) => O.visible !== !1 && O.type === "SOLID"
        );
        M && (N = V(M.color), T = a.strokeWeight ?? null);
      }
      const S = `${h}|${JSON.stringify(g)}|${N}|${T}`, E = s.get(S);
      E ? (E.usageCount++, E.nodeIds.push(a.id)) : (y++, s.set(S, {
        radius: h,
        cornerRadii: g,
        strokeColor: N,
        strokeWeight: T,
        name: `border-${y}`,
        usageCount: 1,
        nodeIds: [a.id]
      }));
    }
    if (a.componentRef) {
      const h = a.componentRef, g = `${h.componentName}::${JSON.stringify(h.variantProperties ?? {})}`, N = f.get(g), T = a.repeatCount ?? 1;
      if (N)
        N.usageCount += T;
      else {
        const S = {
          componentName: h.componentName,
          source: h.source,
          usageCount: T
        };
        h.description && (S.description = h.description), h.variantProperties && (S.variantProperties = h.variantProperties), f.set(g, S);
      }
    }
    if (a.children)
      for (const h of a.children)
        b(h);
  }
  for (const a of t)
    b(a);
  const R = Array.from(o.values()).map((a) => ({
    value: a.value,
    name: a.name,
    usageCount: a.usageCount,
    nodeIds: a.nodeIds,
    source: Array.from(a.source)
  }));
  R.sort((a, m) => m.usageCount - a.usageCount);
  const w = Array.from(e.values());
  w.sort((a, m) => m.usageCount - a.usageCount);
  const z = Array.from(i.values());
  z.sort((a, m) => m.usageCount - a.usageCount);
  const U = Array.from(r.values());
  U.sort((a, m) => a.value - m.value);
  const P = Array.from(s.values());
  P.sort((a, m) => m.usageCount - a.usageCount);
  const _ = Array.from(c.values());
  _.sort((a, m) => m.usageCount - a.usageCount);
  const p = Array.from(f.values());
  return p.sort((a, m) => m.usageCount - a.usageCount), {
    colors: R,
    gradients: w,
    typography: z,
    spacing: U,
    borders: P,
    shadows: _,
    imageFills: u,
    components: p
  };
}
function te(t, n, o, e, i) {
  const r = t.get(n);
  if (r)
    r.usageCount++, r.nodeIds.includes(o) || r.nodeIds.push(o), r.source.add(e), i && r.name.startsWith("color-") && (r.name = i);
  else {
    const s = `color-${n.replace(/^#/, "").replace(/[^a-f0-9]/gi, "")}`;
    t.set(n, {
      value: n,
      name: i ?? s,
      usageCount: 1,
      nodeIds: [o],
      source: /* @__PURE__ */ new Set([e])
    });
  }
}
function se(t, n, o, e) {
  const i = n.fontFamily ?? "Unknown", r = n.fontSize ?? 16, s = n.fontWeight ?? 400, c = n.lineHeightPx ?? null, u = n.letterSpacing ?? 0, f = `${i}|${r}|${s}|${c}|${u}`, y = t.get(f);
  if (y)
    y.usageCount++, y.nodeIds.includes(o) || y.nodeIds.push(o), e && y.name.startsWith(i) && (y.name = e);
  else {
    const x = `${i}-${r}-${s}`;
    t.set(f, {
      fontFamily: i,
      fontSize: r,
      fontWeight: s,
      lineHeight: c,
      letterSpacing: u,
      name: e ?? x,
      usageCount: 1,
      nodeIds: [o]
    });
  }
}
function G(t, n, o) {
  if (n === 0) return;
  const e = t.get(n);
  e ? (e.usageCount++, e.sources.includes(o) || e.sources.push(o)) : t.set(n, {
    value: n,
    usageCount: 1,
    sources: [o]
  });
}
function De(t) {
  return !t.strokes || !Array.isArray(t.strokes) ? !1 : t.strokes.some((n) => n.visible !== !1 && n.type === "SOLID");
}
function He(t, n) {
  var e, i;
  const o = (e = t.styleRefs) == null ? void 0 : e.fill;
  return o ? ((i = n[o]) == null ? void 0 : i.name) ?? null : null;
}
function Be(t, n) {
  var e, i;
  const o = (e = t.styleRefs) == null ? void 0 : e.stroke;
  return o ? ((i = n[o]) == null ? void 0 : i.name) ?? null : null;
}
function Ge(t, n) {
  var e, i;
  const o = (e = t.styleRefs) == null ? void 0 : e.text;
  return o ? ((i = n[o]) == null ? void 0 : i.name) ?? null : null;
}
function je(t, n) {
  var e, i;
  const o = (e = t.styleRefs) == null ? void 0 : e.effect;
  return o ? ((i = n[o]) == null ? void 0 : i.name) ?? null : null;
}
const Ve = 500, Ke = 2e3;
async function Xe(t) {
  const { shell: n, token: o, fileKey: e, nodeId: i, scope: r } = t;
  let s, c, u;
  if (r === "node" || r === "frame") {
    if (!i)
      throw new Error(
        `Cannot extract ${r}: no node ID found in the URL. Paste a Figma URL that includes a node-id, or switch to "Entire Page" scope.`
      );
    const b = await Te(n, o, e, i);
    s = [b.rootNode], c = b.components, u = b.styles;
  } else {
    const b = await Ae(n, o, e), R = b.rootNodes[0];
    s = (R == null ? void 0 : R.children) || [], c = b.components, u = b.styles;
  }
  let f = 0;
  for (const b of s)
    f += ie(b);
  let y;
  f > Ve && (y = {
    nodeCount: f,
    message: `This selection has ~${f} nodes. Large extractions may produce verbose output.`
  });
  const x = _e(s, c);
  f > Ke && (x.truncated = !0);
  const v = We(x.rootNodes, u);
  return { extraction: x, tokens: v, fileKey: e, largeTreeWarning: y };
}
function H(t) {
  return t.toLowerCase().replace(/[/\s]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "") || "unnamed";
}
function Ye(t) {
  const n = /* @__PURE__ */ new Map();
  return t.map((o) => {
    const e = n.get(o.filename) ?? 0;
    if (n.set(o.filename, e + 1), e === 0)
      return { ...o };
    const i = o.filename.lastIndexOf(".");
    if (i === -1)
      return { ...o, filename: `${o.filename}-${e + 1}` };
    const r = o.filename.slice(0, i), s = o.filename.slice(i);
    return { ...o, filename: `${r}-${e + 1}${s}` };
  });
}
const de = /* @__PURE__ */ new Set([
  "VECTOR",
  "BOOLEAN_OPERATION",
  "LINE",
  "STAR",
  "POLYGON",
  "ELLIPSE"
]), qe = /* @__PURE__ */ new Set(["FRAME", "GROUP", "SECTION"]);
function ue(t) {
  var n;
  return ((n = t.fills) == null ? void 0 : n.some((o) => o.type === "IMAGE")) ?? !1;
}
function fe(t) {
  var o;
  const n = (o = t.fills) == null ? void 0 : o.find((e) => e.type === "IMAGE");
  return n == null ? void 0 : n.imageRef;
}
function Je(t, n, o, e) {
  if (t.type === "INSTANCE") {
    e.push({
      nodeId: t.id,
      nodeName: t.name,
      exportType: "svg",
      filename: H(t.name) + ".svg"
    });
    return;
  }
  if (ue(t)) {
    const i = n.get(t.id) ?? fe(t);
    n.has(t.id) && o.add(t.id), e.push({
      nodeId: t.id,
      nodeName: t.name,
      exportType: "png-fill",
      filename: H(t.name) + ".png",
      imageRef: i
    });
    return;
  }
  if (t.type === "RECTANGLE") {
    e.push({
      nodeId: t.id,
      nodeName: t.name,
      exportType: "svg",
      filename: H(t.name) + ".svg"
    });
    return;
  }
  if (de.has(t.type)) {
    e.push({
      nodeId: t.id,
      nodeName: t.name,
      exportType: "svg",
      filename: H(t.name) + ".svg"
    });
    return;
  }
  if (qe.has(t.type) && t.children)
    for (const i of t.children)
      Ze(i, n, o, e);
}
function Ze(t, n, o, e) {
  if (t.type === "INSTANCE") {
    e.push({
      nodeId: t.id,
      nodeName: t.name,
      exportType: "svg",
      filename: H(t.name) + ".svg"
    });
    return;
  }
  if (ue(t)) {
    const i = n.get(t.id) ?? fe(t);
    n.has(t.id) && o.add(t.id), e.push({
      nodeId: t.id,
      nodeName: t.name,
      exportType: "png-fill",
      filename: H(t.name) + ".png",
      imageRef: i
    });
    return;
  }
  if (t.type === "RECTANGLE") {
    e.push({
      nodeId: t.id,
      nodeName: t.name,
      exportType: "svg",
      filename: H(t.name) + ".svg"
    });
    return;
  }
  if (de.has(t.type)) {
    e.push({
      nodeId: t.id,
      nodeName: t.name,
      exportType: "svg",
      filename: H(t.name) + ".svg"
    });
    return;
  }
}
function Qe(t, n) {
  const o = /* @__PURE__ */ new Map();
  for (const r of n)
    o.set(r.nodeId, r.imageRef);
  const e = [], i = /* @__PURE__ */ new Set();
  for (const r of t)
    if (r.children)
      for (const s of r.children)
        Je(s, o, i, e);
  for (const r of n)
    i.has(r.nodeId) || e.push({
      nodeId: r.nodeId,
      nodeName: r.nodeName,
      exportType: "png-fill",
      filename: H(r.nodeName) + ".png",
      imageRef: r.imageRef
    });
  return Ye(e);
}
async function et(t, n) {
  const o = `${n}/.shipstudio/assets`;
  return await t.exec("rm", ["-rf", o]), await t.exec("mkdir", ["-p", o]), o;
}
async function pe(t, n, o) {
  const e = ["-sS", "-o", o, "--max-time", "30", "-L", n];
  if ((await t.exec("curl", e, { timeout: 35e3 })).exit_code === 0) return { success: !0 };
  const r = await t.exec("curl", e, { timeout: 35e3 });
  return r.exit_code === 0 ? { success: !0 } : {
    success: !1,
    error: r.stderr || `curl exit code ${r.exit_code}`
  };
}
async function tt(t, n, o, e) {
  const i = [], r = [];
  for (let s = 0; s < o.length; s++) {
    const { filename: c, url: u } = o[s], f = `${n}/${c}`;
    e && e({
      current: s + 1,
      total: o.length,
      currentAsset: c,
      phase: "assets"
    });
    const y = await pe(t, u, f);
    y.success ? i.push({ filename: c, path: f }) : r.push(`Failed to download ${c}: ${y.error}`);
  }
  return { downloaded: i, warnings: r };
}
async function nt(t) {
  const { shell: n, token: o, fileKey: e, selectedNodeId: i, rootNodes: r, imageFills: s, projectPath: c, onProgress: u } = t, f = [], y = await et(n, c), x = Qe(r, s);
  u && u({ current: 0, total: x.length + 1, currentAsset: "preview.png", phase: "preview" });
  let v = `${y}/preview.png`;
  try {
    const a = (await ae(n, o, e, [i], "png", 2))[i];
    if (a) {
      const m = await pe(n, a, v);
      m.success || (f.push(`Preview download failed: ${m.error}`), v = "");
    } else
      f.push("Figma could not render preview for this node"), v = "";
  } catch (p) {
    f.push(`Preview render failed: ${(p == null ? void 0 : p.message) || "Unknown error"}`), v = "";
  }
  const b = x.filter((p) => p.exportType === "svg");
  let R = {};
  if (b.length > 0)
    try {
      R = await ae(n, o, e, b.map((p) => p.nodeId), "svg");
    } catch (p) {
      f.push(`SVG render API failed: ${(p == null ? void 0 : p.message) || "Unknown error"}`);
    }
  const w = x.filter((p) => p.exportType === "png-fill");
  let z = {};
  if (w.length > 0)
    try {
      z = await Re(n, o, e);
    } catch (p) {
      f.push(`Image fills API failed: ${(p == null ? void 0 : p.message) || "Unknown error"}`);
    }
  const U = [];
  for (const p of b) {
    const a = R[p.nodeId];
    a ? U.push({ filename: p.filename, url: a }) : f.push(`No render URL for ${p.filename} (node ${p.nodeId})`);
  }
  for (const p of w)
    p.imageRef && z[p.imageRef] ? U.push({ filename: p.filename, url: z[p.imageRef] }) : f.push(`No download URL for image fill ${p.filename} (ref: ${p.imageRef})`);
  const { downloaded: P, warnings: _ } = await tt(
    n,
    y,
    U,
    u
  );
  return f.push(..._), {
    previewPath: v,
    assets: P,
    warnings: f
  };
}
function it(t) {
  const n = { frames: 0, autoLayoutFrames: 0, components: [], textNodes: 0, hiddenNodes: 0 }, o = /* @__PURE__ */ new Map();
  function e(i) {
    if (i.visible || n.hiddenNodes++, (i.type === "FRAME" || i.type === "GROUP" || i.type === "SECTION") && (n.frames++, i.autoLayout && n.autoLayoutFrames++), i.type === "TEXT" && n.textNodes++, i.componentRef) {
      const r = i.componentRef.componentName, s = i.repeatCount ?? 1;
      o.set(r, (o.get(r) ?? 0) + s);
    }
    i.children && i.children.forEach(e);
  }
  return t.forEach(e), n.components = Array.from(o.entries()).map(([i, r]) => ({ name: i, count: r })).sort((i, r) => r.count - i.count), n;
}
function ge({ nodes: t, depth: n = 0, maxDepth: o = 2 }) {
  return n >= o ? null : /* @__PURE__ */ l("div", { style: { paddingLeft: n > 0 ? "12px" : "0", borderLeft: n > 0 ? "1px solid var(--border)" : "none" }, children: t.map((e, i) => {
    const r = e.componentRef ? `<${e.componentRef.componentName}${e.repeatCount ? ` x${e.repeatCount}` : ""}>` : e.type === "TEXT" ? `"${(e.textContent ?? "").slice(0, 30)}${(e.textContent ?? "").length > 30 ? "..." : ""}"` : e.name, s = e.autoLayout ? `${e.autoLayout.flexDirection}` : e.type === "INSTANCE" ? "component" : e.type.toLowerCase();
    return /* @__PURE__ */ d("div", { style: { fontSize: "11px", lineHeight: 1.7 }, children: [
      /* @__PURE__ */ d("span", { style: { color: "var(--text-muted)" }, children: [
        s,
        " "
      ] }),
      /* @__PURE__ */ l("span", { style: { color: e.visible === !1 ? "var(--text-muted)" : "var(--text-primary)" }, children: r }),
      e.visible === !1 && /* @__PURE__ */ l("span", { style: { color: "var(--text-muted)", marginLeft: "4px" }, children: "(hidden)" }),
      e.children && e.children.length > 0 && n + 1 < o && /* @__PURE__ */ l(ge, { nodes: e.children, depth: n + 1, maxDepth: o }),
      e.children && e.children.length > 0 && n + 1 >= o && /* @__PURE__ */ d("span", { style: { color: "var(--text-muted)", fontSize: "11px", marginLeft: "12px" }, children: [
        "(",
        e.children.length,
        " children)"
      ] })
    ] }, e.id || i);
  }) });
}
function ot({ token: t }) {
  const n = Z(), o = (n == null ? void 0 : n.shell) ?? null, e = (n == null ? void 0 : n.actions) ?? null, [i, r] = C(""), [s, c] = C(null), [u, f] = C("page"), [y, x] = C(null), [v, b] = C(!1), [R, w] = C(null), [z, U] = C(!1), [P, _] = C(null), [p, a] = C(null), [m, $] = C(!1), [B, h] = C(!1), [g, N] = C(!1), [T, S] = C(null), [E, M] = C(null), O = be(
    () => P ? it(P.rootNodes) : null,
    [P]
  ), W = q(null), D = q(o);
  D.current = o;
  const Q = q(0), K = q(0), X = L(async (I) => {
    var F, A;
    if (!(!D.current || !((F = n == null ? void 0 : n.project) != null && F.path) || !s)) {
      N(!0), S(null), M(null);
      try {
        const k = await nt({
          shell: D.current,
          token: t,
          fileKey: I.fileKey,
          selectedNodeId: s.nodeId || ((A = I.extraction.rootNodes[0]) == null ? void 0 : A.id) || "0:0",
          rootNodes: I.extraction.rootNodes,
          imageFills: I.tokens.imageFills,
          projectPath: n.project.path,
          onProgress: S
        });
        if (M(k), e) {
          const oe = k.assets.length, Y = k.warnings.length, we = `Exported ${oe} asset${oe !== 1 ? "s" : ""}${Y > 0 ? ` (${Y} warning${Y !== 1 ? "s" : ""})` : ""}`;
          e.showToast(we, Y > 0 ? "info" : "success");
        }
      } catch (k) {
        e && e.showToast(`Asset export failed: ${(k == null ? void 0 : k.message) || "Unknown error"}`, "error");
      } finally {
        N(!1), S(null);
      }
    }
  }, [t, s, n, e]), me = L(
    (I) => {
      const F = I.target.value;
      if (r(F), !F.trim()) {
        c(null), x(null), w(null), b(!1), _(null), a(null), $(!1), h(!1), W.current = null, M(null), N(!1), S(null);
        return;
      }
      const A = $e(F);
      if (!A) {
        c(null), x(null), w("Please paste a valid Figma URL (file, design, proto, or board link)"), b(!1);
        return;
      }
      c(A), w(null), x(null), _(null), a(null), $(!1), h(!1), W.current = null, M(null), N(!1), S(null), A.nodeId ? f("node") : f("page");
    },
    []
  );
  J(() => {
    if (!s || !D.current) return;
    const I = ++Q.current, F = D.current;
    b(!0), x(null), w(null), (async () => {
      try {
        const A = await Ie(F, t, s.fileKey);
        Q.current === I && (x(A), b(!1));
      } catch (A) {
        if (Q.current === I) {
          const k = (A == null ? void 0 : A.message) || "Failed to validate file access.";
          k.includes("403") || k.includes("Invalid or expired") ? w("Cannot access this file. Check that your token has File content (Read) scope.") : k.includes("404") || k.includes("not found") ? w("File not found. Check that the URL is correct.") : k.includes("429") || k.includes("Rate limited") ? w("Rate limited by Figma. Please wait a moment and try again.") : w(k), b(!1);
        }
      }
    })();
  }, [s, t]);
  const he = L(() => {
    const I = D.current;
    if (!I || !s) return;
    const F = ++K.current;
    U(!0), _(null), w(null), a(null), $(!1), W.current = null, M(null), N(!1), S(null), (async () => {
      try {
        const A = await Xe({
          shell: I,
          token: t,
          fileKey: s.fileKey,
          nodeId: s.nodeId,
          scope: u
        });
        if (K.current !== F) return;
        if (A.largeTreeWarning) {
          W.current = A, a(A.largeTreeWarning), $(!0), U(!1);
          return;
        }
        _(A.extraction), e && e.showToast(`Extracted ${A.extraction.nodeCount} nodes`, "success"), X(A);
      } catch (A) {
        if (K.current !== F) return;
        const k = (A == null ? void 0 : A.message) || "Extraction failed.";
        k.includes("403") || k.includes("Invalid or expired") ? w("Cannot access this file. Check that your token has File content (Read) scope.") : k.includes("404") || k.includes("not found") ? w("File not found. Check that the URL is correct.") : k.includes("429") || k.includes("Rate limited") ? w("Rate limited by Figma. Please wait a moment and try again.") : k.includes("timeout") || k.includes("timed out") ? w("Request timed out. Try a smaller selection or check your connection.") : w(k);
      } finally {
        K.current === F && U(!1);
      }
    })();
  }, [s, t, u, e, X]), ye = L(() => {
    const I = W.current;
    I && ($(!1), a(null), _(I.extraction), W.current = null, e && e.showToast(`Extracted ${I.extraction.nodeCount} nodes`, "success"), X(I));
  }, [e, X]), xe = L(() => {
    $(!1), a(null), W.current = null;
  }, []), ve = !s || !y || v || z || g;
  return /* @__PURE__ */ d("div", { children: [
    /* @__PURE__ */ d("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ l("label", { className: "figma-plugin-label", children: "Figma URL" }),
      /* @__PURE__ */ l(
        "input",
        {
          className: "figma-plugin-input",
          type: "text",
          placeholder: "https://www.figma.com/design/...",
          value: i,
          onChange: me
        }
      ),
      R && /* @__PURE__ */ l("div", { className: "figma-plugin-error", children: R })
    ] }),
    s && /* @__PURE__ */ l("div", { className: "figma-plugin-section", children: /* @__PURE__ */ d("div", { className: "figma-plugin-file-info", children: [
      v && /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: y ? "8px" : "0" }, children: [
        /* @__PURE__ */ l("span", { className: "figma-plugin-spinner" }),
        /* @__PURE__ */ l("span", { style: { color: "var(--text-secondary)" }, children: "Checking access..." })
      ] }),
      y && /* @__PURE__ */ d("div", { style: { marginBottom: "8px" }, children: [
        /* @__PURE__ */ l("div", { style: { fontWeight: 600, fontSize: "13px", marginBottom: "4px" }, children: y.name }),
        /* @__PURE__ */ d("div", { style: { color: "var(--text-secondary)" }, children: [
          y.pages.length,
          " page",
          y.pages.length !== 1 ? "s" : ""
        ] })
      ] }),
      !v && /* @__PURE__ */ d("div", { style: { color: "var(--text-muted)", lineHeight: 1.6 }, children: [
        /* @__PURE__ */ d("div", { children: [
          "File key: ",
          s.fileKey
        ] }),
        /* @__PURE__ */ d("div", { children: [
          "Node: ",
          s.nodeId || "None (file-level)"
        ] }),
        /* @__PURE__ */ d("div", { children: [
          "Type: ",
          s.fileType
        ] })
      ] })
    ] }) }),
    s && /* @__PURE__ */ d("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ l("label", { className: "figma-plugin-label", children: "Extraction Scope" }),
      /* @__PURE__ */ d("div", { className: "figma-plugin-radio-group", children: [
        /* @__PURE__ */ d("label", { className: "figma-plugin-radio-label", style: s.nodeId ? void 0 : { opacity: 0.5, cursor: "not-allowed" }, children: [
          /* @__PURE__ */ l(
            "input",
            {
              type: "radio",
              name: "scope",
              value: "node",
              checked: u === "node",
              onChange: () => f("node"),
              disabled: !s.nodeId
            }
          ),
          "Single Node",
          !s.nodeId && /* @__PURE__ */ l("span", { className: "figma-plugin-hint", style: { marginTop: 0, marginLeft: "4px" }, children: "Paste a URL with a node-id to use this option" })
        ] }),
        /* @__PURE__ */ d("label", { className: "figma-plugin-radio-label", children: [
          /* @__PURE__ */ l(
            "input",
            {
              type: "radio",
              name: "scope",
              value: "frame",
              checked: u === "frame",
              onChange: () => f("frame")
            }
          ),
          "Frame"
        ] }),
        /* @__PURE__ */ d("label", { className: "figma-plugin-radio-label", children: [
          /* @__PURE__ */ l(
            "input",
            {
              type: "radio",
              name: "scope",
              value: "page",
              checked: u === "page",
              onChange: () => f("page")
            }
          ),
          "Entire Page"
        ] })
      ] })
    ] }),
    z && /* @__PURE__ */ l("div", { className: "figma-plugin-section", children: /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
      /* @__PURE__ */ l("span", { className: "figma-plugin-spinner" }),
      /* @__PURE__ */ l("span", { style: { color: "var(--text-secondary)" }, children: "Extracting layout..." })
    ] }) }),
    m && p && /* @__PURE__ */ l("div", { className: "figma-plugin-section", children: /* @__PURE__ */ d("div", { className: "figma-plugin-warning", children: [
      /* @__PURE__ */ d("strong", { children: [
        p.nodeCount,
        " nodes detected"
      ] }),
      /* @__PURE__ */ l("p", { children: "Large selections may take longer and produce verbose output. Continue?" }),
      /* @__PURE__ */ d("div", { className: "figma-plugin-warning-actions", children: [
        /* @__PURE__ */ l("button", { className: "btn-primary", onClick: ye, children: "Continue" }),
        /* @__PURE__ */ l("button", { className: "btn-secondary", onClick: xe, children: "Cancel" })
      ] })
    ] }) }),
    P && O && /* @__PURE__ */ l("div", { className: "figma-plugin-section", children: /* @__PURE__ */ d("div", { className: "figma-plugin-file-info", children: [
      /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }, children: [
        /* @__PURE__ */ l("span", { style: { color: "#38a169" }, children: "✓" }),
        /* @__PURE__ */ l("span", { style: { fontWeight: 600, fontSize: "13px" }, children: "Layout extracted" }),
        P.truncated && /* @__PURE__ */ l("span", { style: { color: "#f59e0b", fontSize: "11px" }, children: "(truncated)" })
      ] }),
      /* @__PURE__ */ d("div", { style: { color: "var(--text-secondary)", fontSize: "12px", lineHeight: 1.6 }, children: [
        P.nodeCount,
        " nodes · ",
        O.autoLayoutFrames,
        " auto-layout frames · ",
        O.textNodes,
        " text layers"
      ] }),
      O.components.length > 0 && /* @__PURE__ */ d("div", { style: { marginTop: "8px" }, children: [
        /* @__PURE__ */ l("div", { style: { color: "var(--text-muted)", fontSize: "11px", marginBottom: "4px" }, children: "Components" }),
        /* @__PURE__ */ d("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px" }, children: [
          O.components.slice(0, 8).map((I) => /* @__PURE__ */ d(
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
                I.name,
                I.count > 1 ? ` x${I.count}` : ""
              ]
            },
            I.name
          )),
          O.components.length > 8 && /* @__PURE__ */ d("span", { style: { fontSize: "11px", color: "var(--text-muted)", padding: "2px 4px" }, children: [
            "+",
            O.components.length - 8,
            " more"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ l(
        "button",
        {
          onClick: () => h(!B),
          style: {
            background: "none",
            border: "none",
            color: "var(--accent, #0d99ff)",
            fontSize: "11px",
            cursor: "pointer",
            padding: "4px 0",
            marginTop: "8px"
          },
          children: B ? "Hide tree" : "Show tree preview"
        }
      ),
      B && /* @__PURE__ */ l("div", { style: { marginTop: "6px", padding: "8px", background: "var(--bg-primary)", borderRadius: "4px", border: "1px solid var(--border)", maxHeight: "200px", overflowY: "auto" }, children: /* @__PURE__ */ l(ge, { nodes: P.rootNodes }) })
    ] }) }),
    g && T && /* @__PURE__ */ l("div", { className: "figma-plugin-section", children: /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
      /* @__PURE__ */ l("span", { className: "figma-plugin-spinner" }),
      /* @__PURE__ */ l("span", { style: { color: "var(--text-secondary)" }, children: T.phase === "preview" ? "Rendering preview..." : `Downloading ${T.currentAsset} (${T.current}/${T.total})...` })
    ] }) }),
    E && /* @__PURE__ */ l("div", { className: "figma-plugin-section", children: /* @__PURE__ */ d("div", { className: "figma-plugin-file-info", children: [
      /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }, children: [
        /* @__PURE__ */ l("span", { style: { color: "#38a169" }, children: "✓" }),
        /* @__PURE__ */ l("span", { style: { fontWeight: 600, fontSize: "13px" }, children: "Assets exported" })
      ] }),
      /* @__PURE__ */ d("div", { style: { color: "var(--text-secondary)", fontSize: "12px", lineHeight: 1.6 }, children: [
        E.previewPath ? "Preview + " : "",
        E.assets.length,
        " asset",
        E.assets.length !== 1 ? "s" : "",
        " saved to .shipstudio/assets/"
      ] }),
      E.warnings.length > 0 && /* @__PURE__ */ d("div", { style: { marginTop: "6px", fontSize: "11px", color: "#f59e0b" }, children: [
        E.warnings.length,
        " warning",
        E.warnings.length !== 1 ? "s" : "",
        ":",
        /* @__PURE__ */ d("ul", { style: { margin: "4px 0 0 16px", padding: 0 }, children: [
          E.warnings.slice(0, 5).map((I, F) => /* @__PURE__ */ l("li", { children: I }, F)),
          E.warnings.length > 5 && /* @__PURE__ */ d("li", { children: [
            "...and ",
            E.warnings.length - 5,
            " more"
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ l(
      "button",
      {
        className: "btn-primary",
        onClick: he,
        disabled: ve,
        style: { width: "100%" },
        children: z ? "Extracting..." : g ? "Exporting assets..." : "Extract Design Brief"
      }
    )
  ] });
}
function rt({ onClick: t }) {
  return /* @__PURE__ */ l(
    "button",
    {
      onClick: t,
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
      children: /* @__PURE__ */ d(
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
            /* @__PURE__ */ l("circle", { cx: "12", cy: "12", r: "3" }),
            /* @__PURE__ */ l("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" })
          ]
        }
      )
    }
  );
}
function at() {
  const t = Z(), n = (t == null ? void 0 : t.storage) ?? null, o = (t == null ? void 0 : t.actions) ?? null, [e, i] = C(!1), [r, s] = C(null), [c, u] = C(null), [f, y] = C(!1), [x, v] = C("main");
  J(() => {
    if (!n) return;
    let a = !1;
    return (async () => {
      try {
        const m = await n.read();
        !a && typeof m.figmaToken == "string" && (s(m.figmaToken), typeof m.figmaUserHandle == "string" && u({ id: "", handle: m.figmaUserHandle, img_url: "" }));
      } catch (m) {
        console.error("[figma] Failed to read storage:", m);
      } finally {
        a || y(!0);
      }
    })(), () => {
      a = !0;
    };
  }, [n]);
  const b = L(() => i(!0), []), R = L(() => {
    i(!1), v("main");
  }, []), w = L(async (a, m) => {
    if (!(!n || !o))
      try {
        const $ = await n.read();
        await n.write({ ...$, figmaToken: a, figmaUserHandle: m.handle }), s(a), u(m), v("main"), o.showToast(`Connected as ${m.handle}`, "success");
      } catch {
        o.showToast("Failed to save token. Please try again.", "error");
      }
  }, [n, o]), z = L(async (a, m) => {
    if (!(!n || !o))
      try {
        const $ = await n.read();
        await n.write({ ...$, figmaToken: a, figmaUserHandle: m.handle }), s(a), u(m), v("main"), o.showToast(`Token updated — connected as ${m.handle}`, "success");
      } catch {
        o.showToast("Failed to save token. Please try again.", "error");
      }
  }, [n, o]), U = L(async () => {
    if (!(!n || !o))
      try {
        const a = await n.read(), { figmaToken: m, figmaUserHandle: $, ...B } = a;
        await n.write(B), s(null), u(null), v("main"), o.showToast("Disconnected from Figma", "info");
      } catch {
        o.showToast("Failed to remove token. Please try again.", "error");
      }
  }, [n, o]), P = "Figma", _ = r ? /* @__PURE__ */ l(rt, { onClick: () => v("settings") }) : void 0;
  let p = null;
  return f && (r ? x === "settings" && c ? p = /* @__PURE__ */ l(
    Ee,
    {
      currentUser: c,
      onTokenUpdated: z,
      onTokenRemoved: U,
      onBack: () => v("main")
    }
  ) : p = /* @__PURE__ */ l(ot, { token: r }) : p = /* @__PURE__ */ l(Se, { onTokenSaved: w })), /* @__PURE__ */ d(ne, { children: [
    /* @__PURE__ */ l(
      "button",
      {
        onClick: b,
        title: "Figma Design Brief",
        className: "toolbar-icon-btn",
        children: /* @__PURE__ */ d(
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
              /* @__PURE__ */ l("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1" }),
              /* @__PURE__ */ l("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1" }),
              /* @__PURE__ */ l("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1" }),
              /* @__PURE__ */ l("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1" })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ l(
      ke,
      {
        open: e,
        onClose: R,
        title: P,
        headerRight: _,
        children: p
      }
    )
  ] });
}
const ct = "Figma", dt = {
  toolbar: at
};
function ut() {
  console.log("[figma] Plugin activated");
}
function ft() {
  console.log("[figma] Plugin deactivated");
}
export {
  ct as name,
  ut as onActivate,
  ft as onDeactivate,
  dt as slots
};
