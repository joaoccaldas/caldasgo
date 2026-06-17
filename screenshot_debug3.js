import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));

  await page.goto('http://localhost:5173/caldasgo/');

  // Click OK on safety screen
  try {
    await page.waitForSelector('text="OK"', { timeout: 5000 });
    await page.click('text="OK"');
    console.log("Clicked OK on Safety screen.");
  } catch (e) {
    console.log("No OK button found or timed out.");
  }

  console.log('Waiting 3 seconds for map to render...');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'map_debug3.png' });

  try {
    // Wait for the main menu button
    await page.waitForSelector('img[src*="btn_mainmenu_normal"]', { timeout: 3000 });
    // Click the button itself, not just the image
    const element = await page.$('img[src*="btn_mainmenu_normal"]');
    if (element) {
        // click its parent button
        await element.evaluate(el => el.closest('button').click());
    }
    console.log("Clicked Main Menu.");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'menu_debug.png' });

    // Click Pokedex
    const pokedexBtn = await page.$('text="POKÉDEX"');
    if (pokedexBtn) {
        await pokedexBtn.click();
        console.log("Clicked Pokedex.");
    }
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'pokedex_debug.png' });
  } catch(e) {
    console.log("Error opening pokedex:", e);
  }

  await browser.close();
})();
