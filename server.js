const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const PORT = 3005;

// Serve the static HTML file
app.use(express.static(path.join(__dirname)));

// Endpoint to capture a screenshot
app.get('/screenshot', async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Load the local HTML file
    const filePath = `file://${path.join(__dirname, 'index.html')}`;
    await page.goto(filePath, { waitUntil: 'networkidle0' });

    // Capture the screenshot
    const screenshotBuffer = await page.screenshot({ fullPage: true });

    await browser.close();

    // Set headers for download
    res.setHeader('Content-Disposition', 'attachment; filename="screenshot.png"');
    res.setHeader('Content-Type', 'image/png');
    res.send(screenshotBuffer);
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    res.status(500).send('An error occurred while capturing the screenshot.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});