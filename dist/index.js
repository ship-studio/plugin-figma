import { jsx as e, jsxs as a, Fragment as A } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export const jsx=R.createElement;export const jsxs=R.createElement;export const Fragment=R.Fragment;";
import { useEffect as F, useCallback as b, useState as f, useRef as _ } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export default R;export const{useState,useEffect,useCallback,useRef,useMemo,useContext,createContext,createElement,Fragment}=R;";
const L = window;
function E() {
  const t = L.__SHIPSTUDIO_REACT__, n = L.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__;
  return n && (t != null && t.useContext) ? t.useContext(n) : null;
}
const P = "figma-plugin-styles", B = `
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
function D({ open: t, onClose: n, title: l, headerRight: d, children: s }) {
  F(() => {
    if (!t) return;
    let i = document.getElementById(P);
    return i || (i = document.createElement("style"), i.id = P, i.textContent = B, document.head.appendChild(i)), () => {
      const o = document.getElementById(P);
      o && o.remove();
    };
  }, [t]), F(() => {
    if (!t) return;
    const i = (o) => {
      o.key === "Escape" && n();
    };
    return document.addEventListener("keydown", i), () => document.removeEventListener("keydown", i);
  }, [t, n]);
  const c = b(
    (i) => {
      i.target === i.currentTarget && n();
    },
    [n]
  );
  return t ? /* @__PURE__ */ e("div", { className: "figma-plugin-overlay", onClick: c, children: /* @__PURE__ */ a("div", { className: "figma-plugin-modal", children: [
    /* @__PURE__ */ a("div", { className: "figma-plugin-modal-header", children: [
      /* @__PURE__ */ a(
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
            /* @__PURE__ */ e("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1" }),
            /* @__PURE__ */ e("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1" }),
            /* @__PURE__ */ e("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1" }),
            /* @__PURE__ */ e("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1" })
          ]
        }
      ),
      /* @__PURE__ */ e("span", { className: "figma-plugin-modal-title", children: l }),
      d && /* @__PURE__ */ e("div", { style: { marginLeft: "auto", display: "flex", alignItems: "center" }, children: d })
    ] }),
    /* @__PURE__ */ e("div", { className: "figma-plugin-modal-body", children: s })
  ] }) }) : null;
}
const V = "https://api.figma.com/v1";
async function R(t, n, l, d) {
  const s = `${V}${n}`, c = Math.ceil(3e4 / 1e3), i = [
    "-sS",
    "--max-time",
    String(c),
    "-H",
    `X-Figma-Token: ${l}`,
    s
  ], o = await t.exec("curl", i, {
    timeout: 12e4
  });
  if (o.exit_code !== 0)
    throw new Error(`Figma API request failed: ${o.stderr || `exit code ${o.exit_code}`}`);
  if (!o.stdout.trim())
    throw new Error("Empty response from Figma API");
  let r;
  try {
    r = JSON.parse(o.stdout);
  } catch {
    throw new Error(`Invalid JSON from Figma API: ${o.stdout.slice(0, 200)}`);
  }
  if (r.status && r.err)
    throw r.status === 429 ? new Error("Rate limited by Figma API. Try again in a moment.") : r.status === 403 ? new Error("Invalid or expired token. Please update your Figma token.") : r.status === 404 ? new Error("File not found. Check that the URL is correct and you have access.") : new Error(`Figma API error: ${r.err}`);
  return r;
}
async function z(t, n) {
  return R(t, "/me", n);
}
async function H(t, n, l) {
  const d = await R(t, `/files/${l}?depth=1`, n);
  return {
    name: d.name,
    pages: d.document.children.filter((s) => s.type === "CANVAS").map((s) => ({ id: s.id, name: s.name }))
  };
}
function M({ onTokenSaved: t }) {
  const n = E(), l = (n == null ? void 0 : n.shell) ?? null, [d, s] = f(""), [c, i] = f(!1), [o, r] = f(null), y = b(async () => {
    if (!l) return;
    const m = d.trim();
    if (!(!m || c)) {
      i(!0), r(null);
      try {
        const u = await z(l, m);
        t(m, u);
      } catch (u) {
        r((u == null ? void 0 : u.message) || "Failed to validate token. Please check and try again.");
      } finally {
        i(!1);
      }
    }
  }, [d, c, l, t]), v = b(
    (m) => {
      m.key === "Enter" && y();
    },
    [y]
  );
  return /* @__PURE__ */ a("div", { children: [
    /* @__PURE__ */ a("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ e("h3", { style: { fontSize: "14px", fontWeight: 600, margin: "0 0 8px 0" }, children: "Connect to Figma" }),
      /* @__PURE__ */ a("p", { style: { fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 16px 0", lineHeight: 1.5 }, children: [
        "To get started, you need a Figma Personal Access Token.",
        " ",
        /* @__PURE__ */ e(
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
    /* @__PURE__ */ a("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ e("label", { className: "figma-plugin-label", children: "Personal Access Token" }),
      /* @__PURE__ */ e(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: d,
          onChange: (m) => s(m.target.value),
          onKeyDown: v,
          disabled: c
        }
      ),
      o && /* @__PURE__ */ e("div", { className: "figma-plugin-error", children: o }),
      /* @__PURE__ */ e("div", { className: "figma-plugin-hint", children: "Token is stored locally in this project only." })
    ] }),
    /* @__PURE__ */ e(
      "button",
      {
        className: "btn-primary",
        onClick: y,
        disabled: !d.trim() || c,
        style: { width: "100%", marginTop: "4px" },
        children: c ? /* @__PURE__ */ a(A, { children: [
          /* @__PURE__ */ e("span", { className: "figma-plugin-spinner", style: { marginRight: "8px", verticalAlign: "middle" } }),
          "Connecting..."
        ] }) : "Connect"
      }
    )
  ] });
}
function $({ currentUser: t, onTokenUpdated: n, onTokenRemoved: l, onBack: d }) {
  const s = E(), c = (s == null ? void 0 : s.shell) ?? null, [i, o] = f(""), [r, y] = f(!1), [v, m] = f(null), u = b(async () => {
    if (!c) return;
    const w = i.trim();
    if (!(!w || r)) {
      y(!0), m(null);
      try {
        const h = await z(c, w);
        n(w, h);
      } catch (h) {
        m((h == null ? void 0 : h.message) || "Failed to validate token. Please check and try again.");
      } finally {
        y(!1);
      }
    }
  }, [i, r, c, n]), k = b(
    (w) => {
      w.key === "Enter" && u();
    },
    [u]
  );
  return /* @__PURE__ */ a("div", { children: [
    /* @__PURE__ */ a(
      "button",
      {
        onClick: d,
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
          /* @__PURE__ */ e("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ e("polyline", { points: "15 18 9 12 15 6" }) }),
          "Back"
        ]
      }
    ),
    /* @__PURE__ */ e("div", { className: "figma-plugin-section", children: /* @__PURE__ */ a("div", { className: "figma-plugin-success", style: { display: "flex", alignItems: "center", gap: "6px", marginTop: "0" }, children: [
      /* @__PURE__ */ e("span", { style: { fontSize: "10px" }, children: "●" }),
      "Connected as ",
      t.handle
    ] }) }),
    /* @__PURE__ */ a("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ e("label", { className: "figma-plugin-label", children: "Update Token" }),
      /* @__PURE__ */ e(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: i,
          onChange: (w) => o(w.target.value),
          onKeyDown: k,
          disabled: r
        }
      ),
      v && /* @__PURE__ */ e("div", { className: "figma-plugin-error", children: v }),
      /* @__PURE__ */ e(
        "button",
        {
          className: "btn-primary",
          onClick: u,
          disabled: !i.trim() || r,
          style: { width: "100%", marginTop: "8px" },
          children: r ? /* @__PURE__ */ a(A, { children: [
            /* @__PURE__ */ e("span", { className: "figma-plugin-spinner", style: { marginRight: "8px", verticalAlign: "middle" } }),
            "Validating..."
          ] }) : "Update"
        }
      )
    ] }),
    /* @__PURE__ */ e("div", { className: "figma-plugin-section", style: { borderTop: "1px solid var(--border)", paddingTop: "16px" }, children: /* @__PURE__ */ e(
      "button",
      {
        className: "btn-secondary",
        onClick: l,
        style: { width: "100%" },
        children: "Disconnect"
      }
    ) })
  ] });
}
function j(t) {
  const n = t.match(
    /figma\.com\/(file|design|proto|board)\/([A-Za-z0-9]+)/
  );
  if (!n) return null;
  const l = n[1], d = n[2];
  let s = null;
  const c = t.match(/[?&]node-id=([^&]+)/);
  return c && (s = decodeURIComponent(c[1]).replace(/-/g, ":")), { fileKey: d, nodeId: s, fileType: l };
}
function K({ token: t }) {
  const n = E(), l = (n == null ? void 0 : n.shell) ?? null, d = (n == null ? void 0 : n.actions) ?? null, [s, c] = f(""), [i, o] = f(null), [r, y] = f("page"), [v, m] = f(null), [u, k] = f(!1), [w, h] = f(null), C = _(l);
  C.current = l;
  const I = _(0), S = b(
    (p) => {
      const g = p.target.value;
      if (c(g), !g.trim()) {
        o(null), m(null), h(null), k(!1);
        return;
      }
      const x = j(g);
      if (!x) {
        o(null), m(null), h("Please paste a valid Figma URL (file, design, proto, or board link)"), k(!1);
        return;
      }
      o(x), h(null), m(null), x.nodeId ? y("node") : y("page");
    },
    []
  );
  F(() => {
    if (!i || !C.current) return;
    const p = ++I.current, g = C.current;
    k(!0), m(null), h(null), (async () => {
      try {
        const x = await H(g, t, i.fileKey);
        I.current === p && (m(x), k(!1));
      } catch (x) {
        if (I.current === p) {
          const N = (x == null ? void 0 : x.message) || "Failed to validate file access.";
          N.includes("403") || N.includes("Invalid or expired") ? h("Cannot access this file. Check that your token has File content (Read) scope.") : N.includes("404") || N.includes("not found") ? h("File not found. Check that the URL is correct.") : N.includes("429") || N.includes("Rate limited") ? h("Rate limited by Figma. Please wait a moment and try again.") : h(N), k(!1);
        }
      }
    })();
  }, [i, t]);
  const U = b(() => {
    d && d.showToast("Extraction coming in next update", "info");
  }, [d]), T = !i || !v || u;
  return /* @__PURE__ */ a("div", { children: [
    /* @__PURE__ */ a("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ e("label", { className: "figma-plugin-label", children: "Figma URL" }),
      /* @__PURE__ */ e(
        "input",
        {
          className: "figma-plugin-input",
          type: "text",
          placeholder: "https://www.figma.com/design/...",
          value: s,
          onChange: S
        }
      ),
      w && /* @__PURE__ */ e("div", { className: "figma-plugin-error", children: w })
    ] }),
    i && /* @__PURE__ */ e("div", { className: "figma-plugin-section", children: /* @__PURE__ */ a("div", { className: "figma-plugin-file-info", children: [
      u && /* @__PURE__ */ a("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: v ? "8px" : "0" }, children: [
        /* @__PURE__ */ e("span", { className: "figma-plugin-spinner" }),
        /* @__PURE__ */ e("span", { style: { color: "var(--text-secondary)" }, children: "Checking access..." })
      ] }),
      v && /* @__PURE__ */ a("div", { style: { marginBottom: "8px" }, children: [
        /* @__PURE__ */ e("div", { style: { fontWeight: 600, fontSize: "13px", marginBottom: "4px" }, children: v.name }),
        /* @__PURE__ */ a("div", { style: { color: "var(--text-secondary)" }, children: [
          v.pages.length,
          " page",
          v.pages.length !== 1 ? "s" : ""
        ] })
      ] }),
      !u && /* @__PURE__ */ a("div", { style: { color: "var(--text-muted)", lineHeight: 1.6 }, children: [
        /* @__PURE__ */ a("div", { children: [
          "File key: ",
          i.fileKey
        ] }),
        /* @__PURE__ */ a("div", { children: [
          "Node: ",
          i.nodeId || "None (file-level)"
        ] }),
        /* @__PURE__ */ a("div", { children: [
          "Type: ",
          i.fileType
        ] })
      ] })
    ] }) }),
    i && /* @__PURE__ */ a("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ e("label", { className: "figma-plugin-label", children: "Extraction Scope" }),
      /* @__PURE__ */ a("div", { className: "figma-plugin-radio-group", children: [
        /* @__PURE__ */ a("label", { className: "figma-plugin-radio-label", style: i.nodeId ? void 0 : { opacity: 0.5, cursor: "not-allowed" }, children: [
          /* @__PURE__ */ e(
            "input",
            {
              type: "radio",
              name: "scope",
              value: "node",
              checked: r === "node",
              onChange: () => y("node"),
              disabled: !i.nodeId
            }
          ),
          "Single Node",
          !i.nodeId && /* @__PURE__ */ e("span", { className: "figma-plugin-hint", style: { marginTop: 0, marginLeft: "4px" }, children: "Paste a URL with a node-id to use this option" })
        ] }),
        /* @__PURE__ */ a("label", { className: "figma-plugin-radio-label", children: [
          /* @__PURE__ */ e(
            "input",
            {
              type: "radio",
              name: "scope",
              value: "frame",
              checked: r === "frame",
              onChange: () => y("frame")
            }
          ),
          "Frame"
        ] }),
        /* @__PURE__ */ a("label", { className: "figma-plugin-radio-label", children: [
          /* @__PURE__ */ e(
            "input",
            {
              type: "radio",
              name: "scope",
              value: "page",
              checked: r === "page",
              onChange: () => y("page")
            }
          ),
          "Entire Page"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e(
      "button",
      {
        className: "btn-primary",
        onClick: U,
        disabled: T,
        style: { width: "100%" },
        children: "Extract Design Brief"
      }
    )
  ] });
}
function O({ onClick: t }) {
  return /* @__PURE__ */ e(
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
      children: /* @__PURE__ */ a(
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
            /* @__PURE__ */ e("circle", { cx: "12", cy: "12", r: "3" }),
            /* @__PURE__ */ e("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" })
          ]
        }
      )
    }
  );
}
function W() {
  const t = E(), n = (t == null ? void 0 : t.storage) ?? null, l = (t == null ? void 0 : t.actions) ?? null, [d, s] = f(!1), [c, i] = f(null), [o, r] = f(null), [y, v] = f(!1), [m, u] = f("main");
  F(() => {
    if (!n) return;
    let p = !1;
    return (async () => {
      try {
        const g = await n.read();
        !p && typeof g.figmaToken == "string" && (i(g.figmaToken), typeof g.figmaUserHandle == "string" && r({ id: "", handle: g.figmaUserHandle, img_url: "" }));
      } catch (g) {
        console.error("[figma] Failed to read storage:", g);
      } finally {
        p || v(!0);
      }
    })(), () => {
      p = !0;
    };
  }, [n]);
  const k = b(() => s(!0), []), w = b(() => {
    s(!1), u("main");
  }, []), h = b(async (p, g) => {
    if (!(!n || !l))
      try {
        const x = await n.read();
        await n.write({ ...x, figmaToken: p, figmaUserHandle: g.handle }), i(p), r(g), u("main"), l.showToast(`Connected as ${g.handle}`, "success");
      } catch {
        l.showToast("Failed to save token. Please try again.", "error");
      }
  }, [n, l]), C = b(async (p, g) => {
    if (!(!n || !l))
      try {
        const x = await n.read();
        await n.write({ ...x, figmaToken: p, figmaUserHandle: g.handle }), i(p), r(g), u("main"), l.showToast(`Token updated — connected as ${g.handle}`, "success");
      } catch {
        l.showToast("Failed to save token. Please try again.", "error");
      }
  }, [n, l]), I = b(async () => {
    if (!(!n || !l))
      try {
        const p = await n.read(), { figmaToken: g, figmaUserHandle: x, ...N } = p;
        await n.write(N), i(null), r(null), u("main"), l.showToast("Disconnected from Figma", "info");
      } catch {
        l.showToast("Failed to remove token. Please try again.", "error");
      }
  }, [n, l]), S = "Figma", U = c ? /* @__PURE__ */ e(O, { onClick: () => u("settings") }) : void 0;
  let T = null;
  return y && (c ? m === "settings" && o ? T = /* @__PURE__ */ e(
    $,
    {
      currentUser: o,
      onTokenUpdated: C,
      onTokenRemoved: I,
      onBack: () => u("main")
    }
  ) : T = /* @__PURE__ */ e(K, { token: c }) : T = /* @__PURE__ */ e(M, { onTokenSaved: h })), /* @__PURE__ */ a(A, { children: [
    /* @__PURE__ */ e(
      "button",
      {
        onClick: k,
        title: "Figma Design Brief",
        className: "toolbar-icon-btn",
        children: /* @__PURE__ */ a(
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
              /* @__PURE__ */ e("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1" }),
              /* @__PURE__ */ e("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1" }),
              /* @__PURE__ */ e("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1" }),
              /* @__PURE__ */ e("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1" })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ e(
      D,
      {
        open: d,
        onClose: w,
        title: S,
        headerRight: U,
        children: T
      }
    )
  ] });
}
const J = "Figma", X = {
  toolbar: W
};
function Y() {
  console.log("[figma] Plugin activated");
}
function Z() {
  console.log("[figma] Plugin deactivated");
}
export {
  J as name,
  Y as onActivate,
  Z as onDeactivate,
  X as slots
};
