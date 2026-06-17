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

  await page.goto('http://localhost:3000/');

  // Click OK on safety screen
  try {
    await page.waitForSelector('text="OK"', { timeout: 5000 });
    await page.click('text="OK"');
  } catch (e) { }

  console.log('Waiting 5 seconds for map to render...');
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'map_prod.png' });

  // Open the Main Menu
  try {
    await page.waitForSelector('img[src*="btn_mainmenu_normal"]', { timeout: 3000 });
    const element = await page.$('img[src*="btn_mainmenu_normal"]');
    if (element) await element.evaluate(el => el.closest('button').click());
    await page.waitForTimeout(1000);

    const pokedexBtn = await page.$('text="POKÉDEX"');
    if (pokedexBtn) await pokedexBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'pokedex_prod.png' });
  } catch(e) {}

  await browser.close();
})();
