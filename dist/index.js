import { jsx as a, jsxs as d, Fragment as M } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export const jsx=R.createElement;export const jsxs=R.createElement;export const Fragment=R.Fragment;";
import { useEffect as B, useCallback as b, useState as p, useRef as U } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export default R;export const{useState,useEffect,useCallback,useRef,useMemo,useContext,createContext,createElement,Fragment}=R;";
const D = window;
function W() {
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
function Y({ open: n, onClose: i, title: r, headerRight: e, children: t }) {
  B(() => {
    if (!n) return;
    let o = document.getElementById(O);
    return o || (o = document.createElement("style"), o.id = O, o.textContent = Z, document.head.appendChild(o)), () => {
      const s = document.getElementById(O);
      s && s.remove();
    };
  }, [n]), B(() => {
    if (!n) return;
    const o = (s) => {
      s.key === "Escape" && i();
    };
    return document.addEventListener("keydown", o), () => document.removeEventListener("keydown", o);
  }, [n, i]);
  const l = b(
    (o) => {
      o.target === o.currentTarget && i();
    },
    [i]
  );
  return n ? /* @__PURE__ */ a("div", { className: "figma-plugin-overlay", onClick: l, children: /* @__PURE__ */ d("div", { className: "figma-plugin-modal", children: [
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
    /* @__PURE__ */ a("div", { className: "figma-plugin-modal-body", children: t })
  ] }) }) : null;
}
const Q = "https://api.figma.com/v1";
async function H(n, i, r, e) {
  const t = `${Q}${i}`, l = Math.ceil(((e == null ? void 0 : e.timeout) ?? 3e4) / 1e3), o = [
    "-sS",
    "--max-time",
    String(l),
    "-H",
    `X-Figma-Token: ${r}`,
    t
  ], s = await n.exec("curl", o, {
    timeout: (e == null ? void 0 : e.timeout) ?? 12e4
  });
  if (s.exit_code !== 0)
    throw new Error(`Figma API request failed: ${s.stderr || `exit code ${s.exit_code}`}`);
  if (!s.stdout.trim())
    throw new Error("Empty response from Figma API");
  let c;
  try {
    c = JSON.parse(s.stdout);
  } catch {
    throw new Error(`Invalid JSON from Figma API: ${s.stdout.slice(0, 200)}`);
  }
  if (c.status && c.err)
    throw c.status === 429 ? new Error("Rate limited by Figma API. Try again in a moment.") : c.status === 403 ? new Error("Invalid or expired token. Please update your Figma token.") : c.status === 404 ? new Error("File not found. Check that the URL is correct and you have access.") : new Error(`Figma API error: ${c.err}`);
  return c;
}
async function V(n, i) {
  return H(n, "/me", i);
}
async function ee(n, i, r) {
  const e = await H(n, `/files/${r}?depth=1`, i);
  return {
    name: e.name,
    pages: e.document.children.filter((t) => t.type === "CANVAS").map((t) => ({ id: t.id, name: t.name }))
  };
}
async function ne(n, i, r, e) {
  const t = await H(
    n,
    `/files/${r}/nodes?ids=${encodeURIComponent(e)}`,
    i,
    { timeout: 12e4 }
  ), l = t.nodes[e];
  if (!l) {
    const o = Object.keys(t.nodes), s = o.find(
      (c) => c.replace(/%3A/g, ":") === e || c === e.replace(/:/g, "%3A")
    );
    if (s)
      return {
        rootNode: t.nodes[s].document,
        components: t.nodes[s].components
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
async function te(n, i, r) {
  const e = await H(
    n,
    `/files/${r}`,
    i,
    { timeout: 12e4 }
  );
  return {
    rootNodes: e.document.children,
    components: e.components
  };
}
function ie({ onTokenSaved: n }) {
  const i = W(), r = (i == null ? void 0 : i.shell) ?? null, [e, t] = p(""), [l, o] = p(!1), [s, c] = p(null), x = b(async () => {
    if (!r) return;
    const u = e.trim();
    if (!(!u || l)) {
      o(!0), c(null);
      try {
        const g = await V(r, u);
        n(u, g);
      } catch (g) {
        c((g == null ? void 0 : g.message) || "Failed to validate token. Please check and try again.");
      } finally {
        o(!1);
      }
    }
  }, [e, l, r, n]), w = b(
    (u) => {
      u.key === "Enter" && x();
    },
    [x]
  );
  return /* @__PURE__ */ d("div", { children: [
    /* @__PURE__ */ d("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ a("h3", { style: { fontSize: "14px", fontWeight: 600, margin: "0 0 8px 0" }, children: "Connect to Figma" }),
      /* @__PURE__ */ d("p", { style: { fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 16px 0", lineHeight: 1.5 }, children: [
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
    /* @__PURE__ */ d("div", { className: "figma-plugin-section", children: [
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
        children: l ? /* @__PURE__ */ d(M, { children: [
          /* @__PURE__ */ a("span", { className: "figma-plugin-spinner", style: { marginRight: "8px", verticalAlign: "middle" } }),
          "Connecting..."
        ] }) : "Connect"
      }
    )
  ] });
}
function ae({ currentUser: n, onTokenUpdated: i, onTokenRemoved: r, onBack: e }) {
  const t = W(), l = (t == null ? void 0 : t.shell) ?? null, [o, s] = p(""), [c, x] = p(!1), [w, u] = p(null), g = b(async () => {
    if (!l) return;
    const N = o.trim();
    if (!(!N || c)) {
      x(!0), u(null);
      try {
        const f = await V(l, N);
        i(N, f);
      } catch (f) {
        u((f == null ? void 0 : f.message) || "Failed to validate token. Please check and try again.");
      } finally {
        x(!1);
      }
    }
  }, [o, c, l, i]), T = b(
    (N) => {
      N.key === "Enter" && g();
    },
    [g]
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
          /* @__PURE__ */ a("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ a("polyline", { points: "15 18 9 12 15 6" }) }),
          "Back"
        ]
      }
    ),
    /* @__PURE__ */ a("div", { className: "figma-plugin-section", children: /* @__PURE__ */ d("div", { className: "figma-plugin-success", style: { display: "flex", alignItems: "center", gap: "6px", marginTop: "0" }, children: [
      /* @__PURE__ */ a("span", { style: { fontSize: "10px" }, children: "●" }),
      "Connected as ",
      n.handle
    ] }) }),
    /* @__PURE__ */ d("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ a("label", { className: "figma-plugin-label", children: "Update Token" }),
      /* @__PURE__ */ a(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: o,
          onChange: (N) => s(N.target.value),
          onKeyDown: T,
          disabled: c
        }
      ),
      w && /* @__PURE__ */ a("div", { className: "figma-plugin-error", children: w }),
      /* @__PURE__ */ a(
        "button",
        {
          className: "btn-primary",
          onClick: g,
          disabled: !o.trim() || c,
          style: { width: "100%", marginTop: "8px" },
          children: c ? /* @__PURE__ */ d(M, { children: [
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
function re(n) {
  const i = n.match(
    /figma\.com\/(file|design|proto|board)\/([A-Za-z0-9]+)/
  );
  if (!i) return null;
  const r = i[1], e = i[2];
  let t = null;
  const l = n.match(/[?&]node-id=([^&]+)/);
  return l && (t = decodeURIComponent(l[1]).replace(/-/g, ":")), { fileKey: e, nodeId: t, fileType: r };
}
function oe(n) {
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
    justifyContent: oe(n.primaryAxisAlignItems),
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
  const r = i[n.componentId];
  let e;
  if (n.componentProperties) {
    const l = {};
    for (const [o, s] of Object.entries(n.componentProperties))
      (s.type === "VARIANT" || s.type === "BOOLEAN" || s.type === "TEXT") && (l[o] = s.value);
    Object.keys(l).length > 0 && (e = l);
  }
  const t = {
    componentId: n.componentId,
    componentName: (r == null ? void 0 : r.name) ?? n.name,
    isRemote: (r == null ? void 0 : r.remote) ?? !1,
    source: r != null && r.remote ? "library" : "local"
  };
  return r != null && r.description && (t.description = r.description), e && (t.variantProperties = e), n.overrides && (t.overrides = n.overrides), t;
}
function j(n, i, r) {
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
    const l = e.children.map((o) => j(o, i)).filter((o) => o !== null);
    t.children = ue(l);
  }
  return t;
}
function $(n) {
  let i = 1;
  if (n.children && Array.isArray(n.children))
    for (const r of n.children)
      i += $(r);
  return i;
}
function de(n) {
  const i = n.componentRef, r = i.variantProperties ? JSON.stringify(i.variantProperties, Object.keys(i.variantProperties).sort()) : "";
  return `${i.componentId}::${r}`;
}
function ue(n) {
  if (n.length === 0) return [];
  const i = /* @__PURE__ */ new Map();
  for (let t = 0; t < n.length; t++) {
    const l = n[t];
    if (l.componentRef) {
      const o = de(l), s = i.get(o);
      s ? (s.count++, s.indices.push(t)) : i.set(o, { node: l, count: 1, indices: [t] });
    }
  }
  const r = /* @__PURE__ */ new Set();
  for (const t of i.values())
    if (t.count >= 3) {
      t.node.repeatCount = t.count;
      for (let l = 1; l < t.indices.length; l++)
        r.add(t.indices[l]);
    }
  const e = [];
  for (let t = 0; t < n.length; t++)
    r.has(t) || e.push(n[t]);
  return e;
}
function ge(n, i) {
  let r = 0;
  for (const t of n)
    r += $(t);
  return {
    rootNodes: n.map((t) => j(t, i)).filter((t) => t !== null),
    nodeCount: r,
    truncated: !1
  };
}
const fe = 500, pe = 2e3;
async function me(n) {
  const { shell: i, token: r, fileKey: e, nodeId: t, scope: l } = n;
  let o, s;
  if (l === "node" || l === "frame") {
    if (!t)
      throw new Error(
        `Cannot extract ${l}: no node ID found in the URL. Paste a Figma URL that includes a node-id, or switch to "Entire Page" scope.`
      );
    const u = await ne(i, r, e, t);
    o = [u.rootNode], s = u.components;
  } else {
    const u = await te(i, r, e), g = u.rootNodes[0];
    o = (g == null ? void 0 : g.children) || [], s = u.components;
  }
  let c = 0;
  for (const u of o)
    c += $(u);
  let x;
  c > fe && (x = {
    nodeCount: c,
    message: `This selection has ~${c} nodes. Large extractions may produce verbose output.`
  });
  const w = ge(o, s);
  return c > pe && (w.truncated = !0), { extraction: w, largeTreeWarning: x };
}
function he({ token: n }) {
  const i = W(), r = (i == null ? void 0 : i.shell) ?? null, e = (i == null ? void 0 : i.actions) ?? null, [t, l] = p(""), [o, s] = p(null), [c, x] = p("page"), [w, u] = p(null), [g, T] = p(!1), [N, f] = p(null), [F, P] = p(!1), [S, A] = p(null), [R, m] = p(null), [y, k] = p(!1), E = U(null), L = U(r);
  L.current = r;
  const _ = U(0), z = U(0), K = b(
    (C) => {
      const I = C.target.value;
      if (l(I), !I.trim()) {
        s(null), u(null), f(null), T(!1), A(null), m(null), k(!1), E.current = null;
        return;
      }
      const h = re(I);
      if (!h) {
        s(null), u(null), f("Please paste a valid Figma URL (file, design, proto, or board link)"), T(!1);
        return;
      }
      s(h), f(null), u(null), A(null), m(null), k(!1), E.current = null, h.nodeId ? x("node") : x("page");
    },
    []
  );
  B(() => {
    if (!o || !L.current) return;
    const C = ++_.current, I = L.current;
    T(!0), u(null), f(null), (async () => {
      try {
        const h = await ee(I, n, o.fileKey);
        _.current === C && (u(h), T(!1));
      } catch (h) {
        if (_.current === C) {
          const v = (h == null ? void 0 : h.message) || "Failed to validate file access.";
          v.includes("403") || v.includes("Invalid or expired") ? f("Cannot access this file. Check that your token has File content (Read) scope.") : v.includes("404") || v.includes("not found") ? f("File not found. Check that the URL is correct.") : v.includes("429") || v.includes("Rate limited") ? f("Rate limited by Figma. Please wait a moment and try again.") : f(v), T(!1);
        }
      }
    })();
  }, [o, n]);
  const X = b(() => {
    const C = L.current;
    if (!C || !o) return;
    const I = ++z.current;
    P(!0), A(null), f(null), m(null), k(!1), E.current = null, (async () => {
      try {
        const h = await me({
          shell: C,
          token: n,
          fileKey: o.fileKey,
          nodeId: o.nodeId,
          scope: c
        });
        if (z.current !== I) return;
        if (h.largeTreeWarning) {
          E.current = h, m(h.largeTreeWarning), k(!0), P(!1);
          return;
        }
        A(h.extraction), e && e.showToast(`Extracted ${h.extraction.nodeCount} nodes`, "success");
      } catch (h) {
        if (z.current !== I) return;
        const v = (h == null ? void 0 : h.message) || "Extraction failed.";
        v.includes("403") || v.includes("Invalid or expired") ? f("Cannot access this file. Check that your token has File content (Read) scope.") : v.includes("404") || v.includes("not found") ? f("File not found. Check that the URL is correct.") : v.includes("429") || v.includes("Rate limited") ? f("Rate limited by Figma. Please wait a moment and try again.") : v.includes("timeout") || v.includes("timed out") ? f("Request timed out. Try a smaller selection or check your connection.") : f(v);
      } finally {
        z.current === I && P(!1);
      }
    })();
  }, [o, n, c, e]), G = b(() => {
    const C = E.current;
    C && (k(!1), m(null), A(C.extraction), E.current = null, e && e.showToast(`Extracted ${C.extraction.nodeCount} nodes`, "success"));
  }, [e]), q = b(() => {
    k(!1), m(null), E.current = null;
  }, []), J = !o || !w || g || F;
  return /* @__PURE__ */ d("div", { children: [
    /* @__PURE__ */ d("div", { className: "figma-plugin-section", children: [
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
    o && /* @__PURE__ */ a("div", { className: "figma-plugin-section", children: /* @__PURE__ */ d("div", { className: "figma-plugin-file-info", children: [
      g && /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: w ? "8px" : "0" }, children: [
        /* @__PURE__ */ a("span", { className: "figma-plugin-spinner" }),
        /* @__PURE__ */ a("span", { style: { color: "var(--text-secondary)" }, children: "Checking access..." })
      ] }),
      w && /* @__PURE__ */ d("div", { style: { marginBottom: "8px" }, children: [
        /* @__PURE__ */ a("div", { style: { fontWeight: 600, fontSize: "13px", marginBottom: "4px" }, children: w.name }),
        /* @__PURE__ */ d("div", { style: { color: "var(--text-secondary)" }, children: [
          w.pages.length,
          " page",
          w.pages.length !== 1 ? "s" : ""
        ] })
      ] }),
      !g && /* @__PURE__ */ d("div", { style: { color: "var(--text-muted)", lineHeight: 1.6 }, children: [
        /* @__PURE__ */ d("div", { children: [
          "File key: ",
          o.fileKey
        ] }),
        /* @__PURE__ */ d("div", { children: [
          "Node: ",
          o.nodeId || "None (file-level)"
        ] }),
        /* @__PURE__ */ d("div", { children: [
          "Type: ",
          o.fileType
        ] })
      ] })
    ] }) }),
    o && /* @__PURE__ */ d("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ a("label", { className: "figma-plugin-label", children: "Extraction Scope" }),
      /* @__PURE__ */ d("div", { className: "figma-plugin-radio-group", children: [
        /* @__PURE__ */ d("label", { className: "figma-plugin-radio-label", style: o.nodeId ? void 0 : { opacity: 0.5, cursor: "not-allowed" }, children: [
          /* @__PURE__ */ a(
            "input",
            {
              type: "radio",
              name: "scope",
              value: "node",
              checked: c === "node",
              onChange: () => x("node"),
              disabled: !o.nodeId
            }
          ),
          "Single Node",
          !o.nodeId && /* @__PURE__ */ a("span", { className: "figma-plugin-hint", style: { marginTop: 0, marginLeft: "4px" }, children: "Paste a URL with a node-id to use this option" })
        ] }),
        /* @__PURE__ */ d("label", { className: "figma-plugin-radio-label", children: [
          /* @__PURE__ */ a(
            "input",
            {
              type: "radio",
              name: "scope",
              value: "frame",
              checked: c === "frame",
              onChange: () => x("frame")
            }
          ),
          "Frame"
        ] }),
        /* @__PURE__ */ d("label", { className: "figma-plugin-radio-label", children: [
          /* @__PURE__ */ a(
            "input",
            {
              type: "radio",
              name: "scope",
              value: "page",
              checked: c === "page",
              onChange: () => x("page")
            }
          ),
          "Entire Page"
        ] })
      ] })
    ] }),
    F && /* @__PURE__ */ a("div", { className: "figma-plugin-section", children: /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
      /* @__PURE__ */ a("span", { className: "figma-plugin-spinner" }),
      /* @__PURE__ */ a("span", { style: { color: "var(--text-secondary)" }, children: "Extracting layout..." })
    ] }) }),
    y && R && /* @__PURE__ */ d(
      "div",
      {
        className: "figma-plugin-section",
        style: {
          background: "var(--bg-warning, #fff3cd)",
          border: "1px solid var(--border-warning, #ffc107)",
          borderRadius: "6px",
          padding: "12px"
        },
        children: [
          /* @__PURE__ */ a("div", { style: { fontWeight: 600, marginBottom: "4px" }, children: "Large selection" }),
          /* @__PURE__ */ a("div", { style: { marginBottom: "8px", color: "var(--text-primary)" }, children: R.message }),
          /* @__PURE__ */ d("div", { style: { display: "flex", gap: "8px" }, children: [
            /* @__PURE__ */ a("button", { className: "btn-primary", onClick: G, children: "Extract Anyway" }),
            /* @__PURE__ */ a("button", { className: "btn-secondary", onClick: q, children: "Cancel" })
          ] })
        ]
      }
    ),
    S && /* @__PURE__ */ a("div", { className: "figma-plugin-section", children: /* @__PURE__ */ d("div", { className: "figma-plugin-file-info", children: [
      /* @__PURE__ */ a("div", { style: { fontWeight: 600 }, children: "Extraction Complete" }),
      /* @__PURE__ */ d("div", { style: { color: "var(--text-secondary)" }, children: [
        S.nodeCount,
        " nodes extracted",
        S.truncated && " (truncated)"
      ] })
    ] }) }),
    /* @__PURE__ */ a(
      "button",
      {
        className: "btn-primary",
        onClick: X,
        disabled: J,
        style: { width: "100%" },
        children: F ? "Extracting..." : "Extract Design Brief"
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
            /* @__PURE__ */ a("circle", { cx: "12", cy: "12", r: "3" }),
            /* @__PURE__ */ a("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" })
          ]
        }
      )
    }
  );
}
function ye() {
  const n = W(), i = (n == null ? void 0 : n.storage) ?? null, r = (n == null ? void 0 : n.actions) ?? null, [e, t] = p(!1), [l, o] = p(null), [s, c] = p(null), [x, w] = p(!1), [u, g] = p("main");
  B(() => {
    if (!i) return;
    let m = !1;
    return (async () => {
      try {
        const y = await i.read();
        !m && typeof y.figmaToken == "string" && (o(y.figmaToken), typeof y.figmaUserHandle == "string" && c({ id: "", handle: y.figmaUserHandle, img_url: "" }));
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
  }, []), f = b(async (m, y) => {
    if (!(!i || !r))
      try {
        const k = await i.read();
        await i.write({ ...k, figmaToken: m, figmaUserHandle: y.handle }), o(m), c(y), g("main"), r.showToast(`Connected as ${y.handle}`, "success");
      } catch {
        r.showToast("Failed to save token. Please try again.", "error");
      }
  }, [i, r]), F = b(async (m, y) => {
    if (!(!i || !r))
      try {
        const k = await i.read();
        await i.write({ ...k, figmaToken: m, figmaUserHandle: y.handle }), o(m), c(y), g("main"), r.showToast(`Token updated — connected as ${y.handle}`, "success");
      } catch {
        r.showToast("Failed to save token. Please try again.", "error");
      }
  }, [i, r]), P = b(async () => {
    if (!(!i || !r))
      try {
        const m = await i.read(), { figmaToken: y, figmaUserHandle: k, ...E } = m;
        await i.write(E), o(null), c(null), g("main"), r.showToast("Disconnected from Figma", "info");
      } catch {
        r.showToast("Failed to remove token. Please try again.", "error");
      }
  }, [i, r]), S = "Figma", A = l ? /* @__PURE__ */ a(xe, { onClick: () => g("settings") }) : void 0;
  let R = null;
  return x && (l ? u === "settings" && s ? R = /* @__PURE__ */ a(
    ae,
    {
      currentUser: s,
      onTokenUpdated: F,
      onTokenRemoved: P,
      onBack: () => g("main")
    }
  ) : R = /* @__PURE__ */ a(he, { token: l }) : R = /* @__PURE__ */ a(ie, { onTokenSaved: f })), /* @__PURE__ */ d(M, { children: [
    /* @__PURE__ */ a(
      "button",
      {
        onClick: T,
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
        title: S,
        headerRight: A,
        children: R
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
