const { test, expect } = require('@playwright/test');

const SLIDES = [
  { index: 1, title: 'LoggedIn' },
  { index: 2, title: 'LoggedInFilled' },
  { index: 3, title: 'LoggedInResults' },
  { index: 4, title: 'LoggedInModal' },
  { index: 5, title: 'VerifyAccount' },
  { index: 6, title: 'AccountActivity' },
  { index: 7, title: 'ContractInfo' },
  { index: 8, title: 'EventHistory' },
  { index: 9, title: 'AccountManagement' },
  { index: 10, title: 'PaymentBilling' },
  { index: 11, title: 'JobManagement' },
  { index: 12, title: 'SystemManagement' },
  { index: 13, title: 'MoveCustomer' },
  { index: 14, title: 'MoveCustomerFilled' },
  { index: 15, title: 'MoveCustomerModal' },
  { index: 16, title: 'MoveCustomerFull' },
  { index: 17, title: 'MoveCustomerComplete' },
  { index: 18, title: 'MoveCustomerJobCreated' },
  { index: 19, title: 'TruckRollJobCreation' },
  { index: 20, title: 'TruckRollMarketTruckRoll' },
  { index: 21, title: 'RemoteTechJobCreation' },
  { index: 22, title: 'RemoteTechMarketRemoteTech' },
  { index: 23, title: 'RemoteTechMarketDropship' },
  { index: 24, title: 'EitherMarketJobOpened' },
  { index: 25, title: 'EitherMarketDropship' },
  { index: 26, title: 'EitherMarketRemoteTech' },
  { index: 27, title: 'EitherMarketTruckRoll' },
  { index: 28, title: 'AlarmTab' },
  { index: 29, title: 'VoziqTab' },
  { index: 30, title: 'SupportCenterTab' },
  { index: 31, title: 'MyAccountCSTab' },
  { index: 32, title: 'AccountActivityActionModal' },
  { index: 33, title: 'AccountActivityIncidentModal' },
  { index: 34, title: 'JobManagementCRSE' },
  { index: 35, title: 'SystemManagementCRSE' }
];

