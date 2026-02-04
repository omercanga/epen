# ePen v2 – Atomic Task List

Her görev tek bir dosya/değişiklik veya net test edilebilir çıktı ile sınırlıdır. Sıra önerilir; bağımlılıklar belirtilmiştir.

---

## Phase 0: Setup & Docs

| ID | Task | Deps | Deliverable |
|----|------|------|-------------|
| T0.1 | Create new workspace folder `epen-v2` (sibling to epen) | - | Empty folder |
| T0.2 | Initialize npm project (package.json, name, main, scripts) | T0.1 | package.json |
| T0.3 | Add Electron and electron-builder dependencies | T0.2 | package.json updated |
| T0.4 | Add electron-store dependency | T0.2 | package.json updated |
| T0.5 | Copy docs (TECHNICAL_SPEC, ARCHITECTURE, TASKS, UI_SPEC, API_CONTRACT) to epen-v2/docs | T0.1 | docs/ in v2 |
| T0.6 | Create src/main, src/preload, src/renderer, src/shared, assets dirs | T0.1 | Directory structure |

---

## Phase 1: Main Process

| ID | Task | Deps | Deliverable |
|----|------|------|-------------|
| T1.1 | Implement store.js: init electron-store, get/set language | T0.4 | src/main/store.js |
| T1.2 | Implement window.js: createWindow (transparent, always on top, work area size) | - | src/main/window.js |
| T1.3 | Add webPreferences: contextIsolation true, nodeIntegration false, preload path | T1.2 | src/main/window.js |
| T1.4 | Implement display logic: on move, get display and set bounds to work area | T1.2 | src/main/window.js |
| T1.5 | Implement display logic: on resize, same bounds rule | T1.2 | src/main/window.js |
| T1.6 | Load index.html from renderer in createWindow | T1.2 | src/main/window.js |
| T1.7 | Implement shortcuts.js: register CommandOrControl+D, unregister on app quit | - | src/main/shortcuts.js |
| T1.8 | Implement tray.js: create Tray with icon, tooltip "ePen" | T0.6 | src/main/tray.js |
| T1.9 | Tray left click: toggle drawing mode; double-click: quit | T1.8 | src/main/tray.js |
| T1.10 | Tray context menu: Toggle drawing, Language submenu, Quit | T1.8, T1.1 | src/main/tray.js |
| T1.11 | Main index: require window, tray, shortcuts; createWindow + createTray on ready | T1.2, T1.7, T1.8 | src/main/index.js |
| T1.12 | IPC: handle get-language (invoke) → return store or system locale | T1.1, T1.11 | src/main/index.js |
| T1.13 | IPC: on toggle-drawing-mode, toggle setIgnoreMouseEvents and send drawing-mode-changed | T1.11 | src/main/index.js |
| T1.14 | IPC: on close-window, app.quit | T1.11 | src/main/index.js |
| T1.15 | When drawing mode toggled (shortcut/tray), sync with window and send to renderer | T1.7, T1.9, T1.13 | src/main/index.js / window.js |
| T1.16 | On did-finish-load: send init-drawing-mode to renderer | T1.2 | src/main/window.js |
| T1.17 | macOS: setVisibleOnAllWorkspaces(true); window-all-closed: do not quit | T1.11 | src/main/index.js |
| T1.18 | Wire main entry to package.json "main" | T1.11 | package.json |

---

## Phase 2: Preload & IPC Contract

| ID | Task | Deps | Deliverable |
|----|------|------|-------------|
| T2.1 | Create preload.js: contextBridge.exposeInMainWorld('ePen', { ... }) | - | src/preload/preload.js |
| T2.2 | Expose getLanguage: () => ipcRenderer.invoke('get-language') | T2.1 | src/preload/preload.js |
| T2.3 | Expose onDrawingModeChanged: (cb) => ipcRenderer.on('drawing-mode-changed', (e, v) => cb(v)) | T2.1 | src/preload/preload.js |
| T2.4 | Expose onLanguageChange: (cb) => ipcRenderer.on('change-language', (e, lang) => cb(lang)) | T2.1 | src/preload/preload.js |
| T2.5 | Expose onInitDrawingMode: (cb) => ipcRenderer.on('init-drawing-mode', (e, v) => cb(v)) | T2.1 | src/preload/preload.js |
| T2.6 | Expose toggleDrawingMode: () => ipcRenderer.send('toggle-drawing-mode') | T2.1 | src/preload/preload.js |
| T2.7 | Expose closeWindow: () => ipcRenderer.send('close-window') | T2.1 | src/preload/preload.js |
| T2.8 | Set preload path in BrowserWindow webPreferences | T1.3 | src/main/window.js |

---

## Phase 3: Renderer – Shell & i18n

| ID | Task | Deps | Deliverable |
|----|------|------|-------------|
| T3.1 | Create index.html: structure only (title bar, toolbar placeholders, canvas, status bar) | - | src/renderer/index.html |
| T3.2 | Add data-i18n attributes to all user-visible strings | T3.1 | src/renderer/index.html |
| T3.3 | Copy translations.js to src/shared/translations.js | - | src/shared/translations.js |
| T3.4 | Implement i18n.js: applyTranslations(lang) using shared translations | T3.3 | src/renderer/i18n.js |
| T3.5 | On load: call window.ePen.getLanguage() and applyTranslations | T2.2, T3.4 | src/renderer/app.js |
| T3.6 | Subscribe to change-language and applyTranslations | T2.4, T3.5 | src/renderer/app.js |
| T3.7 | Link CSS (inline or external) for title bar, toolbar, status bar, canvas | T3.1 | src/renderer/index.html + optional styles.css |

---

