const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = 'http://127.0.0.1:6010';
const OUT = '/tmp/cb_shots';
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 900 });

  // Helper: go to a story and get the canvas iframe
  async function goToStory(storyId) {
    await page.goto(`${BASE}/iframe.html?id=${storyId}&viewMode=story`);
    await page.waitForTimeout(1200);
  }

  // ── Default story ──────────────────────────────────────────────────
  await goToStory('components-checkboxgroup--default');
  await page.screenshot({ path: `${OUT}/01_default.png` });

  // Check a checkbox and screenshot
  const firstCb = page.locator('wa-checkbox').first();
  await firstCb.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/02_default_checked.png` });

  // Hover test — hover over second checkbox box area
  const secondCb = page.locator('wa-checkbox').nth(1);
  await secondCb.hover();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/03_default_hover.png` });

  // ── WithHint ────────────────────────────────────────────────────────
  await goToStory('components-checkboxgroup--with-hint');
  await page.screenshot({ path: `${OUT}/04_with_hint.png` });

  // ── SelectAll ───────────────────────────────────────────────────────
  await goToStory('components-checkboxgroup--select-all');
  await page.waitForTimeout(800); // let ds-checkbox-group render
  await page.screenshot({ path: `${OUT}/05_select_all_initial.png` });

  // Click "Select all" once — should check all
  const selectAllCb = page.locator('wa-checkbox').first();
  await selectAllCb.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/06_select_all_checked_all.png` });

  // Click again — should uncheck all
  await selectAllCb.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/07_select_all_unchecked_all.png` });

  // ── Error ────────────────────────────────────────────────────────────
  await goToStory('components-checkboxgroup--error');
  await page.screenshot({ path: `${OUT}/08_error.png` });

  // ── Disabled ─────────────────────────────────────────────────────────
  await goToStory('components-checkboxgroup--disabled');
  await page.screenshot({ path: `${OUT}/09_disabled.png` });

  // ── Keyboard: Tab + Space on Default ─────────────────────────────────
  await goToStory('components-checkboxgroup--default');
  await page.keyboard.press('Tab');
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/10_keyboard_focus.png` });
  await page.keyboard.press('Space');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/11_keyboard_checked.png` });

  // ── Docs view ────────────────────────────────────────────────────────
  await page.goto(`${BASE}/?path=/docs/components-checkboxgroup--docs`);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${OUT}/12_docs_view.png`, fullPage: true });

  await browser.close();
  console.log('Done. Screenshots in', OUT);
})().catch(e => { console.error(e); process.exit(1); });
