# ePen - Elektronik Kalem Uygulaması

ePen, ekran üzerinde çizim yapmanızı sağlayan çok platformlu bir uygulamadır. Windows, macOS, Linux ve Android platformlarında çalışır.

## Özellikler

- 🖌️ Çeşitli çizim araçları (kalem, fosforlu kalem, silgi)
- 📐 Şekil çizimi (çizgi, dikdörtgen, daire)
- 🎨 Renk seçimi ve özel renk paleti
- ↩️ Geri alma/ileri alma desteği
- 🌐 Çoklu dil desteği
- 💻 Tüm platformlarda çalışma
- ⌨️ Klavye kısayolları

## Klavye Kısayolları

- `Ctrl + Shift + D`: Çizim modunu aç/kapat
- `Ctrl + Q`: Uygulamayı kapat

## Kurulum

### Windows
1. [Releases](https://github.com/yourusername/epen/releases) sayfasından `ePen-Setup.exe` dosyasını indirin
2. İndirilen dosyayı çalıştırın ve kurulum adımlarını takip edin

### macOS
1. [Releases](https://github.com/yourusername/epen/releases) sayfasından `ePen.dmg` dosyasını indirin
2. DMG dosyasını açın ve ePen'i Applications klasörüne sürükleyin

### Linux
1. [Releases](https://github.com/yourusername/epen/releases) sayfasından `ePen.AppImage` dosyasını indirin
2. Dosyayı çalıştırılabilir yapın: `chmod +x ePen.AppImage`
3. Uygulamayı çalıştırın: `./ePen.AppImage`

### Android
1. Google Play Store'dan "ePen" uygulamasını indirin
2. Ya da APK dosyasını [Releases](https://github.com/yourusername/epen/releases) sayfasından indirip kurun

## Geliştirme

### Gereksinimler

- Node.js (>= 14.0.0)
- npm (>= 6.0.0)
- Electron (>= 20.0.0)
- Android için Android Studio ve Android SDK

### Kurulum

```bash
# Depoyu klonlayın
git clone https://github.com/yourusername/epen.git
cd epen

# Bağımlılıkları yükleyin
npm install

# Uygulamayı geliştirme modunda başlatın
npm start

# Platform bazlı derleme
npm run build:windows  # Windows için
npm run build:mac     # macOS için
npm run build:linux   # Linux için
npm run build:android # Android için
```

## Katkıda Bulunma

1. Bu depoyu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Bir Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

# ePen - Electronic Drawing Application

ePen is a cross-platform application that allows you to draw on your screen. It works on Windows, macOS, Linux, and Android platforms.

## Features

- 🖌️ Various drawing tools (pen, highlighter, eraser)
- 📐 Shape drawing (line, rectangle, circle)
- 🎨 Color selection and custom color palette
- ↩️ Undo/redo support
- 🌐 Multi-language support
- 💻 Cross-platform compatibility
- ⌨️ Keyboard shortcuts

## Keyboard Shortcuts

- `Ctrl + Shift + D`: Toggle drawing mode
- `Ctrl + Q`: Close application

## Installation

### Windows
1. Download `ePen-Setup.exe` from the [Releases](https://github.com/yourusername/epen/releases) page
2. Run the downloaded file and follow installation steps

### macOS
1. Download `ePen.dmg` from the [Releases](https://github.com/yourusername/epen/releases) page
2. Open the DMG file and drag ePen to Applications folder

### Linux
1. Download `ePen.AppImage` from the [Releases](https://github.com/yourusername/epen/releases) page
2. Make it executable: `chmod +x ePen.AppImage`
3. Run the application: `./ePen.AppImage`

### Android
1. Download "ePen" from Google Play Store
2. Or download and install the APK from [Releases](https://github.com/yourusername/epen/releases) page

## Development

### Requirements

- Node.js (>= 14.0.0)
- npm (>= 6.0.0)
- Electron (>= 20.0.0)
- Android Studio and Android SDK for Android

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/epen.git
cd epen

# Install dependencies
npm install

# Start the app in development mode
npm start

# Build for platforms
npm run build:windows  # For Windows
npm run build:mac     # For macOS
npm run build:linux   # For Linux
npm run build:android # For Android
```

## Contributing

1. Fork this repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details 