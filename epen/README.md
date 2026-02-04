# ePen - Elektronik Kalem Uygulaması

ePen, ekran üzerinde çizim yapmanızı sağlayan çok platformlu bir uygulamadır. Windows, macOS, Linux ve Android platformlarında çalışır.

## Özellikler

- 🖌️ Çeşitli çizim araçları (kalem, fosforlu kalem, silgi)
- 📐 Şekil çizimi (çizgi, dikdörtgen, daire)
- 🎨 Renk seçimi ve özel renk paleti
- ↩️ Geri alma/ileri alma desteği
- 🌐 Çoklu dil desteği (Türkçe, İngilizce)
- 💻 Tüm platformlarda çalışma
- ⌨️ Klavye kısayolları
- 🖥️ Çoklu pencere desteği
- 🎯 Hassas çizim kontrolü
- 📱 Dokunmatik ekran desteği

## Klavye Kısayolları

Windows:
- `Ctrl + Shift + D`: Çizim modunu aç/kapat
- `Ctrl + Q`: Uygulamayı kapat
- `Ctrl + Z`: Son işlemi geri al
- `Ctrl + Y`: Son işlemi ileri al
- `Ctrl + S`: Çizimi kaydet
- `Ctrl + O`: Çizim aç
- `Ctrl + N`: Yeni çizim

macOS:
- `⌘ + Shift + D`: Çizim modunu aç/kapat
- `⌘ + Q`: Uygulamayı kapat
- `⌘ + Z`: Son işlemi geri al
- `⌘ + Shift + Z`: Son işlemi ileri al
- `⌘ + S`: Çizimi kaydet
- `⌘ + O`: Çizim aç
- `⌘ + N`: Yeni çizim

## Kurulum

