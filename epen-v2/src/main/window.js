const { BrowserWindow, screen } = require('electron');
const path = require('path');

const isDarwin = process.platform === 'darwin';

function getPreloadPath() {
  return path.join(__dirname, '..', 'preload', 'preload.js');
}

function getRendererPath() {
  return path.join(__dirname, '..', 'renderer', 'index.html');
}

function getDisplayWorkArea(display) {
  if (display.workArea && typeof display.workArea.x === 'number') {
    return { x: display.workArea.x, y: display.workArea.y, width: display.workArea.width, height: display.workArea.height };
  }
  return {
    x: display.bounds.x,
    y: display.bounds.y,
    width: display.workAreaSize.width,
    height: display.workAreaSize.height
  };
}

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const work = getDisplayWorkArea(primaryDisplay);

  const win = new BrowserWindow({
    x: work.x,
    y: work.y,
    width: work.width,
    height: work.height,
    transparent: true,
    frame: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: getPreloadPath()
    },
    backgroundColor: '#00000000',
    fullscreen: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    focusable: true,
    resizable: true,
    movable: true,
    minimizable: false,
    maximizable: false,
    closable: true,
    show: false,
    titleBarStyle: 'default'
  });

  if (isDarwin) {
    win.setVisibleOnAllWorkspaces(true);
  }

  win.loadFile(getRendererPath());

  win.once('ready-to-show', () => {
    win.setAlwaysOnTop(true);
    win.setBackgroundColor('#00000000');
    win.show();
  });

  let lastDisplayId = null;
  let moveDebounceTimer = null;
  const MOVE_DEBOUNCE_MS = 350;

  function getDisplayForWindow(window) {
    const bounds = window.getBounds();
    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;
    return screen.getDisplayNearestPoint({ x: centerX, y: centerY });
  }

  function snapWindowToDisplay(window, display) {
    const b = getDisplayWorkArea(display);
    if (isDarwin) {
      window.setAlwaysOnTop(false);
    }
    window.setBounds(b);
    if (isDarwin) {
      setTimeout(() => {
        window.setBounds(b);
        window.setAlwaysOnTop(true);
      }, 50);
    }
  }

  // Sürükleme bittikten sonra ekranı güncelle (sürüklerken setBounds çağırma, böylece pencere gerçekten taşınabilsin)
  win.on('move', () => {
    if (moveDebounceTimer) clearTimeout(moveDebounceTimer);
    moveDebounceTimer = setTimeout(() => {
      moveDebounceTimer = null;
      const display = getDisplayForWindow(win);
      if (lastDisplayId !== display.id) {
        lastDisplayId = display.id;
        snapWindowToDisplay(win, display);
      }
    }, MOVE_DEBOUNCE_MS);
  });

  win.on('resize', () => {
    const bounds = win.getBounds();
    const display = getDisplayForWindow(win);
    const work = getDisplayWorkArea(display);
    if (isDarwin) {
      snapWindowToDisplay(win, display);
    } else {
      win.setBounds({
        x: bounds.x,
        y: bounds.y,
        width: work.width,
        height: work.height
      });
    }
  });

  // Dışarıdan "şu ekrana taşı" çağrılabilir (tray menü için)
  win.moveToDisplay = function (display) {
    if (display) {
      lastDisplayId = display.id;
      snapWindowToDisplay(win, display);
    }
  };
  win.getDisplayForWindow = getDisplayForWindow.bind(null, win);

  return win;
}

module.exports = {
  createWindow,
  getPreloadPath,
  getRendererPath
};
