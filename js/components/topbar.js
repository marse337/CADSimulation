/**
 * Topbar Component
 * Renders the top bar with customer information fields
 */
(function() {
  'use strict';

  // Field definitions with labels
  // autoId maps to the .NET AutomationId values from element_map/elements.py
  const FIELDS = [
    { key: 'contactName', label: 'Contact Name' },
    { key: 'contractSigner', label: 'Contract Signer', autoId: 'HeaderContractSigner' },
    { key: 'siteStatus', label: 'Site Status', autoId: 'HeaderSiteStatus' },
    { key: 'customerTime', label: 'Customer Time', autoId: 'HeaderCustomerTime' },
    { key: 'siteNumber', label: 'Site Number', autoId: 'HeaderSiteNumber' },
    { key: 'customerSince', label: 'Customer Since', autoId: 'HeaderCustomerSince' },
    { key: 'customerEmail', label: 'Customer Email' },
    { key: 'marketType', label: 'Market Type', autoId: 'MarketTypeLblValue' }
  ];

  // Market type dropdown options
  const MARKET_TYPE_OPTIONS = [
    'Unavailable',
    'Remote Tech Only',
    'Truck Roll Only',
    'Either Market'
  ];

  /**
   * Render the topbar component
   * @param {Object} config - Configuration object
   * @param {string} config.contactName - Contact name value
   * @param {string} config.contractSigner - Contract signer value
   * @param {string} config.siteStatus - Site status value
   * @param {string} config.customerTime - Customer time value
   * @param {string} config.siteNumber - Site number value
   * @param {string} config.customerSince - Customer since value
   * @param {string} config.customerEmail - Customer email value
   * @param {string} config.marketType - Market type value (omit for 7-item layout)
   * @param {string} config.marketTypeDropdown - Set to "true" to show dropdown instead of static value
   * @param {string} config.backGoto - Slide number for back button (omit to hide)
   * @param {string} config.gotoOnClick - Slide number to navigate when clicking topbar
   * @returns {string} HTML string
   */
  function render(config) {
    const backGoto = config.backGoto;
    const showMarketType = config.marketType !== undefined;
    const useDropdown = config.marketTypeDropdown === 'true';
    const gotoOnClick = config.gotoOnClick;

    // Build back button if needed
    let backButtonHtml = '';
    if (backGoto) {
      backButtonHtml = `<div class="topbar-back goto-zone" data-goto-on-click="${backGoto}">&lt;</div>`;
    }

    // Build field items
    let fieldsHtml = '';
    for (const field of FIELDS) {
      // Skip market type if not provided
      if (field.key === 'marketType' && !showMarketType) {
        continue;
      }

      // Build automation ID attribute
      const autoIdAttr = field.autoId ? ` data-automation-id="${field.autoId}"` : '';

      // Special handling for market type dropdown
      if (field.key === 'marketType' && useDropdown) {
        const selectedValue = config.marketType || 'Unavailable';
        let optionsHtml = '';
        for (const option of MARKET_TYPE_OPTIONS) {
          const selected = option === selectedValue ? ' selected' : '';
          optionsHtml += `<option value="${option}"${selected}>${option}</option>`;
        }
        fieldsHtml += `
            <div class="topbar-item"><div class="label">${field.label}</div><div class="value"${autoIdAttr}><select class="topbar-select">${optionsHtml}</select></div></div>`;
      } else {
        const value = config[field.key] || '--';
        fieldsHtml += `
            <div class="topbar-item"><div class="label">${field.label}</div><div class="value"${autoIdAttr}>${value}</div></div>`;
      }
    }

    // Build goto attribute if provided
    const gotoAttr = gotoOnClick ? ` data-goto-on-click="${gotoOnClick}"` : '';

    return `<header class="topbar"${gotoAttr}>
          ${backButtonHtml}<div class="topbar-grid">${fieldsHtml}
          </div>
        </header>`;
  }

  // Register the component
  if (window.ComponentRenderer) {
    window.ComponentRenderer.register('topbar', render);
  }
})();
