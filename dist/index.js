import { jsx as a, jsxs as f, Fragment as he } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;function j(t,p,k){if(k!==undefined&&p){p=Object.assign({},p);p.key=k}return R.createElement(t,p)}export const jsx=j;export const jsxs=j;export const Fragment=R.Fragment;";
import { useEffect as oe, useCallback as I, useState as C, useMemo as Xe, useRef as Q } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export default R;export const{useState,useEffect,useCallback,useRef,useMemo,useContext,createContext,createElement,Fragment}=R;";
const $e = window;
function se() {
  const e = $e.__SHIPSTUDIO_REACT__, t = $e.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__;
  return t && (e != null && e.useContext) ? e.useContext(t) : null;
}
const de = "figma-plugin-styles", Ze = `
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
function qe({ open: e, onClose: t, title: i, headerRight: o, children: n }) {
  oe(() => {
    if (!e) return;
    let r = document.getElementById(de);
    return r || (r = document.createElement("style"), r.id = de, r.textContent = Ze, document.head.appendChild(r)), () => {
      const c = document.getElementById(de);
      c && c.remove();
    };
  }, [e]), oe(() => {
    if (!e) return;
    const r = (c) => {
      c.key === "Escape" && t();
    };
    return document.addEventListener("keydown", r), () => document.removeEventListener("keydown", r);
  }, [e, t]);
  const s = I(
    (r) => {
      r.target === r.currentTarget && t();
    },
    [t]
  );
  return e ? /* @__PURE__ */ a("div", { className: "figma-plugin-overlay", onClick: s, children: /* @__PURE__ */ f("div", { className: "figma-plugin-modal", children: [
    /* @__PURE__ */ f("div", { className: "figma-plugin-modal-header", children: [
      /* @__PURE__ */ a(
        "svg",
        {
          width: "16",
          height: "16",
          viewBox: "0 0 15 15",
          fill: "currentColor",
          children: /* @__PURE__ */ a(
            "path",
            {
              fillRule: "evenodd",
              clipRule: "evenodd",
              d: "M7.00005 2.04999H5.52505C4.71043 2.04999 4.05005 2.71037 4.05005 3.52499C4.05005 4.33961 4.71043 4.99999 5.52505 4.99999H7.00005V2.04999ZM7.00005 1.04999H8.00005H9.47505C10.842 1.04999 11.95 2.15808 11.95 3.52499C11.95 4.33163 11.5642 5.04815 10.9669 5.49999C11.5642 5.95184 11.95 6.66836 11.95 7.475C11.95 8.8419 10.842 9.95 9.47505 9.95C8.92236 9.95 8.41198 9.76884 8.00005 9.46266V9.95L8.00005 11.425C8.00005 12.7919 6.89195 13.9 5.52505 13.9C4.15814 13.9 3.05005 12.7919 3.05005 11.425C3.05005 10.6183 3.43593 9.90184 4.03317 9.44999C3.43593 8.99814 3.05005 8.28163 3.05005 7.475C3.05005 6.66836 3.43594 5.95184 4.03319 5.5C3.43594 5.04815 3.05005 4.33163 3.05005 3.52499C3.05005 2.15808 4.15814 1.04999 5.52505 1.04999H7.00005ZM8.00005 2.04999V4.99999H9.47505C10.2897 4.99999 10.95 4.33961 10.95 3.52499C10.95 2.71037 10.2897 2.04999 9.47505 2.04999H8.00005ZM5.52505 8.94998H7.00005L7.00005 7.4788L7.00005 7.475L7.00005 7.4712V6H5.52505C4.71043 6 4.05005 6.66038 4.05005 7.475C4.05005 8.28767 4.70727 8.94684 5.5192 8.94999L5.52505 8.94998ZM4.05005 11.425C4.05005 10.6123 4.70727 9.95315 5.5192 9.94999L5.52505 9.95H7.00005L7.00005 11.425C7.00005 12.2396 6.33967 12.9 5.52505 12.9C4.71043 12.9 4.05005 12.2396 4.05005 11.425ZM8.00005 7.47206C8.00164 6.65879 8.66141 6 9.47505 6C10.2897 6 10.95 6.66038 10.95 7.475C10.95 8.28962 10.2897 8.95 9.47505 8.95C8.66141 8.95 8.00164 8.29121 8.00005 7.47794V7.47206Z"
            }
          )
        }
      ),
      /* @__PURE__ */ a("span", { className: "figma-plugin-modal-title", children: i }),
      o && /* @__PURE__ */ a("div", { style: { marginLeft: "auto", display: "flex", alignItems: "center" }, children: o })
    ] }),
    /* @__PURE__ */ a("div", { className: "figma-plugin-modal-body", children: n })
  ] }) }) : null;
}
const Je = "https://api.figma.com/v1";
async function ee(e, t, i, o) {
  const n = `${Je}${t}`, s = Math.ceil(((o == null ? void 0 : o.timeout) ?? 3e4) / 1e3), r = [
    "-sS",
    "--max-time",
    String(s),
    "-H",
    `X-Figma-Token: ${i}`,
    n
  ], c = await e.exec("curl", r, {
    timeout: (o == null ? void 0 : o.timeout) ?? 12e4
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
async function Se(e, t) {
  return ee(e, "/me", t);
}
async function Ye(e, t, i) {
  const o = await ee(e, `/files/${i}?depth=1`, t);
  return {
    name: o.name,
    pages: o.document.children.filter((n) => n.type === "CANVAS").map((n) => ({ id: n.id, name: n.name }))
  };
}
async function Qe(e, t, i, o) {
  const n = await ee(
    e,
    `/files/${i}/nodes?ids=${encodeURIComponent(o)}`,
    t,
    { timeout: 12e4 }
  ), s = n.nodes[o];
  if (!s) {
    const r = Object.keys(n.nodes), c = r.find(
      (u) => u.replace(/%3A/g, ":") === o || u === o.replace(/:/g, "%3A")
    );
    if (c)
      return {
        rootNode: n.nodes[c].document,
        components: n.nodes[c].components,
        styles: n.nodes[c].styles ?? {}
      };
    throw new Error(
      `Node "${o}" not found in API response. Available nodes: ${r.join(", ")}`
    );
  }
  return {
    rootNode: s.document,
    components: s.components,
    styles: s.styles ?? {}
  };
}
async function et(e, t, i) {
  const o = await ee(
    e,
    `/files/${i}`,
    t,
    { timeout: 12e4 }
  );
  return {
    rootNodes: o.document.children,
    components: o.components,
    styles: o.styles ?? {}
  };
}
async function fe(e, t, i, o, n = "png", s) {
  const r = o.map((d) => encodeURIComponent(d)).join(",");
  let c = `/images/${i}?ids=${r}&format=${n}`;
  return s != null && (c += `&scale=${s}`), n === "svg" && (c += "&svg_outline_text=true&svg_include_id=true&svg_simplify_stroke=true"), (await ee(
    e,
    c,
    t,
    { timeout: 12e4 }
  )).images;
}
function tt({ onTokenSaved: e }) {
  const t = se(), i = (t == null ? void 0 : t.shell) ?? null, [o, n] = C(""), [s, r] = C(!1), [c, u] = C(null), d = I(async () => {
    if (!i) return;
    const y = o.trim();
    if (!(!y || s)) {
      r(!0), u(null);
      try {
        const b = await Se(i, y);
        e(y, b);
      } catch (b) {
        u((b == null ? void 0 : b.message) || "Failed to validate token. Please check and try again.");
      } finally {
        r(!1);
      }
    }
  }, [o, s, i, e]), x = I(
    (y) => {
      y.key === "Enter" && d();
    },
    [d]
  );
  return /* @__PURE__ */ f("div", { children: [
    /* @__PURE__ */ f("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ a("h3", { style: { fontSize: "14px", fontWeight: 600, margin: "0 0 8px 0" }, children: "Connect to Figma" }),
      /* @__PURE__ */ f("p", { style: { fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 16px 0", lineHeight: 1.5 }, children: [
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
    /* @__PURE__ */ f("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ a("label", { className: "figma-plugin-label", children: "Personal Access Token" }),
      /* @__PURE__ */ a(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: o,
          onChange: (y) => n(y.target.value),
          onKeyDown: x,
          disabled: s
        }
      ),
      c && /* @__PURE__ */ a("div", { className: "figma-plugin-error", children: c }),
      /* @__PURE__ */ a("div", { className: "figma-plugin-hint", children: "Token is stored locally in this project only." })
    ] }),
    /* @__PURE__ */ a(
      "button",
      {
        className: "btn-primary",
        onClick: d,
        disabled: !o.trim() || s,
        style: { width: "100%", marginTop: "4px" },
        children: s ? /* @__PURE__ */ f(he, { children: [
          /* @__PURE__ */ a("span", { className: "figma-plugin-spinner", style: { marginRight: "8px", verticalAlign: "middle" } }),
          "Connecting..."
        ] }) : "Connect"
      }
    )
  ] });
}
function nt({ currentUser: e, onTokenUpdated: t, onTokenRemoved: i, onBack: o }) {
  const n = se(), s = (n == null ? void 0 : n.shell) ?? null, [r, c] = C(""), [u, d] = C(!1), [x, y] = C(null), b = I(async () => {
    if (!s) return;
    const v = r.trim();
    if (!(!v || u)) {
      d(!0), y(null);
      try {
        const E = await Se(s, v);
        t(v, E);
      } catch (E) {
        y((E == null ? void 0 : E.message) || "Failed to validate token. Please check and try again.");
      } finally {
        d(!1);
      }
    }
  }, [r, u, s, t]), $ = I(
    (v) => {
      v.key === "Enter" && b();
    },
    [b]
  );
  return /* @__PURE__ */ f("div", { children: [
    /* @__PURE__ */ f(
      "button",
      {
        onClick: o,
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
    /* @__PURE__ */ a("div", { className: "figma-plugin-section", children: /* @__PURE__ */ f("div", { className: "figma-plugin-success", style: { display: "flex", alignItems: "center", gap: "6px", marginTop: "0" }, children: [
      /* @__PURE__ */ a("span", { style: { fontSize: "10px" }, children: "●" }),
      "Connected as ",
      e.handle
    ] }) }),
    /* @__PURE__ */ f("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ a("label", { className: "figma-plugin-label", children: "Update Token" }),
      /* @__PURE__ */ a(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: r,
          onChange: (v) => c(v.target.value),
          onKeyDown: $,
          disabled: u
        }
      ),
      x && /* @__PURE__ */ a("div", { className: "figma-plugin-error", children: x }),
      /* @__PURE__ */ a(
        "button",
        {
          className: "btn-primary",
          onClick: b,
          disabled: !r.trim() || u,
          style: { width: "100%", marginTop: "8px" },
          children: u ? /* @__PURE__ */ f(he, { children: [
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
        onClick: i,
        style: { width: "100%" },
        children: "Disconnect"
      }
    ) })
  ] });
}
function it(e) {
  const t = e.match(
    /figma\.com\/(file|design|proto|board)\/([A-Za-z0-9]+)/
  );
  if (!t) return null;
  const i = t[1], o = t[2];
  let n = null;
  const s = e.match(/[?&]node-id=([^&]+)/);
  return s && (n = decodeURIComponent(s[1]).replace(/-/g, ":")), { fileKey: o, nodeId: n, fileType: i };
}
function ot(e) {
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
function st(e) {
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
function rt(e) {
  const t = {
    flexDirection: e.layoutMode === "HORIZONTAL" ? "row" : "column",
    justifyContent: ot(e.primaryAxisAlignItems),
    alignItems: st(e.counterAxisAlignItems),
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
function at(e, t) {
  const i = t[e.componentId];
  let o;
  if (e.componentProperties) {
    const s = {};
    for (const [r, c] of Object.entries(e.componentProperties))
      (c.type === "VARIANT" || c.type === "BOOLEAN" || c.type === "TEXT") && (s[r] = c.value);
    Object.keys(s).length > 0 && (o = s);
  }
  const n = {
    componentId: e.componentId,
    componentName: (i == null ? void 0 : i.name) ?? e.name,
    isRemote: (i == null ? void 0 : i.remote) ?? !1,
    source: i != null && i.remote ? "library" : "local"
  };
  return i != null && i.description && (n.description = i.description), o && (n.variantProperties = o), e.overrides && (n.overrides = e.overrides), n;
}
function Ae(e, t, i, o) {
  const n = e;
  if (n.type === "SLICE") return null;
  const s = {
    id: n.id,
    name: n.name,
    type: n.type,
    visible: n.visible !== !1
    // defaults to true when undefined
  };
  switch (n.absoluteBoundingBox != null ? (s.width = n.absoluteBoundingBox.width, s.height = n.absoluteBoundingBox.height) : n.size != null && (s.width = n.size.x, s.height = n.size.y), "layoutSizingHorizontal" in n && (s.widthMode = n.layoutSizingHorizontal), "layoutSizingVertical" in n && (s.heightMode = n.layoutSizingVertical), "layoutPositioning" in n && n.layoutPositioning != null && (s.positioning = n.layoutPositioning), "layoutGrow" in n && n.layoutGrow === 1 && (s.layoutGrow = 1), "layoutAlign" in n && n.layoutAlign === "STRETCH" && (s.layoutAlign = "STRETCH"), s.positioning === "ABSOLUTE" && o != null && n.absoluteBoundingBox != null && (s.absoluteOffset = {
    top: Math.round(n.absoluteBoundingBox.y - o.y),
    left: Math.round(n.absoluteBoundingBox.x - o.x)
  }), "layoutMode" in n && n.layoutMode && n.layoutMode !== "NONE" && (s.autoLayout = rt(n)), "constraints" in n && n.constraints != null && (s.constraints = n.constraints), "minWidth" in n && n.minWidth != null && (s.minWidth = n.minWidth), "maxWidth" in n && n.maxWidth != null && (s.maxWidth = n.maxWidth), "minHeight" in n && n.minHeight != null && (s.minHeight = n.minHeight), "maxHeight" in n && n.maxHeight != null && (s.maxHeight = n.maxHeight), "preserveRatio" in n && n.preserveRatio != null && (s.preserveRatio = n.preserveRatio), "fills" in n && Array.isArray(n.fills) && (s.fills = n.fills), "strokes" in n && Array.isArray(n.strokes) && (s.strokes = n.strokes), "strokeWeight" in n && n.strokeWeight != null && (s.strokeWeight = n.strokeWeight), "effects" in n && Array.isArray(n.effects) && (s.effects = n.effects), "cornerRadius" in n && n.cornerRadius != null && (s.cornerRadius = n.cornerRadius), "rectangleCornerRadii" in n && Array.isArray(n.rectangleCornerRadii) && (s.rectangleCornerRadii = n.rectangleCornerRadii), "opacity" in n && n.opacity != null && n.opacity !== 1 && (s.opacity = n.opacity), "blendMode" in n && n.blendMode && n.blendMode !== "PASS_THROUGH" && n.blendMode !== "NORMAL" && (s.blendMode = n.blendMode), "isMask" in n && n.isMask === !0 && (s.isMask = !0), "styles" in n && n.styles && (s.styleRefs = n.styles), n.type) {
    case "TEXT":
      s.textContent = n.characters, n.style && (s.textStyle = n.style), n.styleOverrideTable && Object.keys(n.styleOverrideTable).length > 0 && (s.textStyleOverrides = n.styleOverrideTable);
      break;
    case "INSTANCE":
      return s.componentRef = at(n, t), s;
    case "BOOLEAN_OPERATION":
      return s;
  }
  if ("children" in n && Array.isArray(n.children)) {
    const r = n.absoluteBoundingBox != null ? { x: n.absoluteBoundingBox.x, y: n.absoluteBoundingBox.y } : null, c = n.children.map((u) => Ae(u, t, i + 1, r)).filter((u) => u !== null);
    s.children = ct(c);
  }
  return s;
}
function ye(e) {
  let t = 1;
  if (e.children && Array.isArray(e.children))
    for (const i of e.children)
      t += ye(i);
  return t;
}
function lt(e) {
  const t = e.componentRef, i = t.variantProperties ? JSON.stringify(t.variantProperties, Object.keys(t.variantProperties).sort()) : "";
  return `${t.componentId}::${i}`;
}
function ct(e) {
  if (e.length === 0) return [];
  const t = /* @__PURE__ */ new Map();
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    if (s.componentRef) {
      const r = lt(s), c = t.get(r);
      c ? (c.count++, c.indices.push(n)) : t.set(r, { node: s, count: 1, indices: [n] });
    }
  }
  const i = /* @__PURE__ */ new Set();
  for (const n of t.values())
    if (n.count >= 3) {
      n.node.repeatCount = n.count;
      for (let s = 1; s < n.indices.length; s++)
        i.add(n.indices[s]);
    }
  const o = [];
  for (let n = 0; n < e.length; n++)
    i.has(n) || o.push(e[n]);
  return o;
}
function ut(e, t) {
  let i = 0;
  for (const n of e)
    i += ye(n);
  return {
    rootNodes: e.map((n) => Ae(n, t, 0, null)).filter((n) => n !== null),
    nodeCount: i,
    truncated: !1
  };
}
function q(e) {
  const t = Math.round(e.r * 255), i = Math.round(e.g * 255), o = Math.round(e.b * 255);
  if (e.a >= 1)
    return `#${t.toString(16).padStart(2, "0")}${i.toString(16).padStart(2, "0")}${o.toString(16).padStart(2, "0")}`;
  const n = parseFloat(e.a.toFixed(2));
  return `rgba(${t}, ${i}, ${o}, ${n})`;
}
function dt(e) {
  const t = e.gradientStops.map((i) => `${q(i.color)} ${Math.round(i.position * 100)}%`).join(", ");
  switch (e.type) {
    case "GRADIENT_LINEAR": {
      const [i, o] = e.gradientHandlePositions, n = o.x - i.x, s = o.y - i.y, r = Math.atan2(s, n);
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
function ft(e, t) {
  const i = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), u = [], d = /* @__PURE__ */ new Map();
  let x = 0, y = 0, b = 0;
  function $(l) {
    var m, P, z;
    if (l.fills && Array.isArray(l.fills)) {
      const h = gt(l, t);
      for (const g of l.fills)
        if (g.visible !== !1)
          if (g.type === "SOLID") {
            const S = { ...g.color };
            g.opacity != null && g.opacity !== 1 && (S.a = S.a * g.opacity);
            const N = q(S);
            pe(i, N, l.id, "fill", h);
          } else if ((m = g.type) != null && m.startsWith("GRADIENT_")) {
            const S = dt(g), N = S, L = o.get(N);
            L ? (L.usageCount++, L.nodeIds.push(l.id)) : (b++, o.set(N, {
              value: S,
              name: h ?? `gradient-${b}`,
              gradientType: g.type,
              usageCount: 1,
              nodeIds: [l.id]
            }));
          } else g.type === "IMAGE" && u.push({
            imageRef: g.imageRef,
            scaleMode: g.scaleMode,
            nodeId: l.id,
            nodeName: l.name
          });
    }
    if (l.strokes && Array.isArray(l.strokes)) {
      const h = mt(l, t);
      for (const g of l.strokes)
        if (g.visible !== !1 && g.type === "SOLID") {
          const S = { ...g.color };
          g.opacity != null && g.opacity !== 1 && (S.a = S.a * g.opacity);
          const N = q(S);
          pe(i, N, l.id, "stroke", h);
        }
    }
    if (l.effects && Array.isArray(l.effects)) {
      const h = yt(l, t);
      for (const g of l.effects)
        if (g.visible === !0 && (g.type === "DROP_SHADOW" || g.type === "INNER_SHADOW")) {
          const S = g.type === "DROP_SHADOW" ? "drop-shadow" : "inner-shadow", N = q(g.color), L = ((P = g.offset) == null ? void 0 : P.x) ?? 0, H = ((z = g.offset) == null ? void 0 : z.y) ?? 0, O = g.radius ?? 0, W = g.spread ?? 0, J = `${S}|${N}|${L}|${H}|${O}|${W}`, G = c.get(J);
          G ? (G.usageCount++, G.nodeIds.push(l.id)) : (y++, c.set(J, {
            type: S,
            color: N,
            offsetX: L,
            offsetY: H,
            blur: O,
            spread: W,
            name: h ?? `shadow-${y}`,
            usageCount: 1,
            nodeIds: [l.id]
          })), pe(i, N, l.id, "shadow", null);
        }
    }
    if (l.type === "TEXT" && l.textStyle) {
      const h = ht(l, t);
      if (ke(n, l.textStyle, l.id, h), l.textStyleOverrides && typeof l.textStyleOverrides == "object")
        for (const g of Object.values(l.textStyleOverrides))
          ke(n, g, l.id, null);
    }
    if (l.autoLayout) {
      const h = l.autoLayout;
      h.padding && (Z(s, h.padding.top, "padding-top"), Z(s, h.padding.right, "padding-right"), Z(s, h.padding.bottom, "padding-bottom"), Z(s, h.padding.left, "padding-left")), Z(s, h.gap, "gap"), h.rowGap != null && Z(s, h.rowGap, "row-gap");
    }
    if (l.cornerRadius != null || l.rectangleCornerRadii != null || pt(l)) {
      const h = l.rectangleCornerRadii ? null : l.cornerRadius ?? null, g = l.rectangleCornerRadii ?? null;
      let S = null, N = null;
      if (l.strokes && Array.isArray(l.strokes)) {
        const O = l.strokes.find(
          (W) => W.visible !== !1 && W.type === "SOLID"
        );
        O && (S = q(O.color), N = l.strokeWeight ?? null);
      }
      const L = `${h}|${JSON.stringify(g)}|${S}|${N}`, H = r.get(L);
      H ? (H.usageCount++, H.nodeIds.push(l.id)) : (x++, r.set(L, {
        radius: h,
        cornerRadii: g,
        strokeColor: S,
        strokeWeight: N,
        name: `border-${x}`,
        usageCount: 1,
        nodeIds: [l.id]
      }));
    }
    if (l.componentRef) {
      const h = l.componentRef, g = `${h.componentName}::${JSON.stringify(h.variantProperties ?? {})}`, S = d.get(g), N = l.repeatCount ?? 1;
      if (S)
        S.usageCount += N;
      else {
        const L = {
          componentName: h.componentName,
          source: h.source,
          usageCount: N
        };
        h.description && (L.description = h.description), h.variantProperties && (L.variantProperties = h.variantProperties), d.set(g, L);
      }
    }
    if (l.children)
      for (const h of l.children)
        $(h);
  }
  for (const l of e)
    $(l);
  const v = Array.from(i.values()).map((l) => ({
    value: l.value,
    name: l.name,
    usageCount: l.usageCount,
    nodeIds: l.nodeIds,
    source: Array.from(l.source)
  }));
  v.sort((l, m) => m.usageCount - l.usageCount);
  const E = Array.from(o.values());
  E.sort((l, m) => m.usageCount - l.usageCount);
  const B = Array.from(n.values());
  B.sort((l, m) => m.usageCount - l.usageCount);
  const U = Array.from(s.values());
  U.sort((l, m) => l.value - m.value);
  const M = Array.from(r.values());
  M.sort((l, m) => m.usageCount - l.usageCount);
  const w = Array.from(c.values());
  w.sort((l, m) => m.usageCount - l.usageCount);
  const k = Array.from(d.values());
  return k.sort((l, m) => m.usageCount - l.usageCount), {
    colors: v,
    gradients: E,
    typography: B,
    spacing: U,
    borders: M,
    shadows: w,
    imageFills: u,
    components: k
  };
}
function pe(e, t, i, o, n) {
  const s = e.get(t);
  if (s)
    s.usageCount++, s.nodeIds.includes(i) || s.nodeIds.push(i), s.source.add(o), n && s.name.startsWith("color-") && (s.name = n);
  else {
    const r = `color-${t.replace(/^#/, "").replace(/[^a-f0-9]/gi, "")}`;
    e.set(t, {
      value: t,
      name: n ?? r,
      usageCount: 1,
      nodeIds: [i],
      source: /* @__PURE__ */ new Set([o])
    });
  }
}
function ke(e, t, i, o) {
  const n = t.fontFamily ?? "Unknown", s = t.fontSize ?? 16, r = t.fontWeight ?? 400, c = t.lineHeightPx ?? null, u = t.letterSpacing ?? 0, d = `${n}|${s}|${r}|${c}|${u}`, x = e.get(d);
  if (x)
    x.usageCount++, x.nodeIds.includes(i) || x.nodeIds.push(i), o && x.name.startsWith(n) && (x.name = o);
  else {
    const y = `${n}-${s}-${r}`;
    e.set(d, {
      fontFamily: n,
      fontSize: s,
      fontWeight: r,
      lineHeight: c,
      letterSpacing: u,
      name: o ?? y,
      usageCount: 1,
      nodeIds: [i]
    });
  }
}
function Z(e, t, i) {
  if (t === 0) return;
  const o = e.get(t);
  o ? (o.usageCount++, o.sources.includes(i) || o.sources.push(i)) : e.set(t, {
    value: t,
    usageCount: 1,
    sources: [i]
  });
}
function pt(e) {
  return !e.strokes || !Array.isArray(e.strokes) ? !1 : e.strokes.some((t) => t.visible !== !1 && t.type === "SOLID");
}
function gt(e, t) {
  var o, n;
  const i = (o = e.styleRefs) == null ? void 0 : o.fill;
  return i ? ((n = t[i]) == null ? void 0 : n.name) ?? null : null;
}
function mt(e, t) {
  var o, n;
  const i = (o = e.styleRefs) == null ? void 0 : o.stroke;
  return i ? ((n = t[i]) == null ? void 0 : n.name) ?? null : null;
}
function ht(e, t) {
  var o, n;
  const i = (o = e.styleRefs) == null ? void 0 : o.text;
  return i ? ((n = t[i]) == null ? void 0 : n.name) ?? null : null;
}
function yt(e, t) {
  var o, n;
  const i = (o = e.styleRefs) == null ? void 0 : o.effect;
  return i ? ((n = t[i]) == null ? void 0 : n.name) ?? null : null;
}
const xt = 500, bt = 2e3;
async function vt(e) {
  const { shell: t, token: i, fileKey: o, nodeId: n, scope: s } = e;
  let r, c, u;
  if (s === "node" || s === "frame") {
    if (!n)
      throw new Error(
        `Cannot extract ${s}: no node ID found in the URL. Paste a Figma URL that includes a node-id, or switch to "Entire Page" scope.`
      );
    const $ = await Qe(t, i, o, n);
    r = [$.rootNode], c = $.components, u = $.styles;
  } else {
    const $ = await et(t, i, o), v = $.rootNodes[0];
    r = (v == null ? void 0 : v.children) || [], c = $.components, u = $.styles;
  }
  let d = 0;
  for (const $ of r)
    d += ye($);
  let x;
  d > xt && (x = {
    nodeCount: d,
    message: `This selection has ~${d} nodes. Large extractions may produce verbose output.`
  });
  const y = ut(r, c);
  d > bt && (y.truncated = !0);
  const b = ft(y.rootNodes, u);
  return { extraction: y, tokens: b, fileKey: o, largeTreeWarning: x, rawRootNodes: r };
}
async function wt(e, t) {
  const i = `${t}/.shipstudio/assets`, o = await e.exec("rm", ["-rf", i]);
  if (o.exit_code !== 0)
    throw new Error(`Failed to clean assets directory: ${o.stderr}`);
  const n = await e.exec("mkdir", ["-p", i]);
  if (n.exit_code !== 0)
    throw new Error(`Failed to create assets directory: ${n.stderr}`);
  return i;
}
async function Ne(e, t, i) {
  const o = ["-sS", "-o", i, "--max-time", "30", "-L", t];
  if ((await e.exec("curl", o, { timeout: 35e3 })).exit_code === 0) return { success: !0 };
  const s = await e.exec("curl", o, { timeout: 35e3 });
  return s.exit_code === 0 ? { success: !0 } : {
    success: !1,
    error: s.stderr || `curl exit code ${s.exit_code}`
  };
}
function Ct(e, t) {
  return e[t] ?? e[encodeURIComponent(t)] ?? e[decodeURIComponent(t)] ?? null;
}
async function $t(e) {
  const { shell: t, token: i, fileKey: o, selectedNodeId: n, projectPath: s, manualAssets: r = [], onProgress: c } = e, u = [], d = r.filter((w) => w.status === "valid"), x = d.length + 1, y = await wt(t, s);
  c && c({ current: 0, total: x, currentAsset: "preview.png", phase: "preview" });
  let b = `${y}/preview.png`;
  try {
    const k = (await fe(t, i, o, [n], "png", 2))[n];
    if (k) {
      const l = await Ne(t, k, b);
      l.success || (u.push(`Preview download failed: ${l.error}`), b = "");
    } else
      u.push("Figma could not render preview for this node"), b = "";
  } catch (w) {
    u.push(`Preview render failed: ${(w == null ? void 0 : w.message) || "Unknown error"}`), b = "";
  }
  const $ = d.filter((w) => w.format === "png"), v = d.filter((w) => w.format === "svg");
  let E = {}, B = {};
  if ($.length > 0)
    try {
      E = await fe(t, i, o, $.map((w) => w.nodeId), "png", 2);
    } catch (w) {
      u.push(`PNG batch render failed: ${(w == null ? void 0 : w.message) || "Unknown error"}`), E = {};
    }
  if (v.length > 0)
    try {
      B = await fe(t, i, o, v.map((w) => w.nodeId), "svg");
    } catch (w) {
      u.push(`SVG batch render failed: ${(w == null ? void 0 : w.message) || "Unknown error"}`), B = {};
    }
  const U = [], M = [...$, ...v];
  for (let w = 0; w < M.length; w++) {
    const k = M[w], l = k.format === "png" ? E : B;
    c && c({
      current: w + 1,
      total: x,
      currentAsset: k.filename,
      phase: "assets"
    });
    const m = Ct(l, k.nodeId);
    if (!m) {
      u.push(`Failed to render ${k.filename}: Figma returned no image for node ${k.nodeId}`);
      continue;
    }
    const P = `${y}/${k.filename}`, z = await Ne(t, m, P);
    if (!z.success) {
      u.push(`Failed to download ${k.filename}: ${z.error}`);
      continue;
    }
    U.push({
      filename: k.filename,
      path: P,
      nodeId: k.nodeId,
      assetType: k.format === "svg" ? "icon" : "image"
    });
  }
  return {
    assetsDir: y,
    previewPath: b,
    assets: U,
    warnings: u
  };
}
function kt(e) {
  return e.toLowerCase().replace(/[/\s]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "") || "unnamed";
}
function Nt(e, t) {
  if (!t.includes(e))
    return e;
  const i = e.lastIndexOf("."), o = i !== -1, n = o ? e.slice(0, i) : e, s = o ? e.slice(i) : "";
  let r = 2;
  for (; t.includes(`${n}-${r}${s}`); )
    r++;
  return `${n}-${r}${s}`;
}
const Re = /^@s-/i;
function Tt(e) {
  return Re.test(e);
}
function St(e) {
  return e.replace(Re, "");
}
function Ie(e) {
  if (e.fills && Array.isArray(e.fills)) {
    for (const t of e.fills)
      if (t.visible !== !1 && t.type === "IMAGE")
        return !0;
  }
  if (e.children && Array.isArray(e.children)) {
    for (const t of e.children)
      if (Ie(t)) return !0;
  }
  return !1;
}
function Ee(e, t, i, o, n, s) {
  if (e.visible !== !1) {
    if (Tt(e.name) && !o) {
      const r = St(e.name);
      if (!r.trim())
        s.push(`Skipped layer "${e.name}": empty name after @S- prefix`);
      else {
        const c = Ie(e) ? "png" : "svg";
        n.push({
          nodeId: e.id,
          nodeName: e.name,
          nameAfterPrefix: r,
          format: c,
          depth: t,
          parentPath: [...i]
        });
      }
      o = !0;
    }
    if (e.children && Array.isArray(e.children)) {
      const r = [...i, e.name];
      for (const c of e.children)
        Ee(c, t + 1, r, o, n, s);
    }
  }
}
function At(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = `${kt(n.nameAfterPrefix)}.${n.format}`;
    t.has(r) || t.set(r, n);
  }
  const i = [], o = [];
  for (const [n, s] of t) {
    const r = Nt(n, i);
    i.push(r), o.push({
      nodeId: s.nodeId,
      nodeName: s.nodeName,
      filename: r,
      format: s.format,
      depth: s.depth,
      parentPath: s.parentPath
    });
  }
  return o;
}
function Rt(e) {
  const t = [], i = [];
  return Ee(e, 0, [], !1, t, i), { assets: At(t), warnings: i };
}
function It(e) {
  return e.map((t) => ({
    nodeId: t.nodeId,
    nodeName: t.nodeName,
    filename: t.filename,
    format: t.format,
    status: "valid"
  }));
}
const Et = /^(Frame|Group|Rectangle|Ellipse|Vector|Section|Instance|Line|Star|Polygon)\s*\d*$/i;
function Lt(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e) {
    const o = Pe(i.name) ? [] : [i.name];
    Le(i, o, t);
  }
  return t;
}
function Le(e, t, i) {
  if (i.set(e.id, Pt(t)), !!e.children)
    for (const o of e.children) {
      const n = Pe(o.name) ? t : [...t, o.name];
      Le(o, n, i);
    }
}
function Pt(e) {
  return e.length === 0 ? "" : e.length <= 4 ? e.join(" > ") : `${e[0]} > ... > ${e[e.length - 2]} > ${e[e.length - 1]}`;
}
function Pe(e) {
  return Et.test(e);
}
const Mt = 12e3;
function Ft(e) {
  return Math.ceil(e.length / 4);
}
function Bt(e) {
  const { extraction: t, exportResult: i, projectPath: o } = e, n = t.tokens, s = /* @__PURE__ */ new Map();
  for (const $ of i.assets)
    $.nodeId && s.set($.nodeId, $.filename), $.parentInstanceId && !s.has($.parentInstanceId) && s.set($.parentInstanceId, $.filename);
  const r = e.rootNodes ?? t.extraction.rootNodes, c = Lt(r), d = [
    Ut(e),
    zt(e.mode, e.inspirationText),
    Ht(i.previewPath, o),
    Ot(t.extraction.rootNodes, s),
    Gt(n),
    Yt(n.components),
    Qt(i.previewPath, i.assets, o, c),
    en()
  ].filter(Boolean).join(`

`), x = d.length, y = Ft(d), b = {
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
    stats: b
  };
}
function Ut(e) {
  var u;
  const { extraction: t, fileName: i, figmaUrl: o } = e, n = ((u = t.extraction.rootNodes[0]) == null ? void 0 : u.name) ?? "Untitled", s = e.date ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), c = {
    best: "Copy (Best results)",
    pixel: "Copy (Pixel for pixel)",
    inspiration: "Use as inspiration"
  }[e.mode ?? "best"] ?? "Copy (Best results)";
  return [
    "# Design Brief",
    "",
    `**File:** ${i}`,
    `**Frame:** ${n}`,
    `**Extracted:** ${s}`,
    `**Mode:** ${c}`,
    `**Figma URL:** ${o}`
  ].join(`
`);
}
function zt(e, t) {
  const i = e ?? "best", o = ["## How to Use This Brief", ""], n = "Read this brief fully. Study the preview image, layout tree, and design tokens before writing any code.", s = "The Assets section below is the complete manifest of provided files. Use only these assets -- every visual element NOT listed there should be built with CSS or HTML, not with image files. For any visual element visible in the preview that appears to be a photograph, logo, icon, or illustration but is NOT listed in the Assets section, create a placeholder box instead -- see the Placeholders section below for styling and naming conventions.", r = "Compare your result against the preview image and verify that layout, spacing, colors, and typography match the design tokens.";
  return i === "best" ? o.push(
    `**Before building:** ${n}`,
    `**During building:** Reproduce the design faithfully using clean, production-ready code. Use semantic HTML, CSS flexbox/grid for layout, and relative units (rem, %, vh) where appropriate. Follow the spacing and color tokens exactly, but use responsive patterns so the result works across screen sizes. ${s}`,
    `**After building:** ${r}`
  ) : i === "pixel" ? o.push(
    `**Before building:** ${n}`,
    `**During building:** Match the Figma design as exactly as possible. Use the exact pixel values from the design tokens for font sizes, spacing, widths, and heights. Use fixed dimensions rather than responsive units. Prioritize visual accuracy over code flexibility. ${s}`,
    `**After building:** ${r} Pay special attention to exact pixel dimensions, spacing values, and font sizes.`
  ) : i === "inspiration" && (o.push(
    `**Before building:** ${n} Use this design as a reference for visual patterns, not a spec to copy exactly.`,
    `**During building:** Adapt the design's style and layout patterns to fit the user's existing site and codebase. Use the color palette, typography choices, and layout structure as guidance, but adjust proportions, spacing, and components to work within the target context. ${s}`,
    "**After building:** Verify that your result captures the spirit of the design -- the visual hierarchy, color usage, and layout patterns -- while fitting naturally into the target codebase."
  ), t && t.trim() && o.push("", "**What to take from this design:**", "", `> ${t.trim().split(`
`).join(`
> `)}`)), o.join(`
`);
}
function Ht(e, t) {
  return e ? `## Preview

![Preview](${me(e, t)})` : "";
}
function Ot(e, t) {
  const i = [];
  for (const o of e)
    Me(o, 0, i, t);
  return i.length === 0 ? "" : `## Layout Tree

` + i.join(`
`);
}
function Me(e, t, i, o) {
  if (e.visible !== !1 && (i.push(_t(e, t, o)), !e.componentRef && e.children))
    for (const n of e.children)
      Me(n, t + 1, i, o);
}
function Wt(e) {
  return e.charAt(0).toUpperCase() + e.slice(1).toLowerCase();
}
function Fe(e) {
  return /Property\s+\d+=/i.test(e) ? e.split(",").map((t) => {
    const i = t.indexOf("=");
    if (i !== -1) {
      const o = t.slice(0, i).trim(), n = t.slice(i + 1).trim();
      if (/^Property\s+\d+$/i.test(o)) return n;
    }
    return t.trim();
  }).join(", ") : e;
}
function _t(e, t, i) {
  const o = "  ".repeat(t), n = [];
  if (e.componentRef) {
    let c = `Instance "${Fe(e.componentRef.componentName)}"`;
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
    n.push(`${Wt(e.type)} '${e.name}'`);
  if (e.autoLayout) {
    const r = e.autoLayout, c = [r.flexDirection];
    r.gap > 0 && c.push(`gap: ${r.gap}`), r.justifyContent !== "flex-start" && c.push(`justify: ${r.justifyContent}`), r.alignItems !== "flex-start" && c.push(`align: ${r.alignItems}`);
    const u = jt(r.padding);
    u && c.push(u), r.flexWrap === "wrap" && c.push("wrap"), n.push(`(${c.join(", ")})`);
  }
  e.width != null && e.height != null && n.push(`${Math.round(e.width)}x${Math.round(e.height)}`), e.positioning === "ABSOLUTE" && (e.absoluteOffset ? n.push(`[absolute] top:${e.absoluteOffset.top} left:${e.absoluteOffset.left}`) : n.push("[absolute]"));
  const s = Dt(e);
  return s && n.push(s), `${o}${n.join(" ")}`;
}
function ge(e) {
  if (!e) return null;
  for (const t of e)
    if (t.visible !== !1 && t.type === "SOLID" && t.color) {
      const i = t.opacity ?? 1, o = { ...t.color, a: (t.color.a ?? 1) * i };
      return q(o);
    }
  return null;
}
function Dt(e) {
  var i;
  const t = [];
  if (e.widthMode === "FILL" && t.push("w:fill"), e.heightMode === "FILL" && t.push("h:fill"), e.widthMode === "HUG" && t.push("w:hug"), e.heightMode === "HUG" && t.push("h:hug"), e.type !== "TEXT") {
    const o = ge(e.fills);
    o && o !== "#ffffff" && o !== "#000000" ? t.push(`bg:${o}`) : o && t.push(`bg:${o}`);
  }
  if (e.type === "TEXT") {
    const o = ge(e.fills);
    o && t.push(`color:${o}`);
  }
  if (e.cornerRadius && e.cornerRadius > 0 && t.push(`r:${Math.round(e.cornerRadius)}`), e.strokeWeight && e.strokeWeight > 0 && ((i = e.strokes) != null && i.length)) {
    const o = ge(e.strokes);
    o && t.push(`border:${e.strokeWeight}px ${o}`);
  }
  return e.layoutGrow === 1 && t.push("flex-grow:1"), e.layoutAlign === "STRETCH" && t.push("align-self:stretch"), e.opacity != null && e.opacity < 1 && t.push(`opacity:${e.opacity.toFixed(2)}`), t.length === 0 ? null : `{${t.join(" ")}}`;
}
function jt(e) {
  return e.top === 0 && e.right === 0 && e.bottom === 0 && e.left === 0 ? null : e.top === e.bottom && e.left === e.right && e.top === e.left ? `padding: ${e.top}` : e.top === e.bottom && e.left === e.right ? `padding: ${e.top} ${e.left}` : `padding: ${e.top} ${e.right} ${e.bottom} ${e.left}`;
}
function Gt(e) {
  const t = [];
  return e.colors.length > 0 && t.push(Vt(e.colors)), e.gradients.length > 0 && t.push(Kt(e.gradients)), e.typography.length > 0 && t.push(Xt(e.typography)), e.spacing.length > 0 && t.push(Zt(e.spacing)), e.borders.length > 0 && t.push(qt(e.borders)), e.shadows.length > 0 && t.push(Jt(e.shadows)), t.length === 0 ? "" : `## Design Tokens

` + t.join(`

`);
}
function Vt(e) {
  return [
    "### Colors",
    "",
    "| Name | Value | Usage |",
    "|------|-------|-------|",
    ...e.map((i) => `| ${i.name} | ${i.value} | ${i.usageCount} |`)
  ].join(`
`);
}
function Kt(e) {
  return [
    "### Gradients",
    "",
    "| Name | Value | Usage |",
    "|------|-------|-------|",
    ...e.map((i) => `| ${i.name} | ${i.value} | ${i.usageCount} |`)
  ].join(`
`);
}
function Xt(e) {
  return [
    "### Typography",
    "",
    "| Name | Font | Size | Weight | Line Height |",
    "|------|------|------|--------|-------------|",
    ...e.map((i) => {
      const o = i.lineHeight !== null ? `${i.lineHeight}px` : "auto";
      return `| ${i.name} | ${i.fontFamily} | ${i.fontSize}px | ${i.fontWeight} | ${o} |`;
    })
  ].join(`
`);
}
function Zt(e) {
  return [
    "### Spacing",
    "",
    "| Value | Sources | Usage |",
    "|-------|---------|-------|",
    ...e.map((i) => `| ${i.value}px | ${i.sources.join(", ")} | ${i.usageCount} |`)
  ].join(`
`);
}
function qt(e) {
  return [
    "### Borders",
    "",
    "| Name | Radius | Stroke | Usage |",
    "|------|--------|--------|-------|",
    ...e.map((i) => {
      const o = i.radius !== null ? `${i.radius}px` : i.cornerRadii ? i.cornerRadii.map((s) => `${s}px`).join(" ") : "--", n = i.strokeWeight !== null && i.strokeColor !== null ? `${i.strokeWeight}px ${i.strokeColor}` : "--";
      return `| ${i.name} | ${o} | ${n} | ${i.usageCount} |`;
    })
  ].join(`
`);
}
function Jt(e) {
  return [
    "### Shadows",
    "",
    "| Name | Type | Value | Usage |",
    "|------|------|-------|-------|",
    ...e.map((i) => {
      const o = `${i.offsetX}px ${i.offsetY}px ${i.blur}px ${i.spread}px ${i.color}`;
      return `| ${i.name} | ${i.type} | ${o} | ${i.usageCount} |`;
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
      const o = Fe(i.componentName), n = i.variantProperties && Object.keys(i.variantProperties).length > 0 ? Object.entries(i.variantProperties).map(([s, r]) => /^Property\s+\d+$/i.test(s) ? String(r) : `${s}: ${r}`).join(", ") : "--";
      return `| ${o} | ${i.source} | ${n} | ${i.usageCount} |`;
    })
  ].join(`
`);
}
function Qt(e, t, i, o) {
  if (!e && t.length === 0) return "";
  const n = [];
  if (e) {
    const s = me(e, i), r = s.split("/").pop() ?? s;
    n.push(`| ${r} | Preview | Full-page preview screenshot | ${s} |`);
  }
  for (const s of t) {
    const r = me(s.path, i), c = nn(s.assetType);
    let u = "--";
    s.nodeId && (u = o.get(s.nodeId) || s.parentInstanceId && o.get(s.parentInstanceId) || "--");
    const d = tn(s.assetType, u);
    n.push(`| ${s.filename} | ${c} | ${d} | ${r} |`);
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
function en() {
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
function tn(e, t) {
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
function nn(e) {
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
function Be({ nodes: e, depth: t = 0, maxDepth: i = 2 }) {
  return t >= i ? null : /* @__PURE__ */ a("div", { style: { paddingLeft: t > 0 ? "12px" : "0", borderLeft: t > 0 ? "1px solid var(--border)" : "none" }, children: e.map((o, n) => {
    const s = o.componentRef ? `<${o.componentRef.componentName}${o.repeatCount ? ` x${o.repeatCount}` : ""}>` : o.type === "TEXT" ? `"${(o.textContent ?? "").slice(0, 30)}${(o.textContent ?? "").length > 30 ? "..." : ""}"` : o.name, r = o.autoLayout ? `${o.autoLayout.flexDirection}` : o.type === "INSTANCE" ? "component" : o.type.toLowerCase();
    return /* @__PURE__ */ f("div", { style: { fontSize: "11px", lineHeight: 1.7 }, children: [
      /* @__PURE__ */ f("span", { style: { color: "var(--text-muted)" }, children: [
        r,
        " "
      ] }),
      /* @__PURE__ */ a("span", { style: { color: o.visible === !1 ? "var(--text-muted)" : "var(--text-primary)" }, children: s }),
      o.visible === !1 && /* @__PURE__ */ a("span", { style: { color: "var(--text-muted)", marginLeft: "4px" }, children: "(hidden)" }),
      o.children && o.children.length > 0 && t + 1 < i && /* @__PURE__ */ a(Be, { nodes: o.children, depth: t + 1, maxDepth: i }),
      o.children && o.children.length > 0 && t + 1 >= i && /* @__PURE__ */ f("span", { style: { color: "var(--text-muted)", fontSize: "11px", marginLeft: "12px" }, children: [
        "(",
        o.children.length,
        " children)"
      ] })
    ] }, o.id || n);
  }) });
}
function on({
  briefResult: e,
  extractionResult: t,
  extractionStats: i,
  exportResult: o,
  onCopyBrief: n,
  onNewBrief: s
}) {
  const [r, c] = C(!1), u = Math.round(e.stats.estimatedTokens / 1e3), d = e.stats.estimatedTokens > Mt;
  return /* @__PURE__ */ f("div", { children: [
    /* @__PURE__ */ f("div", { className: "figma-plugin-results-success", children: [
      /* @__PURE__ */ a("span", { className: "figma-plugin-results-success-icon", children: "✓" }),
      /* @__PURE__ */ a("span", { style: { fontWeight: 600, fontSize: "13px" }, children: "Brief ready" }),
      t.truncated && /* @__PURE__ */ a("span", { style: { color: "#f59e0b", fontSize: "11px" }, children: "(truncated)" })
    ] }),
    /* @__PURE__ */ a(
      "button",
      {
        className: "btn-primary",
        onClick: n,
        style: { width: "100%", marginBottom: "12px" },
        children: "Copy Brief to Clipboard"
      }
    ),
    /* @__PURE__ */ a("p", { className: "figma-plugin-results-guidance", children: "Paste into Claude Code (or your AI coding agent) to start building." }),
    /* @__PURE__ */ a("p", { className: "figma-plugin-results-refinement", children: "The build may not be perfect on the first try -- refine iteratively by giving your agent feedback on what to adjust." }),
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
    e.stats.assetCount === 0 && /* @__PURE__ */ a("div", { style: { color: "var(--text-muted)", fontSize: "11px", marginBottom: "8px" }, children: "No assets exported -- Claude Code will create placeholders for visual elements" }),
    d && /* @__PURE__ */ f("div", { className: "figma-plugin-warning", style: { marginBottom: "8px" }, children: [
      /* @__PURE__ */ a("strong", { children: "This brief is large" }),
      /* @__PURE__ */ a("p", { children: "Consider extracting a smaller section for better results." })
    ] }),
    /* @__PURE__ */ a(
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
        o.assets.length,
        ")"
      ] }),
      o.assets.length > 0 ? /* @__PURE__ */ a("ul", { className: "figma-plugin-results-asset-list", children: o.assets.map((x, y) => /* @__PURE__ */ f("li", { children: [
        x.filename,
        x.assetType && /* @__PURE__ */ f("span", { style: { color: "var(--text-muted)", marginLeft: "4px" }, children: [
          "(",
          x.assetType,
          ")"
        ] })
      ] }, y)) }) : /* @__PURE__ */ a("div", { style: { fontSize: "11px", color: "var(--text-muted)", marginBottom: "8px" }, children: "No assets exported" }),
      /* @__PURE__ */ a("h4", { children: "Layout tree" }),
      /* @__PURE__ */ a("div", { style: { maxHeight: "200px", overflowY: "auto" }, children: /* @__PURE__ */ a(Be, { nodes: t.rootNodes, maxDepth: 3 }) }),
      /* @__PURE__ */ a("h4", { children: "Design tokens" }),
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
    /* @__PURE__ */ a("div", { className: "figma-plugin-results-footer", children: "Also saved to .shipstudio/assets/brief.md" }),
    /* @__PURE__ */ a(
      "button",
      {
        className: "btn-secondary",
        onClick: s,
        style: { width: "100%", marginTop: "8px" },
        children: "Get New Brief"
      }
    )
  ] });
}
async function sn(e, t, i) {
  const o = `${t}/brief.md`, n = btoa(unescape(encodeURIComponent(i))), s = await e.exec("bash", [
    "-c",
    `echo '${n}' | base64 -d > '${o}'`
  ]);
  if (s.exit_code !== 0)
    throw new Error(`Failed to save brief: ${s.stderr}`);
}
async function Te(e, t) {
  const i = btoa(unescape(encodeURIComponent(t))), o = await e.exec("bash", [
    "-c",
    `echo '${i}' | base64 -d | pbcopy`
  ]);
  if (o.exit_code !== 0)
    throw new Error(`Clipboard copy failed: ${o.stderr}`);
}
const rn = [
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
function an(e) {
  const t = { frames: 0, components: [], textNodes: 0, hiddenNodes: 0 }, i = /* @__PURE__ */ new Map();
  function o(n) {
    if (n.visible || t.hiddenNodes++, (n.type === "FRAME" || n.type === "GROUP" || n.type === "SECTION") && t.frames++, n.type === "TEXT" && t.textNodes++, n.componentRef) {
      const s = n.componentRef.componentName, r = n.repeatCount ?? 1;
      i.set(s, (i.get(s) ?? 0) + r);
    }
    n.children && n.children.forEach(o);
  }
  return e.forEach(o), t.components = Array.from(i.entries()).map(([n, s]) => ({ name: n, count: s })).sort((n, s) => s.count - n.count), t;
}
function ln({ token: e }) {
  const t = se(), i = (t == null ? void 0 : t.shell) ?? null, o = (t == null ? void 0 : t.actions) ?? null, [n, s] = C(""), [r, c] = C(null), u = r != null && r.nodeId ? "node" : "page", [d, x] = C(null), [y, b] = C(!1), [$, v] = C(null), [E, B] = C(!1), [U, M] = C(null), [w, k] = C(null), [l, m] = C(!1), [P, z] = C(!1), [h, g] = C(null), [S, N] = C(null), [L, H] = C(!1), [O, W] = C(null), [J, G] = C(null), [xe, V] = C(!1), [Ue, re] = C(0), [be, ze] = C(!1), [K, ve] = C("best"), [ae, He] = C(""), we = Xe(
    () => U ? an(U.rootNodes) : null,
    [U]
  ), D = Q(null), X = Q(null), _ = Q(i);
  _.current = i;
  const le = Q(0), te = Q(0), ne = I(async (p, T) => {
    var R, Ce;
    if (!_.current || !r) return;
    z(!0), g(null), N(null);
    const A = T ? It(T.assets) : [];
    try {
      const j = await $t({
        shell: _.current,
        token: e,
        fileKey: p.fileKey,
        selectedNodeId: r.nodeId || ((R = p.extraction.rootNodes[0]) == null ? void 0 : R.id) || "0:0",
        projectPath: ((Ce = t == null ? void 0 : t.project) == null ? void 0 : Ce.path) ?? ".",
        manualAssets: A,
        onProgress: g
      });
      if (T != null && T.warnings.length && j.warnings.push(...T.warnings), N(j), o) {
        const Y = j.assets.length, F = j.warnings.length, ue = `Exported ${Y} asset${Y !== 1 ? "s" : ""}${F > 0 ? ` (${F} warning${F !== 1 ? "s" : ""})` : ""}`;
        o.showToast(ue, F > 0 ? "info" : "success");
      }
      H(!0), W(null), G(null), setTimeout(() => {
        var Y;
        try {
          const F = Bt({
            extraction: p,
            exportResult: j,
            projectPath: ((Y = t == null ? void 0 : t.project) == null ? void 0 : Y.path) ?? ".",
            fileName: (d == null ? void 0 : d.name) ?? "Untitled",
            figmaUrl: n,
            rootNodes: p.extraction.rootNodes,
            mode: K,
            inspirationText: K === "inspiration" ? ae : void 0
          });
          W(F), H(!1), _.current && sn(_.current, j.assetsDir, F.markdown).catch((ue) => {
            console.error("Brief save failed:", ue);
          }), o && o.showToast(
            `Brief ready: ${F.stats.nodeCount} layers, ${F.stats.assetCount} assets, ~${Math.round(F.stats.estimatedTokens / 1e3)}K tokens`,
            "success"
          );
        } catch (F) {
          G((F == null ? void 0 : F.message) || "Brief generation failed"), H(!1);
        }
      }, 0);
    } catch (j) {
      o && o.showToast(`Asset export failed: ${(j == null ? void 0 : j.message) || "Unknown error"}`, "error");
    } finally {
      z(!1), g(null);
    }
  }, [e, r, t, o, d, n, K, ae]), ie = I(async (p) => {
    const T = p.rawRootNodes.length === 1 ? p.rawRootNodes[0] : { name: "__root__", children: p.rawRootNodes, visible: !0 }, A = Rt(T);
    if (X.current = A, A.assets.length === 0) {
      D.current = p, V(!0), B(!1);
      return;
    }
    M(p.extraction), o && o.showToast(`Extracted ${p.extraction.nodeCount} layers`, "success"), ne(p, A);
  }, [o, ne]), Oe = I(
    (p) => {
      const T = p.target.value;
      if (s(T), !T.trim()) {
        c(null), x(null), v(null), b(!1), M(null), k(null), m(!1), D.current = null, N(null), z(!1), g(null), W(null), H(!1), G(null), V(!1), re(0), X.current = null;
        return;
      }
      const A = it(T);
      if (!A) {
        c(null), x(null), v("Please paste a valid Figma URL (file, design, proto, or board link)"), b(!1);
        return;
      }
      c(A), v(null), x(null), M(null), k(null), m(!1), D.current = null, N(null), z(!1), g(null), W(null), H(!1), G(null), V(!1), re(0), X.current = null;
    },
    []
  );
  oe(() => {
    if (!r || !_.current) return;
    const p = ++le.current, T = _.current;
    b(!0), x(null), v(null), (async () => {
      try {
        const A = await Ye(T, e, r.fileKey);
        le.current === p && (x(A), b(!1));
      } catch (A) {
        if (le.current === p) {
          const R = (A == null ? void 0 : A.message) || "Failed to validate file access.";
          R.includes("403") || R.includes("Invalid or expired") ? v("Cannot access this file. Check that your token has File content (Read) scope.") : R.includes("404") || R.includes("not found") ? v("File not found. Check that the URL is correct.") : R.includes("429") || R.includes("Rate limited") ? v("Rate limited by Figma. Please wait a moment and try again.") : v(R), b(!1);
        }
      }
    })();
  }, [r, e]);
  const ce = I(() => {
    const p = _.current;
    if (!p || !r) return;
    const T = ++te.current;
    B(!0), M(null), v(null), k(null), m(!1), D.current = null, N(null), z(!1), g(null), W(null), H(!1), G(null), V(!1), X.current = null, (async () => {
      try {
        const A = await vt({
          shell: p,
          token: e,
          fileKey: r.fileKey,
          nodeId: r.nodeId,
          scope: u
        });
        if (te.current !== T) return;
        if (A.largeTreeWarning) {
          D.current = A, k(A.largeTreeWarning), m(!0), B(!1);
          return;
        }
        ie(A);
      } catch (A) {
        if (te.current !== T) return;
        const R = (A == null ? void 0 : A.message) || "Extraction failed.";
        R.includes("403") || R.includes("Invalid or expired") ? v("Cannot access this file. Check that your token has File content (Read) scope.") : R.includes("404") || R.includes("not found") ? v("File not found. Check that the URL is correct.") : R.includes("429") || R.includes("Rate limited") ? v("Rate limited by Figma. Please wait a moment and try again.") : R.includes("timeout") || R.includes("timed out") ? v("Request timed out. Try a smaller selection or check your connection.") : v(R);
      } finally {
        te.current === T && B(!1);
      }
    })();
  }, [r, e, u, o, ie]), We = I(() => {
    const p = D.current;
    p && (m(!1), k(null), ie(p));
  }, [ie]), _e = I(() => {
    m(!1), k(null), D.current = null;
  }, []), De = I(() => {
    V(!1), re((p) => p + 1), D.current = null, X.current = null, ce();
  }, [ce]), je = I(() => {
    const p = D.current;
    p && (V(!1), D.current = null, M(p.extraction), o && o.showToast(`Extracted ${p.extraction.nodeCount} layers`, "success"), ne(p, X.current ?? void 0));
  }, [o, ne]), Ge = I(async () => {
    if (!(!O || !_.current))
      try {
        await Te(_.current, O.markdown), o && o.showToast("Brief copied to clipboard", "success");
      } catch (p) {
        o && o.showToast(`Copy failed: ${(p == null ? void 0 : p.message) || "Unknown error"}`, "error");
      }
  }, [O, o]), Ve = I(() => {
    W(null), M(null), N(null);
  }, []), Ke = !r || !d || y || E || P || L || xe;
  return O && U && we && S ? /* @__PURE__ */ a(
    on,
    {
      briefResult: O,
      extractionResult: U,
      extractionStats: we,
      exportResult: S,
      onCopyBrief: Ge,
      onNewBrief: Ve
    }
  ) : /* @__PURE__ */ f("div", { children: [
    /* @__PURE__ */ f("div", { className: "figma-plugin-section", style: { color: "var(--text-secondary)", fontSize: "12px", lineHeight: 1.5 }, children: [
      "Prefix layer names with ",
      /* @__PURE__ */ a("code", { style: { background: "var(--bg-tertiary)", padding: "1px 4px", borderRadius: "3px" }, children: "@S-" }),
      " to export them as assets.",
      " ",
      "Example: ",
      /* @__PURE__ */ a("code", { style: { background: "var(--bg-tertiary)", padding: "1px 4px", borderRadius: "3px" }, children: "@S-hero-image" }),
      /* @__PURE__ */ a("div", { style: { marginTop: "6px" }, children: /* @__PURE__ */ a(
        "button",
        {
          className: "btn-secondary",
          style: { fontSize: "11px", padding: "4px 10px" },
          onClick: () => {
            _.current && Te(_.current, "@S-").then(() => {
              o && o.showToast("Copied @S- to clipboard", "success");
            }).catch(() => {
            });
          },
          children: "Copy @S-"
        }
      ) }),
      /* @__PURE__ */ a("div", { style: { marginTop: "10px", fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }, children: "Watch this video before you start!" }),
      /* @__PURE__ */ f("div", { style: { marginTop: "6px", borderRadius: "6px", overflow: "hidden", position: "relative" }, children: [
        !be && /* @__PURE__ */ f("div", { style: {
          width: "100%",
          aspectRatio: "16/9",
          background: "var(--bg-tertiary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          color: "var(--text-muted)",
          fontSize: "12px"
        }, children: [
          /* @__PURE__ */ a("span", { className: "figma-plugin-spinner", style: { width: "14px", height: "14px", borderWidth: "2px" } }),
          "Loading video..."
        ] }),
        /* @__PURE__ */ a(
          "iframe",
          {
            src: "https://www.loom.com/embed/f08ca503b99a4def9b397dd7491b98e0",
            frameBorder: "0",
            allowFullScreen: !0,
            onLoad: () => ze(!0),
            style: { width: "100%", aspectRatio: "16/9", display: be ? "block" : "none" }
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ f("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ a("label", { className: "figma-plugin-label", children: "Figma URL" }),
      /* @__PURE__ */ a(
        "input",
        {
          className: "figma-plugin-input",
          type: "text",
          placeholder: "https://www.figma.com/design/...",
          value: n,
          onChange: Oe
        }
      ),
      $ && /* @__PURE__ */ a("div", { className: "figma-plugin-error", children: $ })
    ] }),
    r && /* @__PURE__ */ a("div", { className: "figma-plugin-section", children: /* @__PURE__ */ f("div", { className: "figma-plugin-file-info", children: [
      y && /* @__PURE__ */ f("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: d ? "8px" : "0" }, children: [
        /* @__PURE__ */ a("span", { className: "figma-plugin-spinner" }),
        /* @__PURE__ */ a("span", { style: { color: "var(--text-secondary)" }, children: "Checking access..." })
      ] }),
      d && /* @__PURE__ */ f("div", { style: { marginBottom: "8px" }, children: [
        /* @__PURE__ */ a("div", { style: { fontWeight: 600, fontSize: "13px", marginBottom: "4px" }, children: d.name }),
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
    r && d && !y && /* @__PURE__ */ a("div", { className: "figma-plugin-section", children: /* @__PURE__ */ a("div", { style: { color: "var(--text-secondary)", fontSize: "12px" }, children: r.nodeId ? "Will extract the selected element" : "Will extract the whole page — select a specific element in Figma to narrow scope" }) }),
    r && d && !y && !O && /* @__PURE__ */ f("div", { className: "figma-plugin-mode-section", children: [
      /* @__PURE__ */ a("span", { className: "figma-plugin-mode-label", children: "Brief mode" }),
      /* @__PURE__ */ a("div", { className: "figma-plugin-mode-group", children: rn.map((p) => /* @__PURE__ */ f(
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
            /* @__PURE__ */ a("div", { className: "figma-plugin-mode-card-name", children: p.name }),
            /* @__PURE__ */ a("div", { className: "figma-plugin-mode-card-desc", children: p.description })
          ]
        },
        p.id
      )) }),
      K === "inspiration" && /* @__PURE__ */ a(
        "textarea",
        {
          className: "figma-plugin-input figma-plugin-inspiration-textarea",
          placeholder: "Describe what to take from this design (e.g., 'Use the color palette and card layout pattern, but adapt spacing and typography to match our existing design system')",
          value: ae,
          onChange: (p) => He(p.target.value),
          rows: 3
        }
      )
    ] }),
    l && w && /* @__PURE__ */ a("div", { className: "figma-plugin-section", children: /* @__PURE__ */ f("div", { className: "figma-plugin-warning", children: [
      /* @__PURE__ */ f("strong", { children: [
        w.nodeCount,
        " layers detected"
      ] }),
      /* @__PURE__ */ a("p", { children: "Large selections may take longer and produce verbose output. Continue?" }),
      /* @__PURE__ */ f("div", { className: "figma-plugin-warning-actions", children: [
        /* @__PURE__ */ a("button", { className: "btn-primary", onClick: We, children: "Continue" }),
        /* @__PURE__ */ a("button", { className: "btn-secondary", onClick: _e, children: "Cancel" })
      ] })
    ] }) }),
    xe && /* @__PURE__ */ a("div", { className: "figma-plugin-section", children: /* @__PURE__ */ f("div", { className: "figma-plugin-warning", children: [
      /* @__PURE__ */ a("strong", { children: "No @S- asset layers found" }),
      /* @__PURE__ */ f("p", { children: [
        "Prefix layer names with ",
        /* @__PURE__ */ a("code", { children: "@S-" }),
        " to mark them for export.",
        " ",
        "Example: ",
        /* @__PURE__ */ a("code", { children: "@S-hero-image" }),
        " becomes ",
        /* @__PURE__ */ a("code", { children: "hero-image.png" }),
        ".",
        " ",
        "PNG or SVG format is auto-detected from layer content."
      ] }),
      Ue > 0 && /* @__PURE__ */ a("p", { style: { fontStyle: "italic", marginTop: "4px" }, children: "Still no @S- layers found. Check your layer names in Figma." }),
      /* @__PURE__ */ f("div", { className: "figma-plugin-warning-actions", children: [
        /* @__PURE__ */ a("button", { className: "btn-primary", onClick: De, children: "Try again" }),
        /* @__PURE__ */ a("button", { className: "btn-secondary", onClick: je, children: "Continue anyway" })
      ] })
    ] }) }),
    J && /* @__PURE__ */ a("div", { className: "figma-plugin-section", children: /* @__PURE__ */ a("div", { className: "figma-plugin-error", children: J }) }),
    (() => {
      const p = E || P || L, T = E ? "Extracting layout..." : P ? (h == null ? void 0 : h.phase) === "preview" ? "Rendering preview..." : `Exporting assets${h != null && h.total ? ` (${h.current ?? 0}/${h.total})` : ""}...` : L ? "Generating brief..." : "Get Brief";
      return /* @__PURE__ */ f(
        "button",
        {
          className: "btn-primary",
          onClick: ce,
          disabled: Ke,
          style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
          children: [
            p && /* @__PURE__ */ a("span", { className: "figma-plugin-spinner", style: { width: "14px", height: "14px", borderWidth: "2px" } }),
            T
          ]
        }
      );
    })()
  ] });
}
function cn({ onClick: e }) {
  return /* @__PURE__ */ a(
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
            /* @__PURE__ */ a("circle", { cx: "12", cy: "12", r: "3" }),
            /* @__PURE__ */ a("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" })
          ]
        }
      )
    }
  );
}
function un() {
  const e = se(), t = (e == null ? void 0 : e.storage) ?? null, i = (e == null ? void 0 : e.actions) ?? null, [o, n] = C(!1), [s, r] = C(null), [c, u] = C(null), [d, x] = C(!1), [y, b] = C("main");
  oe(() => {
    if (!t) return;
    let l = !1;
    return (async () => {
      try {
        const m = await t.read();
        !l && typeof m.figmaToken == "string" && (r(m.figmaToken), typeof m.figmaUserHandle == "string" && u({ id: "", handle: m.figmaUserHandle, img_url: "" }));
      } catch (m) {
        console.error("[figma] Failed to read storage:", m);
      } finally {
        l || x(!0);
      }
    })(), () => {
      l = !0;
    };
  }, [t]);
  const $ = I(() => n(!0), []), v = I(() => {
    n(!1), b("main");
  }, []), E = I(async (l, m) => {
    if (!(!t || !i))
      try {
        const P = await t.read();
        await t.write({ ...P, figmaToken: l, figmaUserHandle: m.handle }), r(l), u(m), b("main"), i.showToast(`Connected as ${m.handle}`, "success");
      } catch {
        i.showToast("Failed to save token. Please try again.", "error");
      }
  }, [t, i]), B = I(async (l, m) => {
    if (!(!t || !i))
      try {
        const P = await t.read();
        await t.write({ ...P, figmaToken: l, figmaUserHandle: m.handle }), r(l), u(m), b("main"), i.showToast(`Token updated — connected as ${m.handle}`, "success");
      } catch {
        i.showToast("Failed to save token. Please try again.", "error");
      }
  }, [t, i]), U = I(async () => {
    if (!(!t || !i))
      try {
        const l = await t.read(), { figmaToken: m, figmaUserHandle: P, ...z } = l;
        await t.write(z), r(null), u(null), b("main"), i.showToast("Disconnected from Figma", "info");
      } catch {
        i.showToast("Failed to remove token. Please try again.", "error");
      }
  }, [t, i]), M = "Figma", w = s ? /* @__PURE__ */ a(cn, { onClick: () => b("settings") }) : void 0;
  let k = null;
  return d && (s ? y === "settings" && c ? k = /* @__PURE__ */ a(
    nt,
    {
      currentUser: c,
      onTokenUpdated: B,
      onTokenRemoved: U,
      onBack: () => b("main")
    }
  ) : k = /* @__PURE__ */ a(ln, { token: s }) : k = /* @__PURE__ */ a(tt, { onTokenSaved: E })), /* @__PURE__ */ f(he, { children: [
    /* @__PURE__ */ a(
      "button",
      {
        onClick: $,
        title: "Figma Design Brief",
        className: "toolbar-icon-btn",
        children: /* @__PURE__ */ a(
          "svg",
          {
            width: "14",
            height: "14",
            viewBox: "0 0 15 15",
            fill: "currentColor",
            children: /* @__PURE__ */ a(
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
    /* @__PURE__ */ a(
      qe,
      {
        open: o,
        onClose: v,
        title: M,
        headerRight: w,
        children: k
      }
    )
  ] });
}
const pn = "Figma", gn = {
  toolbar: un
};
function mn() {
  console.log("[figma] Plugin activated");
}
function hn() {
  console.log("[figma] Plugin deactivated");
}
export {
  pn as name,
  mn as onActivate,
  hn as onDeactivate,
  gn as slots
};
