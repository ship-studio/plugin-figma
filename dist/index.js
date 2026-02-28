import { jsx as a, jsxs as c, Fragment as M } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export const jsx=R.createElement;export const jsxs=R.createElement;export const Fragment=R.Fragment;";
import { useEffect as B, useCallback as b, useState as f, useRef as U } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export default R;export const{useState,useEffect,useCallback,useRef,useMemo,useContext,createContext,createElement,Fragment}=R;";
const D = window;
function H() {
  const n = D.__SHIPSTUDIO_REACT__, i = D.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__;
  return i && (n != null && n.useContext) ? n.useContext(i) : null;
}
const O = "figma-plugin-styles", Z = `
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
function Y({ open: n, onClose: i, title: o, headerRight: e, children: t }) {
  B(() => {
    if (!n) return;
    let r = document.getElementById(O);
    return r || (r = document.createElement("style"), r.id = O, r.textContent = Z, document.head.appendChild(r)), () => {
      const s = document.getElementById(O);
      s && s.remove();
    };
  }, [n]), B(() => {
    if (!n) return;
    const r = (s) => {
      s.key === "Escape" && i();
    };
    return document.addEventListener("keydown", r), () => document.removeEventListener("keydown", r);
  }, [n, i]);
  const l = b(
    (r) => {
      r.target === r.currentTarget && i();
    },
    [i]
  );
  return n ? /* @__PURE__ */ a("div", { className: "figma-plugin-overlay", onClick: l, children: /* @__PURE__ */ c("div", { className: "figma-plugin-modal", children: [
    /* @__PURE__ */ c("div", { className: "figma-plugin-modal-header", children: [
      /* @__PURE__ */ c(
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
      /* @__PURE__ */ a("span", { className: "figma-plugin-modal-title", children: o }),
      e && /* @__PURE__ */ a("div", { style: { marginLeft: "auto", display: "flex", alignItems: "center" }, children: e })
    ] }),
    /* @__PURE__ */ a("div", { className: "figma-plugin-modal-body", children: t })
  ] }) }) : null;
}
const Q = "https://api.figma.com/v1";
async function W(n, i, o, e) {
  const t = `${Q}${i}`, l = Math.ceil(((e == null ? void 0 : e.timeout) ?? 3e4) / 1e3), r = [
    "-sS",
    "--max-time",
    String(l),
    "-H",
    `X-Figma-Token: ${o}`,
    t
  ], s = await n.exec("curl", r, {
    timeout: (e == null ? void 0 : e.timeout) ?? 12e4
  });
  if (s.exit_code !== 0)
    throw new Error(`Figma API request failed: ${s.stderr || `exit code ${s.exit_code}`}`);
  if (!s.stdout.trim())
    throw new Error("Empty response from Figma API");
  let d;
  try {
    d = JSON.parse(s.stdout);
  } catch {
    throw new Error(`Invalid JSON from Figma API: ${s.stdout.slice(0, 200)}`);
  }
  if (d.status && d.err)
    throw d.status === 429 ? new Error("Rate limited by Figma API. Try again in a moment.") : d.status === 403 ? new Error("Invalid or expired token. Please update your Figma token.") : d.status === 404 ? new Error("File not found. Check that the URL is correct and you have access.") : new Error(`Figma API error: ${d.err}`);
  return d;
}
async function V(n, i) {
  return W(n, "/me", i);
}
async function ee(n, i, o) {
  const e = await W(n, `/files/${o}?depth=1`, i);
  return {
    name: e.name,
    pages: e.document.children.filter((t) => t.type === "CANVAS").map((t) => ({ id: t.id, name: t.name }))
  };
}
async function ne(n, i, o, e) {
  const t = await W(
    n,
    `/files/${o}/nodes?ids=${encodeURIComponent(e)}`,
    i,
    { timeout: 12e4 }
  ), l = t.nodes[e];
  if (!l) {
    const r = Object.keys(t.nodes), s = r.find(
      (d) => d.replace(/%3A/g, ":") === e || d === e.replace(/:/g, "%3A")
    );
    if (s)
      return {
        rootNode: t.nodes[s].document,
        components: t.nodes[s].components
      };
    throw new Error(
      `Node "${e}" not found in API response. Available nodes: ${r.join(", ")}`
    );
  }
  return {
    rootNode: l.document,
    components: l.components
  };
}
async function te(n, i, o) {
  const e = await W(
    n,
    `/files/${o}`,
    i,
    { timeout: 12e4 }
  );
  return {
    rootNodes: e.document.children,
    components: e.components
  };
}
function ie({ onTokenSaved: n }) {
  const i = H(), o = (i == null ? void 0 : i.shell) ?? null, [e, t] = f(""), [l, r] = f(!1), [s, d] = f(null), x = b(async () => {
    if (!o) return;
    const u = e.trim();
    if (!(!u || l)) {
      r(!0), d(null);
      try {
        const g = await V(o, u);
        n(u, g);
      } catch (g) {
        d((g == null ? void 0 : g.message) || "Failed to validate token. Please check and try again.");
      } finally {
        r(!1);
      }
    }
  }, [e, l, o, n]), w = b(
    (u) => {
      u.key === "Enter" && x();
    },
    [x]
  );
  return /* @__PURE__ */ c("div", { children: [
    /* @__PURE__ */ c("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ a("h3", { style: { fontSize: "14px", fontWeight: 600, margin: "0 0 8px 0" }, children: "Connect to Figma" }),
      /* @__PURE__ */ c("p", { style: { fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 16px 0", lineHeight: 1.5 }, children: [
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
    /* @__PURE__ */ c("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ a("label", { className: "figma-plugin-label", children: "Personal Access Token" }),
      /* @__PURE__ */ a(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: e,
          onChange: (u) => t(u.target.value),
          onKeyDown: w,
          disabled: l
        }
      ),
      s && /* @__PURE__ */ a("div", { className: "figma-plugin-error", children: s }),
      /* @__PURE__ */ a("div", { className: "figma-plugin-hint", children: "Token is stored locally in this project only." })
    ] }),
    /* @__PURE__ */ a(
      "button",
      {
        className: "btn-primary",
        onClick: x,
        disabled: !e.trim() || l,
        style: { width: "100%", marginTop: "4px" },
        children: l ? /* @__PURE__ */ c(M, { children: [
          /* @__PURE__ */ a("span", { className: "figma-plugin-spinner", style: { marginRight: "8px", verticalAlign: "middle" } }),
          "Connecting..."
        ] }) : "Connect"
      }
    )
  ] });
}
function ae({ currentUser: n, onTokenUpdated: i, onTokenRemoved: o, onBack: e }) {
  const t = H(), l = (t == null ? void 0 : t.shell) ?? null, [r, s] = f(""), [d, x] = f(!1), [w, u] = f(null), g = b(async () => {
    if (!l) return;
    const N = r.trim();
    if (!(!N || d)) {
      x(!0), u(null);
      try {
        const p = await V(l, N);
        i(N, p);
      } catch (p) {
        u((p == null ? void 0 : p.message) || "Failed to validate token. Please check and try again.");
      } finally {
        x(!1);
      }
    }
  }, [r, d, l, i]), T = b(
    (N) => {
      N.key === "Enter" && g();
    },
    [g]
  );
  return /* @__PURE__ */ c("div", { children: [
    /* @__PURE__ */ c(
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
    /* @__PURE__ */ a("div", { className: "figma-plugin-section", children: /* @__PURE__ */ c("div", { className: "figma-plugin-success", style: { display: "flex", alignItems: "center", gap: "6px", marginTop: "0" }, children: [
      /* @__PURE__ */ a("span", { style: { fontSize: "10px" }, children: "●" }),
      "Connected as ",
      n.handle
    ] }) }),
    /* @__PURE__ */ c("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ a("label", { className: "figma-plugin-label", children: "Update Token" }),
      /* @__PURE__ */ a(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: r,
          onChange: (N) => s(N.target.value),
          onKeyDown: T,
          disabled: d
        }
      ),
      w && /* @__PURE__ */ a("div", { className: "figma-plugin-error", children: w }),
      /* @__PURE__ */ a(
        "button",
        {
          className: "btn-primary",
          onClick: g,
          disabled: !r.trim() || d,
          style: { width: "100%", marginTop: "8px" },
          children: d ? /* @__PURE__ */ c(M, { children: [
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
        onClick: o,
        style: { width: "100%" },
        children: "Disconnect"
      }
    ) })
  ] });
}
function oe(n) {
  const i = n.match(
    /figma\.com\/(file|design|proto|board)\/([A-Za-z0-9]+)/
  );
  if (!i) return null;
  const o = i[1], e = i[2];
  let t = null;
  const l = n.match(/[?&]node-id=([^&]+)/);
  return l && (t = decodeURIComponent(l[1]).replace(/-/g, ":")), { fileKey: e, nodeId: t, fileType: o };
}
function re(n) {
  switch (n) {
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
function le(n) {
  switch (n) {
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
function se(n) {
  const i = {
    flexDirection: n.layoutMode === "HORIZONTAL" ? "row" : "column",
    justifyContent: re(n.primaryAxisAlignItems),
    alignItems: le(n.counterAxisAlignItems),
    gap: n.itemSpacing ?? 0,
    padding: {
      top: n.paddingTop ?? 0,
      right: n.paddingRight ?? 0,
      bottom: n.paddingBottom ?? 0,
      left: n.paddingLeft ?? 0
    },
    flexWrap: n.layoutWrap === "WRAP" ? "wrap" : "nowrap"
  };
  return n.layoutWrap === "WRAP" && (i.rowGap = n.counterAxisSpacing ?? 0), i;
}
function ce(n, i) {
  const o = i[n.componentId];
  let e;
  if (n.componentProperties) {
    const l = {};
    for (const [r, s] of Object.entries(n.componentProperties))
      (s.type === "VARIANT" || s.type === "BOOLEAN" || s.type === "TEXT") && (l[r] = s.value);
    Object.keys(l).length > 0 && (e = l);
  }
  const t = {
    componentId: n.componentId,
    componentName: (o == null ? void 0 : o.name) ?? n.name,
    isRemote: (o == null ? void 0 : o.remote) ?? !1,
    source: o != null && o.remote ? "library" : "local"
  };
  return o != null && o.description && (t.description = o.description), e && (t.variantProperties = e), n.overrides && (t.overrides = n.overrides), t;
}
function j(n, i, o) {
  const e = n;
  if (e.type === "SLICE") return null;
  const t = {
    id: e.id,
    name: e.name,
    type: e.type,
    visible: e.visible !== !1
    // defaults to true when undefined
  };
  switch (e.absoluteBoundingBox != null ? (t.width = e.absoluteBoundingBox.width, t.height = e.absoluteBoundingBox.height) : e.size != null && (t.width = e.size.x, t.height = e.size.y), "layoutSizingHorizontal" in e && (t.widthMode = e.layoutSizingHorizontal), "layoutSizingVertical" in e && (t.heightMode = e.layoutSizingVertical), "layoutPositioning" in e && e.layoutPositioning != null && (t.positioning = e.layoutPositioning), "layoutMode" in e && e.layoutMode && e.layoutMode !== "NONE" && (t.autoLayout = se(e)), "constraints" in e && e.constraints != null && (t.constraints = e.constraints), "minWidth" in e && e.minWidth != null && (t.minWidth = e.minWidth), "maxWidth" in e && e.maxWidth != null && (t.maxWidth = e.maxWidth), "minHeight" in e && e.minHeight != null && (t.minHeight = e.minHeight), "maxHeight" in e && e.maxHeight != null && (t.maxHeight = e.maxHeight), "preserveRatio" in e && e.preserveRatio != null && (t.preserveRatio = e.preserveRatio), e.type) {
    case "TEXT":
      t.textContent = e.characters;
      break;
    case "INSTANCE":
      return t.componentRef = ce(e, i), t;
    case "BOOLEAN_OPERATION":
      return t;
  }
  if ("children" in e && Array.isArray(e.children)) {
    const l = e.children.map((r) => j(r, i)).filter((r) => r !== null);
    t.children = ue(l);
  }
  return t;
}
function $(n) {
  let i = 1;
  if (n.children && Array.isArray(n.children))
    for (const o of n.children)
      i += $(o);
  return i;
}
function de(n) {
  const i = n.componentRef, o = i.variantProperties ? JSON.stringify(i.variantProperties, Object.keys(i.variantProperties).sort()) : "";
  return `${i.componentId}::${o}`;
}
function ue(n) {
  if (n.length === 0) return [];
  const i = /* @__PURE__ */ new Map();
  for (let t = 0; t < n.length; t++) {
    const l = n[t];
    if (l.componentRef) {
      const r = de(l), s = i.get(r);
      s ? (s.count++, s.indices.push(t)) : i.set(r, { node: l, count: 1, indices: [t] });
    }
  }
  const o = /* @__PURE__ */ new Set();
  for (const t of i.values())
    if (t.count >= 3) {
      t.node.repeatCount = t.count;
      for (let l = 1; l < t.indices.length; l++)
        o.add(t.indices[l]);
    }
  const e = [];
  for (let t = 0; t < n.length; t++)
    o.has(t) || e.push(n[t]);
  return e;
}
function ge(n, i) {
  let o = 0;
  for (const t of n)
    o += $(t);
  return {
    rootNodes: n.map((t) => j(t, i)).filter((t) => t !== null),
    nodeCount: o,
    truncated: !1
  };
}
const pe = 500, fe = 2e3;
async function me(n) {
  const { shell: i, token: o, fileKey: e, nodeId: t, scope: l } = n;
  let r, s;
  if (l === "node" || l === "frame") {
    if (!t)
      throw new Error(
        `Cannot extract ${l}: no node ID found in the URL. Paste a Figma URL that includes a node-id, or switch to "Entire Page" scope.`
      );
    const u = await ne(i, o, e, t);
    r = [u.rootNode], s = u.components;
  } else {
    const u = await te(i, o, e), g = u.rootNodes[0];
    r = (g == null ? void 0 : g.children) || [], s = u.components;
  }
  let d = 0;
  for (const u of r)
    d += $(u);
  let x;
  d > pe && (x = {
    nodeCount: d,
    message: `This selection has ~${d} nodes. Large extractions may produce verbose output.`
  });
  const w = ge(r, s);
  return d > fe && (w.truncated = !0), { extraction: w, largeTreeWarning: x };
}
function he({ token: n }) {
  const i = H(), o = (i == null ? void 0 : i.shell) ?? null, e = (i == null ? void 0 : i.actions) ?? null, [t, l] = f(""), [r, s] = f(null), [d, x] = f("page"), [w, u] = f(null), [g, T] = f(!1), [N, p] = f(null), [P, S] = f(!1), [A, R] = f(null), [F, m] = f(null), [y, k] = f(!1), I = U(null), L = U(o);
  L.current = o;
  const _ = U(0), z = U(0), K = b(
    (C) => {
      const E = C.target.value;
      if (l(E), !E.trim()) {
        s(null), u(null), p(null), T(!1), R(null), m(null), k(!1), I.current = null;
        return;
      }
      const h = oe(E);
      if (!h) {
        s(null), u(null), p("Please paste a valid Figma URL (file, design, proto, or board link)"), T(!1);
        return;
      }
      s(h), p(null), u(null), R(null), m(null), k(!1), I.current = null, h.nodeId ? x("node") : x("page");
    },
    []
  );
  B(() => {
    if (!r || !L.current) return;
    const C = ++_.current, E = L.current;
    T(!0), u(null), p(null), (async () => {
      try {
        const h = await ee(E, n, r.fileKey);
        _.current === C && (u(h), T(!1));
      } catch (h) {
        if (_.current === C) {
          const v = (h == null ? void 0 : h.message) || "Failed to validate file access.";
          v.includes("403") || v.includes("Invalid or expired") ? p("Cannot access this file. Check that your token has File content (Read) scope.") : v.includes("404") || v.includes("not found") ? p("File not found. Check that the URL is correct.") : v.includes("429") || v.includes("Rate limited") ? p("Rate limited by Figma. Please wait a moment and try again.") : p(v), T(!1);
        }
      }
    })();
  }, [r, n]);
  const X = b(() => {
    const C = L.current;
    if (!C || !r) return;
    const E = ++z.current;
    S(!0), R(null), p(null), m(null), k(!1), I.current = null, (async () => {
      try {
        const h = await me({
          shell: C,
          token: n,
          fileKey: r.fileKey,
          nodeId: r.nodeId,
          scope: d
        });
        if (z.current !== E) return;
        if (h.largeTreeWarning) {
          I.current = h, m(h.largeTreeWarning), k(!0), S(!1);
          return;
        }
        R(h.extraction), e && e.showToast(`Extracted ${h.extraction.nodeCount} nodes`, "success");
      } catch (h) {
        if (z.current !== E) return;
        const v = (h == null ? void 0 : h.message) || "Extraction failed.";
        v.includes("403") || v.includes("Invalid or expired") ? p("Cannot access this file. Check that your token has File content (Read) scope.") : v.includes("404") || v.includes("not found") ? p("File not found. Check that the URL is correct.") : v.includes("429") || v.includes("Rate limited") ? p("Rate limited by Figma. Please wait a moment and try again.") : v.includes("timeout") || v.includes("timed out") ? p("Request timed out. Try a smaller selection or check your connection.") : p(v);
      } finally {
        z.current === E && S(!1);
      }
    })();
  }, [r, n, d, e]), G = b(() => {
    const C = I.current;
    C && (k(!1), m(null), R(C.extraction), I.current = null, e && e.showToast(`Extracted ${C.extraction.nodeCount} nodes`, "success"));
  }, [e]), q = b(() => {
    k(!1), m(null), I.current = null;
  }, []), J = !r || !w || g || P;
  return /* @__PURE__ */ c("div", { children: [
    /* @__PURE__ */ c("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ a("label", { className: "figma-plugin-label", children: "Figma URL" }),
      /* @__PURE__ */ a(
        "input",
        {
          className: "figma-plugin-input",
          type: "text",
          placeholder: "https://www.figma.com/design/...",
          value: t,
          onChange: K
        }
      ),
      N && /* @__PURE__ */ a("div", { className: "figma-plugin-error", children: N })
    ] }),
    r && /* @__PURE__ */ a("div", { className: "figma-plugin-section", children: /* @__PURE__ */ c("div", { className: "figma-plugin-file-info", children: [
      g && /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: w ? "8px" : "0" }, children: [
        /* @__PURE__ */ a("span", { className: "figma-plugin-spinner" }),
        /* @__PURE__ */ a("span", { style: { color: "var(--text-secondary)" }, children: "Checking access..." })
      ] }),
      w && /* @__PURE__ */ c("div", { style: { marginBottom: "8px" }, children: [
        /* @__PURE__ */ a("div", { style: { fontWeight: 600, fontSize: "13px", marginBottom: "4px" }, children: w.name }),
        /* @__PURE__ */ c("div", { style: { color: "var(--text-secondary)" }, children: [
          w.pages.length,
          " page",
          w.pages.length !== 1 ? "s" : ""
        ] })
      ] }),
      !g && /* @__PURE__ */ c("div", { style: { color: "var(--text-muted)", lineHeight: 1.6 }, children: [
        /* @__PURE__ */ c("div", { children: [
          "File key: ",
          r.fileKey
        ] }),
        /* @__PURE__ */ c("div", { children: [
          "Node: ",
          r.nodeId || "None (file-level)"
        ] }),
        /* @__PURE__ */ c("div", { children: [
          "Type: ",
          r.fileType
        ] })
      ] })
    ] }) }),
    r && /* @__PURE__ */ c("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ a("label", { className: "figma-plugin-label", children: "Extraction Scope" }),
      /* @__PURE__ */ c("div", { className: "figma-plugin-radio-group", children: [
        /* @__PURE__ */ c("label", { className: "figma-plugin-radio-label", style: r.nodeId ? void 0 : { opacity: 0.5, cursor: "not-allowed" }, children: [
          /* @__PURE__ */ a(
            "input",
            {
              type: "radio",
              name: "scope",
              value: "node",
              checked: d === "node",
              onChange: () => x("node"),
              disabled: !r.nodeId
            }
          ),
          "Single Node",
          !r.nodeId && /* @__PURE__ */ a("span", { className: "figma-plugin-hint", style: { marginTop: 0, marginLeft: "4px" }, children: "Paste a URL with a node-id to use this option" })
        ] }),
        /* @__PURE__ */ c("label", { className: "figma-plugin-radio-label", children: [
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
        /* @__PURE__ */ c("label", { className: "figma-plugin-radio-label", children: [
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
    P && /* @__PURE__ */ a("div", { className: "figma-plugin-section", children: /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
      /* @__PURE__ */ a("span", { className: "figma-plugin-spinner" }),
      /* @__PURE__ */ a("span", { style: { color: "var(--text-secondary)" }, children: "Extracting layout..." })
    ] }) }),
    y && F && /* @__PURE__ */ a("div", { className: "figma-plugin-section", children: /* @__PURE__ */ c("div", { className: "figma-plugin-warning", children: [
      /* @__PURE__ */ c("strong", { children: [
        F.nodeCount,
        " nodes detected"
      ] }),
      /* @__PURE__ */ a("p", { children: "Large selections may take longer and produce verbose output. Continue?" }),
      /* @__PURE__ */ c("div", { className: "figma-plugin-warning-actions", children: [
        /* @__PURE__ */ a("button", { className: "btn-primary", onClick: G, children: "Continue" }),
        /* @__PURE__ */ a("button", { className: "btn-secondary", onClick: q, children: "Cancel" })
      ] })
    ] }) }),
    A && /* @__PURE__ */ a("div", { className: "figma-plugin-section", children: /* @__PURE__ */ c("div", { className: "figma-plugin-file-info", children: [
      /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }, children: [
        /* @__PURE__ */ a("span", { style: { color: "#38a169" }, children: "✓" }),
        /* @__PURE__ */ a("span", { style: { fontWeight: 600, fontSize: "13px" }, children: "Layout extracted" })
      ] }),
      /* @__PURE__ */ c("div", { style: { color: "var(--text-secondary)", lineHeight: 1.5 }, children: [
        A.nodeCount,
        " nodes · ",
        A.rootNodes.length,
        " top-level ",
        A.rootNodes.length === 1 ? "frame" : "frames",
        A.truncated && " (truncated)"
      ] })
    ] }) }),
    /* @__PURE__ */ a(
      "button",
      {
        className: "btn-primary",
        onClick: X,
        disabled: J,
        style: { width: "100%" },
        children: P ? "Extracting..." : "Extract Design Brief"
      }
    )
  ] });
}
function xe({ onClick: n }) {
  return /* @__PURE__ */ a(
    "button",
    {
      onClick: n,
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
      children: /* @__PURE__ */ c(
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
function ye() {
  const n = H(), i = (n == null ? void 0 : n.storage) ?? null, o = (n == null ? void 0 : n.actions) ?? null, [e, t] = f(!1), [l, r] = f(null), [s, d] = f(null), [x, w] = f(!1), [u, g] = f("main");
  B(() => {
    if (!i) return;
    let m = !1;
    return (async () => {
      try {
        const y = await i.read();
        !m && typeof y.figmaToken == "string" && (r(y.figmaToken), typeof y.figmaUserHandle == "string" && d({ id: "", handle: y.figmaUserHandle, img_url: "" }));
      } catch (y) {
        console.error("[figma] Failed to read storage:", y);
      } finally {
        m || w(!0);
      }
    })(), () => {
      m = !0;
    };
  }, [i]);
  const T = b(() => t(!0), []), N = b(() => {
    t(!1), g("main");
  }, []), p = b(async (m, y) => {
    if (!(!i || !o))
      try {
        const k = await i.read();
        await i.write({ ...k, figmaToken: m, figmaUserHandle: y.handle }), r(m), d(y), g("main"), o.showToast(`Connected as ${y.handle}`, "success");
      } catch {
        o.showToast("Failed to save token. Please try again.", "error");
      }
  }, [i, o]), P = b(async (m, y) => {
    if (!(!i || !o))
      try {
        const k = await i.read();
        await i.write({ ...k, figmaToken: m, figmaUserHandle: y.handle }), r(m), d(y), g("main"), o.showToast(`Token updated — connected as ${y.handle}`, "success");
      } catch {
        o.showToast("Failed to save token. Please try again.", "error");
      }
  }, [i, o]), S = b(async () => {
    if (!(!i || !o))
      try {
        const m = await i.read(), { figmaToken: y, figmaUserHandle: k, ...I } = m;
        await i.write(I), r(null), d(null), g("main"), o.showToast("Disconnected from Figma", "info");
      } catch {
        o.showToast("Failed to remove token. Please try again.", "error");
      }
  }, [i, o]), A = "Figma", R = l ? /* @__PURE__ */ a(xe, { onClick: () => g("settings") }) : void 0;
  let F = null;
  return x && (l ? u === "settings" && s ? F = /* @__PURE__ */ a(
    ae,
    {
      currentUser: s,
      onTokenUpdated: P,
      onTokenRemoved: S,
      onBack: () => g("main")
    }
  ) : F = /* @__PURE__ */ a(he, { token: l }) : F = /* @__PURE__ */ a(ie, { onTokenSaved: p })), /* @__PURE__ */ c(M, { children: [
    /* @__PURE__ */ a(
      "button",
      {
        onClick: T,
        title: "Figma Design Brief",
        className: "toolbar-icon-btn",
        children: /* @__PURE__ */ c(
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
      Y,
      {
        open: e,
        onClose: N,
        title: A,
        headerRight: R,
        children: F
      }
    )
  ] });
}
const be = "Figma", ke = {
  toolbar: ye
};
function Ne() {
  console.log("[figma] Plugin activated");
}
function Ce() {
  console.log("[figma] Plugin deactivated");
}
export {
  be as name,
  Ne as onActivate,
  Ce as onDeactivate,
  ke as slots
};
