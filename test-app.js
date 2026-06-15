const puppeteer = require('puppeteer');

(async () => {
  console.log("Starting Chrome...");
  const browser = await puppeteer.launch({
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
    errors.push(`Request failed: ${request.url()} - ${request.failure().errorText}`);
  });

  console.log("Navigating to app...");
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
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

  // Wait a bit for map to load
  await new Promise(r => setTimeout(r, 2000));
  console.log("Map Screen loaded.");

  // Test Pokedex
  console.log("Opening Pokédex...");
  const navButtons = await page.$$('button');
  for (let btn of navButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Pokédex')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));
  
  // Test Storage
  console.log("Opening Storage...");
  // close pokedex first
  const closeButtons = await page.$$('button');
  await closeButtons[0].click(); // usually the first button in an overlay is close
  await new Promise(r => setTimeout(r, 500));

  for (let btn of navButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Pokémon')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));

  console.log("Testing complete. Errors found:", errors.length);
  if (errors.length > 0) {
    console.log("ERRORS:", errors);
  }
  await browser.close();
  process.exit(0);
})();
