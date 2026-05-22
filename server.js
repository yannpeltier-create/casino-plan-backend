const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/plan-image', async (req, res) => {
  const mas = req.query.mas || 'MAS-1001';

  // ⚠️ IMPORTANT : ton URL GitHub Pages
  const url = `https://yannpeltier-create.github.io/plan.html?mas=${mas}`;

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox']
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 800,
      height: 1000,
      deviceScaleFactor: 2
    });

    await page.goto(url, { waitUntil: 'networkidle2' });

    // attend ton canvas
    await page.waitForSelector('#planCanvas');

    // petit délai pour laisser le halo se dessiner
    await new Promise(r => setTimeout(r, 800));

    const element = await page.$('body');

    const imageBuffer = await element.screenshot({
      type: 'png'
    });

    await browser.close();

    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);

  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur génération image');
  }
});

app.listen(3000, () => {
  console.log('Server running');
});