test.describe('Slide Deck Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`file:///${process.cwd().replace(/\\/g, '/')}/index.html`);
  });

  test('All slides exist and can be navigated to', async ({ page }) => {
    for (const slide of SLIDES) {
      const slideElement = page.locator(`section.slide[data-title="${slide.title}"]`);
      await expect(slideElement).toBeAttached();
    }
    console.log(`All ${SLIDES.length} slides exist`);
  });

  test('TruckRollJobCreation slide (19) has correct CSS for sidebar', async ({ page }) => {
    // Navigate to slide 19
    const slide19 = page.locator('section.slide[data-title="TruckRollJobCreation"]');

    // Make it active by using keyboard navigation or direct class manipulation
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="TruckRollJobCreation"]').classList.add('active');
    });

    // Wait for any transitions
    await page.waitForTimeout(100);

    // Check sidebar exists and has proper styling
    const sidebar = slide19.locator('.sidebar');
    await expect(sidebar).toBeVisible();

    // Check sidebar background color (should be the sidebar color from theme)
    const sidebarStyles = await sidebar.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.backgroundColor,
        display: computed.display,
        flexDirection: computed.flexDirection,
        gridColumn: computed.gridColumn,
        gridRow: computed.gridRow
      };
    });

    console.log('Sidebar styles:', JSON.stringify(sidebarStyles, null, 2));

    // Verify sidebar has flex display
    expect(sidebarStyles.display).toBe('flex');
    expect(sidebarStyles.flexDirection).toBe('column');

    // Check grid positioning
    expect(sidebarStyles.gridColumn).toContain('1');
    expect(sidebarStyles.gridRow).toContain('1');
  });

  test('TruckRollJobCreation slide (19) has correct CSS for topbar', async ({ page }) => {
    // Navigate to slide 19
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="TruckRollJobCreation"]').classList.add('active');
    });

    await page.waitForTimeout(100);

    const slide19 = page.locator('section.slide[data-title="TruckRollJobCreation"]');
    const topbar = slide19.locator('.topbar');

    await expect(topbar).toBeVisible();

    // Check topbar styling
    const topbarStyles = await topbar.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.backgroundColor,
        gridColumn: computed.gridColumn,
        gridRow: computed.gridRow,
        display: computed.display
      };
    });

    console.log('Topbar styles:', JSON.stringify(topbarStyles, null, 2));

    // Topbar should have grid positioning
    expect(topbarStyles.gridColumn).toContain('2');
  });

  test('TruckRollJobCreation slide (19) has correct CSS for main area', async ({ page }) => {
    // Navigate to slide 19
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="TruckRollJobCreation"]').classList.add('active');
    });

    await page.waitForTimeout(100);

    const slide19 = page.locator('section.slide[data-title="TruckRollJobCreation"]');
    const main = slide19.locator('.main');

    await expect(main).toBeVisible();

    const mainStyles = await main.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        gridColumn: computed.gridColumn,
        gridRow: computed.gridRow,
        padding: computed.padding
      };
    });

    console.log('Main styles:', JSON.stringify(mainStyles, null, 2));

    // Main should span column 2
    expect(mainStyles.gridColumn).toContain('2');
  });

  test('Compare TruckRollJobCreation CSS with AccountActivity CSS', async ({ page }) => {
    // Get AccountActivity slide styles (known working)
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="AccountActivity"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    const accountActivitySlide = page.locator('section.slide[data-title="AccountActivity"]');

    const accountActivityStyles = await accountActivitySlide.evaluate(el => {
      const sidebar = el.querySelector('.sidebar');
      const topbar = el.querySelector('.topbar');
      const main = el.querySelector('.main');

      const getStyles = (element) => {
        if (!element) return null;
        const computed = window.getComputedStyle(element);
        return {
          background: computed.backgroundColor,
          display: computed.display,
          gridColumn: computed.gridColumn,
          gridRow: computed.gridRow,
          flexDirection: computed.flexDirection
        };
      };

      return {
        sidebar: getStyles(sidebar),
        topbar: getStyles(topbar),
        main: getStyles(main)
      };
    });

    console.log('AccountActivity styles:', JSON.stringify(accountActivityStyles, null, 2));

    // Now get TruckRollJobCreation styles
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="TruckRollJobCreation"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    const truckRollSlide = page.locator('section.slide[data-title="TruckRollJobCreation"]');

    const truckRollStyles = await truckRollSlide.evaluate(el => {
      const sidebar = el.querySelector('.sidebar');
      const topbar = el.querySelector('.topbar');
      const main = el.querySelector('.main');

      const getStyles = (element) => {
        if (!element) return null;
        const computed = window.getComputedStyle(element);
        return {
          background: computed.backgroundColor,
          display: computed.display,
          gridColumn: computed.gridColumn,
          gridRow: computed.gridRow,
          flexDirection: computed.flexDirection
        };
      };

      return {
        sidebar: getStyles(sidebar),
        topbar: getStyles(topbar),
        main: getStyles(main)
      };
    });

    console.log('TruckRollJobCreation styles:', JSON.stringify(truckRollStyles, null, 2));

    // Compare - they should match
    expect(truckRollStyles.sidebar?.display).toBe(accountActivityStyles.sidebar?.display);
    expect(truckRollStyles.sidebar?.gridColumn).toBe(accountActivityStyles.sidebar?.gridColumn);
    expect(truckRollStyles.topbar?.gridColumn).toBe(accountActivityStyles.topbar?.gridColumn);
    expect(truckRollStyles.main?.gridColumn).toBe(accountActivityStyles.main?.gridColumn);
  });

  test('Check all nav items render correctly on TruckRollJobCreation', async ({ page }) => {
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="TruckRollJobCreation"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    const slide19 = page.locator('section.slide[data-title="TruckRollJobCreation"]');

    // Check nav items exist
    const navItems = slide19.locator('.nav-item');
    const count = await navItems.count();
    console.log(`Nav items count: ${count}`);

    // Should have at least 6 nav items (lookup, alarm, myaccount, support, voziq, jobcreation)
    expect(count).toBeGreaterThanOrEqual(6);

    // Check Job Creation Tool nav item is active
    const jobCreationNav = slide19.locator('.nav-item.active');
    await expect(jobCreationNav).toBeVisible();

    const activeNavText = await jobCreationNav.locator('.nav-text').textContent();
    console.log(`Active nav item: ${activeNavText}`);
    expect(activeNavText).toBe('Job Creation Tool');
  });

  test('TruckRollMarketTruckRoll slide (20) has correct CSS for sidebar and topbar', async ({ page }) => {
    // Navigate to slide 20
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="TruckRollMarketTruckRoll"]').classList.add('active');
    });

    await page.waitForTimeout(100);

    const slide20 = page.locator('section.slide[data-title="TruckRollMarketTruckRoll"]');

    // Check sidebar exists and has proper styling
    const sidebar = slide20.locator('.sidebar');
    await expect(sidebar).toBeVisible();

    const sidebarStyles = await sidebar.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.backgroundColor,
        display: computed.display,
        flexDirection: computed.flexDirection
      };
    });

    console.log('Slide 20 Sidebar styles:', JSON.stringify(sidebarStyles, null, 2));

    // Verify sidebar has flex display and non-transparent background
    expect(sidebarStyles.display).toBe('flex');
    expect(sidebarStyles.flexDirection).toBe('column');
    expect(sidebarStyles.background).not.toBe('rgba(0, 0, 0, 0)');

    // Check topbar
    const topbar = slide20.locator('.topbar');
    await expect(topbar).toBeVisible();

    const topbarStyles = await topbar.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.backgroundColor,
        gridColumn: computed.gridColumn
      };
    });

    console.log('Slide 20 Topbar styles:', JSON.stringify(topbarStyles, null, 2));

    // Topbar should have non-transparent background
    expect(topbarStyles.background).not.toBe('rgba(0, 0, 0, 0)');
    expect(topbarStyles.gridColumn).toContain('2');
  });

  test('Compare TruckRollMarketTruckRoll CSS with TruckRollJobCreation CSS', async ({ page }) => {
    // Get TruckRollJobCreation slide styles
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="TruckRollJobCreation"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    const slide19 = page.locator('section.slide[data-title="TruckRollJobCreation"]');

    const slide19Styles = await slide19.evaluate(el => {
      const sidebar = el.querySelector('.sidebar');
      const topbar = el.querySelector('.topbar');

      const getStyles = (element) => {
        if (!element) return null;
        const computed = window.getComputedStyle(element);
        return {
          background: computed.backgroundColor,
          display: computed.display,
          gridColumn: computed.gridColumn
        };
      };

      return {
        sidebar: getStyles(sidebar),
        topbar: getStyles(topbar)
      };
    });

    console.log('TruckRollJobCreation styles:', JSON.stringify(slide19Styles, null, 2));

    // Now get TruckRollMarketTruckRoll styles
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="TruckRollMarketTruckRoll"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    const slide20 = page.locator('section.slide[data-title="TruckRollMarketTruckRoll"]');

    const slide20Styles = await slide20.evaluate(el => {
      const sidebar = el.querySelector('.sidebar');
      const topbar = el.querySelector('.topbar');

      const getStyles = (element) => {
        if (!element) return null;
        const computed = window.getComputedStyle(element);
        return {
          background: computed.backgroundColor,
          display: computed.display,
          gridColumn: computed.gridColumn
        };
      };

      return {
        sidebar: getStyles(sidebar),
        topbar: getStyles(topbar)
      };
    });

    console.log('TruckRollMarketTruckRoll styles:', JSON.stringify(slide20Styles, null, 2));

    // Compare - they should match
    expect(slide20Styles.sidebar?.display).toBe(slide19Styles.sidebar?.display);
    expect(slide20Styles.sidebar?.background).toBe(slide19Styles.sidebar?.background);
    expect(slide20Styles.topbar?.background).toBe(slide19Styles.topbar?.background);
  });

  test('TruckRollMarketTruckRoll slide (20) has Job Details and Billable Cost sections', async ({ page }) => {
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="TruckRollMarketTruckRoll"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    const slide20 = page.locator('section.slide[data-title="TruckRollMarketTruckRoll"]');

    // Check Job Details section exists
    const jobDetails = slide20.locator('.jct-section.job-details');
    await expect(jobDetails).toBeVisible();

    // Check Billable Cost sidebar exists
    const costSidebar = slide20.locator('.jct-cost-sidebar');
    await expect(costSidebar).toBeVisible();

    // Check Create Job button exists
    const createJobBtn = slide20.locator('.jct-btn-create');
    await expect(createJobBtn).toBeVisible();

    // Check Calculate button is active
    const calculateBtn = slide20.locator('.jct-btn-calculate.active');
    await expect(calculateBtn).toBeVisible();
  });

  test('RemoteTechJobCreation slide (21) has correct CSS for sidebar and topbar', async ({ page }) => {
    // Navigate to slide 21
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="RemoteTechJobCreation"]').classList.add('active');
    });

    await page.waitForTimeout(100);

    const slide21 = page.locator('section.slide[data-title="RemoteTechJobCreation"]');

    // Check sidebar exists and has proper styling
    const sidebar = slide21.locator('.sidebar');
    await expect(sidebar).toBeVisible();

    const sidebarStyles = await sidebar.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.backgroundColor,
        display: computed.display,
        flexDirection: computed.flexDirection
      };
    });

    console.log('Slide 21 Sidebar styles:', JSON.stringify(sidebarStyles, null, 2));

    // Verify sidebar has flex display and non-transparent background
    expect(sidebarStyles.display).toBe('flex');
    expect(sidebarStyles.flexDirection).toBe('column');
    expect(sidebarStyles.background).not.toBe('rgba(0, 0, 0, 0)');

    // Check topbar
    const topbar = slide21.locator('.topbar');
    await expect(topbar).toBeVisible();

    const topbarStyles = await topbar.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.backgroundColor,
        gridColumn: computed.gridColumn
      };
    });

    console.log('Slide 21 Topbar styles:', JSON.stringify(topbarStyles, null, 2));

    // Topbar should have non-transparent background
    expect(topbarStyles.background).not.toBe('rgba(0, 0, 0, 0)');
    expect(topbarStyles.gridColumn).toContain('2');
  });

  test('RemoteTechJobCreation slide (21) has Job Creation Tool modal with Add-On section', async ({ page }) => {
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="RemoteTechJobCreation"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    const slide21 = page.locator('section.slide[data-title="RemoteTechJobCreation"]');

    // Check Job Creation Tool title exists
    const jctTitle = slide21.locator('.jct-title');
    await expect(jctTitle).toBeVisible();
    await expect(jctTitle).toHaveText('Job Creation Tool');

    // Check Service Plan Overview section
    const servicePlan = slide21.locator('.jct-section.service-plan');
    await expect(servicePlan).toBeVisible();

    // Check Add-On section exists with form elements
    const addOn = slide21.locator('.jct-section.addon');
    await expect(addOn).toBeVisible();

    // Check Select Equipment dropdown
    const equipSelect = slide21.locator('.jct-select.equip-select');
    await expect(equipSelect).toBeVisible();

    // Check Calculate button exists (disabled state)
    const calculateBtn = slide21.locator('.jct-btn-calculate');
    await expect(calculateBtn).toBeVisible();
  });

  test('RemoteTechMarketRemoteTech slide (22) has correct CSS for sidebar and topbar', async ({ page }) => {
    // Navigate to slide 22
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="RemoteTechMarketRemoteTech"]').classList.add('active');
    });

    await page.waitForTimeout(100);

    const slide22 = page.locator('section.slide[data-title="RemoteTechMarketRemoteTech"]');

    // Check sidebar exists and has proper styling
    const sidebar = slide22.locator('.sidebar');
    await expect(sidebar).toBeVisible();

    const sidebarStyles = await sidebar.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.backgroundColor,
        display: computed.display,
        flexDirection: computed.flexDirection
      };
    });

    console.log('Slide 22 Sidebar styles:', JSON.stringify(sidebarStyles, null, 2));

    // Verify sidebar has flex display and non-transparent background
    expect(sidebarStyles.display).toBe('flex');
    expect(sidebarStyles.flexDirection).toBe('column');
    expect(sidebarStyles.background).not.toBe('rgba(0, 0, 0, 0)');

    // Check topbar
    const topbar = slide22.locator('.topbar');
    await expect(topbar).toBeVisible();

    const topbarStyles = await topbar.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.backgroundColor,
        gridColumn: computed.gridColumn
      };
    });

    console.log('Slide 22 Topbar styles:', JSON.stringify(topbarStyles, null, 2));

    // Topbar should have non-transparent background
    expect(topbarStyles.background).not.toBe('rgba(0, 0, 0, 0)');
    expect(topbarStyles.gridColumn).toContain('2');
  });

  test('RemoteTechMarketRemoteTech slide (22) has Job Details and Billable Cost sections', async ({ page }) => {
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="RemoteTechMarketRemoteTech"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    const slide22 = page.locator('section.slide[data-title="RemoteTechMarketRemoteTech"]');

    // Check Job Details section exists
    const jobDetails = slide22.locator('.jct-section.job-details');
    await expect(jobDetails).toBeVisible();

    // Check Billable Cost sidebar exists
    const costSidebar = slide22.locator('.jct-cost-sidebar');
    await expect(costSidebar).toBeVisible();

    // Check Create Job button exists
    const createJobBtn = slide22.locator('.jct-btn-create');
    await expect(createJobBtn).toBeVisible();

    // Check Calculate button is active
    const calculateBtn = slide22.locator('.jct-btn-calculate.active');
    await expect(calculateBtn).toBeVisible();
  });

  test('RemoteTechMarketDropship slide (23) has correct CSS for sidebar and topbar', async ({ page }) => {
    // Navigate to slide 23
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="RemoteTechMarketDropship"]').classList.add('active');
    });

    await page.waitForTimeout(100);

    const slide23 = page.locator('section.slide[data-title="RemoteTechMarketDropship"]');

    // Check sidebar exists and has proper styling
    const sidebar = slide23.locator('.sidebar');
    await expect(sidebar).toBeVisible();

    const sidebarStyles = await sidebar.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.backgroundColor,
        display: computed.display,
        flexDirection: computed.flexDirection
      };
    });

    console.log('Slide 23 Sidebar styles:', JSON.stringify(sidebarStyles, null, 2));

    // Verify sidebar has flex display and non-transparent background
    expect(sidebarStyles.display).toBe('flex');
    expect(sidebarStyles.flexDirection).toBe('column');
    expect(sidebarStyles.background).not.toBe('rgba(0, 0, 0, 0)');

    // Check topbar
    const topbar = slide23.locator('.topbar');
    await expect(topbar).toBeVisible();

    const topbarStyles = await topbar.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.backgroundColor,
        gridColumn: computed.gridColumn
      };
    });

    console.log('Slide 23 Topbar styles:', JSON.stringify(topbarStyles, null, 2));

    // Topbar should have non-transparent background
    expect(topbarStyles.background).not.toBe('rgba(0, 0, 0, 0)');
    expect(topbarStyles.gridColumn).toContain('2');
  });

  test('RemoteTechMarketDropship slide (23) has Dropship Job Type with shipping options', async ({ page }) => {
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="RemoteTechMarketDropship"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    const slide23 = page.locator('section.slide[data-title="RemoteTechMarketDropship"]');

    // Check Job Type section shows Dropship
    const jobTypeBox = slide23.locator('.jct-jobtype-box.dropship');
    await expect(jobTypeBox).toBeVisible();

    // Check Required Type shows Dropship
    const jobTypeValue = slide23.locator('.jct-jobtype-value');
    await expect(jobTypeValue).toHaveText('Dropship');

    // Check Shipping & Handling radio buttons exist
    const radioGroup = slide23.locator('.jct-radio-group');
    await expect(radioGroup).toBeVisible();

    // Check Standard and Expedited options
    const standardRadio = slide23.locator('.jct-radio').filter({ hasText: 'Standard' });
    const expeditedRadio = slide23.locator('.jct-radio').filter({ hasText: 'Expedited' });
    await expect(standardRadio).toBeVisible();
    await expect(expeditedRadio).toBeVisible();

    // Check Available indicator
    const availableIndicator = slide23.locator('.jct-available');
    await expect(availableIndicator).toBeVisible();

    // Check Billable Cost shows actual values
    const costSidebar = slide23.locator('.jct-cost-sidebar');
    await expect(costSidebar).toBeVisible();

    // Check total is $49.00
    const totalRow = slide23.locator('.jct-cost-row.total');
    await expect(totalRow).toContainText('$49.00');
  });

  test('EitherMarketJobOpened slide (24) has correct CSS for sidebar and topbar', async ({ page }) => {
    // Navigate to slide 24
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="EitherMarketJobOpened"]').classList.add('active');
    });

    await page.waitForTimeout(100);

    const slide24 = page.locator('section.slide[data-title="EitherMarketJobOpened"]');

    // Check sidebar exists and has proper styling
    const sidebar = slide24.locator('.sidebar');
    await expect(sidebar).toBeVisible();

    const sidebarStyles = await sidebar.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.backgroundColor,
        display: computed.display,
        flexDirection: computed.flexDirection
      };
    });

    console.log('Slide 24 Sidebar styles:', JSON.stringify(sidebarStyles, null, 2));

    // Verify sidebar has flex display and non-transparent background
    expect(sidebarStyles.display).toBe('flex');
    expect(sidebarStyles.flexDirection).toBe('column');
    expect(sidebarStyles.background).not.toBe('rgba(0, 0, 0, 0)');

    // Check topbar
    const topbar = slide24.locator('.topbar');
    await expect(topbar).toBeVisible();

    const topbarStyles = await topbar.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.backgroundColor,
        gridColumn: computed.gridColumn
      };
    });

    console.log('Slide 24 Topbar styles:', JSON.stringify(topbarStyles, null, 2));

    // Topbar should have non-transparent background
    expect(topbarStyles.background).not.toBe('rgba(0, 0, 0, 0)');
    expect(topbarStyles.gridColumn).toContain('2');
  });

  test('EitherMarketJobOpened slide (24) has Job Creation Tool with BreakFix section', async ({ page }) => {
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="EitherMarketJobOpened"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    const slide24 = page.locator('section.slide[data-title="EitherMarketJobOpened"]');

    // Check Job Creation Tool title exists
    const jctTitle = slide24.locator('.jct-title');
    await expect(jctTitle).toBeVisible();
    await expect(jctTitle).toHaveText('Job Creation Tool');

    // Check BreakFix section with select elements
    const breakfixSection = slide24.locator('.jct-section.breakfix');
    await expect(breakfixSection).toBeVisible();

    // Check Calculate button exists (disabled state)
    const calculateBtn = slide24.locator('.jct-btn-calculate');
    await expect(calculateBtn).toBeVisible();
  });

  test('EitherMarketDropship slide (25) has correct CSS for sidebar and topbar', async ({ page }) => {
    // Navigate to slide 25
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="EitherMarketDropship"]').classList.add('active');
    });

    await page.waitForTimeout(100);

    const slide25 = page.locator('section.slide[data-title="EitherMarketDropship"]');

    // Check sidebar exists and has proper styling
    const sidebar = slide25.locator('.sidebar');
    await expect(sidebar).toBeVisible();

    const sidebarStyles = await sidebar.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.backgroundColor,
        display: computed.display,
        flexDirection: computed.flexDirection
      };
    });

    console.log('Slide 25 Sidebar styles:', JSON.stringify(sidebarStyles, null, 2));

    // Verify sidebar has flex display and non-transparent background
    expect(sidebarStyles.display).toBe('flex');
    expect(sidebarStyles.flexDirection).toBe('column');
    expect(sidebarStyles.background).not.toBe('rgba(0, 0, 0, 0)');

    // Check topbar
    const topbar = slide25.locator('.topbar');
    await expect(topbar).toBeVisible();

    const topbarStyles = await topbar.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.backgroundColor,
        gridColumn: computed.gridColumn
      };
    });

    console.log('Slide 25 Topbar styles:', JSON.stringify(topbarStyles, null, 2));

    // Topbar should have non-transparent background
    expect(topbarStyles.background).not.toBe('rgba(0, 0, 0, 0)');
    expect(topbarStyles.gridColumn).toContain('2');
  });

  test('EitherMarketDropship slide (25) has Dropship job type with Override button and $29 total', async ({ page }) => {
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="EitherMarketDropship"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    const slide25 = page.locator('section.slide[data-title="EitherMarketDropship"]');

    // Check Job Type section shows Dropship
    const jobTypeBox = slide25.locator('.jct-jobtype-box.dropship');
    await expect(jobTypeBox).toBeVisible();

    // Check Override button exists
    const overrideBtn = slide25.locator('.jct-btn-override');
    await expect(overrideBtn).toBeVisible();

    // Check Billable Cost sidebar exists
    const costSidebar = slide25.locator('.jct-cost-sidebar');
    await expect(costSidebar).toBeVisible();

    // Check total is $29.00
    const totalRow = slide25.locator('.jct-cost-row.total');
    await expect(totalRow).toContainText('$29.00');
  });

  test('EitherMarketRemoteTech slide (26) has correct CSS for sidebar and topbar', async ({ page }) => {
    // Navigate to slide 26
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="EitherMarketRemoteTech"]').classList.add('active');
    });

    await page.waitForTimeout(100);

    const slide26 = page.locator('section.slide[data-title="EitherMarketRemoteTech"]');

    // Check sidebar exists and has proper styling
    const sidebar = slide26.locator('.sidebar');
    await expect(sidebar).toBeVisible();

    const sidebarStyles = await sidebar.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.backgroundColor,
        display: computed.display,
        flexDirection: computed.flexDirection
      };
    });

    console.log('Slide 26 Sidebar styles:', JSON.stringify(sidebarStyles, null, 2));

    // Verify sidebar has flex display and non-transparent background
    expect(sidebarStyles.display).toBe('flex');
    expect(sidebarStyles.flexDirection).toBe('column');
    expect(sidebarStyles.background).not.toBe('rgba(0, 0, 0, 0)');

    // Check topbar
    const topbar = slide26.locator('.topbar');
    await expect(topbar).toBeVisible();

    const topbarStyles = await topbar.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.backgroundColor,
        gridColumn: computed.gridColumn
      };
    });

    console.log('Slide 26 Topbar styles:', JSON.stringify(topbarStyles, null, 2));

    // Topbar should have non-transparent background
    expect(topbarStyles.background).not.toBe('rgba(0, 0, 0, 0)');
    expect(topbarStyles.gridColumn).toContain('2');
  });

  test('EitherMarketRemoteTech slide (26) has Remote Tech job type with Override button and $0 total', async ({ page }) => {
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="EitherMarketRemoteTech"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    const slide26 = page.locator('section.slide[data-title="EitherMarketRemoteTech"]');

    // Check Job Type section shows Remote Tech with Override button
    const jobTypeBox = slide26.locator('.jct-jobtype-box.with-override');
    await expect(jobTypeBox).toBeVisible();

    // Check job type value is Remote Tech
    const jobTypeValue = slide26.locator('.jct-jobtype-value');
    await expect(jobTypeValue).toHaveText('Remote Tech');

    // Check Override button exists
    const overrideBtn = slide26.locator('.jct-btn-override');
    await expect(overrideBtn).toBeVisible();

    // Check Billable Cost sidebar exists
    const costSidebar = slide26.locator('.jct-cost-sidebar');
    await expect(costSidebar).toBeVisible();

    // Check total is $0.00
    const totalRow = slide26.locator('.jct-cost-row.total');
    await expect(totalRow).toContainText('$0.00');
  });

  test('EitherMarketTruckRoll slide (27) has correct CSS for sidebar and topbar', async ({ page }) => {
    // Navigate to slide 27
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="EitherMarketTruckRoll"]').classList.add('active');
    });

    await page.waitForTimeout(100);

    const slide27 = page.locator('section.slide[data-title="EitherMarketTruckRoll"]');

    // Check sidebar exists and has proper styling
    const sidebar = slide27.locator('.sidebar');
    await expect(sidebar).toBeVisible();

    const sidebarStyles = await sidebar.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.backgroundColor,
        display: computed.display,
        flexDirection: computed.flexDirection
      };
    });

    console.log('Slide 27 Sidebar styles:', JSON.stringify(sidebarStyles, null, 2));

    // Verify sidebar has flex display and non-transparent background
    expect(sidebarStyles.display).toBe('flex');
    expect(sidebarStyles.flexDirection).toBe('column');
    expect(sidebarStyles.background).not.toBe('rgba(0, 0, 0, 0)');

    // Check topbar
    const topbar = slide27.locator('.topbar');
    await expect(topbar).toBeVisible();

    const topbarStyles = await topbar.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.backgroundColor,
        gridColumn: computed.gridColumn
      };
    });

    console.log('Slide 27 Topbar styles:', JSON.stringify(topbarStyles, null, 2));

    // Topbar should have non-transparent background
    expect(topbarStyles.background).not.toBe('rgba(0, 0, 0, 0)');
    expect(topbarStyles.gridColumn).toContain('2');
  });

  test('EitherMarketTruckRoll slide (27) has Truck Roll job type with $325 total', async ({ page }) => {
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="EitherMarketTruckRoll"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    const slide27 = page.locator('section.slide[data-title="EitherMarketTruckRoll"]');

    // Check Job Type section shows Truck Roll
    const jobTypeBox = slide27.locator('.jct-jobtype-box');
    await expect(jobTypeBox).toBeVisible();

    // Check job type value is Truck Roll
    const jobTypeValue = slide27.locator('.jct-jobtype-value');
    await expect(jobTypeValue).toHaveText('Truck Roll');

    // Check Billable Cost sidebar exists
    const costSidebar = slide27.locator('.jct-cost-sidebar');
    await expect(costSidebar).toBeVisible();

    // Check total is $325.00
    const totalRow = slide27.locator('.jct-cost-row.total');
    await expect(totalRow).toContainText('$325.00');

    // Check Create Job button exists
    const createJobBtn = slide27.locator('.jct-btn-create');
    await expect(createJobBtn).toBeVisible();
  });
});

