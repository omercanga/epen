const { app, ipcMain } = require('electron');
const path = require('path');
const store = require('./store');
const { createWindow } = require('./window');
const { createTray } = require('./tray');
const { registerShortcuts, unregisterAll } = require('./shortcuts');

let mainWindow = null;
let trayInstance = null;
let isDrawingMode = true;

const iconData = require('../../assets/icon.js');
const trayIconDataUrl = 'data:image/png;base64,' + iconData;

function getLanguage() {
  return store.getLanguage(app.getLocale());
}

function toggleDrawingMode() {
  if (!mainWindow) return;
  isDrawingMode = !isDrawingMode;
  mainWindow.setIgnoreMouseEvents(!isDrawingMode, { forward: true });
  mainWindow.webContents.send('drawing-mode-changed', isDrawingMode);
}

function moveToNextDisplay() {
  if (!mainWindow || typeof mainWindow.moveToDisplay !== 'function') return;
  const { screen } = require('electron');
  const displays = screen.getAllDisplays();
  if (displays.length < 2) return;
  const current = mainWindow.getDisplayForWindow ? mainWindow.getDisplayForWindow() : null;
  const currentIndex = current ? displays.findIndex((d) => d.id === current.id) : 0;
  const nextIndex = (currentIndex + 1) % displays.length;
  mainWindow.moveToDisplay(displays[nextIndex]);
}

function createTrayWithOptions() {
  const { tray, updateContextMenu } = createTray(trayIconDataUrl, {
    onToggleDrawing: () => toggleDrawingMode(),
    onQuit: () => app.quit(),
    onMoveToNextDisplay: () => moveToNextDisplay(),
    getLanguage: () => getLanguage(),
    setLanguage: (lang) => {
      store.setLanguage(lang);
      if (mainWindow) mainWindow.webContents.send('change-language', lang);
      updateContextMenu();
    },
    translations: store.translations
  });
  trayInstance = { tray, updateContextMenu };
}

app.whenReady().then(() => {
  mainWindow = createWindow();

  mainWindow.webContents.on('did-finish-load', () => {
    isDrawingMode = true;
    mainWindow.setIgnoreMouseEvents(false);
    mainWindow.webContents.send('drawing-mode-changed', isDrawingMode);
    mainWindow.webContents.send('init-drawing-mode', isDrawingMode);
  });

  registerShortcuts(mainWindow, () => toggleDrawingMode(), () => moveToNextDisplay());

  ipcMain.handle('get-language', () => getLanguage());
  ipcMain.handle('get-translations', () => store.translations);

  ipcMain.on('toggle-drawing-mode', () => toggleDrawingMode());
  ipcMain.on('close-window', () => app.quit());

  createTrayWithOptions();

  mainWindow.on('close', () => {
    unregisterAll();
    app.quit();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

app.on('window-all-closed', () => {
  unregisterAll();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    mainWindow = createWindow();
    createTrayWithOptions();
  }
});
