import { jsx as a, jsxs as s, Fragment as V } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export const jsx=R.createElement;export const jsxs=R.createElement;export const Fragment=R.Fragment;";
import { useEffect as W, useCallback as k, useState as f, useMemo as ne, useRef as B } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export default R;export const{useState,useEffect,useCallback,useRef,useMemo,useContext,createContext,createElement,Fragment}=R;";
const K = window;
function $() {
  const i = K.__SHIPSTUDIO_REACT__, t = K.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__;
  return t && (i != null && i.useContext) ? i.useContext(t) : null;
}
const D = "figma-plugin-styles", te = `
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
function ie({ open: i, onClose: t, title: r, headerRight: e, children: n }) {
  W(() => {
    if (!i) return;
    let o = document.getElementById(D);
    return o || (o = document.createElement("style"), o.id = D, o.textContent = te, document.head.appendChild(o)), () => {
      const c = document.getElementById(D);
      c && c.remove();
    };
  }, [i]), W(() => {
    if (!i) return;
    const o = (c) => {
      c.key === "Escape" && t();
    };
    return document.addEventListener("keydown", o), () => document.removeEventListener("keydown", o);
  }, [i, t]);
  const l = k(
    (o) => {
      o.target === o.currentTarget && t();
    },
    [t]
  );
  return i ? /* @__PURE__ */ a("div", { className: "figma-plugin-overlay", onClick: l, children: /* @__PURE__ */ s("div", { className: "figma-plugin-modal", children: [
    /* @__PURE__ */ s("div", { className: "figma-plugin-modal-header", children: [
      /* @__PURE__ */ s(
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
            /* @__PURE__ */ a("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1" }),
            /* @__PURE__ */ a("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1" }),
            /* @__PURE__ */ a("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1" }),
            /* @__PURE__ */ a("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1" })
          ]
        }
      ),
      /* @__PURE__ */ a("span", { className: "figma-plugin-modal-title", children: r }),
      e && /* @__PURE__ */ a("div", { style: { marginLeft: "auto", display: "flex", alignItems: "center" }, children: e })
    ] }),
    /* @__PURE__ */ a("div", { className: "figma-plugin-modal-body", children: n })
  ] }) }) : null;
}
const ae = "https://api.figma.com/v1";
async function M(i, t, r, e) {
  const n = `${ae}${t}`, l = Math.ceil(((e == null ? void 0 : e.timeout) ?? 3e4) / 1e3), o = [
    "-sS",
    "--max-time",
    String(l),
    "-H",
    `X-Figma-Token: ${r}`,
    n
  ], c = await i.exec("curl", o, {
    timeout: (e == null ? void 0 : e.timeout) ?? 12e4
  });
  if (c.exit_code !== 0)
    throw new Error(`Figma API request failed: ${c.stderr || `exit code ${c.exit_code}`}`);
  if (!c.stdout.trim())
    throw new Error("Empty response from Figma API");
  let d;
  try {
    d = JSON.parse(c.stdout);
  } catch {
    throw new Error(`Invalid JSON from Figma API: ${c.stdout.slice(0, 200)}`);
  }
  if (d.status && d.err)
    throw d.status === 429 ? new Error("Rate limited by Figma API. Try again in a moment.") : d.status === 403 ? new Error("Invalid or expired token. Please update your Figma token.") : d.status === 404 ? new Error("File not found. Check that the URL is correct and you have access.") : new Error(`Figma API error: ${d.err}`);
  return d;
}
async function X(i, t) {
  return M(i, "/me", t);
}
async function re(i, t, r) {
  const e = await M(i, `/files/${r}?depth=1`, t);
  return {
    name: e.name,
    pages: e.document.children.filter((n) => n.type === "CANVAS").map((n) => ({ id: n.id, name: n.name }))
  };
}
async function oe(i, t, r, e) {
  const n = await M(
    i,
    `/files/${r}/nodes?ids=${encodeURIComponent(e)}`,
    t,
    { timeout: 12e4 }
  ), l = n.nodes[e];
  if (!l) {
    const o = Object.keys(n.nodes), c = o.find(
      (d) => d.replace(/%3A/g, ":") === e || d === e.replace(/:/g, "%3A")
    );
    if (c)
      return {
        rootNode: n.nodes[c].document,
        components: n.nodes[c].components
      };
    throw new Error(
      `Node "${e}" not found in API response. Available nodes: ${o.join(", ")}`
    );
  }
  return {
    rootNode: l.document,
    components: l.components
  };
}
async function le(i, t, r) {
  const e = await M(
    i,
    `/files/${r}`,
    t,
    { timeout: 12e4 }
  );
  return {
    rootNodes: e.document.children,
    components: e.components
  };
}
function se({ onTokenSaved: i }) {
  const t = $(), r = (t == null ? void 0 : t.shell) ?? null, [e, n] = f(""), [l, o] = f(!1), [c, d] = f(null), x = k(async () => {
    if (!r) return;
    const u = e.trim();
    if (!(!u || l)) {
      o(!0), d(null);
      try {
        const p = await X(r, u);
        i(u, p);
      } catch (p) {
        d((p == null ? void 0 : p.message) || "Failed to validate token. Please check and try again.");
      } finally {
        o(!1);
      }
    }
  }, [e, l, r, i]), b = k(
    (u) => {
      u.key === "Enter" && x();
    },
    [x]
  );
  return /* @__PURE__ */ s("div", { children: [
    /* @__PURE__ */ s("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ a("h3", { style: { fontSize: "14px", fontWeight: 600, margin: "0 0 8px 0" }, children: "Connect to Figma" }),
      /* @__PURE__ */ s("p", { style: { fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 16px 0", lineHeight: 1.5 }, children: [
        "To get started, you need a Figma Personal Access Token.",
        " ",
        /* @__PURE__ */ a(
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
    /* @__PURE__ */ s("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ a("label", { className: "figma-plugin-label", children: "Personal Access Token" }),
      /* @__PURE__ */ a(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: e,
          onChange: (u) => n(u.target.value),
          onKeyDown: b,
          disabled: l
        }
      ),
      c && /* @__PURE__ */ a("div", { className: "figma-plugin-error", children: c }),
      /* @__PURE__ */ a("div", { className: "figma-plugin-hint", children: "Token is stored locally in this project only." })
    ] }),
    /* @__PURE__ */ a(
      "button",
      {
        className: "btn-primary",
        onClick: x,
        disabled: !e.trim() || l,
        style: { width: "100%", marginTop: "4px" },
        children: l ? /* @__PURE__ */ s(V, { children: [
          /* @__PURE__ */ a("span", { className: "figma-plugin-spinner", style: { marginRight: "8px", verticalAlign: "middle" } }),
          "Connecting..."
        ] }) : "Connect"
      }
    )
  ] });
}
function ce({ currentUser: i, onTokenUpdated: t, onTokenRemoved: r, onBack: e }) {
  const n = $(), l = (n == null ? void 0 : n.shell) ?? null, [o, c] = f(""), [d, x] = f(!1), [b, u] = f(null), p = k(async () => {
    if (!l) return;
    const C = o.trim();
    if (!(!C || d)) {
      x(!0), u(null);
      try {
        const g = await X(l, C);
        t(C, g);
      } catch (g) {
        u((g == null ? void 0 : g.message) || "Failed to validate token. Please check and try again.");
      } finally {
        x(!1);
      }
    }
  }, [o, d, l, t]), T = k(
    (C) => {
      C.key === "Enter" && p();
    },
    [p]
  );
  return /* @__PURE__ */ s("div", { children: [
    /* @__PURE__ */ s(
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
          /* @__PURE__ */ a("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ a("polyline", { points: "15 18 9 12 15 6" }) }),
          "Back"
        ]
      }
    ),
    /* @__PURE__ */ a("div", { className: "figma-plugin-section", children: /* @__PURE__ */ s("div", { className: "figma-plugin-success", style: { display: "flex", alignItems: "center", gap: "6px", marginTop: "0" }, children: [
      /* @__PURE__ */ a("span", { style: { fontSize: "10px" }, children: "●" }),
      "Connected as ",
      i.handle
    ] }) }),
    /* @__PURE__ */ s("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ a("label", { className: "figma-plugin-label", children: "Update Token" }),
      /* @__PURE__ */ a(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: o,
          onChange: (C) => c(C.target.value),
          onKeyDown: T,
          disabled: d
        }
      ),
      b && /* @__PURE__ */ a("div", { className: "figma-plugin-error", children: b }),
      /* @__PURE__ */ a(
        "button",
        {
          className: "btn-primary",
          onClick: p,
          disabled: !o.trim() || d,
          style: { width: "100%", marginTop: "8px" },
          children: d ? /* @__PURE__ */ s(V, { children: [
            /* @__PURE__ */ a("span", { className: "figma-plugin-spinner", style: { marginRight: "8px", verticalAlign: "middle" } }),
            "Validating..."
          ] }) : "Update"
        }
      )
    ] }),
    /* @__PURE__ */ a("div", { className: "figma-plugin-section", style: { borderTop: "1px solid var(--border)", paddingTop: "16px" }, children: /* @__PURE__ */ a(
      "button",
      {
        className: "btn-secondary",
        onClick: r,
        style: { width: "100%" },
        children: "Disconnect"
      }
    ) })
  ] });
}
function de(i) {
  const t = i.match(
    /figma\.com\/(file|design|proto|board)\/([A-Za-z0-9]+)/
  );
  if (!t) return null;
  const r = t[1], e = t[2];
  let n = null;
  const l = i.match(/[?&]node-id=([^&]+)/);
  return l && (n = decodeURIComponent(l[1]).replace(/-/g, ":")), { fileKey: e, nodeId: n, fileType: r };
}
function ue(i) {
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
function pe(i) {
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
function ge(i) {
  const t = {
    flexDirection: i.layoutMode === "HORIZONTAL" ? "row" : "column",
    justifyContent: ue(i.primaryAxisAlignItems),
    alignItems: pe(i.counterAxisAlignItems),
    gap: i.itemSpacing ?? 0,
    padding: {
      top: i.paddingTop ?? 0,
      right: i.paddingRight ?? 0,
      bottom: i.paddingBottom ?? 0,
      left: i.paddingLeft ?? 0
    },
    flexWrap: i.layoutWrap === "WRAP" ? "wrap" : "nowrap"
  };
  return i.layoutWrap === "WRAP" && (t.rowGap = i.counterAxisSpacing ?? 0), t;
}
function fe(i, t) {
  const r = t[i.componentId];
  let e;
  if (i.componentProperties) {
    const l = {};
    for (const [o, c] of Object.entries(i.componentProperties))
      (c.type === "VARIANT" || c.type === "BOOLEAN" || c.type === "TEXT") && (l[o] = c.value);
    Object.keys(l).length > 0 && (e = l);
  }
  const n = {
    componentId: i.componentId,
    componentName: (r == null ? void 0 : r.name) ?? i.name,
    isRemote: (r == null ? void 0 : r.remote) ?? !1,
    source: r != null && r.remote ? "library" : "local"
  };
  return r != null && r.description && (n.description = r.description), e && (n.variantProperties = e), i.overrides && (n.overrides = i.overrides), n;
}
function G(i, t, r) {
  const e = i;
  if (e.type === "SLICE") return null;
  const n = {
    id: e.id,
    name: e.name,
    type: e.type,
    visible: e.visible !== !1
    // defaults to true when undefined
  };
  switch (e.absoluteBoundingBox != null ? (n.width = e.absoluteBoundingBox.width, n.height = e.absoluteBoundingBox.height) : e.size != null && (n.width = e.size.x, n.height = e.size.y), "layoutSizingHorizontal" in e && (n.widthMode = e.layoutSizingHorizontal), "layoutSizingVertical" in e && (n.heightMode = e.layoutSizingVertical), "layoutPositioning" in e && e.layoutPositioning != null && (n.positioning = e.layoutPositioning), "layoutMode" in e && e.layoutMode && e.layoutMode !== "NONE" && (n.autoLayout = ge(e)), "constraints" in e && e.constraints != null && (n.constraints = e.constraints), "minWidth" in e && e.minWidth != null && (n.minWidth = e.minWidth), "maxWidth" in e && e.maxWidth != null && (n.maxWidth = e.maxWidth), "minHeight" in e && e.minHeight != null && (n.minHeight = e.minHeight), "maxHeight" in e && e.maxHeight != null && (n.maxHeight = e.maxHeight), "preserveRatio" in e && e.preserveRatio != null && (n.preserveRatio = e.preserveRatio), e.type) {
    case "TEXT":
      n.textContent = e.characters;
      break;
    case "INSTANCE":
      return n.componentRef = fe(e, t), n;
    case "BOOLEAN_OPERATION":
      return n;
  }
  if ("children" in e && Array.isArray(e.children)) {
    const l = e.children.map((o) => G(o, t)).filter((o) => o !== null);
    n.children = he(l);
  }
  return n;
}
function j(i) {
  let t = 1;
  if (i.children && Array.isArray(i.children))
    for (const r of i.children)
      t += j(r);
  return t;
}
function me(i) {
  const t = i.componentRef, r = t.variantProperties ? JSON.stringify(t.variantProperties, Object.keys(t.variantProperties).sort()) : "";
  return `${t.componentId}::${r}`;
}
function he(i) {
  if (i.length === 0) return [];
  const t = /* @__PURE__ */ new Map();
  for (let n = 0; n < i.length; n++) {
    const l = i[n];
    if (l.componentRef) {
      const o = me(l), c = t.get(o);
      c ? (c.count++, c.indices.push(n)) : t.set(o, { node: l, count: 1, indices: [n] });
    }
  }
  const r = /* @__PURE__ */ new Set();
  for (const n of t.values())
    if (n.count >= 3) {
      n.node.repeatCount = n.count;
      for (let l = 1; l < n.indices.length; l++)
        r.add(n.indices[l]);
    }
  const e = [];
  for (let n = 0; n < i.length; n++)
    r.has(n) || e.push(i[n]);
  return e;
}
function xe(i, t) {
  let r = 0;
  for (const n of i)
    r += j(n);
  return {
    rootNodes: i.map((n) => G(n, t)).filter((n) => n !== null),
    nodeCount: r,
    truncated: !1
  };
}
const ye = 500, ve = 2e3;
async function be(i) {
  const { shell: t, token: r, fileKey: e, nodeId: n, scope: l } = i;
  let o, c;
  if (l === "node" || l === "frame") {
    if (!n)
      throw new Error(
        `Cannot extract ${l}: no node ID found in the URL. Paste a Figma URL that includes a node-id, or switch to "Entire Page" scope.`
      );
    const u = await oe(t, r, e, n);
    o = [u.rootNode], c = u.components;
  } else {
    const u = await le(t, r, e), p = u.rootNodes[0];
    o = (p == null ? void 0 : p.children) || [], c = u.components;
  }
  let d = 0;
  for (const u of o)
    d += j(u);
  let x;
  d > ye && (x = {
    nodeCount: d,
    message: `This selection has ~${d} nodes. Large extractions may produce verbose output.`
  });
  const b = xe(o, c);
  return d > ve && (b.truncated = !0), { extraction: b, largeTreeWarning: x };
}
function we(i) {
  const t = { frames: 0, autoLayoutFrames: 0, components: [], textNodes: 0, hiddenNodes: 0 }, r = /* @__PURE__ */ new Map();
  function e(n) {
    if (n.visible || t.hiddenNodes++, (n.type === "FRAME" || n.type === "GROUP" || n.type === "SECTION") && (t.frames++, n.autoLayout && t.autoLayoutFrames++), n.type === "TEXT" && t.textNodes++, n.componentRef) {
      const l = n.componentRef.componentName, o = n.repeatCount ?? 1;
      r.set(l, (r.get(l) ?? 0) + o);
    }
    n.children && n.children.forEach(e);
  }
  return i.forEach(e), t.components = Array.from(r.entries()).map(([n, l]) => ({ name: n, count: l })).sort((n, l) => l.count - n.count), t;
}
function q({ nodes: i, depth: t = 0, maxDepth: r = 2 }) {
  return t >= r ? null : /* @__PURE__ */ a("div", { style: { paddingLeft: t > 0 ? "12px" : "0", borderLeft: t > 0 ? "1px solid var(--border)" : "none" }, children: i.map((e, n) => {
    const l = e.componentRef ? `<${e.componentRef.componentName}${e.repeatCount ? ` x${e.repeatCount}` : ""}>` : e.type === "TEXT" ? `"${(e.textContent ?? "").slice(0, 30)}${(e.textContent ?? "").length > 30 ? "..." : ""}"` : e.name, o = e.autoLayout ? `${e.autoLayout.flexDirection}` : e.type === "INSTANCE" ? "component" : e.type.toLowerCase();
    return /* @__PURE__ */ s("div", { style: { fontSize: "11px", lineHeight: 1.7 }, children: [
      /* @__PURE__ */ s("span", { style: { color: "var(--text-muted)" }, children: [
        o,
        " "
      ] }),
      /* @__PURE__ */ a("span", { style: { color: e.visible === !1 ? "var(--text-muted)" : "var(--text-primary)" }, children: l }),
      e.visible === !1 && /* @__PURE__ */ a("span", { style: { color: "var(--text-muted)", marginLeft: "4px" }, children: "(hidden)" }),
      e.children && e.children.length > 0 && t + 1 < r && /* @__PURE__ */ a(q, { nodes: e.children, depth: t + 1, maxDepth: r }),
      e.children && e.children.length > 0 && t + 1 >= r && /* @__PURE__ */ s("span", { style: { color: "var(--text-muted)", fontSize: "11px", marginLeft: "12px" }, children: [
        "(",
        e.children.length,
        " children)"
      ] })
    ] }, e.id || n);
  }) });
}
function ke({ token: i }) {
  const t = $(), r = (t == null ? void 0 : t.shell) ?? null, e = (t == null ? void 0 : t.actions) ?? null, [n, l] = f(""), [o, c] = f(null), [d, x] = f("page"), [b, u] = f(null), [p, T] = f(!1), [C, g] = f(null), [F, P] = f(!1), [E, R] = f(null), [A, m] = f(null), [y, N] = f(!1), [z, _] = f(!1), S = ne(
    () => E ? we(E.rootNodes) : null,
    [E]
  ), L = B(null), U = B(r);
  U.current = r;
  const O = B(0), H = B(0), J = k(
    (w) => {
      const I = w.target.value;
      if (l(I), !I.trim()) {
        c(null), u(null), g(null), T(!1), R(null), m(null), N(!1), _(!1), L.current = null;
        return;
      }
      const h = de(I);
      if (!h) {
        c(null), u(null), g("Please paste a valid Figma URL (file, design, proto, or board link)"), T(!1);
        return;
      }
      c(h), g(null), u(null), R(null), m(null), N(!1), _(!1), L.current = null, h.nodeId ? x("node") : x("page");
    },
    []
  );
  W(() => {
    if (!o || !U.current) return;
    const w = ++O.current, I = U.current;
    T(!0), u(null), g(null), (async () => {
      try {
        const h = await re(I, i, o.fileKey);
        O.current === w && (u(h), T(!1));
      } catch (h) {
        if (O.current === w) {
          const v = (h == null ? void 0 : h.message) || "Failed to validate file access.";
          v.includes("403") || v.includes("Invalid or expired") ? g("Cannot access this file. Check that your token has File content (Read) scope.") : v.includes("404") || v.includes("not found") ? g("File not found. Check that the URL is correct.") : v.includes("429") || v.includes("Rate limited") ? g("Rate limited by Figma. Please wait a moment and try again.") : g(v), T(!1);
        }
      }
    })();
  }, [o, i]);
  const Y = k(() => {
    const w = U.current;
    if (!w || !o) return;
    const I = ++H.current;
    P(!0), R(null), g(null), m(null), N(!1), L.current = null, (async () => {
      try {
        const h = await be({
          shell: w,
          token: i,
          fileKey: o.fileKey,
          nodeId: o.nodeId,
          scope: d
        });
        if (H.current !== I) return;
        if (h.largeTreeWarning) {
          L.current = h, m(h.largeTreeWarning), N(!0), P(!1);
          return;
        }
        R(h.extraction), e && e.showToast(`Extracted ${h.extraction.nodeCount} nodes`, "success");
      } catch (h) {
        if (H.current !== I) return;
        const v = (h == null ? void 0 : h.message) || "Extraction failed.";
        v.includes("403") || v.includes("Invalid or expired") ? g("Cannot access this file. Check that your token has File content (Read) scope.") : v.includes("404") || v.includes("not found") ? g("File not found. Check that the URL is correct.") : v.includes("429") || v.includes("Rate limited") ? g("Rate limited by Figma. Please wait a moment and try again.") : v.includes("timeout") || v.includes("timed out") ? g("Request timed out. Try a smaller selection or check your connection.") : g(v);
      } finally {
        H.current === I && P(!1);
      }
    })();
  }, [o, i, d, e]), Z = k(() => {
    const w = L.current;
    w && (N(!1), m(null), R(w.extraction), L.current = null, e && e.showToast(`Extracted ${w.extraction.nodeCount} nodes`, "success"));
  }, [e]), Q = k(() => {
    N(!1), m(null), L.current = null;
  }, []), ee = !o || !b || p || F;
  return /* @__PURE__ */ s("div", { children: [
    /* @__PURE__ */ s("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ a("label", { className: "figma-plugin-label", children: "Figma URL" }),
      /* @__PURE__ */ a(
        "input",
        {
          className: "figma-plugin-input",
          type: "text",
          placeholder: "https://www.figma.com/design/...",
          value: n,
          onChange: J
        }
      ),
      C && /* @__PURE__ */ a("div", { className: "figma-plugin-error", children: C })
    ] }),
    o && /* @__PURE__ */ a("div", { className: "figma-plugin-section", children: /* @__PURE__ */ s("div", { className: "figma-plugin-file-info", children: [
      p && /* @__PURE__ */ s("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: b ? "8px" : "0" }, children: [
        /* @__PURE__ */ a("span", { className: "figma-plugin-spinner" }),
        /* @__PURE__ */ a("span", { style: { color: "var(--text-secondary)" }, children: "Checking access..." })
      ] }),
      b && /* @__PURE__ */ s("div", { style: { marginBottom: "8px" }, children: [
        /* @__PURE__ */ a("div", { style: { fontWeight: 600, fontSize: "13px", marginBottom: "4px" }, children: b.name }),
        /* @__PURE__ */ s("div", { style: { color: "var(--text-secondary)" }, children: [
          b.pages.length,
          " page",
          b.pages.length !== 1 ? "s" : ""
        ] })
      ] }),
      !p && /* @__PURE__ */ s("div", { style: { color: "var(--text-muted)", lineHeight: 1.6 }, children: [
        /* @__PURE__ */ s("div", { children: [
          "File key: ",
          o.fileKey
        ] }),
        /* @__PURE__ */ s("div", { children: [
          "Node: ",
          o.nodeId || "None (file-level)"
        ] }),
        /* @__PURE__ */ s("div", { children: [
          "Type: ",
          o.fileType
        ] })
      ] })
    ] }) }),
    o && /* @__PURE__ */ s("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ a("label", { className: "figma-plugin-label", children: "Extraction Scope" }),
      /* @__PURE__ */ s("div", { className: "figma-plugin-radio-group", children: [
        /* @__PURE__ */ s("label", { className: "figma-plugin-radio-label", style: o.nodeId ? void 0 : { opacity: 0.5, cursor: "not-allowed" }, children: [
          /* @__PURE__ */ a(
            "input",
            {
              type: "radio",
              name: "scope",
              value: "node",
              checked: d === "node",
              onChange: () => x("node"),
              disabled: !o.nodeId
            }
          ),
          "Single Node",
          !o.nodeId && /* @__PURE__ */ a("span", { className: "figma-plugin-hint", style: { marginTop: 0, marginLeft: "4px" }, children: "Paste a URL with a node-id to use this option" })
        ] }),
        /* @__PURE__ */ s("label", { className: "figma-plugin-radio-label", children: [
          /* @__PURE__ */ a(
            "input",
            {
              type: "radio",
              name: "scope",
              value: "frame",
              checked: d === "frame",
              onChange: () => x("frame")
            }
          ),
          "Frame"
        ] }),
        /* @__PURE__ */ s("label", { className: "figma-plugin-radio-label", children: [
          /* @__PURE__ */ a(
            "input",
            {
              type: "radio",
              name: "scope",
              value: "page",
              checked: d === "page",
              onChange: () => x("page")
            }
          ),
          "Entire Page"
        ] })
      ] })
    ] }),
    F && /* @__PURE__ */ a("div", { className: "figma-plugin-section", children: /* @__PURE__ */ s("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
      /* @__PURE__ */ a("span", { className: "figma-plugin-spinner" }),
      /* @__PURE__ */ a("span", { style: { color: "var(--text-secondary)" }, children: "Extracting layout..." })
    ] }) }),
    y && A && /* @__PURE__ */ a("div", { className: "figma-plugin-section", children: /* @__PURE__ */ s("div", { className: "figma-plugin-warning", children: [
      /* @__PURE__ */ s("strong", { children: [
        A.nodeCount,
        " nodes detected"
      ] }),
      /* @__PURE__ */ a("p", { children: "Large selections may take longer and produce verbose output. Continue?" }),
      /* @__PURE__ */ s("div", { className: "figma-plugin-warning-actions", children: [
        /* @__PURE__ */ a("button", { className: "btn-primary", onClick: Z, children: "Continue" }),
        /* @__PURE__ */ a("button", { className: "btn-secondary", onClick: Q, children: "Cancel" })
      ] })
    ] }) }),
    E && S && /* @__PURE__ */ a("div", { className: "figma-plugin-section", children: /* @__PURE__ */ s("div", { className: "figma-plugin-file-info", children: [
      /* @__PURE__ */ s("div", { style: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }, children: [
        /* @__PURE__ */ a("span", { style: { color: "#38a169" }, children: "✓" }),
        /* @__PURE__ */ a("span", { style: { fontWeight: 600, fontSize: "13px" }, children: "Layout extracted" }),
        E.truncated && /* @__PURE__ */ a("span", { style: { color: "#f59e0b", fontSize: "11px" }, children: "(truncated)" })
      ] }),
      /* @__PURE__ */ s("div", { style: { color: "var(--text-secondary)", fontSize: "12px", lineHeight: 1.6 }, children: [
        E.nodeCount,
        " nodes · ",
        S.autoLayoutFrames,
        " auto-layout frames · ",
        S.textNodes,
        " text layers"
      ] }),
      S.components.length > 0 && /* @__PURE__ */ s("div", { style: { marginTop: "8px" }, children: [
        /* @__PURE__ */ a("div", { style: { color: "var(--text-muted)", fontSize: "11px", marginBottom: "4px" }, children: "Components" }),
        /* @__PURE__ */ s("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px" }, children: [
          S.components.slice(0, 8).map((w) => /* @__PURE__ */ s(
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
          S.components.length > 8 && /* @__PURE__ */ s("span", { style: { fontSize: "11px", color: "var(--text-muted)", padding: "2px 4px" }, children: [
            "+",
            S.components.length - 8,
            " more"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ a(
        "button",
        {
          onClick: () => _(!z),
          style: {
            background: "none",
            border: "none",
            color: "var(--accent, #0d99ff)",
            fontSize: "11px",
            cursor: "pointer",
            padding: "4px 0",
            marginTop: "8px"
          },
          children: z ? "Hide tree" : "Show tree preview"
        }
      ),
      z && /* @__PURE__ */ a("div", { style: { marginTop: "6px", padding: "8px", background: "var(--bg-primary)", borderRadius: "4px", border: "1px solid var(--border)", maxHeight: "200px", overflowY: "auto" }, children: /* @__PURE__ */ a(q, { nodes: E.rootNodes }) })
    ] }) }),
    /* @__PURE__ */ a(
      "button",
      {
        className: "btn-primary",
        onClick: Y,
        disabled: ee,
        style: { width: "100%" },
        children: F ? "Extracting..." : "Extract Design Brief"
      }
    )
  ] });
}
function Ne({ onClick: i }) {
  return /* @__PURE__ */ a(
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
      children: /* @__PURE__ */ s(
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
            /* @__PURE__ */ a("circle", { cx: "12", cy: "12", r: "3" }),
            /* @__PURE__ */ a("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" })
          ]
        }
      )
    }
  );
}
function Ce() {
  const i = $(), t = (i == null ? void 0 : i.storage) ?? null, r = (i == null ? void 0 : i.actions) ?? null, [e, n] = f(!1), [l, o] = f(null), [c, d] = f(null), [x, b] = f(!1), [u, p] = f("main");
  W(() => {
    if (!t) return;
    let m = !1;
    return (async () => {
      try {
        const y = await t.read();
        !m && typeof y.figmaToken == "string" && (o(y.figmaToken), typeof y.figmaUserHandle == "string" && d({ id: "", handle: y.figmaUserHandle, img_url: "" }));
      } catch (y) {
        console.error("[figma] Failed to read storage:", y);
      } finally {
        m || b(!0);
      }
    })(), () => {
      m = !0;
    };
  }, [t]);
  const T = k(() => n(!0), []), C = k(() => {
    n(!1), p("main");
  }, []), g = k(async (m, y) => {
    if (!(!t || !r))
      try {
        const N = await t.read();
        await t.write({ ...N, figmaToken: m, figmaUserHandle: y.handle }), o(m), d(y), p("main"), r.showToast(`Connected as ${y.handle}`, "success");
      } catch {
        r.showToast("Failed to save token. Please try again.", "error");
      }
  }, [t, r]), F = k(async (m, y) => {
    if (!(!t || !r))
      try {
        const N = await t.read();
        await t.write({ ...N, figmaToken: m, figmaUserHandle: y.handle }), o(m), d(y), p("main"), r.showToast(`Token updated — connected as ${y.handle}`, "success");
      } catch {
        r.showToast("Failed to save token. Please try again.", "error");
      }
  }, [t, r]), P = k(async () => {
    if (!(!t || !r))
      try {
        const m = await t.read(), { figmaToken: y, figmaUserHandle: N, ...z } = m;
        await t.write(z), o(null), d(null), p("main"), r.showToast("Disconnected from Figma", "info");
      } catch {
        r.showToast("Failed to remove token. Please try again.", "error");
      }
  }, [t, r]), E = "Figma", R = l ? /* @__PURE__ */ a(Ne, { onClick: () => p("settings") }) : void 0;
  let A = null;
  return x && (l ? u === "settings" && c ? A = /* @__PURE__ */ a(
    ce,
    {
      currentUser: c,
      onTokenUpdated: F,
      onTokenRemoved: P,
      onBack: () => p("main")
    }
  ) : A = /* @__PURE__ */ a(ke, { token: l }) : A = /* @__PURE__ */ a(se, { onTokenSaved: g })), /* @__PURE__ */ s(V, { children: [
    /* @__PURE__ */ a(
      "button",
      {
        onClick: T,
        title: "Figma Design Brief",
        className: "toolbar-icon-btn",
        children: /* @__PURE__ */ s(
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
              /* @__PURE__ */ a("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1" }),
              /* @__PURE__ */ a("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1" }),
              /* @__PURE__ */ a("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1" }),
              /* @__PURE__ */ a("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1" })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ a(
      ie,
      {
        open: e,
        onClose: C,
        title: E,
        headerRight: R,
        children: A
      }
    )
  ] });
}
const Ie = "Figma", Re = {
  toolbar: Ce
};
function Ae() {
  console.log("[figma] Plugin activated");
}
function Se() {
  console.log("[figma] Plugin deactivated");
}
export {
  Ie as name,
  Ae as onActivate,
  Se as onDeactivate,
  Re as slots
};
