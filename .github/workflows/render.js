const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  let browser;
  try {
    // 1. Launch headless browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required for GitHub Actions runner environment
    });

    const page = await browser.newPage();

    // 2. Load your HTML content/file
    // Replace 'index.html' with your actual HTML file name if it's different
    const filePath = path.join(__dirname, 'index.html'); 
    await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });

    // 3. Wait for the table to appear on screen
    await page.waitForSelector('table');

    // 4. Select the table element
    const tableElement = await page.$('table');

    if (tableElement) {
      // 5. Take a tight screenshot of ONLY the table (removes all black side bars)
      await tableElement.screenshot({
        path: 'output.png',
        omitBackground: true // Transparent background around rounded corners, if any
      });
      console.log('Successfully generated output.png without black margins!');
    } else {
      console.error('Error: Table element could not be found on the page.');
    }

  } catch (error) {
    console.error('Error while rendering image:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();
