# ePen v2 – UI Specification

## 1. Layout (Same as current ePen)

- **Full window:** Transparent background; entire window is the “drawing surface” plus overlays.
- **Title bar:** Centered at top; contains app name, shortcut hints, close button. Always visible when drawing mode ON; can be dimmed when OFF.
- **Toolbar:** Horizontal bar below title bar, centered. Contains tool groups. Visible and interactive when drawing mode ON; hidden or non-interactive when OFF.
- **Canvas:** Fills the rest of the window (under title bar and toolbar); pointer events only when drawing mode ON.
- **Status bar:** Fixed bottom-right; small text (e.g. “Drawing Mode: Active”). Hidden or dimmed when drawing mode OFF.

## 2. Title Bar

- **Content:**  
  - Left: “ePen” (or i18n equivalent).  
  - Center/right: Shortcut hints, e.g. “Draw: ⌘+Shift+D | Close: ⌘+Q” (macOS) or “Draw: Ctrl+Shift+D | Close: Ctrl+Q” (Windows/Linux).  
  - Right: Close button (e.g. “✕”).
- **Style:** Semi-transparent white background (e.g. rgba(255,255,255,0.9)), rounded bottom corners, light shadow. When passive: more transparent (e.g. 0.3 opacity).
- **Behavior:** Draggable (native window drag). Close button quits app. All elements `pointer-events: auto` so they receive clicks.

## 3. Toolbar

- **Structure:** Groups of controls, separated by vertical dividers.
- **Group 1 – Stroke tools:** Pen, Highlighter, Eraser (icons + labels).
- **Group 2 – Shapes:** Line, Rectangle, Circle (icons + labels).
- **Group 3 – Color:** Preset swatches (e.g. black, red, lime, blue) + one “custom” swatch that opens color picker (input type="color").
- **Group 4 – Size:** Range input (1–20) and label (e.g. “6px”).
- **Group 5 – History:** Undo, Redo, Clear (icons + labels).
- **Group 6 – Mode:** “Toggle Drawing Mode” button (icon + label).

- **Style:** Same as title bar (semi-transparent white, rounded, shadow). Buttons: default white background, border, rounded; hover slightly gray; active tool with distinct background (e.g. #e0e0e0).
- **Icons:** Use inline SVG (same or similar to current app) for pen, highlighter, eraser, line, rectangle, circle, undo, redo, clear, draw mode.

## 4. Status Bar

- **Content:** Single line: “Drawing Mode: **Active**” or “Drawing Mode: **Inactive**” (+ optional shortcut hint).
- **Style:** Dark background (e.g. rgba(0,0,0,0.7)), white text, small font (e.g. 12px), rounded. “Active” in green or bold.
- **Position:** Fixed, bottom-right (e.g. 10px margin).
- **When passive:** Hidden or opacity 0.

## 5. Canvas

- **Size:** 100% of window inner size; scaled by devicePixelRatio for sharp lines.
- **Background:** Transparent (no fill or clear with transparent).
- **Cursor:** Default (arrow) or crosshair when drawing mode ON (optional).

## 6. Drawing Mode States

- **Active:** Toolbar and title bar fully visible and interactive; status bar “Active”; canvas accepts draw events.
- **Inactive:** Toolbar hidden or faded; title bar faded; status bar hidden; canvas does not receive draw events (clicks pass through).

## 7. i18n

- All visible strings come from `translations[lang]`: pen, highlighter, eraser, line, rectangle, circle, clear, undo, redo, drawMode, active, inactive, toggleDrawing, close, etc.
- Title bar and toolbar labels use `data-i18n` keys; on language change, replace text from translations.

## 8. Responsiveness

- Window is resizable; canvas and overlays resize with it. Toolbar stays centered; status bar stays bottom-right.
- No separate “mobile” layout for v2 (desktop only).

## 9. Accessibility (Minimum)

- Buttons and inputs focusable; keyboard shortcuts for main actions (undo, redo, quit, toggle mode).
- Color not the only differentiator for tools (icons + labels).