## Phase 4: Renderer – State & Canvas Core

| ID | Task | Deps | Deliverable |
|----|------|------|-------------|
| T4.1 | Implement state.js: single object (tool, color, lineWidth, history, redoStack) + getters/setters | - | src/renderer/state.js |
| T4.2 | Create canvas element, get 2D context, set size to innerWidth/innerHeight × devicePixelRatio | T3.1 | src/renderer/canvas.js |
| T4.3 | On resize, re-size canvas and redraw from last history snapshot | T4.1, T4.2 | src/renderer/canvas.js |
| T4.4 | initCanvas: clear with transparent; push initial snapshot to history | T4.1 | src/renderer/canvas.js |
| T4.5 | saveState: push current canvas.toDataURL() to history, clear redoStack | T4.1 | src/renderer/canvas.js |
| T4.6 | undo: if history.length > 1, pop and restore previous snapshot; push current to redo | T4.1 | src/renderer/canvas.js |
| T4.7 | redo: if redoStack.length > 0, pop and draw; push current to history | T4.1 | src/renderer/canvas.js |
| T4.8 | clear: clear canvas, push snapshot (empty), clear redo | T4.1 | src/renderer/canvas.js |

---

## Phase 5: Renderer – Tools & Drawing

| ID | Task | Deps | Deliverable |
|----|------|------|-------------|
| T5.1 | Implement pen: mousedown start path, mousemove lineTo, mouseup stroke and saveState | T4.1, T4.2 | src/renderer/tools.js or canvas.js |
| T5.2 | Implement highlighter: same as pen with globalAlpha 0.3 | T5.1 | - |
| T5.3 | Implement eraser: same as pen with globalCompositeOperation 'destination-out' | T5.1 | - |
| T5.4 | Implement line: mousedown store start; mousemove redraw from snapshot + line; mouseup commit and saveState | T4.4 | - |
| T5.5 | Implement rectangle: drag rect from start to current; mouseup commit | T4.4 | - |
| T5.6 | Implement circle: center = start, radius = distance to current; mouseup commit | T4.4 | - |
| T5.7 | Apply lineCap round, lineJoin round; use state.color and state.lineWidth | T4.1 | - |
| T5.8 | Only handle draw events when drawing mode is active (ignore when passive) | T1.16, T3.5 | src/renderer/app.js / canvas.js |

---

## Phase 6: Renderer – UI Bindings

| ID | Task | Deps | Deliverable |
|----|------|------|-------------|
| T6.1 | Tool buttons: click sets state.tool and updates active class in DOM | T4.1, T3.1 | src/renderer/app.js |
| T6.2 | Color swatches + custom color input: set state.color | T4.1, T3.1 | src/renderer/app.js |
| T6.3 | Line width slider: set state.lineWidth and display value (e.g. "6px") | T4.1, T3.1 | src/renderer/app.js |
| T6.4 | Undo/Redo/Clear buttons call undo(), redo(), clear() | T4.6, T4.7, T4.8 | src/renderer/app.js |
| T6.5 | Toggle drawing mode button: call window.ePen.toggleDrawingMode() | T2.6 | src/renderer/app.js |
| T6.6 | Close button: call window.ePen.closeWindow() | T2.7 | src/renderer/app.js |
| T6.7 | Keyboard: Ctrl/Cmd+Z undo, Ctrl+Y or Cmd+Shift+Z redo, Ctrl/Cmd+Q quit, Ctrl/Cmd+Shift+D toggle | - | src/renderer/app.js |
| T6.8 | On drawing-mode-changed and init-drawing-mode: update status bar text and toolbar visibility/dim | T2.3, T2.5, T3.1 | src/renderer/app.js |
| T6.9 | Optional: P/E/L/R/C shortcut to select pen, eraser, line, rect, circle | T6.1 | src/renderer/app.js |

---

## Phase 7: Polish & Build

| ID | Task | Deps | Deliverable |
|----|------|------|-------------|
| T7.1 | Add tray icon asset (base64 or path) and use in tray | T1.8 | assets/ + tray.js |
| T7.2 | Ensure macOS shortcut text shows ⌘ in UI; Windows Ctrl | T3.1, T3.4 | renderer |
| T7.3 | electron-builder config: appId, productName, mac/win/linux targets, icons | T0.3 | package.json or config file |
| T7.4 | Scripts: start (electron .), build (electron-builder) | T0.2 | package.json |
| T7.5 | Test: npm start, toggle mode, draw with each tool, undo/redo, clear, language switch | All | Manual test pass |
| T7.6 | Test: move window to second display, resize | T1.4, T1.5 | Manual test pass |

---

## Dependency Graph (Summary)

- **Phase 0** → all others.
- **Phase 1** (main) → Phase 2 (preload path), Phase 6 (drawing mode).
- **Phase 2** → Phase 3 (i18n, getLanguage), Phase 6 (toggle, close).
- **Phase 3** → Phase 4, 5, 6 (HTML/CSS and i18n ready).
- **Phase 4** → Phase 5 (canvas and history).
- **Phase 5** → Phase 6 (tools used by UI).
- **Phase 6** → Phase 7 (everything wired).
- **Phase 7** depends on all.

---

## Checklist Per Task

- [ ] T0.1 – T0.6  
- [ ] T1.1 – T1.18  
- [ ] T2.1 – T2.8  
- [ ] T3.1 – T3.7  
- [ ] T4.1 – T4.8  
- [ ] T5.1 – T5.8  
- [ ] T6.1 – T6.9  
- [ ] T7.1 – T7.6  

Tamamlanan görevleri burada işaretleyebilir veya bir proje yönetim aracına taşıyabilirsiniz.
