const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ePen', {
  getLanguage: () => ipcRenderer.invoke('get-language'),
  getTranslations: () => ipcRenderer.invoke('get-translations'),
  onDrawingModeChanged: (cb) => {
    ipcRenderer.on('drawing-mode-changed', (_event, active) => cb(active));
  },
  onLanguageChange: (cb) => {
    ipcRenderer.on('change-language', (_event, lang) => cb(lang));
  },
  onInitDrawingMode: (cb) => {
    ipcRenderer.on('init-drawing-mode', (_event, active) => cb(active));
  },
  toggleDrawingMode: () => ipcRenderer.send('toggle-drawing-mode'),
  closeWindow: () => ipcRenderer.send('close-window')
});
