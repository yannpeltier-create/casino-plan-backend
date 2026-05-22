const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/plan-image', async (req, res) => {
  const mas = req.query.mas || 'MAS-1001';

  const url = `https://yannpeltier-create.github.io/plan.html?mas=${mas}`;

  try {
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ],
      headless: true
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 800,
      height: 1000,
      deviceScaleFactor: 2
    });

    await page.goto(url, { waitUntil: 'networkidle2' });

    // ✅ fallback si ton canvas n'existe pas
    await new Promise(r => setTimeout(r, 1500));

    const imageBuffer = await page.screenshot({
      fullPage: true,
      type: 'png'
    });

    await browser.close();

    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);

  } catch (err) {
    console.error('❌ ERROR:', err);
    res.status(500).send('Erreur Puppeteer');
  }
});

app.listen(3000, () => {
  console.log('✅ Server running on port 3000');
});
