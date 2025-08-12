# Currency Converter App

A modern React 19 + TypeScript Currency Converter application with Apple Glass Design, real-time currency conversion, historical charts, and many additional features.

**🌐 Live Demo:** [currencyexchange.florian-hunter.de](https://currencyexchange.florian-hunter.de)

**👨‍💻 Developed by:** [Florian Jäger](https://florian-hunter.de) | [GitHub](https://github.com/flroi950)

## ✨ Features

### 🌍 Currency Conversion
- **Real-time conversion** with 150+ supported currencies
- **exchangerate.host API** for current exchange rates
- **Rate limiting** (2-second intervals) to prevent API abuse
- **Caching system** (1-minute cache) for optimized performance
- **Error handling** with AbortSignal timeouts and fallback rates
- **Anti-loop protection** for API calls

### 🎨 Design & UI
- **Apple Glass Design** with glassmorphism effects
- **backdrop-filter CSS** for authentic glass appearance
- **Dark/Light mode toggle** with complete theme support
- **Responsive design** optimized for Mobile, Tablet, and Desktop
- **Excellent dark mode visibility**
- **Smooth animations** and transitions

### 📊 Interactive Features
- **Historical charts** with Chart.js visualization (30 days)
- **Built-in calculator** for complex calculations
- **Currency swap** with animated button
- **Toast notification system** for user feedback
- **Dropdown menus** with search for currency selection

### ⚙️ Technical Features
- **SEO optimization** with React Helmet for meta tags
- **TypeScript** with strict typing
- **Vite** as build tool with Hot Module Replacement
- **Lucide Icons** for modern icon library
- **CSS Custom Properties** for glassmorphism
- **Functional settings buttons** with dropdown menus

### 🚀 Deployment & DevOps
- **FTP Deployment** - Automated deployment to FTP server
- **GitHub Actions** - CI/CD pipeline for automatic deployments
- **Renovate Integration** - Automatic dependency updates
- **Manual Deployment Script** - Simple local FTP uploads
- **Environment Configuration** - Secure credential management

## 🛠 Tech Stack

- **React 19** - Modern React features
- **TypeScript** - Type safety and better DX
- **Vite** - Fast build tool and dev server
- **Chart.js** + **react-chartjs-2** - Interactive charts
- **Lucide React** - Modern icon library
- **React Helmet Async** - SEO and meta tags
- **CSS Custom Properties** - Native CSS variables for theming

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone or download repository
cd currencychange

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will run at `http://localhost:5173` (or another port if 5173 is occupied).

### Build for Production
```bash
# Create production build
npm run build

# Preview production build
npm run preview

# FTP Deployment
npm run deploy:ftp
```

## 🚀 Deployment

### FTP Server Deployment

#### Automatic via GitHub Actions
1. **Configure GitHub Secrets**:
   - `FTP_SERVER`: Your FTP server hostname
   - `FTP_USERNAME`: Your FTP username  
   - `FTP_PASSWORD`: Your FTP password

2. **Push to master** triggers automatic deployment

#### Manual via Script
1. **Set environment variables**:
   ```bash
   # Create .env.local with:
   FTP_HOST=your-ftp-server.com
   FTP_USER=your-username
   FTP_PASS=your-password
   FTP_DIR=/currency_exchange
   ```

2. **Execute deployment**:
   ```bash
   npm run deploy:ftp
   ```

### Dependency Management

**Renovate** automatically keeps all dependencies up to date:
- **Weekly updates** every Monday
- **Automatic security patches**
- **Grouped updates** for related packages
- **Pull requests** for review before merge

**Setup**: Install the [Renovate GitHub App](https://github.com/apps/renovate) for your repository.

Find more details in the [DEPLOYMENT.md](DEPLOYMENT.md) documentation.

## 📱 Usage

### Basic Currency Conversion
1. **Select source currency** (From)
2. **Enter amount**
3. **Select target currency** (To)
4. **Result** is displayed automatically

### Using the Calculator
1. **Click calculator icon** in the header bar
2. **Perform calculation**
3. **Click "Use" button** to transfer result

### Viewing Historical Charts
1. **Click chart icon** in the header bar
2. **View 30-day history** of exchange rate
3. **Interactive tooltips** on hover over data points

### Settings & Themes
1. **Click settings icon** for dropdown menu
2. **Toggle dark/light mode**
3. **Clear cache** when needed
4. **View cache status** and last update time

## 🎯 Special Features

### Anti-Loop Protection
- Prevents excessive API calls through intelligent rate limiting
- Debouncing on user input (500ms)

### Glassmorphism Design
- Authentic Apple Glass design with backdrop-filter
- Subtle transparency and blur effects
- Responsive glass elements for all components

### Robust Error Handling
- Graceful fallbacks on API errors
- Toast notifications for user feedback
- Offline fallback rates for major currencies

### Performance Optimization
- Intelligent caching with 1-minute lifetime
- Lazy loading of historical data
- Optimized bundle size through code-splitting

## 🌐 API

The app uses the **exchangerate.host API** for current exchange rates:
- Free and without API key
- Supports 150+ currencies
- Historical data available
- High availability and reliability

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Developed with ❤️ and modern web technologies**
