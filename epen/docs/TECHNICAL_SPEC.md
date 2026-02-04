# ePen v2 – Technical Specification

**Version:** 1.0  
**Status:** Spec-driven reimplementation  
**Target:** Modern, maintainable, cross-platform drawing overlay app

---

## 1. Product Overview

### 1.1 Purpose
ePen is a **transparent overlay** desktop application that lets users draw on top of the screen (presentation/annotation style). It runs on Windows, macOS, and Linux with the same UI and behavior.

### 1.2 Core Value Proposition
- **Overlay:** Transparent window, always-on-top, full work area.
- **Drawing:** Pen, highlighter, eraser, and shapes (line, rectangle, circle).
- **Persistence:** Undo/redo, clear, optional save/open (future).
- **UX:** Toolbar, status bar, drawing mode toggle (click-through when inactive).

### 1.3 Out of Scope (v2 initial)
- Android build (can be added later).
- Save/Open/Load image (can be Phase 2).
- Multi-window/ multi-canvas (single window only for v2).

---

## 2. Functional Requirements

### 2.1 Window & Display
| ID | Requirement | Acceptance |
|----|-------------|------------|
| W1 | Transparent window, no background | `backgroundColor: #00000000` or equivalent |
| W2 | Window covers primary display work area | On launch, bounds = primary display workAreaSize |
| W3 | Always on top | `setAlwaysOnTop(true)` |
| W4 | Resizable/movable | User can move and resize; multi-monitor: window snaps to display under cursor |
| W5 | When moving to another monitor | Window resizes to that display’s work area |
| W6 | Framed window | Native title bar (no frameless); traffic lights on macOS at (10,10) if needed |
| W7 | macOS: visible on all workspaces | `setVisibleOnAllWorkspaces(true)` |

### 2.2 Drawing Mode (Click-Through)
| ID | Requirement | Acceptance |
|----|-------------|------------|
| D1 | **Drawing mode ON** | All mouse events go to app (toolbar, title bar, canvas) |
| D2 | **Drawing mode OFF** | `setIgnoreMouseEvents(true, { forward: true })` so clicks pass through to desktop |
| D3 | Toggle via UI | Toolbar button toggles mode |
| D4 | Toggle via shortcut | `Ctrl+Shift+D` (Win/Linux), `Cmd+Shift+D` (macOS) |
| D5 | Toggle via tray | Single click on tray icon toggles mode |
| D6 | State sync | Main window and tray show same active/inactive state |
| D7 | When inactive | Toolbar/title bar/status bar can be hidden or dimmed; canvas not interactive |

### 2.3 Canvas
| ID | Requirement | Acceptance |
|----|-------------|------------|
| C1 | Canvas fills window | `width/height` = window inner size, resizes with window |
| C2 | Transparent background | Canvas clear color transparent; no opaque background |
| C2b | High-DPI | Canvas scaled with devicePixelRatio so strokes are sharp |
| C3 | Drawing only in drawing mode | When mode is OFF, canvas does not receive draw events |

### 2.4 Tools
| ID | Tool | Behavior |
|----|------|----------|
| T1 | **Pen** | Freehand stroke, solid color, configurable width |
| T2 | **Highlighter** | Freehand stroke, same color with ~0.3 alpha |
| T3 | **Eraser** | Freehand, `destination-out`, configurable width |
| T4 | **Line** | Straight line from drag start to end |
| T5 | **Rectangle** | Rectangle from drag start to end (stroke only) |
| T6 | **Circle** | Circle: center = start, radius = distance to current point |

All stroke tools: `lineCap: 'round'`, `lineJoin: 'round'`.

### 2.5 Tool State
| ID | Requirement | Acceptance |
|----|-------------|------------|
| S1 | Current tool | One of pen, highlighter, eraser, line, rect, circle |
| S2 | Color | Hex color; applied to pen, highlighter, line, rect, circle |
| S3 | Line width | 1–20 px (or similar range); applied to pen, highlighter, eraser, shapes |
| S4 | UI reflects state | Tool buttons, color swatch, slider show current values |

### 2.6 History (Undo/Redo)
| ID | Requirement | Acceptance |
|----|-------------|------------|
| H1 | Undo | Revert to previous snapshot; at least one step |
| H2 | Redo | Reapply undone snapshot |
| H3 | New draw clears redo stack | After undo, any new stroke clears redo |
| H4 | Shortcuts | Ctrl+Z / Cmd+Z undo; Ctrl+Y or Cmd+Shift+Z redo (platform-appropriate) |
| H5 | Clear | Clears canvas and adds one snapshot so undo restores empty |

