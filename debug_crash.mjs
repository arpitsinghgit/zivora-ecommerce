import puppeteer from 'puppeteer';
import { spawn } from 'child_process';

const server = spawn('node', ['server.cjs'], { stdio: 'inherit' });

setTimeout(async () => {
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER CONSOLE LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER UNCAUGHT EXCEPTION:', err.toString()));
    
    console.log('Navigating to http://localhost:5000...');
    await page.goto('http://localhost:5000', { waitUntil: 'networkidle0' });
    
    console.log('Waiting 3 seconds to see if it crashes after fetching data...');
    await new Promise(r => setTimeout(r, 3000));
    
    await browser.close();
  } catch (e) {
    console.error('Puppeteer Error:', e);
  } finally {
    server.kill();
    process.exit(0);
  }
}, 3000);
