# ePen v2

Spec-driven, modernized reimplementation of ePen (electronic drawing overlay).

## Workspace

This project lives in **epen-v2** (sibling to the original **epen** folder). Same look and behavior, cleaner architecture and security.

## Docs (in `docs/`)

- **TECHNICAL_SPEC.md** – Functional and non-functional requirements
- **ARCHITECTURE.md** – Main vs renderer, preload, data flow
- **TASKS.md** – Atomic task list (Phase 0–7) with checklist
- **UI_SPEC.md** – Layout, title bar, toolbar, status bar
- **API_CONTRACT.md** – Preload API and IPC channels

## Run

```bash
cd epen-v2
npm install
npm start
```

## Build

```bash
npm run build        # all platforms
npm run build:mac    # macOS
npm run build:windows
npm run build:linux
```

## Structure

```
src/
  main/       # Electron main process (window, tray, shortcuts, IPC, store)
  preload/    # contextBridge API for renderer
  renderer/   # HTML, canvas, tools, state, i18n (vanilla JS)
  shared/     # translations (used by main + renderer via IPC)
assets/       # tray icon
docs/         # specs and tasks
```

## Security

- `contextIsolation: true`, `nodeIntegration: false`
- All renderer ↔ main communication via `window.ePen` (preload)

## Task Progress

See `docs/TASKS.md` for the full checklist. Phases 0–6 are implemented; Phase 7 (polish, build config) can be completed next.
