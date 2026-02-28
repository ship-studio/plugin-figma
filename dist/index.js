import { jsx as u, jsxs as g, Fragment as ue } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export const jsx=R.createElement;export const jsxs=R.createElement;export const Fragment=R.Fragment;";
import { useEffect as ne, useCallback as E, useState as C, useMemo as Fe, useRef as te } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export default R;export const{useState,useEffect,useCallback,useRef,useMemo,useContext,createContext,createElement,Fragment}=R;";
const pe = window;
function ie() {
  const e = pe.__SHIPSTUDIO_REACT__, n = pe.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__;
  return n && (e != null && e.useContext) ? e.useContext(n) : null;
}
const re = "figma-plugin-styles", Me = `
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
function Oe({ open: e, onClose: n, title: i, headerRight: t, children: o }) {
  ne(() => {
    if (!e) return;
    let s = document.getElementById(re);
    return s || (s = document.createElement("style"), s.id = re, s.textContent = Me, document.head.appendChild(s)), () => {
      const l = document.getElementById(re);
      l && l.remove();
    };
  }, [e]), ne(() => {
    if (!e) return;
    const s = (l) => {
      l.key === "Escape" && n();
    };
    return document.addEventListener("keydown", s), () => document.removeEventListener("keydown", s);
  }, [e, n]);
  const r = E(
    (s) => {
      s.target === s.currentTarget && n();
    },
    [n]
  );
  return e ? /* @__PURE__ */ u("div", { className: "figma-plugin-overlay", onClick: r, children: /* @__PURE__ */ g("div", { className: "figma-plugin-modal", children: [
    /* @__PURE__ */ g("div", { className: "figma-plugin-modal-header", children: [
      /* @__PURE__ */ g(
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
            /* @__PURE__ */ u("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1" }),
            /* @__PURE__ */ u("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1" }),
            /* @__PURE__ */ u("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1" }),
            /* @__PURE__ */ u("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1" })
          ]
        }
      ),
      /* @__PURE__ */ u("span", { className: "figma-plugin-modal-title", children: i }),
      t && /* @__PURE__ */ u("div", { style: { marginLeft: "auto", display: "flex", alignItems: "center" }, children: t })
    ] }),
    /* @__PURE__ */ u("div", { className: "figma-plugin-modal-body", children: o })
  ] }) }) : null;
}
const Ue = "https://api.figma.com/v1";
async function Y(e, n, i, t) {
  const o = `${Ue}${n}`, r = Math.ceil(((t == null ? void 0 : t.timeout) ?? 3e4) / 1e3), s = [
    "-sS",
    "--max-time",
    String(r),
    "-H",
    `X-Figma-Token: ${i}`,
    o
  ], l = await e.exec("curl", s, {
    timeout: (t == null ? void 0 : t.timeout) ?? 12e4
  });
  if (l.exit_code !== 0)
    throw new Error(`Figma API request failed: ${l.stderr || `exit code ${l.exit_code}`}`);
  if (!l.stdout.trim())
    throw new Error("Empty response from Figma API");
  let d;
  try {
    d = JSON.parse(l.stdout);
  } catch {
    throw new Error(`Invalid JSON from Figma API: ${l.stdout.slice(0, 200)}`);
  }
  if (d.status && d.err)
    throw d.status === 429 ? new Error("Rate limited by Figma API. Try again in a moment.") : d.status === 403 ? new Error("Invalid or expired token. Please update your Figma token.") : d.status === 404 ? new Error("File not found. Check that the URL is correct and you have access.") : new Error(`Figma API error: ${d.err}`);
  return d;
}
async function he(e, n) {
  return Y(e, "/me", n);
}
async function _e(e, n, i) {
  const t = await Y(e, `/files/${i}?depth=1`, n);
  return {
    name: t.name,
    pages: t.document.children.filter((o) => o.type === "CANVAS").map((o) => ({ id: o.id, name: o.name }))
  };
}
async function We(e, n, i, t) {
  const o = await Y(
    e,
    `/files/${i}/nodes?ids=${encodeURIComponent(t)}`,
    n,
    { timeout: 12e4 }
  ), r = o.nodes[t];
  if (!r) {
    const s = Object.keys(o.nodes), l = s.find(
      (d) => d.replace(/%3A/g, ":") === t || d === t.replace(/:/g, "%3A")
    );
    if (l)
      return {
        rootNode: o.nodes[l].document,
        components: o.nodes[l].components,
        styles: o.nodes[l].styles ?? {}
      };
    throw new Error(
      `Node "${t}" not found in API response. Available nodes: ${s.join(", ")}`
    );
  }
  return {
    rootNode: r.document,
    components: r.components,
    styles: r.styles ?? {}
  };
}
async function ze(e, n, i) {
  const t = await Y(
    e,
    `/files/${i}`,
    n,
    { timeout: 12e4 }
  );
  return {
    rootNodes: t.document.children,
    components: t.components,
    styles: t.styles ?? {}
  };
}
async function se(e, n, i, t, o = "png", r) {
  const s = t.map((f) => encodeURIComponent(f)).join(",");
  let l = `/images/${i}?ids=${s}&format=${o}`;
  return r != null && (l += `&scale=${r}`), o === "svg" && (l += "&svg_outline_text=true&svg_include_id=true&svg_simplify_stroke=true"), (await Y(
    e,
    l,
    n,
    { timeout: 12e4 }
  )).images;
}
async function Be(e, n, i) {
  return (await Y(
    e,
    `/files/${i}/images`,
    n,
    { timeout: 12e4 }
  )).meta.images;
}
function je({ onTokenSaved: e }) {
  const n = ie(), i = (n == null ? void 0 : n.shell) ?? null, [t, o] = C(""), [r, s] = C(!1), [l, d] = C(null), f = E(async () => {
    if (!i) return;
    const w = t.trim();
    if (!(!w || r)) {
      s(!0), d(null);
      try {
        const b = await he(i, w);
        e(w, b);
      } catch (b) {
        d((b == null ? void 0 : b.message) || "Failed to validate token. Please check and try again.");
      } finally {
        s(!1);
      }
    }
  }, [t, r, i, e]), x = E(
    (w) => {
      w.key === "Enter" && f();
    },
    [f]
  );
  return /* @__PURE__ */ g("div", { children: [
    /* @__PURE__ */ g("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ u("h3", { style: { fontSize: "14px", fontWeight: 600, margin: "0 0 8px 0" }, children: "Connect to Figma" }),
      /* @__PURE__ */ g("p", { style: { fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 16px 0", lineHeight: 1.5 }, children: [
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
    /* @__PURE__ */ g("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ u("label", { className: "figma-plugin-label", children: "Personal Access Token" }),
      /* @__PURE__ */ u(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: t,
          onChange: (w) => o(w.target.value),
          onKeyDown: x,
          disabled: r
        }
      ),
      l && /* @__PURE__ */ u("div", { className: "figma-plugin-error", children: l }),
      /* @__PURE__ */ u("div", { className: "figma-plugin-hint", children: "Token is stored locally in this project only." })
    ] }),
    /* @__PURE__ */ u(
      "button",
      {
        className: "btn-primary",
        onClick: f,
        disabled: !t.trim() || r,
        style: { width: "100%", marginTop: "4px" },
        children: r ? /* @__PURE__ */ g(ue, { children: [
          /* @__PURE__ */ u("span", { className: "figma-plugin-spinner", style: { marginRight: "8px", verticalAlign: "middle" } }),
          "Connecting..."
        ] }) : "Connect"
      }
    )
  ] });
}
function De({ currentUser: e, onTokenUpdated: n, onTokenRemoved: i, onBack: t }) {
  const o = ie(), r = (o == null ? void 0 : o.shell) ?? null, [s, l] = C(""), [d, f] = C(!1), [x, w] = C(null), b = E(async () => {
    if (!r) return;
    const h = s.trim();
    if (!(!h || d)) {
      f(!0), w(null);
      try {
        const S = await he(r, h);
        n(h, S);
      } catch (S) {
        w((S == null ? void 0 : S.message) || "Failed to validate token. Please check and try again.");
      } finally {
        f(!1);
      }
    }
  }, [s, d, r, n]), $ = E(
    (h) => {
      h.key === "Enter" && b();
    },
    [b]
  );
  return /* @__PURE__ */ g("div", { children: [
    /* @__PURE__ */ g(
      "button",
      {
        onClick: t,
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
    /* @__PURE__ */ u("div", { className: "figma-plugin-section", children: /* @__PURE__ */ g("div", { className: "figma-plugin-success", style: { display: "flex", alignItems: "center", gap: "6px", marginTop: "0" }, children: [
      /* @__PURE__ */ u("span", { style: { fontSize: "10px" }, children: "●" }),
      "Connected as ",
      e.handle
    ] }) }),
    /* @__PURE__ */ g("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ u("label", { className: "figma-plugin-label", children: "Update Token" }),
      /* @__PURE__ */ u(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: s,
          onChange: (h) => l(h.target.value),
          onKeyDown: $,
          disabled: d
        }
      ),
      x && /* @__PURE__ */ u("div", { className: "figma-plugin-error", children: x }),
      /* @__PURE__ */ u(
        "button",
        {
          className: "btn-primary",
          onClick: b,
          disabled: !s.trim() || d,
          style: { width: "100%", marginTop: "8px" },
          children: d ? /* @__PURE__ */ g(ue, { children: [
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
function He(e) {
  const n = e.match(
    /figma\.com\/(file|design|proto|board)\/([A-Za-z0-9]+)/
  );
  if (!n) return null;
  const i = n[1], t = n[2];
  let o = null;
  const r = e.match(/[?&]node-id=([^&]+)/);
  return r && (o = decodeURIComponent(r[1]).replace(/-/g, ":")), { fileKey: t, nodeId: o, fileType: i };
}
function Ge(e) {
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
function Ve(e) {
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
function Ke(e) {
  const n = {
    flexDirection: e.layoutMode === "HORIZONTAL" ? "row" : "column",
    justifyContent: Ge(e.primaryAxisAlignItems),
    alignItems: Ve(e.counterAxisAlignItems),
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
function Xe(e, n) {
  const i = n[e.componentId];
  let t;
  if (e.componentProperties) {
    const r = {};
    for (const [s, l] of Object.entries(e.componentProperties))
      (l.type === "VARIANT" || l.type === "BOOLEAN" || l.type === "TEXT") && (r[s] = l.value);
    Object.keys(r).length > 0 && (t = r);
  }
  const o = {
    componentId: e.componentId,
    componentName: (i == null ? void 0 : i.name) ?? e.name,
    isRemote: (i == null ? void 0 : i.remote) ?? !1,
    source: i != null && i.remote ? "library" : "local"
  };
  return i != null && i.description && (o.description = i.description), t && (o.variantProperties = t), e.overrides && (o.overrides = e.overrides), o;
}
function ye(e, n, i) {
  const t = e;
  if (t.type === "SLICE") return null;
  const o = {
    id: t.id,
    name: t.name,
    type: t.type,
    visible: t.visible !== !1
    // defaults to true when undefined
  };
  switch (t.absoluteBoundingBox != null ? (o.width = t.absoluteBoundingBox.width, o.height = t.absoluteBoundingBox.height) : t.size != null && (o.width = t.size.x, o.height = t.size.y), "layoutSizingHorizontal" in t && (o.widthMode = t.layoutSizingHorizontal), "layoutSizingVertical" in t && (o.heightMode = t.layoutSizingVertical), "layoutPositioning" in t && t.layoutPositioning != null && (o.positioning = t.layoutPositioning), "layoutMode" in t && t.layoutMode && t.layoutMode !== "NONE" && (o.autoLayout = Ke(t)), "constraints" in t && t.constraints != null && (o.constraints = t.constraints), "minWidth" in t && t.minWidth != null && (o.minWidth = t.minWidth), "maxWidth" in t && t.maxWidth != null && (o.maxWidth = t.maxWidth), "minHeight" in t && t.minHeight != null && (o.minHeight = t.minHeight), "maxHeight" in t && t.maxHeight != null && (o.maxHeight = t.maxHeight), "preserveRatio" in t && t.preserveRatio != null && (o.preserveRatio = t.preserveRatio), "fills" in t && Array.isArray(t.fills) && (o.fills = t.fills), "strokes" in t && Array.isArray(t.strokes) && (o.strokes = t.strokes), "strokeWeight" in t && t.strokeWeight != null && (o.strokeWeight = t.strokeWeight), "effects" in t && Array.isArray(t.effects) && (o.effects = t.effects), "cornerRadius" in t && t.cornerRadius != null && (o.cornerRadius = t.cornerRadius), "rectangleCornerRadii" in t && Array.isArray(t.rectangleCornerRadii) && (o.rectangleCornerRadii = t.rectangleCornerRadii), "opacity" in t && t.opacity != null && t.opacity !== 1 && (o.opacity = t.opacity), "blendMode" in t && t.blendMode && t.blendMode !== "PASS_THROUGH" && t.blendMode !== "NORMAL" && (o.blendMode = t.blendMode), "isMask" in t && t.isMask === !0 && (o.isMask = !0), "styles" in t && t.styles && (o.styleRefs = t.styles), t.type) {
    case "TEXT":
      o.textContent = t.characters, t.style && (o.textStyle = t.style), t.styleOverrideTable && Object.keys(t.styleOverrideTable).length > 0 && (o.textStyleOverrides = t.styleOverrideTable);
      break;
    case "INSTANCE":
      return o.componentRef = Xe(t, n), o;
    case "BOOLEAN_OPERATION":
      return o;
  }
  if ("children" in t && Array.isArray(t.children)) {
    const r = t.children.map((s) => ye(s, n)).filter((s) => s !== null);
    o.children = Ye(r);
  }
  return o;
}
function de(e) {
  let n = 1;
  if (e.children && Array.isArray(e.children))
    for (const i of e.children)
      n += de(i);
  return n;
}
function qe(e) {
  const n = e.componentRef, i = n.variantProperties ? JSON.stringify(n.variantProperties, Object.keys(n.variantProperties).sort()) : "";
  return `${n.componentId}::${i}`;
}
function Ye(e) {
  if (e.length === 0) return [];
  const n = /* @__PURE__ */ new Map();
  for (let o = 0; o < e.length; o++) {
    const r = e[o];
    if (r.componentRef) {
      const s = qe(r), l = n.get(s);
      l ? (l.count++, l.indices.push(o)) : n.set(s, { node: r, count: 1, indices: [o] });
    }
  }
  const i = /* @__PURE__ */ new Set();
  for (const o of n.values())
    if (o.count >= 3) {
      o.node.repeatCount = o.count;
      for (let r = 1; r < o.indices.length; r++)
        i.add(o.indices[r]);
    }
  const t = [];
  for (let o = 0; o < e.length; o++)
    i.has(o) || t.push(e[o]);
  return t;
}
function Je(e, n) {
  let i = 0;
  for (const o of e)
    i += de(o);
  return {
    rootNodes: e.map((o) => ye(o, n)).filter((o) => o !== null),
    nodeCount: i,
    truncated: !1
  };
}
function q(e) {
  const n = Math.round(e.r * 255), i = Math.round(e.g * 255), t = Math.round(e.b * 255);
  if (e.a >= 1)
    return `#${n.toString(16).padStart(2, "0")}${i.toString(16).padStart(2, "0")}${t.toString(16).padStart(2, "0")}`;
  const o = parseFloat(e.a.toFixed(2));
  return `rgba(${n}, ${i}, ${t}, ${o})`;
}
function Ze(e) {
  const n = e.gradientStops.map((i) => `${q(i.color)} ${Math.round(i.position * 100)}%`).join(", ");
  switch (e.type) {
    case "GRADIENT_LINEAR": {
      const [i, t] = e.gradientHandlePositions, o = t.x - i.x, r = t.y - i.y, s = Math.atan2(r, o);
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
function Qe(e, n) {
  const i = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), d = [], f = /* @__PURE__ */ new Map();
  let x = 0, w = 0, b = 0;
  function $(a) {
    var m, L, B;
    if (a.fills && Array.isArray(a.fills)) {
      const c = tt(a, n);
      for (const p of a.fills)
        if (p.visible !== !1)
          if (p.type === "SOLID") {
            const v = { ...p.color };
            p.opacity != null && p.opacity !== 1 && (v.a = v.a * p.opacity);
            const N = q(v);
            ae(i, N, a.id, "fill", c);
          } else if ((m = p.type) != null && m.startsWith("GRADIENT_")) {
            const v = Ze(p), N = v, k = t.get(N);
            k ? (k.usageCount++, k.nodeIds.push(a.id)) : (b++, t.set(N, {
              value: v,
              name: c ?? `gradient-${b}`,
              gradientType: p.type,
              usageCount: 1,
              nodeIds: [a.id]
            }));
          } else p.type === "IMAGE" && d.push({
            imageRef: p.imageRef,
            scaleMode: p.scaleMode,
            nodeId: a.id,
            nodeName: a.name
          });
    }
    if (a.strokes && Array.isArray(a.strokes)) {
      const c = nt(a, n);
      for (const p of a.strokes)
        if (p.visible !== !1 && p.type === "SOLID") {
          const v = { ...p.color };
          p.opacity != null && p.opacity !== 1 && (v.a = v.a * p.opacity);
          const N = q(v);
          ae(i, N, a.id, "stroke", c);
        }
    }
    if (a.effects && Array.isArray(a.effects)) {
      const c = ot(a, n);
      for (const p of a.effects)
        if (p.visible === !0 && (p.type === "DROP_SHADOW" || p.type === "INNER_SHADOW")) {
          const v = p.type === "DROP_SHADOW" ? "drop-shadow" : "inner-shadow", N = q(p.color), k = ((L = p.offset) == null ? void 0 : L.x) ?? 0, O = ((B = p.offset) == null ? void 0 : B.y) ?? 0, D = p.radius ?? 0, U = p.spread ?? 0, M = `${v}|${N}|${k}|${O}|${D}|${U}`, H = l.get(M);
          H ? (H.usageCount++, H.nodeIds.push(a.id)) : (w++, l.set(M, {
            type: v,
            color: N,
            offsetX: k,
            offsetY: O,
            blur: D,
            spread: U,
            name: c ?? `shadow-${w}`,
            usageCount: 1,
            nodeIds: [a.id]
          })), ae(i, N, a.id, "shadow", null);
        }
    }
    if (a.type === "TEXT" && a.textStyle) {
      const c = it(a, n);
      if (ge(o, a.textStyle, a.id, c), a.textStyleOverrides && typeof a.textStyleOverrides == "object")
        for (const p of Object.values(a.textStyleOverrides))
          ge(o, p, a.id, null);
    }
    if (a.autoLayout) {
      const c = a.autoLayout;
      c.padding && (K(r, c.padding.top, "padding-top"), K(r, c.padding.right, "padding-right"), K(r, c.padding.bottom, "padding-bottom"), K(r, c.padding.left, "padding-left")), K(r, c.gap, "gap"), c.rowGap != null && K(r, c.rowGap, "row-gap");
    }
    if (a.cornerRadius != null || a.rectangleCornerRadii != null || et(a)) {
      const c = a.rectangleCornerRadii ? null : a.cornerRadius ?? null, p = a.rectangleCornerRadii ?? null;
      let v = null, N = null;
      if (a.strokes && Array.isArray(a.strokes)) {
        const D = a.strokes.find(
          (U) => U.visible !== !1 && U.type === "SOLID"
        );
        D && (v = q(D.color), N = a.strokeWeight ?? null);
      }
      const k = `${c}|${JSON.stringify(p)}|${v}|${N}`, O = s.get(k);
      O ? (O.usageCount++, O.nodeIds.push(a.id)) : (x++, s.set(k, {
        radius: c,
        cornerRadii: p,
        strokeColor: v,
        strokeWeight: N,
        name: `border-${x}`,
        usageCount: 1,
        nodeIds: [a.id]
      }));
    }
    if (a.componentRef) {
      const c = a.componentRef, p = `${c.componentName}::${JSON.stringify(c.variantProperties ?? {})}`, v = f.get(p), N = a.repeatCount ?? 1;
      if (v)
        v.usageCount += N;
      else {
        const k = {
          componentName: c.componentName,
          source: c.source,
          usageCount: N
        };
        c.description && (k.description = c.description), c.variantProperties && (k.variantProperties = c.variantProperties), f.set(p, k);
      }
    }
    if (a.children)
      for (const c of a.children)
        $(c);
  }
  for (const a of e)
    $(a);
  const h = Array.from(i.values()).map((a) => ({
    value: a.value,
    name: a.name,
    usageCount: a.usageCount,
    nodeIds: a.nodeIds,
    source: Array.from(a.source)
  }));
  h.sort((a, m) => m.usageCount - a.usageCount);
  const S = Array.from(t.values());
  S.sort((a, m) => m.usageCount - a.usageCount);
  const W = Array.from(o.values());
  W.sort((a, m) => m.usageCount - a.usageCount);
  const P = Array.from(r.values());
  P.sort((a, m) => a.value - m.value);
  const F = Array.from(s.values());
  F.sort((a, m) => m.usageCount - a.usageCount);
  const z = Array.from(l.values());
  z.sort((a, m) => m.usageCount - a.usageCount);
  const A = Array.from(f.values());
  return A.sort((a, m) => m.usageCount - a.usageCount), {
    colors: h,
    gradients: S,
    typography: W,
    spacing: P,
    borders: F,
    shadows: z,
    imageFills: d,
    components: A
  };
}
function ae(e, n, i, t, o) {
  const r = e.get(n);
  if (r)
    r.usageCount++, r.nodeIds.includes(i) || r.nodeIds.push(i), r.source.add(t), o && r.name.startsWith("color-") && (r.name = o);
  else {
    const s = `color-${n.replace(/^#/, "").replace(/[^a-f0-9]/gi, "")}`;
    e.set(n, {
      value: n,
      name: o ?? s,
      usageCount: 1,
      nodeIds: [i],
      source: /* @__PURE__ */ new Set([t])
    });
  }
}
function ge(e, n, i, t) {
  const o = n.fontFamily ?? "Unknown", r = n.fontSize ?? 16, s = n.fontWeight ?? 400, l = n.lineHeightPx ?? null, d = n.letterSpacing ?? 0, f = `${o}|${r}|${s}|${l}|${d}`, x = e.get(f);
  if (x)
    x.usageCount++, x.nodeIds.includes(i) || x.nodeIds.push(i), t && x.name.startsWith(o) && (x.name = t);
  else {
    const w = `${o}-${r}-${s}`;
    e.set(f, {
      fontFamily: o,
      fontSize: r,
      fontWeight: s,
      lineHeight: l,
      letterSpacing: d,
      name: t ?? w,
      usageCount: 1,
      nodeIds: [i]
    });
  }
}
function K(e, n, i) {
  if (n === 0) return;
  const t = e.get(n);
  t ? (t.usageCount++, t.sources.includes(i) || t.sources.push(i)) : e.set(n, {
    value: n,
    usageCount: 1,
    sources: [i]
  });
}
function et(e) {
  return !e.strokes || !Array.isArray(e.strokes) ? !1 : e.strokes.some((n) => n.visible !== !1 && n.type === "SOLID");
}
function tt(e, n) {
  var t, o;
  const i = (t = e.styleRefs) == null ? void 0 : t.fill;
  return i ? ((o = n[i]) == null ? void 0 : o.name) ?? null : null;
}
function nt(e, n) {
  var t, o;
  const i = (t = e.styleRefs) == null ? void 0 : t.stroke;
  return i ? ((o = n[i]) == null ? void 0 : o.name) ?? null : null;
}
function it(e, n) {
  var t, o;
  const i = (t = e.styleRefs) == null ? void 0 : t.text;
  return i ? ((o = n[i]) == null ? void 0 : o.name) ?? null : null;
}
function ot(e, n) {
  var t, o;
  const i = (t = e.styleRefs) == null ? void 0 : t.effect;
  return i ? ((o = n[i]) == null ? void 0 : o.name) ?? null : null;
}
const rt = 500, st = 2e3;
async function at(e) {
  const { shell: n, token: i, fileKey: t, nodeId: o, scope: r } = e;
  let s, l, d;
  if (r === "node" || r === "frame") {
    if (!o)
      throw new Error(
        `Cannot extract ${r}: no node ID found in the URL. Paste a Figma URL that includes a node-id, or switch to "Entire Page" scope.`
      );
    const $ = await We(n, i, t, o);
    s = [$.rootNode], l = $.components, d = $.styles;
  } else {
    const $ = await ze(n, i, t), h = $.rootNodes[0];
    s = (h == null ? void 0 : h.children) || [], l = $.components, d = $.styles;
  }
  let f = 0;
  for (const $ of s)
    f += de($);
  let x;
  f > rt && (x = {
    nodeCount: f,
    message: `This selection has ~${f} nodes. Large extractions may produce verbose output.`
  });
  const w = Je(s, l);
  f > st && (w.truncated = !0);
  const b = Qe(w.rootNodes, d);
  return { extraction: w, tokens: b, fileKey: t, largeTreeWarning: x };
}
function X(e) {
  return e.toLowerCase().replace(/[/\s]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "") || "unnamed";
}
function lt(e) {
  const n = /* @__PURE__ */ new Map();
  return e.map((i) => {
    const t = n.get(i.filename) ?? 0;
    if (n.set(i.filename, t + 1), t === 0)
      return { ...i };
    const o = i.filename.lastIndexOf(".");
    if (o === -1)
      return { ...i, filename: `${i.filename}-${t + 1}` };
    const r = i.filename.slice(0, o), s = i.filename.slice(o);
    return { ...i, filename: `${r}-${t + 1}${s}` };
  });
}
const ct = /* @__PURE__ */ new Set([
  "VECTOR",
  "BOOLEAN_OPERATION",
  "LINE",
  "STAR",
  "POLYGON",
  "ELLIPSE"
]);
function ut(e) {
  var n;
  return ((n = e.fills) == null ? void 0 : n.some((i) => i.type === "IMAGE")) ?? !1;
}
function dt(e) {
  var i;
  const n = (i = e.fills) == null ? void 0 : i.find((t) => t.type === "IMAGE");
  return n == null ? void 0 : n.imageRef;
}
function ft(e) {
  const n = e.componentRef, i = n.variantProperties ? Object.entries(n.variantProperties).sort(([t], [o]) => t.localeCompare(o)).map(([t, o]) => `${t}=${o}`).join(",") : "";
  return `${n.componentId}|${i}`;
}
function xe(e, n, i, t, o, r) {
  if (o.has(e.id)) {
    t.push({
      nodeId: e.id,
      nodeName: e.name,
      exportType: "png-render",
      filename: X(e.name) + ".png"
    });
    return;
  }
  if (e.type === "INSTANCE" && e.componentRef) {
    const s = ft(e);
    r.has(s) || (r.add(s), t.push({
      nodeId: e.id,
      nodeName: e.componentRef.componentName,
      exportType: "png-render",
      filename: X(e.componentRef.componentName) + ".png"
    }));
    return;
  }
  if (ut(e)) {
    const s = n.get(e.id) ?? dt(e);
    n.has(e.id) && i.add(e.id), t.push({
      nodeId: e.id,
      nodeName: e.name,
      exportType: "png-fill",
      filename: X(e.name) + ".png",
      imageRef: s
    });
    return;
  }
  if (ct.has(e.type)) {
    t.push({
      nodeId: e.id,
      nodeName: e.name,
      exportType: "svg",
      filename: X(e.name) + ".svg"
    });
    return;
  }
  if (e.type === "RECTANGLE") {
    t.push({
      nodeId: e.id,
      nodeName: e.name,
      exportType: "svg",
      filename: X(e.name) + ".svg"
    });
    return;
  }
  if (e.children)
    for (const s of e.children)
      xe(s, n, i, t, o, r);
}
function pt(e, n, i = /* @__PURE__ */ new Set()) {
  const t = /* @__PURE__ */ new Map();
  for (const l of n)
    t.set(l.nodeId, l.imageRef);
  const o = [], r = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set();
  for (const l of e)
    if (l.children)
      for (const d of l.children)
        xe(d, t, r, o, i, s);
  for (const l of n)
    r.has(l.nodeId) || o.push({
      nodeId: l.nodeId,
      nodeName: l.nodeName,
      exportType: "png-fill",
      filename: X(l.nodeName) + ".png",
      imageRef: l.imageRef
    });
  return lt(o);
}
const gt = 5, mt = 3, ht = 3;
function yt(e) {
  const n = /* @__PURE__ */ new Set(), i = [];
  for (const t of e)
    if (t.children)
      for (const o of t.children)
        we(o, n, i);
  return { compositionNodeIds: n, warnings: i };
}
function we(e, n, i) {
  if (xt(e)) {
    n.add(e.id), i.push(`Auto-detected "${e.name}" as a composition`);
    return;
  }
  if (e.children)
    for (const t of e.children)
      we(t, n, i);
}
function xt(e) {
  return wt(e) && ve(e, 0);
}
function wt(e) {
  return !!(e.children && e.children.length >= gt || e.type === "BOOLEAN_OPERATION" || be(e, 0) >= mt);
}
function ve(e, n) {
  if (n > ht) return !1;
  if (e.blendMode || e.isMask === !0 || e.opacity !== void 0 && e.opacity < 1) return !0;
  if (e.children) {
    for (const i of e.children)
      if (ve(i, n + 1)) return !0;
  }
  return !1;
}
function be(e, n) {
  if (!e.children || e.children.length === 0)
    return n;
  let i = n;
  for (const t of e.children) {
    const o = be(t, n + 1);
    o > i && (i = o);
  }
  return i;
}
async function vt(e, n) {
  const i = `${n}/.shipstudio/assets`;
  return await e.exec("rm", ["-rf", i]), await e.exec("mkdir", ["-p", i]), i;
}
async function $e(e, n, i) {
  const t = ["-sS", "-o", i, "--max-time", "30", "-L", n];
  if ((await e.exec("curl", t, { timeout: 35e3 })).exit_code === 0) return { success: !0 };
  const r = await e.exec("curl", t, { timeout: 35e3 });
  return r.exit_code === 0 ? { success: !0 } : {
    success: !1,
    error: r.stderr || `curl exit code ${r.exit_code}`
  };
}
async function bt(e, n, i, t) {
  const o = [], r = [];
  for (let s = 0; s < i.length; s++) {
    const { filename: l, url: d, nodeId: f, assetType: x } = i[s], w = `${n}/${l}`;
    t && t({
      current: s + 1,
      total: i.length,
      currentAsset: l,
      phase: "assets"
    });
    const b = await $e(e, d, w);
    if (b.success) {
      const $ = { filename: l, path: w };
      f !== void 0 && ($.nodeId = f), x !== void 0 && ($.assetType = x), o.push($);
    } else
      r.push(`Failed to download ${l}: ${b.error}`);
  }
  return { downloaded: o, warnings: r };
}
async function $t(e) {
  const { shell: n, token: i, fileKey: t, selectedNodeId: o, rootNodes: r, imageFills: s, projectPath: l, onProgress: d } = e, f = [], x = await vt(n, l), { compositionNodeIds: w, warnings: b } = yt(r);
  f.push(...b);
  const $ = pt(r, s, w);
  d && d({ current: 0, total: $.length + 1, currentAsset: "preview.png", phase: "preview" });
  let h = `${x}/preview.png`;
  try {
    const p = (await se(n, i, t, [o], "png", 2))[o];
    if (p) {
      const v = await $e(n, p, h);
      v.success || (f.push(`Preview download failed: ${v.error}`), h = "");
    } else
      f.push("Figma could not render preview for this node"), h = "";
  } catch (c) {
    f.push(`Preview render failed: ${(c == null ? void 0 : c.message) || "Unknown error"}`), h = "";
  }
  const S = $.filter((c) => c.exportType === "svg");
  let W = {};
  if (S.length > 0)
    try {
      W = await se(n, i, t, S.map((c) => c.nodeId), "svg");
    } catch (c) {
      f.push(`SVG render API failed: ${(c == null ? void 0 : c.message) || "Unknown error"}`);
    }
  const P = $.filter((c) => c.exportType === "png-fill");
  let F = {};
  if (P.length > 0)
    try {
      F = await Be(n, i, t);
    } catch (c) {
      f.push(`Image fills API failed: ${(c == null ? void 0 : c.message) || "Unknown error"}`);
    }
  const z = $.filter((c) => c.exportType === "png-render");
  let A = {};
  if (z.length > 0)
    try {
      A = await se(n, i, t, z.map((c) => c.nodeId), "png", 2);
    } catch (c) {
      f.push(`Composition PNG render failed: ${(c == null ? void 0 : c.message) || "Unknown error"}`);
    }
  const a = new Set(w), m = [];
  for (const c of S) {
    const p = W[c.nodeId];
    p ? m.push({ filename: c.filename, url: p, nodeId: c.nodeId, assetType: "icon" }) : f.push(`No render URL for ${c.filename} (node ${c.nodeId})`);
  }
  for (const c of P)
    c.imageRef && F[c.imageRef] ? m.push({ filename: c.filename, url: F[c.imageRef], nodeId: c.nodeId, assetType: "image" }) : f.push(`No download URL for image fill ${c.filename} (ref: ${c.imageRef})`);
  for (const c of z) {
    const p = A[c.nodeId];
    if (p) {
      const v = a.has(c.nodeId) ? "composition" : "component";
      m.push({ filename: c.filename, url: p, nodeId: c.nodeId, assetType: v });
    } else
      f.push(`No render URL for ${c.filename} (node ${c.nodeId})`);
  }
  const { downloaded: L, warnings: B } = await bt(
    n,
    x,
    m,
    d
  );
  return f.push(...B), {
    previewPath: h,
    assets: L,
    warnings: f
  };
}
const Ct = /^(Frame|Group|Rectangle|Ellipse|Vector|Section|Instance|Line|Star|Polygon)\s*\d*$/i;
function Tt(e) {
  const n = /* @__PURE__ */ new Map();
  for (const i of e) {
    const t = Te(i.name) ? [] : [i.name];
    Ce(i, t, n);
  }
  return n;
}
function Ce(e, n, i) {
  if (i.set(e.id, Nt(n)), !!e.children)
    for (const t of e.children) {
      const o = Te(t.name) ? n : [...n, t.name];
      Ce(t, o, i);
    }
}
function Nt(e) {
  return e.length === 0 ? "" : e.length <= 4 ? e.join(" > ") : `${e[0]} > ... > ${e[e.length - 2]} > ${e[e.length - 1]}`;
}
function Te(e) {
  return Ct.test(e);
}
const me = 12e3;
function kt(e) {
  return Math.ceil(e.length / 4);
}
function It(e) {
  const { extraction: n, exportResult: i, projectPath: t } = e, o = n.tokens, r = e.rootNodes ?? n.extraction.rootNodes, s = Tt(r), d = [
    St(e),
    Rt(),
    At(i.previewPath, t),
    Et(n.extraction.rootNodes),
    Ot(o),
    Dt(o.components),
    Ht(i.previewPath, i.assets, t, s)
  ].filter(Boolean).join(`

`), f = d.length, x = kt(d), w = {
    nodeCount: n.extraction.nodeCount,
    colorCount: o.colors.length,
    fontCount: o.typography.length,
    assetCount: i.assets.length,
    estimatedTokens: x
  };
  return {
    markdown: d,
    charCount: f,
    estimatedTokens: x,
    stats: w
  };
}
function St(e) {
  var s;
  const { extraction: n, fileName: i, figmaUrl: t } = e, o = ((s = n.extraction.rootNodes[0]) == null ? void 0 : s.name) ?? "Untitled", r = e.date ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  return [
    "# Design Brief",
    "",
    `**File:** ${i}`,
    `**Frame:** ${o}`,
    `**Extracted:** ${r}`,
    `**Figma URL:** ${t}`
  ].join(`
`);
}
function Rt() {
  return [
    "## How to Use This Brief",
    "",
    "**Before building:** Read this brief fully. Plan your approach and ask clarifying questions before writing any code.",
    "**During building:** Use only the assets listed in the Assets section below -- if an asset is missing, ask the user rather than substituting or fabricating a replacement.",
    "**After building:** Compare your result against the Preview image above and verify that all design tokens and assets are correctly applied."
  ].join(`
`);
}
function At(e, n) {
  return e ? `## Preview

![Preview](${ce(e, n)})` : "";
}
function Et(e) {
  const n = [];
  for (const i of e)
    Ne(i, 0, n);
  return n.length === 0 ? "" : `## Layout Tree

` + n.join(`
`);
}
function Ne(e, n, i) {
  if (e.visible !== !1 && (i.push(Pt(e, n)), !e.componentRef && e.children))
    for (const t of e.children)
      Ne(t, n + 1, i);
}
function Lt(e) {
  return e.charAt(0).toUpperCase() + e.slice(1).toLowerCase();
}
function Pt(e, n) {
  const i = "  ".repeat(n), t = [];
  if (e.componentRef) {
    let r = `Instance "${e.componentRef.componentName}"`;
    if (e.repeatCount && e.repeatCount > 1 && (r += ` x${e.repeatCount} (repeated)`), e.componentRef.variantProperties && Object.keys(e.componentRef.variantProperties).length > 0) {
      const s = Object.entries(e.componentRef.variantProperties).map(([l, d]) => `${l}: ${d}`).join(", ");
      r += ` (${s})`;
    }
    t.push(r);
  } else if (e.type === "TEXT") {
    const r = e.textContent ?? "", s = r.length > 60 ? r.slice(0, 60) + "..." : r;
    let l = "";
    e.textStyle && (l = ` (${e.textStyle.fontFamily} ${e.textStyle.fontSize}/${e.textStyle.fontWeight})`), t.push(`Text '${s}'${l}`);
  } else
    t.push(`${Lt(e.type)} '${e.name}'`);
  if (e.autoLayout) {
    const r = e.autoLayout, s = [r.flexDirection];
    r.gap > 0 && s.push(`gap: ${r.gap}`), r.justifyContent !== "flex-start" && s.push(`justify: ${r.justifyContent}`), r.alignItems !== "flex-start" && s.push(`align: ${r.alignItems}`);
    const l = Mt(r.padding);
    l && s.push(l), r.flexWrap === "wrap" && s.push("wrap"), t.push(`(${s.join(", ")})`);
  }
  e.width != null && e.height != null && t.push(`${Math.round(e.width)}x${Math.round(e.height)}`), e.positioning === "ABSOLUTE" && t.push("[absolute]");
  const o = Ft(e);
  return o && t.push(o), `${i}${t.join(" ")}`;
}
function le(e) {
  if (!e) return null;
  for (const n of e)
    if (n.visible !== !1 && n.type === "SOLID" && n.color) {
      const i = n.opacity ?? 1, t = { ...n.color, a: (n.color.a ?? 1) * i };
      return q(t);
    }
  return null;
}
function Ft(e) {
  var i;
  const n = [];
  if (e.widthMode === "FILL" && n.push("w:fill"), e.heightMode === "FILL" && n.push("h:fill"), e.widthMode === "HUG" && n.push("w:hug"), e.heightMode === "HUG" && n.push("h:hug"), e.type !== "TEXT") {
    const t = le(e.fills);
    t && t !== "#ffffff" && t !== "#000000" ? n.push(`bg:${t}`) : t && n.push(`bg:${t}`);
  }
  if (e.type === "TEXT") {
    const t = le(e.fills);
    t && n.push(`color:${t}`);
  }
  if (e.cornerRadius && e.cornerRadius > 0 && n.push(`r:${Math.round(e.cornerRadius)}`), e.strokeWeight && e.strokeWeight > 0 && ((i = e.strokes) != null && i.length)) {
    const t = le(e.strokes);
    t && n.push(`border:${e.strokeWeight}px ${t}`);
  }
  return e.opacity != null && e.opacity < 1 && n.push(`opacity:${e.opacity.toFixed(2)}`), n.length === 0 ? null : `{${n.join(" ")}}`;
}
function Mt(e) {
  return e.top === 0 && e.right === 0 && e.bottom === 0 && e.left === 0 ? null : e.top === e.bottom && e.left === e.right && e.top === e.left ? `padding: ${e.top}` : e.top === e.bottom && e.left === e.right ? `padding: ${e.top} ${e.left}` : `padding: ${e.top} ${e.right} ${e.bottom} ${e.left}`;
}
function Ot(e) {
  const n = [];
  return e.colors.length > 0 && n.push(Ut(e.colors)), e.gradients.length > 0 && n.push(_t(e.gradients)), e.typography.length > 0 && n.push(Wt(e.typography)), e.spacing.length > 0 && n.push(zt(e.spacing)), e.borders.length > 0 && n.push(Bt(e.borders)), e.shadows.length > 0 && n.push(jt(e.shadows)), n.length === 0 ? "" : `## Design Tokens

` + n.join(`

`);
}
function Ut(e) {
  return [
    "### Colors",
    "",
    "| Name | Value | Usage |",
    "|------|-------|-------|",
    ...e.map((i) => `| ${i.name} | ${i.value} | ${i.usageCount} |`)
  ].join(`
`);
}
function _t(e) {
  return [
    "### Gradients",
    "",
    "| Name | Value | Usage |",
    "|------|-------|-------|",
    ...e.map((i) => `| ${i.name} | ${i.value} | ${i.usageCount} |`)
  ].join(`
`);
}
function Wt(e) {
  return [
    "### Typography",
    "",
    "| Name | Font | Size | Weight | Line Height |",
    "|------|------|------|--------|-------------|",
    ...e.map((i) => {
      const t = i.lineHeight !== null ? `${i.lineHeight}px` : "auto";
      return `| ${i.name} | ${i.fontFamily} | ${i.fontSize}px | ${i.fontWeight} | ${t} |`;
    })
  ].join(`
`);
}
function zt(e) {
  return [
    "### Spacing",
    "",
    "| Value | Sources | Usage |",
    "|-------|---------|-------|",
    ...e.map((i) => `| ${i.value}px | ${i.sources.join(", ")} | ${i.usageCount} |`)
  ].join(`
`);
}
function Bt(e) {
  return [
    "### Borders",
    "",
    "| Name | Radius | Stroke | Usage |",
    "|------|--------|--------|-------|",
    ...e.map((i) => {
      const t = i.radius !== null ? `${i.radius}px` : i.cornerRadii ? i.cornerRadii.map((r) => `${r}px`).join(" ") : "--", o = i.strokeWeight !== null && i.strokeColor !== null ? `${i.strokeWeight}px ${i.strokeColor}` : "--";
      return `| ${i.name} | ${t} | ${o} | ${i.usageCount} |`;
    })
  ].join(`
`);
}
function jt(e) {
  return [
    "### Shadows",
    "",
    "| Name | Type | Value | Usage |",
    "|------|------|-------|-------|",
    ...e.map((i) => {
      const t = `${i.offsetX}px ${i.offsetY}px ${i.blur}px ${i.spread}px ${i.color}`;
      return `| ${i.name} | ${i.type} | ${t} | ${i.usageCount} |`;
    })
  ].join(`
`);
}
function Dt(e) {
  return e.length === 0 ? "" : [
    "## Components",
    "",
    "| Component | Source | Variants | Usage |",
    "|-----------|--------|----------|-------|",
    ...e.map((i) => {
      const t = i.variantProperties && Object.keys(i.variantProperties).length > 0 ? Object.entries(i.variantProperties).map(([o, r]) => `${o}: ${r}`).join(", ") : "--";
      return `| ${i.componentName} | ${i.source} | ${t} | ${i.usageCount} |`;
    })
  ].join(`
`);
}
function Ht(e, n, i, t) {
  if (!e && n.length === 0) return "";
  const o = [];
  if (e) {
    const r = ce(e, i), s = r.split("/").pop() ?? r;
    o.push(`| ${s} | Preview | -- | ${r} |`);
  }
  for (const r of n) {
    const s = ce(r.path, i), l = Gt(r.assetType), d = r.nodeId && t.get(r.nodeId) || "--";
    o.push(`| ${r.filename} | ${l} | ${d} | ${s} |`);
  }
  return [
    "## Assets",
    "",
    "| File | Type | Location | Path |",
    "|------|------|----------|------|",
    ...o
  ].join(`
`);
}
function Gt(e) {
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
function ce(e, n) {
  return e.startsWith(n + "/") ? e.slice(n.length + 1) : e;
}
async function Vt(e, n, i) {
  const t = `${n}/.shipstudio`, o = `${t}/brief.md`;
  await e.exec("mkdir", ["-p", t]);
  const r = btoa(unescape(encodeURIComponent(i))), s = await e.exec("bash", [
    "-c",
    `echo '${r}' | base64 -d > '${o}'`
  ]);
  if (s.exit_code !== 0)
    throw new Error(`Failed to save brief: ${s.stderr}`);
}
async function Kt(e, n) {
  const i = btoa(unescape(encodeURIComponent(n))), t = await e.exec("bash", [
    "-c",
    `echo '${i}' | base64 -d | pbcopy`
  ]);
  if (t.exit_code !== 0)
    throw new Error(`Clipboard copy failed: ${t.stderr}`);
}
function Xt(e) {
  const n = { frames: 0, components: [], textNodes: 0, hiddenNodes: 0 }, i = /* @__PURE__ */ new Map();
  function t(o) {
    if (o.visible || n.hiddenNodes++, (o.type === "FRAME" || o.type === "GROUP" || o.type === "SECTION") && n.frames++, o.type === "TEXT" && n.textNodes++, o.componentRef) {
      const r = o.componentRef.componentName, s = o.repeatCount ?? 1;
      i.set(r, (i.get(r) ?? 0) + s);
    }
    o.children && o.children.forEach(t);
  }
  return e.forEach(t), n.components = Array.from(i.entries()).map(([o, r]) => ({ name: o, count: r })).sort((o, r) => r.count - o.count), n;
}
function ke({ nodes: e, depth: n = 0, maxDepth: i = 2 }) {
  return n >= i ? null : /* @__PURE__ */ u("div", { style: { paddingLeft: n > 0 ? "12px" : "0", borderLeft: n > 0 ? "1px solid var(--border)" : "none" }, children: e.map((t, o) => {
    const r = t.componentRef ? `<${t.componentRef.componentName}${t.repeatCount ? ` x${t.repeatCount}` : ""}>` : t.type === "TEXT" ? `"${(t.textContent ?? "").slice(0, 30)}${(t.textContent ?? "").length > 30 ? "..." : ""}"` : t.name, s = t.autoLayout ? `${t.autoLayout.flexDirection}` : t.type === "INSTANCE" ? "component" : t.type.toLowerCase();
    return /* @__PURE__ */ g("div", { style: { fontSize: "11px", lineHeight: 1.7 }, children: [
      /* @__PURE__ */ g("span", { style: { color: "var(--text-muted)" }, children: [
        s,
        " "
      ] }),
      /* @__PURE__ */ u("span", { style: { color: t.visible === !1 ? "var(--text-muted)" : "var(--text-primary)" }, children: r }),
      t.visible === !1 && /* @__PURE__ */ u("span", { style: { color: "var(--text-muted)", marginLeft: "4px" }, children: "(hidden)" }),
      t.children && t.children.length > 0 && n + 1 < i && /* @__PURE__ */ u(ke, { nodes: t.children, depth: n + 1, maxDepth: i }),
      t.children && t.children.length > 0 && n + 1 >= i && /* @__PURE__ */ g("span", { style: { color: "var(--text-muted)", fontSize: "11px", marginLeft: "12px" }, children: [
        "(",
        t.children.length,
        " children)"
      ] })
    ] }, t.id || o);
  }) });
}
function qt({ token: e }) {
  const n = ie(), i = (n == null ? void 0 : n.shell) ?? null, t = (n == null ? void 0 : n.actions) ?? null, [o, r] = C(""), [s, l] = C(null), d = s != null && s.nodeId ? "node" : "page", [f, x] = C(null), [w, b] = C(!1), [$, h] = C(null), [S, W] = C(!1), [P, F] = C(null), [z, A] = C(null), [a, m] = C(!1), [L, B] = C(!1), [c, p] = C(!1), [v, N] = C(null), [k, O] = C(null), [D, U] = C(!1), [M, H] = C(null), [fe, J] = C(null), Z = Fe(
    () => P ? Xt(P.rootNodes) : null,
    [P]
  ), G = te(null), j = te(i);
  j.current = i;
  const oe = te(0), Q = te(0), ee = E(async (y) => {
    var R, I;
    if (!(!j.current || !((R = n == null ? void 0 : n.project) != null && R.path) || !s)) {
      p(!0), N(null), O(null);
      try {
        const T = await $t({
          shell: j.current,
          token: e,
          fileKey: y.fileKey,
          selectedNodeId: s.nodeId || ((I = y.extraction.rootNodes[0]) == null ? void 0 : I.id) || "0:0",
          rootNodes: y.extraction.rootNodes,
          imageFills: y.tokens.imageFills,
          projectPath: n.project.path,
          onProgress: N
        });
        if (O(T), t) {
          const _ = T.assets.length, V = T.warnings.length, Pe = `Exported ${_} asset${_ !== 1 ? "s" : ""}${V > 0 ? ` (${V} warning${V !== 1 ? "s" : ""})` : ""}`;
          t.showToast(Pe, V > 0 ? "info" : "success");
        }
        U(!0), H(null), J(null), setTimeout(() => {
          try {
            const _ = It({
              extraction: y,
              exportResult: T,
              projectPath: n.project.path,
              fileName: (f == null ? void 0 : f.name) ?? "Untitled",
              figmaUrl: o,
              rootNodes: y.extraction.rootNodes
            });
            H(_), U(!1), j.current && Vt(j.current, n.project.path, _.markdown).catch((V) => {
              console.error("Brief save failed:", V);
            }), t && t.showToast(
              `Brief ready: ${_.stats.nodeCount} layers, ${_.stats.assetCount} assets, ~${Math.round(_.stats.estimatedTokens / 1e3)}K tokens`,
              "success"
            );
          } catch (_) {
            J((_ == null ? void 0 : _.message) || "Brief generation failed"), U(!1);
          }
        }, 0);
      } catch (T) {
        t && t.showToast(`Asset export failed: ${(T == null ? void 0 : T.message) || "Unknown error"}`, "error");
      } finally {
        p(!1), N(null);
      }
    }
  }, [e, s, n, t, f, o]), Ie = E(
    (y) => {
      const R = y.target.value;
      if (r(R), !R.trim()) {
        l(null), x(null), h(null), b(!1), F(null), A(null), m(!1), B(!1), G.current = null, O(null), p(!1), N(null), H(null), U(!1), J(null);
        return;
      }
      const I = He(R);
      if (!I) {
        l(null), x(null), h("Please paste a valid Figma URL (file, design, proto, or board link)"), b(!1);
        return;
      }
      l(I), h(null), x(null), F(null), A(null), m(!1), B(!1), G.current = null, O(null), p(!1), N(null), H(null), U(!1), J(null);
    },
    []
  );
  ne(() => {
    if (!s || !j.current) return;
    const y = ++oe.current, R = j.current;
    b(!0), x(null), h(null), (async () => {
      try {
        const I = await _e(R, e, s.fileKey);
        oe.current === y && (x(I), b(!1));
      } catch (I) {
        if (oe.current === y) {
          const T = (I == null ? void 0 : I.message) || "Failed to validate file access.";
          T.includes("403") || T.includes("Invalid or expired") ? h("Cannot access this file. Check that your token has File content (Read) scope.") : T.includes("404") || T.includes("not found") ? h("File not found. Check that the URL is correct.") : T.includes("429") || T.includes("Rate limited") ? h("Rate limited by Figma. Please wait a moment and try again.") : h(T), b(!1);
        }
      }
    })();
  }, [s, e]);
  const Se = E(() => {
    const y = j.current;
    if (!y || !s) return;
    const R = ++Q.current;
    W(!0), F(null), h(null), A(null), m(!1), G.current = null, O(null), p(!1), N(null), H(null), U(!1), J(null), (async () => {
      try {
        const I = await at({
          shell: y,
          token: e,
          fileKey: s.fileKey,
          nodeId: s.nodeId,
          scope: d
        });
        if (Q.current !== R) return;
        if (I.largeTreeWarning) {
          G.current = I, A(I.largeTreeWarning), m(!0), W(!1);
          return;
        }
        F(I.extraction), t && t.showToast(`Extracted ${I.extraction.nodeCount} layers`, "success"), ee(I);
      } catch (I) {
        if (Q.current !== R) return;
        const T = (I == null ? void 0 : I.message) || "Extraction failed.";
        T.includes("403") || T.includes("Invalid or expired") ? h("Cannot access this file. Check that your token has File content (Read) scope.") : T.includes("404") || T.includes("not found") ? h("File not found. Check that the URL is correct.") : T.includes("429") || T.includes("Rate limited") ? h("Rate limited by Figma. Please wait a moment and try again.") : T.includes("timeout") || T.includes("timed out") ? h("Request timed out. Try a smaller selection or check your connection.") : h(T);
      } finally {
        Q.current === R && W(!1);
      }
    })();
  }, [s, e, d, t, ee]), Re = E(() => {
    const y = G.current;
    y && (m(!1), A(null), F(y.extraction), G.current = null, t && t.showToast(`Extracted ${y.extraction.nodeCount} layers`, "success"), ee(y));
  }, [t, ee]), Ae = E(() => {
    m(!1), A(null), G.current = null;
  }, []), Ee = E(async () => {
    if (!(!M || !j.current))
      try {
        await Kt(j.current, M.markdown), t && t.showToast("Brief copied to clipboard", "success");
      } catch (y) {
        t && t.showToast(`Copy failed: ${(y == null ? void 0 : y.message) || "Unknown error"}`, "error");
      }
  }, [M, t]), Le = !s || !f || w || S || c || D;
  return /* @__PURE__ */ g("div", { children: [
    /* @__PURE__ */ g("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ u("label", { className: "figma-plugin-label", children: "Figma URL" }),
      /* @__PURE__ */ u(
        "input",
        {
          className: "figma-plugin-input",
          type: "text",
          placeholder: "https://www.figma.com/design/...",
          value: o,
          onChange: Ie
        }
      ),
      $ && /* @__PURE__ */ u("div", { className: "figma-plugin-error", children: $ })
    ] }),
    s && /* @__PURE__ */ u("div", { className: "figma-plugin-section", children: /* @__PURE__ */ g("div", { className: "figma-plugin-file-info", children: [
      w && /* @__PURE__ */ g("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: f ? "8px" : "0" }, children: [
        /* @__PURE__ */ u("span", { className: "figma-plugin-spinner" }),
        /* @__PURE__ */ u("span", { style: { color: "var(--text-secondary)" }, children: "Checking access..." })
      ] }),
      f && /* @__PURE__ */ g("div", { style: { marginBottom: "8px" }, children: [
        /* @__PURE__ */ u("div", { style: { fontWeight: 600, fontSize: "13px", marginBottom: "4px" }, children: f.name }),
        /* @__PURE__ */ g("div", { style: { color: "var(--text-secondary)" }, children: [
          f.pages.length,
          " page",
          f.pages.length !== 1 ? "s" : ""
        ] })
      ] }),
      !w && /* @__PURE__ */ g("div", { style: { color: "var(--text-muted)", lineHeight: 1.6 }, children: [
        /* @__PURE__ */ g("div", { children: [
          "File key: ",
          s.fileKey
        ] }),
        /* @__PURE__ */ g("div", { children: [
          "Node: ",
          s.nodeId || "None (file-level)"
        ] }),
        /* @__PURE__ */ g("div", { children: [
          "Type: ",
          s.fileType
        ] })
      ] })
    ] }) }),
    s && f && !w && /* @__PURE__ */ u("div", { className: "figma-plugin-section", children: /* @__PURE__ */ u("div", { style: { color: "var(--text-secondary)", fontSize: "12px" }, children: s.nodeId ? "Will extract the selected element" : "Will extract the whole page — select a specific element in Figma to narrow scope" }) }),
    a && z && /* @__PURE__ */ u("div", { className: "figma-plugin-section", children: /* @__PURE__ */ g("div", { className: "figma-plugin-warning", children: [
      /* @__PURE__ */ g("strong", { children: [
        z.nodeCount,
        " layers detected"
      ] }),
      /* @__PURE__ */ u("p", { children: "Large selections may take longer and produce verbose output. Continue?" }),
      /* @__PURE__ */ g("div", { className: "figma-plugin-warning-actions", children: [
        /* @__PURE__ */ u("button", { className: "btn-primary", onClick: Re, children: "Continue" }),
        /* @__PURE__ */ u("button", { className: "btn-secondary", onClick: Ae, children: "Cancel" })
      ] })
    ] }) }),
    fe && /* @__PURE__ */ u("div", { className: "figma-plugin-section", children: /* @__PURE__ */ u("div", { className: "figma-plugin-error", children: fe }) }),
    M && P && Z && k && /* @__PURE__ */ u("div", { className: "figma-plugin-section", children: /* @__PURE__ */ g("div", { className: "figma-plugin-file-info", children: [
      /* @__PURE__ */ g("div", { style: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }, children: [
        /* @__PURE__ */ u("span", { style: { color: "#38a169" }, children: "✓" }),
        /* @__PURE__ */ u("span", { style: { fontWeight: 600, fontSize: "13px" }, children: "Brief ready" }),
        P.truncated && /* @__PURE__ */ u("span", { style: { color: "#f59e0b", fontSize: "11px" }, children: "(truncated)" })
      ] }),
      /* @__PURE__ */ u(
        "button",
        {
          className: "btn-primary",
          onClick: Ee,
          style: { width: "100%", marginBottom: "12px" },
          children: "Copy Brief to Clipboard"
        }
      ),
      /* @__PURE__ */ g("div", { style: { color: "var(--text-secondary)", fontSize: "12px", lineHeight: 1.6 }, children: [
        M.stats.nodeCount,
        " layers ·",
        " ",
        M.stats.assetCount,
        " assets ·",
        " ",
        /* @__PURE__ */ g("span", { style: {
          color: M.stats.estimatedTokens > me ? "#f59e0b" : "inherit"
        }, children: [
          "~",
          Math.round(M.stats.estimatedTokens / 1e3),
          "K tokens"
        ] })
      ] }),
      (() => {
        const y = k.assets.filter((R) => R.assetType === "composition").length;
        return y > 0 ? /* @__PURE__ */ g("div", { style: { marginTop: "8px", fontSize: "12px", color: "#f59e0b" }, children: [
          y,
          " composition",
          y !== 1 ? "s" : "",
          " exported as PNG"
        ] }) : null;
      })(),
      M.stats.estimatedTokens > me && /* @__PURE__ */ g("div", { className: "figma-plugin-warning", style: { marginTop: "8px" }, children: [
        /* @__PURE__ */ u("strong", { children: "This brief is large" }),
        /* @__PURE__ */ u("p", { children: "Consider extracting a smaller section for better results." })
      ] }),
      Z.components.length > 0 && /* @__PURE__ */ g("div", { style: { marginTop: "10px" }, children: [
        /* @__PURE__ */ u("div", { style: { color: "var(--text-muted)", fontSize: "11px", marginBottom: "4px" }, children: "Components" }),
        /* @__PURE__ */ g("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px" }, children: [
          Z.components.slice(0, 8).map((y) => /* @__PURE__ */ g(
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
                y.name,
                y.count > 1 ? ` x${y.count}` : ""
              ]
            },
            y.name
          )),
          Z.components.length > 8 && /* @__PURE__ */ g("span", { style: { fontSize: "11px", color: "var(--text-muted)", padding: "2px 4px" }, children: [
            "+",
            Z.components.length - 8,
            " more"
          ] })
        ] })
      ] }),
      k.warnings.length > 0 && /* @__PURE__ */ g("div", { style: { marginTop: "8px", fontSize: "11px", color: "#f59e0b" }, children: [
        k.warnings.length,
        " warning",
        k.warnings.length !== 1 ? "s" : "",
        ":",
        /* @__PURE__ */ g("ul", { style: { margin: "4px 0 0 16px", padding: 0 }, children: [
          k.warnings.slice(0, 5).map((y, R) => /* @__PURE__ */ u("li", { children: y }, R)),
          k.warnings.length > 5 && /* @__PURE__ */ g("li", { children: [
            "...and ",
            k.warnings.length - 5,
            " more"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ u(
        "button",
        {
          onClick: () => B(!L),
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
      L && /* @__PURE__ */ u("div", { style: { marginTop: "6px", padding: "8px", background: "var(--bg-primary)", borderRadius: "4px", border: "1px solid var(--border)", maxHeight: "200px", overflowY: "auto" }, children: /* @__PURE__ */ u(ke, { nodes: P.rootNodes }) }),
      /* @__PURE__ */ u("div", { style: { color: "var(--text-muted)", fontSize: "11px", marginTop: "8px", textAlign: "center" }, children: "Also saved to .shipstudio/brief.md" })
    ] }) }),
    (() => {
      const y = S || c || D, R = S ? "Extracting layout..." : c ? (v == null ? void 0 : v.phase) === "preview" ? "Rendering preview..." : `Exporting assets${v != null && v.total ? ` (${v.current ?? 0}/${v.total})` : ""}...` : D ? "Generating brief..." : M ? "Get New Brief" : "Get Brief";
      return /* @__PURE__ */ g(
        "button",
        {
          className: M && !y ? "btn-secondary" : "btn-primary",
          onClick: Se,
          disabled: Le,
          style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
          children: [
            y && /* @__PURE__ */ u("span", { className: "figma-plugin-spinner", style: { width: "14px", height: "14px", borderWidth: "2px" } }),
            R
          ]
        }
      );
    })()
  ] });
}
function Yt({ onClick: e }) {
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
      children: /* @__PURE__ */ g(
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
function Jt() {
  const e = ie(), n = (e == null ? void 0 : e.storage) ?? null, i = (e == null ? void 0 : e.actions) ?? null, [t, o] = C(!1), [r, s] = C(null), [l, d] = C(null), [f, x] = C(!1), [w, b] = C("main");
  ne(() => {
    if (!n) return;
    let a = !1;
    return (async () => {
      try {
        const m = await n.read();
        !a && typeof m.figmaToken == "string" && (s(m.figmaToken), typeof m.figmaUserHandle == "string" && d({ id: "", handle: m.figmaUserHandle, img_url: "" }));
      } catch (m) {
        console.error("[figma] Failed to read storage:", m);
      } finally {
        a || x(!0);
      }
    })(), () => {
      a = !0;
    };
  }, [n]);
  const $ = E(() => o(!0), []), h = E(() => {
    o(!1), b("main");
  }, []), S = E(async (a, m) => {
    if (!(!n || !i))
      try {
        const L = await n.read();
        await n.write({ ...L, figmaToken: a, figmaUserHandle: m.handle }), s(a), d(m), b("main"), i.showToast(`Connected as ${m.handle}`, "success");
      } catch {
        i.showToast("Failed to save token. Please try again.", "error");
      }
  }, [n, i]), W = E(async (a, m) => {
    if (!(!n || !i))
      try {
        const L = await n.read();
        await n.write({ ...L, figmaToken: a, figmaUserHandle: m.handle }), s(a), d(m), b("main"), i.showToast(`Token updated — connected as ${m.handle}`, "success");
      } catch {
        i.showToast("Failed to save token. Please try again.", "error");
      }
  }, [n, i]), P = E(async () => {
    if (!(!n || !i))
      try {
        const a = await n.read(), { figmaToken: m, figmaUserHandle: L, ...B } = a;
        await n.write(B), s(null), d(null), b("main"), i.showToast("Disconnected from Figma", "info");
      } catch {
        i.showToast("Failed to remove token. Please try again.", "error");
      }
  }, [n, i]), F = "Figma", z = r ? /* @__PURE__ */ u(Yt, { onClick: () => b("settings") }) : void 0;
  let A = null;
  return f && (r ? w === "settings" && l ? A = /* @__PURE__ */ u(
    De,
    {
      currentUser: l,
      onTokenUpdated: W,
      onTokenRemoved: P,
      onBack: () => b("main")
    }
  ) : A = /* @__PURE__ */ u(qt, { token: r }) : A = /* @__PURE__ */ u(je, { onTokenSaved: S })), /* @__PURE__ */ g(ue, { children: [
    /* @__PURE__ */ u(
      "button",
      {
        onClick: $,
        title: "Figma Design Brief",
        className: "toolbar-icon-btn",
        children: /* @__PURE__ */ g(
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
              /* @__PURE__ */ u("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1" }),
              /* @__PURE__ */ u("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1" }),
              /* @__PURE__ */ u("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1" }),
              /* @__PURE__ */ u("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1" })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ u(
      Oe,
      {
        open: t,
        onClose: h,
        title: F,
        headerRight: z,
        children: A
      }
    )
  ] });
}
const en = "Figma", tn = {
  toolbar: Jt
};
function nn() {
  console.log("[figma] Plugin activated");
}
function on() {
  console.log("[figma] Plugin deactivated");
}
export {
  en as name,
  nn as onActivate,
  on as onDeactivate,
  tn as slots
};