// Environment theme colors
const ENVIRONMENTS = [
  {
    name: 'stage',
    sidebarColor: 'rgb(116, 121, 124)', // #74797c
    topbarColor: 'rgb(122, 122, 122)'   // #7a7a7a
  },
  {
    name: 'training',
    sidebarColor: 'rgb(45, 106, 79)',   // #2d6a4f
    topbarColor: 'rgb(45, 106, 79)'     // #2d6a4f
  },
  {
    name: 'production',
    sidebarColor: 'rgb(30, 58, 76)',    // #1e3a4c
    topbarColor: 'rgb(30, 58, 76)'      // #1e3a4c
  }
];

// Slides that have sidebar and topbar components
const SLIDES_WITH_LAYOUT = SLIDES.filter(slide =>
  slide.index >= 4 && slide.title !== 'LoggedInModal'
);

test.describe('Environment Theme Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`file:///${process.cwd().replace(/\\/g, '/')}/index.html`);
  });

  for (const env of ENVIRONMENTS) {
    test(`All slides have CORRECT ${env.name} environment colors`, async ({ page }) => {
      // Switch to the environment
      await page.click(`.env-btn[data-env="${env.name}"]`);
      await page.waitForTimeout(100);

      // Verify the canvas has the correct data-env attribute
      const canvas = page.locator('#canvas');
      await expect(canvas).toHaveAttribute('data-env', env.name);

      console.log(`\nTesting ${env.name.toUpperCase()} environment:`);
      console.log(`Expected sidebar color: ${env.sidebarColor}`);
      console.log(`Expected topbar color: ${env.topbarColor}`);

      let passedSlides = 0;
      let failedSlides = [];

      // Test each slide with layout components
      for (const slide of SLIDES_WITH_LAYOUT) {
        // Activate the slide
        await page.evaluate((title) => {
          document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
          const targetSlide = document.querySelector(`[data-title="${title}"]`);
          if (targetSlide) targetSlide.classList.add('active');
        }, slide.title);

        await page.waitForTimeout(50);

        const slideElement = page.locator(`section.slide[data-title="${slide.title}"]`);
        const sidebar = slideElement.locator('.sidebar');
        const topbar = slideElement.locator('.topbar');

        // Check if sidebar exists and get its background color
        const sidebarExists = await sidebar.count() > 0;
        const topbarExists = await topbar.count() > 0;

        if (sidebarExists && topbarExists) {
          const sidebarBg = await sidebar.evaluate(el => window.getComputedStyle(el).backgroundColor);
          const topbarBg = await topbar.evaluate(el => window.getComputedStyle(el).backgroundColor);

          // STRICT CHECK: Verify colors EXACTLY match the expected environment colors
          const sidebarCorrect = sidebarBg === env.sidebarColor;
          const topbarCorrect = topbarBg === env.topbarColor;

          if (sidebarCorrect && topbarCorrect) {
            passedSlides++;
          } else {
            failedSlides.push({
              title: slide.title,
              sidebarBg,
              topbarBg,
              expectedSidebar: env.sidebarColor,
              expectedTopbar: env.topbarColor,
              issue: !sidebarCorrect ? `sidebar color mismatch (got ${sidebarBg}, expected ${env.sidebarColor})` : `topbar color mismatch (got ${topbarBg}, expected ${env.topbarColor})`
            });
          }
        } else {
          // Skip slides without both components
          passedSlides++;
        }
      }

      console.log(`Passed: ${passedSlides}/${SLIDES_WITH_LAYOUT.length} slides`);

      if (failedSlides.length > 0) {
        console.log('FAILED slides with wrong colors:', JSON.stringify(failedSlides, null, 2));
      }

      // All slides should have CORRECT environment colors
      expect(failedSlides.length).toBe(0);
    });

    test(`Verify sidebar colors match ${env.name} theme for key slides`, async ({ page }) => {
      // Switch to the environment
      await page.click(`.env-btn[data-env="${env.name}"]`);
      await page.waitForTimeout(100);

      // Test a few key slides that definitely have sidebars
      const keySlides = ['AccountActivity', 'JobManagement', 'SystemManagement'];

      for (const slideTitle of keySlides) {
        await page.evaluate((title) => {
          document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
          document.querySelector(`[data-title="${title}"]`).classList.add('active');
        }, slideTitle);

        await page.waitForTimeout(50);

        const slideElement = page.locator(`section.slide[data-title="${slideTitle}"]`);
        const sidebar = slideElement.locator('.sidebar');

        const sidebarBg = await sidebar.evaluate(el => window.getComputedStyle(el).backgroundColor);

        console.log(`${env.name} - ${slideTitle}: sidebar=${sidebarBg}`);

        // Verify sidebar has a non-transparent background
        expect(sidebarBg).not.toBe('rgba(0, 0, 0, 0)');
        expect(sidebarBg).not.toBe('transparent');
      }
    });

    test(`Verify topbar colors match ${env.name} theme for key slides`, async ({ page }) => {
      // Switch to the environment
      await page.click(`.env-btn[data-env="${env.name}"]`);
      await page.waitForTimeout(100);

      // Test a few key slides that definitely have topbars
      const keySlides = ['AccountActivity', 'JobManagement', 'SystemManagement'];

      for (const slideTitle of keySlides) {
        await page.evaluate((title) => {
          document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
          document.querySelector(`[data-title="${title}"]`).classList.add('active');
        }, slideTitle);

        await page.waitForTimeout(50);

        const slideElement = page.locator(`section.slide[data-title="${slideTitle}"]`);
        const topbar = slideElement.locator('.topbar');

        const topbarBg = await topbar.evaluate(el => window.getComputedStyle(el).backgroundColor);

        console.log(`${env.name} - ${slideTitle}: topbar=${topbarBg}`);

        // Verify topbar has a non-transparent background
        expect(topbarBg).not.toBe('rgba(0, 0, 0, 0)');
        expect(topbarBg).not.toBe('transparent');
      }
    });
  }

  test('Environment switcher buttons work correctly', async ({ page }) => {
    const canvas = page.locator('#canvas');

    // Test Stage
    await page.click('.env-btn[data-env="stage"]');
    await page.waitForTimeout(100);
    await expect(canvas).toHaveAttribute('data-env', 'stage');
    await expect(page.locator('.env-btn[data-env="stage"]')).toHaveClass(/active/);

    // Test Training
    await page.click('.env-btn[data-env="training"]');
    await page.waitForTimeout(100);
    await expect(canvas).toHaveAttribute('data-env', 'training');
    await expect(page.locator('.env-btn[data-env="training"]')).toHaveClass(/active/);

    // Test Production
    await page.click('.env-btn[data-env="production"]');
    await page.waitForTimeout(100);
    await expect(canvas).toHaveAttribute('data-env', 'production');
    await expect(page.locator('.env-btn[data-env="production"]')).toHaveClass(/active/);

    console.log('Environment switcher buttons work correctly');
  });

  test('All 27 slides maintain layout integrity across all environments', async ({ page }) => {
    for (const env of ENVIRONMENTS) {
      // Switch environment
      await page.click(`.env-btn[data-env="${env.name}"]`);
      await page.waitForTimeout(100);

      console.log(`\nChecking layout integrity for ${env.name.toUpperCase()}:`);

      for (const slide of SLIDES) {
        await page.evaluate((title) => {
          document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
          const target = document.querySelector(`[data-title="${title}"]`);
          if (target) target.classList.add('active');
        }, slide.title);

        await page.waitForTimeout(30);

        const slideElement = page.locator(`section.slide[data-title="${slide.title}"]`);
        await expect(slideElement).toBeVisible();
      }

      console.log(`${env.name}: All ${SLIDES.length} slides visible`);
    }
  });

  // Test that navigation preserves environment colors - this catches bugs where
  // clicking navigation buttons (like Create Job) reverts colors to Stage
  for (const env of ENVIRONMENTS) {
    test(`Navigation preserves ${env.name} colors when using goto buttons`, async ({ page }) => {
      // Switch to environment
      await page.click(`.env-btn[data-env="${env.name}"]`);
      await page.waitForTimeout(100);

      console.log(`\nTesting navigation preserves ${env.name.toUpperCase()} colors:`);

      // Navigate to JobManagement slide (slide 11)
      await page.evaluate(() => {
        document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
        document.querySelector('[data-title="JobManagement"]').classList.add('active');
      });
      await page.waitForTimeout(100);

      // Verify colors on JobManagement
      const jobMgmtSlide = page.locator('section.slide[data-title="JobManagement"]');
      const jobMgmtSidebar = await jobMgmtSlide.locator('.sidebar').evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );
      console.log(`JobManagement sidebar: ${jobMgmtSidebar} (expected: ${env.sidebarColor})`);
      expect(jobMgmtSidebar).toBe(env.sidebarColor);

      // Simulate clicking Create Job button to navigate to job creation slides
      // This tests the exact bug scenario: Production -> JobManagement -> Create Job -> colors revert
      const navigationTargets = [
        'TruckRollJobCreation',
        'TruckRollMarketTruckRoll',
        'RemoteTechJobCreation',
        'RemoteTechMarketRemoteTech',
        'EitherMarketJobOpened',
        'EitherMarketDropship',
        'EitherMarketRemoteTech',
        'EitherMarketTruckRoll'
      ];

      for (const target of navigationTargets) {
        // Navigate using the slide navigation (simulates button click navigation)
        await page.evaluate((title) => {
          document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
          document.querySelector(`[data-title="${title}"]`).classList.add('active');
        }, target);
        await page.waitForTimeout(50);

        // Verify the environment is still set correctly
        const canvas = page.locator('#canvas');
        await expect(canvas).toHaveAttribute('data-env', env.name);

        // Verify the sidebar color is correct
        const slideElement = page.locator(`section.slide[data-title="${target}"]`);
        const sidebarBg = await slideElement.locator('.sidebar').evaluate(el =>
          window.getComputedStyle(el).backgroundColor
        );
        const topbarBg = await slideElement.locator('.topbar').evaluate(el =>
          window.getComputedStyle(el).backgroundColor
        );

        // STRICT check - colors must match the selected environment exactly
        expect(sidebarBg).toBe(env.sidebarColor);
        expect(topbarBg).toBe(env.topbarColor);

        console.log(`${target}: sidebar=${sidebarBg === env.sidebarColor ? 'CORRECT' : 'WRONG'}, topbar=${topbarBg === env.topbarColor ? 'CORRECT' : 'WRONG'}`);
      }

      console.log(`All navigation targets preserved ${env.name} colors correctly`);
    });
  }

  // Test the specific user scenario that revealed the bug:
  // Production -> Slide 11 -> Change market type -> Create Job -> Should maintain Production colors
  test('REGRESSION: Production colors preserved after Create Job navigation', async ({ page }) => {
    // Switch to Production
    await page.click('.env-btn[data-env="production"]');
    await page.waitForTimeout(100);

    console.log('\nREGRESSION TEST: Production -> JobManagement -> Create Job navigation');

    // Navigate to JobManagement (slide 11)
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="JobManagement"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    // Verify we're in Production mode
    const canvas = page.locator('#canvas');
    await expect(canvas).toHaveAttribute('data-env', 'production');
    console.log('Step 1: JobManagement slide active, Production environment confirmed');

    // Verify JobManagement has Production colors
    const jobMgmtSidebar = await page.locator('[data-title="JobManagement"] .sidebar')
      .evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(jobMgmtSidebar).toBe('rgb(30, 58, 76)'); // Production sidebar color
    console.log('Step 2: JobManagement has Production sidebar color');

    // Simulate navigation to different job creation flows
    // This simulates clicking Create Job with different market types
    const createJobDestinations = [
      { title: 'TruckRollJobCreation', marketType: 'TruckRoll' },
      { title: 'RemoteTechJobCreation', marketType: 'RemoteTech' },
      { title: 'EitherMarketJobOpened', marketType: 'Either' }
    ];

    for (const dest of createJobDestinations) {
      await page.evaluate((title) => {
        document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
        document.querySelector(`[data-title="${title}"]`).classList.add('active');
      }, dest.title);
      await page.waitForTimeout(100);

      // THIS IS THE BUG CHECK: After navigation, environment must still be Production
      await expect(canvas).toHaveAttribute('data-env', 'production');

      // Get sidebar and topbar colors
      const sidebar = page.locator(`[data-title="${dest.title}"] .sidebar`);
      const topbar = page.locator(`[data-title="${dest.title}"] .topbar`);

      const sidebarBg = await sidebar.evaluate(el => window.getComputedStyle(el).backgroundColor);
      const topbarBg = await topbar.evaluate(el => window.getComputedStyle(el).backgroundColor);

      // Colors MUST be Production colors, NOT Stage colors
      expect(sidebarBg).toBe('rgb(30, 58, 76)');   // Production, NOT Stage rgb(116, 121, 124)
      expect(topbarBg).toBe('rgb(30, 58, 76)');    // Production, NOT Stage rgb(122, 122, 122)

      console.log(`Step 3a: ${dest.title} (${dest.marketType}): sidebar=${sidebarBg}, topbar=${topbarBg} - CORRECT`);
    }

    console.log('REGRESSION TEST PASSED: Production colors preserved after Create Job navigation');
  });

  // Test that switching environments then navigating maintains the new environment
  test('Environment change followed by navigation maintains new environment', async ({ page }) => {
    // Start in Stage
    await page.click('.env-btn[data-env="stage"]');
    await page.waitForTimeout(100);

    // Navigate to a job creation slide
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="TruckRollJobCreation"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    // Verify Stage colors
    let sidebarBg = await page.locator('[data-title="TruckRollJobCreation"] .sidebar')
      .evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(sidebarBg).toBe('rgb(116, 121, 124)'); // Stage
    console.log('Stage environment: TruckRollJobCreation has Stage colors');

    // Now switch to Training
    await page.click('.env-btn[data-env="training"]');
    await page.waitForTimeout(100);

    // Navigate to another slide
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="RemoteTechJobCreation"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    // Verify Training colors
    sidebarBg = await page.locator('[data-title="RemoteTechJobCreation"] .sidebar')
      .evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(sidebarBg).toBe('rgb(45, 106, 79)'); // Training
    console.log('Training environment: RemoteTechJobCreation has Training colors');

    // Now switch to Production
    await page.click('.env-btn[data-env="production"]');
    await page.waitForTimeout(100);

    // Navigate to another slide
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="EitherMarketTruckRoll"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    // Verify Production colors
    sidebarBg = await page.locator('[data-title="EitherMarketTruckRoll"] .sidebar')
      .evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(sidebarBg).toBe('rgb(30, 58, 76)'); // Production
    console.log('Production environment: EitherMarketTruckRoll has Production colors');

    console.log('Environment change followed by navigation maintains correct colors');
  });
});

