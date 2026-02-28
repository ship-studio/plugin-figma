import { jsx as l, jsxs as u, Fragment as Y } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export const jsx=R.createElement;export const jsxs=R.createElement;export const Fragment=R.Fragment;";
import { useEffect as G, useCallback as E, useState as C, useMemo as re, useRef as V } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export default R;export const{useState,useEffect,useCallback,useRef,useMemo,useContext,createContext,createElement,Fragment}=R;";
const Q = window;
function K() {
  const i = Q.__SHIPSTUDIO_REACT__, n = Q.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__;
  return n && (i != null && i.useContext) ? i.useContext(n) : null;
}
const q = "figma-plugin-styles", ae = `
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
function se({ open: i, onClose: n, title: o, headerRight: e, children: t }) {
  G(() => {
    if (!i) return;
    let s = document.getElementById(q);
    return s || (s = document.createElement("style"), s.id = q, s.textContent = ae, document.head.appendChild(s)), () => {
      const c = document.getElementById(q);
      c && c.remove();
    };
  }, [i]), G(() => {
    if (!i) return;
    const s = (c) => {
      c.key === "Escape" && n();
    };
    return document.addEventListener("keydown", s), () => document.removeEventListener("keydown", s);
  }, [i, n]);
  const a = E(
    (s) => {
      s.target === s.currentTarget && n();
    },
    [n]
  );
  return i ? /* @__PURE__ */ l("div", { className: "figma-plugin-overlay", onClick: a, children: /* @__PURE__ */ u("div", { className: "figma-plugin-modal", children: [
    /* @__PURE__ */ u("div", { className: "figma-plugin-modal-header", children: [
      /* @__PURE__ */ u(
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
    /* @__PURE__ */ l("div", { className: "figma-plugin-modal-body", children: t })
  ] }) }) : null;
}
const le = "https://api.figma.com/v1";
async function X(i, n, o, e) {
  const t = `${le}${n}`, a = Math.ceil(((e == null ? void 0 : e.timeout) ?? 3e4) / 1e3), s = [
    "-sS",
    "--max-time",
    String(a),
    "-H",
    `X-Figma-Token: ${o}`,
    t
  ], c = await i.exec("curl", s, {
    timeout: (e == null ? void 0 : e.timeout) ?? 12e4
  });
  if (c.exit_code !== 0)
    throw new Error(`Figma API request failed: ${c.stderr || `exit code ${c.exit_code}`}`);
  if (!c.stdout.trim())
    throw new Error("Empty response from Figma API");
  let f;
  try {
    f = JSON.parse(c.stdout);
  } catch {
    throw new Error(`Invalid JSON from Figma API: ${c.stdout.slice(0, 200)}`);
  }
  if (f.status && f.err)
    throw f.status === 429 ? new Error("Rate limited by Figma API. Try again in a moment.") : f.status === 403 ? new Error("Invalid or expired token. Please update your Figma token.") : f.status === 404 ? new Error("File not found. Check that the URL is correct and you have access.") : new Error(`Figma API error: ${f.err}`);
  return f;
}
async function te(i, n) {
  return X(i, "/me", n);
}
async function ce(i, n, o) {
  const e = await X(i, `/files/${o}?depth=1`, n);
  return {
    name: e.name,
    pages: e.document.children.filter((t) => t.type === "CANVAS").map((t) => ({ id: t.id, name: t.name }))
  };
}
async function de(i, n, o, e) {
  const t = await X(
    i,
    `/files/${o}/nodes?ids=${encodeURIComponent(e)}`,
    n,
    { timeout: 12e4 }
  ), a = t.nodes[e];
  if (!a) {
    const s = Object.keys(t.nodes), c = s.find(
      (f) => f.replace(/%3A/g, ":") === e || f === e.replace(/:/g, "%3A")
    );
    if (c)
      return {
        rootNode: t.nodes[c].document,
        components: t.nodes[c].components,
        styles: t.nodes[c].styles ?? {}
      };
    throw new Error(
      `Node "${e}" not found in API response. Available nodes: ${s.join(", ")}`
    );
  }
  return {
    rootNode: a.document,
    components: a.components,
    styles: a.styles ?? {}
  };
}
async function ue(i, n, o) {
  const e = await X(
    i,
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
function fe({ onTokenSaved: i }) {
  const n = K(), o = (n == null ? void 0 : n.shell) ?? null, [e, t] = C(""), [a, s] = C(!1), [c, f] = C(null), h = E(async () => {
    if (!o) return;
    const y = e.trim();
    if (!(!y || a)) {
      s(!0), f(null);
      try {
        const v = await te(o, y);
        i(y, v);
      } catch (v) {
        f((v == null ? void 0 : v.message) || "Failed to validate token. Please check and try again.");
      } finally {
        s(!1);
      }
    }
  }, [e, a, o, i]), x = E(
    (y) => {
      y.key === "Enter" && h();
    },
    [h]
  );
  return /* @__PURE__ */ u("div", { children: [
    /* @__PURE__ */ u("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ l("h3", { style: { fontSize: "14px", fontWeight: 600, margin: "0 0 8px 0" }, children: "Connect to Figma" }),
      /* @__PURE__ */ u("p", { style: { fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 16px 0", lineHeight: 1.5 }, children: [
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
    /* @__PURE__ */ u("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ l("label", { className: "figma-plugin-label", children: "Personal Access Token" }),
      /* @__PURE__ */ l(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: e,
          onChange: (y) => t(y.target.value),
          onKeyDown: x,
          disabled: a
        }
      ),
      c && /* @__PURE__ */ l("div", { className: "figma-plugin-error", children: c }),
      /* @__PURE__ */ l("div", { className: "figma-plugin-hint", children: "Token is stored locally in this project only." })
    ] }),
    /* @__PURE__ */ l(
      "button",
      {
        className: "btn-primary",
        onClick: h,
        disabled: !e.trim() || a,
        style: { width: "100%", marginTop: "4px" },
        children: a ? /* @__PURE__ */ u(Y, { children: [
          /* @__PURE__ */ l("span", { className: "figma-plugin-spinner", style: { marginRight: "8px", verticalAlign: "middle" } }),
          "Connecting..."
        ] }) : "Connect"
      }
    )
  ] });
}
function ge({ currentUser: i, onTokenUpdated: n, onTokenRemoved: o, onBack: e }) {
  const t = K(), a = (t == null ? void 0 : t.shell) ?? null, [s, c] = C(""), [f, h] = C(!1), [x, y] = C(null), v = E(async () => {
    if (!a) return;
    const N = s.trim();
    if (!(!N || f)) {
      h(!0), y(null);
      try {
        const b = await te(a, N);
        n(N, b);
      } catch (b) {
        y((b == null ? void 0 : b.message) || "Failed to validate token. Please check and try again.");
      } finally {
        h(!1);
      }
    }
  }, [s, f, a, n]), w = E(
    (N) => {
      N.key === "Enter" && v();
    },
    [v]
  );
  return /* @__PURE__ */ u("div", { children: [
    /* @__PURE__ */ u(
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
    /* @__PURE__ */ l("div", { className: "figma-plugin-section", children: /* @__PURE__ */ u("div", { className: "figma-plugin-success", style: { display: "flex", alignItems: "center", gap: "6px", marginTop: "0" }, children: [
      /* @__PURE__ */ l("span", { style: { fontSize: "10px" }, children: "●" }),
      "Connected as ",
      i.handle
    ] }) }),
    /* @__PURE__ */ u("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ l("label", { className: "figma-plugin-label", children: "Update Token" }),
      /* @__PURE__ */ l(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: s,
          onChange: (N) => c(N.target.value),
          onKeyDown: w,
          disabled: f
        }
      ),
      x && /* @__PURE__ */ l("div", { className: "figma-plugin-error", children: x }),
      /* @__PURE__ */ l(
        "button",
        {
          className: "btn-primary",
          onClick: v,
          disabled: !s.trim() || f,
          style: { width: "100%", marginTop: "8px" },
          children: f ? /* @__PURE__ */ u(Y, { children: [
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
function pe(i) {
  const n = i.match(
    /figma\.com\/(file|design|proto|board)\/([A-Za-z0-9]+)/
  );
  if (!n) return null;
  const o = n[1], e = n[2];
  let t = null;
  const a = i.match(/[?&]node-id=([^&]+)/);
  return a && (t = decodeURIComponent(a[1]).replace(/-/g, ":")), { fileKey: e, nodeId: t, fileType: o };
}
function me(i) {
  switch (i) {
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
function he(i) {
  switch (i) {
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
function ye(i) {
  const n = {
    flexDirection: i.layoutMode === "HORIZONTAL" ? "row" : "column",
    justifyContent: me(i.primaryAxisAlignItems),
    alignItems: he(i.counterAxisAlignItems),
    gap: i.itemSpacing ?? 0,
    padding: {
      top: i.paddingTop ?? 0,
      right: i.paddingRight ?? 0,
      bottom: i.paddingBottom ?? 0,
      left: i.paddingLeft ?? 0
    },
    flexWrap: i.layoutWrap === "WRAP" ? "wrap" : "nowrap"
  };
  return i.layoutWrap === "WRAP" && (n.rowGap = i.counterAxisSpacing ?? 0), n;
}
function xe(i, n) {
  const o = n[i.componentId];
  let e;
  if (i.componentProperties) {
    const a = {};
    for (const [s, c] of Object.entries(i.componentProperties))
      (c.type === "VARIANT" || c.type === "BOOLEAN" || c.type === "TEXT") && (a[s] = c.value);
    Object.keys(a).length > 0 && (e = a);
  }
  const t = {
    componentId: i.componentId,
    componentName: (o == null ? void 0 : o.name) ?? i.name,
    isRemote: (o == null ? void 0 : o.remote) ?? !1,
    source: o != null && o.remote ? "library" : "local"
  };
  return o != null && o.description && (t.description = o.description), e && (t.variantProperties = e), i.overrides && (t.overrides = i.overrides), t;
}
function ne(i, n, o) {
  const e = i;
  if (e.type === "SLICE") return null;
  const t = {
    id: e.id,
    name: e.name,
    type: e.type,
    visible: e.visible !== !1
    // defaults to true when undefined
  };
  switch (e.absoluteBoundingBox != null ? (t.width = e.absoluteBoundingBox.width, t.height = e.absoluteBoundingBox.height) : e.size != null && (t.width = e.size.x, t.height = e.size.y), "layoutSizingHorizontal" in e && (t.widthMode = e.layoutSizingHorizontal), "layoutSizingVertical" in e && (t.heightMode = e.layoutSizingVertical), "layoutPositioning" in e && e.layoutPositioning != null && (t.positioning = e.layoutPositioning), "layoutMode" in e && e.layoutMode && e.layoutMode !== "NONE" && (t.autoLayout = ye(e)), "constraints" in e && e.constraints != null && (t.constraints = e.constraints), "minWidth" in e && e.minWidth != null && (t.minWidth = e.minWidth), "maxWidth" in e && e.maxWidth != null && (t.maxWidth = e.maxWidth), "minHeight" in e && e.minHeight != null && (t.minHeight = e.minHeight), "maxHeight" in e && e.maxHeight != null && (t.maxHeight = e.maxHeight), "preserveRatio" in e && e.preserveRatio != null && (t.preserveRatio = e.preserveRatio), "fills" in e && Array.isArray(e.fills) && (t.fills = e.fills), "strokes" in e && Array.isArray(e.strokes) && (t.strokes = e.strokes), "strokeWeight" in e && e.strokeWeight != null && (t.strokeWeight = e.strokeWeight), "effects" in e && Array.isArray(e.effects) && (t.effects = e.effects), "cornerRadius" in e && e.cornerRadius != null && (t.cornerRadius = e.cornerRadius), "rectangleCornerRadii" in e && Array.isArray(e.rectangleCornerRadii) && (t.rectangleCornerRadii = e.rectangleCornerRadii), "opacity" in e && e.opacity != null && e.opacity !== 1 && (t.opacity = e.opacity), "styles" in e && e.styles && (t.styleRefs = e.styles), e.type) {
    case "TEXT":
      t.textContent = e.characters, e.style && (t.textStyle = e.style), e.styleOverrideTable && Object.keys(e.styleOverrideTable).length > 0 && (t.textStyleOverrides = e.styleOverrideTable);
      break;
    case "INSTANCE":
      return t.componentRef = xe(e, n), t;
    case "BOOLEAN_OPERATION":
      return t;
  }
  if ("children" in e && Array.isArray(e.children)) {
    const a = e.children.map((s) => ne(s, n)).filter((s) => s !== null);
    t.children = be(a);
  }
  return t;
}
function Z(i) {
  let n = 1;
  if (i.children && Array.isArray(i.children))
    for (const o of i.children)
      n += Z(o);
  return n;
}
function ve(i) {
  const n = i.componentRef, o = n.variantProperties ? JSON.stringify(n.variantProperties, Object.keys(n.variantProperties).sort()) : "";
  return `${n.componentId}::${o}`;
}
function be(i) {
  if (i.length === 0) return [];
  const n = /* @__PURE__ */ new Map();
  for (let t = 0; t < i.length; t++) {
    const a = i[t];
    if (a.componentRef) {
      const s = ve(a), c = n.get(s);
      c ? (c.count++, c.indices.push(t)) : n.set(s, { node: a, count: 1, indices: [t] });
    }
  }
  const o = /* @__PURE__ */ new Set();
  for (const t of n.values())
    if (t.count >= 3) {
      t.node.repeatCount = t.count;
      for (let a = 1; a < t.indices.length; a++)
        o.add(t.indices[a]);
    }
  const e = [];
  for (let t = 0; t < i.length; t++)
    o.has(t) || e.push(i[t]);
  return e;
}
function we(i, n) {
  let o = 0;
  for (const t of i)
    o += Z(t);
  return {
    rootNodes: i.map((t) => ne(t, n)).filter((t) => t !== null),
    nodeCount: o,
    truncated: !1
  };
}
function B(i) {
  const n = Math.round(i.r * 255), o = Math.round(i.g * 255), e = Math.round(i.b * 255);
  if (i.a >= 1)
    return `#${n.toString(16).padStart(2, "0")}${o.toString(16).padStart(2, "0")}${e.toString(16).padStart(2, "0")}`;
  const t = parseFloat(i.a.toFixed(2));
  return `rgba(${n}, ${o}, ${e}, ${t})`;
}
function ke(i) {
  const n = i.gradientStops.map((o) => `${B(o.color)} ${Math.round(o.position * 100)}%`).join(", ");
  switch (i.type) {
    case "GRADIENT_LINEAR": {
      const [o, e] = i.gradientHandlePositions, t = e.x - o.x, a = e.y - o.y, s = Math.atan2(a, t);
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
function Ce(i, n) {
  const o = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), f = [], h = /* @__PURE__ */ new Map();
  let x = 0, y = 0, v = 0;
  function w(r) {
    var p, R, W;
    if (r.fills && Array.isArray(r.fills)) {
      const g = Te(r, n);
      for (const d of r.fills)
        if (d.visible !== !1)
          if (d.type === "SOLID") {
            const m = { ...d.color };
            d.opacity != null && d.opacity !== 1 && (m.a = m.a * d.opacity);
            const k = B(m);
            J(o, k, r.id, "fill", g);
          } else if ((p = d.type) != null && p.startsWith("GRADIENT_")) {
            const m = ke(d), k = m, S = e.get(k);
            S ? (S.usageCount++, S.nodeIds.push(r.id)) : (v++, e.set(k, {
              value: m,
              name: g ?? `gradient-${v}`,
              gradientType: d.type,
              usageCount: 1,
              nodeIds: [r.id]
            }));
          } else d.type === "IMAGE" && f.push({
            imageRef: d.imageRef,
            scaleMode: d.scaleMode,
            nodeId: r.id,
            nodeName: r.name
          });
    }
    if (r.strokes && Array.isArray(r.strokes)) {
      const g = Se(r, n);
      for (const d of r.strokes)
        if (d.visible !== !1 && d.type === "SOLID") {
          const m = { ...d.color };
          d.opacity != null && d.opacity !== 1 && (m.a = m.a * d.opacity);
          const k = B(m);
          J(o, k, r.id, "stroke", g);
        }
    }
    if (r.effects && Array.isArray(r.effects)) {
      const g = Re(r, n);
      for (const d of r.effects)
        if (d.visible === !0 && (d.type === "DROP_SHADOW" || d.type === "INNER_SHADOW")) {
          const m = d.type === "DROP_SHADOW" ? "drop-shadow" : "inner-shadow", k = B(d.color), S = ((R = d.offset) == null ? void 0 : R.x) ?? 0, L = ((W = d.offset) == null ? void 0 : W.y) ?? 0, H = d.radius ?? 0, D = d.spread ?? 0, j = `${m}|${k}|${S}|${L}|${H}|${D}`, U = c.get(j);
          U ? (U.usageCount++, U.nodeIds.push(r.id)) : (y++, c.set(j, {
            type: m,
            color: k,
            offsetX: S,
            offsetY: L,
            blur: H,
            spread: D,
            name: g ?? `shadow-${y}`,
            usageCount: 1,
            nodeIds: [r.id]
          })), J(o, k, r.id, "shadow", null);
        }
    }
    if (r.type === "TEXT" && r.textStyle) {
      const g = Ae(r, n);
      if (ee(t, r.textStyle, r.id, g), r.textStyleOverrides && typeof r.textStyleOverrides == "object")
        for (const d of Object.values(r.textStyleOverrides))
          ee(t, d, r.id, null);
    }
    if (r.autoLayout) {
      const g = r.autoLayout;
      g.padding && (_(a, g.padding.top, "padding-top"), _(a, g.padding.right, "padding-right"), _(a, g.padding.bottom, "padding-bottom"), _(a, g.padding.left, "padding-left")), _(a, g.gap, "gap"), g.rowGap != null && _(a, g.rowGap, "row-gap");
    }
    if (r.cornerRadius != null || r.rectangleCornerRadii != null || Ne(r)) {
      const g = r.rectangleCornerRadii ? null : r.cornerRadius ?? null, d = r.rectangleCornerRadii ?? null;
      let m = null, k = null;
      if (r.strokes && Array.isArray(r.strokes)) {
        const H = r.strokes.find(
          (D) => D.visible !== !1 && D.type === "SOLID"
        );
        H && (m = B(H.color), k = r.strokeWeight ?? null);
      }
      const S = `${g}|${JSON.stringify(d)}|${m}|${k}`, L = s.get(S);
      L ? (L.usageCount++, L.nodeIds.push(r.id)) : (x++, s.set(S, {
        radius: g,
        cornerRadii: d,
        strokeColor: m,
        strokeWeight: k,
        name: `border-${x}`,
        usageCount: 1,
        nodeIds: [r.id]
      }));
    }
    if (r.componentRef) {
      const g = r.componentRef, d = `${g.componentName}::${JSON.stringify(g.variantProperties ?? {})}`, m = h.get(d), k = r.repeatCount ?? 1;
      if (m)
        m.usageCount += k;
      else {
        const S = {
          componentName: g.componentName,
          source: g.source,
          usageCount: k
        };
        g.description && (S.description = g.description), g.variantProperties && (S.variantProperties = g.variantProperties), h.set(d, S);
      }
    }
    if (r.children)
      for (const g of r.children)
        w(g);
  }
  for (const r of i)
    w(r);
  const N = Array.from(o.values()).map((r) => ({
    value: r.value,
    name: r.name,
    usageCount: r.usageCount,
    nodeIds: r.nodeIds,
    source: Array.from(r.source)
  }));
  N.sort((r, p) => p.usageCount - r.usageCount);
  const b = Array.from(e.values());
  b.sort((r, p) => p.usageCount - r.usageCount);
  const z = Array.from(t.values());
  z.sort((r, p) => p.usageCount - r.usageCount);
  const M = Array.from(a.values());
  M.sort((r, p) => r.value - p.value);
  const $ = Array.from(s.values());
  $.sort((r, p) => p.usageCount - r.usageCount);
  const F = Array.from(c.values());
  F.sort((r, p) => p.usageCount - r.usageCount);
  const P = Array.from(h.values());
  return P.sort((r, p) => p.usageCount - r.usageCount), {
    colors: N,
    gradients: b,
    typography: z,
    spacing: M,
    borders: $,
    shadows: F,
    imageFills: f,
    components: P
  };
}
function J(i, n, o, e, t) {
  const a = i.get(n);
  if (a)
    a.usageCount++, a.nodeIds.includes(o) || a.nodeIds.push(o), a.source.add(e), t && a.name.startsWith("color-") && (a.name = t);
  else {
    const s = `color-${n.replace(/^#/, "").replace(/[^a-f0-9]/gi, "")}`;
    i.set(n, {
      value: n,
      name: t ?? s,
      usageCount: 1,
      nodeIds: [o],
      source: /* @__PURE__ */ new Set([e])
    });
  }
}
function ee(i, n, o, e) {
  const t = n.fontFamily ?? "Unknown", a = n.fontSize ?? 16, s = n.fontWeight ?? 400, c = n.lineHeightPx ?? null, f = n.letterSpacing ?? 0, h = `${t}|${a}|${s}|${c}|${f}`, x = i.get(h);
  if (x)
    x.usageCount++, x.nodeIds.includes(o) || x.nodeIds.push(o), e && x.name.startsWith(t) && (x.name = e);
  else {
    const y = `${t}-${a}-${s}`;
    i.set(h, {
      fontFamily: t,
      fontSize: a,
      fontWeight: s,
      lineHeight: c,
      letterSpacing: f,
      name: e ?? y,
      usageCount: 1,
      nodeIds: [o]
    });
  }
}
function _(i, n, o) {
  if (n === 0) return;
  const e = i.get(n);
  e ? (e.usageCount++, e.sources.includes(o) || e.sources.push(o)) : i.set(n, {
    value: n,
    usageCount: 1,
    sources: [o]
  });
}
function Ne(i) {
  return !i.strokes || !Array.isArray(i.strokes) ? !1 : i.strokes.some((n) => n.visible !== !1 && n.type === "SOLID");
}
function Te(i, n) {
  var e, t;
  const o = (e = i.styleRefs) == null ? void 0 : e.fill;
  return o ? ((t = n[o]) == null ? void 0 : t.name) ?? null : null;
}
function Se(i, n) {
  var e, t;
  const o = (e = i.styleRefs) == null ? void 0 : e.stroke;
  return o ? ((t = n[o]) == null ? void 0 : t.name) ?? null : null;
}
function Ae(i, n) {
  var e, t;
  const o = (e = i.styleRefs) == null ? void 0 : e.text;
  return o ? ((t = n[o]) == null ? void 0 : t.name) ?? null : null;
}
function Re(i, n) {
  var e, t;
  const o = (e = i.styleRefs) == null ? void 0 : e.effect;
  return o ? ((t = n[o]) == null ? void 0 : t.name) ?? null : null;
}
const Ie = 500, Ee = 2e3;
async function $e(i) {
  const { shell: n, token: o, fileKey: e, nodeId: t, scope: a } = i;
  let s, c, f;
  if (a === "node" || a === "frame") {
    if (!t)
      throw new Error(
        `Cannot extract ${a}: no node ID found in the URL. Paste a Figma URL that includes a node-id, or switch to "Entire Page" scope.`
      );
    const w = await de(n, o, e, t);
    s = [w.rootNode], c = w.components, f = w.styles;
  } else {
    const w = await ue(n, o, e), N = w.rootNodes[0];
    s = (N == null ? void 0 : N.children) || [], c = w.components, f = w.styles;
  }
  let h = 0;
  for (const w of s)
    h += Z(w);
  let x;
  h > Ie && (x = {
    nodeCount: h,
    message: `This selection has ~${h} nodes. Large extractions may produce verbose output.`
  });
  const y = we(s, c);
  h > Ee && (y.truncated = !0);
  const v = Ce(y.rootNodes, f);
  return { extraction: y, tokens: v, largeTreeWarning: x };
}
function Le(i) {
  const n = { frames: 0, autoLayoutFrames: 0, components: [], textNodes: 0, hiddenNodes: 0 }, o = /* @__PURE__ */ new Map();
  function e(t) {
    if (t.visible || n.hiddenNodes++, (t.type === "FRAME" || t.type === "GROUP" || t.type === "SECTION") && (n.frames++, t.autoLayout && n.autoLayoutFrames++), t.type === "TEXT" && n.textNodes++, t.componentRef) {
      const a = t.componentRef.componentName, s = t.repeatCount ?? 1;
      o.set(a, (o.get(a) ?? 0) + s);
    }
    t.children && t.children.forEach(e);
  }
  return i.forEach(e), n.components = Array.from(o.entries()).map(([t, a]) => ({ name: t, count: a })).sort((t, a) => a.count - t.count), n;
}
function ie({ nodes: i, depth: n = 0, maxDepth: o = 2 }) {
  return n >= o ? null : /* @__PURE__ */ l("div", { style: { paddingLeft: n > 0 ? "12px" : "0", borderLeft: n > 0 ? "1px solid var(--border)" : "none" }, children: i.map((e, t) => {
    const a = e.componentRef ? `<${e.componentRef.componentName}${e.repeatCount ? ` x${e.repeatCount}` : ""}>` : e.type === "TEXT" ? `"${(e.textContent ?? "").slice(0, 30)}${(e.textContent ?? "").length > 30 ? "..." : ""}"` : e.name, s = e.autoLayout ? `${e.autoLayout.flexDirection}` : e.type === "INSTANCE" ? "component" : e.type.toLowerCase();
    return /* @__PURE__ */ u("div", { style: { fontSize: "11px", lineHeight: 1.7 }, children: [
      /* @__PURE__ */ u("span", { style: { color: "var(--text-muted)" }, children: [
        s,
        " "
      ] }),
      /* @__PURE__ */ l("span", { style: { color: e.visible === !1 ? "var(--text-muted)" : "var(--text-primary)" }, children: a }),
      e.visible === !1 && /* @__PURE__ */ l("span", { style: { color: "var(--text-muted)", marginLeft: "4px" }, children: "(hidden)" }),
      e.children && e.children.length > 0 && n + 1 < o && /* @__PURE__ */ l(ie, { nodes: e.children, depth: n + 1, maxDepth: o }),
      e.children && e.children.length > 0 && n + 1 >= o && /* @__PURE__ */ u("span", { style: { color: "var(--text-muted)", fontSize: "11px", marginLeft: "12px" }, children: [
        "(",
        e.children.length,
        " children)"
      ] })
    ] }, e.id || t);
  }) });
}
function Fe({ token: i }) {
  const n = K(), o = (n == null ? void 0 : n.shell) ?? null, e = (n == null ? void 0 : n.actions) ?? null, [t, a] = C(""), [s, c] = C(null), [f, h] = C("page"), [x, y] = C(null), [v, w] = C(!1), [N, b] = C(null), [z, M] = C(!1), [$, F] = C(null), [P, r] = C(null), [p, R] = C(!1), [W, g] = C(!1), d = re(
    () => $ ? Le($.rootNodes) : null,
    [$]
  ), m = V(null), k = V(o);
  k.current = o;
  const S = V(0), L = V(0), H = E(
    (I) => {
      const O = I.target.value;
      if (a(O), !O.trim()) {
        c(null), y(null), b(null), w(!1), F(null), r(null), R(!1), g(!1), m.current = null;
        return;
      }
      const T = pe(O);
      if (!T) {
        c(null), y(null), b("Please paste a valid Figma URL (file, design, proto, or board link)"), w(!1);
        return;
      }
      c(T), b(null), y(null), F(null), r(null), R(!1), g(!1), m.current = null, T.nodeId ? h("node") : h("page");
    },
    []
  );
  G(() => {
    if (!s || !k.current) return;
    const I = ++S.current, O = k.current;
    w(!0), y(null), b(null), (async () => {
      try {
        const T = await ce(O, i, s.fileKey);
        S.current === I && (y(T), w(!1));
      } catch (T) {
        if (S.current === I) {
          const A = (T == null ? void 0 : T.message) || "Failed to validate file access.";
          A.includes("403") || A.includes("Invalid or expired") ? b("Cannot access this file. Check that your token has File content (Read) scope.") : A.includes("404") || A.includes("not found") ? b("File not found. Check that the URL is correct.") : A.includes("429") || A.includes("Rate limited") ? b("Rate limited by Figma. Please wait a moment and try again.") : b(A), w(!1);
        }
      }
    })();
  }, [s, i]);
  const D = E(() => {
    const I = k.current;
    if (!I || !s) return;
    const O = ++L.current;
    M(!0), F(null), b(null), r(null), R(!1), m.current = null, (async () => {
      try {
        const T = await $e({
          shell: I,
          token: i,
          fileKey: s.fileKey,
          nodeId: s.nodeId,
          scope: f
        });
        if (L.current !== O) return;
        if (T.largeTreeWarning) {
          m.current = T, r(T.largeTreeWarning), R(!0), M(!1);
          return;
        }
        F(T.extraction), e && e.showToast(`Extracted ${T.extraction.nodeCount} nodes`, "success");
      } catch (T) {
        if (L.current !== O) return;
        const A = (T == null ? void 0 : T.message) || "Extraction failed.";
        A.includes("403") || A.includes("Invalid or expired") ? b("Cannot access this file. Check that your token has File content (Read) scope.") : A.includes("404") || A.includes("not found") ? b("File not found. Check that the URL is correct.") : A.includes("429") || A.includes("Rate limited") ? b("Rate limited by Figma. Please wait a moment and try again.") : A.includes("timeout") || A.includes("timed out") ? b("Request timed out. Try a smaller selection or check your connection.") : b(A);
      } finally {
        L.current === O && M(!1);
      }
    })();
  }, [s, i, f, e]), j = E(() => {
    const I = m.current;
    I && (R(!1), r(null), F(I.extraction), m.current = null, e && e.showToast(`Extracted ${I.extraction.nodeCount} nodes`, "success"));
  }, [e]), U = E(() => {
    R(!1), r(null), m.current = null;
  }, []), oe = !s || !x || v || z;
  return /* @__PURE__ */ u("div", { children: [
    /* @__PURE__ */ u("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ l("label", { className: "figma-plugin-label", children: "Figma URL" }),
      /* @__PURE__ */ l(
        "input",
        {
          className: "figma-plugin-input",
          type: "text",
          placeholder: "https://www.figma.com/design/...",
          value: t,
          onChange: H
        }
      ),
      N && /* @__PURE__ */ l("div", { className: "figma-plugin-error", children: N })
    ] }),
    s && /* @__PURE__ */ l("div", { className: "figma-plugin-section", children: /* @__PURE__ */ u("div", { className: "figma-plugin-file-info", children: [
      v && /* @__PURE__ */ u("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: x ? "8px" : "0" }, children: [
        /* @__PURE__ */ l("span", { className: "figma-plugin-spinner" }),
        /* @__PURE__ */ l("span", { style: { color: "var(--text-secondary)" }, children: "Checking access..." })
      ] }),
      x && /* @__PURE__ */ u("div", { style: { marginBottom: "8px" }, children: [
        /* @__PURE__ */ l("div", { style: { fontWeight: 600, fontSize: "13px", marginBottom: "4px" }, children: x.name }),
        /* @__PURE__ */ u("div", { style: { color: "var(--text-secondary)" }, children: [
          x.pages.length,
          " page",
          x.pages.length !== 1 ? "s" : ""
        ] })
      ] }),
      !v && /* @__PURE__ */ u("div", { style: { color: "var(--text-muted)", lineHeight: 1.6 }, children: [
        /* @__PURE__ */ u("div", { children: [
          "File key: ",
          s.fileKey
        ] }),
        /* @__PURE__ */ u("div", { children: [
          "Node: ",
          s.nodeId || "None (file-level)"
        ] }),
        /* @__PURE__ */ u("div", { children: [
          "Type: ",
          s.fileType
        ] })
      ] })
    ] }) }),
    s && /* @__PURE__ */ u("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ l("label", { className: "figma-plugin-label", children: "Extraction Scope" }),
      /* @__PURE__ */ u("div", { className: "figma-plugin-radio-group", children: [
        /* @__PURE__ */ u("label", { className: "figma-plugin-radio-label", style: s.nodeId ? void 0 : { opacity: 0.5, cursor: "not-allowed" }, children: [
          /* @__PURE__ */ l(
            "input",
            {
              type: "radio",
              name: "scope",
              value: "node",
              checked: f === "node",
              onChange: () => h("node"),
              disabled: !s.nodeId
            }
          ),
          "Single Node",
          !s.nodeId && /* @__PURE__ */ l("span", { className: "figma-plugin-hint", style: { marginTop: 0, marginLeft: "4px" }, children: "Paste a URL with a node-id to use this option" })
        ] }),
        /* @__PURE__ */ u("label", { className: "figma-plugin-radio-label", children: [
          /* @__PURE__ */ l(
            "input",
            {
              type: "radio",
              name: "scope",
              value: "frame",
              checked: f === "frame",
              onChange: () => h("frame")
            }
          ),
          "Frame"
        ] }),
        /* @__PURE__ */ u("label", { className: "figma-plugin-radio-label", children: [
          /* @__PURE__ */ l(
            "input",
            {
              type: "radio",
              name: "scope",
              value: "page",
              checked: f === "page",
              onChange: () => h("page")
            }
          ),
          "Entire Page"
        ] })
      ] })
    ] }),
    z && /* @__PURE__ */ l("div", { className: "figma-plugin-section", children: /* @__PURE__ */ u("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
      /* @__PURE__ */ l("span", { className: "figma-plugin-spinner" }),
      /* @__PURE__ */ l("span", { style: { color: "var(--text-secondary)" }, children: "Extracting layout..." })
    ] }) }),
    p && P && /* @__PURE__ */ l("div", { className: "figma-plugin-section", children: /* @__PURE__ */ u("div", { className: "figma-plugin-warning", children: [
      /* @__PURE__ */ u("strong", { children: [
        P.nodeCount,
        " nodes detected"
      ] }),
      /* @__PURE__ */ l("p", { children: "Large selections may take longer and produce verbose output. Continue?" }),
      /* @__PURE__ */ u("div", { className: "figma-plugin-warning-actions", children: [
        /* @__PURE__ */ l("button", { className: "btn-primary", onClick: j, children: "Continue" }),
        /* @__PURE__ */ l("button", { className: "btn-secondary", onClick: U, children: "Cancel" })
      ] })
    ] }) }),
    $ && d && /* @__PURE__ */ l("div", { className: "figma-plugin-section", children: /* @__PURE__ */ u("div", { className: "figma-plugin-file-info", children: [
      /* @__PURE__ */ u("div", { style: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }, children: [
        /* @__PURE__ */ l("span", { style: { color: "#38a169" }, children: "✓" }),
        /* @__PURE__ */ l("span", { style: { fontWeight: 600, fontSize: "13px" }, children: "Layout extracted" }),
        $.truncated && /* @__PURE__ */ l("span", { style: { color: "#f59e0b", fontSize: "11px" }, children: "(truncated)" })
      ] }),
      /* @__PURE__ */ u("div", { style: { color: "var(--text-secondary)", fontSize: "12px", lineHeight: 1.6 }, children: [
        $.nodeCount,
        " nodes · ",
        d.autoLayoutFrames,
        " auto-layout frames · ",
        d.textNodes,
        " text layers"
      ] }),
      d.components.length > 0 && /* @__PURE__ */ u("div", { style: { marginTop: "8px" }, children: [
        /* @__PURE__ */ l("div", { style: { color: "var(--text-muted)", fontSize: "11px", marginBottom: "4px" }, children: "Components" }),
        /* @__PURE__ */ u("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px" }, children: [
          d.components.slice(0, 8).map((I) => /* @__PURE__ */ u(
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
          d.components.length > 8 && /* @__PURE__ */ u("span", { style: { fontSize: "11px", color: "var(--text-muted)", padding: "2px 4px" }, children: [
            "+",
            d.components.length - 8,
            " more"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ l(
        "button",
        {
          onClick: () => g(!W),
          style: {
            background: "none",
            border: "none",
            color: "var(--accent, #0d99ff)",
            fontSize: "11px",
            cursor: "pointer",
            padding: "4px 0",
            marginTop: "8px"
          },
          children: W ? "Hide tree" : "Show tree preview"
        }
      ),
      W && /* @__PURE__ */ l("div", { style: { marginTop: "6px", padding: "8px", background: "var(--bg-primary)", borderRadius: "4px", border: "1px solid var(--border)", maxHeight: "200px", overflowY: "auto" }, children: /* @__PURE__ */ l(ie, { nodes: $.rootNodes }) })
    ] }) }),
    /* @__PURE__ */ l(
      "button",
      {
        className: "btn-primary",
        onClick: D,
        disabled: oe,
        style: { width: "100%" },
        children: z ? "Extracting..." : "Extract Design Brief"
      }
    )
  ] });
}
function Pe({ onClick: i }) {
  return /* @__PURE__ */ l(
    "button",
    {
      onClick: i,
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
      children: /* @__PURE__ */ u(
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
function Oe() {
  const i = K(), n = (i == null ? void 0 : i.storage) ?? null, o = (i == null ? void 0 : i.actions) ?? null, [e, t] = C(!1), [a, s] = C(null), [c, f] = C(null), [h, x] = C(!1), [y, v] = C("main");
  G(() => {
    if (!n) return;
    let r = !1;
    return (async () => {
      try {
        const p = await n.read();
        !r && typeof p.figmaToken == "string" && (s(p.figmaToken), typeof p.figmaUserHandle == "string" && f({ id: "", handle: p.figmaUserHandle, img_url: "" }));
      } catch (p) {
        console.error("[figma] Failed to read storage:", p);
      } finally {
        r || x(!0);
      }
    })(), () => {
      r = !0;
    };
  }, [n]);
  const w = E(() => t(!0), []), N = E(() => {
    t(!1), v("main");
  }, []), b = E(async (r, p) => {
    if (!(!n || !o))
      try {
        const R = await n.read();
        await n.write({ ...R, figmaToken: r, figmaUserHandle: p.handle }), s(r), f(p), v("main"), o.showToast(`Connected as ${p.handle}`, "success");
      } catch {
        o.showToast("Failed to save token. Please try again.", "error");
      }
  }, [n, o]), z = E(async (r, p) => {
    if (!(!n || !o))
      try {
        const R = await n.read();
        await n.write({ ...R, figmaToken: r, figmaUserHandle: p.handle }), s(r), f(p), v("main"), o.showToast(`Token updated — connected as ${p.handle}`, "success");
      } catch {
        o.showToast("Failed to save token. Please try again.", "error");
      }
  }, [n, o]), M = E(async () => {
    if (!(!n || !o))
      try {
        const r = await n.read(), { figmaToken: p, figmaUserHandle: R, ...W } = r;
        await n.write(W), s(null), f(null), v("main"), o.showToast("Disconnected from Figma", "info");
      } catch {
        o.showToast("Failed to remove token. Please try again.", "error");
      }
  }, [n, o]), $ = "Figma", F = a ? /* @__PURE__ */ l(Pe, { onClick: () => v("settings") }) : void 0;
  let P = null;
  return h && (a ? y === "settings" && c ? P = /* @__PURE__ */ l(
    ge,
    {
      currentUser: c,
      onTokenUpdated: z,
      onTokenRemoved: M,
      onBack: () => v("main")
    }
  ) : P = /* @__PURE__ */ l(Fe, { token: a }) : P = /* @__PURE__ */ l(fe, { onTokenSaved: b })), /* @__PURE__ */ u(Y, { children: [
    /* @__PURE__ */ l(
      "button",
      {
        onClick: w,
        title: "Figma Design Brief",
        className: "toolbar-icon-btn",
        children: /* @__PURE__ */ u(
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
      se,
      {
        open: e,
        onClose: N,
        title: $,
        headerRight: F,
        children: P
      }
    )
  ] });
}
const We = "Figma", He = {
  toolbar: Oe
};
function De() {
  console.log("[figma] Plugin activated");
}
function _e() {
  console.log("[figma] Plugin deactivated");
}
export {
  We as name,
  De as onActivate,
  _e as onDeactivate,
  He as slots
};
