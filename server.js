const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/plan-image', async (req, res) => {
  try {
    const mas = req.query.mas || 'MAS-000';

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });

    const page = await browser.newPage();

    await page.setViewport({ width: 800, height: 600 });

    await page.setContent(`
      <html>
        <body style="background:#0a0a1a;color:white;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
          <div style="text-align:center">
            <h1>${mas}</h1>
            <p>Plan placeholder ✅</p>
          </div>
        </body>
      </html>
    `);

    const imageBuffer = await page.screenshot();

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