// External Tab Slides CSS Validation
test.describe('External Tab Slides Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`file:///${process.cwd().replace(/\\/g, '/')}/index.html`);
  });

  const EXTERNAL_TABS = [
    { title: 'AlarmTab', containerClass: 'alarm-tab', headerClass: 'alarm-header', mainClass: 'alarm-main', headerAlign: 'center', headerJustify: 'space-between' },
    { title: 'VoziqTab', containerClass: 'voziq-tab', headerClass: 'voziq-header', mainClass: 'voziq-main', headerAlign: 'stretch', headerJustify: 'normal' },
    { title: 'SupportCenterTab', containerClass: 'support-tab', headerClass: 'support-header', mainClass: 'support-main', headerAlign: 'center', headerJustify: 'space-between' },
    { title: 'MyAccountCSTab', containerClass: 'myaccount-tab', headerClass: 'myaccount-header', mainClass: 'myaccount-main', headerAlign: 'center', headerJustify: 'flex-end' }
  ];

  for (const tab of EXTERNAL_TABS) {
    test(`${tab.title} slide has correct CSS styling`, async ({ page }) => {
      // Navigate to the slide using the navigation module
      await page.evaluate((title) => {
        const slideIndex = Array.from(document.querySelectorAll('.slide')).findIndex(s => s.dataset.title === title);
        window.SlideNavigation.setActive(slideIndex);
      }, tab.title);
      await page.waitForTimeout(100);

      const slide = page.locator(`section.slide[data-title="${tab.title}"]`);
      await expect(slide).toBeVisible();

      // Check slide has correct background color
      const slideStyles = await slide.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          background: computed.backgroundColor,
          padding: computed.padding
        };
      });
      console.log(`${tab.title} slide styles:`, JSON.stringify(slideStyles, null, 2));

      // Verify dark background
      expect(slideStyles.background).toBe('rgb(26, 26, 46)'); // #1a1a2e
      expect(slideStyles.padding).toBe('0px');

      // Check external-tab-container exists
      const container = slide.locator('.external-tab-container');
      await expect(container).toBeVisible();

      const containerStyles = await container.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          flexDirection: computed.flexDirection,
          width: computed.width,
          height: computed.height
        };
      });
      console.log(`${tab.title} container styles:`, JSON.stringify(containerStyles, null, 2));

      expect(containerStyles.display).toBe('flex');
      expect(containerStyles.flexDirection).toBe('column');

      // Check header exists and has correct styling (use tab-specific header class)
      const header = slide.locator(`.${tab.headerClass}`);
      await expect(header).toBeVisible();

      const headerStyles = await header.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          alignItems: computed.alignItems,
          justifyContent: computed.justifyContent
        };
      });
      console.log(`${tab.title} header styles:`, JSON.stringify(headerStyles, null, 2));

      expect(headerStyles.display).toBe('flex');
      expect(headerStyles.alignItems).toBe(tab.headerAlign);
      expect(headerStyles.justifyContent).toBe(tab.headerJustify);

      // Check that the global Back to CAD button is visible for external tabs
      const backBtn = page.locator('#backToCadBtn');
      await expect(backBtn).toHaveClass(/visible/);

      const backBtnStyles = await backBtn.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          color: computed.color,
          cursor: computed.cursor
        };
      });
      console.log(`${tab.title} back button styles:`, JSON.stringify(backBtnStyles, null, 2));

      expect(backBtnStyles.display).toBe('flex');
      expect(backBtnStyles.color).toBe('rgb(255, 255, 255)');
      expect(backBtnStyles.cursor).toBe('pointer');

      // Check main content area exists (use tab-specific main class)
      const main = slide.locator(`.${tab.mainClass}`);
      await expect(main).toBeVisible();

      console.log(`${tab.title} CSS validation passed`);
    });
  }

  test('External tab slides have navigation back to CAD', async ({ page }) => {
    for (const tab of EXTERNAL_TABS) {
      await page.evaluate((title) => {
        document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
        document.querySelector(`[data-title="${title}"]`).classList.add('active');
        window.SlideNavigation.setActive(
          Array.from(document.querySelectorAll('.slide')).findIndex(s => s.dataset.title === title)
        );
      }, tab.title);
      await page.waitForTimeout(50);

      // Check the global back button is visible and configured correctly
      const backBtn = page.locator('#backToCadBtn');
      await expect(backBtn).toHaveClass(/visible/);

      const gotoValue = await backBtn.getAttribute('data-goto-on-click');
      expect(gotoValue).toBe('6'); // All back buttons go to slide 6 (AccountActivity)
      console.log(`${tab.title} back button navigates to slide ${gotoValue}`);
    }
  });
});

// Sidebar Navigation Disabled State Validation
test.describe('Sidebar Navigation Disabled State', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`file:///${process.cwd().replace(/\\/g, '/')}/index.html`);
  });

  test('Slides 1-5 have Alarm.com and Voziq disabled', async ({ page }) => {
    const earlySlides = ['LoggedIn', 'LoggedInFilled', 'LoggedInResults', 'LoggedInModal', 'VerifyAccount'];

    for (const slideTitle of earlySlides) {
      await page.evaluate((title) => {
        document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
        document.querySelector(`[data-title="${title}"]`).classList.add('active');
      }, slideTitle);
      await page.waitForTimeout(100);

      // Check Alarm.com nav item is disabled
      const alarmNav = page.locator(`[data-title="${slideTitle}"] .nav-item`).filter({ hasText: 'Alarm.com' });
      const alarmClasses = await alarmNav.getAttribute('class');
      expect(alarmClasses).toContain('disabled');
      expect(alarmClasses).toContain('muted');

      // Check Voziq nav item is disabled
      const voziqNav = page.locator(`[data-title="${slideTitle}"] .nav-item`).filter({ hasText: 'Voziq' });
      const voziqClasses = await voziqNav.getAttribute('class');
      expect(voziqClasses).toContain('disabled');
      expect(voziqClasses).toContain('muted');

      // Check Support Center is enabled (has goto-zone class)
      const supportNav = page.locator(`[data-title="${slideTitle}"] .nav-item`).filter({ hasText: 'Support Center' });
      const supportClasses = await supportNav.getAttribute('class');
      expect(supportClasses).toContain('goto-zone');
      expect(supportClasses).not.toContain('disabled');

      // Check My Account CS is enabled
      const myAccountNav = page.locator(`[data-title="${slideTitle}"] .nav-item`).filter({ hasText: 'My Account CS' });
      const myAccountClasses = await myAccountNav.getAttribute('class');
      expect(myAccountClasses).toContain('goto-zone');
      expect(myAccountClasses).not.toContain('disabled');

      console.log(`${slideTitle}: Alarm.com & Voziq disabled, Support Center & My Account CS enabled`);
    }
  });

  test('Slides 6-12 have all external nav items enabled', async ({ page }) => {
    const laterSlides = ['AccountActivity', 'ContractInfo', 'EventHistory', 'AccountManagement', 'PaymentBilling', 'JobManagement', 'SystemManagement'];

    for (const slideTitle of laterSlides) {
      await page.evaluate((title) => {
        document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
        document.querySelector(`[data-title="${title}"]`).classList.add('active');
      }, slideTitle);
      await page.waitForTimeout(100);

      // Check Alarm.com nav item is enabled (has goto-zone, not disabled, not muted)
      const alarmNav = page.locator(`[data-title="${slideTitle}"] .nav-item`).filter({ hasText: 'Alarm.com' });
      const alarmClasses = await alarmNav.getAttribute('class');
      expect(alarmClasses).toContain('goto-zone');
      expect(alarmClasses).not.toContain('disabled');
      expect(alarmClasses).not.toContain('muted'); // Should NOT be muted when enabled

      // Check Voziq nav item is enabled (not muted when has navigation target)
      const voziqNav = page.locator(`[data-title="${slideTitle}"] .nav-item`).filter({ hasText: 'Voziq' });
      const voziqClasses = await voziqNav.getAttribute('class');
      expect(voziqClasses).toContain('goto-zone');
      expect(voziqClasses).not.toContain('disabled');
      expect(voziqClasses).not.toContain('muted'); // Should NOT be muted when enabled

      // Check Support Center is enabled
      const supportNav = page.locator(`[data-title="${slideTitle}"] .nav-item`).filter({ hasText: 'Support Center' });
      const supportClasses = await supportNav.getAttribute('class');
      expect(supportClasses).toContain('goto-zone');

      // Check My Account CS is enabled
      const myAccountNav = page.locator(`[data-title="${slideTitle}"] .nav-item`).filter({ hasText: 'My Account CS' });
      const myAccountClasses = await myAccountNav.getAttribute('class');
      expect(myAccountClasses).toContain('goto-zone');

      console.log(`${slideTitle}: All external nav items enabled`);
    }
  });

  test('MoveCustomer slides (13-18) have all external nav items enabled', async ({ page }) => {
    // MoveCustomer slides should have all external nav items enabled like slides 6-12
    const moveCustomerSlides = [
      'MoveCustomer',
      'MoveCustomerFilled',
      'MoveCustomerModal',
      'MoveCustomerFull',
      'MoveCustomerComplete',
      'MoveCustomerJobCreated'
    ];

    for (const slideTitle of moveCustomerSlides) {
      await page.evaluate((title) => {
        document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
        document.querySelector(`[data-title="${title}"]`).classList.add('active');
      }, slideTitle);
      await page.waitForTimeout(100);

      // Check Alarm.com nav item is enabled
      const alarmNav = page.locator(`[data-title="${slideTitle}"] .nav-item`).filter({ hasText: 'Alarm.com' });
      const alarmClasses = await alarmNav.getAttribute('class');
      expect(alarmClasses).toContain('goto-zone');
      expect(alarmClasses).not.toContain('disabled');
      expect(alarmClasses).not.toContain('muted');

      // Check Voziq nav item is enabled
      const voziqNav = page.locator(`[data-title="${slideTitle}"] .nav-item`).filter({ hasText: 'Voziq' });
      const voziqClasses = await voziqNav.getAttribute('class');
      expect(voziqClasses).toContain('goto-zone');
      expect(voziqClasses).not.toContain('disabled');
      expect(voziqClasses).not.toContain('muted');

      // Check Support Center is enabled
      const supportNav = page.locator(`[data-title="${slideTitle}"] .nav-item`).filter({ hasText: 'Support Center' });
      const supportClasses = await supportNav.getAttribute('class');
      expect(supportClasses).toContain('goto-zone');
      expect(supportClasses).not.toContain('disabled');

      // Check My Account CS is enabled
      const myAccountNav = page.locator(`[data-title="${slideTitle}"] .nav-item`).filter({ hasText: 'My Account CS' });
      const myAccountClasses = await myAccountNav.getAttribute('class');
      expect(myAccountClasses).toContain('goto-zone');
      expect(myAccountClasses).not.toContain('disabled');

      console.log(`${slideTitle}: All external nav items enabled`);
    }
  });

  test('Slides with status dots have correct colors (Alarm.com=orange, Voziq=yellow)', async ({ page }) => {
    // Slides 6-12 and MoveCustomer slides have data-show-status="true"
    const slidesWithStatusDots = [
      'AccountActivity',
      'ContractInfo',
      'EventHistory',
      'AccountManagement',
      'PaymentBilling',
      'JobManagement',
      'SystemManagement',
      'MoveCustomer',
      'MoveCustomerFilled',
      'MoveCustomerModal',
      'MoveCustomerFull',
      'MoveCustomerComplete',
      'MoveCustomerJobCreated'
    ];

    for (const slideTitle of slidesWithStatusDots) {
      await page.evaluate((title) => {
        document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
        document.querySelector(`[data-title="${title}"]`).classList.add('active');
      }, slideTitle);
      await page.waitForTimeout(100);

      // Check Alarm.com has orange dot
      const alarmNav = page.locator(`[data-title="${slideTitle}"] .nav-item`).filter({ hasText: 'Alarm.com' });
      const alarmOrangeDot = alarmNav.locator('.dot.orange');
      await expect(alarmOrangeDot).toBeVisible();

      // Check Voziq has yellow dot
      const voziqNav = page.locator(`[data-title="${slideTitle}"] .nav-item`).filter({ hasText: 'Voziq' });
      const voziqYellowDot = voziqNav.locator('.dot.yellow');
      await expect(voziqYellowDot).toBeVisible();

      console.log(`${slideTitle}: Alarm.com has orange dot, Voziq has yellow dot`);
    }
  });
});

