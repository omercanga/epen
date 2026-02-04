const { app, BrowserWindow, ipcMain, globalShortcut, Tray, Menu, nativeImage, screen } = require('electron');
const path = require('path');
const Store = require('electron-store');
const translations = require('./translations');
const iconData = require('./icon');

const store = new Store();
let mainWindow;
let tray;
let isDrawingMode = true;

// Get system language or saved language preference
function getLanguage() {
    const savedLang = store.get('language');
    if (savedLang && translations[savedLang]) {
        return savedLang;
    }
    const sysLang = app.getLocale().split('-')[0];
    return translations[sysLang] ? sysLang : 'en';
}

function createWindow() {
    const displays = screen.getAllDisplays();
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    const win = new BrowserWindow({
        width: width,
        height: height,
        transparent: true,
        frame: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
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
        titleBarStyle: 'default',
        trafficLightPosition: { x: 10, y: 10 }
    });

    // macOS için özel ayarlar
    if (process.platform === 'darwin') {
        win.setWindowButtonVisibility(true);
        win.setVisibleOnAllWorkspaces(true);
    }

    win.loadFile('index.html');
    
    win.webContents.on('did-finish-load', () => {
        win.setAlwaysOnTop(true);
        win.setMovable(true);
        win.setBackgroundColor('#00000000');
        win.setIgnoreMouseEvents(false);
        win.setOpacity(1);
        win.show();

        // Initialize drawing mode
        isDrawingMode = true;
        win.webContents.send('drawing-mode-changed', isDrawingMode);

        // Register global shortcuts for both Windows and Mac
        globalShortcut.register('CommandOrControl+D', () => {
            isDrawingMode = !isDrawingMode;
            if (isDrawingMode) {
                win.setIgnoreMouseEvents(false);
            } else {
                win.setIgnoreMouseEvents(true, { forward: true });
            }
            win.webContents.send('drawing-mode-changed', isDrawingMode);
        });
    });

    // Handle window move - debounce: sürükleme bittikten sonra ekranı güncelle (taşıma böylece çalışır)
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
        const newBounds = {
            x: display.bounds.x,
            y: display.bounds.y,
            width: display.workAreaSize.width,
            height: display.workAreaSize.height
        };
        window.setBounds(newBounds);
        if (process.platform === 'darwin') {
            setTimeout(() => window.setBounds(newBounds), 100);
        }
    }

    win.on('move', () => {
        if (moveDebounceTimer) clearTimeout(moveDebounceTimer);
        moveDebounceTimer = setTimeout(() => {
            moveDebounceTimer = null;
            const currentDisplay = getDisplayForWindow(win);
            if (lastDisplayId !== currentDisplay.id) {
                lastDisplayId = currentDisplay.id;
                snapWindowToDisplay(win, currentDisplay);
            }
        }, MOVE_DEBOUNCE_MS);
    });

    win.moveToDisplay = function (display) {
        if (display) {
            lastDisplayId = display.id;
            snapWindowToDisplay(win, display);
        }
    };
    win.getDisplayForWindow = function () { return getDisplayForWindow(win); };

    // Handle window resize
    win.on('resize', () => {
        const bounds = win.getBounds();
        const currentDisplay = getDisplayForWindow(win);
        
        if (process.platform === 'darwin') {
            snapWindowToDisplay(win, currentDisplay);
        } else {
            win.setBounds({
                x: bounds.x,
                y: bounds.y,
                width: currentDisplay.workAreaSize.width,
                height: currentDisplay.workAreaSize.height
            });
        }
    });

    // Handle drawing mode toggle
    ipcMain.on('toggle-drawing-mode', () => {
        isDrawingMode = !isDrawingMode;
        if (isDrawingMode) {
            // Enable drawing mode - allow all mouse events
            win.setIgnoreMouseEvents(false);
            win.setAlwaysOnTop(true);
            win.setMovable(true);
            win.setFocusable(true);
        } else {
            // Disable drawing mode - ignore mouse events but keep UI elements interactive
            win.setIgnoreMouseEvents(true, { forward: true });
            win.setAlwaysOnTop(true);
            win.setMovable(true);
            win.setFocusable(true);
        }
        win.webContents.send('drawing-mode-changed', isDrawingMode);
    });

    // Handle window focus
    win.on('focus', () => {
        win.setAlwaysOnTop(true);
        win.setMovable(true);
        win.setFocusable(true);
    });

    // Handle window blur
    win.on('blur', () => {
        win.setAlwaysOnTop(true);
        win.setMovable(true);
        win.setFocusable(true);
    });

    // Handle window click
    win.on('click', () => {
        win.setAlwaysOnTop(true);
        win.setMovable(true);
        win.setFocusable(true);
    });

    // Send initial drawing mode state
    win.webContents.on('did-finish-load', () => {
        win.webContents.send('init-drawing-mode', isDrawingMode);
    });

    win.on('close', () => {
        app.quit();
    });

    win.on('closed', () => {
        mainWindow = null;
    });
}

