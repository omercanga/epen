const { app, BrowserWindow, ipcMain, globalShortcut, Tray, Menu, nativeImage } = require('electron');
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
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        fullscreen: true,
        hasShadow: false,
        titleBarStyle: 'hidden'
    });

    // Always enable mouse events for title bar area
    mainWindow.setIgnoreMouseEvents(!isDrawingMode, {
        forward: true,
        ignoreTitleBar: true
    });

    mainWindow.loadFile('index.html');

    // Send initial drawing mode state
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('init-drawing-mode', isDrawingMode);
    });

    mainWindow.on('close', () => {
        app.quit();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function toggleDrawingMode() {
    if (mainWindow) {
        isDrawingMode = !isDrawingMode;
        mainWindow.setIgnoreMouseEvents(!isDrawingMode, {
            forward: true,
            ignoreTitleBar: true
        });
        mainWindow.webContents.send('drawing-mode-changed', isDrawingMode);
    }
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
        const contextMenu = Menu.buildFromTemplate([
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
            { type: 'separator' },
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
        ]);
        tray.setContextMenu(contextMenu);
    }

    updateContextMenu();
    tray.setToolTip('ePen');
}

app.whenReady().then(() => {
    createWindow();
    createTray();

    // Register shortcuts
    globalShortcut.register('CommandOrControl+Shift+D', () => {
        if (mainWindow) {
            isDrawingMode = !isDrawingMode;
            mainWindow.setIgnoreMouseEvents(!isDrawingMode, { forward: true });
            mainWindow.webContents.send('drawing-mode-changed', isDrawingMode);
        }
    });

    globalShortcut.register('CommandOrControl+Q', () => {
        app.quit();
    });

    // Add get-language handler
    ipcMain.handle('get-language', () => {
        return getLanguage();
    });

    // Add toggle-drawing-mode handler
    ipcMain.on('toggle-drawing-mode', () => {
        if (mainWindow) {
            isDrawingMode = !isDrawingMode;
            mainWindow.setIgnoreMouseEvents(!isDrawingMode, { forward: true });
            mainWindow.webContents.send('drawing-mode-changed', isDrawingMode);
        }
    });
});

app.on('window-all-closed', () => {
    globalShortcut.unregisterAll();
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// Handle window close request from renderer
ipcMain.on('close-window', () => {
    app.quit();
}); 