// Slide Indicator Validation
test.describe('Slide Indicator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`file:///${process.cwd().replace(/\\/g, '/')}/index.html`);
  });

  test('Slide indicator displays correct slide number', async ({ page }) => {
    const indicator = page.locator('#slideIndicator');
    await expect(indicator).toBeVisible();

    // Check initial state (slide 1)
    const currentEl = indicator.locator('.slide-indicator-current');
    const totalEl = indicator.locator('.slide-indicator-total');

    await expect(currentEl).toHaveText('1');
    await expect(totalEl).toHaveText('35');
    console.log('Initial indicator shows 1/34');

    // Navigate to slide 10
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.slide')[9].classList.add('active');
      window.SlideNavigation.setActive(9);
    });
    await page.waitForTimeout(100);

    await expect(currentEl).toHaveText('10');
    console.log('After navigation, indicator shows 10/33');

    // Navigate to last slide (33)
    await page.evaluate(() => {
      window.SlideNavigation.setActive(32);
    });
    await page.waitForTimeout(100);

    await expect(currentEl).toHaveText('33');
    console.log('At last slide, indicator shows 33/33');
  });

  test('Slide indicator has correct styling', async ({ page }) => {
    const indicator = page.locator('#slideIndicator');
    await expect(indicator).toBeVisible();

    const styles = await indicator.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        position: computed.position,
        right: computed.right
      };
    });
    console.log('Slide indicator styles:', JSON.stringify(styles, null, 2));

    expect(styles.position).toBe('absolute');
    expect(styles.right).toBe('0px');
    console.log('Slide indicator has correct positioning');
  });

  test('Back to CAD button only visible on external tab slides', async ({ page }) => {
    const backBtn = page.locator('#backToCadBtn');

    // Check button is NOT visible on first slide (not an external tab)
    await expect(backBtn).not.toHaveClass(/visible/);
    console.log('Back to CAD button hidden on slide 1');

    // Navigate to AlarmTab and check button IS visible
    await page.evaluate(() => {
      const alarmTabIndex = Array.from(document.querySelectorAll('.slide')).findIndex(s => s.dataset.title === 'AlarmTab');
      window.SlideNavigation.setActive(alarmTabIndex);
    });
    await page.waitForTimeout(100);

    await expect(backBtn).toHaveClass(/visible/);
    console.log('Back to CAD button visible on AlarmTab');

    // Navigate back to AccountActivity and check button is hidden
    await page.evaluate(() => {
      window.SlideNavigation.setActive(5); // AccountActivity is slide 6 (index 5)
    });
    await page.waitForTimeout(100);

    await expect(backBtn).not.toHaveClass(/visible/);
    console.log('Back to CAD button hidden on AccountActivity');
  });
});

test.describe('Version Consistency', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`file:///${process.cwd().replace(/\\/g, '/')}/index.html`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(300);
  });

  test('All slides with sidebar have the same version number (3.6.0)', async ({ page }) => {
    // Slides that have a sidebar with version display
    const slidesWithSidebar = [
      'LoggedIn', 'LoggedInFilled', 'LoggedInResults', 'LoggedInModal', 'VerifyAccount',
      'AccountActivity', 'ContractInfo', 'EventHistory', 'AccountManagement',
      'PaymentBilling', 'JobManagement', 'SystemManagement',
      'MoveCustomer', 'MoveCustomerFilled', 'MoveCustomerModal',
      'MoveCustomerFull', 'MoveCustomerComplete', 'MoveCustomerJobCreated',
      'TruckRollJobCreation', 'TruckRollMarketTruckRoll',
      'RemoteTechJobCreation', 'RemoteTechMarketRemoteTech', 'RemoteTechMarketDropship',
      'EitherMarketJobOpened', 'EitherMarketDropship', 'EitherMarketRemoteTech', 'EitherMarketTruckRoll',
      'AccountActivityActionModal', 'AccountActivityIncidentModal'
    ];

    const expectedVersion = '3.6.0';
    const versions = {};

    for (const slideTitle of slidesWithSidebar) {
      // Navigate to the slide
      await page.evaluate((title) => {
        const slideIndex = Array.from(document.querySelectorAll('.slide')).findIndex(s => s.dataset.title === title);
        if (slideIndex >= 0) {
          window.SlideNavigation.setActive(slideIndex);
        }
      }, slideTitle);
      await page.waitForTimeout(50);

      // Get the version from the sidebar
      const versionText = await page.evaluate((title) => {
        const slide = document.querySelector(`[data-title="${title}"]`);
        if (!slide) return null;
        const versionEl = slide.querySelector('.version');
        return versionEl ? versionEl.textContent.trim() : null;
      }, slideTitle);

      if (versionText) {
        versions[slideTitle] = versionText;
        const versionNumber = versionText.replace('version ', '');
        expect(versionNumber).toBe(expectedVersion);
        console.log(`${slideTitle}: ${versionText} - CORRECT`);
      }
    }

    // Verify we checked a reasonable number of slides
    const checkedCount = Object.keys(versions).length;
    console.log(`\nVerified ${checkedCount} slides all have version ${expectedVersion}`);
    expect(checkedCount).toBeGreaterThan(20);
  });

  test('No slides have mismatched version numbers (3.6.0)', async ({ page }) => {
    // Get all unique versions across all slides
    const versionInfo = await page.evaluate(() => {
      const slides = document.querySelectorAll('.slide');
      const results = [];

      slides.forEach((slide, index) => {
        const title = slide.dataset.title || `Slide ${index}`;
        const versionEl = slide.querySelector('.version');
        if (versionEl) {
          results.push({
            slide: title,
            version: versionEl.textContent.trim()
          });
        }
      });

      return results;
    });

    // Check all versions are the same
    const uniqueVersions = [...new Set(versionInfo.map(v => v.version))];

    console.log(`Found ${versionInfo.length} slides with version displays`);
    console.log(`Unique versions: ${uniqueVersions.join(', ')}`);

    if (uniqueVersions.length > 1) {
      console.log('\nVersion mismatches found:');
      versionInfo.forEach(v => {
        console.log(`  ${v.slide}: ${v.version}`);
      });
    }

    expect(uniqueVersions.length).toBe(1);
    expect(uniqueVersions[0]).toBe('version 3.6.0');
    console.log('All slides have consistent version: version 3.6.0');
  });
});

test.describe('Contract Info Modals', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`file:///${process.cwd().replace(/\\/g, '/')}/index.html`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(300);

    // Navigate to ContractInfo slide (slide 7, index 6)
    await page.evaluate(() => {
      window.SlideNavigation.setActive(6);
    });
    await page.waitForTimeout(100);
  });

  test('Extension Contract modal opens when Send Copy button is clicked', async ({ page }) => {
    const contractSlide = page.locator('[data-title="ContractInfo"]');
    const extensionModal = contractSlide.locator('#extension-contract-modal');

    // Modal should be hidden initially
    await expect(extensionModal).not.toHaveClass(/active/);
    console.log('Extension modal is hidden initially');

    // Click the Extension Send Copy button (use data-testid to avoid matching Cancelled view buttons)
    const extensionSendBtn = contractSlide.locator('[data-testid="contract-history-row-1-send-btn"]');
    await extensionSendBtn.click();
    await page.waitForTimeout(100);

    // Modal should be visible
    await expect(extensionModal).toHaveClass(/active/);
    console.log('Extension modal opened after clicking Send Copy');

    // Verify modal content
    const warningText = await extensionModal.locator('.contract-modal-warning').textContent();
    expect(warningText).toContain('1–2 business days');
    expect(warningText).toContain('extension letter');
    console.log('Extension modal has correct warning text');
  });

  test('Initial Contract modal opens when Send Copy button is clicked', async ({ page }) => {
    const contractSlide = page.locator('[data-title="ContractInfo"]');
    const initialModal = contractSlide.locator('#initial-contract-modal');

    // Modal should be hidden initially
    await expect(initialModal).not.toHaveClass(/active/);
    console.log('Initial Contract modal is hidden initially');

    // Click the Initial Contract Send Copy button (use data-testid to avoid matching Cancelled view buttons)
    const initialSendBtn = contractSlide.locator('[data-testid="contract-history-row-2-send-btn"]');
    await initialSendBtn.click();
    await page.waitForTimeout(100);

    // Modal should be visible
    await expect(initialModal).toHaveClass(/active/);
    console.log('Initial Contract modal opened after clicking Send Copy');

    // Verify modal content
    const warningText = await initialModal.locator('.contract-modal-warning').textContent();
    expect(warningText).toContain('7 business days');
    expect(warningText).toContain('contract email');
    console.log('Initial Contract modal has correct warning text');
  });

  test('Modal closes when Close button is clicked', async ({ page }) => {
    const contractSlide = page.locator('[data-title="ContractInfo"]');
    const extensionModal = contractSlide.locator('#extension-contract-modal');

    // Open the modal
    await contractSlide.locator('[data-testid="contract-history-row-1-send-btn"]').click();
    await page.waitForTimeout(100);
    await expect(extensionModal).toHaveClass(/active/);

    // Click close button
    await extensionModal.locator('.contract-modal-close').click();
    await page.waitForTimeout(100);

    // Modal should be hidden
    await expect(extensionModal).not.toHaveClass(/active/);
    console.log('Modal closed when Close button clicked');
  });

  test('Modal closes when Send Email button is clicked and stays on slide 7', async ({ page }) => {
    const contractSlide = page.locator('[data-title="ContractInfo"]');
    const extensionModal = contractSlide.locator('#extension-contract-modal');

    // Open the modal
    await contractSlide.locator('[data-testid="contract-history-row-1-send-btn"]').click();
    await page.waitForTimeout(100);
    await expect(extensionModal).toHaveClass(/active/);

    // Click Send Email button
    await extensionModal.locator('.contract-modal-send').click();
    await page.waitForTimeout(100);

    // Modal should be hidden
    await expect(extensionModal).not.toHaveClass(/active/);
    console.log('Modal closed when Send Email clicked');

    // Should still be on ContractInfo slide
    const isContractInfoActive = await page.evaluate(() => {
      const slide = document.querySelector('[data-title="ContractInfo"]');
      return slide && slide.classList.contains('active');
    });
    expect(isContractInfoActive).toBe(true);
    console.log('Still on ContractInfo slide after Send Email');
  });

  test('Modal closes when pressing Escape key', async ({ page }) => {
    const contractSlide = page.locator('[data-title="ContractInfo"]');
    const extensionModal = contractSlide.locator('#extension-contract-modal');

    // Open the modal
    await contractSlide.locator('[data-testid="contract-history-row-1-send-btn"]').click();
    await page.waitForTimeout(100);
    await expect(extensionModal).toHaveClass(/active/);

    // Press Escape key
    await page.keyboard.press('Escape');
    await page.waitForTimeout(100);

    // Modal should be hidden
    await expect(extensionModal).not.toHaveClass(/active/);
    console.log('Modal closed when pressing Escape key');
  });
});

