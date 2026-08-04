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

    // 1. If you load an HTML file, load it here (update file name if needed)
    // If you use page.setContent or open a URL, keep your existing loading line here!
    const filePath = path.join(__dirname, 'render.html'); 
    await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });

    // 2. Wait for table
    await page.waitForSelector('table');

    // 3. Inject CSS to kill full-width stretching and dark backgrounds
    await page.addStyleTag({
      content: `
        html, body {
          background: transparent !important;
          width: max-content !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        table {
          display: inline-block !important;
          width: auto !important;
          max-width: none !important;
          margin: 0 !important;
        }
      `
    });

    // 4. Get the exact table element
    const tableElement = await page.$('table');

    // 5. Get table's precise pixel dimensions
    const boundingBox = await tableElement.boundingBox();

    if (boundingBox) {
      // 6. Screenshot ONLY the bounding box region with transparent background
      await tableElement.screenshot({
        path: 'output.png',
        omitBackground: true, // Strips out the black background completely
        clip: {
          x: boundingBox.x,
          y: boundingBox.y,
          width: boundingBox.width,
          height: boundingBox.height
        }
      });
      console.log('Image generated successfully without black side bars!');
    } else {
      console.error('Could not find table bounding box.');
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
