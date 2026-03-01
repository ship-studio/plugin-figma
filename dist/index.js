import { jsx as l, jsxs as f, Fragment as he } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;function j(t,p,k){if(k!==undefined&&p){p=Object.assign({},p);p.key=k}return R.createElement(t,p)}export const jsx=j;export const jsxs=j;export const Fragment=R.Fragment;";
import { useEffect as se, useCallback as R, useState as $, useMemo as Ge, useRef as Q } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export default R;export const{useState,useEffect,useCallback,useRef,useMemo,useContext,createContext,createElement,Fragment}=R;";
const Ce = window;
function oe() {
  const e = Ce.__SHIPSTUDIO_REACT__, t = Ce.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__;
  return t && (e != null && e.useContext) ? e.useContext(t) : null;
}
const de = "figma-plugin-styles", Ve = `
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

/* Brief mode selector */
.figma-plugin-mode-section {
  margin-bottom: 16px;
}

.figma-plugin-mode-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 8px;
  display: block;
}

.figma-plugin-mode-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.figma-plugin-mode-card {
  padding: 6px 8px;
  border-radius: 4px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: border-color 0.15s ease;
}

.figma-plugin-mode-card:hover {
  border-color: var(--text-muted);
}

.figma-plugin-mode-card.selected {
  border-color: var(--accent, #0d99ff);
}

.figma-plugin-mode-card-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
}

.figma-plugin-mode-card-desc {
  font-size: 10px;
  color: var(--text-muted);
  line-height: 1.3;
}

/* Inspiration textarea */
.figma-plugin-inspiration-textarea {
  margin-top: 8px;
  resize: vertical;
  min-height: 60px;
  max-height: 120px;
  font-size: 12px;
  line-height: 1.4;
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

/* Results view */
.figma-plugin-results-success {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.figma-plugin-results-success-icon {
  color: #38a169;
  font-size: 18px;
  line-height: 1;
}

.figma-plugin-results-guidance {
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.5;
  margin: 12px 0 4px 0;
}

.figma-plugin-results-refinement {
  color: var(--text-muted);
  font-size: 11px;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.figma-plugin-results-stats {
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.6;
  margin-bottom: 8px;
}

.figma-plugin-results-details-toggle {
  background: none;
  border: none;
  color: var(--accent, #0d99ff);
  font-size: 11px;
  cursor: pointer;
  padding: 4px 0;
  margin-top: 4px;
}

.figma-plugin-results-details {
  margin-top: 8px;
  padding: 10px 12px;
  background: var(--bg-primary);
  border-radius: 4px;
  border: 1px solid var(--border);
}

.figma-plugin-results-details h4 {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  margin: 0 0 6px 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.figma-plugin-results-details h4:not(:first-child) {
  margin-top: 12px;
}

.figma-plugin-results-asset-list {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 11px;
  color: var(--text-secondary);
}

.figma-plugin-results-asset-list li {
  padding: 2px 0;
}

.figma-plugin-results-footer {
  color: var(--text-muted);
  font-size: 11px;
  margin-top: 12px;
  text-align: center;
}
`;
function Ke({ open: e, onClose: t, title: i, headerRight: s, children: n }) {
  se(() => {
    if (!e) return;
    let r = document.getElementById(de);
    return r || (r = document.createElement("style"), r.id = de, r.textContent = Ve, document.head.appendChild(r)), () => {
      const c = document.getElementById(de);
      c && c.remove();
    };
  }, [e]), se(() => {
    if (!e) return;
    const r = (c) => {
      c.key === "Escape" && t();
    };
    return document.addEventListener("keydown", r), () => document.removeEventListener("keydown", r);
  }, [e, t]);
  const o = R(
    (r) => {
      r.target === r.currentTarget && t();
    },
    [t]
  );
  return e ? /* @__PURE__ */ l("div", { className: "figma-plugin-overlay", onClick: o, children: /* @__PURE__ */ f("div", { className: "figma-plugin-modal", children: [
    /* @__PURE__ */ f("div", { className: "figma-plugin-modal-header", children: [
      /* @__PURE__ */ l(
        "svg",
        {
          width: "16",
          height: "16",
          viewBox: "0 0 15 15",
          fill: "currentColor",
          children: /* @__PURE__ */ l(
            "path",
            {
              fillRule: "evenodd",
              clipRule: "evenodd",
              d: "M7.00005 2.04999H5.52505C4.71043 2.04999 4.05005 2.71037 4.05005 3.52499C4.05005 4.33961 4.71043 4.99999 5.52505 4.99999H7.00005V2.04999ZM7.00005 1.04999H8.00005H9.47505C10.842 1.04999 11.95 2.15808 11.95 3.52499C11.95 4.33163 11.5642 5.04815 10.9669 5.49999C11.5642 5.95184 11.95 6.66836 11.95 7.475C11.95 8.8419 10.842 9.95 9.47505 9.95C8.92236 9.95 8.41198 9.76884 8.00005 9.46266V9.95L8.00005 11.425C8.00005 12.7919 6.89195 13.9 5.52505 13.9C4.15814 13.9 3.05005 12.7919 3.05005 11.425C3.05005 10.6183 3.43593 9.90184 4.03317 9.44999C3.43593 8.99814 3.05005 8.28163 3.05005 7.475C3.05005 6.66836 3.43594 5.95184 4.03319 5.5C3.43594 5.04815 3.05005 4.33163 3.05005 3.52499C3.05005 2.15808 4.15814 1.04999 5.52505 1.04999H7.00005ZM8.00005 2.04999V4.99999H9.47505C10.2897 4.99999 10.95 4.33961 10.95 3.52499C10.95 2.71037 10.2897 2.04999 9.47505 2.04999H8.00005ZM5.52505 8.94998H7.00005L7.00005 7.4788L7.00005 7.475L7.00005 7.4712V6H5.52505C4.71043 6 4.05005 6.66038 4.05005 7.475C4.05005 8.28767 4.70727 8.94684 5.5192 8.94999L5.52505 8.94998ZM4.05005 11.425C4.05005 10.6123 4.70727 9.95315 5.5192 9.94999L5.52505 9.95H7.00005L7.00005 11.425C7.00005 12.2396 6.33967 12.9 5.52505 12.9C4.71043 12.9 4.05005 12.2396 4.05005 11.425ZM8.00005 7.47206C8.00164 6.65879 8.66141 6 9.47505 6C10.2897 6 10.95 6.66038 10.95 7.475C10.95 8.28962 10.2897 8.95 9.47505 8.95C8.66141 8.95 8.00164 8.29121 8.00005 7.47794V7.47206Z"
            }
          )
        }
      ),
      /* @__PURE__ */ l("span", { className: "figma-plugin-modal-title", children: i }),
      s && /* @__PURE__ */ l("div", { style: { marginLeft: "auto", display: "flex", alignItems: "center" }, children: s })
    ] }),
    /* @__PURE__ */ l("div", { className: "figma-plugin-modal-body", children: n })
  ] }) }) : null;
}
const Xe = "https://api.figma.com/v1";
async function ee(e, t, i, s) {
  const n = `${Xe}${t}`, o = Math.ceil(((s == null ? void 0 : s.timeout) ?? 3e4) / 1e3), r = [
    "-sS",
    "--max-time",
    String(o),
    "-H",
    `X-Figma-Token: ${i}`,
    n
  ], c = await e.exec("curl", r, {
    timeout: (s == null ? void 0 : s.timeout) ?? 12e4
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
async function Ne(e, t) {
  return ee(e, "/me", t);
}
async function Ze(e, t, i) {
  const s = await ee(e, `/files/${i}?depth=1`, t);
  return {
    name: s.name,
    pages: s.document.children.filter((n) => n.type === "CANVAS").map((n) => ({ id: n.id, name: n.name }))
  };
}
async function qe(e, t, i, s) {
  const n = await ee(
    e,
    `/files/${i}/nodes?ids=${encodeURIComponent(s)}`,
    t,
    { timeout: 12e4 }
  ), o = n.nodes[s];
  if (!o) {
    const r = Object.keys(n.nodes), c = r.find(
      (u) => u.replace(/%3A/g, ":") === s || u === s.replace(/:/g, "%3A")
    );
    if (c)
      return {
        rootNode: n.nodes[c].document,
        components: n.nodes[c].components,
        styles: n.nodes[c].styles ?? {}
      };
    throw new Error(
      `Node "${s}" not found in API response. Available nodes: ${r.join(", ")}`
    );
  }
  return {
    rootNode: o.document,
    components: o.components,
    styles: o.styles ?? {}
  };
}
async function Je(e, t, i) {
  const s = await ee(
    e,
    `/files/${i}`,
    t,
    { timeout: 12e4 }
  );
  return {
    rootNodes: s.document.children,
    components: s.components,
    styles: s.styles ?? {}
  };
}
async function fe(e, t, i, s, n = "png", o) {
  const r = s.map((d) => encodeURIComponent(d)).join(",");
  let c = `/images/${i}?ids=${r}&format=${n}`;
  return o != null && (c += `&scale=${o}`), n === "svg" && (c += "&svg_outline_text=true&svg_include_id=true&svg_simplify_stroke=true"), (await ee(
    e,
    c,
    t,
    { timeout: 12e4 }
  )).images;
}
function Ye({ onTokenSaved: e }) {
  const t = oe(), i = (t == null ? void 0 : t.shell) ?? null, [s, n] = $(""), [o, r] = $(!1), [c, u] = $(null), d = R(async () => {
    if (!i) return;
    const y = s.trim();
    if (!(!y || o)) {
      r(!0), u(null);
      try {
        const v = await Ne(i, y);
        e(y, v);
      } catch (v) {
        u((v == null ? void 0 : v.message) || "Failed to validate token. Please check and try again.");
      } finally {
        r(!1);
      }
    }
  }, [s, o, i, e]), x = R(
    (y) => {
      y.key === "Enter" && d();
    },
    [d]
  );
  return /* @__PURE__ */ f("div", { children: [
    /* @__PURE__ */ f("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ l("h3", { style: { fontSize: "14px", fontWeight: 600, margin: "0 0 8px 0" }, children: "Connect to Figma" }),
      /* @__PURE__ */ f("p", { style: { fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 16px 0", lineHeight: 1.5 }, children: [
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
    /* @__PURE__ */ f("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ l("label", { className: "figma-plugin-label", children: "Personal Access Token" }),
      /* @__PURE__ */ l(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: s,
          onChange: (y) => n(y.target.value),
          onKeyDown: x,
          disabled: o
        }
      ),
      c && /* @__PURE__ */ l("div", { className: "figma-plugin-error", children: c }),
      /* @__PURE__ */ l("div", { className: "figma-plugin-hint", children: "Token is stored locally in this project only." })
    ] }),
    /* @__PURE__ */ l(
      "button",
      {
        className: "btn-primary",
        onClick: d,
        disabled: !s.trim() || o,
        style: { width: "100%", marginTop: "4px" },
        children: o ? /* @__PURE__ */ f(he, { children: [
          /* @__PURE__ */ l("span", { className: "figma-plugin-spinner", style: { marginRight: "8px", verticalAlign: "middle" } }),
          "Connecting..."
        ] }) : "Connect"
      }
    )
  ] });
}
function Qe({ currentUser: e, onTokenUpdated: t, onTokenRemoved: i, onBack: s }) {
  const n = oe(), o = (n == null ? void 0 : n.shell) ?? null, [r, c] = $(""), [u, d] = $(!1), [x, y] = $(null), v = R(async () => {
    if (!o) return;
    const b = r.trim();
    if (!(!b || u)) {
      d(!0), y(null);
      try {
        const E = await Ne(o, b);
        t(b, E);
      } catch (E) {
        y((E == null ? void 0 : E.message) || "Failed to validate token. Please check and try again.");
      } finally {
        d(!1);
      }
    }
  }, [r, u, o, t]), C = R(
    (b) => {
      b.key === "Enter" && v();
    },
    [v]
  );
  return /* @__PURE__ */ f("div", { children: [
    /* @__PURE__ */ f(
      "button",
      {
        onClick: s,
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
    /* @__PURE__ */ l("div", { className: "figma-plugin-section", children: /* @__PURE__ */ f("div", { className: "figma-plugin-success", style: { display: "flex", alignItems: "center", gap: "6px", marginTop: "0" }, children: [
      /* @__PURE__ */ l("span", { style: { fontSize: "10px" }, children: "●" }),
      "Connected as ",
      e.handle
    ] }) }),
    /* @__PURE__ */ f("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ l("label", { className: "figma-plugin-label", children: "Update Token" }),
      /* @__PURE__ */ l(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: r,
          onChange: (b) => c(b.target.value),
          onKeyDown: C,
          disabled: u
        }
      ),
      x && /* @__PURE__ */ l("div", { className: "figma-plugin-error", children: x }),
      /* @__PURE__ */ l(
        "button",
        {
          className: "btn-primary",
          onClick: v,
          disabled: !r.trim() || u,
          style: { width: "100%", marginTop: "8px" },
          children: u ? /* @__PURE__ */ f(he, { children: [
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
        onClick: i,
        style: { width: "100%" },
        children: "Disconnect"
      }
    ) })
  ] });
}
function et(e) {
  const t = e.match(
    /figma\.com\/(file|design|proto|board)\/([A-Za-z0-9]+)/
  );
  if (!t) return null;
  const i = t[1], s = t[2];
  let n = null;
  const o = e.match(/[?&]node-id=([^&]+)/);
  return o && (n = decodeURIComponent(o[1]).replace(/-/g, ":")), { fileKey: s, nodeId: n, fileType: i };
}
function tt(e) {
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
function nt(e) {
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
function it(e) {
  const t = {
    flexDirection: e.layoutMode === "HORIZONTAL" ? "row" : "column",
    justifyContent: tt(e.primaryAxisAlignItems),
    alignItems: nt(e.counterAxisAlignItems),
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
function st(e, t) {
  const i = t[e.componentId];
  let s;
  if (e.componentProperties) {
    const o = {};
    for (const [r, c] of Object.entries(e.componentProperties))
      (c.type === "VARIANT" || c.type === "BOOLEAN" || c.type === "TEXT") && (o[r] = c.value);
    Object.keys(o).length > 0 && (s = o);
  }
  const n = {
    componentId: e.componentId,
    componentName: (i == null ? void 0 : i.name) ?? e.name,
    isRemote: (i == null ? void 0 : i.remote) ?? !1,
    source: i != null && i.remote ? "library" : "local"
  };
  return i != null && i.description && (n.description = i.description), s && (n.variantProperties = s), e.overrides && (n.overrides = e.overrides), n;
}
function Te(e, t, i, s) {
  const n = e;
  if (n.type === "SLICE") return null;
  const o = {
    id: n.id,
    name: n.name,
    type: n.type,
    visible: n.visible !== !1
    // defaults to true when undefined
  };
  switch (n.absoluteBoundingBox != null ? (o.width = n.absoluteBoundingBox.width, o.height = n.absoluteBoundingBox.height) : n.size != null && (o.width = n.size.x, o.height = n.size.y), "layoutSizingHorizontal" in n && (o.widthMode = n.layoutSizingHorizontal), "layoutSizingVertical" in n && (o.heightMode = n.layoutSizingVertical), "layoutPositioning" in n && n.layoutPositioning != null && (o.positioning = n.layoutPositioning), "layoutGrow" in n && n.layoutGrow === 1 && (o.layoutGrow = 1), "layoutAlign" in n && n.layoutAlign === "STRETCH" && (o.layoutAlign = "STRETCH"), o.positioning === "ABSOLUTE" && s != null && n.absoluteBoundingBox != null && (o.absoluteOffset = {
    top: Math.round(n.absoluteBoundingBox.y - s.y),
    left: Math.round(n.absoluteBoundingBox.x - s.x)
  }), "layoutMode" in n && n.layoutMode && n.layoutMode !== "NONE" && (o.autoLayout = it(n)), "constraints" in n && n.constraints != null && (o.constraints = n.constraints), "minWidth" in n && n.minWidth != null && (o.minWidth = n.minWidth), "maxWidth" in n && n.maxWidth != null && (o.maxWidth = n.maxWidth), "minHeight" in n && n.minHeight != null && (o.minHeight = n.minHeight), "maxHeight" in n && n.maxHeight != null && (o.maxHeight = n.maxHeight), "preserveRatio" in n && n.preserveRatio != null && (o.preserveRatio = n.preserveRatio), "fills" in n && Array.isArray(n.fills) && (o.fills = n.fills), "strokes" in n && Array.isArray(n.strokes) && (o.strokes = n.strokes), "strokeWeight" in n && n.strokeWeight != null && (o.strokeWeight = n.strokeWeight), "effects" in n && Array.isArray(n.effects) && (o.effects = n.effects), "cornerRadius" in n && n.cornerRadius != null && (o.cornerRadius = n.cornerRadius), "rectangleCornerRadii" in n && Array.isArray(n.rectangleCornerRadii) && (o.rectangleCornerRadii = n.rectangleCornerRadii), "opacity" in n && n.opacity != null && n.opacity !== 1 && (o.opacity = n.opacity), "blendMode" in n && n.blendMode && n.blendMode !== "PASS_THROUGH" && n.blendMode !== "NORMAL" && (o.blendMode = n.blendMode), "isMask" in n && n.isMask === !0 && (o.isMask = !0), "styles" in n && n.styles && (o.styleRefs = n.styles), n.type) {
    case "TEXT":
      o.textContent = n.characters, n.style && (o.textStyle = n.style), n.styleOverrideTable && Object.keys(n.styleOverrideTable).length > 0 && (o.textStyleOverrides = n.styleOverrideTable);
      break;
    case "INSTANCE":
      return o.componentRef = st(n, t), o;
    case "BOOLEAN_OPERATION":
      return o;
  }
  if ("children" in n && Array.isArray(n.children)) {
    const r = n.absoluteBoundingBox != null ? { x: n.absoluteBoundingBox.x, y: n.absoluteBoundingBox.y } : null, c = n.children.map((u) => Te(u, t, i + 1, r)).filter((u) => u !== null);
    o.children = rt(c);
  }
  return o;
}
function ye(e) {
  let t = 1;
  if (e.children && Array.isArray(e.children))
    for (const i of e.children)
      t += ye(i);
  return t;
}
function ot(e) {
  const t = e.componentRef, i = t.variantProperties ? JSON.stringify(t.variantProperties, Object.keys(t.variantProperties).sort()) : "";
  return `${t.componentId}::${i}`;
}
function rt(e) {
  if (e.length === 0) return [];
  const t = /* @__PURE__ */ new Map();
  for (let n = 0; n < e.length; n++) {
    const o = e[n];
    if (o.componentRef) {
      const r = ot(o), c = t.get(r);
      c ? (c.count++, c.indices.push(n)) : t.set(r, { node: o, count: 1, indices: [n] });
    }
  }
  const i = /* @__PURE__ */ new Set();
  for (const n of t.values())
    if (n.count >= 3) {
      n.node.repeatCount = n.count;
      for (let o = 1; o < n.indices.length; o++)
        i.add(n.indices[o]);
    }
  const s = [];
  for (let n = 0; n < e.length; n++)
    i.has(n) || s.push(e[n]);
  return s;
}
function at(e, t) {
  let i = 0;
  for (const n of e)
    i += ye(n);
  return {
    rootNodes: e.map((n) => Te(n, t, 0, null)).filter((n) => n !== null),
    nodeCount: i,
    truncated: !1
  };
}
function q(e) {
  const t = Math.round(e.r * 255), i = Math.round(e.g * 255), s = Math.round(e.b * 255);
  if (e.a >= 1)
    return `#${t.toString(16).padStart(2, "0")}${i.toString(16).padStart(2, "0")}${s.toString(16).padStart(2, "0")}`;
  const n = parseFloat(e.a.toFixed(2));
  return `rgba(${t}, ${i}, ${s}, ${n})`;
}
function lt(e) {
  const t = e.gradientStops.map((i) => `${q(i.color)} ${Math.round(i.position * 100)}%`).join(", ");
  switch (e.type) {
    case "GRADIENT_LINEAR": {
      const [i, s] = e.gradientHandlePositions, n = s.x - i.x, o = s.y - i.y, r = Math.atan2(o, n);
      return `linear-gradient(${(Math.round(r * 180 / Math.PI + 90) % 360 + 360) % 360}deg, ${t})`;
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
function ct(e, t) {
  const i = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), u = [], d = /* @__PURE__ */ new Map();
  let x = 0, y = 0, v = 0;
  function C(a) {
    var m, L, z;
    if (a.fills && Array.isArray(a.fills)) {
      const h = dt(a, t);
      for (const g of a.fills)
        if (g.visible !== !1)
          if (g.type === "SOLID") {
            const A = { ...g.color };
            g.opacity != null && g.opacity !== 1 && (A.a = A.a * g.opacity);
            const N = q(A);
            pe(i, N, a.id, "fill", h);
          } else if ((m = g.type) != null && m.startsWith("GRADIENT_")) {
            const A = lt(g), N = A, P = s.get(N);
            P ? (P.usageCount++, P.nodeIds.push(a.id)) : (v++, s.set(N, {
              value: A,
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
      const h = ft(a, t);
      for (const g of a.strokes)
        if (g.visible !== !1 && g.type === "SOLID") {
          const A = { ...g.color };
          g.opacity != null && g.opacity !== 1 && (A.a = A.a * g.opacity);
          const N = q(A);
          pe(i, N, a.id, "stroke", h);
        }
    }
    if (a.effects && Array.isArray(a.effects)) {
      const h = gt(a, t);
      for (const g of a.effects)
        if (g.visible === !0 && (g.type === "DROP_SHADOW" || g.type === "INNER_SHADOW")) {
          const A = g.type === "DROP_SHADOW" ? "drop-shadow" : "inner-shadow", N = q(g.color), P = ((L = g.offset) == null ? void 0 : L.x) ?? 0, H = ((z = g.offset) == null ? void 0 : z.y) ?? 0, O = g.radius ?? 0, _ = g.spread ?? 0, J = `${A}|${N}|${P}|${H}|${O}|${_}`, G = c.get(J);
          G ? (G.usageCount++, G.nodeIds.push(a.id)) : (y++, c.set(J, {
            type: A,
            color: N,
            offsetX: P,
            offsetY: H,
            blur: O,
            spread: _,
            name: h ?? `shadow-${y}`,
            usageCount: 1,
            nodeIds: [a.id]
          })), pe(i, N, a.id, "shadow", null);
        }
    }
    if (a.type === "TEXT" && a.textStyle) {
      const h = pt(a, t);
      if ($e(n, a.textStyle, a.id, h), a.textStyleOverrides && typeof a.textStyleOverrides == "object")
        for (const g of Object.values(a.textStyleOverrides))
          $e(n, g, a.id, null);
    }
    if (a.autoLayout) {
      const h = a.autoLayout;
      h.padding && (Z(o, h.padding.top, "padding-top"), Z(o, h.padding.right, "padding-right"), Z(o, h.padding.bottom, "padding-bottom"), Z(o, h.padding.left, "padding-left")), Z(o, h.gap, "gap"), h.rowGap != null && Z(o, h.rowGap, "row-gap");
    }
    if (a.cornerRadius != null || a.rectangleCornerRadii != null || ut(a)) {
      const h = a.rectangleCornerRadii ? null : a.cornerRadius ?? null, g = a.rectangleCornerRadii ?? null;
      let A = null, N = null;
      if (a.strokes && Array.isArray(a.strokes)) {
        const O = a.strokes.find(
          (_) => _.visible !== !1 && _.type === "SOLID"
        );
        O && (A = q(O.color), N = a.strokeWeight ?? null);
      }
      const P = `${h}|${JSON.stringify(g)}|${A}|${N}`, H = r.get(P);
      H ? (H.usageCount++, H.nodeIds.push(a.id)) : (x++, r.set(P, {
        radius: h,
        cornerRadii: g,
        strokeColor: A,
        strokeWeight: N,
        name: `border-${x}`,
        usageCount: 1,
        nodeIds: [a.id]
      }));
    }
    if (a.componentRef) {
      const h = a.componentRef, g = `${h.componentName}::${JSON.stringify(h.variantProperties ?? {})}`, A = d.get(g), N = a.repeatCount ?? 1;
      if (A)
        A.usageCount += N;
      else {
        const P = {
          componentName: h.componentName,
          source: h.source,
          usageCount: N
        };
        h.description && (P.description = h.description), h.variantProperties && (P.variantProperties = h.variantProperties), d.set(g, P);
      }
    }
    if (a.children)
      for (const h of a.children)
        C(h);
  }
  for (const a of e)
    C(a);
  const b = Array.from(i.values()).map((a) => ({
    value: a.value,
    name: a.name,
    usageCount: a.usageCount,
    nodeIds: a.nodeIds,
    source: Array.from(a.source)
  }));
  b.sort((a, m) => m.usageCount - a.usageCount);
  const E = Array.from(s.values());
  E.sort((a, m) => m.usageCount - a.usageCount);
  const B = Array.from(n.values());
  B.sort((a, m) => m.usageCount - a.usageCount);
  const U = Array.from(o.values());
  U.sort((a, m) => a.value - m.value);
  const M = Array.from(r.values());
  M.sort((a, m) => m.usageCount - a.usageCount);
  const w = Array.from(c.values());
  w.sort((a, m) => m.usageCount - a.usageCount);
  const k = Array.from(d.values());
  return k.sort((a, m) => m.usageCount - a.usageCount), {
    colors: b,
    gradients: E,
    typography: B,
    spacing: U,
    borders: M,
    shadows: w,
    imageFills: u,
    components: k
  };
}
function pe(e, t, i, s, n) {
  const o = e.get(t);
  if (o)
    o.usageCount++, o.nodeIds.includes(i) || o.nodeIds.push(i), o.source.add(s), n && o.name.startsWith("color-") && (o.name = n);
  else {
    const r = `color-${t.replace(/^#/, "").replace(/[^a-f0-9]/gi, "")}`;
    e.set(t, {
      value: t,
      name: n ?? r,
      usageCount: 1,
      nodeIds: [i],
      source: /* @__PURE__ */ new Set([s])
    });
  }
}
function $e(e, t, i, s) {
  const n = t.fontFamily ?? "Unknown", o = t.fontSize ?? 16, r = t.fontWeight ?? 400, c = t.lineHeightPx ?? null, u = t.letterSpacing ?? 0, d = `${n}|${o}|${r}|${c}|${u}`, x = e.get(d);
  if (x)
    x.usageCount++, x.nodeIds.includes(i) || x.nodeIds.push(i), s && x.name.startsWith(n) && (x.name = s);
  else {
    const y = `${n}-${o}-${r}`;
    e.set(d, {
      fontFamily: n,
      fontSize: o,
      fontWeight: r,
      lineHeight: c,
      letterSpacing: u,
      name: s ?? y,
      usageCount: 1,
      nodeIds: [i]
    });
  }
}
function Z(e, t, i) {
  if (t === 0) return;
  const s = e.get(t);
  s ? (s.usageCount++, s.sources.includes(i) || s.sources.push(i)) : e.set(t, {
    value: t,
    usageCount: 1,
    sources: [i]
  });
}
function ut(e) {
  return !e.strokes || !Array.isArray(e.strokes) ? !1 : e.strokes.some((t) => t.visible !== !1 && t.type === "SOLID");
}
function dt(e, t) {
  var s, n;
  const i = (s = e.styleRefs) == null ? void 0 : s.fill;
  return i ? ((n = t[i]) == null ? void 0 : n.name) ?? null : null;
}
function ft(e, t) {
  var s, n;
  const i = (s = e.styleRefs) == null ? void 0 : s.stroke;
  return i ? ((n = t[i]) == null ? void 0 : n.name) ?? null : null;
}
function pt(e, t) {
  var s, n;
  const i = (s = e.styleRefs) == null ? void 0 : s.text;
  return i ? ((n = t[i]) == null ? void 0 : n.name) ?? null : null;
}
function gt(e, t) {
  var s, n;
  const i = (s = e.styleRefs) == null ? void 0 : s.effect;
  return i ? ((n = t[i]) == null ? void 0 : n.name) ?? null : null;
}
const mt = 500, ht = 2e3;
async function yt(e) {
  const { shell: t, token: i, fileKey: s, nodeId: n, scope: o } = e;
  let r, c, u;
  if (o === "node" || o === "frame") {
    if (!n)
      throw new Error(
        `Cannot extract ${o}: no node ID found in the URL. Paste a Figma URL that includes a node-id, or switch to "Entire Page" scope.`
      );
    const C = await qe(t, i, s, n);
    r = [C.rootNode], c = C.components, u = C.styles;
  } else {
    const C = await Je(t, i, s), b = C.rootNodes[0];
    r = (b == null ? void 0 : b.children) || [], c = C.components, u = C.styles;
  }
  let d = 0;
  for (const C of r)
    d += ye(C);
  let x;
  d > mt && (x = {
    nodeCount: d,
    message: `This selection has ~${d} nodes. Large extractions may produce verbose output.`
  });
  const y = at(r, c);
  d > ht && (y.truncated = !0);
  const v = ct(y.rootNodes, u);
  return { extraction: y, tokens: v, fileKey: s, largeTreeWarning: x, rawRootNodes: r };
}
async function xt(e, t) {
  const i = `${t}/.shipstudio/assets`, s = await e.exec("rm", ["-rf", i]);
  if (s.exit_code !== 0)
    throw new Error(`Failed to clean assets directory: ${s.stderr}`);
  const n = await e.exec("mkdir", ["-p", i]);
  if (n.exit_code !== 0)
    throw new Error(`Failed to create assets directory: ${n.stderr}`);
  return i;
}
async function ke(e, t, i) {
  const s = ["-sS", "-o", i, "--max-time", "30", "-L", t];
  if ((await e.exec("curl", s, { timeout: 35e3 })).exit_code === 0) return { success: !0 };
  const o = await e.exec("curl", s, { timeout: 35e3 });
  return o.exit_code === 0 ? { success: !0 } : {
    success: !1,
    error: o.stderr || `curl exit code ${o.exit_code}`
  };
}
function vt(e, t) {
  return e[t] ?? e[encodeURIComponent(t)] ?? e[decodeURIComponent(t)] ?? null;
}
async function bt(e) {
  const { shell: t, token: i, fileKey: s, selectedNodeId: n, projectPath: o, manualAssets: r = [], onProgress: c } = e, u = [], d = r.filter((w) => w.status === "valid"), x = d.length + 1, y = await xt(t, o);
  c && c({ current: 0, total: x, currentAsset: "preview.png", phase: "preview" });
  let v = `${y}/preview.png`;
  try {
    const k = (await fe(t, i, s, [n], "png", 2))[n];
    if (k) {
      const a = await ke(t, k, v);
      a.success || (u.push(`Preview download failed: ${a.error}`), v = "");
    } else
      u.push("Figma could not render preview for this node"), v = "";
  } catch (w) {
    u.push(`Preview render failed: ${(w == null ? void 0 : w.message) || "Unknown error"}`), v = "";
  }
  const C = d.filter((w) => w.format === "png"), b = d.filter((w) => w.format === "svg");
  let E = {}, B = {};
  if (C.length > 0)
    try {
      E = await fe(t, i, s, C.map((w) => w.nodeId), "png", 2);
    } catch (w) {
      u.push(`PNG batch render failed: ${(w == null ? void 0 : w.message) || "Unknown error"}`), E = {};
    }
  if (b.length > 0)
    try {
      B = await fe(t, i, s, b.map((w) => w.nodeId), "svg");
    } catch (w) {
      u.push(`SVG batch render failed: ${(w == null ? void 0 : w.message) || "Unknown error"}`), B = {};
    }
  const U = [], M = [...C, ...b];
  for (let w = 0; w < M.length; w++) {
    const k = M[w], a = k.format === "png" ? E : B;
    c && c({
      current: w + 1,
      total: x,
      currentAsset: k.filename,
      phase: "assets"
    });
    const m = vt(a, k.nodeId);
    if (!m) {
      u.push(`Failed to render ${k.filename}: Figma returned no image for node ${k.nodeId}`);
      continue;
    }
    const L = `${y}/${k.filename}`, z = await ke(t, m, L);
    if (!z.success) {
      u.push(`Failed to download ${k.filename}: ${z.error}`);
      continue;
    }
    U.push({
      filename: k.filename,
      path: L,
      nodeId: k.nodeId,
      assetType: k.format === "svg" ? "icon" : "image"
    });
  }
  return {
    assetsDir: y,
    previewPath: v,
    assets: U,
    warnings: u
  };
}
function wt(e) {
  return e.toLowerCase().replace(/[/\s]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "") || "unnamed";
}
function Ct(e, t) {
  if (!t.includes(e))
    return e;
  const i = e.lastIndexOf("."), s = i !== -1, n = s ? e.slice(0, i) : e, o = s ? e.slice(i) : "";
  let r = 2;
  for (; t.includes(`${n}-${r}${o}`); )
    r++;
  return `${n}-${r}${o}`;
}
const Ae = /^@s-/i;
function $t(e) {
  return Ae.test(e);
}
function kt(e) {
  return e.replace(Ae, "");
}
function Se(e) {
  if (e.fills && Array.isArray(e.fills)) {
    for (const t of e.fills)
      if (t.visible !== !1 && t.type === "IMAGE")
        return !0;
  }
  if (e.children && Array.isArray(e.children)) {
    for (const t of e.children)
      if (Se(t)) return !0;
  }
  return !1;
}
function Ie(e, t, i, s, n, o) {
  if (e.visible !== !1) {
    if ($t(e.name) && !s) {
      const r = kt(e.name);
      if (!r.trim())
        o.push(`Skipped layer "${e.name}": empty name after @S- prefix`);
      else {
        const c = Se(e) ? "png" : "svg";
        n.push({
          nodeId: e.id,
          nodeName: e.name,
          nameAfterPrefix: r,
          format: c,
          depth: t,
          parentPath: [...i]
        });
      }
      s = !0;
    }
    if (e.children && Array.isArray(e.children)) {
      const r = [...i, e.name];
      for (const c of e.children)
        Ie(c, t + 1, r, s, n, o);
    }
  }
}
function Nt(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = `${wt(n.nameAfterPrefix)}.${n.format}`;
    t.has(r) || t.set(r, n);
  }
  const i = [], s = [];
  for (const [n, o] of t) {
    const r = Ct(n, i);
    i.push(r), s.push({
      nodeId: o.nodeId,
      nodeName: o.nodeName,
      filename: r,
      format: o.format,
      depth: o.depth,
      parentPath: o.parentPath
    });
  }
  return s;
}
function Tt(e) {
  const t = [], i = [];
  return Ie(e, 0, [], !1, t, i), { assets: Nt(t), warnings: i };
}
function At(e) {
  return e.map((t) => ({
    nodeId: t.nodeId,
    nodeName: t.nodeName,
    filename: t.filename,
    format: t.format,
    status: "valid"
  }));
}
const St = /^(Frame|Group|Rectangle|Ellipse|Vector|Section|Instance|Line|Star|Polygon)\s*\d*$/i;
function It(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e) {
    const s = Ee(i.name) ? [] : [i.name];
    Re(i, s, t);
  }
  return t;
}
function Re(e, t, i) {
  if (i.set(e.id, Rt(t)), !!e.children)
    for (const s of e.children) {
      const n = Ee(s.name) ? t : [...t, s.name];
      Re(s, n, i);
    }
}
function Rt(e) {
  return e.length === 0 ? "" : e.length <= 4 ? e.join(" > ") : `${e[0]} > ... > ${e[e.length - 2]} > ${e[e.length - 1]}`;
}
function Ee(e) {
  return St.test(e);
}
const Et = 12e3;
function Pt(e) {
  return Math.ceil(e.length / 4);
}
function Lt(e) {
  const { extraction: t, exportResult: i, projectPath: s } = e, n = t.tokens, o = /* @__PURE__ */ new Map();
  for (const C of i.assets)
    C.nodeId && o.set(C.nodeId, C.filename), C.parentInstanceId && !o.has(C.parentInstanceId) && o.set(C.parentInstanceId, C.filename);
  const r = e.rootNodes ?? t.extraction.rootNodes, c = It(r), d = [
    Mt(e),
    Ft(e.mode, e.inspirationText),
    Bt(i.previewPath, s),
    Ut(t.extraction.rootNodes, o),
    Dt(n),
    Zt(n.components),
    qt(i.previewPath, i.assets, s, c),
    Jt()
  ].filter(Boolean).join(`

`), x = d.length, y = Pt(d), v = {
    nodeCount: t.extraction.nodeCount,
    colorCount: n.colors.length,
    fontCount: n.typography.length,
    assetCount: i.assets.length,
    estimatedTokens: y
  };
  return {
    markdown: d,
    charCount: x,
    estimatedTokens: y,
    stats: v
  };
}
function Mt(e) {
  var u;
  const { extraction: t, fileName: i, figmaUrl: s } = e, n = ((u = t.extraction.rootNodes[0]) == null ? void 0 : u.name) ?? "Untitled", o = e.date ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), c = {
    best: "Copy (Best results)",
    pixel: "Copy (Pixel for pixel)",
    inspiration: "Use as inspiration"
  }[e.mode ?? "best"] ?? "Copy (Best results)";
  return [
    "# Design Brief",
    "",
    `**File:** ${i}`,
    `**Frame:** ${n}`,
    `**Extracted:** ${o}`,
    `**Mode:** ${c}`,
    `**Figma URL:** ${s}`
  ].join(`
`);
}
function Ft(e, t) {
  const i = e ?? "best", s = ["## How to Use This Brief", ""], n = "Read this brief fully. Study the preview image, layout tree, and design tokens before writing any code.", o = "The Assets section below is the complete manifest of provided files. Use only these assets -- every visual element NOT listed there should be built with CSS or HTML, not with image files. For any visual element visible in the preview that appears to be a photograph, logo, icon, or illustration but is NOT listed in the Assets section, create a placeholder box instead -- see the Placeholders section below for styling and naming conventions.", r = "Compare your result against the preview image and verify that layout, spacing, colors, and typography match the design tokens.";
  return i === "best" ? s.push(
    `**Before building:** ${n}`,
    `**During building:** Reproduce the design faithfully using clean, production-ready code. Use semantic HTML, CSS flexbox/grid for layout, and relative units (rem, %, vh) where appropriate. Follow the spacing and color tokens exactly, but use responsive patterns so the result works across screen sizes. ${o}`,
    `**After building:** ${r}`
  ) : i === "pixel" ? s.push(
    `**Before building:** ${n}`,
    `**During building:** Match the Figma design as exactly as possible. Use the exact pixel values from the design tokens for font sizes, spacing, widths, and heights. Use fixed dimensions rather than responsive units. Prioritize visual accuracy over code flexibility. ${o}`,
    `**After building:** ${r} Pay special attention to exact pixel dimensions, spacing values, and font sizes.`
  ) : i === "inspiration" && (s.push(
    `**Before building:** ${n} Use this design as a reference for visual patterns, not a spec to copy exactly.`,
    `**During building:** Adapt the design's style and layout patterns to fit the user's existing site and codebase. Use the color palette, typography choices, and layout structure as guidance, but adjust proportions, spacing, and components to work within the target context. ${o}`,
    "**After building:** Verify that your result captures the spirit of the design -- the visual hierarchy, color usage, and layout patterns -- while fitting naturally into the target codebase."
  ), t && t.trim() && s.push("", "**What to take from this design:**", "", `> ${t.trim().split(`
`).join(`
> `)}`)), s.join(`
`);
}
function Bt(e, t) {
  return e ? `## Preview

![Preview](${me(e, t)})` : "";
}
function Ut(e, t) {
  const i = [];
  for (const s of e)
    Pe(s, 0, i, t);
  return i.length === 0 ? "" : `## Layout Tree

` + i.join(`
`);
}
function Pe(e, t, i, s) {
  if (e.visible !== !1 && (i.push(Ht(e, t, s)), !e.componentRef && e.children))
    for (const n of e.children)
      Pe(n, t + 1, i, s);
}
function zt(e) {
  return e.charAt(0).toUpperCase() + e.slice(1).toLowerCase();
}
function Le(e) {
  return /Property\s+\d+=/i.test(e) ? e.split(",").map((t) => {
    const i = t.indexOf("=");
    if (i !== -1) {
      const s = t.slice(0, i).trim(), n = t.slice(i + 1).trim();
      if (/^Property\s+\d+$/i.test(s)) return n;
    }
    return t.trim();
  }).join(", ") : e;
}
function Ht(e, t, i) {
  const s = "  ".repeat(t), n = [];
  if (e.componentRef) {
    let c = `Instance "${Le(e.componentRef.componentName)}"`;
    if (e.repeatCount && e.repeatCount > 1 && (c += ` x${e.repeatCount} (repeated)`), e.componentRef.variantProperties && Object.keys(e.componentRef.variantProperties).length > 0) {
      const d = Object.entries(e.componentRef.variantProperties).map(([x, y]) => /^Property\s+\d+$/i.test(x) ? String(y) : `${x}: ${y}`).join(", ");
      c += ` (${d})`;
    }
    const u = i == null ? void 0 : i.get(e.id);
    u && (c += ` -> ${u}`), n.push(c);
  } else if (e.type === "TEXT") {
    const r = e.textContent ?? "", c = r.length > 200 ? r.slice(0, 200) + "..." : r;
    let u = "";
    e.textStyle && (u = ` (${e.textStyle.fontFamily} ${e.textStyle.fontSize}/${e.textStyle.fontWeight})`), n.push(`Text '${c}'${u}`);
  } else
    n.push(`${zt(e.type)} '${e.name}'`);
  if (e.autoLayout) {
    const r = e.autoLayout, c = [r.flexDirection];
    r.gap > 0 && c.push(`gap: ${r.gap}`), r.justifyContent !== "flex-start" && c.push(`justify: ${r.justifyContent}`), r.alignItems !== "flex-start" && c.push(`align: ${r.alignItems}`);
    const u = _t(r.padding);
    u && c.push(u), r.flexWrap === "wrap" && c.push("wrap"), n.push(`(${c.join(", ")})`);
  }
  e.width != null && e.height != null && n.push(`${Math.round(e.width)}x${Math.round(e.height)}`), e.positioning === "ABSOLUTE" && (e.absoluteOffset ? n.push(`[absolute] top:${e.absoluteOffset.top} left:${e.absoluteOffset.left}`) : n.push("[absolute]"));
  const o = Ot(e);
  return o && n.push(o), `${s}${n.join(" ")}`;
}
function ge(e) {
  if (!e) return null;
  for (const t of e)
    if (t.visible !== !1 && t.type === "SOLID" && t.color) {
      const i = t.opacity ?? 1, s = { ...t.color, a: (t.color.a ?? 1) * i };
      return q(s);
    }
  return null;
}
function Ot(e) {
  var i;
  const t = [];
  if (e.widthMode === "FILL" && t.push("w:fill"), e.heightMode === "FILL" && t.push("h:fill"), e.widthMode === "HUG" && t.push("w:hug"), e.heightMode === "HUG" && t.push("h:hug"), e.type !== "TEXT") {
    const s = ge(e.fills);
    s && s !== "#ffffff" && s !== "#000000" ? t.push(`bg:${s}`) : s && t.push(`bg:${s}`);
  }
  if (e.type === "TEXT") {
    const s = ge(e.fills);
    s && t.push(`color:${s}`);
  }
  if (e.cornerRadius && e.cornerRadius > 0 && t.push(`r:${Math.round(e.cornerRadius)}`), e.strokeWeight && e.strokeWeight > 0 && ((i = e.strokes) != null && i.length)) {
    const s = ge(e.strokes);
    s && t.push(`border:${e.strokeWeight}px ${s}`);
  }
  return e.layoutGrow === 1 && t.push("flex-grow:1"), e.layoutAlign === "STRETCH" && t.push("align-self:stretch"), e.opacity != null && e.opacity < 1 && t.push(`opacity:${e.opacity.toFixed(2)}`), t.length === 0 ? null : `{${t.join(" ")}}`;
}
function _t(e) {
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
      const s = i.lineHeight !== null ? `${i.lineHeight}px` : "auto";
      return `| ${i.name} | ${i.fontFamily} | ${i.fontSize}px | ${i.fontWeight} | ${s} |`;
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
      const s = i.radius !== null ? `${i.radius}px` : i.cornerRadii ? i.cornerRadii.map((o) => `${o}px`).join(" ") : "--", n = i.strokeWeight !== null && i.strokeColor !== null ? `${i.strokeWeight}px ${i.strokeColor}` : "--";
      return `| ${i.name} | ${s} | ${n} | ${i.usageCount} |`;
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
      const s = `${i.offsetX}px ${i.offsetY}px ${i.blur}px ${i.spread}px ${i.color}`;
      return `| ${i.name} | ${i.type} | ${s} | ${i.usageCount} |`;
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
      const s = Le(i.componentName), n = i.variantProperties && Object.keys(i.variantProperties).length > 0 ? Object.entries(i.variantProperties).map(([o, r]) => /^Property\s+\d+$/i.test(o) ? String(r) : `${o}: ${r}`).join(", ") : "--";
      return `| ${s} | ${i.source} | ${n} | ${i.usageCount} |`;
    })
  ].join(`
`);
}
function qt(e, t, i, s) {
  if (!e && t.length === 0) return "";
  const n = [];
  if (e) {
    const o = me(e, i), r = o.split("/").pop() ?? o;
    n.push(`| ${r} | Preview | Full-page preview screenshot | ${o} |`);
  }
  for (const o of t) {
    const r = me(o.path, i), c = Qt(o.assetType);
    let u = "--";
    o.nodeId && (u = s.get(o.nodeId) || o.parentInstanceId && s.get(o.parentInstanceId) || "--");
    const d = Yt(o.assetType, u);
    n.push(`| ${o.filename} | ${c} | ${d} | ${r} |`);
  }
  return [
    "## Assets",
    "",
    "| File | Type | Usage | Path |",
    "|------|------|-------|------|",
    ...n
  ].join(`
`);
}
function Jt() {
  return [
    "## Placeholders",
    "",
    "Compare the preview image against the Assets table above. For any element that is clearly visible as a photograph, logo, icon, or illustration in the preview but has no matching file in the Assets table, create a placeholder box. Only flag elements you are confident are images or icons -- when uncertain, skip it.",
    "",
    "### Placeholder box styling",
    "",
    "For each missing asset, create a visible placeholder box:",
    "",
    "- **Border:** 2px dashed in a muted color that fits the site's design context (choose a color that is visible but does not clash with the surrounding design)",
    "- **Background:** Light semi-transparent tint matching the border color",
    "- **Label:** Centered text showing the reference name and original dimensions from the design, e.g. `[hero-bg] 1200x600`",
    "- **Size:** Match the element's intended dimensions from the layout",
    "",
    "### Reference naming",
    "",
    "- Use descriptive names derived from element context: e.g. `[hero-bg]`, `[team-photo]`, `[social-linkedin-icon]`",
    "- Use square brackets for scannability: `[hero-bg]`",
    "- Auto-number duplicate element types: `[team-photo-1]`, `[team-photo-2]`",
    "",
    "### Placeholder summary table",
    "",
    "After building, list all created placeholders in a table:",
    "",
    "| Reference | Description | Expected Size |",
    "|-----------|-------------|---------------|",
    "| [hero-bg] | Hero section background image | 1200x600 |",
    "",
    "### Replacing placeholders",
    "",
    "To replace a placeholder with a real asset, tell Claude Code:",
    "",
    '- "Replace [hero-bg] with hero.jpg"',
    '- "Replace [social-linkedin-icon] with this SVG file"'
  ].join(`
`);
}
function Yt(e, t) {
  const i = t !== "--" && t !== "";
  switch (e) {
    case "icon":
      return i ? `Icon in ${t}` : "Icon";
    case "image":
      return i ? `Image in ${t}` : "Image";
    default:
      return i ? `Asset in ${t}` : "Asset";
  }
}
function Qt(e) {
  switch (e) {
    case "icon":
      return "Icon";
    case "image":
      return "Image";
    default:
      return "File";
  }
}
function me(e, t) {
  return e.startsWith(t + "/") ? e.slice(t.length + 1) : e;
}
function Me({ nodes: e, depth: t = 0, maxDepth: i = 2 }) {
  return t >= i ? null : /* @__PURE__ */ l("div", { style: { paddingLeft: t > 0 ? "12px" : "0", borderLeft: t > 0 ? "1px solid var(--border)" : "none" }, children: e.map((s, n) => {
    const o = s.componentRef ? `<${s.componentRef.componentName}${s.repeatCount ? ` x${s.repeatCount}` : ""}>` : s.type === "TEXT" ? `"${(s.textContent ?? "").slice(0, 30)}${(s.textContent ?? "").length > 30 ? "..." : ""}"` : s.name, r = s.autoLayout ? `${s.autoLayout.flexDirection}` : s.type === "INSTANCE" ? "component" : s.type.toLowerCase();
    return /* @__PURE__ */ f("div", { style: { fontSize: "11px", lineHeight: 1.7 }, children: [
      /* @__PURE__ */ f("span", { style: { color: "var(--text-muted)" }, children: [
        r,
        " "
      ] }),
      /* @__PURE__ */ l("span", { style: { color: s.visible === !1 ? "var(--text-muted)" : "var(--text-primary)" }, children: o }),
      s.visible === !1 && /* @__PURE__ */ l("span", { style: { color: "var(--text-muted)", marginLeft: "4px" }, children: "(hidden)" }),
      s.children && s.children.length > 0 && t + 1 < i && /* @__PURE__ */ l(Me, { nodes: s.children, depth: t + 1, maxDepth: i }),
      s.children && s.children.length > 0 && t + 1 >= i && /* @__PURE__ */ f("span", { style: { color: "var(--text-muted)", fontSize: "11px", marginLeft: "12px" }, children: [
        "(",
        s.children.length,
        " children)"
      ] })
    ] }, s.id || n);
  }) });
}
function en({
  briefResult: e,
  extractionResult: t,
  extractionStats: i,
  exportResult: s,
  onCopyBrief: n,
  onNewBrief: o
}) {
  const [r, c] = $(!1), u = Math.round(e.stats.estimatedTokens / 1e3), d = e.stats.estimatedTokens > Et;
  return /* @__PURE__ */ f("div", { children: [
    /* @__PURE__ */ f("div", { className: "figma-plugin-results-success", children: [
      /* @__PURE__ */ l("span", { className: "figma-plugin-results-success-icon", children: "✓" }),
      /* @__PURE__ */ l("span", { style: { fontWeight: 600, fontSize: "13px" }, children: "Brief ready" }),
      t.truncated && /* @__PURE__ */ l("span", { style: { color: "#f59e0b", fontSize: "11px" }, children: "(truncated)" })
    ] }),
    /* @__PURE__ */ l(
      "button",
      {
        className: "btn-primary",
        onClick: n,
        style: { width: "100%", marginBottom: "12px" },
        children: "Copy Brief to Clipboard"
      }
    ),
    /* @__PURE__ */ l("p", { className: "figma-plugin-results-guidance", children: "Paste into Claude Code (or your AI coding agent) to start building." }),
    /* @__PURE__ */ l("p", { className: "figma-plugin-results-refinement", children: "The build may not be perfect on the first try -- refine iteratively by giving your agent feedback on what to adjust." }),
    /* @__PURE__ */ f("div", { className: "figma-plugin-results-stats", children: [
      e.stats.nodeCount,
      " layers ·",
      " ",
      e.stats.assetCount,
      " assets ·",
      " ",
      /* @__PURE__ */ f("span", { style: { color: d ? "#f59e0b" : "inherit" }, children: [
        "~",
        u,
        "K tokens"
      ] })
    ] }),
    e.stats.assetCount === 0 && /* @__PURE__ */ l("div", { style: { color: "var(--text-muted)", fontSize: "11px", marginBottom: "8px" }, children: "No assets exported -- Claude Code will create placeholders for visual elements" }),
    d && /* @__PURE__ */ f("div", { className: "figma-plugin-warning", style: { marginBottom: "8px" }, children: [
      /* @__PURE__ */ l("strong", { children: "This brief is large" }),
      /* @__PURE__ */ l("p", { children: "Consider extracting a smaller section for better results." })
    ] }),
    /* @__PURE__ */ l(
      "button",
      {
        className: "figma-plugin-results-details-toggle",
        onClick: () => c(!r),
        children: r ? "Hide details" : "View details"
      }
    ),
    r && /* @__PURE__ */ f("div", { className: "figma-plugin-results-details", children: [
      /* @__PURE__ */ f("h4", { children: [
        "Assets (",
        s.assets.length,
        ")"
      ] }),
      s.assets.length > 0 ? /* @__PURE__ */ l("ul", { className: "figma-plugin-results-asset-list", children: s.assets.map((x, y) => /* @__PURE__ */ f("li", { children: [
        x.filename,
        x.assetType && /* @__PURE__ */ f("span", { style: { color: "var(--text-muted)", marginLeft: "4px" }, children: [
          "(",
          x.assetType,
          ")"
        ] })
      ] }, y)) }) : /* @__PURE__ */ l("div", { style: { fontSize: "11px", color: "var(--text-muted)", marginBottom: "8px" }, children: "No assets exported" }),
      /* @__PURE__ */ l("h4", { children: "Layout tree" }),
      /* @__PURE__ */ l("div", { style: { maxHeight: "200px", overflowY: "auto" }, children: /* @__PURE__ */ l(Me, { nodes: t.rootNodes, maxDepth: 3 }) }),
      /* @__PURE__ */ l("h4", { children: "Design tokens" }),
      /* @__PURE__ */ f("div", { style: { fontSize: "11px", color: "var(--text-secondary)" }, children: [
        e.stats.colorCount,
        " colors, ",
        e.stats.fontCount,
        " fonts",
        i.components.length > 0 && /* @__PURE__ */ f("span", { children: [
          " · ",
          i.components.length,
          " component types"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ l("div", { className: "figma-plugin-results-footer", children: "Also saved to .shipstudio/assets/brief.md" }),
    /* @__PURE__ */ l(
      "button",
      {
        className: "btn-secondary",
        onClick: o,
        style: { width: "100%", marginTop: "8px" },
        children: "Get New Brief"
      }
    )
  ] });
}
async function tn(e, t, i) {
  const s = `${t}/brief.md`, n = btoa(unescape(encodeURIComponent(i))), o = await e.exec("bash", [
    "-c",
    `echo '${n}' | base64 -d > '${s}'`
  ]);
  if (o.exit_code !== 0)
    throw new Error(`Failed to save brief: ${o.stderr}`);
}
async function nn(e, t) {
  const i = btoa(unescape(encodeURIComponent(t))), s = await e.exec("bash", [
    "-c",
    `echo '${i}' | base64 -d | pbcopy`
  ]);
  if (s.exit_code !== 0)
    throw new Error(`Clipboard copy failed: ${s.stderr}`);
}
const sn = [
  {
    id: "best",
    name: "Copy (Best results)",
    description: "Faithfully reproduce the design with clean, responsive code"
  },
  {
    id: "pixel",
    name: "Copy (Pixel for pixel)",
    description: "Match the design exactly — fixed sizes, no responsive abstractions"
  },
  {
    id: "inspiration",
    name: "Use as inspiration",
    description: "Adapt the design patterns and style to fit your existing site"
  }
];
function on(e) {
  const t = { frames: 0, components: [], textNodes: 0, hiddenNodes: 0 }, i = /* @__PURE__ */ new Map();
  function s(n) {
    if (n.visible || t.hiddenNodes++, (n.type === "FRAME" || n.type === "GROUP" || n.type === "SECTION") && t.frames++, n.type === "TEXT" && t.textNodes++, n.componentRef) {
      const o = n.componentRef.componentName, r = n.repeatCount ?? 1;
      i.set(o, (i.get(o) ?? 0) + r);
    }
    n.children && n.children.forEach(s);
  }
  return e.forEach(s), t.components = Array.from(i.entries()).map(([n, o]) => ({ name: n, count: o })).sort((n, o) => o.count - n.count), t;
}
function rn({ token: e }) {
  const t = oe(), i = (t == null ? void 0 : t.shell) ?? null, s = (t == null ? void 0 : t.actions) ?? null, [n, o] = $(""), [r, c] = $(null), u = r != null && r.nodeId ? "node" : "page", [d, x] = $(null), [y, v] = $(!1), [C, b] = $(null), [E, B] = $(!1), [U, M] = $(null), [w, k] = $(null), [a, m] = $(!1), [L, z] = $(!1), [h, g] = $(null), [A, N] = $(null), [P, H] = $(!1), [O, _] = $(null), [J, G] = $(null), [xe, V] = $(!1), [Fe, re] = $(0), [K, ve] = $("best"), [ae, Be] = $(""), be = Ge(
    () => U ? on(U.rootNodes) : null,
    [U]
  ), D = Q(null), X = Q(null), W = Q(i);
  W.current = i;
  const le = Q(0), te = Q(0), ne = R(async (p, T) => {
    var I, we;
    if (!W.current || !r) return;
    z(!0), g(null), N(null);
    const S = T ? At(T.assets) : [];
    try {
      const j = await bt({
        shell: W.current,
        token: e,
        fileKey: p.fileKey,
        selectedNodeId: r.nodeId || ((I = p.extraction.rootNodes[0]) == null ? void 0 : I.id) || "0:0",
        projectPath: ((we = t == null ? void 0 : t.project) == null ? void 0 : we.path) ?? ".",
        manualAssets: S,
        onProgress: g
      });
      if (T != null && T.warnings.length && j.warnings.push(...T.warnings), N(j), s) {
        const Y = j.assets.length, F = j.warnings.length, ue = `Exported ${Y} asset${Y !== 1 ? "s" : ""}${F > 0 ? ` (${F} warning${F !== 1 ? "s" : ""})` : ""}`;
        s.showToast(ue, F > 0 ? "info" : "success");
      }
      H(!0), _(null), G(null), setTimeout(() => {
        var Y;
        try {
          const F = Lt({
            extraction: p,
            exportResult: j,
            projectPath: ((Y = t == null ? void 0 : t.project) == null ? void 0 : Y.path) ?? ".",
            fileName: (d == null ? void 0 : d.name) ?? "Untitled",
            figmaUrl: n,
            rootNodes: p.extraction.rootNodes,
            mode: K,
            inspirationText: K === "inspiration" ? ae : void 0
          });
          _(F), H(!1), W.current && tn(W.current, j.assetsDir, F.markdown).catch((ue) => {
            console.error("Brief save failed:", ue);
          }), s && s.showToast(
            `Brief ready: ${F.stats.nodeCount} layers, ${F.stats.assetCount} assets, ~${Math.round(F.stats.estimatedTokens / 1e3)}K tokens`,
            "success"
          );
        } catch (F) {
          G((F == null ? void 0 : F.message) || "Brief generation failed"), H(!1);
        }
      }, 0);
    } catch (j) {
      s && s.showToast(`Asset export failed: ${(j == null ? void 0 : j.message) || "Unknown error"}`, "error");
    } finally {
      z(!1), g(null);
    }
  }, [e, r, t, s, d, n, K, ae]), ie = R(async (p) => {
    const T = p.rawRootNodes.length === 1 ? p.rawRootNodes[0] : { name: "__root__", children: p.rawRootNodes, visible: !0 }, S = Tt(T);
    if (X.current = S, S.assets.length === 0) {
      D.current = p, V(!0), B(!1);
      return;
    }
    M(p.extraction), s && s.showToast(`Extracted ${p.extraction.nodeCount} layers`, "success"), ne(p, S);
  }, [s, ne]), Ue = R(
    (p) => {
      const T = p.target.value;
      if (o(T), !T.trim()) {
        c(null), x(null), b(null), v(!1), M(null), k(null), m(!1), D.current = null, N(null), z(!1), g(null), _(null), H(!1), G(null), V(!1), re(0), X.current = null;
        return;
      }
      const S = et(T);
      if (!S) {
        c(null), x(null), b("Please paste a valid Figma URL (file, design, proto, or board link)"), v(!1);
        return;
      }
      c(S), b(null), x(null), M(null), k(null), m(!1), D.current = null, N(null), z(!1), g(null), _(null), H(!1), G(null), V(!1), re(0), X.current = null;
    },
    []
  );
  se(() => {
    if (!r || !W.current) return;
    const p = ++le.current, T = W.current;
    v(!0), x(null), b(null), (async () => {
      try {
        const S = await Ze(T, e, r.fileKey);
        le.current === p && (x(S), v(!1));
      } catch (S) {
        if (le.current === p) {
          const I = (S == null ? void 0 : S.message) || "Failed to validate file access.";
          I.includes("403") || I.includes("Invalid or expired") ? b("Cannot access this file. Check that your token has File content (Read) scope.") : I.includes("404") || I.includes("not found") ? b("File not found. Check that the URL is correct.") : I.includes("429") || I.includes("Rate limited") ? b("Rate limited by Figma. Please wait a moment and try again.") : b(I), v(!1);
        }
      }
    })();
  }, [r, e]);
  const ce = R(() => {
    const p = W.current;
    if (!p || !r) return;
    const T = ++te.current;
    B(!0), M(null), b(null), k(null), m(!1), D.current = null, N(null), z(!1), g(null), _(null), H(!1), G(null), V(!1), X.current = null, (async () => {
      try {
        const S = await yt({
          shell: p,
          token: e,
          fileKey: r.fileKey,
          nodeId: r.nodeId,
          scope: u
        });
        if (te.current !== T) return;
        if (S.largeTreeWarning) {
          D.current = S, k(S.largeTreeWarning), m(!0), B(!1);
          return;
        }
        ie(S);
      } catch (S) {
        if (te.current !== T) return;
        const I = (S == null ? void 0 : S.message) || "Extraction failed.";
        I.includes("403") || I.includes("Invalid or expired") ? b("Cannot access this file. Check that your token has File content (Read) scope.") : I.includes("404") || I.includes("not found") ? b("File not found. Check that the URL is correct.") : I.includes("429") || I.includes("Rate limited") ? b("Rate limited by Figma. Please wait a moment and try again.") : I.includes("timeout") || I.includes("timed out") ? b("Request timed out. Try a smaller selection or check your connection.") : b(I);
      } finally {
        te.current === T && B(!1);
      }
    })();
  }, [r, e, u, s, ie]), ze = R(() => {
    const p = D.current;
    p && (m(!1), k(null), ie(p));
  }, [ie]), He = R(() => {
    m(!1), k(null), D.current = null;
  }, []), Oe = R(() => {
    V(!1), re((p) => p + 1), D.current = null, X.current = null, ce();
  }, [ce]), _e = R(() => {
    const p = D.current;
    p && (V(!1), D.current = null, M(p.extraction), s && s.showToast(`Extracted ${p.extraction.nodeCount} layers`, "success"), ne(p, X.current ?? void 0));
  }, [s, ne]), De = R(async () => {
    if (!(!O || !W.current))
      try {
        await nn(W.current, O.markdown), s && s.showToast("Brief copied to clipboard", "success");
      } catch (p) {
        s && s.showToast(`Copy failed: ${(p == null ? void 0 : p.message) || "Unknown error"}`, "error");
      }
  }, [O, s]), We = R(() => {
    _(null), M(null), N(null);
  }, []), je = !r || !d || y || E || L || P || xe;
  return O && U && be && A ? /* @__PURE__ */ l(
    en,
    {
      briefResult: O,
      extractionResult: U,
      extractionStats: be,
      exportResult: A,
      onCopyBrief: De,
      onNewBrief: We
    }
  ) : /* @__PURE__ */ f("div", { children: [
    /* @__PURE__ */ f("div", { className: "figma-plugin-section", style: { color: "var(--text-secondary)", fontSize: "12px", lineHeight: 1.5 }, children: [
      "Prefix layer names with ",
      /* @__PURE__ */ l("code", { style: { background: "var(--bg-tertiary)", padding: "1px 4px", borderRadius: "3px" }, children: "@S-" }),
      " to export them as assets.",
      " ",
      "Example: ",
      /* @__PURE__ */ l("code", { style: { background: "var(--bg-tertiary)", padding: "1px 4px", borderRadius: "3px" }, children: "@S-hero-image" })
    ] }),
    /* @__PURE__ */ f("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ l("label", { className: "figma-plugin-label", children: "Figma URL" }),
      /* @__PURE__ */ l(
        "input",
        {
          className: "figma-plugin-input",
          type: "text",
          placeholder: "https://www.figma.com/design/...",
          value: n,
          onChange: Ue
        }
      ),
      C && /* @__PURE__ */ l("div", { className: "figma-plugin-error", children: C })
    ] }),
    r && /* @__PURE__ */ l("div", { className: "figma-plugin-section", children: /* @__PURE__ */ f("div", { className: "figma-plugin-file-info", children: [
      y && /* @__PURE__ */ f("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: d ? "8px" : "0" }, children: [
        /* @__PURE__ */ l("span", { className: "figma-plugin-spinner" }),
        /* @__PURE__ */ l("span", { style: { color: "var(--text-secondary)" }, children: "Checking access..." })
      ] }),
      d && /* @__PURE__ */ f("div", { style: { marginBottom: "8px" }, children: [
        /* @__PURE__ */ l("div", { style: { fontWeight: 600, fontSize: "13px", marginBottom: "4px" }, children: d.name }),
        /* @__PURE__ */ f("div", { style: { color: "var(--text-secondary)" }, children: [
          d.pages.length,
          " page",
          d.pages.length !== 1 ? "s" : ""
        ] })
      ] }),
      !y && /* @__PURE__ */ f("div", { style: { color: "var(--text-muted)", lineHeight: 1.6 }, children: [
        /* @__PURE__ */ f("div", { children: [
          "File key: ",
          r.fileKey
        ] }),
        /* @__PURE__ */ f("div", { children: [
          "Node: ",
          r.nodeId || "None (file-level)"
        ] }),
        /* @__PURE__ */ f("div", { children: [
          "Type: ",
          r.fileType
        ] })
      ] })
    ] }) }),
    r && d && !y && /* @__PURE__ */ l("div", { className: "figma-plugin-section", children: /* @__PURE__ */ l("div", { style: { color: "var(--text-secondary)", fontSize: "12px" }, children: r.nodeId ? "Will extract the selected element" : "Will extract the whole page — select a specific element in Figma to narrow scope" }) }),
    r && d && !y && !O && /* @__PURE__ */ f("div", { className: "figma-plugin-mode-section", children: [
      /* @__PURE__ */ l("span", { className: "figma-plugin-mode-label", children: "Brief mode" }),
      /* @__PURE__ */ l("div", { className: "figma-plugin-mode-group", children: sn.map((p) => /* @__PURE__ */ f(
        "div",
        {
          className: `figma-plugin-mode-card${K === p.id ? " selected" : ""}`,
          onClick: () => ve(p.id),
          role: "radio",
          "aria-checked": K === p.id,
          tabIndex: 0,
          onKeyDown: (T) => {
            (T.key === "Enter" || T.key === " ") && (T.preventDefault(), ve(p.id));
          },
          children: [
            /* @__PURE__ */ l("div", { className: "figma-plugin-mode-card-name", children: p.name }),
            /* @__PURE__ */ l("div", { className: "figma-plugin-mode-card-desc", children: p.description })
          ]
        },
        p.id
      )) }),
      K === "inspiration" && /* @__PURE__ */ l(
        "textarea",
        {
          className: "figma-plugin-input figma-plugin-inspiration-textarea",
          placeholder: "Describe what to take from this design (e.g., 'Use the color palette and card layout pattern, but adapt spacing and typography to match our existing design system')",
          value: ae,
          onChange: (p) => Be(p.target.value),
          rows: 3
        }
      )
    ] }),
    a && w && /* @__PURE__ */ l("div", { className: "figma-plugin-section", children: /* @__PURE__ */ f("div", { className: "figma-plugin-warning", children: [
      /* @__PURE__ */ f("strong", { children: [
        w.nodeCount,
        " layers detected"
      ] }),
      /* @__PURE__ */ l("p", { children: "Large selections may take longer and produce verbose output. Continue?" }),
      /* @__PURE__ */ f("div", { className: "figma-plugin-warning-actions", children: [
        /* @__PURE__ */ l("button", { className: "btn-primary", onClick: ze, children: "Continue" }),
        /* @__PURE__ */ l("button", { className: "btn-secondary", onClick: He, children: "Cancel" })
      ] })
    ] }) }),
    xe && /* @__PURE__ */ l("div", { className: "figma-plugin-section", children: /* @__PURE__ */ f("div", { className: "figma-plugin-warning", children: [
      /* @__PURE__ */ l("strong", { children: "No @S- asset layers found" }),
      /* @__PURE__ */ f("p", { children: [
        "Prefix layer names with ",
        /* @__PURE__ */ l("code", { children: "@S-" }),
        " to mark them for export.",
        " ",
        "Example: ",
        /* @__PURE__ */ l("code", { children: "@S-hero-image" }),
        " becomes ",
        /* @__PURE__ */ l("code", { children: "hero-image.png" }),
        ".",
        " ",
        "PNG or SVG format is auto-detected from layer content."
      ] }),
      Fe > 0 && /* @__PURE__ */ l("p", { style: { fontStyle: "italic", marginTop: "4px" }, children: "Still no @S- layers found. Check your layer names in Figma." }),
      /* @__PURE__ */ f("div", { className: "figma-plugin-warning-actions", children: [
        /* @__PURE__ */ l("button", { className: "btn-primary", onClick: Oe, children: "Try again" }),
        /* @__PURE__ */ l("button", { className: "btn-secondary", onClick: _e, children: "Continue anyway" })
      ] })
    ] }) }),
    J && /* @__PURE__ */ l("div", { className: "figma-plugin-section", children: /* @__PURE__ */ l("div", { className: "figma-plugin-error", children: J }) }),
    (() => {
      const p = E || L || P, T = E ? "Extracting layout..." : L ? (h == null ? void 0 : h.phase) === "preview" ? "Rendering preview..." : `Exporting assets${h != null && h.total ? ` (${h.current ?? 0}/${h.total})` : ""}...` : P ? "Generating brief..." : "Get Brief";
      return /* @__PURE__ */ f(
        "button",
        {
          className: "btn-primary",
          onClick: ce,
          disabled: je,
          style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
          children: [
            p && /* @__PURE__ */ l("span", { className: "figma-plugin-spinner", style: { width: "14px", height: "14px", borderWidth: "2px" } }),
            T
          ]
        }
      );
    })()
  ] });
}
function an({ onClick: e }) {
  return /* @__PURE__ */ l(
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
      children: /* @__PURE__ */ f(
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
function ln() {
  const e = oe(), t = (e == null ? void 0 : e.storage) ?? null, i = (e == null ? void 0 : e.actions) ?? null, [s, n] = $(!1), [o, r] = $(null), [c, u] = $(null), [d, x] = $(!1), [y, v] = $("main");
  se(() => {
    if (!t) return;
    let a = !1;
    return (async () => {
      try {
        const m = await t.read();
        !a && typeof m.figmaToken == "string" && (r(m.figmaToken), typeof m.figmaUserHandle == "string" && u({ id: "", handle: m.figmaUserHandle, img_url: "" }));
      } catch (m) {
        console.error("[figma] Failed to read storage:", m);
      } finally {
        a || x(!0);
      }
    })(), () => {
      a = !0;
    };
  }, [t]);
  const C = R(() => n(!0), []), b = R(() => {
    n(!1), v("main");
  }, []), E = R(async (a, m) => {
    if (!(!t || !i))
      try {
        const L = await t.read();
        await t.write({ ...L, figmaToken: a, figmaUserHandle: m.handle }), r(a), u(m), v("main"), i.showToast(`Connected as ${m.handle}`, "success");
      } catch {
        i.showToast("Failed to save token. Please try again.", "error");
      }
  }, [t, i]), B = R(async (a, m) => {
    if (!(!t || !i))
      try {
        const L = await t.read();
        await t.write({ ...L, figmaToken: a, figmaUserHandle: m.handle }), r(a), u(m), v("main"), i.showToast(`Token updated — connected as ${m.handle}`, "success");
      } catch {
        i.showToast("Failed to save token. Please try again.", "error");
      }
  }, [t, i]), U = R(async () => {
    if (!(!t || !i))
      try {
        const a = await t.read(), { figmaToken: m, figmaUserHandle: L, ...z } = a;
        await t.write(z), r(null), u(null), v("main"), i.showToast("Disconnected from Figma", "info");
      } catch {
        i.showToast("Failed to remove token. Please try again.", "error");
      }
  }, [t, i]), M = "Figma", w = o ? /* @__PURE__ */ l(an, { onClick: () => v("settings") }) : void 0;
  let k = null;
  return d && (o ? y === "settings" && c ? k = /* @__PURE__ */ l(
    Qe,
    {
      currentUser: c,
      onTokenUpdated: B,
      onTokenRemoved: U,
      onBack: () => v("main")
    }
  ) : k = /* @__PURE__ */ l(rn, { token: o }) : k = /* @__PURE__ */ l(Ye, { onTokenSaved: E })), /* @__PURE__ */ f(he, { children: [
    /* @__PURE__ */ l(
      "button",
      {
        onClick: C,
        title: "Figma Design Brief",
        className: "toolbar-icon-btn",
        children: /* @__PURE__ */ l(
          "svg",
          {
            width: "14",
            height: "14",
            viewBox: "0 0 15 15",
            fill: "currentColor",
            children: /* @__PURE__ */ l(
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
    /* @__PURE__ */ l(
      Ke,
      {
        open: s,
        onClose: b,
        title: M,
        headerRight: w,
        children: k
      }
    )
  ] });
}
const dn = "Figma", fn = {
  toolbar: ln
};
function pn() {
  console.log("[figma] Plugin activated");
}
function gn() {
  console.log("[figma] Plugin deactivated");
}
export {
  dn as name,
  pn as onActivate,
  gn as onDeactivate,
  fn as slots
};
