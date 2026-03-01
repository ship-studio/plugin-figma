import { jsx as c, jsxs as g, Fragment as oe } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export const jsx=R.createElement;export const jsxs=R.createElement;export const Fragment=R.Fragment;";
import { useEffect as ie, useCallback as S, useState as A, useRef as Q, useMemo as Ve } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export default R;export const{useState,useEffect,useCallback,useRef,useMemo,useContext,createContext,createElement,Fragment}=R;";
const xe = window;
function re() {
  const e = xe.__SHIPSTUDIO_REACT__, n = xe.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__;
  return n && (e != null && e.useContext) ? e.useContext(n) : null;
}
const le = "figma-plugin-styles", Ke = `
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

/* Asset list panel */
.figma-plugin-asset-panel {
  margin-top: 8px;
}

.figma-plugin-asset-input-row {
  display: flex;
  gap: 6px;
  align-items: center;
}

.figma-plugin-asset-input-row .figma-plugin-input {
  flex: 1;
  min-width: 0;
}

/* Individual asset row */
.figma-plugin-asset-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 12px;
  border: 1px solid var(--border);
  margin-bottom: 4px;
}

.figma-plugin-asset-row:hover {
  background: var(--bg-secondary);
}

/* Format badge */
.figma-plugin-format-badge {
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 3px;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
}

.figma-plugin-format-badge:hover {
  border-color: var(--accent, #0d99ff);
  color: var(--text-primary);
}

/* Asset filename (clickable for edit) */
.figma-plugin-asset-filename {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: text;
  color: var(--text-primary);
}

.figma-plugin-asset-filename:hover {
  text-decoration: underline;
  text-decoration-style: dotted;
}

/* Inline filename edit input */
.figma-plugin-asset-edit-input {
  flex: 1;
  min-width: 0;
  font-size: 12px;
  padding: 1px 4px;
  border: 1px solid var(--accent, #0d99ff);
  border-radius: 3px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  outline: none;
}

/* Status indicators */
.figma-plugin-asset-status-resolving {
  flex-shrink: 0;
}

.figma-plugin-asset-status-valid {
  color: #38a169;
  flex-shrink: 0;
}

.figma-plugin-asset-status-error {
  color: #e53e3e;
  flex-shrink: 0;
  font-size: 11px;
}

/* Asset list header row */
.figma-plugin-asset-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  margin-top: 10px;
}

.figma-plugin-asset-list-header span {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
}

/* Clear all button (text-style) */
.figma-plugin-asset-clear-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 11px;
  cursor: pointer;
  padding: 2px 4px;
}

.figma-plugin-asset-clear-btn:hover {
  color: #e53e3e;
}

/* Remove button on asset row */
.figma-plugin-asset-remove-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 14px;
  cursor: pointer;
  padding: 0 2px;
  line-height: 1;
  flex-shrink: 0;
}

.figma-plugin-asset-remove-btn:hover {
  color: #e53e3e;
}

/* Add button */
.figma-plugin-asset-add-btn {
  padding: 8px 12px;
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
  font-size: 13px;
  cursor: pointer;
  flex-shrink: 0;
  font-weight: 500;
  box-sizing: border-box;
}

.figma-plugin-asset-add-btn:hover {
  border-color: var(--accent, #0d99ff);
}

.figma-plugin-asset-add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Asset warning text */
.figma-plugin-asset-warning {
  font-size: 10px;
  color: #f59e0b;
  margin-top: 2px;
}
`;
function Xe({ open: e, onClose: n, title: i, headerRight: o, children: t }) {
  ie(() => {
    if (!e) return;
    let s = document.getElementById(le);
    return s || (s = document.createElement("style"), s.id = le, s.textContent = Ke, document.head.appendChild(s)), () => {
      const d = document.getElementById(le);
      d && d.remove();
    };
  }, [e]), ie(() => {
    if (!e) return;
    const s = (d) => {
      d.key === "Escape" && n();
    };
    return document.addEventListener("keydown", s), () => document.removeEventListener("keydown", s);
  }, [e, n]);
  const r = S(
    (s) => {
      s.target === s.currentTarget && n();
    },
    [n]
  );
  return e ? /* @__PURE__ */ c("div", { className: "figma-plugin-overlay", onClick: r, children: /* @__PURE__ */ g("div", { className: "figma-plugin-modal", children: [
    /* @__PURE__ */ g("div", { className: "figma-plugin-modal-header", children: [
      /* @__PURE__ */ c(
        "svg",
        {
          width: "16",
          height: "16",
          viewBox: "0 0 15 15",
          fill: "currentColor",
          children: /* @__PURE__ */ c(
            "path",
            {
              fillRule: "evenodd",
              clipRule: "evenodd",
              d: "M7.00005 2.04999H5.52505C4.71043 2.04999 4.05005 2.71037 4.05005 3.52499C4.05005 4.33961 4.71043 4.99999 5.52505 4.99999H7.00005V2.04999ZM7.00005 1.04999H8.00005H9.47505C10.842 1.04999 11.95 2.15808 11.95 3.52499C11.95 4.33163 11.5642 5.04815 10.9669 5.49999C11.5642 5.95184 11.95 6.66836 11.95 7.475C11.95 8.8419 10.842 9.95 9.47505 9.95C8.92236 9.95 8.41198 9.76884 8.00005 9.46266V9.95L8.00005 11.425C8.00005 12.7919 6.89195 13.9 5.52505 13.9C4.15814 13.9 3.05005 12.7919 3.05005 11.425C3.05005 10.6183 3.43593 9.90184 4.03317 9.44999C3.43593 8.99814 3.05005 8.28163 3.05005 7.475C3.05005 6.66836 3.43594 5.95184 4.03319 5.5C3.43594 5.04815 3.05005 4.33163 3.05005 3.52499C3.05005 2.15808 4.15814 1.04999 5.52505 1.04999H7.00005ZM8.00005 2.04999V4.99999H9.47505C10.2897 4.99999 10.95 4.33961 10.95 3.52499C10.95 2.71037 10.2897 2.04999 9.47505 2.04999H8.00005ZM5.52505 8.94998H7.00005L7.00005 7.4788L7.00005 7.475L7.00005 7.4712V6H5.52505C4.71043 6 4.05005 6.66038 4.05005 7.475C4.05005 8.28767 4.70727 8.94684 5.5192 8.94999L5.52505 8.94998ZM4.05005 11.425C4.05005 10.6123 4.70727 9.95315 5.5192 9.94999L5.52505 9.95H7.00005L7.00005 11.425C7.00005 12.2396 6.33967 12.9 5.52505 12.9C4.71043 12.9 4.05005 12.2396 4.05005 11.425ZM8.00005 7.47206C8.00164 6.65879 8.66141 6 9.47505 6C10.2897 6 10.95 6.66038 10.95 7.475C10.95 8.28962 10.2897 8.95 9.47505 8.95C8.66141 8.95 8.00164 8.29121 8.00005 7.47794V7.47206Z"
            }
          )
        }
      ),
      /* @__PURE__ */ c("span", { className: "figma-plugin-modal-title", children: i }),
      o && /* @__PURE__ */ c("div", { style: { marginLeft: "auto", display: "flex", alignItems: "center" }, children: o })
    ] }),
    /* @__PURE__ */ c("div", { className: "figma-plugin-modal-body", children: t })
  ] }) }) : null;
}
const Ze = "https://api.figma.com/v1";
async function ee(e, n, i, o) {
  const t = `${Ze}${n}`, r = Math.ceil(((o == null ? void 0 : o.timeout) ?? 3e4) / 1e3), s = [
    "-sS",
    "--max-time",
    String(r),
    "-H",
    `X-Figma-Token: ${i}`,
    t
  ], d = await e.exec("curl", s, {
    timeout: (o == null ? void 0 : o.timeout) ?? 12e4
  });
  if (d.exit_code !== 0)
    throw new Error(`Figma API request failed: ${d.stderr || `exit code ${d.exit_code}`}`);
  if (!d.stdout.trim())
    throw new Error("Empty response from Figma API");
  let u;
  try {
    u = JSON.parse(d.stdout);
  } catch {
    throw new Error(`Invalid JSON from Figma API: ${d.stdout.slice(0, 200)}`);
  }
  if (u.status && u.err)
    throw u.status === 429 ? new Error("Rate limited by Figma API. Try again in a moment.") : u.status === 403 ? new Error("Invalid or expired token. Please update your Figma token.") : u.status === 404 ? new Error("File not found. Check that the URL is correct and you have access.") : new Error(`Figma API error: ${u.err}`);
  return u;
}
async function Ce(e, n) {
  return ee(e, "/me", n);
}
async function qe(e, n, i) {
  const o = await ee(e, `/files/${i}?depth=1`, n);
  return {
    name: o.name,
    pages: o.document.children.filter((t) => t.type === "CANVAS").map((t) => ({ id: t.id, name: t.name }))
  };
}
async function $e(e, n, i, o) {
  const t = await ee(
    e,
    `/files/${i}/nodes?ids=${encodeURIComponent(o)}`,
    n,
    { timeout: 12e4 }
  ), r = t.nodes[o];
  if (!r) {
    const s = Object.keys(t.nodes), d = s.find(
      (u) => u.replace(/%3A/g, ":") === o || u === o.replace(/:/g, "%3A")
    );
    if (d)
      return {
        rootNode: t.nodes[d].document,
        components: t.nodes[d].components,
        styles: t.nodes[d].styles ?? {}
      };
    throw new Error(
      `Node "${o}" not found in API response. Available nodes: ${s.join(", ")}`
    );
  }
  return {
    rootNode: r.document,
    components: r.components,
    styles: r.styles ?? {}
  };
}
async function Je(e, n, i) {
  const o = await ee(
    e,
    `/files/${i}`,
    n,
    { timeout: 12e4 }
  );
  return {
    rootNodes: o.document.children,
    components: o.components,
    styles: o.styles ?? {}
  };
}
async function ce(e, n, i, o, t = "png", r) {
  const s = o.map((p) => encodeURIComponent(p)).join(",");
  let d = `/images/${i}?ids=${s}&format=${t}`;
  return r != null && (d += `&scale=${r}`), t === "svg" && (d += "&svg_outline_text=true&svg_include_id=true&svg_simplify_stroke=true"), (await ee(
    e,
    d,
    n,
    { timeout: 12e4 }
  )).images;
}
function Ye({ onTokenSaved: e }) {
  const n = re(), i = (n == null ? void 0 : n.shell) ?? null, [o, t] = A(""), [r, s] = A(!1), [d, u] = A(null), p = S(async () => {
    if (!i) return;
    const h = o.trim();
    if (!(!h || r)) {
      s(!0), u(null);
      try {
        const C = await Ce(i, h);
        e(h, C);
      } catch (C) {
        u((C == null ? void 0 : C.message) || "Failed to validate token. Please check and try again.");
      } finally {
        s(!1);
      }
    }
  }, [o, r, i, e]), w = S(
    (h) => {
      h.key === "Enter" && p();
    },
    [p]
  );
  return /* @__PURE__ */ g("div", { children: [
    /* @__PURE__ */ g("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ c("h3", { style: { fontSize: "14px", fontWeight: 600, margin: "0 0 8px 0" }, children: "Connect to Figma" }),
      /* @__PURE__ */ g("p", { style: { fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 16px 0", lineHeight: 1.5 }, children: [
        "To get started, you need a Figma Personal Access Token.",
        " ",
        /* @__PURE__ */ c(
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
      /* @__PURE__ */ c("label", { className: "figma-plugin-label", children: "Personal Access Token" }),
      /* @__PURE__ */ c(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: o,
          onChange: (h) => t(h.target.value),
          onKeyDown: w,
          disabled: r
        }
      ),
      d && /* @__PURE__ */ c("div", { className: "figma-plugin-error", children: d }),
      /* @__PURE__ */ c("div", { className: "figma-plugin-hint", children: "Token is stored locally in this project only." })
    ] }),
    /* @__PURE__ */ c(
      "button",
      {
        className: "btn-primary",
        onClick: p,
        disabled: !o.trim() || r,
        style: { width: "100%", marginTop: "4px" },
        children: r ? /* @__PURE__ */ g(oe, { children: [
          /* @__PURE__ */ c("span", { className: "figma-plugin-spinner", style: { marginRight: "8px", verticalAlign: "middle" } }),
          "Connecting..."
        ] }) : "Connect"
      }
    )
  ] });
}
function Qe({ currentUser: e, onTokenUpdated: n, onTokenRemoved: i, onBack: o }) {
  const t = re(), r = (t == null ? void 0 : t.shell) ?? null, [s, d] = A(""), [u, p] = A(!1), [w, h] = A(null), C = S(async () => {
    if (!r) return;
    const x = s.trim();
    if (!(!x || u)) {
      p(!0), h(null);
      try {
        const L = await Ce(r, x);
        n(x, L);
      } catch (L) {
        h((L == null ? void 0 : L.message) || "Failed to validate token. Please check and try again.");
      } finally {
        p(!1);
      }
    }
  }, [s, u, r, n]), I = S(
    (x) => {
      x.key === "Enter" && C();
    },
    [C]
  );
  return /* @__PURE__ */ g("div", { children: [
    /* @__PURE__ */ g(
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
          /* @__PURE__ */ c("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ c("polyline", { points: "15 18 9 12 15 6" }) }),
          "Back"
        ]
      }
    ),
    /* @__PURE__ */ c("div", { className: "figma-plugin-section", children: /* @__PURE__ */ g("div", { className: "figma-plugin-success", style: { display: "flex", alignItems: "center", gap: "6px", marginTop: "0" }, children: [
      /* @__PURE__ */ c("span", { style: { fontSize: "10px" }, children: "●" }),
      "Connected as ",
      e.handle
    ] }) }),
    /* @__PURE__ */ g("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ c("label", { className: "figma-plugin-label", children: "Update Token" }),
      /* @__PURE__ */ c(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: s,
          onChange: (x) => d(x.target.value),
          onKeyDown: I,
          disabled: u
        }
      ),
      w && /* @__PURE__ */ c("div", { className: "figma-plugin-error", children: w }),
      /* @__PURE__ */ c(
        "button",
        {
          className: "btn-primary",
          onClick: C,
          disabled: !s.trim() || u,
          style: { width: "100%", marginTop: "8px" },
          children: u ? /* @__PURE__ */ g(oe, { children: [
            /* @__PURE__ */ c("span", { className: "figma-plugin-spinner", style: { marginRight: "8px", verticalAlign: "middle" } }),
            "Validating..."
          ] }) : "Update"
        }
      )
    ] }),
    /* @__PURE__ */ c("div", { className: "figma-plugin-section", style: { borderTop: "1px solid var(--border)", paddingTop: "16px" }, children: /* @__PURE__ */ c(
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
function ke(e) {
  const n = e.match(
    /figma\.com\/(file|design|proto|board)\/([A-Za-z0-9]+)/
  );
  if (!n) return null;
  const i = n[1], o = n[2];
  let t = null;
  const r = e.match(/[?&]node-id=([^&]+)/);
  return r && (t = decodeURIComponent(r[1]).replace(/-/g, ":")), { fileKey: o, nodeId: t, fileType: i };
}
function et(e) {
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
function tt(e) {
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
function nt(e) {
  const n = {
    flexDirection: e.layoutMode === "HORIZONTAL" ? "row" : "column",
    justifyContent: et(e.primaryAxisAlignItems),
    alignItems: tt(e.counterAxisAlignItems),
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
function it(e, n) {
  const i = n[e.componentId];
  let o;
  if (e.componentProperties) {
    const r = {};
    for (const [s, d] of Object.entries(e.componentProperties))
      (d.type === "VARIANT" || d.type === "BOOLEAN" || d.type === "TEXT") && (r[s] = d.value);
    Object.keys(r).length > 0 && (o = r);
  }
  const t = {
    componentId: e.componentId,
    componentName: (i == null ? void 0 : i.name) ?? e.name,
    isRemote: (i == null ? void 0 : i.remote) ?? !1,
    source: i != null && i.remote ? "library" : "local"
  };
  return i != null && i.description && (t.description = i.description), o && (t.variantProperties = o), e.overrides && (t.overrides = e.overrides), t;
}
function Ne(e, n, i, o) {
  const t = e;
  if (t.type === "SLICE") return null;
  const r = {
    id: t.id,
    name: t.name,
    type: t.type,
    visible: t.visible !== !1
    // defaults to true when undefined
  };
  switch (t.absoluteBoundingBox != null ? (r.width = t.absoluteBoundingBox.width, r.height = t.absoluteBoundingBox.height) : t.size != null && (r.width = t.size.x, r.height = t.size.y), "layoutSizingHorizontal" in t && (r.widthMode = t.layoutSizingHorizontal), "layoutSizingVertical" in t && (r.heightMode = t.layoutSizingVertical), "layoutPositioning" in t && t.layoutPositioning != null && (r.positioning = t.layoutPositioning), "layoutGrow" in t && t.layoutGrow === 1 && (r.layoutGrow = 1), "layoutAlign" in t && t.layoutAlign === "STRETCH" && (r.layoutAlign = "STRETCH"), r.positioning === "ABSOLUTE" && o != null && t.absoluteBoundingBox != null && (r.absoluteOffset = {
    top: Math.round(t.absoluteBoundingBox.y - o.y),
    left: Math.round(t.absoluteBoundingBox.x - o.x)
  }), "layoutMode" in t && t.layoutMode && t.layoutMode !== "NONE" && (r.autoLayout = nt(t)), "constraints" in t && t.constraints != null && (r.constraints = t.constraints), "minWidth" in t && t.minWidth != null && (r.minWidth = t.minWidth), "maxWidth" in t && t.maxWidth != null && (r.maxWidth = t.maxWidth), "minHeight" in t && t.minHeight != null && (r.minHeight = t.minHeight), "maxHeight" in t && t.maxHeight != null && (r.maxHeight = t.maxHeight), "preserveRatio" in t && t.preserveRatio != null && (r.preserveRatio = t.preserveRatio), "fills" in t && Array.isArray(t.fills) && (r.fills = t.fills), "strokes" in t && Array.isArray(t.strokes) && (r.strokes = t.strokes), "strokeWeight" in t && t.strokeWeight != null && (r.strokeWeight = t.strokeWeight), "effects" in t && Array.isArray(t.effects) && (r.effects = t.effects), "cornerRadius" in t && t.cornerRadius != null && (r.cornerRadius = t.cornerRadius), "rectangleCornerRadii" in t && Array.isArray(t.rectangleCornerRadii) && (r.rectangleCornerRadii = t.rectangleCornerRadii), "opacity" in t && t.opacity != null && t.opacity !== 1 && (r.opacity = t.opacity), "blendMode" in t && t.blendMode && t.blendMode !== "PASS_THROUGH" && t.blendMode !== "NORMAL" && (r.blendMode = t.blendMode), "isMask" in t && t.isMask === !0 && (r.isMask = !0), "styles" in t && t.styles && (r.styleRefs = t.styles), t.type) {
    case "TEXT":
      r.textContent = t.characters, t.style && (r.textStyle = t.style), t.styleOverrideTable && Object.keys(t.styleOverrideTable).length > 0 && (r.textStyleOverrides = t.styleOverrideTable);
      break;
    case "INSTANCE":
      return r.componentRef = it(t, n), r;
    case "BOOLEAN_OPERATION":
      return r;
  }
  if ("children" in t && Array.isArray(t.children)) {
    const s = t.absoluteBoundingBox != null ? { x: t.absoluteBoundingBox.x, y: t.absoluteBoundingBox.y } : null, d = t.children.map((u) => Ne(u, n, i + 1, s)).filter((u) => u !== null);
    r.children = rt(d);
  }
  return r;
}
function ge(e) {
  let n = 1;
  if (e.children && Array.isArray(e.children))
    for (const i of e.children)
      n += ge(i);
  return n;
}
function ot(e) {
  const n = e.componentRef, i = n.variantProperties ? JSON.stringify(n.variantProperties, Object.keys(n.variantProperties).sort()) : "";
  return `${n.componentId}::${i}`;
}
function rt(e) {
  if (e.length === 0) return [];
  const n = /* @__PURE__ */ new Map();
  for (let t = 0; t < e.length; t++) {
    const r = e[t];
    if (r.componentRef) {
      const s = ot(r), d = n.get(s);
      d ? (d.count++, d.indices.push(t)) : n.set(s, { node: r, count: 1, indices: [t] });
    }
  }
  const i = /* @__PURE__ */ new Set();
  for (const t of n.values())
    if (t.count >= 3) {
      t.node.repeatCount = t.count;
      for (let r = 1; r < t.indices.length; r++)
        i.add(t.indices[r]);
    }
  const o = [];
  for (let t = 0; t < e.length; t++)
    i.has(t) || o.push(e[t]);
  return o;
}
function st(e, n) {
  let i = 0;
  for (const t of e)
    i += ge(t);
  return {
    rootNodes: e.map((t) => Ne(t, n, 0, null)).filter((t) => t !== null),
    nodeCount: i,
    truncated: !1
  };
}
function q(e) {
  const n = Math.round(e.r * 255), i = Math.round(e.g * 255), o = Math.round(e.b * 255);
  if (e.a >= 1)
    return `#${n.toString(16).padStart(2, "0")}${i.toString(16).padStart(2, "0")}${o.toString(16).padStart(2, "0")}`;
  const t = parseFloat(e.a.toFixed(2));
  return `rgba(${n}, ${i}, ${o}, ${t})`;
}
function at(e) {
  const n = e.gradientStops.map((i) => `${q(i.color)} ${Math.round(i.position * 100)}%`).join(", ");
  switch (e.type) {
    case "GRADIENT_LINEAR": {
      const [i, o] = e.gradientHandlePositions, t = o.x - i.x, r = o.y - i.y, s = Math.atan2(r, t);
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
function lt(e, n) {
  const i = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), u = [], p = /* @__PURE__ */ new Map();
  let w = 0, h = 0, C = 0;
  function I(l) {
    var y, P, _;
    if (l.fills && Array.isArray(l.fills)) {
      const $ = dt(l, n);
      for (const a of l.fills)
        if (a.visible !== !1)
          if (a.type === "SOLID") {
            const f = { ...a.color };
            a.opacity != null && a.opacity !== 1 && (f.a = f.a * a.opacity);
            const T = q(f);
            de(i, T, l.id, "fill", $);
          } else if ((y = a.type) != null && y.startsWith("GRADIENT_")) {
            const f = at(a), T = f, E = o.get(T);
            E ? (E.usageCount++, E.nodeIds.push(l.id)) : (C++, o.set(T, {
              value: f,
              name: $ ?? `gradient-${C}`,
              gradientType: a.type,
              usageCount: 1,
              nodeIds: [l.id]
            }));
          } else a.type === "IMAGE" && u.push({
            imageRef: a.imageRef,
            scaleMode: a.scaleMode,
            nodeId: l.id,
            nodeName: l.name
          });
    }
    if (l.strokes && Array.isArray(l.strokes)) {
      const $ = ut(l, n);
      for (const a of l.strokes)
        if (a.visible !== !1 && a.type === "SOLID") {
          const f = { ...a.color };
          a.opacity != null && a.opacity !== 1 && (f.a = f.a * a.opacity);
          const T = q(f);
          de(i, T, l.id, "stroke", $);
        }
    }
    if (l.effects && Array.isArray(l.effects)) {
      const $ = pt(l, n);
      for (const a of l.effects)
        if (a.visible === !0 && (a.type === "DROP_SHADOW" || a.type === "INNER_SHADOW")) {
          const f = a.type === "DROP_SHADOW" ? "drop-shadow" : "inner-shadow", T = q(a.color), E = ((P = a.offset) == null ? void 0 : P.x) ?? 0, B = ((_ = a.offset) == null ? void 0 : _.y) ?? 0, H = a.radius ?? 0, O = a.spread ?? 0, F = `${f}|${T}|${E}|${B}|${H}|${O}`, j = d.get(F);
          j ? (j.usageCount++, j.nodeIds.push(l.id)) : (h++, d.set(F, {
            type: f,
            color: T,
            offsetX: E,
            offsetY: B,
            blur: H,
            spread: O,
            name: $ ?? `shadow-${h}`,
            usageCount: 1,
            nodeIds: [l.id]
          })), de(i, T, l.id, "shadow", null);
        }
    }
    if (l.type === "TEXT" && l.textStyle) {
      const $ = ft(l, n);
      if (ve(t, l.textStyle, l.id, $), l.textStyleOverrides && typeof l.textStyleOverrides == "object")
        for (const a of Object.values(l.textStyleOverrides))
          ve(t, a, l.id, null);
    }
    if (l.autoLayout) {
      const $ = l.autoLayout;
      $.padding && (Z(r, $.padding.top, "padding-top"), Z(r, $.padding.right, "padding-right"), Z(r, $.padding.bottom, "padding-bottom"), Z(r, $.padding.left, "padding-left")), Z(r, $.gap, "gap"), $.rowGap != null && Z(r, $.rowGap, "row-gap");
    }
    if (l.cornerRadius != null || l.rectangleCornerRadii != null || ct(l)) {
      const $ = l.rectangleCornerRadii ? null : l.cornerRadius ?? null, a = l.rectangleCornerRadii ?? null;
      let f = null, T = null;
      if (l.strokes && Array.isArray(l.strokes)) {
        const H = l.strokes.find(
          (O) => O.visible !== !1 && O.type === "SOLID"
        );
        H && (f = q(H.color), T = l.strokeWeight ?? null);
      }
      const E = `${$}|${JSON.stringify(a)}|${f}|${T}`, B = s.get(E);
      B ? (B.usageCount++, B.nodeIds.push(l.id)) : (w++, s.set(E, {
        radius: $,
        cornerRadii: a,
        strokeColor: f,
        strokeWeight: T,
        name: `border-${w}`,
        usageCount: 1,
        nodeIds: [l.id]
      }));
    }
    if (l.componentRef) {
      const $ = l.componentRef, a = `${$.componentName}::${JSON.stringify($.variantProperties ?? {})}`, f = p.get(a), T = l.repeatCount ?? 1;
      if (f)
        f.usageCount += T;
      else {
        const E = {
          componentName: $.componentName,
          source: $.source,
          usageCount: T
        };
        $.description && (E.description = $.description), $.variantProperties && (E.variantProperties = $.variantProperties), p.set(a, E);
      }
    }
    if (l.children)
      for (const $ of l.children)
        I($);
  }
  for (const l of e)
    I(l);
  const x = Array.from(i.values()).map((l) => ({
    value: l.value,
    name: l.name,
    usageCount: l.usageCount,
    nodeIds: l.nodeIds,
    source: Array.from(l.source)
  }));
  x.sort((l, y) => y.usageCount - l.usageCount);
  const L = Array.from(o.values());
  L.sort((l, y) => y.usageCount - l.usageCount);
  const z = Array.from(t.values());
  z.sort((l, y) => y.usageCount - l.usageCount);
  const M = Array.from(r.values());
  M.sort((l, y) => l.value - y.value);
  const U = Array.from(s.values());
  U.sort((l, y) => y.usageCount - l.usageCount);
  const b = Array.from(d.values());
  b.sort((l, y) => y.usageCount - l.usageCount);
  const R = Array.from(p.values());
  return R.sort((l, y) => y.usageCount - l.usageCount), {
    colors: x,
    gradients: L,
    typography: z,
    spacing: M,
    borders: U,
    shadows: b,
    imageFills: u,
    components: R
  };
}
function de(e, n, i, o, t) {
  const r = e.get(n);
  if (r)
    r.usageCount++, r.nodeIds.includes(i) || r.nodeIds.push(i), r.source.add(o), t && r.name.startsWith("color-") && (r.name = t);
  else {
    const s = `color-${n.replace(/^#/, "").replace(/[^a-f0-9]/gi, "")}`;
    e.set(n, {
      value: n,
      name: t ?? s,
      usageCount: 1,
      nodeIds: [i],
      source: /* @__PURE__ */ new Set([o])
    });
  }
}
function ve(e, n, i, o) {
  const t = n.fontFamily ?? "Unknown", r = n.fontSize ?? 16, s = n.fontWeight ?? 400, d = n.lineHeightPx ?? null, u = n.letterSpacing ?? 0, p = `${t}|${r}|${s}|${d}|${u}`, w = e.get(p);
  if (w)
    w.usageCount++, w.nodeIds.includes(i) || w.nodeIds.push(i), o && w.name.startsWith(t) && (w.name = o);
  else {
    const h = `${t}-${r}-${s}`;
    e.set(p, {
      fontFamily: t,
      fontSize: r,
      fontWeight: s,
      lineHeight: d,
      letterSpacing: u,
      name: o ?? h,
      usageCount: 1,
      nodeIds: [i]
    });
  }
}
function Z(e, n, i) {
  if (n === 0) return;
  const o = e.get(n);
  o ? (o.usageCount++, o.sources.includes(i) || o.sources.push(i)) : e.set(n, {
    value: n,
    usageCount: 1,
    sources: [i]
  });
}
function ct(e) {
  return !e.strokes || !Array.isArray(e.strokes) ? !1 : e.strokes.some((n) => n.visible !== !1 && n.type === "SOLID");
}
function dt(e, n) {
  var o, t;
  const i = (o = e.styleRefs) == null ? void 0 : o.fill;
  return i ? ((t = n[i]) == null ? void 0 : t.name) ?? null : null;
}
function ut(e, n) {
  var o, t;
  const i = (o = e.styleRefs) == null ? void 0 : o.stroke;
  return i ? ((t = n[i]) == null ? void 0 : t.name) ?? null : null;
}
function ft(e, n) {
  var o, t;
  const i = (o = e.styleRefs) == null ? void 0 : o.text;
  return i ? ((t = n[i]) == null ? void 0 : t.name) ?? null : null;
}
function pt(e, n) {
  var o, t;
  const i = (o = e.styleRefs) == null ? void 0 : o.effect;
  return i ? ((t = n[i]) == null ? void 0 : t.name) ?? null : null;
}
const gt = 500, mt = 2e3;
async function ht(e) {
  const { shell: n, token: i, fileKey: o, nodeId: t, scope: r } = e;
  let s, d, u;
  if (r === "node" || r === "frame") {
    if (!t)
      throw new Error(
        `Cannot extract ${r}: no node ID found in the URL. Paste a Figma URL that includes a node-id, or switch to "Entire Page" scope.`
      );
    const I = await $e(n, i, o, t);
    s = [I.rootNode], d = I.components, u = I.styles;
  } else {
    const I = await Je(n, i, o), x = I.rootNodes[0];
    s = (x == null ? void 0 : x.children) || [], d = I.components, u = I.styles;
  }
  let p = 0;
  for (const I of s)
    p += ge(I);
  let w;
  p > gt && (w = {
    nodeCount: p,
    message: `This selection has ~${p} nodes. Large extractions may produce verbose output.`
  });
  const h = st(s, d);
  p > mt && (h.truncated = !0);
  const C = lt(h.rootNodes, u);
  return { extraction: h, tokens: C, fileKey: o, largeTreeWarning: w };
}
async function yt(e, n) {
  const i = `${n}/.shipstudio/assets`, o = await e.exec("rm", ["-rf", i]);
  if (o.exit_code !== 0)
    throw new Error(`Failed to clean assets directory: ${o.stderr}`);
  const t = await e.exec("mkdir", ["-p", i]);
  if (t.exit_code !== 0)
    throw new Error(`Failed to create assets directory: ${t.stderr}`);
  return i;
}
async function be(e, n, i) {
  const o = ["-sS", "-o", i, "--max-time", "30", "-L", n];
  if ((await e.exec("curl", o, { timeout: 35e3 })).exit_code === 0) return { success: !0 };
  const r = await e.exec("curl", o, { timeout: 35e3 });
  return r.exit_code === 0 ? { success: !0 } : {
    success: !1,
    error: r.stderr || `curl exit code ${r.exit_code}`
  };
}
function xt(e, n) {
  return e[n] ?? e[encodeURIComponent(n)] ?? e[decodeURIComponent(n)] ?? null;
}
async function vt(e) {
  const { shell: n, token: i, fileKey: o, selectedNodeId: t, projectPath: r, manualAssets: s = [], onProgress: d } = e, u = [], p = s.filter((b) => b.status === "valid"), w = p.length + 1, h = await yt(n, r);
  d && d({ current: 0, total: w, currentAsset: "preview.png", phase: "preview" });
  let C = `${h}/preview.png`;
  try {
    const R = (await ce(n, i, o, [t], "png", 2))[t];
    if (R) {
      const l = await be(n, R, C);
      l.success || (u.push(`Preview download failed: ${l.error}`), C = "");
    } else
      u.push("Figma could not render preview for this node"), C = "";
  } catch (b) {
    u.push(`Preview render failed: ${(b == null ? void 0 : b.message) || "Unknown error"}`), C = "";
  }
  const I = p.filter((b) => b.format === "png"), x = p.filter((b) => b.format === "svg");
  let L = {}, z = {};
  if (I.length > 0)
    try {
      L = await ce(n, i, o, I.map((b) => b.nodeId), "png", 2);
    } catch (b) {
      u.push(`PNG batch render failed: ${(b == null ? void 0 : b.message) || "Unknown error"}`), L = {};
    }
  if (x.length > 0)
    try {
      z = await ce(n, i, o, x.map((b) => b.nodeId), "svg");
    } catch (b) {
      u.push(`SVG batch render failed: ${(b == null ? void 0 : b.message) || "Unknown error"}`), z = {};
    }
  const M = [], U = [...I, ...x];
  for (let b = 0; b < U.length; b++) {
    const R = U[b], l = R.format === "png" ? L : z;
    d && d({
      current: b + 1,
      total: w,
      currentAsset: R.filename,
      phase: "assets"
    });
    const y = xt(l, R.nodeId);
    if (!y) {
      u.push(`Failed to render ${R.filename}: Figma returned no image for node ${R.nodeId}`);
      continue;
    }
    const P = `${h}/${R.filename}`, _ = await be(n, y, P);
    if (!_.success) {
      u.push(`Failed to download ${R.filename}: ${_.error}`);
      continue;
    }
    M.push({
      filename: R.filename,
      path: P,
      nodeId: R.nodeId,
      assetType: R.format === "svg" ? "icon" : "image"
    });
  }
  return {
    assetsDir: h,
    previewPath: C,
    assets: M,
    warnings: u
  };
}
function Ie(e) {
  return e.toLowerCase().replace(/[/\s]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "") || "unnamed";
}
const Te = /^(Frame|Group|Rectangle|Ellipse|Vector|Section|Instance|Line|Star|Polygon)\s*\d*$/i;
function bt(e) {
  const n = /* @__PURE__ */ new Map();
  for (const i of e) {
    const o = Re(i.name) ? [] : [i.name];
    Ae(i, o, n);
  }
  return n;
}
function Ae(e, n, i) {
  if (i.set(e.id, wt(n)), !!e.children)
    for (const o of e.children) {
      const t = Re(o.name) ? n : [...n, o.name];
      Ae(o, t, i);
    }
}
function wt(e) {
  return e.length === 0 ? "" : e.length <= 4 ? e.join(" > ") : `${e[0]} > ... > ${e[e.length - 2]} > ${e[e.length - 1]}`;
}
function Re(e) {
  return Te.test(e);
}
const Ct = /* @__PURE__ */ new Set([
  "VECTOR",
  "LINE",
  "STAR",
  "ELLIPSE",
  "REGULAR_POLYGON",
  "BOOLEAN_OPERATION"
]);
function $t(e) {
  return e.startsWith("I");
}
function kt(e) {
  return Ct.has(e) ? "svg" : "png";
}
function fe(e, n) {
  if (!n.includes(e))
    return e;
  const i = e.lastIndexOf("."), o = i !== -1, t = o ? e.slice(0, i) : e, r = o ? e.slice(i) : "";
  let s = 2;
  for (; n.includes(`${t}-${s}${r}`); )
    s++;
  return `${t}-${s}${r}`;
}
function Nt(e, n, i, o) {
  const t = kt(i), s = `${Ie(n)}.${t}`, d = o.map((w) => w.filename), u = fe(s, d), p = Te.test(n) ? `Auto-named: ${u} -- consider renaming` : void 0;
  return {
    nodeId: e,
    nodeName: n,
    filename: u,
    format: t,
    status: "valid",
    warning: p
  };
}
async function It(e, n, i, o, t) {
  try {
    const { rootNode: r } = await $e(e, n, i, o);
    return Nt(o, r.name, r.type, t);
  } catch (r) {
    return {
      nodeId: o,
      nodeName: "",
      filename: "",
      format: "png",
      status: "error",
      error: r instanceof Error ? r.message : String(r)
    };
  }
}
function Tt({
  designFileKey: e,
  assets: n,
  onAdd: i,
  onRemove: o,
  onClear: t,
  onRename: r,
  onResolved: s,
  onFormatChange: d,
  disabled: u,
  shell: p,
  token: w
}) {
  const [h, C] = A(""), [I, x] = A(null), [L, z] = A(null), [M, U] = A(""), b = Q(/* @__PURE__ */ new Set()), R = S(async () => {
    if (!h.trim() || !e || u) return;
    const a = ke(h);
    if (!a) {
      x("Invalid Figma URL");
      return;
    }
    if (!a.nodeId) {
      x("URL must point to a specific element (include node-id)");
      return;
    }
    if (a.fileKey !== e) {
      x("Asset must be from the same Figma file");
      return;
    }
    if (n.some((E) => E.nodeId === a.nodeId) || b.current.has(a.nodeId)) {
      x("This element is already in the list");
      return;
    }
    if ($t(a.nodeId)) {
      x("This is an instance child -- select the parent component instead");
      return;
    }
    const f = a.nodeId;
    b.current.add(f), i({
      nodeId: f,
      nodeName: "",
      filename: "",
      format: "png",
      status: "resolving"
    }), C(""), x(null);
    try {
      const E = await It(p, w, e, f, n);
      s(f, E);
    } catch (E) {
      s(f, {
        nodeId: f,
        nodeName: "",
        filename: f.replace(/:/g, "-") + ".png",
        format: "png",
        status: "error",
        error: E instanceof Error ? E.message : "Failed to resolve node"
      });
    } finally {
      b.current.delete(f);
    }
  }, [h, e, n, p, w, u, i, s]), l = S(
    (a) => {
      const f = a.format === "png" ? "svg" : "png", T = a.filename.lastIndexOf("."), B = `${T !== -1 ? a.filename.slice(0, T) : a.filename}.${f}`, H = n.filter((F) => F.nodeId !== a.nodeId).map((F) => F.filename), O = fe(B, H);
      d(a.nodeId, f, O);
    },
    [n, d]
  ), y = S((a, f) => {
    z(a);
    const T = f.lastIndexOf(".");
    U(T !== -1 ? f.slice(0, T) : f);
  }, []), P = S(
    (a, f) => {
      const E = `${Ie(M)}.${f}`, B = n.filter((O) => O.nodeId !== a).map((O) => O.filename), H = fe(E, B);
      r(a, H), z(null);
    },
    [M, n, r]
  ), _ = S(
    (a) => {
      a.key === "Enter" && R();
    },
    [R]
  ), $ = S(
    (a, f, T) => {
      a.key === "Enter" && P(f, T);
    },
    [P]
  );
  return /* @__PURE__ */ g("div", { className: "figma-plugin-section", children: [
    /* @__PURE__ */ c("label", { className: "figma-plugin-label", children: "Assets" }),
    e && /* @__PURE__ */ g("div", { className: "figma-plugin-asset-input-row", children: [
      /* @__PURE__ */ c(
        "input",
        {
          className: "figma-plugin-input",
          type: "text",
          placeholder: "Paste Figma element URL to add asset...",
          value: h,
          onChange: (a) => {
            C(a.target.value), x(null);
          },
          onKeyDown: _,
          disabled: u
        }
      ),
      /* @__PURE__ */ c(
        "button",
        {
          className: "figma-plugin-asset-add-btn",
          onClick: R,
          disabled: u || !h.trim(),
          children: "Add"
        }
      )
    ] }),
    I && /* @__PURE__ */ c("div", { className: "figma-plugin-error", children: I }),
    !e && /* @__PURE__ */ c("div", { className: "figma-plugin-hint", children: "Paste a design URL above first, then add assets here" }),
    n.length > 0 && /* @__PURE__ */ g(oe, { children: [
      /* @__PURE__ */ g("div", { className: "figma-plugin-asset-list-header", children: [
        /* @__PURE__ */ g("span", { children: [
          n.length,
          " asset",
          n.length !== 1 ? "s" : ""
        ] }),
        /* @__PURE__ */ c(
          "button",
          {
            className: "figma-plugin-asset-clear-btn",
            onClick: t,
            disabled: u,
            children: "Clear all"
          }
        )
      ] }),
      n.map((a) => /* @__PURE__ */ g("div", { className: "figma-plugin-asset-row", children: [
        a.status === "resolving" && /* @__PURE__ */ c("span", { className: "figma-plugin-asset-status-resolving", children: /* @__PURE__ */ c(
          "span",
          {
            className: "figma-plugin-spinner",
            style: { width: 12, height: 12, borderWidth: "1.5px" }
          }
        ) }),
        a.status === "valid" && /* @__PURE__ */ c("span", { className: "figma-plugin-asset-status-valid", children: "✓" }),
        a.status === "error" && /* @__PURE__ */ c("span", { className: "figma-plugin-asset-status-error", title: a.error, children: "✗" }),
        /* @__PURE__ */ c(
          "span",
          {
            className: "figma-plugin-format-badge",
            onClick: () => !u && a.status === "valid" && l(a),
            title: a.status === "valid" ? "Click to toggle PNG/SVG" : a.format.toUpperCase(),
            style: { opacity: a.status === "valid" ? 1 : 0.5 },
            children: a.format
          }
        ),
        L === a.nodeId ? /* @__PURE__ */ c(
          "input",
          {
            className: "figma-plugin-asset-edit-input",
            value: M,
            onChange: (f) => U(f.target.value),
            onBlur: () => P(a.nodeId, a.format),
            onKeyDown: (f) => $(f, a.nodeId, a.format),
            autoFocus: !0
          }
        ) : /* @__PURE__ */ c(
          "span",
          {
            className: "figma-plugin-asset-filename",
            onClick: () => a.status === "valid" && !u && y(a.nodeId, a.filename),
            title: a.status === "valid" ? `Click to rename (${a.nodeName})` : a.error || "Resolving...",
            children: a.status === "resolving" ? `Resolving ${a.nodeId}...` : a.status === "error" ? a.error || "Failed to resolve" : a.filename || a.nodeId
          }
        ),
        a.warning && /* @__PURE__ */ c("span", { className: "figma-plugin-asset-warning", title: a.warning, children: "⚠" }),
        /* @__PURE__ */ c(
          "button",
          {
            className: "figma-plugin-asset-remove-btn",
            onClick: () => o(a.nodeId),
            disabled: u,
            title: "Remove asset",
            children: "×"
          }
        )
      ] }, a.nodeId))
    ] })
  ] });
}
const we = 12e3;
function At(e) {
  return Math.ceil(e.length / 4);
}
function Rt(e) {
  const { extraction: n, exportResult: i, projectPath: o } = e, t = n.tokens, r = /* @__PURE__ */ new Map();
  for (const I of i.assets)
    I.nodeId && r.set(I.nodeId, I.filename), I.parentInstanceId && !r.has(I.parentInstanceId) && r.set(I.parentInstanceId, I.filename);
  const s = e.rootNodes ?? n.extraction.rootNodes, d = bt(s), p = [
    St(e),
    Et(),
    Lt(i.previewPath, o),
    Pt(n.extraction.rootNodes, r),
    Bt(t),
    Gt(t.components),
    Vt(i.previewPath, i.assets, o, d)
  ].filter(Boolean).join(`

`), w = p.length, h = At(p), C = {
    nodeCount: n.extraction.nodeCount,
    colorCount: t.colors.length,
    fontCount: t.typography.length,
    assetCount: i.assets.length,
    estimatedTokens: h
  };
  return {
    markdown: p,
    charCount: w,
    estimatedTokens: h,
    stats: C
  };
}
function St(e) {
  var s;
  const { extraction: n, fileName: i, figmaUrl: o } = e, t = ((s = n.extraction.rootNodes[0]) == null ? void 0 : s.name) ?? "Untitled", r = e.date ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  return [
    "# Design Brief",
    "",
    `**File:** ${i}`,
    `**Frame:** ${t}`,
    `**Extracted:** ${r}`,
    `**Figma URL:** ${o}`
  ].join(`
`);
}
function Et() {
  return [
    "## How to Use This Brief",
    "",
    "**Before building:** Read this brief fully. Plan your approach and ask clarifying questions before writing any code.",
    "**During building:** Use only the assets listed in the Assets section below -- if an asset is missing, ask the user rather than substituting or fabricating a replacement.",
    "**After building:** Compare your result against the Preview image above and verify that all design tokens and assets are correctly applied."
  ].join(`
`);
}
function Lt(e, n) {
  return e ? `## Preview

![Preview](${pe(e, n)})` : "";
}
function Pt(e, n) {
  const i = [];
  for (const o of e)
    Se(o, 0, i, n);
  return i.length === 0 ? "" : `## Layout Tree

` + i.join(`
`);
}
function Se(e, n, i, o) {
  if (e.visible !== !1 && (i.push(Mt(e, n, o)), !e.componentRef && e.children))
    for (const t of e.children)
      Se(t, n + 1, i, o);
}
function Ft(e) {
  return e.charAt(0).toUpperCase() + e.slice(1).toLowerCase();
}
function Ee(e) {
  return /Property\s+\d+=/i.test(e) ? e.split(",").map((n) => {
    const i = n.indexOf("=");
    if (i !== -1) {
      const o = n.slice(0, i).trim(), t = n.slice(i + 1).trim();
      if (/^Property\s+\d+$/i.test(o)) return t;
    }
    return n.trim();
  }).join(", ") : e;
}
function Mt(e, n, i) {
  const o = "  ".repeat(n), t = [];
  if (e.componentRef) {
    let d = `Instance "${Ee(e.componentRef.componentName)}"`;
    if (e.repeatCount && e.repeatCount > 1 && (d += ` x${e.repeatCount} (repeated)`), e.componentRef.variantProperties && Object.keys(e.componentRef.variantProperties).length > 0) {
      const p = Object.entries(e.componentRef.variantProperties).map(([w, h]) => /^Property\s+\d+$/i.test(w) ? String(h) : `${w}: ${h}`).join(", ");
      d += ` (${p})`;
    }
    const u = i == null ? void 0 : i.get(e.id);
    u && (d += ` -> ${u}`), t.push(d);
  } else if (e.type === "TEXT") {
    const s = e.textContent ?? "", d = s.length > 200 ? s.slice(0, 200) + "..." : s;
    let u = "";
    e.textStyle && (u = ` (${e.textStyle.fontFamily} ${e.textStyle.fontSize}/${e.textStyle.fontWeight})`), t.push(`Text '${d}'${u}`);
  } else
    t.push(`${Ft(e.type)} '${e.name}'`);
  if (e.autoLayout) {
    const s = e.autoLayout, d = [s.flexDirection];
    s.gap > 0 && d.push(`gap: ${s.gap}`), s.justifyContent !== "flex-start" && d.push(`justify: ${s.justifyContent}`), s.alignItems !== "flex-start" && d.push(`align: ${s.alignItems}`);
    const u = Ut(s.padding);
    u && d.push(u), s.flexWrap === "wrap" && d.push("wrap"), t.push(`(${d.join(", ")})`);
  }
  e.width != null && e.height != null && t.push(`${Math.round(e.width)}x${Math.round(e.height)}`), e.positioning === "ABSOLUTE" && (e.absoluteOffset ? t.push(`[absolute] top:${e.absoluteOffset.top} left:${e.absoluteOffset.left}`) : t.push("[absolute]"));
  const r = Ot(e);
  return r && t.push(r), `${o}${t.join(" ")}`;
}
function ue(e) {
  if (!e) return null;
  for (const n of e)
    if (n.visible !== !1 && n.type === "SOLID" && n.color) {
      const i = n.opacity ?? 1, o = { ...n.color, a: (n.color.a ?? 1) * i };
      return q(o);
    }
  return null;
}
function Ot(e) {
  var i;
  const n = [];
  if (e.widthMode === "FILL" && n.push("w:fill"), e.heightMode === "FILL" && n.push("h:fill"), e.widthMode === "HUG" && n.push("w:hug"), e.heightMode === "HUG" && n.push("h:hug"), e.type !== "TEXT") {
    const o = ue(e.fills);
    o && o !== "#ffffff" && o !== "#000000" ? n.push(`bg:${o}`) : o && n.push(`bg:${o}`);
  }
  if (e.type === "TEXT") {
    const o = ue(e.fills);
    o && n.push(`color:${o}`);
  }
  if (e.cornerRadius && e.cornerRadius > 0 && n.push(`r:${Math.round(e.cornerRadius)}`), e.strokeWeight && e.strokeWeight > 0 && ((i = e.strokes) != null && i.length)) {
    const o = ue(e.strokes);
    o && n.push(`border:${e.strokeWeight}px ${o}`);
  }
  return e.layoutGrow === 1 && n.push("flex-grow:1"), e.layoutAlign === "STRETCH" && n.push("align-self:stretch"), e.opacity != null && e.opacity < 1 && n.push(`opacity:${e.opacity.toFixed(2)}`), n.length === 0 ? null : `{${n.join(" ")}}`;
}
function Ut(e) {
  return e.top === 0 && e.right === 0 && e.bottom === 0 && e.left === 0 ? null : e.top === e.bottom && e.left === e.right && e.top === e.left ? `padding: ${e.top}` : e.top === e.bottom && e.left === e.right ? `padding: ${e.top} ${e.left}` : `padding: ${e.top} ${e.right} ${e.bottom} ${e.left}`;
}
function Bt(e) {
  const n = [];
  return e.colors.length > 0 && n.push(zt(e.colors)), e.gradients.length > 0 && n.push(Ht(e.gradients)), e.typography.length > 0 && n.push(Wt(e.typography)), e.spacing.length > 0 && n.push(_t(e.spacing)), e.borders.length > 0 && n.push(Dt(e.borders)), e.shadows.length > 0 && n.push(jt(e.shadows)), n.length === 0 ? "" : `## Design Tokens

` + n.join(`

`);
}
function zt(e) {
  return [
    "### Colors",
    "",
    "| Name | Value | Usage |",
    "|------|-------|-------|",
    ...e.map((i) => `| ${i.name} | ${i.value} | ${i.usageCount} |`)
  ].join(`
`);
}
function Ht(e) {
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
      const o = i.lineHeight !== null ? `${i.lineHeight}px` : "auto";
      return `| ${i.name} | ${i.fontFamily} | ${i.fontSize}px | ${i.fontWeight} | ${o} |`;
    })
  ].join(`
`);
}
function _t(e) {
  return [
    "### Spacing",
    "",
    "| Value | Sources | Usage |",
    "|-------|---------|-------|",
    ...e.map((i) => `| ${i.value}px | ${i.sources.join(", ")} | ${i.usageCount} |`)
  ].join(`
`);
}
function Dt(e) {
  return [
    "### Borders",
    "",
    "| Name | Radius | Stroke | Usage |",
    "|------|--------|--------|-------|",
    ...e.map((i) => {
      const o = i.radius !== null ? `${i.radius}px` : i.cornerRadii ? i.cornerRadii.map((r) => `${r}px`).join(" ") : "--", t = i.strokeWeight !== null && i.strokeColor !== null ? `${i.strokeWeight}px ${i.strokeColor}` : "--";
      return `| ${i.name} | ${o} | ${t} | ${i.usageCount} |`;
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
      const o = `${i.offsetX}px ${i.offsetY}px ${i.blur}px ${i.spread}px ${i.color}`;
      return `| ${i.name} | ${i.type} | ${o} | ${i.usageCount} |`;
    })
  ].join(`
`);
}
function Gt(e) {
  return e.length === 0 ? "" : [
    "## Components",
    "",
    "| Component | Source | Variants | Usage |",
    "|-----------|--------|----------|-------|",
    ...e.map((i) => {
      const o = Ee(i.componentName), t = i.variantProperties && Object.keys(i.variantProperties).length > 0 ? Object.entries(i.variantProperties).map(([r, s]) => /^Property\s+\d+$/i.test(r) ? String(s) : `${r}: ${s}`).join(", ") : "--";
      return `| ${o} | ${i.source} | ${t} | ${i.usageCount} |`;
    })
  ].join(`
`);
}
function Vt(e, n, i, o) {
  if (!e && n.length === 0) return "";
  const t = [];
  if (e) {
    const r = pe(e, i), s = r.split("/").pop() ?? r;
    t.push(`| ${s} | Preview | -- | ${r} |`);
  }
  for (const r of n) {
    const s = pe(r.path, i), d = Kt(r.assetType);
    let u = "--";
    r.nodeId && (u = o.get(r.nodeId) || r.parentInstanceId && o.get(r.parentInstanceId) || "--"), t.push(`| ${r.filename} | ${d} | ${u} | ${s} |`);
  }
  return [
    "## Assets",
    "",
    "| File | Type | Location | Path |",
    "|------|------|----------|------|",
    ...t
  ].join(`
`);
}
function Kt(e) {
  switch (e) {
    case "icon":
      return "Icon";
    case "image":
      return "Image";
    default:
      return "File";
  }
}
function pe(e, n) {
  return e.startsWith(n + "/") ? e.slice(n.length + 1) : e;
}
async function Xt(e, n, i) {
  const o = `${n}/brief.md`, t = btoa(unescape(encodeURIComponent(i))), r = await e.exec("bash", [
    "-c",
    `echo '${t}' | base64 -d > '${o}'`
  ]);
  if (r.exit_code !== 0)
    throw new Error(`Failed to save brief: ${r.stderr}`);
}
async function Zt(e, n) {
  const i = btoa(unescape(encodeURIComponent(n))), o = await e.exec("bash", [
    "-c",
    `echo '${i}' | base64 -d | pbcopy`
  ]);
  if (o.exit_code !== 0)
    throw new Error(`Clipboard copy failed: ${o.stderr}`);
}
const qt = [
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
function Jt(e) {
  const n = { frames: 0, components: [], textNodes: 0, hiddenNodes: 0 }, i = /* @__PURE__ */ new Map();
  function o(t) {
    if (t.visible || n.hiddenNodes++, (t.type === "FRAME" || t.type === "GROUP" || t.type === "SECTION") && n.frames++, t.type === "TEXT" && n.textNodes++, t.componentRef) {
      const r = t.componentRef.componentName, s = t.repeatCount ?? 1;
      i.set(r, (i.get(r) ?? 0) + s);
    }
    t.children && t.children.forEach(o);
  }
  return e.forEach(o), n.components = Array.from(i.entries()).map(([t, r]) => ({ name: t, count: r })).sort((t, r) => r.count - t.count), n;
}
function Le({ nodes: e, depth: n = 0, maxDepth: i = 2 }) {
  return n >= i ? null : /* @__PURE__ */ c("div", { style: { paddingLeft: n > 0 ? "12px" : "0", borderLeft: n > 0 ? "1px solid var(--border)" : "none" }, children: e.map((o, t) => {
    const r = o.componentRef ? `<${o.componentRef.componentName}${o.repeatCount ? ` x${o.repeatCount}` : ""}>` : o.type === "TEXT" ? `"${(o.textContent ?? "").slice(0, 30)}${(o.textContent ?? "").length > 30 ? "..." : ""}"` : o.name, s = o.autoLayout ? `${o.autoLayout.flexDirection}` : o.type === "INSTANCE" ? "component" : o.type.toLowerCase();
    return /* @__PURE__ */ g("div", { style: { fontSize: "11px", lineHeight: 1.7 }, children: [
      /* @__PURE__ */ g("span", { style: { color: "var(--text-muted)" }, children: [
        s,
        " "
      ] }),
      /* @__PURE__ */ c("span", { style: { color: o.visible === !1 ? "var(--text-muted)" : "var(--text-primary)" }, children: r }),
      o.visible === !1 && /* @__PURE__ */ c("span", { style: { color: "var(--text-muted)", marginLeft: "4px" }, children: "(hidden)" }),
      o.children && o.children.length > 0 && n + 1 < i && /* @__PURE__ */ c(Le, { nodes: o.children, depth: n + 1, maxDepth: i }),
      o.children && o.children.length > 0 && n + 1 >= i && /* @__PURE__ */ g("span", { style: { color: "var(--text-muted)", fontSize: "11px", marginLeft: "12px" }, children: [
        "(",
        o.children.length,
        " children)"
      ] })
    ] }, o.id || t);
  }) });
}
function Yt({ token: e }) {
  const n = re(), i = (n == null ? void 0 : n.shell) ?? null, o = (n == null ? void 0 : n.actions) ?? null, [t, r] = A(""), [s, d] = A(null), u = s != null && s.nodeId ? "node" : "page", [p, w] = A(null), [h, C] = A(!1), [I, x] = A(null), [L, z] = A(!1), [M, U] = A(null), [b, R] = A(null), [l, y] = A(!1), [P, _] = A(!1), [$, a] = A(!1), [f, T] = A(null), [E, B] = A(null), [H, O] = A(!1), [F, j] = A(null), [me, J] = A(null), [K, V] = A([]), [he, ye] = A("best"), Pe = S((m) => {
    V((N) => [...N, m]);
  }, []), Fe = S((m) => {
    V((N) => N.filter((v) => v.nodeId !== m));
  }, []), Me = S(() => {
    V([]);
  }, []), Oe = S((m, N) => {
    V((v) => v.map(
      (k) => k.nodeId === m ? { ...k, filename: N } : k
    ));
  }, []), Ue = S((m, N) => {
    V((v) => v.map(
      (k) => k.nodeId === m ? N : k
    ));
  }, []), Be = S((m, N, v) => {
    V((k) => k.map(
      (G) => G.nodeId === m ? { ...G, format: N, filename: v } : G
    ));
  }, []), Y = Ve(
    () => M ? Jt(M.rootNodes) : null,
    [M]
  ), X = Q(null), D = Q(i);
  D.current = i;
  const se = Q(0), te = Q(0), ne = S(async (m) => {
    var N, v;
    if (!(!D.current || !s)) {
      a(!0), T(null), B(null);
      try {
        const k = await vt({
          shell: D.current,
          token: e,
          fileKey: m.fileKey,
          selectedNodeId: s.nodeId || ((N = m.extraction.rootNodes[0]) == null ? void 0 : N.id) || "0:0",
          projectPath: ((v = n == null ? void 0 : n.project) == null ? void 0 : v.path) ?? ".",
          manualAssets: K,
          onProgress: T
        });
        if (B(k), o) {
          const G = k.assets.length, W = k.warnings.length, ae = `Exported ${G} asset${G !== 1 ? "s" : ""}${W > 0 ? ` (${W} warning${W !== 1 ? "s" : ""})` : ""}`;
          o.showToast(ae, W > 0 ? "info" : "success");
        }
        O(!0), j(null), J(null), setTimeout(() => {
          var G;
          try {
            const W = Rt({
              extraction: m,
              exportResult: k,
              projectPath: ((G = n == null ? void 0 : n.project) == null ? void 0 : G.path) ?? ".",
              fileName: (p == null ? void 0 : p.name) ?? "Untitled",
              figmaUrl: t,
              rootNodes: m.extraction.rootNodes
            });
            j(W), O(!1), D.current && Xt(D.current, k.assetsDir, W.markdown).catch((ae) => {
              console.error("Brief save failed:", ae);
            }), o && o.showToast(
              `Brief ready: ${W.stats.nodeCount} layers, ${W.stats.assetCount} assets, ~${Math.round(W.stats.estimatedTokens / 1e3)}K tokens`,
              "success"
            );
          } catch (W) {
            J((W == null ? void 0 : W.message) || "Brief generation failed"), O(!1);
          }
        }, 0);
      } catch (k) {
        o && o.showToast(`Asset export failed: ${(k == null ? void 0 : k.message) || "Unknown error"}`, "error");
      } finally {
        a(!1), T(null);
      }
    }
  }, [e, s, n, o, p, t, K]), ze = S(
    (m) => {
      const N = m.target.value;
      if (r(N), !N.trim()) {
        d(null), w(null), x(null), C(!1), U(null), R(null), y(!1), _(!1), X.current = null, B(null), a(!1), T(null), j(null), O(!1), J(null), V([]);
        return;
      }
      const v = ke(N);
      if (!v) {
        d(null), w(null), x("Please paste a valid Figma URL (file, design, proto, or board link)"), C(!1);
        return;
      }
      d(v), x(null), w(null), U(null), R(null), y(!1), _(!1), X.current = null, B(null), a(!1), T(null), j(null), O(!1), J(null), V([]);
    },
    []
  );
  ie(() => {
    if (!s || !D.current) return;
    const m = ++se.current, N = D.current;
    C(!0), w(null), x(null), (async () => {
      try {
        const v = await qe(N, e, s.fileKey);
        se.current === m && (w(v), C(!1));
      } catch (v) {
        if (se.current === m) {
          const k = (v == null ? void 0 : v.message) || "Failed to validate file access.";
          k.includes("403") || k.includes("Invalid or expired") ? x("Cannot access this file. Check that your token has File content (Read) scope.") : k.includes("404") || k.includes("not found") ? x("File not found. Check that the URL is correct.") : k.includes("429") || k.includes("Rate limited") ? x("Rate limited by Figma. Please wait a moment and try again.") : x(k), C(!1);
        }
      }
    })();
  }, [s, e]);
  const He = S(() => {
    const m = D.current;
    if (!m || !s) return;
    const N = ++te.current;
    z(!0), U(null), x(null), R(null), y(!1), X.current = null, B(null), a(!1), T(null), j(null), O(!1), J(null), (async () => {
      try {
        const v = await ht({
          shell: m,
          token: e,
          fileKey: s.fileKey,
          nodeId: s.nodeId,
          scope: u
        });
        if (te.current !== N) return;
        if (v.largeTreeWarning) {
          X.current = v, R(v.largeTreeWarning), y(!0), z(!1);
          return;
        }
        U(v.extraction), o && o.showToast(`Extracted ${v.extraction.nodeCount} layers`, "success"), ne(v);
      } catch (v) {
        if (te.current !== N) return;
        const k = (v == null ? void 0 : v.message) || "Extraction failed.";
        k.includes("403") || k.includes("Invalid or expired") ? x("Cannot access this file. Check that your token has File content (Read) scope.") : k.includes("404") || k.includes("not found") ? x("File not found. Check that the URL is correct.") : k.includes("429") || k.includes("Rate limited") ? x("Rate limited by Figma. Please wait a moment and try again.") : k.includes("timeout") || k.includes("timed out") ? x("Request timed out. Try a smaller selection or check your connection.") : x(k);
      } finally {
        te.current === N && z(!1);
      }
    })();
  }, [s, e, u, o, ne]), We = S(() => {
    const m = X.current;
    m && (y(!1), R(null), U(m.extraction), X.current = null, o && o.showToast(`Extracted ${m.extraction.nodeCount} layers`, "success"), ne(m));
  }, [o, ne]), _e = S(() => {
    y(!1), R(null), X.current = null;
  }, []), De = S(async () => {
    if (!(!F || !D.current))
      try {
        await Zt(D.current, F.markdown), o && o.showToast("Brief copied to clipboard", "success");
      } catch (m) {
        o && o.showToast(`Copy failed: ${(m == null ? void 0 : m.message) || "Unknown error"}`, "error");
      }
  }, [F, o]), je = K.some((m) => m.status === "resolving"), Ge = !s || !p || h || L || $ || H || je;
  return /* @__PURE__ */ g("div", { children: [
    /* @__PURE__ */ g("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ c("label", { className: "figma-plugin-label", children: "Figma URL" }),
      /* @__PURE__ */ c(
        "input",
        {
          className: "figma-plugin-input",
          type: "text",
          placeholder: "https://www.figma.com/design/...",
          value: t,
          onChange: ze
        }
      ),
      I && /* @__PURE__ */ c("div", { className: "figma-plugin-error", children: I })
    ] }),
    s && /* @__PURE__ */ c("div", { className: "figma-plugin-section", children: /* @__PURE__ */ g("div", { className: "figma-plugin-file-info", children: [
      h && /* @__PURE__ */ g("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: p ? "8px" : "0" }, children: [
        /* @__PURE__ */ c("span", { className: "figma-plugin-spinner" }),
        /* @__PURE__ */ c("span", { style: { color: "var(--text-secondary)" }, children: "Checking access..." })
      ] }),
      p && /* @__PURE__ */ g("div", { style: { marginBottom: "8px" }, children: [
        /* @__PURE__ */ c("div", { style: { fontWeight: 600, fontSize: "13px", marginBottom: "4px" }, children: p.name }),
        /* @__PURE__ */ g("div", { style: { color: "var(--text-secondary)" }, children: [
          p.pages.length,
          " page",
          p.pages.length !== 1 ? "s" : ""
        ] })
      ] }),
      !h && /* @__PURE__ */ g("div", { style: { color: "var(--text-muted)", lineHeight: 1.6 }, children: [
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
    s && p && !h && /* @__PURE__ */ c("div", { className: "figma-plugin-section", children: /* @__PURE__ */ c("div", { style: { color: "var(--text-secondary)", fontSize: "12px" }, children: s.nodeId ? "Will extract the selected element" : "Will extract the whole page — select a specific element in Figma to narrow scope" }) }),
    s && p && !h && !F && /* @__PURE__ */ g("div", { className: "figma-plugin-mode-section", children: [
      /* @__PURE__ */ c("span", { className: "figma-plugin-mode-label", children: "Brief mode" }),
      /* @__PURE__ */ c("div", { className: "figma-plugin-mode-group", children: qt.map((m) => /* @__PURE__ */ g(
        "div",
        {
          className: `figma-plugin-mode-card${he === m.id ? " selected" : ""}`,
          onClick: () => ye(m.id),
          role: "radio",
          "aria-checked": he === m.id,
          tabIndex: 0,
          onKeyDown: (N) => {
            (N.key === "Enter" || N.key === " ") && (N.preventDefault(), ye(m.id));
          },
          children: [
            /* @__PURE__ */ c("div", { className: "figma-plugin-mode-card-name", children: m.name }),
            /* @__PURE__ */ c("div", { className: "figma-plugin-mode-card-desc", children: m.description })
          ]
        },
        m.id
      )) })
    ] }),
    s && p && !h && i && /* @__PURE__ */ c(
      Tt,
      {
        designFileKey: s.fileKey,
        assets: K,
        onAdd: Pe,
        onRemove: Fe,
        onClear: Me,
        onRename: Oe,
        onResolved: Ue,
        onFormatChange: Be,
        disabled: L || $ || H,
        shell: i,
        token: e
      }
    ),
    l && b && /* @__PURE__ */ c("div", { className: "figma-plugin-section", children: /* @__PURE__ */ g("div", { className: "figma-plugin-warning", children: [
      /* @__PURE__ */ g("strong", { children: [
        b.nodeCount,
        " layers detected"
      ] }),
      /* @__PURE__ */ c("p", { children: "Large selections may take longer and produce verbose output. Continue?" }),
      /* @__PURE__ */ g("div", { className: "figma-plugin-warning-actions", children: [
        /* @__PURE__ */ c("button", { className: "btn-primary", onClick: We, children: "Continue" }),
        /* @__PURE__ */ c("button", { className: "btn-secondary", onClick: _e, children: "Cancel" })
      ] })
    ] }) }),
    me && /* @__PURE__ */ c("div", { className: "figma-plugin-section", children: /* @__PURE__ */ c("div", { className: "figma-plugin-error", children: me }) }),
    F && M && Y && E && /* @__PURE__ */ c("div", { className: "figma-plugin-section", children: /* @__PURE__ */ g("div", { className: "figma-plugin-file-info", children: [
      /* @__PURE__ */ g("div", { style: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }, children: [
        /* @__PURE__ */ c("span", { style: { color: "#38a169" }, children: "✓" }),
        /* @__PURE__ */ c("span", { style: { fontWeight: 600, fontSize: "13px" }, children: "Brief ready" }),
        M.truncated && /* @__PURE__ */ c("span", { style: { color: "#f59e0b", fontSize: "11px" }, children: "(truncated)" })
      ] }),
      /* @__PURE__ */ c(
        "button",
        {
          className: "btn-primary",
          onClick: De,
          style: { width: "100%", marginBottom: "12px" },
          children: "Copy Brief to Clipboard"
        }
      ),
      /* @__PURE__ */ g("div", { style: { color: "var(--text-secondary)", fontSize: "12px", lineHeight: 1.6 }, children: [
        F.stats.nodeCount,
        " layers ·",
        " ",
        F.stats.assetCount,
        " assets ·",
        " ",
        /* @__PURE__ */ g("span", { style: {
          color: F.stats.estimatedTokens > we ? "#f59e0b" : "inherit"
        }, children: [
          "~",
          Math.round(F.stats.estimatedTokens / 1e3),
          "K tokens"
        ] })
      ] }),
      F.stats.estimatedTokens > we && /* @__PURE__ */ g("div", { className: "figma-plugin-warning", style: { marginTop: "8px" }, children: [
        /* @__PURE__ */ c("strong", { children: "This brief is large" }),
        /* @__PURE__ */ c("p", { children: "Consider extracting a smaller section for better results." })
      ] }),
      Y.components.length > 0 && /* @__PURE__ */ g("div", { style: { marginTop: "10px" }, children: [
        /* @__PURE__ */ c("div", { style: { color: "var(--text-muted)", fontSize: "11px", marginBottom: "4px" }, children: "Components" }),
        /* @__PURE__ */ g("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px" }, children: [
          Y.components.slice(0, 8).map((m) => /* @__PURE__ */ g(
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
                m.name,
                m.count > 1 ? ` x${m.count}` : ""
              ]
            },
            m.name
          )),
          Y.components.length > 8 && /* @__PURE__ */ g("span", { style: { fontSize: "11px", color: "var(--text-muted)", padding: "2px 4px" }, children: [
            "+",
            Y.components.length - 8,
            " more"
          ] })
        ] })
      ] }),
      E.warnings.length > 0 && (() => {
        const N = Array.from(E.warnings).map(
          (v) => typeof v == "string" ? v : JSON.stringify(v)
        );
        return N.length > 0 ? /* @__PURE__ */ g("div", { style: { marginTop: "8px", fontSize: "11px", color: "#f59e0b" }, children: [
          N.length,
          " warning",
          N.length !== 1 ? "s" : "",
          ":",
          /* @__PURE__ */ g("ul", { style: { margin: "4px 0 0 16px", padding: 0 }, children: [
            N.slice(0, 5).map((v, k) => /* @__PURE__ */ c("li", { children: v }, k)),
            N.length > 5 && /* @__PURE__ */ g("li", { children: [
              "...and ",
              N.length - 5,
              " more"
            ] })
          ] })
        ] }) : null;
      })(),
      /* @__PURE__ */ c(
        "button",
        {
          onClick: () => _(!P),
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
      P && /* @__PURE__ */ c("div", { style: { marginTop: "6px", padding: "8px", background: "var(--bg-primary)", borderRadius: "4px", border: "1px solid var(--border)", maxHeight: "200px", overflowY: "auto" }, children: /* @__PURE__ */ c(Le, { nodes: M.rootNodes }) }),
      /* @__PURE__ */ c("div", { style: { color: "var(--text-muted)", fontSize: "11px", marginTop: "8px", textAlign: "center" }, children: "Also saved to .shipstudio/assets/brief.md" })
    ] }) }),
    (() => {
      const m = L || $ || H, N = L ? "Extracting layout..." : $ ? (f == null ? void 0 : f.phase) === "preview" ? "Rendering preview..." : `Exporting assets${f != null && f.total ? ` (${f.current ?? 0}/${f.total})` : ""}...` : H ? "Generating brief..." : F ? "Get New Brief" : K.filter((v) => v.status === "valid").length > 0 ? `Get Brief (${K.filter((v) => v.status === "valid").length} asset${K.filter((v) => v.status === "valid").length !== 1 ? "s" : ""})` : "Get Brief";
      return /* @__PURE__ */ g(
        "button",
        {
          className: F && !m ? "btn-secondary" : "btn-primary",
          onClick: He,
          disabled: Ge,
          style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
          children: [
            m && /* @__PURE__ */ c("span", { className: "figma-plugin-spinner", style: { width: "14px", height: "14px", borderWidth: "2px" } }),
            N
          ]
        }
      );
    })()
  ] });
}
function Qt({ onClick: e }) {
  return /* @__PURE__ */ c(
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
            /* @__PURE__ */ c("circle", { cx: "12", cy: "12", r: "3" }),
            /* @__PURE__ */ c("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" })
          ]
        }
      )
    }
  );
}
function en() {
  const e = re(), n = (e == null ? void 0 : e.storage) ?? null, i = (e == null ? void 0 : e.actions) ?? null, [o, t] = A(!1), [r, s] = A(null), [d, u] = A(null), [p, w] = A(!1), [h, C] = A("main");
  ie(() => {
    if (!n) return;
    let l = !1;
    return (async () => {
      try {
        const y = await n.read();
        !l && typeof y.figmaToken == "string" && (s(y.figmaToken), typeof y.figmaUserHandle == "string" && u({ id: "", handle: y.figmaUserHandle, img_url: "" }));
      } catch (y) {
        console.error("[figma] Failed to read storage:", y);
      } finally {
        l || w(!0);
      }
    })(), () => {
      l = !0;
    };
  }, [n]);
  const I = S(() => t(!0), []), x = S(() => {
    t(!1), C("main");
  }, []), L = S(async (l, y) => {
    if (!(!n || !i))
      try {
        const P = await n.read();
        await n.write({ ...P, figmaToken: l, figmaUserHandle: y.handle }), s(l), u(y), C("main"), i.showToast(`Connected as ${y.handle}`, "success");
      } catch {
        i.showToast("Failed to save token. Please try again.", "error");
      }
  }, [n, i]), z = S(async (l, y) => {
    if (!(!n || !i))
      try {
        const P = await n.read();
        await n.write({ ...P, figmaToken: l, figmaUserHandle: y.handle }), s(l), u(y), C("main"), i.showToast(`Token updated — connected as ${y.handle}`, "success");
      } catch {
        i.showToast("Failed to save token. Please try again.", "error");
      }
  }, [n, i]), M = S(async () => {
    if (!(!n || !i))
      try {
        const l = await n.read(), { figmaToken: y, figmaUserHandle: P, ..._ } = l;
        await n.write(_), s(null), u(null), C("main"), i.showToast("Disconnected from Figma", "info");
      } catch {
        i.showToast("Failed to remove token. Please try again.", "error");
      }
  }, [n, i]), U = "Figma", b = r ? /* @__PURE__ */ c(Qt, { onClick: () => C("settings") }) : void 0;
  let R = null;
  return p && (r ? h === "settings" && d ? R = /* @__PURE__ */ c(
    Qe,
    {
      currentUser: d,
      onTokenUpdated: z,
      onTokenRemoved: M,
      onBack: () => C("main")
    }
  ) : R = /* @__PURE__ */ c(Yt, { token: r }) : R = /* @__PURE__ */ c(Ye, { onTokenSaved: L })), /* @__PURE__ */ g(oe, { children: [
    /* @__PURE__ */ c(
      "button",
      {
        onClick: I,
        title: "Figma Design Brief",
        className: "toolbar-icon-btn",
        children: /* @__PURE__ */ c(
          "svg",
          {
            width: "14",
            height: "14",
            viewBox: "0 0 15 15",
            fill: "currentColor",
            children: /* @__PURE__ */ c(
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
    /* @__PURE__ */ c(
      Xe,
      {
        open: o,
        onClose: x,
        title: U,
        headerRight: b,
        children: R
      }
    )
  ] });
}
const on = "Figma", rn = {
  toolbar: en
};
function sn() {
  console.log("[figma] Plugin activated");
}
function an() {
  console.log("[figma] Plugin deactivated");
}
export {
  on as name,
  sn as onActivate,
  an as onDeactivate,
  rn as slots
};
