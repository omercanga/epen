const { Tray, Menu, nativeImage } = require('electron');
const path = require('path');

let tray = null;

function createTray(iconPathOrDataUrl, options) {
  const { onToggleDrawing, onQuit, onMoveToNextDisplay, getLanguage, setLanguage, translations } = options;

  let icon;
  if (typeof iconPathOrDataUrl === 'string' && iconPathOrDataUrl.startsWith('data:')) {
    icon = nativeImage.createFromDataURL(iconPathOrDataUrl);
  } else {
    icon = nativeImage.createFromPath(iconPathOrDataUrl);
  }
  if (icon.isEmpty()) {
    icon = nativeImage.createEmpty();
  }

  tray = new Tray(icon);

  tray.on('click', () => {
    if (onToggleDrawing) onToggleDrawing();
  });

  tray.on('double-click', () => {
    if (onQuit) onQuit();
  });

  function updateContextMenu() {
    const currentLang = getLanguage();
    const menuItems = [
      {
        label: translations[currentLang]?.toggleDrawing ?? 'Toggle Drawing',
        accelerator: 'Ctrl+Shift+D',
        click: () => onToggleDrawing && onToggleDrawing()
      },
      { type: 'separator' }
    ];
    if (onMoveToNextDisplay) {
      menuItems.push({
        label: translations[currentLang]?.moveToNextDisplay ?? 'Move to next display',
        accelerator: 'Ctrl+Shift+M',
        click: () => onMoveToNextDisplay()
      });
      menuItems.push({ type: 'separator' });
    }
    menuItems.push(
      {
        label: 'Language',
        submenu: Object.keys(translations).map((lang) => ({
          label: lang.toUpperCase(),
          type: 'radio',
          checked: currentLang === lang,
          click: () => setLanguage(lang)
        }))
      },
      { type: 'separator' },
      {
        label: 'Quit',
        accelerator: 'Ctrl+Q',
        click: () => onQuit && onQuit()
      }
    );
    tray.setContextMenu(Menu.buildFromTemplate(menuItems));
  }

  tray.setToolTip('ePen');
  updateContextMenu();

  return { tray, updateContextMenu };
}

module.exports = { createTray };
