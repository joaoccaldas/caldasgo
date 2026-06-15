const puppeteer = require('puppeteer');

(async () => {
  console.log("Starting Chrome...");
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Track errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  page.on('requestfailed', request => {
    if (!request.url().includes('google-analytics') && request.failure().errorText !== 'net::ERR_ABORTED') {
      errors.push(`Request failed: ${request.url()} - ${request.failure().errorText}`);
    }
  });

  console.log("Navigating to app...");
  await page.goto('http://localhost:5173/caldasgo/', { waitUntil: 'networkidle0' });
  
  // Wait for Safety Screen and click Accept
  console.log("Accepting safety screen...");
  await page.waitForSelector('button');
  const buttons = await page.$$('button');
  for (let btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('OK')) {
      await btn.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 2000));
  console.log("Map Screen loaded.");

  // Test Pokedex
  console.log("Clicking Pokedex...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const pokedexBtn = btns.find(b => b.textContent.includes('Pokédex') || b.querySelector('img[alt="Pokédex"]'));
    if (pokedexBtn) pokedexBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  // Storage
  console.log("Clicking Storage...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const closeBtn = btns.find(b => b.querySelector('svg'));
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const storageBtn = btns.find(b => b.querySelector('img[alt="Pokémon"]'));
    if (storageBtn) storageBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Items
  console.log("Clicking Items...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const closeBtn = btns.find(b => b.querySelector('svg'));
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const itemsBtn = btns.find(b => b.querySelector('img[alt="Items"]'));
    if (itemsBtn) itemsBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  console.log("Testing complete. Errors found:", errors.length);
  if (errors.length > 0) {
    console.log("ERRORS:");
    errors.forEach(e => console.log(e));
  }
  await browser.close();
  process.exit(0);
})();