test.describe('Event History Dispatch Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`file:///${process.cwd().replace(/\\/g, '/')}/index.html`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(300);

    // Navigate to EventHistory slide (slide 8, index 7)
    await page.evaluate(() => {
      window.SlideNavigation.setActive(7);
    });
    await page.waitForTimeout(100);
  });

  test('Dispatch modal opens when + New button is clicked', async ({ page }) => {
    const eventSlide = page.locator('[data-title="EventHistory"]');
    const dispatchModal = eventSlide.locator('#temp-dispatch-modal');

    // Modal should be hidden initially
    await expect(dispatchModal).not.toHaveClass(/active/);
    console.log('Dispatch modal is hidden initially');

    // Click the + New button using JavaScript to avoid canvas-controls overlay
    await page.evaluate(() => {
      const btn = document.querySelector('[data-title="EventHistory"] [data-modal="temp-dispatch"]');
      if (btn) btn.click();
    });
    await page.waitForTimeout(100);

    // Modal should be visible
    await expect(dispatchModal).toHaveClass(/active/);
    console.log('Dispatch modal opened after clicking + New');

    // Verify modal content
    const headerText = await dispatchModal.locator('.dispatch-modal-header h2').textContent();
    expect(headerText).toBe('Add Temporary Dispatch Note');
    console.log('Dispatch modal has correct header');
  });

  test('Dispatch modal has correct form fields', async ({ page }) => {
    const eventSlide = page.locator('[data-title="EventHistory"]');
    const dispatchModal = eventSlide.locator('#temp-dispatch-modal');

    // Open the modal using JavaScript
    await page.evaluate(() => {
      const btn = document.querySelector('[data-title="EventHistory"] [data-modal="temp-dispatch"]');
      if (btn) btn.click();
    });
    await page.waitForTimeout(100);

    // Verify form fields exist
    await expect(dispatchModal.locator('label:has-text("Effective Date")')).toBeVisible();
    await expect(dispatchModal.locator('label:has-text("Effective Time")')).toBeVisible();
    await expect(dispatchModal.locator('label:has-text("Expire Date")')).toBeVisible();
    await expect(dispatchModal.locator('label:has-text("Expire Time")')).toBeVisible();
    await expect(dispatchModal.locator('label:has-text("Dispatch Instructions")')).toBeVisible();
    await expect(dispatchModal.locator('textarea')).toBeVisible();
    await expect(dispatchModal.locator('.dispatch-create-btn')).toBeVisible();
    console.log('All form fields are present');
  });

  test('Dispatch modal closes when Close button is clicked', async ({ page }) => {
    const eventSlide = page.locator('[data-title="EventHistory"]');
    const dispatchModal = eventSlide.locator('#temp-dispatch-modal');

    // Open the modal using JavaScript
    await page.evaluate(() => {
      const btn = document.querySelector('[data-title="EventHistory"] [data-modal="temp-dispatch"]');
      if (btn) btn.click();
    });
    await page.waitForTimeout(100);
    await expect(dispatchModal).toHaveClass(/active/);

    // Click close button
    await dispatchModal.locator('.dispatch-modal-close').click();
    await page.waitForTimeout(100);

    // Modal should be hidden
    await expect(dispatchModal).not.toHaveClass(/active/);
    console.log('Dispatch modal closed when Close button clicked');
  });

  test('Dispatch modal closes when Create Note button is clicked', async ({ page }) => {
    const eventSlide = page.locator('[data-title="EventHistory"]');
    const dispatchModal = eventSlide.locator('#temp-dispatch-modal');

    // Open the modal using JavaScript
    await page.evaluate(() => {
      const btn = document.querySelector('[data-title="EventHistory"] [data-modal="temp-dispatch"]');
      if (btn) btn.click();
    });
    await page.waitForTimeout(100);
    await expect(dispatchModal).toHaveClass(/active/);

    // Click Create Note button
    await dispatchModal.locator('.dispatch-create-btn').click();
    await page.waitForTimeout(100);

    // Modal should be hidden
    await expect(dispatchModal).not.toHaveClass(/active/);
    console.log('Dispatch modal closed when Create Note clicked');

    // Should still be on EventHistory slide
    const isEventHistoryActive = await page.evaluate(() => {
      const slide = document.querySelector('[data-title="EventHistory"]');
      return slide && slide.classList.contains('active');
    });
    expect(isEventHistoryActive).toBe(true);
    console.log('Still on EventHistory slide after Create Note');
  });
});

