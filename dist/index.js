const o = "Figma", t = {
  toolbar: () => null
};
function n() {
  console.log("[figma] Plugin activated");
}
function a() {
  console.log("[figma] Plugin deactivated");
}
export {
  o as name,
  n as onActivate,
  a as onDeactivate,
  t as slots
};
