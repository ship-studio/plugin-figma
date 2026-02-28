import { jsx as e, jsxs as r, Fragment as S } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export const jsx=R.createElement;export const jsxs=R.createElement;export const Fragment=R.Fragment;";
const D = window.__SHIPSTUDIO_REACT__, { useRef: ee } = D;
function E() {
  return window.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__.current;
}
const T = "figma-plugin-styles", H = `
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
`, B = window.__SHIPSTUDIO_REACT__, { useEffect: I, useCallback: O } = B;
function V({ open: o, onClose: n, title: a, headerRight: u, children: l }) {
  I(() => {
    if (!o) return;
    let t = document.getElementById(T);
    return t || (t = document.createElement("style"), t.id = T, t.textContent = H, document.head.appendChild(t)), () => {
      const i = document.getElementById(T);
      i && i.remove();
    };
  }, [o]), I(() => {
    if (!o) return;
    const t = (i) => {
      i.key === "Escape" && n();
    };
    return document.addEventListener("keydown", t), () => document.removeEventListener("keydown", t);
  }, [o, n]);
  const c = O(
    (t) => {
      t.target === t.currentTarget && n();
    },
    [n]
  );
  return o ? /* @__PURE__ */ e("div", { className: "figma-plugin-overlay", onClick: c, children: /* @__PURE__ */ r("div", { className: "figma-plugin-modal", children: [
    /* @__PURE__ */ r("div", { className: "figma-plugin-modal-header", children: [
      /* @__PURE__ */ r(
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
      /* @__PURE__ */ e("span", { className: "figma-plugin-modal-title", children: a }),
      u && /* @__PURE__ */ e("div", { style: { marginLeft: "auto", display: "flex", alignItems: "center" }, children: u })
    ] }),
    /* @__PURE__ */ e("div", { className: "figma-plugin-modal-body", children: l })
  ] }) }) : null;
}
const j = "https://api.figma.com/v1";
async function M(o, n, a, u) {
  const l = `${j}${n}`, c = [
    "-sS",
    "-H",
    `X-Figma-Token: ${a}`,
    l
  ], t = await o.exec("curl", c, {
    timeout: 12e4
  });
  if (t.exit_code !== 0)
    throw new Error(`Figma API request failed: ${t.stderr || `exit code ${t.exit_code}`}`);
  if (!t.stdout.trim())
    throw new Error("Empty response from Figma API");
  let i;
  try {
    i = JSON.parse(t.stdout);
  } catch {
    throw new Error(`Invalid JSON from Figma API: ${t.stdout.slice(0, 200)}`);
  }
  if (i.status && i.err)
    throw i.status === 429 ? new Error("Rate limited by Figma API. Try again in a moment.") : i.status === 403 ? new Error("Invalid or expired token. Please update your Figma token.") : i.status === 404 ? new Error("File not found. Check that the URL is correct and you have access.") : new Error(`Figma API error: ${i.err}`);
  return i;
}
async function P(o, n) {
  return M(o, "/me", n);
}
const G = window.__SHIPSTUDIO_REACT__, { useState: _, useCallback: N } = G;
function K({ onTokenSaved: o }) {
  const { shell: n } = E(), [a, u] = _(""), [l, c] = _(!1), [t, i] = _(null), m = N(async () => {
    const d = a.trim();
    if (!(!d || l)) {
      c(!0), i(null);
      try {
        const p = await P(n, d);
        o(d, p);
      } catch (p) {
        i((p == null ? void 0 : p.message) || "Failed to validate token. Please check and try again.");
      } finally {
        c(!1);
      }
    }
  }, [a, l, n, o]), y = N(
    (d) => {
      d.key === "Enter" && m();
    },
    [m]
  );
  return /* @__PURE__ */ r("div", { children: [
    /* @__PURE__ */ r("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ e("h3", { style: { fontSize: "14px", fontWeight: 600, margin: "0 0 8px 0" }, children: "Connect to Figma" }),
      /* @__PURE__ */ r("p", { style: { fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 16px 0", lineHeight: 1.5 }, children: [
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
    /* @__PURE__ */ r("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ e("label", { className: "figma-plugin-label", children: "Personal Access Token" }),
      /* @__PURE__ */ e(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: a,
          onChange: (d) => u(d.target.value),
          onKeyDown: y,
          disabled: l
        }
      ),
      t && /* @__PURE__ */ e("div", { className: "figma-plugin-error", children: t }),
      /* @__PURE__ */ e("div", { className: "figma-plugin-hint", children: "Token is stored locally in this project only." })
    ] }),
    /* @__PURE__ */ e(
      "button",
      {
        className: "btn-primary",
        onClick: m,
        disabled: !a.trim() || l,
        style: { width: "100%", marginTop: "4px" },
        children: l ? /* @__PURE__ */ r(S, { children: [
          /* @__PURE__ */ e("span", { className: "figma-plugin-spinner", style: { marginRight: "8px", verticalAlign: "middle" } }),
          "Connecting..."
        ] }) : "Connect"
      }
    )
  ] });
}
const W = window.__SHIPSTUDIO_REACT__, { useState: C, useCallback: F } = W;
function J({ currentUser: o, onTokenUpdated: n, onTokenRemoved: a, onBack: u }) {
  const { shell: l } = E(), [c, t] = C(""), [i, m] = C(!1), [y, d] = C(null), p = F(async () => {
    const f = c.trim();
    if (!(!f || i)) {
      m(!0), d(null);
      try {
        const x = await P(l, f);
        n(f, x);
      } catch (x) {
        d((x == null ? void 0 : x.message) || "Failed to validate token. Please check and try again.");
      } finally {
        m(!1);
      }
    }
  }, [c, i, l, n]), h = F(
    (f) => {
      f.key === "Enter" && p();
    },
    [p]
  );
  return /* @__PURE__ */ r("div", { children: [
    /* @__PURE__ */ r(
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
    /* @__PURE__ */ e("div", { className: "figma-plugin-section", children: /* @__PURE__ */ r("div", { className: "figma-plugin-success", style: { display: "flex", alignItems: "center", gap: "6px", marginTop: "0" }, children: [
      /* @__PURE__ */ e("span", { style: { fontSize: "10px" }, children: "●" }),
      "Connected as ",
      o.handle
    ] }) }),
    /* @__PURE__ */ r("div", { className: "figma-plugin-section", children: [
      /* @__PURE__ */ e("label", { className: "figma-plugin-label", children: "Update Token" }),
      /* @__PURE__ */ e(
        "input",
        {
          className: "figma-plugin-input",
          type: "password",
          placeholder: "figd_xxxxxxxxxxxxxxxx",
          value: c,
          onChange: (f) => t(f.target.value),
          onKeyDown: h,
          disabled: i
        }
      ),
      y && /* @__PURE__ */ e("div", { className: "figma-plugin-error", children: y }),
      /* @__PURE__ */ e(
        "button",
        {
          className: "btn-primary",
          onClick: p,
          disabled: !c.trim() || i,
          style: { width: "100%", marginTop: "8px" },
          children: i ? /* @__PURE__ */ r(S, { children: [
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
        onClick: a,
        style: { width: "100%" },
        children: "Disconnect"
      }
    ) })
  ] });
}
const X = window.__SHIPSTUDIO_REACT__, { useState: v, useEffect: q, useCallback: k } = X;
function Y({ onClick: o }) {
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
      children: /* @__PURE__ */ r(
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
function Q() {
  const o = E(), { storage: n, actions: a } = o, [u, l] = v(!1), [c, t] = v(null), [i, m] = v(null), [y, d] = v(!1), [p, h] = v("main");
  q(() => {
    let g = !1;
    return (async () => {
      try {
        const s = await n.read();
        !g && typeof s.figmaToken == "string" && (t(s.figmaToken), typeof s.figmaUserHandle == "string" && m({ id: "", handle: s.figmaUserHandle, img_url: "" }));
      } catch (s) {
        console.error("[figma] Failed to read storage:", s);
      } finally {
        g || d(!0);
      }
    })(), () => {
      g = !0;
    };
  }, [n]);
  const f = k(() => l(!0), []), x = k(() => {
    l(!1), h("main");
  }, []), A = k(async (g, s) => {
    try {
      const w = await n.read();
      await n.write({ ...w, figmaToken: g, figmaUserHandle: s.handle }), t(g), m(s), h("main"), a.showToast(`Connected as ${s.handle}`, "success");
    } catch {
      a.showToast("Failed to save token. Please try again.", "error");
    }
  }, [n, a]), R = k(async (g, s) => {
    try {
      const w = await n.read();
      await n.write({ ...w, figmaToken: g, figmaUserHandle: s.handle }), t(g), m(s), h("main"), a.showToast(`Token updated — connected as ${s.handle}`, "success");
    } catch {
      a.showToast("Failed to save token. Please try again.", "error");
    }
  }, [n, a]), U = k(async () => {
    try {
      const g = await n.read(), { figmaToken: s, figmaUserHandle: w, ...z } = g;
      await n.write(z), t(null), m(null), h("main"), a.showToast("Disconnected from Figma", "info");
    } catch {
      a.showToast("Failed to remove token. Please try again.", "error");
    }
  }, [n, a]), $ = "Figma", L = c ? /* @__PURE__ */ e(Y, { onClick: () => h("settings") }) : void 0;
  let b = null;
  return y && (c ? p === "settings" && i ? b = /* @__PURE__ */ e(
    J,
    {
      currentUser: i,
      onTokenUpdated: R,
      onTokenRemoved: U,
      onBack: () => h("main")
    }
  ) : b = /* @__PURE__ */ e("p", { style: { fontSize: "13px", color: "var(--text-secondary)" }, children: "Connected to Figma. URL input coming in the next update." }) : b = /* @__PURE__ */ e(K, { onTokenSaved: A })), /* @__PURE__ */ r(S, { children: [
    /* @__PURE__ */ e(
      "button",
      {
        onClick: f,
        title: "Figma Design Brief",
        className: "toolbar-icon-btn",
        children: /* @__PURE__ */ r(
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
      V,
      {
        open: u,
        onClose: x,
        title: $,
        headerRight: L,
        children: b
      }
    )
  ] });
}
const te = "Figma", ne = {
  toolbar: Q
};
function ie() {
  console.log("[figma] Plugin activated");
}
function ae() {
  console.log("[figma] Plugin deactivated");
}
export {
  te as name,
  ie as onActivate,
  ae as onDeactivate,
  ne as slots
};
