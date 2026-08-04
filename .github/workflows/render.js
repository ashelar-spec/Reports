const puppeteer = require('puppeteer');
const sharp = require('sharp'); // 1. Import sharp

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set your URL or page content
  await page.setContent('<h1>Your Table/Content Here</h1>'); 

  // 2. Save an initial temporary screenshot
  const rawImagePath = 'temp_render.png';
  await page.screenshot({ path: rawImagePath });
  await browser.close();

  // 3. Resize the image with Sharp
  await sharp(rawImagePath)
    .resize({
      width: 800,           // Desired width in pixels
      // height: 600,       // Optional: Leave empty to maintain aspect ratio
      fit: 'inside'         // Keeps the entire image visible without stretching
    })
    .toFile('final_table.png'); // Final output path

  console.log('Image successfully resized and saved!');
})();
