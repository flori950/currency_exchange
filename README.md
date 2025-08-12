# Currency Converter App

Eine moderne React 19 + TypeScript Currency Converter Anwendung mit Apple Glass Design, Real-time Währungsumrechnung, historischen Charts und vielen weiteren Features.

## ✨ Features

### 🌍 Währungsumrechnung
- **Real-time Umrechnung** mit 150+ unterstützten Währungen
- **exchangerate.host API** für aktuelle Wechselkurse
- **Rate Limiting** (2-Sekunden-Intervalle) zum Schutz vor API-Missbrauch
- **Caching System** (1-Minute Cache) für optimierte Performance
- **Error Handling** mit AbortSignal-Timeouts und Fallback-Raten
- **Anti-Loop-Schutz** für API-Aufrufe

### 🎨 Design & UI
- **Apple Glass Design** mit Glassmorphismus-Effekten
- **backdrop-filter CSS** für authentische Glas-Optik
- **Dark/Light Mode Toggle** mit vollständiger Themenunterstützung
- **Responsive Design** optimiert für Mobile, Tablet und Desktop
- **Hervorragende Dark-Mode-Sichtbarkeit**
- **Smooth Animationen** und Übergänge

### 📊 Interaktive Features
- **Historische Charts** mit Chart.js Visualisierung (30 Tage)
- **Eingebauter Taschenrechner** für komplexe Berechnungen
- **Währungen tauschen** mit animiertem Button
- **Toast-Benachrichtigungssystem** für Benutzer-Feedback
- **Dropdown-Menüs** mit Suche für Währungsauswahl

### ⚙️ Technische Features
- **SEO-Optimierung** mit React Helmet für Meta-Tags
- **TypeScript** mit strikter Typisierung
- **Vite** als Build-Tool mit Hot Module Replacement
- **Lucide Icons** für moderne Icon-Bibliothek
- **CSS Custom Properties** für Glassmorphismus
- **Funktionale Settings-Buttons** mit Dropdown-Menüs

## 🛠 Tech Stack

- **React 19** - Moderne React-Features
- **TypeScript** - Typsicherheit und bessere DX
- **Vite** - Schneller Build-Tool und Dev-Server
- **Chart.js** + **react-chartjs-2** - Interaktive Charts
- **Lucide React** - Moderne Icon-Bibliothek
- **React Helmet Async** - SEO und Meta-Tags
- **CSS Custom Properties** - Native CSS-Variablen für Theming

## 🚀 Getting Started

### Voraussetzungen
- Node.js 18+ 
- npm oder yarn

### Installation
```bash
# Repository klonen oder herunterladen
cd currencychange

# Dependencies installieren
npm install

# Development server starten
npm run dev
```

Die App läuft dann unter `http://localhost:5173` (oder einem anderen Port falls 5173 belegt ist).

### Build für Production
```bash
# Production Build erstellen
npm run build

# Preview des Production Builds
npm run preview
```

## 📱 Verwendung

### Grundlegende Währungsumrechnung
1. **Ausgangswährung** auswählen (From)
2. **Betrag** eingeben
3. **Zielwährung** auswählen (To)
4. **Ergebnis** wird automatisch angezeigt

### Taschenrechner verwenden
1. **Taschenrechner-Icon** in der Header-Leiste klicken
2. **Berechnung** durchführen
3. **"Use" Button** klicken um Ergebnis zu übernehmen

### Historische Charts anzeigen
1. **Chart-Icon** in der Header-Leiste klicken
2. **30-Tage-Verlauf** des Wechselkurses anzeigen
3. **Interaktive Tooltips** beim Hover über Datenpunkte

### Settings & Themes
1. **Settings-Icon** klicken für Dropdown-Menü
2. **Dark/Light Mode** umschalten
3. **Cache leeren** bei Bedarf
4. **Cache-Status** und letzte Aktualisierung einsehen

## 🎯 Besondere Features

### Anti-Loop-Schutz
- Verhindert übermäßige API-Aufrufe durch intelligentes Rate Limiting
- Debouncing bei Benutzereingaben (500ms)

### Glassmorphismus Design
- Authentisches Apple Glass Design mit backdrop-filter
- Subtile Transparenz und Unschärfe-Effekte
- Responsive Glas-Elemente für alle Komponenten

### Robuste Error Handling
- Graceful Fallbacks bei API-Fehlern
- Toast-Notifications für Benutzer-Feedback
- Offline-Fallback-Raten für wichtige Währungen

### Performance Optimierung
- Intelligent Caching mit 1-Minute Lebensdauer
- Lazy Loading von historischen Daten
- Optimierte Bundle-Größe durch Code-Splitting

## 🌐 API

Die App verwendet die **exchangerate.host API** für aktuelle Wechselkurse:
- Kostenlos und ohne API-Key
- Unterstützt 150+ Währungen
- Historische Daten verfügbar
- Hohe Verfügbarkeit und Zuverlässigkeit

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) Datei für Details.

---

**Entwickelt mit ❤️ und modernen Web-Technologien**
