/**
 * Tabs Component
 * Renders the tab navigation for account views
 */
(function() {
  'use strict';

  // Tab definitions with default navigation targets
  // autoId / popoutAutoId map to the .NET AutomationId values from element_map/elements.py
  const TABS = [
    { label: 'Account Activity', gotoSlide: '6', autoId: 'LookupAccountActivityTab', popoutAutoId: 'LookupAccountActivityTabPopout' },
    { label: 'Contract Info', gotoSlide: '7', autoId: 'LookupContractTab', popoutAutoId: 'LookupContractTabPopout' },
    { label: 'Event History', gotoSlide: '8', autoId: 'LookupEventTab', popoutAutoId: 'LookupEventTabPopout' },
    { label: 'Account Management', gotoSlide: '9', autoId: 'AccountManagementTabID', popoutAutoId: 'AccountManagementTabIDPopout' },
    { label: 'Payment Billing', gotoSlide: '10', autoId: 'PaperlessBillingTabID', popoutAutoId: 'PaperlessBillingTabIDPopout' },
    { label: 'Job Management', gotoSlide: '11', autoId: 'JobManagementTabID', popoutAutoId: 'JobManagementTabIDPopout' },
    { label: 'System Management', gotoSlide: '12', autoId: 'SystemManagementTabID', popoutAutoId: 'SystemManagementTabIDPopout' }
  ];

  /**
   * Render the tabs component
   * @param {Object} config - Configuration object
   * @param {string} config.activeTab - Active tab index (0-6)
   * @param {Object} config.tabGoto - Optional JSON object to override default goto slides
   * @returns {string} HTML string
   */
  function render(config) {
    const activeTabIndex = parseInt(config.activeTab, 10) || 0;
    const tabGoto = config.tabGoto || {};

    let tabsHtml = '';
    for (let i = 0; i < TABS.length; i++) {
      const tab = TABS[i];
      const isActive = i === activeTabIndex;
      const gotoSlide = tabGoto[i] || tab.gotoSlide;

      if (isActive) {
        // Active tab - no navigation wrapper
        tabsHtml += `
                <div class="tab active" data-automation-id="${tab.autoId}">${tab.label} <span class="ext" data-automation-id="${tab.popoutAutoId}">&nearr;</span></div>`;
      } else {
        // Inactive tab - wrapped in goto-zone for navigation
        tabsHtml += `
                <div class="goto-zone" data-goto-on-click="${gotoSlide}"><div class="tab" data-automation-id="${tab.autoId}">${tab.label} <span class="ext" data-automation-id="${tab.popoutAutoId}">&nearr;</span></div></div>`;
      }
    }

    return `<div class="tabs">${tabsHtml}
              </div>`;
  }

  // Register the component
  if (window.ComponentRenderer) {
    window.ComponentRenderer.register('tabs', render);
  }
})();
