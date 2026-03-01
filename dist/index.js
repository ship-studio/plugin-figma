import { jsx as c, jsxs as m, Fragment as re } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;function j(t,p,k){if(k!==undefined&&p){p=Object.assign({},p);p.key=k}return R.createElement(t,p)}export const jsx=j;export const jsxs=j;export const Fragment=R.Fragment;";
import { useEffect as oe, useCallback as S, useState as A, useRef as ee, useMemo as Xe } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export default R;export const{useState,useEffect,useCallback,useRef,useMemo,useContext,createContext,createElement,Fragment}=R;";
const ve = window;
function se() {
  const e = ve.__SHIPSTUDIO_REACT__, t = ve.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__;
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
function qe({ open: e, onClose: t, title: i, headerRight: o, children: n }) {
  oe(() => {
    if (!e) return;
    let s = document.getElementById(de);
    return s || (s = document.createElement("style"), s.id = de, s.textContent = Ze, document.head.appendChild(s)), () => {
      const d = document.getElementById(de);
      d && d.remove();
    };
  }, [e]), oe(() => {
    if (!e) return;
    const s = (d) => {
      d.key === "Escape" && t();
    };
    return document.addEventListener("keydown", s), () => document.removeEventListener("keydown", s);
  }, [e, t]);
  const r = S(
    (s) => {
      s.target === s.currentTarget && t();
    },
    [t]
  );
  return e ? /* @__PURE__ */ c("div", { className: "figma-plugin-overlay", onClick: r, children: /* @__PURE__ */ m("div", { className: "figma-plugin-modal", children: [
    /* @__PURE__ */ m("div", { className: "figma-plugin-modal-header", children: [
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
    /* @__PURE__ */ c("div", { className: "figma-plugin-modal-body", children: n })
  ] }) }) : null;
}
const Je = "https://api.figma.com/v1";
async function te(e, t, i, o) {
  const n = `${Je}${t}`, r = Math.ceil(((o == null ? void 0 : o.timeout) ?? 3e4) / 1e3), s = [
    "-sS",
    "--max-time",
    String(r),
    "-H",
    `X-Figma-Token: ${i}`,
    n
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
async function $e(e, t) {
  return te(e, "/me", t);
}
async function Ye(e, t, i) {
  const o = await te(e, `/files/${i}?depth=1`, t);
  return {
    name: o.name,
    pages: o.document.children.filter((n) => n.type === "CANVAS").map((n) => ({ id: n.id, name: n.name }))
  };
}
async function ke(e, t, i, o) {
  const n = await te(
    e,
    `/files/${i}/nodes?ids=${encodeURIComponent(o)}`,
    t,
    { timeout: 12e4 }
  ), r = n.nodes[o];
  if (!r) {
    const s = Object.keys(n.nodes), d = s.find(
      (u) => u.replace(/%3A/g, ":") === o || u === o.replace(/:/g, "%3A")
    );
    if (d)
      return {
        rootNode: n.nodes[d].document,
        components: n.nodes[d].components,
        styles: n.nodes[d].styles ?? {}
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
async function Qe(e, t, i) {
  const o = await te(
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
async function ue(e, t, i, o, n = "png", r) {
  const s = o.map((f) => encodeURIComponent(f)).join(",");
  let d = `/images/${i}?ids=${s}&format=${n}`;
  return r != null && (d += `&scale=${r}`), n === "svg" && (d += "&svg_outline_text=true&svg_include_id=true&svg_simplify_stroke=true"), (await te(
    e,
    d,
    t,
    { timeout: 12e4 }
  )).images;
}
function et({ onTokenSaved: e }) {
  const t = se(), i = (t == null ? void 0 : t.shell) ?? null, [o, n] = A(""), [r, s] = A(!1), [d, u] = A(null), f = S(async () => {
    if (!i) return;
    const h = o.trim();
    if (!(!h || r)) {
      s(!0), u(null);
      try {
        const C = await $e(i, h);
        e(h, C);
      } catch (C) {
        u((C == null ? void 0 : C.message) || "Failed to validate token. Please check and try again.");
      } finally {
        s(!1);
      }
    }
  }, [o, r, i, e]), w = S(
    (h) => {
      h.key === "Enter" && f();
    },
    [f]
  );
  return /* @__PURE__ */ m("div", { children: [
    /* @__PURE__ */ m("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ c("h3", { style: { fontSize: "14px", fontWeight: 600, margin: "0 0 8px 0" }, children: "Connect to Figma" }),
      /* @__PURE__ */ m("p", { style: { fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 16px 0", lineHeight: 1.5 }, children: [
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
    /* @__PURE__ */ m("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ c("label", { className: "figma-plugin-label", children: "Personal Access Token" }),
      /* @__PURE__ */ c(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: o,
          onChange: (h) => n(h.target.value),
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
        onClick: f,
        disabled: !o.trim() || r,
        style: { width: "100%", marginTop: "4px" },
        children: r ? /* @__PURE__ */ m(re, { children: [
          /* @__PURE__ */ c("span", { className: "figma-plugin-spinner", style: { marginRight: "8px", verticalAlign: "middle" } }),
          "Connecting..."
        ] }) : "Connect"
      }
    )
  ] });
}
function tt({ currentUser: e, onTokenUpdated: t, onTokenRemoved: i, onBack: o }) {
  const n = se(), r = (n == null ? void 0 : n.shell) ?? null, [s, d] = A(""), [u, f] = A(!1), [w, h] = A(null), C = S(async () => {
    if (!r) return;
    const x = s.trim();
    if (!(!x || u)) {
      f(!0), h(null);
      try {
        const L = await $e(r, x);
        t(x, L);
      } catch (L) {
        h((L == null ? void 0 : L.message) || "Failed to validate token. Please check and try again.");
      } finally {
        f(!1);
      }
    }
  }, [s, u, r, t]), I = S(
    (x) => {
      x.key === "Enter" && C();
    },
    [C]
  );
  return /* @__PURE__ */ m("div", { children: [
    /* @__PURE__ */ m(
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
    /* @__PURE__ */ c("div", { className: "figma-plugin-section", children: /* @__PURE__ */ m("div", { className: "figma-plugin-success", style: { display: "flex", alignItems: "center", gap: "6px", marginTop: "0" }, children: [
      /* @__PURE__ */ c("span", { style: { fontSize: "10px" }, children: "●" }),
      "Connected as ",
      e.handle
    ] }) }),
    /* @__PURE__ */ m("div", { className: "figma-plugin-section", children: [
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
          children: u ? /* @__PURE__ */ m(re, { children: [
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
function Ne(e) {
  const t = e.match(
    /figma\.com\/(file|design|proto|board)\/([A-Za-z0-9]+)/
  );
  if (!t) return null;
  const i = t[1], o = t[2];
  let n = null;
  const r = e.match(/[?&]node-id=([^&]+)/);
  return r && (n = decodeURIComponent(r[1]).replace(/-/g, ":")), { fileKey: o, nodeId: n, fileType: i };
}
function nt(e) {
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
function it(e) {
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
function ot(e) {
  const t = {
    flexDirection: e.layoutMode === "HORIZONTAL" ? "row" : "column",
    justifyContent: nt(e.primaryAxisAlignItems),
    alignItems: it(e.counterAxisAlignItems),
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
function rt(e, t) {
  const i = t[e.componentId];
  let o;
  if (e.componentProperties) {
    const r = {};
    for (const [s, d] of Object.entries(e.componentProperties))
      (d.type === "VARIANT" || d.type === "BOOLEAN" || d.type === "TEXT") && (r[s] = d.value);
    Object.keys(r).length > 0 && (o = r);
  }
  const n = {
    componentId: e.componentId,
    componentName: (i == null ? void 0 : i.name) ?? e.name,
    isRemote: (i == null ? void 0 : i.remote) ?? !1,
    source: i != null && i.remote ? "library" : "local"
  };
  return i != null && i.description && (n.description = i.description), o && (n.variantProperties = o), e.overrides && (n.overrides = e.overrides), n;
}
function Ie(e, t, i, o) {
  const n = e;
  if (n.type === "SLICE") return null;
  const r = {
    id: n.id,
    name: n.name,
    type: n.type,
    visible: n.visible !== !1
    // defaults to true when undefined
  };
  switch (n.absoluteBoundingBox != null ? (r.width = n.absoluteBoundingBox.width, r.height = n.absoluteBoundingBox.height) : n.size != null && (r.width = n.size.x, r.height = n.size.y), "layoutSizingHorizontal" in n && (r.widthMode = n.layoutSizingHorizontal), "layoutSizingVertical" in n && (r.heightMode = n.layoutSizingVertical), "layoutPositioning" in n && n.layoutPositioning != null && (r.positioning = n.layoutPositioning), "layoutGrow" in n && n.layoutGrow === 1 && (r.layoutGrow = 1), "layoutAlign" in n && n.layoutAlign === "STRETCH" && (r.layoutAlign = "STRETCH"), r.positioning === "ABSOLUTE" && o != null && n.absoluteBoundingBox != null && (r.absoluteOffset = {
    top: Math.round(n.absoluteBoundingBox.y - o.y),
    left: Math.round(n.absoluteBoundingBox.x - o.x)
  }), "layoutMode" in n && n.layoutMode && n.layoutMode !== "NONE" && (r.autoLayout = ot(n)), "constraints" in n && n.constraints != null && (r.constraints = n.constraints), "minWidth" in n && n.minWidth != null && (r.minWidth = n.minWidth), "maxWidth" in n && n.maxWidth != null && (r.maxWidth = n.maxWidth), "minHeight" in n && n.minHeight != null && (r.minHeight = n.minHeight), "maxHeight" in n && n.maxHeight != null && (r.maxHeight = n.maxHeight), "preserveRatio" in n && n.preserveRatio != null && (r.preserveRatio = n.preserveRatio), "fills" in n && Array.isArray(n.fills) && (r.fills = n.fills), "strokes" in n && Array.isArray(n.strokes) && (r.strokes = n.strokes), "strokeWeight" in n && n.strokeWeight != null && (r.strokeWeight = n.strokeWeight), "effects" in n && Array.isArray(n.effects) && (r.effects = n.effects), "cornerRadius" in n && n.cornerRadius != null && (r.cornerRadius = n.cornerRadius), "rectangleCornerRadii" in n && Array.isArray(n.rectangleCornerRadii) && (r.rectangleCornerRadii = n.rectangleCornerRadii), "opacity" in n && n.opacity != null && n.opacity !== 1 && (r.opacity = n.opacity), "blendMode" in n && n.blendMode && n.blendMode !== "PASS_THROUGH" && n.blendMode !== "NORMAL" && (r.blendMode = n.blendMode), "isMask" in n && n.isMask === !0 && (r.isMask = !0), "styles" in n && n.styles && (r.styleRefs = n.styles), n.type) {
    case "TEXT":
      r.textContent = n.characters, n.style && (r.textStyle = n.style), n.styleOverrideTable && Object.keys(n.styleOverrideTable).length > 0 && (r.textStyleOverrides = n.styleOverrideTable);
      break;
    case "INSTANCE":
      return r.componentRef = rt(n, t), r;
    case "BOOLEAN_OPERATION":
      return r;
  }
  if ("children" in n && Array.isArray(n.children)) {
    const s = n.absoluteBoundingBox != null ? { x: n.absoluteBoundingBox.x, y: n.absoluteBoundingBox.y } : null, d = n.children.map((u) => Ie(u, t, i + 1, s)).filter((u) => u !== null);
    r.children = at(d);
  }
  return r;
}
function he(e) {
  let t = 1;
  if (e.children && Array.isArray(e.children))
    for (const i of e.children)
      t += he(i);
  return t;
}
function st(e) {
  const t = e.componentRef, i = t.variantProperties ? JSON.stringify(t.variantProperties, Object.keys(t.variantProperties).sort()) : "";
  return `${t.componentId}::${i}`;
}
function at(e) {
  if (e.length === 0) return [];
  const t = /* @__PURE__ */ new Map();
  for (let n = 0; n < e.length; n++) {
    const r = e[n];
    if (r.componentRef) {
      const s = st(r), d = t.get(s);
      d ? (d.count++, d.indices.push(n)) : t.set(s, { node: r, count: 1, indices: [n] });
    }
  }
  const i = /* @__PURE__ */ new Set();
  for (const n of t.values())
    if (n.count >= 3) {
      n.node.repeatCount = n.count;
      for (let r = 1; r < n.indices.length; r++)
        i.add(n.indices[r]);
    }
  const o = [];
  for (let n = 0; n < e.length; n++)
    i.has(n) || o.push(e[n]);
  return o;
}
function lt(e, t) {
  let i = 0;
  for (const n of e)
    i += he(n);
  return {
    rootNodes: e.map((n) => Ie(n, t, 0, null)).filter((n) => n !== null),
    nodeCount: i,
    truncated: !1
  };
}
function J(e) {
  const t = Math.round(e.r * 255), i = Math.round(e.g * 255), o = Math.round(e.b * 255);
  if (e.a >= 1)
    return `#${t.toString(16).padStart(2, "0")}${i.toString(16).padStart(2, "0")}${o.toString(16).padStart(2, "0")}`;
  const n = parseFloat(e.a.toFixed(2));
  return `rgba(${t}, ${i}, ${o}, ${n})`;
}
function ct(e) {
  const t = e.gradientStops.map((i) => `${J(i.color)} ${Math.round(i.position * 100)}%`).join(", ");
  switch (e.type) {
    case "GRADIENT_LINEAR": {
      const [i, o] = e.gradientHandlePositions, n = o.x - i.x, r = o.y - i.y, s = Math.atan2(r, n);
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
function dt(e, t) {
  const i = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), u = [], f = /* @__PURE__ */ new Map();
  let w = 0, h = 0, C = 0;
  function I(l) {
    var y, P, W;
    if (l.fills && Array.isArray(l.fills)) {
      const $ = ft(l, t);
      for (const a of l.fills)
        if (a.visible !== !1)
          if (a.type === "SOLID") {
            const p = { ...a.color };
            a.opacity != null && a.opacity !== 1 && (p.a = p.a * a.opacity);
            const T = J(p);
            fe(i, T, l.id, "fill", $);
          } else if ((y = a.type) != null && y.startsWith("GRADIENT_")) {
            const p = ct(a), T = p, E = o.get(T);
            E ? (E.usageCount++, E.nodeIds.push(l.id)) : (C++, o.set(T, {
              value: p,
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
      const $ = pt(l, t);
      for (const a of l.strokes)
        if (a.visible !== !1 && a.type === "SOLID") {
          const p = { ...a.color };
          a.opacity != null && a.opacity !== 1 && (p.a = p.a * a.opacity);
          const T = J(p);
          fe(i, T, l.id, "stroke", $);
        }
    }
    if (l.effects && Array.isArray(l.effects)) {
      const $ = mt(l, t);
      for (const a of l.effects)
        if (a.visible === !0 && (a.type === "DROP_SHADOW" || a.type === "INNER_SHADOW")) {
          const p = a.type === "DROP_SHADOW" ? "drop-shadow" : "inner-shadow", T = J(a.color), E = ((P = a.offset) == null ? void 0 : P.x) ?? 0, O = ((W = a.offset) == null ? void 0 : W.y) ?? 0, H = a.radius ?? 0, U = a.spread ?? 0, F = `${p}|${T}|${E}|${O}|${H}|${U}`, j = d.get(F);
          j ? (j.usageCount++, j.nodeIds.push(l.id)) : (h++, d.set(F, {
            type: p,
            color: T,
            offsetX: E,
            offsetY: O,
            blur: H,
            spread: U,
            name: $ ?? `shadow-${h}`,
            usageCount: 1,
            nodeIds: [l.id]
          })), fe(i, T, l.id, "shadow", null);
        }
    }
    if (l.type === "TEXT" && l.textStyle) {
      const $ = gt(l, t);
      if (be(n, l.textStyle, l.id, $), l.textStyleOverrides && typeof l.textStyleOverrides == "object")
        for (const a of Object.values(l.textStyleOverrides))
          be(n, a, l.id, null);
    }
    if (l.autoLayout) {
      const $ = l.autoLayout;
      $.padding && (q(r, $.padding.top, "padding-top"), q(r, $.padding.right, "padding-right"), q(r, $.padding.bottom, "padding-bottom"), q(r, $.padding.left, "padding-left")), q(r, $.gap, "gap"), $.rowGap != null && q(r, $.rowGap, "row-gap");
    }
    if (l.cornerRadius != null || l.rectangleCornerRadii != null || ut(l)) {
      const $ = l.rectangleCornerRadii ? null : l.cornerRadius ?? null, a = l.rectangleCornerRadii ?? null;
      let p = null, T = null;
      if (l.strokes && Array.isArray(l.strokes)) {
        const H = l.strokes.find(
          (U) => U.visible !== !1 && U.type === "SOLID"
        );
        H && (p = J(H.color), T = l.strokeWeight ?? null);
      }
      const E = `${$}|${JSON.stringify(a)}|${p}|${T}`, O = s.get(E);
      O ? (O.usageCount++, O.nodeIds.push(l.id)) : (w++, s.set(E, {
        radius: $,
        cornerRadii: a,
        strokeColor: p,
        strokeWeight: T,
        name: `border-${w}`,
        usageCount: 1,
        nodeIds: [l.id]
      }));
    }
    if (l.componentRef) {
      const $ = l.componentRef, a = `${$.componentName}::${JSON.stringify($.variantProperties ?? {})}`, p = f.get(a), T = l.repeatCount ?? 1;
      if (p)
        p.usageCount += T;
      else {
        const E = {
          componentName: $.componentName,
          source: $.source,
          usageCount: T
        };
        $.description && (E.description = $.description), $.variantProperties && (E.variantProperties = $.variantProperties), f.set(a, E);
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
  const z = Array.from(n.values());
  z.sort((l, y) => y.usageCount - l.usageCount);
  const M = Array.from(r.values());
  M.sort((l, y) => l.value - y.value);
  const B = Array.from(s.values());
  B.sort((l, y) => y.usageCount - l.usageCount);
  const b = Array.from(d.values());
  b.sort((l, y) => y.usageCount - l.usageCount);
  const R = Array.from(f.values());
  return R.sort((l, y) => y.usageCount - l.usageCount), {
    colors: x,
    gradients: L,
    typography: z,
    spacing: M,
    borders: B,
    shadows: b,
    imageFills: u,
    components: R
  };
}
function fe(e, t, i, o, n) {
  const r = e.get(t);
  if (r)
    r.usageCount++, r.nodeIds.includes(i) || r.nodeIds.push(i), r.source.add(o), n && r.name.startsWith("color-") && (r.name = n);
  else {
    const s = `color-${t.replace(/^#/, "").replace(/[^a-f0-9]/gi, "")}`;
    e.set(t, {
      value: t,
      name: n ?? s,
      usageCount: 1,
      nodeIds: [i],
      source: /* @__PURE__ */ new Set([o])
    });
  }
}
function be(e, t, i, o) {
  const n = t.fontFamily ?? "Unknown", r = t.fontSize ?? 16, s = t.fontWeight ?? 400, d = t.lineHeightPx ?? null, u = t.letterSpacing ?? 0, f = `${n}|${r}|${s}|${d}|${u}`, w = e.get(f);
  if (w)
    w.usageCount++, w.nodeIds.includes(i) || w.nodeIds.push(i), o && w.name.startsWith(n) && (w.name = o);
  else {
    const h = `${n}-${r}-${s}`;
    e.set(f, {
      fontFamily: n,
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
function q(e, t, i) {
  if (t === 0) return;
  const o = e.get(t);
  o ? (o.usageCount++, o.sources.includes(i) || o.sources.push(i)) : e.set(t, {
    value: t,
    usageCount: 1,
    sources: [i]
  });
}
function ut(e) {
  return !e.strokes || !Array.isArray(e.strokes) ? !1 : e.strokes.some((t) => t.visible !== !1 && t.type === "SOLID");
}
function ft(e, t) {
  var o, n;
  const i = (o = e.styleRefs) == null ? void 0 : o.fill;
  return i ? ((n = t[i]) == null ? void 0 : n.name) ?? null : null;
}
function pt(e, t) {
  var o, n;
  const i = (o = e.styleRefs) == null ? void 0 : o.stroke;
  return i ? ((n = t[i]) == null ? void 0 : n.name) ?? null : null;
}
function gt(e, t) {
  var o, n;
  const i = (o = e.styleRefs) == null ? void 0 : o.text;
  return i ? ((n = t[i]) == null ? void 0 : n.name) ?? null : null;
}
function mt(e, t) {
  var o, n;
  const i = (o = e.styleRefs) == null ? void 0 : o.effect;
  return i ? ((n = t[i]) == null ? void 0 : n.name) ?? null : null;
}
const ht = 500, yt = 2e3;
async function xt(e) {
  const { shell: t, token: i, fileKey: o, nodeId: n, scope: r } = e;
  let s, d, u;
  if (r === "node" || r === "frame") {
    if (!n)
      throw new Error(
        `Cannot extract ${r}: no node ID found in the URL. Paste a Figma URL that includes a node-id, or switch to "Entire Page" scope.`
      );
    const I = await ke(t, i, o, n);
    s = [I.rootNode], d = I.components, u = I.styles;
  } else {
    const I = await Qe(t, i, o), x = I.rootNodes[0];
    s = (x == null ? void 0 : x.children) || [], d = I.components, u = I.styles;
  }
  let f = 0;
  for (const I of s)
    f += he(I);
  let w;
  f > ht && (w = {
    nodeCount: f,
    message: `This selection has ~${f} nodes. Large extractions may produce verbose output.`
  });
  const h = lt(s, d);
  f > yt && (h.truncated = !0);
  const C = dt(h.rootNodes, u);
  return { extraction: h, tokens: C, fileKey: o, largeTreeWarning: w };
}
async function vt(e, t) {
  const i = `${t}/.shipstudio/assets`, o = await e.exec("rm", ["-rf", i]);
  if (o.exit_code !== 0)
    throw new Error(`Failed to clean assets directory: ${o.stderr}`);
  const n = await e.exec("mkdir", ["-p", i]);
  if (n.exit_code !== 0)
    throw new Error(`Failed to create assets directory: ${n.stderr}`);
  return i;
}
async function we(e, t, i) {
  const o = ["-sS", "-o", i, "--max-time", "30", "-L", t];
  if ((await e.exec("curl", o, { timeout: 35e3 })).exit_code === 0) return { success: !0 };
  const r = await e.exec("curl", o, { timeout: 35e3 });
  return r.exit_code === 0 ? { success: !0 } : {
    success: !1,
    error: r.stderr || `curl exit code ${r.exit_code}`
  };
}
function bt(e, t) {
  return e[t] ?? e[encodeURIComponent(t)] ?? e[decodeURIComponent(t)] ?? null;
}
async function wt(e) {
  const { shell: t, token: i, fileKey: o, selectedNodeId: n, projectPath: r, manualAssets: s = [], onProgress: d } = e, u = [], f = s.filter((b) => b.status === "valid"), w = f.length + 1, h = await vt(t, r);
  d && d({ current: 0, total: w, currentAsset: "preview.png", phase: "preview" });
  let C = `${h}/preview.png`;
  try {
    const R = (await ue(t, i, o, [n], "png", 2))[n];
    if (R) {
      const l = await we(t, R, C);
      l.success || (u.push(`Preview download failed: ${l.error}`), C = "");
    } else
      u.push("Figma could not render preview for this node"), C = "";
  } catch (b) {
    u.push(`Preview render failed: ${(b == null ? void 0 : b.message) || "Unknown error"}`), C = "";
  }
  const I = f.filter((b) => b.format === "png"), x = f.filter((b) => b.format === "svg");
  let L = {}, z = {};
  if (I.length > 0)
    try {
      L = await ue(t, i, o, I.map((b) => b.nodeId), "png", 2);
    } catch (b) {
      u.push(`PNG batch render failed: ${(b == null ? void 0 : b.message) || "Unknown error"}`), L = {};
    }
  if (x.length > 0)
    try {
      z = await ue(t, i, o, x.map((b) => b.nodeId), "svg");
    } catch (b) {
      u.push(`SVG batch render failed: ${(b == null ? void 0 : b.message) || "Unknown error"}`), z = {};
    }
  const M = [], B = [...I, ...x];
  for (let b = 0; b < B.length; b++) {
    const R = B[b], l = R.format === "png" ? L : z;
    d && d({
      current: b + 1,
      total: w,
      currentAsset: R.filename,
      phase: "assets"
    });
    const y = bt(l, R.nodeId);
    if (!y) {
      u.push(`Failed to render ${R.filename}: Figma returned no image for node ${R.nodeId}`);
      continue;
    }
    const P = `${h}/${R.filename}`, W = await we(t, y, P);
    if (!W.success) {
      u.push(`Failed to download ${R.filename}: ${W.error}`);
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
function Te(e) {
  return e.toLowerCase().replace(/[/\s]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "") || "unnamed";
}
const Ae = /^(Frame|Group|Rectangle|Ellipse|Vector|Section|Instance|Line|Star|Polygon)\s*\d*$/i;
function Ct(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e) {
    const o = Se(i.name) ? [] : [i.name];
    Re(i, o, t);
  }
  return t;
}
function Re(e, t, i) {
  if (i.set(e.id, $t(t)), !!e.children)
    for (const o of e.children) {
      const n = Se(o.name) ? t : [...t, o.name];
      Re(o, n, i);
    }
}
function $t(e) {
  return e.length === 0 ? "" : e.length <= 4 ? e.join(" > ") : `${e[0]} > ... > ${e[e.length - 2]} > ${e[e.length - 1]}`;
}
function Se(e) {
  return Ae.test(e);
}
const kt = /* @__PURE__ */ new Set([
  "VECTOR",
  "LINE",
  "STAR",
  "ELLIPSE",
  "REGULAR_POLYGON",
  "BOOLEAN_OPERATION"
]);
function Nt(e) {
  return e.startsWith("I");
}
function It(e) {
  return kt.has(e) ? "svg" : "png";
}
function ge(e, t) {
  if (!t.includes(e))
    return e;
  const i = e.lastIndexOf("."), o = i !== -1, n = o ? e.slice(0, i) : e, r = o ? e.slice(i) : "";
  let s = 2;
  for (; t.includes(`${n}-${s}${r}`); )
    s++;
  return `${n}-${s}${r}`;
}
function Tt(e, t, i, o) {
  const n = It(i), s = `${Te(t)}.${n}`, d = o.map((w) => w.filename), u = ge(s, d), f = Ae.test(t) ? `Auto-named: ${u} -- consider renaming` : void 0;
  return {
    nodeId: e,
    nodeName: t,
    filename: u,
    format: n,
    status: "valid",
    warning: f
  };
}
async function At(e, t, i, o, n) {
  try {
    const { rootNode: r } = await ke(e, t, i, o);
    return Tt(o, r.name, r.type, n);
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
function Rt({
  designFileKey: e,
  assets: t,
  onAdd: i,
  onRemove: o,
  onClear: n,
  onRename: r,
  onResolved: s,
  onFormatChange: d,
  disabled: u,
  shell: f,
  token: w
}) {
  const [h, C] = A(""), [I, x] = A(null), [L, z] = A(null), [M, B] = A(""), b = ee(/* @__PURE__ */ new Set()), R = S(async () => {
    if (!h.trim() || !e || u) return;
    const a = Ne(h);
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
    if (t.some((E) => E.nodeId === a.nodeId) || b.current.has(a.nodeId)) {
      x("This element is already in the list");
      return;
    }
    if (Nt(a.nodeId)) {
      x("This is an instance child -- select the parent component instead");
      return;
    }
    const p = a.nodeId;
    b.current.add(p), i({
      nodeId: p,
      nodeName: "",
      filename: "",
      format: "png",
      status: "resolving"
    }), C(""), x(null);
    try {
      const E = await At(f, w, e, p, t);
      s(p, E);
    } catch (E) {
      s(p, {
        nodeId: p,
        nodeName: "",
        filename: p.replace(/:/g, "-") + ".png",
        format: "png",
        status: "error",
        error: E instanceof Error ? E.message : "Failed to resolve node"
      });
    } finally {
      b.current.delete(p);
    }
  }, [h, e, t, f, w, u, i, s]), l = S(
    (a) => {
      const p = a.format === "png" ? "svg" : "png", T = a.filename.lastIndexOf("."), O = `${T !== -1 ? a.filename.slice(0, T) : a.filename}.${p}`, H = t.filter((F) => F.nodeId !== a.nodeId).map((F) => F.filename), U = ge(O, H);
      d(a.nodeId, p, U);
    },
    [t, d]
  ), y = S((a, p) => {
    z(a);
    const T = p.lastIndexOf(".");
    B(T !== -1 ? p.slice(0, T) : p);
  }, []), P = S(
    (a, p) => {
      const E = `${Te(M)}.${p}`, O = t.filter((U) => U.nodeId !== a).map((U) => U.filename), H = ge(E, O);
      r(a, H), z(null);
    },
    [M, t, r]
  ), W = S(
    (a) => {
      a.key === "Enter" && R();
    },
    [R]
  ), $ = S(
    (a, p, T) => {
      a.key === "Enter" && P(p, T);
    },
    [P]
  );
  return /* @__PURE__ */ m("div", { className: "figma-plugin-section", children: [
    /* @__PURE__ */ c("label", { className: "figma-plugin-label", children: "Assets" }),
    e && /* @__PURE__ */ m("div", { className: "figma-plugin-asset-input-row", children: [
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
          onKeyDown: W,
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
    t.length > 0 && /* @__PURE__ */ m(re, { children: [
      /* @__PURE__ */ m("div", { className: "figma-plugin-asset-list-header", children: [
        /* @__PURE__ */ m("span", { children: [
          t.length,
          " asset",
          t.length !== 1 ? "s" : ""
        ] }),
        /* @__PURE__ */ c(
          "button",
          {
            className: "figma-plugin-asset-clear-btn",
            onClick: n,
            disabled: u,
            children: "Clear all"
          }
        )
      ] }),
      t.map((a) => /* @__PURE__ */ m("div", { className: "figma-plugin-asset-row", children: [
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
            onChange: (p) => B(p.target.value),
            onBlur: () => P(a.nodeId, a.format),
            onKeyDown: (p) => $(p, a.nodeId, a.format),
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
const Ce = 12e3;
function St(e) {
  return Math.ceil(e.length / 4);
}
function Et(e) {
  const { extraction: t, exportResult: i, projectPath: o } = e, n = t.tokens, r = /* @__PURE__ */ new Map();
  for (const I of i.assets)
    I.nodeId && r.set(I.nodeId, I.filename), I.parentInstanceId && !r.has(I.parentInstanceId) && r.set(I.parentInstanceId, I.filename);
  const s = e.rootNodes ?? t.extraction.rootNodes, d = Ct(s), f = [
    Lt(e),
    Pt(e.mode, e.inspirationText),
    Ft(i.previewPath, o),
    Mt(t.extraction.rootNodes, r),
    Ht(n),
    Kt(n.components),
    Xt(i.previewPath, i.assets, o, d),
    Zt()
  ].filter(Boolean).join(`

`), w = f.length, h = St(f), C = {
    nodeCount: t.extraction.nodeCount,
    colorCount: n.colors.length,
    fontCount: n.typography.length,
    assetCount: i.assets.length,
    estimatedTokens: h
  };
  return {
    markdown: f,
    charCount: w,
    estimatedTokens: h,
    stats: C
  };
}
function Lt(e) {
  var u;
  const { extraction: t, fileName: i, figmaUrl: o } = e, n = ((u = t.extraction.rootNodes[0]) == null ? void 0 : u.name) ?? "Untitled", r = e.date ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), d = {
    best: "Copy (Best results)",
    pixel: "Copy (Pixel for pixel)",
    inspiration: "Use as inspiration"
  }[e.mode ?? "best"] ?? "Copy (Best results)";
  return [
    "# Design Brief",
    "",
    `**File:** ${i}`,
    `**Frame:** ${n}`,
    `**Extracted:** ${r}`,
    `**Mode:** ${d}`,
    `**Figma URL:** ${o}`
  ].join(`
`);
}
function Pt(e, t) {
  const i = e ?? "best", o = ["## How to Use This Brief", ""], n = "Read this brief fully. Study the preview image, layout tree, and design tokens before writing any code.", r = "The Assets section below is the complete manifest of provided files. Use only these assets -- every visual element NOT listed there should be built with CSS or HTML, not with image files. For any visual element visible in the preview that appears to be a photograph, logo, icon, or illustration but is NOT listed in the Assets section, create a placeholder box instead -- see the Placeholders section below for styling and naming conventions.", s = "Compare your result against the preview image and verify that layout, spacing, colors, and typography match the design tokens.";
  return i === "best" ? o.push(
    `**Before building:** ${n}`,
    `**During building:** Reproduce the design faithfully using clean, production-ready code. Use semantic HTML, CSS flexbox/grid for layout, and relative units (rem, %, vh) where appropriate. Follow the spacing and color tokens exactly, but use responsive patterns so the result works across screen sizes. ${r}`,
    `**After building:** ${s}`
  ) : i === "pixel" ? o.push(
    `**Before building:** ${n}`,
    `**During building:** Match the Figma design as exactly as possible. Use the exact pixel values from the design tokens for font sizes, spacing, widths, and heights. Use fixed dimensions rather than responsive units. Prioritize visual accuracy over code flexibility. ${r}`,
    `**After building:** ${s} Pay special attention to exact pixel dimensions, spacing values, and font sizes.`
  ) : i === "inspiration" && (o.push(
    `**Before building:** ${n} Use this design as a reference for visual patterns, not a spec to copy exactly.`,
    `**During building:** Adapt the design's style and layout patterns to fit the user's existing site and codebase. Use the color palette, typography choices, and layout structure as guidance, but adjust proportions, spacing, and components to work within the target context. ${r}`,
    "**After building:** Verify that your result captures the spirit of the design -- the visual hierarchy, color usage, and layout patterns -- while fitting naturally into the target codebase."
  ), t && t.trim() && o.push("", "**What to take from this design:**", "", `> ${t.trim().split(`
`).join(`
> `)}`)), o.join(`
`);
}
function Ft(e, t) {
  return e ? `## Preview

![Preview](${me(e, t)})` : "";
}
function Mt(e, t) {
  const i = [];
  for (const o of e)
    Ee(o, 0, i, t);
  return i.length === 0 ? "" : `## Layout Tree

` + i.join(`
`);
}
function Ee(e, t, i, o) {
  if (e.visible !== !1 && (i.push(Bt(e, t, o)), !e.componentRef && e.children))
    for (const n of e.children)
      Ee(n, t + 1, i, o);
}
function Ut(e) {
  return e.charAt(0).toUpperCase() + e.slice(1).toLowerCase();
}
function Le(e) {
  return /Property\s+\d+=/i.test(e) ? e.split(",").map((t) => {
    const i = t.indexOf("=");
    if (i !== -1) {
      const o = t.slice(0, i).trim(), n = t.slice(i + 1).trim();
      if (/^Property\s+\d+$/i.test(o)) return n;
    }
    return t.trim();
  }).join(", ") : e;
}
function Bt(e, t, i) {
  const o = "  ".repeat(t), n = [];
  if (e.componentRef) {
    let d = `Instance "${Le(e.componentRef.componentName)}"`;
    if (e.repeatCount && e.repeatCount > 1 && (d += ` x${e.repeatCount} (repeated)`), e.componentRef.variantProperties && Object.keys(e.componentRef.variantProperties).length > 0) {
      const f = Object.entries(e.componentRef.variantProperties).map(([w, h]) => /^Property\s+\d+$/i.test(w) ? String(h) : `${w}: ${h}`).join(", ");
      d += ` (${f})`;
    }
    const u = i == null ? void 0 : i.get(e.id);
    u && (d += ` -> ${u}`), n.push(d);
  } else if (e.type === "TEXT") {
    const s = e.textContent ?? "", d = s.length > 200 ? s.slice(0, 200) + "..." : s;
    let u = "";
    e.textStyle && (u = ` (${e.textStyle.fontFamily} ${e.textStyle.fontSize}/${e.textStyle.fontWeight})`), n.push(`Text '${d}'${u}`);
  } else
    n.push(`${Ut(e.type)} '${e.name}'`);
  if (e.autoLayout) {
    const s = e.autoLayout, d = [s.flexDirection];
    s.gap > 0 && d.push(`gap: ${s.gap}`), s.justifyContent !== "flex-start" && d.push(`justify: ${s.justifyContent}`), s.alignItems !== "flex-start" && d.push(`align: ${s.alignItems}`);
    const u = zt(s.padding);
    u && d.push(u), s.flexWrap === "wrap" && d.push("wrap"), n.push(`(${d.join(", ")})`);
  }
  e.width != null && e.height != null && n.push(`${Math.round(e.width)}x${Math.round(e.height)}`), e.positioning === "ABSOLUTE" && (e.absoluteOffset ? n.push(`[absolute] top:${e.absoluteOffset.top} left:${e.absoluteOffset.left}`) : n.push("[absolute]"));
  const r = Ot(e);
  return r && n.push(r), `${o}${n.join(" ")}`;
}
function pe(e) {
  if (!e) return null;
  for (const t of e)
    if (t.visible !== !1 && t.type === "SOLID" && t.color) {
      const i = t.opacity ?? 1, o = { ...t.color, a: (t.color.a ?? 1) * i };
      return J(o);
    }
  return null;
}
function Ot(e) {
  var i;
  const t = [];
  if (e.widthMode === "FILL" && t.push("w:fill"), e.heightMode === "FILL" && t.push("h:fill"), e.widthMode === "HUG" && t.push("w:hug"), e.heightMode === "HUG" && t.push("h:hug"), e.type !== "TEXT") {
    const o = pe(e.fills);
    o && o !== "#ffffff" && o !== "#000000" ? t.push(`bg:${o}`) : o && t.push(`bg:${o}`);
  }
  if (e.type === "TEXT") {
    const o = pe(e.fills);
    o && t.push(`color:${o}`);
  }
  if (e.cornerRadius && e.cornerRadius > 0 && t.push(`r:${Math.round(e.cornerRadius)}`), e.strokeWeight && e.strokeWeight > 0 && ((i = e.strokes) != null && i.length)) {
    const o = pe(e.strokes);
    o && t.push(`border:${e.strokeWeight}px ${o}`);
  }
  return e.layoutGrow === 1 && t.push("flex-grow:1"), e.layoutAlign === "STRETCH" && t.push("align-self:stretch"), e.opacity != null && e.opacity < 1 && t.push(`opacity:${e.opacity.toFixed(2)}`), t.length === 0 ? null : `{${t.join(" ")}}`;
}
function zt(e) {
  return e.top === 0 && e.right === 0 && e.bottom === 0 && e.left === 0 ? null : e.top === e.bottom && e.left === e.right && e.top === e.left ? `padding: ${e.top}` : e.top === e.bottom && e.left === e.right ? `padding: ${e.top} ${e.left}` : `padding: ${e.top} ${e.right} ${e.bottom} ${e.left}`;
}
function Ht(e) {
  const t = [];
  return e.colors.length > 0 && t.push(Dt(e.colors)), e.gradients.length > 0 && t.push(Wt(e.gradients)), e.typography.length > 0 && t.push(_t(e.typography)), e.spacing.length > 0 && t.push(jt(e.spacing)), e.borders.length > 0 && t.push(Vt(e.borders)), e.shadows.length > 0 && t.push(Gt(e.shadows)), t.length === 0 ? "" : `## Design Tokens

` + t.join(`

`);
}
function Dt(e) {
  return [
    "### Colors",
    "",
    "| Name | Value | Usage |",
    "|------|-------|-------|",
    ...e.map((i) => `| ${i.name} | ${i.value} | ${i.usageCount} |`)
  ].join(`
`);
}
function Wt(e) {
  return [
    "### Gradients",
    "",
    "| Name | Value | Usage |",
    "|------|-------|-------|",
    ...e.map((i) => `| ${i.name} | ${i.value} | ${i.usageCount} |`)
  ].join(`
`);
}
function _t(e) {
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
function jt(e) {
  return [
    "### Spacing",
    "",
    "| Value | Sources | Usage |",
    "|-------|---------|-------|",
    ...e.map((i) => `| ${i.value}px | ${i.sources.join(", ")} | ${i.usageCount} |`)
  ].join(`
`);
}
function Vt(e) {
  return [
    "### Borders",
    "",
    "| Name | Radius | Stroke | Usage |",
    "|------|--------|--------|-------|",
    ...e.map((i) => {
      const o = i.radius !== null ? `${i.radius}px` : i.cornerRadii ? i.cornerRadii.map((r) => `${r}px`).join(" ") : "--", n = i.strokeWeight !== null && i.strokeColor !== null ? `${i.strokeWeight}px ${i.strokeColor}` : "--";
      return `| ${i.name} | ${o} | ${n} | ${i.usageCount} |`;
    })
  ].join(`
`);
}
function Gt(e) {
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
function Kt(e) {
  return e.length === 0 ? "" : [
    "## Components",
    "",
    "| Component | Source | Variants | Usage |",
    "|-----------|--------|----------|-------|",
    ...e.map((i) => {
      const o = Le(i.componentName), n = i.variantProperties && Object.keys(i.variantProperties).length > 0 ? Object.entries(i.variantProperties).map(([r, s]) => /^Property\s+\d+$/i.test(r) ? String(s) : `${r}: ${s}`).join(", ") : "--";
      return `| ${o} | ${i.source} | ${n} | ${i.usageCount} |`;
    })
  ].join(`
`);
}
function Xt(e, t, i, o) {
  if (!e && t.length === 0) return "";
  const n = [];
  if (e) {
    const r = me(e, i), s = r.split("/").pop() ?? r;
    n.push(`| ${s} | Preview | Full-page preview screenshot | ${r} |`);
  }
  for (const r of t) {
    const s = me(r.path, i), d = Jt(r.assetType);
    let u = "--";
    r.nodeId && (u = o.get(r.nodeId) || r.parentInstanceId && o.get(r.parentInstanceId) || "--");
    const f = qt(r.assetType, u);
    n.push(`| ${r.filename} | ${d} | ${f} | ${s} |`);
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
function Zt() {
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
function qt(e, t) {
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
function Jt(e) {
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
async function Yt(e, t, i) {
  const o = `${t}/brief.md`, n = btoa(unescape(encodeURIComponent(i))), r = await e.exec("bash", [
    "-c",
    `echo '${n}' | base64 -d > '${o}'`
  ]);
  if (r.exit_code !== 0)
    throw new Error(`Failed to save brief: ${r.stderr}`);
}
async function Qt(e, t) {
  const i = btoa(unescape(encodeURIComponent(t))), o = await e.exec("bash", [
    "-c",
    `echo '${i}' | base64 -d | pbcopy`
  ]);
  if (o.exit_code !== 0)
    throw new Error(`Clipboard copy failed: ${o.stderr}`);
}
const en = [
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
function tn(e) {
  const t = { frames: 0, components: [], textNodes: 0, hiddenNodes: 0 }, i = /* @__PURE__ */ new Map();
  function o(n) {
    if (n.visible || t.hiddenNodes++, (n.type === "FRAME" || n.type === "GROUP" || n.type === "SECTION") && t.frames++, n.type === "TEXT" && t.textNodes++, n.componentRef) {
      const r = n.componentRef.componentName, s = n.repeatCount ?? 1;
      i.set(r, (i.get(r) ?? 0) + s);
    }
    n.children && n.children.forEach(o);
  }
  return e.forEach(o), t.components = Array.from(i.entries()).map(([n, r]) => ({ name: n, count: r })).sort((n, r) => r.count - n.count), t;
}
function Pe({ nodes: e, depth: t = 0, maxDepth: i = 2 }) {
  return t >= i ? null : /* @__PURE__ */ c("div", { style: { paddingLeft: t > 0 ? "12px" : "0", borderLeft: t > 0 ? "1px solid var(--border)" : "none" }, children: e.map((o, n) => {
    const r = o.componentRef ? `<${o.componentRef.componentName}${o.repeatCount ? ` x${o.repeatCount}` : ""}>` : o.type === "TEXT" ? `"${(o.textContent ?? "").slice(0, 30)}${(o.textContent ?? "").length > 30 ? "..." : ""}"` : o.name, s = o.autoLayout ? `${o.autoLayout.flexDirection}` : o.type === "INSTANCE" ? "component" : o.type.toLowerCase();
    return /* @__PURE__ */ m("div", { style: { fontSize: "11px", lineHeight: 1.7 }, children: [
      /* @__PURE__ */ m("span", { style: { color: "var(--text-muted)" }, children: [
        s,
        " "
      ] }),
      /* @__PURE__ */ c("span", { style: { color: o.visible === !1 ? "var(--text-muted)" : "var(--text-primary)" }, children: r }),
      o.visible === !1 && /* @__PURE__ */ c("span", { style: { color: "var(--text-muted)", marginLeft: "4px" }, children: "(hidden)" }),
      o.children && o.children.length > 0 && t + 1 < i && /* @__PURE__ */ c(Pe, { nodes: o.children, depth: t + 1, maxDepth: i }),
      o.children && o.children.length > 0 && t + 1 >= i && /* @__PURE__ */ m("span", { style: { color: "var(--text-muted)", fontSize: "11px", marginLeft: "12px" }, children: [
        "(",
        o.children.length,
        " children)"
      ] })
    ] }, o.id || n);
  }) });
}
function nn({ token: e }) {
  const t = se(), i = (t == null ? void 0 : t.shell) ?? null, o = (t == null ? void 0 : t.actions) ?? null, [n, r] = A(""), [s, d] = A(null), u = s != null && s.nodeId ? "node" : "page", [f, w] = A(null), [h, C] = A(!1), [I, x] = A(null), [L, z] = A(!1), [M, B] = A(null), [b, R] = A(null), [l, y] = A(!1), [P, W] = A(!1), [$, a] = A(!1), [p, T] = A(null), [E, O] = A(null), [H, U] = A(!1), [F, j] = A(null), [ye, Y] = A(null), [K, G] = A([]), [Z, xe] = A("best"), [ae, Fe] = A(""), Me = S((g) => {
    G((N) => [...N, g]);
  }, []), Ue = S((g) => {
    G((N) => N.filter((v) => v.nodeId !== g));
  }, []), Be = S(() => {
    G([]);
  }, []), Oe = S((g, N) => {
    G((v) => v.map(
      (k) => k.nodeId === g ? { ...k, filename: N } : k
    ));
  }, []), ze = S((g, N) => {
    G((v) => v.map(
      (k) => k.nodeId === g ? N : k
    ));
  }, []), He = S((g, N, v) => {
    G((k) => k.map(
      (V) => V.nodeId === g ? { ...V, format: N, filename: v } : V
    ));
  }, []), Q = Xe(
    () => M ? tn(M.rootNodes) : null,
    [M]
  ), X = ee(null), _ = ee(i);
  _.current = i;
  const le = ee(0), ne = ee(0), ie = S(async (g) => {
    var N, v;
    if (!(!_.current || !s)) {
      a(!0), T(null), O(null);
      try {
        const k = await wt({
          shell: _.current,
          token: e,
          fileKey: g.fileKey,
          selectedNodeId: s.nodeId || ((N = g.extraction.rootNodes[0]) == null ? void 0 : N.id) || "0:0",
          projectPath: ((v = t == null ? void 0 : t.project) == null ? void 0 : v.path) ?? ".",
          manualAssets: K,
          onProgress: T
        });
        if (O(k), o) {
          const V = k.assets.length, D = k.warnings.length, ce = `Exported ${V} asset${V !== 1 ? "s" : ""}${D > 0 ? ` (${D} warning${D !== 1 ? "s" : ""})` : ""}`;
          o.showToast(ce, D > 0 ? "info" : "success");
        }
        U(!0), j(null), Y(null), setTimeout(() => {
          var V;
          try {
            const D = Et({
              extraction: g,
              exportResult: k,
              projectPath: ((V = t == null ? void 0 : t.project) == null ? void 0 : V.path) ?? ".",
              fileName: (f == null ? void 0 : f.name) ?? "Untitled",
              figmaUrl: n,
              rootNodes: g.extraction.rootNodes,
              mode: Z,
              inspirationText: Z === "inspiration" ? ae : void 0
            });
            j(D), U(!1), _.current && Yt(_.current, k.assetsDir, D.markdown).catch((ce) => {
              console.error("Brief save failed:", ce);
            }), o && o.showToast(
              `Brief ready: ${D.stats.nodeCount} layers, ${D.stats.assetCount} assets, ~${Math.round(D.stats.estimatedTokens / 1e3)}K tokens`,
              "success"
            );
          } catch (D) {
            Y((D == null ? void 0 : D.message) || "Brief generation failed"), U(!1);
          }
        }, 0);
      } catch (k) {
        o && o.showToast(`Asset export failed: ${(k == null ? void 0 : k.message) || "Unknown error"}`, "error");
      } finally {
        a(!1), T(null);
      }
    }
  }, [e, s, t, o, f, n, K, Z, ae]), De = S(
    (g) => {
      const N = g.target.value;
      if (r(N), !N.trim()) {
        d(null), w(null), x(null), C(!1), B(null), R(null), y(!1), W(!1), X.current = null, O(null), a(!1), T(null), j(null), U(!1), Y(null), G([]);
        return;
      }
      const v = Ne(N);
      if (!v) {
        d(null), w(null), x("Please paste a valid Figma URL (file, design, proto, or board link)"), C(!1);
        return;
      }
      d(v), x(null), w(null), B(null), R(null), y(!1), W(!1), X.current = null, O(null), a(!1), T(null), j(null), U(!1), Y(null), G([]);
    },
    []
  );
  oe(() => {
    if (!s || !_.current) return;
    const g = ++le.current, N = _.current;
    C(!0), w(null), x(null), (async () => {
      try {
        const v = await Ye(N, e, s.fileKey);
        le.current === g && (w(v), C(!1));
      } catch (v) {
        if (le.current === g) {
          const k = (v == null ? void 0 : v.message) || "Failed to validate file access.";
          k.includes("403") || k.includes("Invalid or expired") ? x("Cannot access this file. Check that your token has File content (Read) scope.") : k.includes("404") || k.includes("not found") ? x("File not found. Check that the URL is correct.") : k.includes("429") || k.includes("Rate limited") ? x("Rate limited by Figma. Please wait a moment and try again.") : x(k), C(!1);
        }
      }
    })();
  }, [s, e]);
  const We = S(() => {
    const g = _.current;
    if (!g || !s) return;
    const N = ++ne.current;
    z(!0), B(null), x(null), R(null), y(!1), X.current = null, O(null), a(!1), T(null), j(null), U(!1), Y(null), (async () => {
      try {
        const v = await xt({
          shell: g,
          token: e,
          fileKey: s.fileKey,
          nodeId: s.nodeId,
          scope: u
        });
        if (ne.current !== N) return;
        if (v.largeTreeWarning) {
          X.current = v, R(v.largeTreeWarning), y(!0), z(!1);
          return;
        }
        B(v.extraction), o && o.showToast(`Extracted ${v.extraction.nodeCount} layers`, "success"), ie(v);
      } catch (v) {
        if (ne.current !== N) return;
        const k = (v == null ? void 0 : v.message) || "Extraction failed.";
        k.includes("403") || k.includes("Invalid or expired") ? x("Cannot access this file. Check that your token has File content (Read) scope.") : k.includes("404") || k.includes("not found") ? x("File not found. Check that the URL is correct.") : k.includes("429") || k.includes("Rate limited") ? x("Rate limited by Figma. Please wait a moment and try again.") : k.includes("timeout") || k.includes("timed out") ? x("Request timed out. Try a smaller selection or check your connection.") : x(k);
      } finally {
        ne.current === N && z(!1);
      }
    })();
  }, [s, e, u, o, ie]), _e = S(() => {
    const g = X.current;
    g && (y(!1), R(null), B(g.extraction), X.current = null, o && o.showToast(`Extracted ${g.extraction.nodeCount} layers`, "success"), ie(g));
  }, [o, ie]), je = S(() => {
    y(!1), R(null), X.current = null;
  }, []), Ve = S(async () => {
    if (!(!F || !_.current))
      try {
        await Qt(_.current, F.markdown), o && o.showToast("Brief copied to clipboard", "success");
      } catch (g) {
        o && o.showToast(`Copy failed: ${(g == null ? void 0 : g.message) || "Unknown error"}`, "error");
      }
  }, [F, o]), Ge = K.some((g) => g.status === "resolving"), Ke = !s || !f || h || L || $ || H || Ge;
  return /* @__PURE__ */ m("div", { children: [
    /* @__PURE__ */ m("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ c("label", { className: "figma-plugin-label", children: "Figma URL" }),
      /* @__PURE__ */ c(
        "input",
        {
          className: "figma-plugin-input",
          type: "text",
          placeholder: "https://www.figma.com/design/...",
          value: n,
          onChange: De
        }
      ),
      I && /* @__PURE__ */ c("div", { className: "figma-plugin-error", children: I })
    ] }),
    s && /* @__PURE__ */ c("div", { className: "figma-plugin-section", children: /* @__PURE__ */ m("div", { className: "figma-plugin-file-info", children: [
      h && /* @__PURE__ */ m("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: f ? "8px" : "0" }, children: [
        /* @__PURE__ */ c("span", { className: "figma-plugin-spinner" }),
        /* @__PURE__ */ c("span", { style: { color: "var(--text-secondary)" }, children: "Checking access..." })
      ] }),
      f && /* @__PURE__ */ m("div", { style: { marginBottom: "8px" }, children: [
        /* @__PURE__ */ c("div", { style: { fontWeight: 600, fontSize: "13px", marginBottom: "4px" }, children: f.name }),
        /* @__PURE__ */ m("div", { style: { color: "var(--text-secondary)" }, children: [
          f.pages.length,
          " page",
          f.pages.length !== 1 ? "s" : ""
        ] })
      ] }),
      !h && /* @__PURE__ */ m("div", { style: { color: "var(--text-muted)", lineHeight: 1.6 }, children: [
        /* @__PURE__ */ m("div", { children: [
          "File key: ",
          s.fileKey
        ] }),
        /* @__PURE__ */ m("div", { children: [
          "Node: ",
          s.nodeId || "None (file-level)"
        ] }),
        /* @__PURE__ */ m("div", { children: [
          "Type: ",
          s.fileType
        ] })
      ] })
    ] }) }),
    s && f && !h && /* @__PURE__ */ c("div", { className: "figma-plugin-section", children: /* @__PURE__ */ c("div", { style: { color: "var(--text-secondary)", fontSize: "12px" }, children: s.nodeId ? "Will extract the selected element" : "Will extract the whole page — select a specific element in Figma to narrow scope" }) }),
    s && f && !h && !F && /* @__PURE__ */ m("div", { className: "figma-plugin-mode-section", children: [
      /* @__PURE__ */ c("span", { className: "figma-plugin-mode-label", children: "Brief mode" }),
      /* @__PURE__ */ c("div", { className: "figma-plugin-mode-group", children: en.map((g) => /* @__PURE__ */ m(
        "div",
        {
          className: `figma-plugin-mode-card${Z === g.id ? " selected" : ""}`,
          onClick: () => xe(g.id),
          role: "radio",
          "aria-checked": Z === g.id,
          tabIndex: 0,
          onKeyDown: (N) => {
            (N.key === "Enter" || N.key === " ") && (N.preventDefault(), xe(g.id));
          },
          children: [
            /* @__PURE__ */ c("div", { className: "figma-plugin-mode-card-name", children: g.name }),
            /* @__PURE__ */ c("div", { className: "figma-plugin-mode-card-desc", children: g.description })
          ]
        },
        g.id
      )) }),
      Z === "inspiration" && /* @__PURE__ */ c(
        "textarea",
        {
          className: "figma-plugin-input figma-plugin-inspiration-textarea",
          placeholder: "Describe what to take from this design (e.g., 'Use the color palette and card layout pattern, but adapt spacing and typography to match our existing design system')",
          value: ae,
          onChange: (g) => Fe(g.target.value),
          rows: 3
        }
      )
    ] }),
    s && f && !h && i && /* @__PURE__ */ c(
      Rt,
      {
        designFileKey: s.fileKey,
        assets: K,
        onAdd: Me,
        onRemove: Ue,
        onClear: Be,
        onRename: Oe,
        onResolved: ze,
        onFormatChange: He,
        disabled: L || $ || H,
        shell: i,
        token: e
      }
    ),
    l && b && /* @__PURE__ */ c("div", { className: "figma-plugin-section", children: /* @__PURE__ */ m("div", { className: "figma-plugin-warning", children: [
      /* @__PURE__ */ m("strong", { children: [
        b.nodeCount,
        " layers detected"
      ] }),
      /* @__PURE__ */ c("p", { children: "Large selections may take longer and produce verbose output. Continue?" }),
      /* @__PURE__ */ m("div", { className: "figma-plugin-warning-actions", children: [
        /* @__PURE__ */ c("button", { className: "btn-primary", onClick: _e, children: "Continue" }),
        /* @__PURE__ */ c("button", { className: "btn-secondary", onClick: je, children: "Cancel" })
      ] })
    ] }) }),
    ye && /* @__PURE__ */ c("div", { className: "figma-plugin-section", children: /* @__PURE__ */ c("div", { className: "figma-plugin-error", children: ye }) }),
    F && M && Q && E && /* @__PURE__ */ c("div", { className: "figma-plugin-section", children: /* @__PURE__ */ m("div", { className: "figma-plugin-file-info", children: [
      /* @__PURE__ */ m("div", { style: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }, children: [
        /* @__PURE__ */ c("span", { style: { color: "#38a169" }, children: "✓" }),
        /* @__PURE__ */ c("span", { style: { fontWeight: 600, fontSize: "13px" }, children: "Brief ready" }),
        M.truncated && /* @__PURE__ */ c("span", { style: { color: "#f59e0b", fontSize: "11px" }, children: "(truncated)" })
      ] }),
      /* @__PURE__ */ c(
        "button",
        {
          className: "btn-primary",
          onClick: Ve,
          style: { width: "100%", marginBottom: "12px" },
          children: "Copy Brief to Clipboard"
        }
      ),
      /* @__PURE__ */ m("div", { style: { color: "var(--text-secondary)", fontSize: "12px", lineHeight: 1.6 }, children: [
        F.stats.nodeCount,
        " layers ·",
        " ",
        F.stats.assetCount,
        " assets ·",
        " ",
        /* @__PURE__ */ m("span", { style: {
          color: F.stats.estimatedTokens > Ce ? "#f59e0b" : "inherit"
        }, children: [
          "~",
          Math.round(F.stats.estimatedTokens / 1e3),
          "K tokens"
        ] })
      ] }),
      F.stats.estimatedTokens > Ce && /* @__PURE__ */ m("div", { className: "figma-plugin-warning", style: { marginTop: "8px" }, children: [
        /* @__PURE__ */ c("strong", { children: "This brief is large" }),
        /* @__PURE__ */ c("p", { children: "Consider extracting a smaller section for better results." })
      ] }),
      Q.components.length > 0 && /* @__PURE__ */ m("div", { style: { marginTop: "10px" }, children: [
        /* @__PURE__ */ c("div", { style: { color: "var(--text-muted)", fontSize: "11px", marginBottom: "4px" }, children: "Components" }),
        /* @__PURE__ */ m("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px" }, children: [
          Q.components.slice(0, 8).map((g) => /* @__PURE__ */ m(
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
                g.name,
                g.count > 1 ? ` x${g.count}` : ""
              ]
            },
            g.name
          )),
          Q.components.length > 8 && /* @__PURE__ */ m("span", { style: { fontSize: "11px", color: "var(--text-muted)", padding: "2px 4px" }, children: [
            "+",
            Q.components.length - 8,
            " more"
          ] })
        ] })
      ] }),
      E.warnings.length > 0 && (() => {
        const N = Array.from(E.warnings).map(
          (v) => typeof v == "string" ? v : JSON.stringify(v)
        );
        return N.length > 0 ? /* @__PURE__ */ m("div", { style: { marginTop: "8px", fontSize: "11px", color: "#f59e0b" }, children: [
          N.length,
          " warning",
          N.length !== 1 ? "s" : "",
          ":",
          /* @__PURE__ */ m("ul", { style: { margin: "4px 0 0 16px", padding: 0 }, children: [
            N.slice(0, 5).map((v, k) => /* @__PURE__ */ c("li", { children: v }, k)),
            N.length > 5 && /* @__PURE__ */ m("li", { children: [
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
          onClick: () => W(!P),
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
      P && /* @__PURE__ */ c("div", { style: { marginTop: "6px", padding: "8px", background: "var(--bg-primary)", borderRadius: "4px", border: "1px solid var(--border)", maxHeight: "200px", overflowY: "auto" }, children: /* @__PURE__ */ c(Pe, { nodes: M.rootNodes }) }),
      /* @__PURE__ */ c("div", { style: { color: "var(--text-muted)", fontSize: "11px", marginTop: "8px", textAlign: "center" }, children: "Also saved to .shipstudio/assets/brief.md" })
    ] }) }),
    (() => {
      const g = L || $ || H, N = L ? "Extracting layout..." : $ ? (p == null ? void 0 : p.phase) === "preview" ? "Rendering preview..." : `Exporting assets${p != null && p.total ? ` (${p.current ?? 0}/${p.total})` : ""}...` : H ? "Generating brief..." : F ? "Get New Brief" : K.filter((v) => v.status === "valid").length > 0 ? `Get Brief (${K.filter((v) => v.status === "valid").length} asset${K.filter((v) => v.status === "valid").length !== 1 ? "s" : ""})` : "Get Brief";
      return /* @__PURE__ */ m(
        "button",
        {
          className: F && !g ? "btn-secondary" : "btn-primary",
          onClick: We,
          disabled: Ke,
          style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
          children: [
            g && /* @__PURE__ */ c("span", { className: "figma-plugin-spinner", style: { width: "14px", height: "14px", borderWidth: "2px" } }),
            N
          ]
        }
      );
    })()
  ] });
}
function on({ onClick: e }) {
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
      children: /* @__PURE__ */ m(
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
function rn() {
  const e = se(), t = (e == null ? void 0 : e.storage) ?? null, i = (e == null ? void 0 : e.actions) ?? null, [o, n] = A(!1), [r, s] = A(null), [d, u] = A(null), [f, w] = A(!1), [h, C] = A("main");
  oe(() => {
    if (!t) return;
    let l = !1;
    return (async () => {
      try {
        const y = await t.read();
        !l && typeof y.figmaToken == "string" && (s(y.figmaToken), typeof y.figmaUserHandle == "string" && u({ id: "", handle: y.figmaUserHandle, img_url: "" }));
      } catch (y) {
        console.error("[figma] Failed to read storage:", y);
      } finally {
        l || w(!0);
      }
    })(), () => {
      l = !0;
    };
  }, [t]);
  const I = S(() => n(!0), []), x = S(() => {
    n(!1), C("main");
  }, []), L = S(async (l, y) => {
    if (!(!t || !i))
      try {
        const P = await t.read();
        await t.write({ ...P, figmaToken: l, figmaUserHandle: y.handle }), s(l), u(y), C("main"), i.showToast(`Connected as ${y.handle}`, "success");
      } catch {
        i.showToast("Failed to save token. Please try again.", "error");
      }
  }, [t, i]), z = S(async (l, y) => {
    if (!(!t || !i))
      try {
        const P = await t.read();
        await t.write({ ...P, figmaToken: l, figmaUserHandle: y.handle }), s(l), u(y), C("main"), i.showToast(`Token updated — connected as ${y.handle}`, "success");
      } catch {
        i.showToast("Failed to save token. Please try again.", "error");
      }
  }, [t, i]), M = S(async () => {
    if (!(!t || !i))
      try {
        const l = await t.read(), { figmaToken: y, figmaUserHandle: P, ...W } = l;
        await t.write(W), s(null), u(null), C("main"), i.showToast("Disconnected from Figma", "info");
      } catch {
        i.showToast("Failed to remove token. Please try again.", "error");
      }
  }, [t, i]), B = "Figma", b = r ? /* @__PURE__ */ c(on, { onClick: () => C("settings") }) : void 0;
  let R = null;
  return f && (r ? h === "settings" && d ? R = /* @__PURE__ */ c(
    tt,
    {
      currentUser: d,
      onTokenUpdated: z,
      onTokenRemoved: M,
      onBack: () => C("main")
    }
  ) : R = /* @__PURE__ */ c(nn, { token: r }) : R = /* @__PURE__ */ c(et, { onTokenSaved: L })), /* @__PURE__ */ m(re, { children: [
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
      qe,
      {
        open: o,
        onClose: x,
        title: B,
        headerRight: b,
        children: R
      }
    )
  ] });
}
const ln = "Figma", cn = {
  toolbar: rn
};
function dn() {
  console.log("[figma] Plugin activated");
}
function un() {
  console.log("[figma] Plugin deactivated");
}
export {
  ln as name,
  dn as onActivate,
  un as onDeactivate,
  cn as slots
};
