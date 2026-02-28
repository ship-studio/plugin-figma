import { jsx as e, jsxs as i, Fragment as P } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export const jsx=R.createElement;export const jsxs=R.createElement;export const Fragment=R.Fragment;";
const V = window.__SHIPSTUDIO_REACT__, { useRef: se } = V;
function I() {
  return window.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__.current;
}
const F = "figma-plugin-styles", O = `
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
`, M = window.__SHIPSTUDIO_REACT__, { useEffect: A, useCallback: j } = M;
function K({ open: o, onClose: n, title: r, headerRight: u, children: s }) {
  A(() => {
    if (!o) return;
    let t = document.getElementById(F);
    return t || (t = document.createElement("style"), t.id = F, t.textContent = O, document.head.appendChild(t)), () => {
      const l = document.getElementById(F);
      l && l.remove();
    };
  }, [o]), A(() => {
    if (!o) return;
    const t = (l) => {
      l.key === "Escape" && n();
    };
    return document.addEventListener("keydown", t), () => document.removeEventListener("keydown", t);
  }, [o, n]);
  const a = j(
    (t) => {
      t.target === t.currentTarget && n();
    },
    [n]
  );
  return o ? /* @__PURE__ */ e("div", { className: "figma-plugin-overlay", onClick: a, children: /* @__PURE__ */ i("div", { className: "figma-plugin-modal", children: [
    /* @__PURE__ */ i("div", { className: "figma-plugin-modal-header", children: [
      /* @__PURE__ */ i(
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
      /* @__PURE__ */ e("span", { className: "figma-plugin-modal-title", children: r }),
      u && /* @__PURE__ */ e("div", { style: { marginLeft: "auto", display: "flex", alignItems: "center" }, children: u })
    ] }),
    /* @__PURE__ */ e("div", { className: "figma-plugin-modal-body", children: s })
  ] }) }) : null;
}
const W = "https://api.figma.com/v1";
async function z(o, n, r, u) {
  const s = `${W}${n}`, a = [
    "-sS",
    "-H",
    `X-Figma-Token: ${r}`,
    s
  ], t = await o.exec("curl", a, {
    timeout: 12e4
  });
  if (t.exit_code !== 0)
    throw new Error(`Figma API request failed: ${t.stderr || `exit code ${t.exit_code}`}`);
  if (!t.stdout.trim())
    throw new Error("Empty response from Figma API");
  let l;
  try {
    l = JSON.parse(t.stdout);
  } catch {
    throw new Error(`Invalid JSON from Figma API: ${t.stdout.slice(0, 200)}`);
  }
  if (l.status && l.err)
    throw l.status === 429 ? new Error("Rate limited by Figma API. Try again in a moment.") : l.status === 403 ? new Error("Invalid or expired token. Please update your Figma token.") : l.status === 404 ? new Error("File not found. Check that the URL is correct and you have access.") : new Error(`Figma API error: ${l.err}`);
  return l;
}
async function B(o, n) {
  return z(o, "/me", n);
}
async function G(o, n, r) {
  const u = await z(o, `/files/${r}?depth=1`, n);
  return {
    name: u.name,
    pages: u.document.children.filter((s) => s.type === "CANVAS").map((s) => ({ id: s.id, name: s.name }))
  };
}
const q = window.__SHIPSTUDIO_REACT__, { useState: R, useCallback: $ } = q;
function J({ onTokenSaved: o }) {
  const { shell: n } = I(), [r, u] = R(""), [s, a] = R(!1), [t, l] = R(null), g = $(async () => {
    const d = r.trim();
    if (!(!d || s)) {
      a(!0), l(null);
      try {
        const m = await B(n, d);
        o(d, m);
      } catch (m) {
        l((m == null ? void 0 : m.message) || "Failed to validate token. Please check and try again.");
      } finally {
        a(!1);
      }
    }
  }, [r, s, n, o]), y = $(
    (d) => {
      d.key === "Enter" && g();
    },
    [g]
  );
  return /* @__PURE__ */ i("div", { children: [
    /* @__PURE__ */ i("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ e("h3", { style: { fontSize: "14px", fontWeight: 600, margin: "0 0 8px 0" }, children: "Connect to Figma" }),
      /* @__PURE__ */ i("p", { style: { fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 16px 0", lineHeight: 1.5 }, children: [
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
    /* @__PURE__ */ i("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ e("label", { className: "figma-plugin-label", children: "Personal Access Token" }),
      /* @__PURE__ */ e(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: r,
          onChange: (d) => u(d.target.value),
          onKeyDown: y,
          disabled: s
        }
      ),
      t && /* @__PURE__ */ e("div", { className: "figma-plugin-error", children: t }),
      /* @__PURE__ */ e("div", { className: "figma-plugin-hint", children: "Token is stored locally in this project only." })
    ] }),
    /* @__PURE__ */ e(
      "button",
      {
        className: "btn-primary",
        onClick: g,
        disabled: !r.trim() || s,
        style: { width: "100%", marginTop: "4px" },
        children: s ? /* @__PURE__ */ i(P, { children: [
          /* @__PURE__ */ e("span", { className: "figma-plugin-spinner", style: { marginRight: "8px", verticalAlign: "middle" } }),
          "Connecting..."
        ] }) : "Connect"
      }
    )
  ] });
}
const X = window.__SHIPSTUDIO_REACT__, { useState: U, useCallback: L } = X;
function Y({ currentUser: o, onTokenUpdated: n, onTokenRemoved: r, onBack: u }) {
  const { shell: s } = I(), [a, t] = U(""), [l, g] = U(!1), [y, d] = U(null), m = L(async () => {
    const v = a.trim();
    if (!(!v || l)) {
      g(!0), d(null);
      try {
        const p = await B(s, v);
        n(v, p);
      } catch (p) {
        d((p == null ? void 0 : p.message) || "Failed to validate token. Please check and try again.");
      } finally {
        g(!1);
      }
    }
  }, [a, l, s, n]), h = L(
    (v) => {
      v.key === "Enter" && m();
    },
    [m]
  );
  return /* @__PURE__ */ i("div", { children: [
    /* @__PURE__ */ i(
      "button",
      {
        onClick: u,
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
    /* @__PURE__ */ e("div", { className: "figma-plugin-section", children: /* @__PURE__ */ i("div", { className: "figma-plugin-success", style: { display: "flex", alignItems: "center", gap: "6px", marginTop: "0" }, children: [
      /* @__PURE__ */ e("span", { style: { fontSize: "10px" }, children: "●" }),
      "Connected as ",
      o.handle
    ] }) }),
    /* @__PURE__ */ i("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ e("label", { className: "figma-plugin-label", children: "Update Token" }),
      /* @__PURE__ */ e(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: a,
          onChange: (v) => t(v.target.value),
          onKeyDown: h,
          disabled: l
        }
      ),
      y && /* @__PURE__ */ e("div", { className: "figma-plugin-error", children: y }),
      /* @__PURE__ */ e(
        "button",
        {
          className: "btn-primary",
          onClick: m,
          disabled: !a.trim() || l,
          style: { width: "100%", marginTop: "8px" },
          children: l ? /* @__PURE__ */ i(P, { children: [
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
        onClick: r,
        style: { width: "100%" },
        children: "Disconnect"
      }
    ) })
  ] });
}
function Z(o) {
  const n = o.match(
    /figma\.com\/(file|design|proto|board)\/([A-Za-z0-9]+)/
  );
  if (!n) return null;
  const r = n[1], u = n[2];
  let s = null;
  const a = o.match(/[?&]node-id=([^&]+)/);
  return a && (s = decodeURIComponent(a[1]).replace(/-/g, ":")), { fileKey: u, nodeId: s, fileType: r };
}
const Q = window.__SHIPSTUDIO_REACT__, { useState: k, useEffect: ee, useCallback: D, useRef: ne } = Q;
function te({ token: o }) {
  const { shell: n, actions: r } = I(), [u, s] = k(""), [a, t] = k(null), [l, g] = k("page"), [y, d] = k(null), [m, h] = k(!1), [v, p] = k(null), T = ne(0), _ = D(
    (w) => {
      const x = w.target.value;
      if (s(x), !x.trim()) {
        t(null), d(null), p(null), h(!1);
        return;
      }
      const c = Z(x);
      if (!c) {
        t(null), d(null), p("Please paste a valid Figma URL (file, design, proto, or board link)"), h(!1);
        return;
      }
      t(c), p(null), d(null), c.nodeId ? g("node") : g("page");
    },
    []
  );
  ee(() => {
    if (!a) return;
    const w = ++T.current;
    h(!0), d(null), p(null), (async () => {
      try {
        const x = await G(n, o, a.fileKey);
        T.current === w && (d(x), h(!1));
      } catch (x) {
        if (T.current === w) {
          const c = (x == null ? void 0 : x.message) || "Failed to validate file access.";
          c.includes("403") || c.includes("Invalid or expired") ? p("Cannot access this file. Check that your token has File content (Read) scope.") : c.includes("404") || c.includes("not found") ? p("File not found. Check that the URL is correct.") : c.includes("429") || c.includes("Rate limited") ? p("Rate limited by Figma. Please wait a moment and try again.") : p(c), h(!1);
        }
      }
    })();
  }, [a, n, o]);
  const S = D(() => {
    r.showToast("Extraction coming in next update", "info");
  }, [r]), E = !a || !y || m;
  return /* @__PURE__ */ i("div", { children: [
    /* @__PURE__ */ i("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ e("label", { className: "figma-plugin-label", children: "Figma URL" }),
      /* @__PURE__ */ e(
        "input",
        {
          className: "figma-plugin-input",
          type: "text",
          placeholder: "https://www.figma.com/design/...",
          value: u,
          onChange: _
        }
      ),
      v && /* @__PURE__ */ e("div", { className: "figma-plugin-error", children: v })
    ] }),
    a && /* @__PURE__ */ e("div", { className: "figma-plugin-section", children: /* @__PURE__ */ i("div", { className: "figma-plugin-file-info", children: [
      m && /* @__PURE__ */ i("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: y ? "8px" : "0" }, children: [
        /* @__PURE__ */ e("span", { className: "figma-plugin-spinner" }),
        /* @__PURE__ */ e("span", { style: { color: "var(--text-secondary)" }, children: "Checking access..." })
      ] }),
      y && /* @__PURE__ */ i("div", { style: { marginBottom: "8px" }, children: [
        /* @__PURE__ */ e("div", { style: { fontWeight: 600, fontSize: "13px", marginBottom: "4px" }, children: y.name }),
        /* @__PURE__ */ i("div", { style: { color: "var(--text-secondary)" }, children: [
          y.pages.length,
          " page",
          y.pages.length !== 1 ? "s" : ""
        ] })
      ] }),
      !m && /* @__PURE__ */ i("div", { style: { color: "var(--text-muted)", lineHeight: 1.6 }, children: [
        /* @__PURE__ */ i("div", { children: [
          "File key: ",
          a.fileKey
        ] }),
        /* @__PURE__ */ i("div", { children: [
          "Node: ",
          a.nodeId || "None (file-level)"
        ] }),
        /* @__PURE__ */ i("div", { children: [
          "Type: ",
          a.fileType
        ] })
      ] })
    ] }) }),
    a && /* @__PURE__ */ i("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ e("label", { className: "figma-plugin-label", children: "Extraction Scope" }),
      /* @__PURE__ */ i("div", { className: "figma-plugin-radio-group", children: [
        /* @__PURE__ */ i("label", { className: "figma-plugin-radio-label", style: a.nodeId ? void 0 : { opacity: 0.5, cursor: "not-allowed" }, children: [
          /* @__PURE__ */ e(
            "input",
            {
              type: "radio",
              name: "scope",
              value: "node",
              checked: l === "node",
              onChange: () => g("node"),
              disabled: !a.nodeId
            }
          ),
          "Single Node",
          !a.nodeId && /* @__PURE__ */ e("span", { className: "figma-plugin-hint", style: { marginTop: 0, marginLeft: "4px" }, children: "Paste a URL with a node-id to use this option" })
        ] }),
        /* @__PURE__ */ i("label", { className: "figma-plugin-radio-label", children: [
          /* @__PURE__ */ e(
            "input",
            {
              type: "radio",
              name: "scope",
              value: "frame",
              checked: l === "frame",
              onChange: () => g("frame")
            }
          ),
          "Frame"
        ] }),
        /* @__PURE__ */ i("label", { className: "figma-plugin-radio-label", children: [
          /* @__PURE__ */ e(
            "input",
            {
              type: "radio",
              name: "scope",
              value: "page",
              checked: l === "page",
              onChange: () => g("page")
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
        onClick: S,
        disabled: E,
        style: { width: "100%" },
        children: "Extract Design Brief"
      }
    )
  ] });
}
const ae = window.__SHIPSTUDIO_REACT__, { useState: C, useEffect: ie, useCallback: N } = ae;
function le({ onClick: o }) {
  return /* @__PURE__ */ e(
    "button",
    {
      onClick: o,
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
      children: /* @__PURE__ */ i(
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
function oe() {
  const o = I(), { storage: n, actions: r } = o, [u, s] = C(!1), [a, t] = C(null), [l, g] = C(null), [y, d] = C(!1), [m, h] = C("main");
  ie(() => {
    let c = !1;
    return (async () => {
      try {
        const f = await n.read();
        !c && typeof f.figmaToken == "string" && (t(f.figmaToken), typeof f.figmaUserHandle == "string" && g({ id: "", handle: f.figmaUserHandle, img_url: "" }));
      } catch (f) {
        console.error("[figma] Failed to read storage:", f);
      } finally {
        c || d(!0);
      }
    })(), () => {
      c = !0;
    };
  }, [n]);
  const v = N(() => s(!0), []), p = N(() => {
    s(!1), h("main");
  }, []), T = N(async (c, f) => {
    try {
      const b = await n.read();
      await n.write({ ...b, figmaToken: c, figmaUserHandle: f.handle }), t(c), g(f), h("main"), r.showToast(`Connected as ${f.handle}`, "success");
    } catch {
      r.showToast("Failed to save token. Please try again.", "error");
    }
  }, [n, r]), _ = N(async (c, f) => {
    try {
      const b = await n.read();
      await n.write({ ...b, figmaToken: c, figmaUserHandle: f.handle }), t(c), g(f), h("main"), r.showToast(`Token updated — connected as ${f.handle}`, "success");
    } catch {
      r.showToast("Failed to save token. Please try again.", "error");
    }
  }, [n, r]), S = N(async () => {
    try {
      const c = await n.read(), { figmaToken: f, figmaUserHandle: b, ...H } = c;
      await n.write(H), t(null), g(null), h("main"), r.showToast("Disconnected from Figma", "info");
    } catch {
      r.showToast("Failed to remove token. Please try again.", "error");
    }
  }, [n, r]), E = "Figma", w = a ? /* @__PURE__ */ e(le, { onClick: () => h("settings") }) : void 0;
  let x = null;
  return y && (a ? m === "settings" && l ? x = /* @__PURE__ */ e(
    Y,
    {
      currentUser: l,
      onTokenUpdated: _,
      onTokenRemoved: S,
      onBack: () => h("main")
    }
  ) : x = /* @__PURE__ */ e(te, { token: a }) : x = /* @__PURE__ */ e(J, { onTokenSaved: T })), /* @__PURE__ */ i(P, { children: [
    /* @__PURE__ */ e(
      "button",
      {
        onClick: v,
        title: "Figma Design Brief",
        className: "toolbar-icon-btn",
        children: /* @__PURE__ */ i(
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
      K,
      {
        open: u,
        onClose: p,
        title: E,
        headerRight: w,
        children: x
      }
    )
  ] });
}
const ce = "Figma", de = {
  toolbar: oe
};
function ge() {
  console.log("[figma] Plugin activated");
}
function ue() {
  console.log("[figma] Plugin deactivated");
}
export {
  ce as name,
  ge as onActivate,
  ue as onDeactivate,
  de as slots
};
