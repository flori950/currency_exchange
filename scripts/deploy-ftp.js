#!/usr/bin/env node

/**
 * FTP Deployment Script for Currency Converter
 * 
 * Usage:
 *   npm run deploy:ftp
 * 
 * Environment variables required:
 *   FTP_HOST     - FTP server hostname
 *   FTP_USER     - FTP username
 *   FTP_PASS     - FTP password
 *   FTP_DIR      - Remote directory (defaults to /currency_exchange)
 */

const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');

async function deployToFTP() {
  const client = new ftp.Client();
  
  try {
    // Load environment variables
    const host = process.env.FTP_HOST;
    const user = process.env.FTP_USER;
    const password = process.env.FTP_PASS;
    const remoteDir = process.env.FTP_DIR || '/currency_exchange';
    
    if (!host || !user || !password) {
      throw new Error('Missing required environment variables: FTP_HOST, FTP_USER, FTP_PASS');
    }
    
    console.log('🚀 Starting FTP deployment...');
    console.log(`📡 Connecting to ${host}...`);
    
    // Connect to FTP server
    await client.access({
      host: host,
      user: user,
      password: password,
      secure: false // Set to true for FTPS
    });
    
    console.log('✅ Connected to FTP server');
    
    // Change to remote directory
    if (remoteDir !== '/') {
      await client.ensureDir(remoteDir);
      console.log(`📁 Changed to directory: ${remoteDir}`);
    }
    
    // Check if dist folder exists
    const distPath = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distPath)) {
      throw new Error('Build folder not found. Please run "npm run build" first.');
    }
    
    console.log('📤 Uploading files...');
    
    // Upload the dist folder
    await client.uploadFromDir(distPath);
    
    console.log('🎉 Deployment completed successfully!');
    console.log(`🌐 Your currency converter should now be live at your FTP server`);
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

// Run if called directly
if (require.main === module) {
  deployToFTP();
}

module.exports = deployToFTP;
