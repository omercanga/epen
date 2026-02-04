# ePen v2 – Architecture

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Electron App                             │
├─────────────────────────────────────────────────────────────────┤
│  Main Process (Node)          │  Renderer Process (Browser)       │
│  ─────────────────           │  ─────────────────────────        │
│  • Window lifecycle           │  • UI (title bar, toolbar,        │
│  • Tray + context menu        │    status bar, canvas)            │
│  • Global shortcuts           │  • Canvas 2D drawing              │
│  • Multi-display bounds       │  • Tool state & history           │
│  • setIgnoreMouseEvents       │  • i18n (apply translations)      │
│  • electron-store (lang)      │  • Preload: safe IPC only         │
│                               │                                   │
│  ◄────── IPC ──────────────►  │  contextBridge API                │
└─────────────────────────────────────────────────────────────────┘
```

## 2. Process Responsibilities

### 2.1 Main Process
- **Window:** Create BrowserWindow (transparent, always on top, work area size), load `index.html`.
- **Display:** On move/resize, detect display and set bounds to that display’s work area.
- **Drawing mode:** Toggle `setIgnoreMouseEvents` and send `drawing-mode-changed` to renderer.
- **Shortcuts:** Register `CommandOrControl+D` for toggle; unregister on quit.
- **Tray:** Create tray with icon, click = toggle mode, double-click = quit, context menu (toggle, language, quit).
- **Storage:** electron-store for language (and optionally window position later).
- **IPC handlers:** `get-language` (invoke), respond to `toggle-drawing-mode`, `close-window`.

### 2.2 Renderer Process
- **UI:** Title bar, toolbar (tools, color, width, undo/redo/clear, mode toggle), status bar, canvas.
- **Canvas:** Single `<canvas>`, 2D context; size = innerWidth/innerHeight × devicePixelRatio; draw only when drawing mode ON.
- **Tools:** Pen, highlighter, eraser (freehand); line, rect, circle (drag shape). One active tool, shared color/width.
- **History:** Snapshot-based undo/redo (canvas.toDataURL); clear adds empty snapshot.
- **i18n:** Load language via invoke; on `change-language` replace all `[data-i18n]` text from translations.
- **No Node in renderer:** Use only preload-exposed API (e.g. `window.ePen.getLanguage()`, `window.ePen.toggleDrawingMode()`, etc.).

### 2.3 Preload Script
- **contextBridge:** Expose minimal API, e.g.:
  - `getLanguage(): Promise<string>`
  - `onDrawingModeChanged(cb: (active: boolean) => void)`
  - `onLanguageChange(cb: (lang: string) => void)`
  - `toggleDrawingMode(): void`
  - `closeWindow(): void`
- Use `ipcRenderer.invoke`, `ipcRenderer.on`, `ipcRenderer.send` inside preload only; never expose `require('electron')` to the page.

## 3. Recommended Directory Layout (v2)

```
epen-v2/
├── package.json
├── electron-builder config (in package.json or electron-builder.yml)
├── src/
│   ├── main/
│   │   ├── index.js          # Entry: createWindow, createTray, IPC
│   │   ├── window.js         # createWindow, bounds, display logic
│   │   ├── tray.js           # createTray, context menu
│   │   ├── shortcuts.js      # register/unregister
│   │   └── store.js          # electron-store wrapper
│   ├── preload/
│   │   └── preload.js        # contextBridge API
│   ├── renderer/
│   │   ├── index.html        # Shell: title bar, toolbar, canvas, status
│   │   ├── app.js            # Init: canvas, UI bindings, i18n
│   │   ├── canvas.js         # Drawing loop, tools, history
│   │   ├── tools.js          # Tool behavior (pen, highlighter, etc.)
│   │   ├── state.js          # Single state object + setters
│   │   └── i18n.js           # applyTranslations(lang)
│   └── shared/
│       └── translations.js   # { en: {...}, tr: {...}, ... }
├── assets/
│   └── icon (base64 or path for tray)
└── docs/                     # Copy of TECHNICAL_SPEC, ARCHITECTURE, TASKS
```

## 4. Data Flow

### 4.1 Drawing Mode
1. User clicks toolbar “Toggle drawing” or uses shortcut / tray.
2. Renderer sends `toggle-drawing-mode` (or main handles shortcut/tray).
3. Main toggles `isDrawingMode`, calls `setIgnoreMouseEvents(!isDrawingMode, { forward: true })`, sends `drawing-mode-changed` to renderer.
4. Renderer updates UI (status bar, toolbar visibility/dim) and enables/disables canvas drawing.

### 4.2 Language
1. On load: renderer calls `getLanguage()` → main returns stored or system locale.
2. Renderer calls `applyTranslations(lang)`.
3. User changes language in tray menu → main sets store, sends `change-language` → renderer applies again.

### 4.3 Canvas Drawing
1. User selects tool (pen/highlighter/eraser/line/rect/circle) and optional color/width.
2. mousedown: start path or store start point for shapes.
3. mousemove: append points (freehand) or redraw preview (shapes).
4. mouseup/mouseleave: commit stroke, push snapshot to history, clear redo.

## 5. Security

- **contextIsolation: true**, **nodeIntegration: false**.
- **sandbox: false** only if required for native bindings (e.g. tray); otherwise consider sandbox for renderer.
- Preload script is the only bridge; no `require('electron')` or `process` in renderer.
- Load only file:// or trusted content; no `webSecurity: false`.

## 6. Testing Strategy (Future)

- **Unit:** State and history logic (pure functions) in Node or renderer test runner.
- **E2E:** Playwright or Spectron for “open app, toggle mode, draw stroke, undo” flows.
- **Manual:** Per-platform (Win/Mac/Linux) for overlay, multi-monitor, shortcuts.

## 7. Migration from Current Codebase

- **main.js** → split into `window.js`, `tray.js`, `shortcuts.js`, `store.js`; keep IPC in main entry.
- **index.html** → strip inline script; move to `app.js`, `canvas.js`, `tools.js`, `state.js`, `i18n.js`.
- **translations.js** → move to `shared/`; use from main (tray labels) and renderer (via preload or bundled copy).
- **renderer.js** (React+Konva): remove or leave unused; v2 uses vanilla canvas only.
