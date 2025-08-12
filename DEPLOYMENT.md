# Deployment Guide

This document explains how to deploy the Currency Converter app to florian-hunter.de FTP server and set up automated dependency management with Renovate.

## 🌐 Live URL
**Production Site:** [currencyexchange.florian-hunter.de](https://currencyexchange.florian-hunter.de)

## 🚀 FTP Deployment

### Manual Deployment

1. **Install dependencies** (first time only):
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   # Copy the template
   copy .env.template .env.local
   
   # Edit .env.local with your FTP details:
   FTP_HOST=florian-hunter.de
   FTP_USER=your-username
   FTP_PASS=your-password
   FTP_DIR=/currency_exchange
   ```

3. **Deploy to FTP**:
   ```bash
   npm run deploy:ftp
   ```

### Automated GitHub Actions Deployment

1. **Set up GitHub Secrets**:
   - Go to your GitHub repository: `flroi950/currency_exchange`
   - Navigate to Settings → Secrets and variables → Actions
   - Add these secrets:
     - `FTP_SERVER`: florian-hunter.de
     - `FTP_USERNAME`: Your FTP username
     - `FTP_PASSWORD`: Your FTP password

2. **Automatic deployment**:
   - Push to `master` branch triggers automatic deployment to `/currency_exchange/` folder
   - Manual deployment via GitHub Actions tab → "Deploy to FTP Server" → "Run workflow"
   - Site will be live at: https://currencyexchange.florian-hunter.de

## 🔄 Renovate Dependency Management

Renovate automatically keeps your dependencies up to date by creating pull requests.

### Setup Options

#### Option 1: GitHub App (Recommended)
1. Install the [Renovate GitHub App](https://github.com/apps/renovate)
2. Enable it for your repository
3. Renovate will automatically use the `renovate.json` configuration

#### Option 2: Self-hosted (Advanced)
1. Create a GitHub Personal Access Token with repo permissions
2. Add `RENOVATE_TOKEN` to your GitHub repository secrets
3. The workflow in `.github/workflows/renovate.yml` will run weekly

### Configuration Features

The `renovate.json` file includes:

- **Automatic Updates**: Minor patches and TypeScript definitions
- **Grouped Updates**: Related packages are updated together
- **Security Alerts**: Immediate updates for security vulnerabilities
- **Scheduled Updates**: Runs Monday mornings to avoid disrupting weekends
- **Smart Grouping**: React, ESLint, and TypeScript packages are grouped intelligently

### Customization

Edit `renovate.json` to:
- Change update schedules
- Add/remove package groupings
- Enable/disable automerge for specific packages
- Set up custom labels and assignees

## 📁 Project Structure

```
├── .github/
│   └── workflows/
│       ├── deploy-ftp.yml      # FTP deployment automation
│       └── renovate.yml        # Renovate workflow (optional)
├── scripts/
│   └── deploy-ftp.js          # Manual FTP deployment script
├── renovate.json              # Renovate configuration
├── .env.template              # Environment variables template
└── package.json               # Updated with deployment scripts
```

## 🔧 Troubleshooting

### FTP Deployment Issues

1. **Connection failed**: Check FTP credentials and server accessibility
2. **Permission denied**: Ensure FTP user has write permissions to target directory
3. **Build not found**: Run `npm run build` before deployment

### Renovate Issues

1. **No pull requests**: Check if Renovate is properly installed and configured
2. **Token issues**: Ensure GitHub token has sufficient permissions
3. **Config errors**: Validate `renovate.json` using the Renovate schema

## 🌐 Post-Deployment

After successful deployment:

1. **Test the live site**: Verify all functionality works on your FTP server
2. **Monitor updates**: Check for Renovate pull requests weekly
3. **Review deployments**: Monitor GitHub Actions for deployment status

Your Currency Converter should now be live with:
- ✅ Real-time exchange rates
- ✅ Historical charts with ECB data
- ✅ Responsive Apple Glass design
- ✅ Automated dependency updates
- ✅ One-click FTP deployment
