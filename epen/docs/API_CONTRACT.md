# ePen v2 – API Contract (Main ↔ Renderer)

## 1. Preload API (window.ePen)

Renderer only talks to the main process via this object. All methods are exposed through `contextBridge`.

### 1.1 getLanguage()

- **Returns:** `Promise<string>`
- **Description:** Returns current UI language code (e.g. `'en'`, `'tr'`).
- **Main:** Handled by `ipcMain.handle('get-language')`; returns stored language or system locale fallback.

### 1.2 onDrawingModeChanged(callback)

- **Parameters:** `callback: (active: boolean) => void`
- **Description:** Subscribe to drawing mode changes. `active === true` when drawing mode is ON.
- **Main:** Sent via `webContents.send('drawing-mode-changed', isDrawingMode)`.

### 1.3 onLanguageChange(callback)

- **Parameters:** `callback: (lang: string) => void`
- **Description:** Subscribe to language changes (e.g. user selected new language in tray).
- **Main:** Sent via `webContents.send('change-language', lang)`.

### 1.4 onInitDrawingMode(callback)

- **Parameters:** `callback: (active: boolean) => void`
- **Description:** Initial drawing mode state after page load.
- **Main:** Sent via `webContents.send('init-drawing-mode', isDrawingMode)` after did-finish-load.

### 1.5 toggleDrawingMode()

- **Returns:** `void`
- **Description:** Toggles drawing mode (same as toolbar button / shortcut / tray).
- **Main:** Listener `ipcMain.on('toggle-drawing-mode', ...)` toggles `setIgnoreMouseEvents` and sends `drawing-mode-changed`.

### 1.6 closeWindow()

- **Returns:** `void`
- **Description:** Requests app quit (same as close button).
- **Main:** Listener `ipcMain.on('close-window', () => app.quit())`.

---

## 2. IPC Channels (Internal)

| Channel | Direction | Payload | Purpose |
|---------|-----------|---------|---------|
| get-language | renderer → main (invoke) | - | Get current language |
| change-language | main → renderer (on) | lang: string | Notify new language |
| toggle-drawing-mode | renderer → main (send) | - | Toggle drawing mode |
| drawing-mode-changed | main → renderer (on) | active: boolean | Notify new mode |
| init-drawing-mode | main → renderer (on) | active: boolean | Initial mode on load |
| close-window | renderer → main (send) | - | Quit app |

---

## 3. Translation Keys (shared/translations.js)

Renderer and (if needed) main use these keys. Example shape:

```js
{
  en: {
    pen: 'Pen',
    highlighter: 'Highlighter',
    eraser: 'Eraser',
    line: 'Line',
    rectangle: 'Rectangle',
    circle: 'Circle',
    clear: 'Clear',
    undo: 'Undo',
    redo: 'Redo',
    drawMode: 'Drawing Mode',
    active: 'Active',
    inactive: 'Inactive',
    toggleDrawing: 'Toggle Drawing Mode',
    close: 'Close',
    opacity: 'Opacity'
  },
  tr: { ... },
  // other locales
}
```

---

## 4. No Other APIs

- Renderer must not use `require('electron')`, `process`, or `nodeIntegration`.
- All communication goes through `window.ePen` and the callbacks above.
