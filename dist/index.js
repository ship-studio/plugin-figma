import { jsxs as o, Fragment as c, jsx as e } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export const jsx=R.createElement;export const jsxs=R.createElement;export const Fragment=R.Fragment;";
const g = window.__SHIPSTUDIO_REACT__, { useRef: b } = g;
function s() {
  return window.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__.current;
}
const a = "figma-plugin-styles", p = `
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
`, m = window.__SHIPSTUDIO_REACT__, { useState: f, useEffect: d, useCallback: l } = m;
function u() {
  s();
  const [t, r] = f(!1), i = l(() => r(!0), []), n = l(() => r(!1), []);
  return /* @__PURE__ */ o(c, { children: [
    /* @__PURE__ */ e(
      "button",
      {
        onClick: i,
        title: "Figma Design Brief",
        className: "toolbar-icon-btn",
        children: /* @__PURE__ */ o(
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
    t && /* @__PURE__ */ e(x, { onClose: n })
  ] });
}
function x({ onClose: t }) {
  d(() => {
    let i = document.getElementById(a);
    return i || (i = document.createElement("style"), i.id = a, i.textContent = p, document.head.appendChild(i)), () => {
      const n = document.getElementById(a);
      n && n.remove();
    };
  }, []), d(() => {
    const i = (n) => {
      n.key === "Escape" && t();
    };
    return document.addEventListener("keydown", i), () => document.removeEventListener("keydown", i);
  }, [t]);
  const r = l(
    (i) => {
      i.target === i.currentTarget && t();
    },
    [t]
  );
  return /* @__PURE__ */ e("div", { className: "figma-plugin-overlay", onClick: r, children: /* @__PURE__ */ o("div", { className: "figma-plugin-modal", children: [
    /* @__PURE__ */ o("div", { className: "figma-plugin-modal-header", children: [
      /* @__PURE__ */ o(
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
      /* @__PURE__ */ e("span", { className: "figma-plugin-modal-title", children: "Figma Design Brief" })
    ] }),
    /* @__PURE__ */ e("div", { className: "figma-plugin-modal-body", children: /* @__PURE__ */ e("p", { style: { fontSize: "13px", color: "var(--text-secondary)" }, children: "Figma Plugin — Loading..." }) })
  ] }) });
}
const y = "Figma", v = {
  toolbar: u
};
function w() {
  console.log("[figma] Plugin activated");
}
function k() {
  console.log("[figma] Plugin deactivated");
}
export {
  y as name,
  w as onActivate,
  k as onDeactivate,
  v as slots
};