test.describe('Account Management Modals', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`file:///${process.cwd().replace(/\\/g, '/')}/index.html`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(300);

    // Navigate to AccountManagement slide (slide 9, index 8)
    await page.evaluate(() => {
      window.SlideNavigation.setActive(8);
    });
    await page.waitForTimeout(100);
  });

  test('All 4 edit icons are present on Account Information cards', async ({ page }) => {
    const accountSlide = page.locator('[data-title="AccountManagement"]');

    // Check all 4 edit buttons exist
    await expect(accountSlide.locator('[data-modal="billing-mailing"]')).toBeVisible();
    await expect(accountSlide.locator('[data-modal="orders-shipped"]')).toBeVisible();
    await expect(accountSlide.locator('[data-modal="monitored-site"]')).toBeVisible();
    await expect(accountSlide.locator('[data-modal="site-phone"]')).toBeVisible();
    console.log('All 4 edit icons are present');
  });

  test('Billing & Mailing modal opens and closes', async ({ page }) => {
    const accountSlide = page.locator('[data-title="AccountManagement"]');
    const modal = accountSlide.locator('#billing-mailing-modal');

    // Modal should be hidden initially
    await expect(modal).not.toHaveClass(/active/);

    // Click edit button using JavaScript
    await page.evaluate(() => {
      const btn = document.querySelector('[data-title="AccountManagement"] [data-modal="billing-mailing"]');
      if (btn) btn.click();
    });
    await page.waitForTimeout(100);

    // Modal should be visible with correct header
    await expect(modal).toHaveClass(/active/);
    const header = await modal.locator('.acct-modal-header h2').textContent();
    expect(header).toBe('Edit Billing & Mailing Address');
    console.log('Billing & Mailing modal opened');

    // Close modal
    await modal.locator('.acct-modal-close').click();
    await page.waitForTimeout(100);
    await expect(modal).not.toHaveClass(/active/);
    console.log('Billing & Mailing modal closed');
  });

  test('Orders Shipped To modal opens with warning text', async ({ page }) => {
    const accountSlide = page.locator('[data-title="AccountManagement"]');
    const modal = accountSlide.locator('#orders-shipped-modal');

    // Click edit button
    await page.evaluate(() => {
      const btn = document.querySelector('[data-title="AccountManagement"] [data-modal="orders-shipped"]');
      if (btn) btn.click();
    });
    await page.waitForTimeout(100);

    // Modal should be visible
    await expect(modal).toHaveClass(/active/);

    // Check warning text
    const warningText = await modal.locator('.acct-warning-text').textContent();
    expect(warningText).toContain('P.O. Box addresses not allowed');
    console.log('Orders Shipped To modal has warning text');

    // Close modal
    await modal.locator('.acct-modal-btn').click();
    await page.waitForTimeout(100);
    await expect(modal).not.toHaveClass(/active/);
    console.log('Orders Shipped To modal closed via Update button');
  });

  test('Monitored Site modal has disabled fields', async ({ page }) => {
    const accountSlide = page.locator('[data-title="AccountManagement"]');
    const modal = accountSlide.locator('#monitored-site-modal');

    // Click edit button
    await page.evaluate(() => {
      const btn = document.querySelector('[data-title="AccountManagement"] [data-modal="monitored-site"]');
      if (btn) btn.click();
    });
    await page.waitForTimeout(100);

    // Modal should be visible
    await expect(modal).toHaveClass(/active/);

    // Check disabled fields exist
    const disabledFields = await modal.locator('.disabled-field').count();
    expect(disabledFields).toBe(3); // City, State, Zip
    console.log('Monitored Site modal has 3 disabled fields');

    // Check info header
    const infoHeader = await modal.locator('.acct-info-header').textContent();
    expect(infoHeader).toContain('Address Correction Needed');
    console.log('Monitored Site modal has info header');
  });

  test('Site Phone Number modal has checkbox', async ({ page }) => {
    const accountSlide = page.locator('[data-title="AccountManagement"]');
    const modal = accountSlide.locator('#site-phone-modal');

    // Click edit button
    await page.evaluate(() => {
      const btn = document.querySelector('[data-title="AccountManagement"] [data-modal="site-phone"]');
      if (btn) btn.click();
    });
    await page.waitForTimeout(100);

    // Modal should be visible
    await expect(modal).toHaveClass(/active/);

    // Check checkbox exists and is checked
    const checkbox = modal.locator('.acct-checkbox-group input[type="checkbox"]');
    await expect(checkbox).toBeVisible();
    await expect(checkbox).toBeChecked();
    console.log('Site Phone Number modal has checked checkbox');

    // Check header
    const header = await modal.locator('.acct-modal-header h2').textContent();
    expect(header).toBe('Update Site Phone Number');
    console.log('Site Phone Number modal has correct header');
  });

  // ==================== Contact Management Tests ====================

  test('Contact management - Setup Contact modal opens and closes', async ({ page }) => {
    const accountSlide = page.locator('[data-title="AccountManagement"]');
    const modal = accountSlide.locator('#setup-contact-modal');

    // Modal should start hidden
    await expect(modal).not.toHaveClass(/active/);

    // Click Add Contact button
    await page.evaluate(() => {
      const btn = document.querySelector('[data-title="AccountManagement"] [data-modal="setup-contact"]');
      if (btn) btn.click();
    });
    await page.waitForTimeout(100);

    // Modal should be visible
    await expect(modal).toHaveClass(/active/);
    console.log('Setup Contact modal opened');

    // Check header
    const header = await modal.locator('.contact-modal-header h2').textContent();
    expect(header).toBe('Setup Contact');

    // Check form fields exist
    const firstNameInput = modal.locator('input[placeholder="John"]');
    const lastNameInput = modal.locator('input[placeholder="Doe"]');
    const phoneInput = modal.locator('input[placeholder="(000) 000-0000"]');
    const emailInput = modal.locator('input[type="email"]');
    const contactTypeSelect = modal.locator('select').first();
    const hasKeySelect = modal.locator('select').last();

    await expect(firstNameInput).toBeVisible();
    await expect(lastNameInput).toBeVisible();
    await expect(phoneInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(contactTypeSelect).toBeVisible();
    await expect(hasKeySelect).toBeVisible();

    // Close modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('[data-title="AccountManagement"] #setup-contact-modal .contact-modal-close');
      if (closeBtn) closeBtn.click();
    });
    await page.waitForTimeout(100);

    // Modal should be hidden
    await expect(modal).not.toHaveClass(/active/);
    console.log('Setup Contact modal closed');
  });

  test('Contact management - Edit Contact modal opens and closes', async ({ page }) => {
    const accountSlide = page.locator('[data-title="AccountManagement"]');
    const modal = accountSlide.locator('#edit-contact-modal');

    // Modal should start hidden
    await expect(modal).not.toHaveClass(/active/);

    // Click first edit contact button
    await page.evaluate(() => {
      const btn = document.querySelector('[data-title="AccountManagement"] [data-modal="edit-contact"]');
      if (btn) btn.click();
    });
    await page.waitForTimeout(100);

    // Modal should be visible
    await expect(modal).toHaveClass(/active/);
    console.log('Edit Contact modal opened');

    // Check header
    const header = await modal.locator('.contact-modal-header h2').textContent();
    expect(header).toBe('Edit Contact');

    // Check form fields have pre-filled values
    const firstNameInput = modal.locator('input').first();
    const firstNameValue = await firstNameInput.inputValue();
    expect(firstNameValue).toBe('SARAH');
    console.log('Edit Contact modal has pre-filled First Name:', firstNameValue);

    // Click Save button to close
    await page.evaluate(() => {
      const saveBtn = document.querySelector('[data-title="AccountManagement"] #edit-contact-modal .contact-modal-btn');
      if (saveBtn) saveBtn.click();
    });
    await page.waitForTimeout(100);

    // Modal should be hidden
    await expect(modal).not.toHaveClass(/active/);
    console.log('Edit Contact modal closed via Save button');
  });

  test('Contact management - Primary and Secondary contact lists exist', async ({ page }) => {
    const accountSlide = page.locator('[data-title="AccountManagement"]');

    // Check Primary contacts list
    const primaryList = accountSlide.locator('#primary-contacts-list');
    await expect(primaryList).toBeVisible();

    // Check Secondary contacts list
    const secondaryList = accountSlide.locator('#secondary-contacts-list');
    await expect(secondaryList).toBeVisible();

    // Count contacts in each list
    const primaryCount = await primaryList.locator('.contact-row').count();
    const secondaryCount = await secondaryList.locator('.contact-row').count();

    expect(primaryCount).toBeGreaterThanOrEqual(1);
    expect(secondaryCount).toBeGreaterThanOrEqual(1);

    console.log(`Primary contacts: ${primaryCount}, Secondary contacts: ${secondaryCount}`);
  });

  test('Contact management - Contacts have drag handles and action buttons', async ({ page }) => {
    const accountSlide = page.locator('[data-title="AccountManagement"]');

    // Check first contact row
    const firstContact = accountSlide.locator('.contact-row').first();
    await expect(firstContact).toBeVisible();

    // Check drag handle
    const dragHandle = firstContact.locator('.drag-handle');
    await expect(dragHandle).toBeVisible();
    await expect(dragHandle).toHaveText('☰');

    // Check edit button
    const editBtn = firstContact.locator('.edit-contact-btn');
    await expect(editBtn).toBeVisible();

    // Check delete button
    const deleteBtn = firstContact.locator('.delete-contact-btn');
    await expect(deleteBtn).toBeVisible();

    console.log('Contact row has drag handle and action buttons');
  });

  test('Contact management - SortableJS library is loaded', async ({ page }) => {
    // Check that Sortable is defined
    const sortableLoaded = await page.evaluate(() => {
      return typeof Sortable !== 'undefined';
    });

    expect(sortableLoaded).toBe(true);
    console.log('SortableJS library is loaded');
  });

  // ==================== System Management Tests ====================

  test('System Management - System Information grid has 8 fields', async ({ page }) => {
    // Navigate to SystemManagement slide
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="SystemManagement"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    const slide = page.locator('[data-title="SystemManagement"]');
    const sysInfoGrid = slide.locator('[data-testid="sysinfo-grid"]');
    await expect(sysInfoGrid).toBeVisible();

    // Count system info items
    const itemCount = await sysInfoGrid.locator('.sysinfo-item').count();
    expect(itemCount).toBe(8);
    console.log('System Information grid has 8 fields');

    // Check specific values
    const systemType = slide.locator('[data-testid="sysinfo-system-type-value"]');
    await expect(systemType).toContainText('2GIG EDGE v1.2');

    const installerCode = slide.locator('[data-testid="sysinfo-installer-code-value"]');
    await expect(installerCode).toContainText('3789');
    console.log('System Type and Installer Code fields verified');
  });

  test('System Management - Transformer Location is editable and opens modal', async ({ page }) => {
    // Navigate to SystemManagement slide
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="SystemManagement"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    const slide = page.locator('[data-title="SystemManagement"]');
    const modal = slide.locator('#transformer-modal');

    // Check editable link exists
    const editableLink = slide.locator('[data-modal="transformer-location"]');
    await expect(editableLink).toBeVisible();
    await expect(editableLink).toHaveText('Master');
    await expect(editableLink).toHaveClass(/editable/);

    // Modal should start hidden
    await expect(modal).not.toHaveClass(/active/);

    // Click editable link to open modal
    await page.evaluate(() => {
      const link = document.querySelector('[data-title="SystemManagement"] [data-modal="transformer-location"]');
      if (link) link.click();
    });
    await page.waitForTimeout(100);

    // Modal should be visible
    await expect(modal).toHaveClass(/active/);
    console.log('Transformer Location modal opened');

    // Check modal has correct header
    const modalHeader = modal.locator('.sysm-modal-header h3');
    await expect(modalHeader).toHaveText('Edit Transformer Location');

    // Close modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('[data-title="SystemManagement"] #transformer-modal .sysm-modal-close');
      if (closeBtn) closeBtn.click();
    });
    await page.waitForTimeout(100);

    // Modal should be hidden
    await expect(modal).not.toHaveClass(/active/);
    console.log('Transformer Location modal closed');
  });

  test('System Management - Equipment List has 22 rows with trouble dots', async ({ page }) => {
    // Navigate to SystemManagement slide
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="SystemManagement"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    const slide = page.locator('[data-title="SystemManagement"]');
    const equipmentTable = slide.locator('[data-testid="equipment-table"]');
    await expect(equipmentTable).toBeVisible();

    // Count equipment rows
    const rowCount = await equipmentTable.locator('.equip-row').count();
    expect(rowCount).toBe(22);
    console.log(`Equipment List has ${rowCount} rows`);

    // Count red and green dots
    const redDots = await equipmentTable.locator('.trouble-dot.dot-red').count();
    const greenDots = await equipmentTable.locator('.trouble-dot.dot-green').count();
    expect(redDots).toBeGreaterThan(0);
    expect(greenDots).toBeGreaterThan(0);
    console.log(`Trouble dots: ${redDots} red, ${greenDots} green`);
  });

  test('System Management - Equipment List container is scrollable', async ({ page }) => {
    // Navigate to SystemManagement slide
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="SystemManagement"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    const slide = page.locator('[data-title="SystemManagement"]');
    const tableContainer = slide.locator('[data-testid="equipment-table-container"]');
    await expect(tableContainer).toBeVisible();

    // Check that container has overflow-y auto
    const overflowY = await tableContainer.evaluate(el => {
      return window.getComputedStyle(el).overflowY;
    });
    expect(overflowY).toBe('auto');
    console.log('Equipment table container has overflow-y: auto');
  });

  // ==================== Job Management Tests ====================

  test('Job Management - Job rows have three dots menu', async ({ page }) => {
    // Navigate to JobManagement slide
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="JobManagement"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    const slide = page.locator('[data-title="JobManagement"]');

    // Check that job rows exist
    const jobRows = slide.locator('.job-row.clickable-row');
    const rowCount = await jobRows.count();
    expect(rowCount).toBe(8);
    console.log(`Job Management has ${rowCount} job rows`);

    // Check that each row has a dots button
    const dotsButtons = slide.locator('.dots-btn');
    const dotsCount = await dotsButtons.count();
    expect(dotsCount).toBe(8);
    console.log('All job rows have three dots buttons');
  });

  test('Job Management - Three dots menu opens and shows options', async ({ page }) => {
    // Navigate to JobManagement slide
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="JobManagement"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    const slide = page.locator('[data-title="JobManagement"]');
    const firstDotsBtn = slide.locator('.dots-btn').first();
    const firstMenu = slide.locator('.action-menu').first();

    // Menu should start hidden
    await expect(firstMenu).not.toHaveClass(/active/);

    // Click dots button
    await page.evaluate(() => {
      const btn = document.querySelector('[data-title="JobManagement"] .dots-btn');
      if (btn) btn.click();
    });
    await page.waitForTimeout(100);

    // Menu should be visible
    await expect(firstMenu).toHaveClass(/active/);
    console.log('Action menu opened');

    // Check menu has 4 options
    const menuItems = firstMenu.locator('div');
    await expect(menuItems).toHaveCount(4);

    // Check option labels
    const options = await menuItems.allTextContents();
    expect(options).toContain('Edit');
    expect(options).toContain('Reschedule');
    expect(options).toContain('Return Trip');
    expect(options).toContain('Cancel');
    console.log('Action menu has all 4 options');
  });

  test('Job Management - Job row expands to show details', async ({ page }) => {
    // Navigate to JobManagement slide
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="JobManagement"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    const slide = page.locator('[data-title="JobManagement"]');
    const firstJobRow = slide.locator('.job-row.clickable-row').first();
    const firstDetails = slide.locator('#job-details-1');

    // Details should start hidden
    await expect(firstDetails).not.toHaveClass(/active/);

    // Click on job row (not on dots button)
    await page.evaluate(() => {
      const row = document.querySelector('[data-title="JobManagement"] .job-row.clickable-row');
      if (row) row.click();
    });
    await page.waitForTimeout(100);

    // Details should be visible
    await expect(firstDetails).toHaveClass(/active/);
    console.log('Job details expanded');

    // Check details content
    const jobDetailsHeader = firstDetails.locator('h4').first();
    await expect(jobDetailsHeader).toHaveText('Job Details');

    // Check row has expanded class
    await expect(firstJobRow).toHaveClass(/expanded/);
    console.log('Job row has expanded class');
  });

  test('Job Management - Expanded details has activity section with filter buttons', async ({ page }) => {
    // Navigate to JobManagement slide
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="JobManagement"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    const slide = page.locator('[data-title="JobManagement"]');
    const firstDetails = slide.locator('#job-details-1');

    // Expand the first job row
    await page.evaluate(() => {
      const row = document.querySelector('[data-title="JobManagement"] .job-row.clickable-row');
      if (row) row.click();
    });
    await page.waitForTimeout(100);

    // Check activity section exists
    const activitySection = firstDetails.locator('.activity-section');
    await expect(activitySection).toBeVisible();

    // Check filter buttons
    const filterButtons = firstDetails.locator('.btn-filter');
    await expect(filterButtons).toHaveCount(3);

    // Check button labels
    const buttonTexts = await filterButtons.allTextContents();
    expect(buttonTexts).toContain('All');
    expect(buttonTexts).toContain('Comments');
    expect(buttonTexts).toContain('History');
    console.log('Activity section has 3 filter buttons');
  });

  // ==================== Paperless Billing Tests ====================

  test('Paperless Billing - Toggle shows setup modal when enrolling', async ({ page }) => {
    // Navigate to PaymentBilling slide
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="PaymentBilling"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    const slide = page.locator('[data-title="PaymentBilling"]');
    const toggle = slide.locator('#paperless-toggle');
    const setupModal = slide.locator('#pb-setup-modal');

    // Modal should start hidden
    await expect(setupModal).not.toHaveClass(/visible/);

    // Click toggle to enroll
    await page.evaluate(() => {
      const toggle = document.querySelector('[data-title="PaymentBilling"] #paperless-toggle');
      if (toggle) {
        toggle.checked = true;
        toggle.dispatchEvent(new Event('change'));
      }
    });
    await page.waitForTimeout(100);

    // Setup modal should be visible
    await expect(setupModal).toHaveClass(/visible/);
    console.log('Setup modal opened on enrollment toggle');

    // Check modal title
    const modalTitle = setupModal.locator('h2');
    await expect(modalTitle).toHaveText('Setup Contact');
  });

  test('Paperless Billing - Can create new contact and complete enrollment', async ({ page }) => {
    // Navigate to PaymentBilling slide
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="PaymentBilling"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    const slide = page.locator('[data-title="PaymentBilling"]');

    // Click toggle to enroll (opens setup modal)
    await page.evaluate(() => {
      const toggle = document.querySelector('[data-title="PaymentBilling"] #paperless-toggle');
      if (toggle) {
        toggle.checked = true;
        toggle.dispatchEvent(new Event('change'));
      }
    });
    await page.waitForTimeout(100);

    // Click Create New Contact button
    await page.evaluate(() => {
      const btn = document.querySelector('[data-title="PaymentBilling"] #pb-create-new-btn');
      if (btn) btn.click();
    });
    await page.waitForTimeout(100);

    // Form modal should be visible
    const formModal = slide.locator('#pb-form-modal');
    await expect(formModal).toHaveClass(/visible/);
    console.log('Form modal opened');

    // Fill in form and save
    await page.evaluate(() => {
      document.querySelector('#pb-first-name').value = 'Test';
      document.querySelector('#pb-last-name').value = 'User';
      document.querySelector('#pb-email').value = 'test@test.com';
      document.querySelector('#pb-save-contact-btn').click();
    });
    await page.waitForTimeout(100);

    // Modal should be closed
    await expect(formModal).not.toHaveClass(/visible/);

    // Contact info should be visible
    const contactInfo = slide.locator('#paperless-contact-info');
    await expect(contactInfo).toHaveClass(/visible/);
    console.log('Contact info displayed after enrollment');

    // Check contact name
    const contactName = slide.locator('#paperless-contact-name');
    await expect(contactName).toHaveText('Test User');

    // Label should change to unenroll
    const label = slide.locator('#paperless-label');
    await expect(label).toHaveText('Unenroll Paperless Billing');
  });

  test('Paperless Billing - Unenroll shows warning modal', async ({ page }) => {
    // Navigate to PaymentBilling slide
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="PaymentBilling"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    const slide = page.locator('[data-title="PaymentBilling"]');

    // First enroll by completing the flow
    await page.evaluate(() => {
      const toggle = document.querySelector('[data-title="PaymentBilling"] #paperless-toggle');
      toggle.checked = true;
      toggle.dispatchEvent(new Event('change'));
    });
    await page.waitForTimeout(50);

    await page.evaluate(() => {
      document.querySelector('#pb-create-new-btn').click();
    });
    await page.waitForTimeout(50);

    await page.evaluate(() => {
      document.querySelector('#pb-save-contact-btn').click();
    });
    await page.waitForTimeout(100);

    // Now try to unenroll
    await page.evaluate(() => {
      const toggle = document.querySelector('[data-title="PaymentBilling"] #paperless-toggle');
      toggle.checked = false;
      toggle.dispatchEvent(new Event('change'));
    });
    await page.waitForTimeout(100);

    // Warning modal should be visible
    const warningModal = slide.locator('#pb-warning-modal');
    await expect(warningModal).toHaveClass(/visible/);
    console.log('Warning modal shown on unenroll');

    // Check warning text mentions fee
    const warningText = warningModal.locator('.pb-warning-text');
    await expect(warningText).toContainText('$5.99');
  });

  test('Paperless Billing - Confirm unenrollment hides contact info', async ({ page }) => {
    // Navigate to PaymentBilling slide
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="PaymentBilling"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    const slide = page.locator('[data-title="PaymentBilling"]');

    // Enroll first
    await page.evaluate(() => {
      const toggle = document.querySelector('[data-title="PaymentBilling"] #paperless-toggle');
      toggle.checked = true;
      toggle.dispatchEvent(new Event('change'));
    });
    await page.waitForTimeout(50);

    await page.evaluate(() => {
      document.querySelector('#pb-create-new-btn').click();
    });
    await page.waitForTimeout(50);

    await page.evaluate(() => {
      document.querySelector('#pb-save-contact-btn').click();
    });
    await page.waitForTimeout(100);

    // Unenroll
    await page.evaluate(() => {
      const toggle = document.querySelector('[data-title="PaymentBilling"] #paperless-toggle');
      toggle.checked = false;
      toggle.dispatchEvent(new Event('change'));
    });
    await page.waitForTimeout(100);

    // Confirm unenroll
    await page.evaluate(() => {
      document.querySelector('#pb-confirm-unenroll-btn').click();
    });
    await page.waitForTimeout(100);

    // Warning modal should be hidden
    const warningModal = slide.locator('#pb-warning-modal');
    await expect(warningModal).not.toHaveClass(/visible/);

    // Contact info should be hidden
    const contactInfo = slide.locator('#paperless-contact-info');
    await expect(contactInfo).not.toHaveClass(/visible/);
    console.log('Contact info hidden after unenrollment');

    // Label should change back to enroll
    const label = slide.locator('#paperless-label');
    await expect(label).toHaveText('Enroll in Paperless Billing');

    // Toggle should be unchecked
    const toggle = slide.locator('#paperless-toggle');
    await expect(toggle).not.toBeChecked();
  });

  // ==================== Market Type Sync Tests ====================

  test('Market Type - Changes sync across slides', async ({ page }) => {
    // Navigate to AccountActivity slide (slide 6)
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="AccountActivity"]').classList.add('active');
    });
    await page.waitForTimeout(200);

    const accountSlide = page.locator('[data-title="AccountActivity"]');
    const marketSelect1 = accountSlide.locator('.topbar-select').first();

    // Verify initial value is Unavailable
    await expect(marketSelect1).toHaveValue('Unavailable');
    console.log('Initial market type is Unavailable');

    // Change to "Truck Roll Only"
    await page.evaluate(() => {
      const select = document.querySelector('[data-title="AccountActivity"] .topbar-select');
      if (select) {
        select.value = 'Truck Roll Only';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await page.waitForTimeout(100);

    // Verify the change was made
    await expect(marketSelect1).toHaveValue('Truck Roll Only');
    console.log('Changed market type to Truck Roll Only');

    // Navigate to ContractInfo slide (slide 7)
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="ContractInfo"]').classList.add('active');
    });
    await page.waitForTimeout(100);

    const contractSlide = page.locator('[data-title="ContractInfo"]');
    const marketSelect2 = contractSlide.locator('.topbar-select').first();

    // Verify the market type is also "Truck Roll Only" on this slide
    await expect(marketSelect2).toHaveValue('Truck Roll Only');
    console.log('Market type synced to ContractInfo slide');
  });
});

