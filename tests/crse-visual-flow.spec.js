const { test, expect } = require('@playwright/test');

/**
 * Visual headed test: CRSE Cancelled Customer → Job Management flow
 * Run with: npx playwright test tests/crse-visual-flow.spec.js --headed
 */

test.describe('CRSE Cancelled Customer - Job Management Visual Flow', () => {

  test('Switch to CRSE, select cancelled customer, navigate to Job Management', async ({ page }) => {
    // Slow down so the user can watch each step
    test.slow();

    await page.goto(`file:///${process.cwd().replace(/\\/g, '/')}/index.html`);
    await page.waitForTimeout(1000);

    // --- Step 1: Switch department to CRSE ---
    console.log('Step 1: Switching department to CRSE...');
    const crseBtn = page.locator('.dept-btn[data-dept="crse"]');
    await expect(crseBtn).toBeVisible();
    await crseBtn.click();
    await page.waitForTimeout(1500);

    // Verify CRSE is now active
    const canvas = page.locator('#canvas');
    await expect(canvas).toHaveAttribute('data-dept', 'crse');
    await expect(crseBtn).toHaveClass(/active/);
    console.log('  CRSE department active');

    // --- Step 2: Navigate to search results (slide 3) ---
    console.log('Step 2: Navigating to customer search results...');
    await page.evaluate(() => window.SlideNavigation.setActive(2)); // 0-indexed
    await page.waitForTimeout(1500);

    const resultsSlide = page.locator('[data-title="LoggedInResults"]');
    await expect(resultsSlide).toHaveClass(/active/);
    console.log('  Search results displayed');

    // --- Step 3: Click "Select" on the Cancelled customer ---
    console.log('Step 3: Selecting the Cancelled customer...');
    const cancelledRow = page.locator('[data-customer-type="Cancelled"]');
    await expect(cancelledRow).toBeVisible();

    const selectBtn = cancelledRow.locator('.select-btn');
    await selectBtn.click();
    await page.waitForTimeout(1500);

    // Verify customer type was set to Cancelled
    const customerType = await page.evaluate(() => window.AppConfig.customerType);
    expect(customerType).toBe('Cancelled');
    console.log('  Cancelled customer selected, customer type set');

    // --- Step 4: Click the Job Management tab (should redirect to CRSE variant) ---
    console.log('Step 4: Clicking the Job Management tab...');
    // Navigate to Account Activity first (slide 6) so we can click the tab
    await page.evaluate(() => window.SlideNavigation.setActive(5)); // 0-indexed, slide 6
    await page.waitForTimeout(1000);

    // Click the "Job Management" tab - with CRSE dept, this should redirect to slide 34
    const jobMgmtTab = page.locator('.slide.active .tab', { hasText: 'Job Management' });
    await expect(jobMgmtTab).toBeVisible();
    await jobMgmtTab.click();
    await page.waitForTimeout(1500);

    // Verify we landed on the CRSE variant (slide 34), NOT the regular one (slide 11)
    const crseSlide = page.locator('[data-title="JobManagementCRSE"]');
    await expect(crseSlide).toHaveClass(/active/);
    const regularSlide = page.locator('[data-title="JobManagement"]');
    await expect(regularSlide).not.toHaveClass(/active/);
    console.log('  Job Management CRSE slide active (redirected from tab click)');

    // --- Step 5: Validate all elements on the CRSE Job Management slide ---
    console.log('Step 5: Validating all elements...');

    // 5a. Sidebar is present
    const sidebar = crseSlide.locator('.sidebar');
    await expect(sidebar).toBeVisible();
    console.log('  Sidebar: visible');

    // 5b. Topbar with cancelled customer data
    const topbar = crseSlide.locator('.topbar');
    await expect(topbar).toBeVisible();

    // Verify topbar shows cancelled status
    const siteStatus = crseSlide.locator('.topbar-item', { hasText: 'Cancelled' });
    await expect(siteStatus).toBeVisible();
    console.log('  Topbar: visible, site status = Cancelled');

    // Verify contact name
    const contactName = crseSlide.locator('.topbar-item', { hasText: 'Rachel Roth' });
    await expect(contactName).toBeVisible();
    console.log('  Topbar: contact name = Rachel Roth');

    // Verify site number
    const siteNumber = crseSlide.locator('.topbar-item', { hasText: '601197523' });
    await expect(siteNumber).toBeVisible();
    console.log('  Topbar: site number = 601197523');

    // Verify market type is static text (not a dropdown)
    const marketTypeDropdown = crseSlide.locator('.topbar-select');
    await expect(marketTypeDropdown).toHaveCount(0);
    console.log('  Topbar: market type is static (no dropdown)');

    // 5c. Tabs - Job Management tab is active (tab index 5)
    const activeTab = crseSlide.locator('.tab.active');
    await expect(activeTab).toBeVisible();
    await expect(activeTab).toContainText('Job Management');
    console.log('  Tabs: Job Management tab is active');

    // 5d. Search section
    const searchLabel = crseSlide.locator('[data-testid="job-management-crse-search-label"]');
    await expect(searchLabel).toBeVisible();
    await expect(searchLabel).toHaveText('Search by job number');
    console.log('  Search section: visible');

    const searchInput = crseSlide.locator('[data-testid="job-management-crse-search-input"]');
    await expect(searchInput).toBeVisible();
    console.log('  Search input: visible');

    const searchBtn = crseSlide.locator('[data-testid="job-management-crse-search-btn"]');
    await expect(searchBtn).toBeVisible();
    console.log('  Search button: visible');

    // 5e. Disabled "Create New Job" button
    const createBtnDisabled = crseSlide.locator('[data-testid="create-new-job-btn-disabled"]');
    await expect(createBtnDisabled).toBeVisible();
    await expect(createBtnDisabled).toBeDisabled();
    await expect(createBtnDisabled).toHaveText('Create New Job');
    console.log('  Create New Job button: visible and DISABLED');

    // 5f. Hover over disabled button to show tooltip
    console.log('  Hovering over disabled button to show tooltip...');
    const tooltipWrap = crseSlide.locator('.create-tooltip-wrap');
    await tooltipWrap.hover();
    await page.waitForTimeout(1000);

    const tooltip = crseSlide.locator('.create-tooltip');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Job creation is not allowed');
    console.log('  Tooltip: visible on hover');
    await page.waitForTimeout(1500);

    // 5g. Jobs table header
    const jobsHeader = crseSlide.locator('[data-testid="job-management-crse-jobs-header"]');
    await expect(jobsHeader).toBeVisible();
    console.log('  Jobs table header: visible');

    // 5h. Single job row with correct data
    const jobRow = crseSlide.locator('[data-testid="job-management-crse-job-row-1"]');
    await expect(jobRow).toBeVisible();

    // Verify job details
    await expect(jobRow).toContainText('Wed, 06/07/2017');
    await expect(jobRow).toContainText('Closed');
    await expect(jobRow).toContainText('600681152');
    await expect(jobRow).toContainText('SYS');
    console.log('  Job row: visible with correct data (Closed, 600681152, SYS)');

    // Verify only 1 job row exists
    const allJobRows = crseSlide.locator('.job-row');
    await expect(allJobRows).toHaveCount(1);
    console.log('  Job rows: exactly 1 row (as expected for cancelled customer)');

    // 5i. Actions button on the job row
    const actionsBtn = crseSlide.locator('[data-testid="job-management-crse-actions-btn"]');
    await expect(actionsBtn).toBeVisible();
    console.log('  Actions button: visible');

    // 5j. Status pill shows "Closed"
    const statusPill = jobRow.locator('.status-pill.closed');
    await expect(statusPill).toBeVisible();
    await expect(statusPill).toHaveText('Closed');
    console.log('  Status pill: "Closed" with correct styling');

    await page.waitForTimeout(2000);
    console.log('\nAll Job Management validations passed!');

    // --- Step 6: Click the System Management tab (should redirect to CRSE variant) ---
    console.log('Step 6: Clicking the System Management tab...');
    const sysMgmtTab = page.locator('.slide.active .tab', { hasText: 'System Management' });
    await expect(sysMgmtTab).toBeVisible();
    await sysMgmtTab.click();
    await page.waitForTimeout(1500);

    // Verify we landed on the CRSE variant (slide 35)
    const sysCrseSlide = page.locator('[data-title="SystemManagementCRSE"]');
    await expect(sysCrseSlide).toHaveClass(/active/);
    console.log('  System Management CRSE slide active (redirected from tab click)');

    // --- Step 7: Validate System Management CRSE elements ---
    console.log('Step 7: Validating System Management CRSE elements...');

    // 7a. Alert banner
    const alert = sysCrseSlide.locator('[data-testid="crse-alert"]');
    await expect(alert).toBeVisible();
    const alertText = sysCrseSlide.locator('[data-testid="crse-alert-text"]');
    await expect(alertText).toHaveText('MAS info not found for site number.');
    const retryBtn = sysCrseSlide.locator('[data-testid="crse-retry-btn"]');
    await expect(retryBtn).toBeVisible();
    console.log('  Alert banner: "MAS info not found for site number." with Retry button');

    // 7b. Service Add-Ons (0 available)
    const addonsAvail = sysCrseSlide.locator('[data-testid="crse-addons-available"]');
    await expect(addonsAvail).toHaveText('(0 available)');
    console.log('  Service Add-Ons: (0 available)');

    // 7c. System Information - 8 fields, all blank
    const sysGrid = sysCrseSlide.locator('[data-testid="crse-sysinfo-grid"]');
    await expect(sysGrid).toBeVisible();
    const sysItems = sysGrid.locator('.sysinfo-item');
    await expect(sysItems).toHaveCount(8);
    console.log('  System Information: 8 blank fields');

    // 7d. Equipment List - No Data
    const equipRowbar = sysCrseSlide.locator('[data-testid="crse-equipment-rowbar"]');
    await expect(equipRowbar).toBeVisible();
    await expect(equipRowbar.locator('.right')).toHaveText('No Data');
    console.log('  Equipment List: No Data');

    // 7e. Trouble Condition History - No Data
    const troubleRowbar = sysCrseSlide.locator('[data-testid="crse-trouble-rowbar"]');
    await expect(troubleRowbar).toBeVisible();
    await expect(troubleRowbar.locator('.right')).toHaveText('No Data');
    console.log('  Trouble Condition History: No Data');

    // 7f. Topbar shows cancelled status
    const sysTopbar = sysCrseSlide.locator('.topbar');
    await expect(sysTopbar).toBeVisible();
    await expect(sysCrseSlide.locator('.topbar-item', { hasText: 'Cancelled' })).toBeVisible();
    console.log('  Topbar: Cancelled status confirmed');

    await page.waitForTimeout(2000);
    console.log('\nAll System Management CRSE validations passed!');
  });
});
