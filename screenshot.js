import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Click the safety warning OK button if it exists
  const okBtn = await page.$('text="OK"');
  if (okBtn) {
    await okBtn.click();
    await page.waitForTimeout(1000);
  }

  // Hide the location permissions modal if it appears (just click somewhere or it might be another modal)
  const okBtn2 = await page.$('text="OK"');
  if (okBtn2) {
    await okBtn2.click();
    await page.waitForTimeout(1000);
  }
  
  await page.screenshot({ path: 'map.png' });
  
  // Open Pokedex
  await page.click('button[aria-label="Open menu"]');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'menu.png' });
  
  // Click Pokedex
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await btn.textContent();
    if (text && text.includes('POKÉDEX')) {
      await btn.click();
      break;
    }
  }
  
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'pokedex.png' });
  
  await browser.close();
})();