function moveToNextDisplay() {
    if (!mainWindow || typeof mainWindow.moveToDisplay !== 'function') return;
    const displays = screen.getAllDisplays();
    if (displays.length < 2) return;
    const current = mainWindow.getDisplayForWindow ? mainWindow.getDisplayForWindow() : null;
    const currentIndex = current ? displays.findIndex((d) => d.id === current.id) : 0;
    const nextIndex = (currentIndex + 1) % displays.length;
    mainWindow.moveToDisplay(displays[nextIndex]);
}

function createTray() {
    const icon = nativeImage.createFromDataURL('data:image/png;base64,' + iconData);
    tray = new Tray(icon);
    const currentLang = getLanguage();
    
    // Handle tray icon click
    tray.on('click', () => {
        if (mainWindow) {
            isDrawingMode = !isDrawingMode;
            mainWindow.setIgnoreMouseEvents(!isDrawingMode, { forward: true });
            mainWindow.webContents.send('drawing-mode-changed', isDrawingMode);
        }
    });

    // Handle double click to close
    tray.on('double-click', () => {
        app.quit();
    });
    
    function updateContextMenu() {
        const items = [
            {
                label: translations[currentLang].toggleDrawing,
                accelerator: 'Ctrl+Shift+D',
                click: () => {
                    if (mainWindow) {
                        isDrawingMode = !isDrawingMode;
                        mainWindow.setIgnoreMouseEvents(!isDrawingMode, { forward: true });
                        mainWindow.webContents.send('drawing-mode-changed', isDrawingMode);
                    }
                }
            },
            { type: 'separator' }
        ];
        if (screen.getAllDisplays().length >= 2) {
            items.push({
                label: translations[currentLang].moveToNextDisplay || 'Move to next display',
                click: () => moveToNextDisplay()
            });
            items.push({ type: 'separator' });
        }
        items.push(
            {
                label: 'Language',
                submenu: Object.keys(translations).map(lang => ({
                    label: lang.toUpperCase(),
                    type: 'radio',
                    checked: currentLang === lang,
                    click: () => {
                        store.set('language', lang);
                        if (mainWindow) {
                            mainWindow.webContents.send('change-language', lang);
                        }
                        updateContextMenu();
                    }
                }))
            },
            { type: 'separator' },
            {
                label: 'Quit',
                accelerator: 'Ctrl+Q',
                click: () => {
                    if (mainWindow) {
                        mainWindow.close();
                    }
                }
            }
        );
        tray.setContextMenu(Menu.buildFromTemplate(items));
    }

    updateContextMenu();
    tray.setToolTip('ePen');
}

app.whenReady().then(() => {
    createWindow();
    createTray();

    // Add get-language handler
    ipcMain.handle('get-language', () => {
        return getLanguage();
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    // Unregister all shortcuts when closing
    globalShortcut.unregisterAll();
    
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Handle window close request from renderer
ipcMain.on('close-window', () => {
    app.quit();
}); 