### 2.7 UI Elements
| ID | Element | Behavior |
|----|---------|----------|
| U1 | **Title bar** | App name "ePen"; shortcut hints (toggle, quit); close button |
| U2 | **Toolbar** | Tools, color palette, line width, undo/redo/clear, drawing mode toggle; only interactive when drawing mode ON (or always if we keep toolbar always visible) |
| U3 | **Status bar** | Drawing mode: Active/Inactive; optional coordinates |
| U4 | **Toolbar/status visibility** | Can hide/dim when drawing mode OFF (as in current app) |

### 2.8 Localization (i18n)
| ID | Requirement | Acceptance |
|----|-------------|------------|
| I1 | Languages | At least Turkish (tr) and English (en) |
| I2 | All UI strings from translation map | No hardcoded user-visible text |
| I3 | Persist language | Store preference (e.g. electron-store); apply on launch |
| I4 | Tray menu | Language switcher (e.g. submenu with language list) |

### 2.9 Shortcuts
| Action | Windows/Linux | macOS |
|--------|----------------|--------|
| Toggle drawing mode | Ctrl+Shift+D | Cmd+Shift+D |
| Quit | Ctrl+Q | Cmd+Q |
| Undo | Ctrl+Z | Cmd+Z |
| Redo | Ctrl+Y | Cmd+Shift+Z |

Optional: P, E, L, R, C for Pen, Eraser, Line, Rectangle, Circle.

### 2.10 System Tray
| ID | Requirement | Acceptance |
|----|-------------|------------|
| Y1 | Tray icon | Uses app icon (e.g. 16x16 or 32x32) |
| Y2 | Left click | Toggle drawing mode |
| Y3 | Double-click | Quit app |
| Y4 | Right-click context menu | Toggle drawing, Language submenu, Quit |
| Y5 | Tooltip | "ePen" |

### 2.11 Lifecycle
| ID | Requirement | Acceptance |
|----|-------------|------------|
| L1 | Single instance | One main window; close window = quit app |
| L2 | On close | Unregister global shortcuts, then quit |
| L3 | macOS: window-all-closed | Do not quit (keep tray); activate recreates window if needed |

---

## 3. Non-Functional Requirements

### 3.1 Performance
- Canvas redraw and input handling should feel immediate (no visible lag for strokes).
- Undo/redo with a reasonable history size (e.g. 50–100 steps) without freezing.

### 3.2 Security
- Use **contextIsolation: true** and **nodeIntegration: false** in BrowserWindow; expose only needed APIs via preload + `contextBridge`.
- No remote content; load only local HTML/JS/CSS.

### 3.3 Maintainability
- Clear separation: main process (window, tray, shortcuts, IPC), renderer (canvas, tools, UI).
- Single source of truth for tools and state; avoid duplicated logic (e.g. no second unused React/Konva implementation).

### 3.4 Compatibility
- Electron: current LTS (e.g. 28+ or 30+).
- Node: version aligned with Electron (e.g. 18+ or 20+).
- Platforms: Windows 10+, macOS 10.14+, modern Linux (e.g. Ubuntu 20.04+).

---

## 4. Technical Stack (Recommended)

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Runtime | Electron (latest stable) | Same as current; cross-platform overlay |
| Main process | Node.js (bundled with Electron) | Default |
| Renderer | Vanilla JS or lightweight framework | Avoid double stack (current has unused React+Kona in renderer.js); vanilla + Canvas 2D is enough for v2 |
| State (renderer) | Single state object + functions | Or a minimal store; no Redux required for v2 |
| Persistence | electron-store | Language, window size/position if we persist later |
| Build | electron-builder | Same as current |
| i18n | Plain JS object (like current translations.js) | Simple; can replace with i18next later if needed |

---

## 5. Data Structures (Conceptual)

### 5.1 Drawing State (Renderer)
```ts
// Conceptual only
interface DrawingState {
  tool: 'pen' | 'highlighter' | 'eraser' | 'line' | 'rect' | 'circle';
  color: string;        // hex
  lineWidth: number;    // 1–20
  history: string[];    // data URLs or serialized strokes
  redoStack: string[];
}
```

### 5.2 IPC Channels (Main ↔ Renderer)
- `get-language` (invoke) → string
- `change-language` (on, from main) → lang string
- `toggle-drawing-mode` (send from renderer)
- `drawing-mode-changed` (on, from main) → boolean
- `init-drawing-mode` (on, from main) → boolean
- `close-window` (send from renderer)

---

## 6. File Format (Future: Save/Load)

Not required for v2 first release; define for future:

- **Format:** PNG with transparency, or custom JSON (list of strokes) for editable save.
- **Default path:** User’s documents or app data directory.

---

## 7. Open Points

- Whether to keep toolbar always visible but non-interactive when drawing mode is OFF, or hide it (current: hide/dim).
- Maximum undo steps (e.g. 50).
- Optional: touch/pointer pressure for line width (if supported by platform).

---

## 8. References

- Current implementation: `main.js`, `index.html` (inline script), `translations.js`.
- README: feature list, shortcuts, platform notes.
