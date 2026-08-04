const puppeteer = require('puppeteer');

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // 1. Set viewport scale
    await page.setViewport({
      width: 800,
      height: 600,
      deviceScaleFactor: 1
    });

    // --- YOUR EXISTING DATA / PAGE LOADING CODE HERE ---
    // (e.g., page.goto or page.setContent)
    
    // 2. Wait for table to load
    await page.waitForSelector('table');

    // 3. Inject CSS styling directly onto the page dynamically
    await page.addStyleTag({
      content: `
        body {
          background-color: transparent !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        table {
          width: 650px !important;      /* Controls preview size */
          font-size: 13px !important;    /* Keeps text sharp & readable */
          border-collapse: collapse !important;
          margin: 0 !important;
        }
      `
    });

    // 4. Find table element and grab clean screenshot
    const tableElement = await page.$('table');

    if (tableElement) {
      await tableElement.screenshot({
        path: 'output.png',
        omitBackground: true
      });
      console.log('Successfully generated preview image!');
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
