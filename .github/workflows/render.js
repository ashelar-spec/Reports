const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const htmlContent = fs.readFileSync('table.html', 'utf8');

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 2 });
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  // Crop tightly to table
  const element = await page.$('table');
  await element.screenshot({ path: 'output.png' });

  await browser.close();
})();
