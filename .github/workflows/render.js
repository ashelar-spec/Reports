const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // 1. Force standard 1:1 screen resolution so previewers scale it properly
    await page.setViewport({
      width: 800,
      height: 600,
      deviceScaleFactor: 1 // Crucial for clean chat/email preview scaling
    });

    // 2. Load your file
    const filePath = path.join(__dirname, 'render.html'); // Adjust file name if needed
    await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });

    // 3. Wait for the table
    await page.waitForSelector('table');
    const tableElement = await page.$('table');

    if (tableElement) {
      // 4. Take a clean, cropped screenshot of ONLY the table
      await tableElement.screenshot({
        path: 'output.png',
        omitBackground: true
      });
      console.log('Image successfully rendered for chat preview!');
    } else {
      console.error('Table element not found.');
    }

  } catch (error) {
    console.error('Error rendering image:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();
