const { globalShortcut } = require('electron');

function registerShortcuts(win, onToggleDrawing, onMoveToNextDisplay) {
  globalShortcut.register('CommandOrControl+D', () => {
    if (onToggleDrawing) onToggleDrawing();
  });
  if (onMoveToNextDisplay) {
    globalShortcut.register('CommandOrControl+Shift+M', () => onMoveToNextDisplay());
  }
}

function unregisterAll() {
  globalShortcut.unregisterAll();
}

module.exports = {
  registerShortcuts,
  unregisterAll
};