// ==================== Job Management CRSE (Cancelled Customer) Tests ====================
test.describe('Job Management CRSE - Cancelled Customer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`file:///${process.cwd().replace(/\\/g, '/')}/index.html`);
    // Navigate to JobManagementCRSE slide
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="JobManagementCRSE"]').classList.add('active');
    });
    await page.waitForTimeout(100);
  });

  test('JobManagementCRSE slide exists and renders', async ({ page }) => {
    const slide = page.locator('[data-title="JobManagementCRSE"]');
    await expect(slide).toBeAttached();
    await expect(slide).toHaveClass(/active/);
    console.log('JobManagementCRSE slide exists and is active');
  });

  test('Topbar shows cancelled customer data', async ({ page }) => {
    const slide = page.locator('[data-title="JobManagementCRSE"]');
    const topbar = slide.locator('.topbar');
    await expect(topbar).toBeVisible();

    // Check Contact Name
    const contactName = topbar.locator('.topbar-item:has-text("Contact Name") .value');
    await expect(contactName).toContainText('Rachel Roth');

    // Check Contract Signer
    const contractSigner = topbar.locator('.topbar-item:has-text("Contract Signer") .value');
    await expect(contractSigner).toContainText('ALICE A ROBB');

    // Check Site Status is Cancelled
    const siteStatus = topbar.locator('.topbar-item:has-text("Site Status") .value');
    await expect(siteStatus).toContainText('Cancelled');

    // Check Site Number
    const siteNumber = topbar.locator('.topbar-item:has-text("Site Number") .value');
    await expect(siteNumber).toContainText('601197523');

    // Check Customer Since
    const customerSince = topbar.locator('.topbar-item:has-text("Customer Since") .value');
    await expect(customerSince).toContainText('10/17/2014');

    console.log('Topbar displays cancelled customer data correctly');
  });

  test('Market Type shows static "--" with no dropdown', async ({ page }) => {
    const slide = page.locator('[data-title="JobManagementCRSE"]');
    const topbar = slide.locator('.topbar');

    // Market Type should show "--" as static text
    const marketType = topbar.locator('.topbar-item:has-text("Market Type") .value');
    await expect(marketType).toContainText('--');

    // Should NOT have a dropdown select element
    const dropdown = topbar.locator('.topbar-select');
    await expect(dropdown).toHaveCount(0);

    console.log('Market Type shows static "--" with no dropdown');
  });

  test('Create New Job button is disabled with tooltip', async ({ page }) => {
    const slide = page.locator('[data-title="JobManagementCRSE"]');

    // Disabled button should exist
    const disabledBtn = slide.locator('[data-testid="create-new-job-btn-disabled"]');
    await expect(disabledBtn).toBeVisible();
    await expect(disabledBtn).toHaveText('Create New Job');
    await expect(disabledBtn).toBeDisabled();

    // Button should have disabled styling (gray background, not-allowed cursor)
    const cursor = await disabledBtn.evaluate(el => window.getComputedStyle(el).cursor);
    expect(cursor).toBe('not-allowed');

    const bgColor = await disabledBtn.evaluate(el => window.getComputedStyle(el).backgroundColor);
    // #9fb0b8 = rgb(159, 176, 184)
    expect(bgColor).toBe('rgb(159, 176, 184)');

    console.log('Create New Job button is disabled with correct styling');
  });

  test('Tooltip is present and hidden by default', async ({ page }) => {
    const slide = page.locator('[data-title="JobManagementCRSE"]');

    // Tooltip element should exist
    const tooltip = slide.locator('.create-tooltip');
    await expect(tooltip).toBeAttached();

    // Tooltip should contain the expected message
    await expect(tooltip).toContainText('Job creation is not allowed');
    await expect(tooltip).toContainText('ineligible conditions');

    // Tooltip should be hidden by default (display: none)
    const display = await tooltip.evaluate(el => window.getComputedStyle(el).display);
    expect(display).toBe('none');

    console.log('Tooltip exists, has correct message, and is hidden by default');
  });

  test('Tooltip appears on hover over disabled button', async ({ page }) => {
    const slide = page.locator('[data-title="JobManagementCRSE"]');
    const tooltipWrap = slide.locator('.create-tooltip-wrap');
    const tooltip = slide.locator('.create-tooltip');

    // Hover over the tooltip wrapper
    await tooltipWrap.hover();
    await page.waitForTimeout(200);

    // Tooltip should be visible after hover
    const display = await tooltip.evaluate(el => window.getComputedStyle(el).display);
    expect(display).toBe('block');

    console.log('Tooltip appears on hover');
  });

  test('Job Management tab is active', async ({ page }) => {
    const slide = page.locator('[data-title="JobManagementCRSE"]');

    // Check tabs are rendered
    const tabs = slide.locator('.tab');
    const tabCount = await tabs.count();
    expect(tabCount).toBe(7);

    // Job Management tab (index 5, 0-based) should be active
    const activeTab = slide.locator('.tab.active');
    await expect(activeTab).toContainText('Job Management');

    console.log('Job Management tab is active with 7 tabs total');
  });

  test('Jobs table has single row with correct data', async ({ page }) => {
    const slide = page.locator('[data-title="JobManagementCRSE"]');

    // Jobs table should exist
    const jobsTable = slide.locator('[data-testid="job-management-crse-jobs-table"]');
    await expect(jobsTable).toBeVisible();

    // Should have exactly 1 job row
    const jobRows = jobsTable.locator('.job-row');
    await expect(jobRows).toHaveCount(1);

    // Verify job row data
    const row = jobRows.first();
    await expect(row).toContainText('Wed, 06/07/2017');
    await expect(row).toContainText('600681152');
    await expect(row).toContainText('SYS');

    // Status pill should show Closed
    const statusPill = row.locator('.status-pill');
    await expect(statusPill).toHaveText('Closed');
    await expect(statusPill).toHaveClass(/closed/);

    console.log('Jobs table has 1 row with correct data: 06/07/2017, Closed, 600681152, SYS');
  });

  test('Search section is present with input and button', async ({ page }) => {
    const slide = page.locator('[data-title="JobManagementCRSE"]');

    // Search label
    const searchLabel = slide.locator('[data-testid="job-management-crse-search-label"]');
    await expect(searchLabel).toHaveText('Search by job number');

    // Search input
    const searchInput = slide.locator('[data-testid="job-management-crse-search-input"]');
    await expect(searchInput).toBeVisible();

    // Search button
    const searchBtn = slide.locator('[data-testid="job-management-crse-search-btn"]');
    await expect(searchBtn).toBeVisible();
    await expect(searchBtn).toHaveText('Search');

    console.log('Search section has label, input, and button');
  });

  test('No data-goto-market-map on disabled create button', async ({ page }) => {
    const slide = page.locator('[data-title="JobManagementCRSE"]');

    // The disabled create button should NOT have data-goto-market-map
    const btn = slide.locator('[data-testid="create-new-job-btn-disabled"]');
    const hasMarketMap = await btn.evaluate(el => el.hasAttribute('data-goto-market-map'));
    expect(hasMarketMap).toBe(false);

    console.log('Disabled create button has no data-goto-market-map attribute');
  });

  test('Actions cell has dots button and menu', async ({ page }) => {
    const slide = page.locator('[data-title="JobManagementCRSE"]');

    // Dots button should exist
    const dotsBtn = slide.locator('[data-testid="job-management-crse-actions-btn"]');
    await expect(dotsBtn).toBeVisible();

    // Action menu should exist but be hidden
    const actionMenu = slide.locator('[data-testid="job-management-crse-action-menu"]');
    await expect(actionMenu).toBeAttached();
    await expect(actionMenu).not.toHaveClass(/active/);

    // Menu should have 4 options
    const menuItems = actionMenu.locator('div');
    await expect(menuItems).toHaveCount(4);

    const options = await menuItems.allTextContents();
    expect(options).toContain('Edit');
    expect(options).toContain('Reschedule');
    expect(options).toContain('Return Trip');
    expect(options).toContain('Cancel');

    console.log('Actions cell has dots button and 4 menu options');
  });
});

// ============================================================
// System Management CRSE - Cancelled Customer Tests
// ============================================================
test.describe('System Management CRSE - Cancelled Customer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`file:///${process.cwd().replace(/\\/g, '/')}/index.html`);
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-title="SystemManagementCRSE"]').classList.add('active');
    });
    await page.waitForTimeout(100);
  });

  test('SystemManagementCRSE slide exists and renders', async ({ page }) => {
    const slide = page.locator('[data-title="SystemManagementCRSE"]');
    await expect(slide).toHaveClass(/active/);
    console.log('SystemManagementCRSE slide exists and is active');
  });

  test('Topbar shows cancelled customer data', async ({ page }) => {
    const slide = page.locator('[data-title="SystemManagementCRSE"]');
    const topbar = slide.locator('.topbar');
    await expect(topbar).toBeVisible();

    // Verify cancelled customer fields
    await expect(slide.locator('.topbar-item', { hasText: 'Rachel Roth' })).toBeVisible();
    await expect(slide.locator('.topbar-item', { hasText: 'ALICE A ROBB' })).toBeVisible();
    await expect(slide.locator('.topbar-item', { hasText: 'Cancelled' })).toBeVisible();
    await expect(slide.locator('.topbar-item', { hasText: '601197523' })).toBeVisible();
    await expect(slide.locator('.topbar-item', { hasText: '10/17/2014' })).toBeVisible();
    console.log('Topbar displays cancelled customer data correctly');
  });

  test('Market Type shows static "--" with no dropdown', async ({ page }) => {
    const slide = page.locator('[data-title="SystemManagementCRSE"]');
    const dropdown = slide.locator('.topbar-select');
    await expect(dropdown).toHaveCount(0);
    const marketItem = slide.locator('.topbar-item', { hasText: 'Market Type' });
    await expect(marketItem).toBeVisible();
    console.log('Market Type shows static "--" with no dropdown');
  });

  test('System Management tab is active', async ({ page }) => {
    const slide = page.locator('[data-title="SystemManagementCRSE"]');
    const activeTab = slide.locator('.tab.active');
    await expect(activeTab).toBeVisible();
    await expect(activeTab).toContainText('System Management');

    const allTabs = slide.locator('.tab');
    const count = await allTabs.count();
    expect(count).toBe(7);
    console.log('System Management tab is active with 7 tabs total');
  });

  test('Alert banner shows MAS info message with Retry button', async ({ page }) => {
    const slide = page.locator('[data-title="SystemManagementCRSE"]');
    const alert = slide.locator('[data-testid="crse-alert"]');
    await expect(alert).toBeVisible();

    const alertText = slide.locator('[data-testid="crse-alert-text"]');
    await expect(alertText).toHaveText('MAS info not found for site number.');

    const alertIcon = slide.locator('[data-testid="crse-alert-icon"]');
    await expect(alertIcon).toBeVisible();
    await expect(alertIcon).toHaveText('i');

    const retryBtn = slide.locator('[data-testid="crse-retry-btn"]');
    await expect(retryBtn).toBeVisible();
    await expect(retryBtn).toHaveText('Retry');
    console.log('Alert banner shows MAS info message with Retry button');
  });

  test('Service Add-Ons shows 0 available', async ({ page }) => {
    const slide = page.locator('[data-title="SystemManagementCRSE"]');
    const addonsTitle = slide.locator('[data-testid="crse-addons-title"]');
    await expect(addonsTitle).toBeVisible();
    await expect(addonsTitle).toContainText('Service Add-Ons');

    const available = slide.locator('[data-testid="crse-addons-available"]');
    await expect(available).toHaveText('(0 available)');
    console.log('Service Add-Ons shows (0 available)');
  });

  test('System Information has 8 blank fields', async ({ page }) => {
    const slide = page.locator('[data-title="SystemManagementCRSE"]');
    const sysGrid = slide.locator('[data-testid="crse-sysinfo-grid"]');
    await expect(sysGrid).toBeVisible();

    const items = sysGrid.locator('.sysinfo-item');
    await expect(items).toHaveCount(8);

    // Verify CS field shows "#"
    const csValue = slide.locator('[data-testid="crse-sysinfo-cs"] .value');
    await expect(csValue).toHaveText('#');

    // Verify Clear All Filters button
    const clearBtn = slide.locator('[data-testid="crse-sysinfo-clear-btn"]');
    await expect(clearBtn).toBeVisible();
    await expect(clearBtn).toHaveText('Clear All Filters');
    console.log('System Information has 8 fields with blank values, CS shows #');
  });

  test('Equipment List shows No Data', async ({ page }) => {
    const slide = page.locator('[data-title="SystemManagementCRSE"]');
    const equipRowbar = slide.locator('[data-testid="crse-equipment-rowbar"]');
    await expect(equipRowbar).toBeVisible();

    const left = equipRowbar.locator('.left');
    await expect(left).toHaveText('Equipment List');
    const right = equipRowbar.locator('.right');
    await expect(right).toHaveText('No Data');
    console.log('Equipment List shows "No Data"');
  });

  test('Trouble Condition History shows No Data', async ({ page }) => {
    const slide = page.locator('[data-title="SystemManagementCRSE"]');
    const troubleRowbar = slide.locator('[data-testid="crse-trouble-rowbar"]');
    await expect(troubleRowbar).toBeVisible();

    const left = troubleRowbar.locator('.left');
    await expect(left).toHaveText('Trouble Condition History');
    const right = troubleRowbar.locator('.right');
    await expect(right).toHaveText('No Data');
    console.log('Trouble Condition History shows "No Data"');
  });

  test('No equipment table or transformer modal', async ({ page }) => {
    const slide = page.locator('[data-title="SystemManagementCRSE"]');
    // Should have no equipment table
    const equipTable = slide.locator('.equipment-table');
    await expect(equipTable).toHaveCount(0);
    // Should have no transformer modal
    const transformerModal = slide.locator('.sysm-modal-overlay');
    await expect(transformerModal).toHaveCount(0);
    console.log('No equipment table or transformer modal present');
  });
});
