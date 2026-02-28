// Placeholder entry point - will be fully implemented in Task 2
export const name = 'Figma';

export const slots = {
  toolbar: () => null,
};

export function onActivate() {
  console.log('[figma] Plugin activated');
}

export function onDeactivate() {
  console.log('[figma] Plugin deactivated');
}
