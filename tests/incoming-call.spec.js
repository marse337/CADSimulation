const { test, expect } = require('@playwright/test');
const path = require('path');

const fileUrl = 'file:///' + path.resolve(__dirname, '..', 'index.html').replace(/\\/g, '/');

// Helper: navigate to a slide by data-title
async function goToSlide(page, title) {
  await page.evaluate((t) => {
    document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
    document.querySelector('[data-title="' + t + '"]').classList.add('active');
  }, title);
  await page.waitForTimeout(300);
}

test.describe('Incoming Verified Call', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fileUrl);
    await page.waitForLoadState('domcontentloaded');
  });

  test('Both buttons are visible on slide 1', async ({ page }) => {
    const btn = page.locator('#incomingCallBtn');
    const nvBtn = page.locator('#notVerifiedCallBtn');
    await expect(btn).toBeVisible();
    await expect(btn).toContainText('Incoming Verified Call');
    await expect(nvBtn).toBeVisible();
    await expect(nvBtn).toContainText('Not Verified Incoming Call');
  });

  test('Clicking verified button shows banner and popup, hides buttons', async ({ page }) => {
    const btn = page.locator('#incomingCallBtn');
    const banner = page.locator('#connectedBanner');
    const popup = page.locator('#callPopup');
    const btns = page.locator('.incoming-call-btns');

    await expect(banner).toBeHidden();
    await expect(popup).toBeHidden();

    await btn.click({ force: true });

    await expect(banner).toBeVisible();
    await expect(popup).toBeVisible();
    await expect(btns).toBeHidden();
  });

  test('Close button hides popup but banner stays', async ({ page }) => {
    const btn = page.locator('#incomingCallBtn');
    const banner = page.locator('#connectedBanner');
    const popup = page.locator('#callPopup');

    await btn.click({ force: true });
    await expect(popup).toBeVisible();

    await page.evaluate(() => document.getElementById('callPopupClose').click());
    await expect(popup).toBeHidden();
    await expect(banner).toBeVisible();
  });

  test('Verified - Open Site navigates to slide 6', async ({ page }) => {
    const btn = page.locator('#incomingCallBtn');
    await btn.click({ force: true });

    const openSite = page.locator('#callPopup .popup-open-site');
    await openSite.click({ force: true });
    await page.waitForTimeout(500);

    await expect(page.locator('.slide.active')).toHaveAttribute('data-title', 'AccountActivity');
  });

  test('Returning to slide 1 resets banner and popup', async ({ page }) => {
    const btn = page.locator('#incomingCallBtn');
    const banner = page.locator('#connectedBanner');
    const popup = page.locator('#callPopup');
    const btns = page.locator('.incoming-call-btns');

    await btn.click({ force: true });
    await expect(banner).toBeVisible();

    const openSite = page.locator('#callPopup .popup-open-site');
    await openSite.click({ force: true });
    await page.waitForTimeout(500);

    await expect(page.locator('.slide.active')).toHaveAttribute('data-title', 'AccountActivity');

    await goToSlide(page, 'LoggedIn');

    await expect(banner).toBeHidden();
    await expect(popup).toBeHidden();
    await expect(btns).toBeVisible();
  });
});

test.describe('Not Verified Incoming Call', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fileUrl);
    await page.waitForLoadState('domcontentloaded');
  });

  test('Clicking not-verified button shows banner and its popup, hides buttons', async ({ page }) => {
    const nvBtn = page.locator('#notVerifiedCallBtn');
    const banner = page.locator('#connectedBanner');
    const nvPopup = page.locator('#notVerifiedPopup');
    const btns = page.locator('.incoming-call-btns');

    await expect(nvPopup).toBeHidden();

    await nvBtn.click({ force: true });

    await expect(banner).toBeVisible();
    await expect(nvPopup).toBeVisible();
    await expect(btns).toBeHidden();
  });

  test('Not-verified popup has Verify Customer link', async ({ page }) => {
    const nvBtn = page.locator('#notVerifiedCallBtn');
    await nvBtn.click({ force: true });

    const verifyLink = page.locator('#notVerifiedPopup .popup-open-site');
    await expect(verifyLink).toContainText('Verify Customer');
  });

  test('Not-verified - Verify Customer navigates to slide 4 (Select Contact)', async ({ page }) => {
    const nvBtn = page.locator('#notVerifiedCallBtn');
    await nvBtn.click({ force: true });

    const verifyLink = page.locator('#notVerifiedPopup .popup-open-site');
    await verifyLink.click({ force: true });
    await page.waitForTimeout(500);

    await expect(page.locator('.slide.active')).toHaveAttribute('data-title', 'LoggedInModal');
  });

  test('Returning to slide 1 resets not-verified popup', async ({ page }) => {
    const nvBtn = page.locator('#notVerifiedCallBtn');
    const banner = page.locator('#connectedBanner');
    const nvPopup = page.locator('#notVerifiedPopup');
    const btns = page.locator('.incoming-call-btns');

    await nvBtn.click({ force: true });
    await expect(nvPopup).toBeVisible();

    const verifyLink = page.locator('#notVerifiedPopup .popup-open-site');
    await verifyLink.click({ force: true });
    await page.waitForTimeout(500);

    await goToSlide(page, 'LoggedIn');

    await expect(banner).toBeHidden();
    await expect(nvPopup).toBeHidden();
    await expect(btns).toBeVisible();
  });
});