### Windows
1. [Releases](https://github.com/omercanga/epen/releases) sayfasından `ePen-Setup.exe` dosyasını indirin
2. İndirilen dosyayı çalıştırın ve kurulum adımlarını takip edin
3. Windows Defender uyarısı alırsanız "Daha fazla bilgi" > "Yine de çalıştır" seçeneğini kullanın

### macOS
1. [Releases](https://github.com/omercanga/epen/releases) sayfasından `ePen-1.0.0-arm64.dmg` dosyasını indirin
2. DMG dosyasını açın ve ePen'i Applications klasörüne sürükleyin
3. İlk kez açarken Finder'da uygulamaya sağ tıklayıp "Aç" seçeneğini kullanın
4. "Apple tarafından doğrulanamadı" uyarısı için:
   - Sistem Ayarları > Gizlilik ve Güvenlik bölümüne gidin
   - "Yine de aç" seçeneğini kullanın

Sistem Gereksinimleri:
- macOS 10.12 veya üzeri
- Apple Silicon (M1/M2) veya Intel işlemci
- 100MB boş disk alanı

### Linux
1. [Releases](https://github.com/omercanga/epen/releases) sayfasından `ePen.AppImage` dosyasını indirin
2. Dosyayı çalıştırılabilir yapın: `chmod +x ePen.AppImage`
3. Uygulamayı çalıştırın: `./ePen.AppImage`

Sistem Gereksinimleri:
- Modern Linux dağıtımı (Ubuntu 18.04+, Fedora 30+, vb.)
- AppImage desteği
- 100MB boş disk alanı

### Android
1. Google Play Store'dan "ePen" uygulamasını indirin
2. Ya da APK dosyasını [Releases](https://github.com/omercanga/epen/releases) sayfasından indirip kurun

Sistem Gereksinimleri:
- Android 8.0 veya üzeri
- 50MB boş depolama alanı
- Dokunmatik ekran desteği

## Geliştirme

### Gereksinimler

- Node.js (>= 14.0.0)
- npm (>= 6.0.0)
- Electron (>= 20.0.0)
- Android için Android Studio ve Android SDK

### Kurulum

```bash
# Depoyu klonlayın
git clone https://github.com/omercanga/epen.git
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

## Proje Yapısı

```
epen/
├── main.js           # Ana uygulama dosyası
├── renderer.js       # Renderer işlemleri
├── index.html        # Ana pencere HTML
├── styles.css        # Stil dosyası
├── translations.js   # Çeviri dosyası
├── package.json      # Proje bağımlılıkları
└── README.md         # Proje dokümantasyonu
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
- 🌐 Multi-language support (Turkish, English)
- 💻 Cross-platform compatibility
- ⌨️ Keyboard shortcuts
- 🖥️ Multi-window support
- 🎯 Precise drawing control
- 📱 Touch screen support

## Keyboard Shortcuts

Windows:
- `Ctrl + Shift + D`: Toggle drawing mode
- `Ctrl + Q`: Close application
- `Ctrl + Z`: Undo last action
- `Ctrl + Y`: Redo last action
- `Ctrl + S`: Save drawing
- `Ctrl + O`: Open drawing
- `Ctrl + N`: New drawing

macOS:
- `⌘ + D`: Toggle drawing mode
- `⌘ + Q`: Quit application
- `⌘ + Z`: Undo last action
- `⌘ + Shift + Z`: Redo last action
- `⌘ + S`: Save drawing
- `⌘ + O`: Open drawing
- `⌘ + N`: New drawing

## Installation

### Windows
1. Download `ePen-Setup.exe` from the [Releases](https://github.com/omercanga/epen/releases) page
2. Run the downloaded file and follow installation steps
3. If you get a Windows Defender warning, click "More info" > "Run anyway"

### macOS
1. Download `ePen-1.0.0-arm64.dmg` from the [Releases](https://github.com/omercanga/epen/releases) page
2. Open the DMG file and drag ePen to Applications folder
3. When opening for the first time, right-click the app in Finder and select "Open"
4. For "Cannot be verified" warning:
   - Go to System Settings > Privacy & Security
   - Click "Open Anyway"

System Requirements:
- macOS 10.12 or later
- Apple Silicon (M1/M2) or Intel processor
- 100MB free disk space

### Linux
1. Download `ePen.AppImage` from the [Releases](https://github.com/omercanga/epen/releases) page
2. Make it executable: `chmod +x ePen.AppImage`
3. Run the application: `./ePen.AppImage`

System Requirements:
- Modern Linux distribution (Ubuntu 18.04+, Fedora 30+, etc.)
- AppImage support
- 100MB free disk space

### Android
1. Download "ePen" from Google Play Store
2. Or download and install the APK from [Releases](https://github.com/omercanga/epen/releases) page

System Requirements:
- Android 8.0 or later
- 50MB free storage space
- Touch screen support

## Development

### Requirements

- Node.js (>= 14.0.0)
- npm (>= 6.0.0)
- Electron (>= 20.0.0)
- Android Studio and Android SDK for Android

### Setup

```bash
# Clone the repository
git clone https://github.com/omercanga/epen.git
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

## Project Structure

```
epen/
├── main.js           # Main application file
├── renderer.js       # Renderer operations
├── index.html        # Main window HTML
├── styles.css        # Style file
├── translations.js   # Translation file
├── package.json      # Project dependencies
└── README.md         # Project documentation
```

## Contributing

1. Fork this repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Arayüz Dili

### Menüler

Türkçe:
- **Dosya**
  - Yeni Çizim
  - Aç...
  - Kaydet
  - Farklı Kaydet...
  - Çıkış
- **Düzen**
  - Geri Al
  - İleri Al
  - Kes
  - Kopyala
  - Yapıştır
  - Tümünü Seç
- **Araçlar**
  - Kalem
  - Fosforlu Kalem
  - Silgi
  - Şekiller
    - Çizgi
    - Dikdörtgen
    - Daire
  - Renk Seç
- **Görünüm**
  - Çizim Modu
  - Her Zaman Üstte
  - Tam Ekran
- **Yardım**
  - Kısayollar
  - Hakkında

### Araç Çubuğu

Türkçe:
- Çizim Modunu Etkinleştir
- Kalem Aracı
- Fosforlu Kalem
- Silgi
- Şekil Çizimi
- Renk Seçici
- Kalınlık Ayarı

### Durum Çubuğu

Türkçe:
- Hazır
- Çizim Modu: Aktif/Pasif
- Seçili Araç: [araç adı]
- Koordinatlar: x, y

## Interface Language

### Menus

English:
- **File**
  - New Drawing
  - Open...
  - Save
  - Save As...
  - Exit
- **Edit**
  - Undo
  - Redo
  - Cut
  - Copy
  - Paste
  - Select All
- **Tools**
  - Pen
  - Highlighter
  - Eraser
  - Shapes
    - Line
    - Rectangle
    - Circle
  - Select Color
- **View**
  - Drawing Mode
  - Always on Top
  - Full Screen
- **Help**
  - Shortcuts
  - About

### Toolbar

English:
- Enable Drawing Mode
- Pen Tool
- Highlighter
- Eraser
- Shape Drawing
- Color Picker
- Thickness Setting

### Status Bar

English:
- Ready
- Drawing Mode: Active/Passive
- Selected Tool: [tool name]
- Coordinates: x, y 