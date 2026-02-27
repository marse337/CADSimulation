/**
 * Sidebar Component
 * Renders the application sidebar with navigation items
 */
(function() {
  'use strict';

  // SVG Icons
  const ICONS = {
    back: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    lookup: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="white" stroke-width="2"/><path d="M20 20l-3.2-3.2" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>',
    alarm: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3l9 9-9 9-9-9 9-9z" stroke="white" stroke-width="2" opacity=".85"/></svg>',
    myaccount: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 11l9-8 9 8v10H3V11z" stroke="white" stroke-width="2" stroke-linejoin="round"/></svg>',
    support: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 12a8 8 0 0 1 16 0" stroke="white" stroke-width="2"/><path d="M4 12v6a2 2 0 0 0 2 2h2v-8H6a2 2 0 0 0-2 2z" stroke="white" stroke-width="2"/><path d="M20 12v6a2 2 0 0 1-2 2h-2v-8h2a2 2 0 0 1 2 2z" stroke="white" stroke-width="2"/></svg>',
    voziq: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" stroke="white" stroke-width="2" opacity=".85"/></svg>',
    move: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="white" stroke-width="2"/><circle cx="12" cy="9" r="2.5" stroke="white" stroke-width="2"/></svg>',
    jobcreation: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    external: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 3h7v7" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M10 14L21 3" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M3 7v14h14" stroke="white" stroke-width="2" opacity=".55"/></svg>'
  };

  // Navigation item definitions
  // autoId / popoutAutoId map to the .NET AutomationId values from element_map/elements.py
  const NAV_ITEMS = [
    { key: 'lookup', text: 'Customer Lookup', icon: 'lookup', external: false, muted: false, crOnly: false, autoId: 'AppMenu_CustomerLookup', popoutAutoId: 'AppMenu_CustomerLookupPopout' },
    { key: 'alarm', text: 'Alarm.com', icon: 'alarm', external: true, muted: true, crOnly: false, autoId: 'AppMenu_Alarm', popoutAutoId: 'AppMenu_AlarmPopout' },
    { key: 'move', text: 'Move Customer', icon: 'move', external: false, muted: false, crOnly: true, autoId: 'AppMenu_MoveCustomer', popoutAutoId: 'AppMenu_MoveCustomerPopout' },
    { key: 'myaccount', text: 'My Account CS', icon: 'myaccount', external: true, muted: false, crOnly: false, autoId: 'AppMenu_MyAccount', popoutAutoId: 'AppMenu_MyAccountPopout' },
    { key: 'support', text: 'Support Center', icon: 'support', external: true, muted: false, crOnly: false, autoId: 'AppMenu_SupportCenter', popoutAutoId: 'AppMenu_SupportCenterPopout' },
    { key: 'voziq', text: 'Voziq', icon: 'voziq', external: true, muted: true, crOnly: false, autoId: 'AppMenu_Voziq', popoutAutoId: 'AppMenu_VoziqPopout' },
    { key: 'jobcreation', text: 'Job Creation Tool', icon: 'jobcreation', external: false, muted: false, crOnly: false, showOnSlide: true }
  ];

  /**
   * Render the sidebar component
   * @param {Object} config - Configuration object
   * @param {string} config.version - Version string (e.g., "3.5.1" or "3.4.3")
   * @param {string} config.activeNav - Active navigation key (lookup|alarm|move|myaccount|support|voziq|jobcreation)
   * @param {string} config.showCrOnly - Whether to show CR-only items ("true"|"false")
   * @param {string} config.showStatus - Whether to show status dots ("true"|"false")
   * @param {string} config.showJobCreation - Whether to show Job Creation Tool nav item ("true"|"false")
   * @param {Object} config.navGoto - JSON object mapping nav keys to slide numbers
   * @param {Array} config.disabledNav - Array of nav keys that should be disabled (muted + not clickable)
   * @param {string} config.gotoOnClick - Slide number to navigate when clicking sidebar
   * @returns {string} HTML string
   */
  function render(config) {
    const version = config.version || (window.AppConfig && window.AppConfig.VERSION) || '3.6.0';
    const activeNav = config.activeNav || 'lookup';
    const showCrOnly = config.showCrOnly === 'true';
    const showStatus = config.showStatus === 'true';
    const showJobCreation = config.showJobCreation === 'true';
    const navGoto = config.navGoto || {};
    const disabledNav = config.disabledNav || [];
    const gotoOnClick = config.gotoOnClick;

    // Build navigation items HTML
    let navItemsHtml = '';
    for (const item of NAV_ITEMS) {
      // Skip CR-only items if not showing them
      if (item.crOnly && !showCrOnly) {
        continue;
      }

      // Skip Job Creation Tool if not showing it
      if (item.showOnSlide && !showJobCreation) {
        continue;
      }

      const isActive = item.key === activeNav;
      const isDisabled = disabledNav.includes(item.key);
      const gotoSlide = isDisabled ? null : navGoto[item.key];
      const hasNavTarget = !!gotoSlide;

      // Build class list
      const classes = ['nav-item'];
      if (isActive) classes.push('active');
      // Only apply muted if disabled OR (default muted AND no navigation target AND not active)
      if (isDisabled || (item.muted && !hasNavTarget && !isActive)) classes.push('muted');
      if (isDisabled) classes.push('disabled');
      if (item.crOnly) classes.push('cr-only');
      if (gotoSlide) classes.push('goto-zone');

      // Build goto attribute
      const gotoAttr = gotoSlide ? ` data-goto-on-click="${gotoSlide}"` : '';

      // Build status dot
      let statusDot = '';
      if (showStatus) {
        if (item.key === 'alarm') statusDot = '<span class="dot orange"></span>';
        if (item.key === 'voziq') statusDot = '<span class="dot yellow"></span>';
      }

      // Build external link icon with automation ID
      const popoutAttr = item.popoutAutoId ? ` data-automation-id="${item.popoutAutoId}"` : '';
      const extIcon = item.external ? `<div class="ext" aria-hidden="true"${popoutAttr}>${ICONS.external}</div>` : '';

      // Build automation ID attribute for the nav text
      const textAutoIdAttr = item.autoId ? ` data-automation-id="${item.autoId}"` : '';

      navItemsHtml += `
            <div class="${classes.join(' ')}"${gotoAttr}>
              ${statusDot}<div class="nav-ico">${ICONS[item.icon]}</div>
              <div class="nav-text"${textAutoIdAttr}>${item.text}</div>
              ${extIcon}
            </div>`;
    }

    // Build goto attribute if provided
    const sidebarGotoAttr = gotoOnClick ? ` data-goto-on-click="${gotoOnClick}"` : '';

    return `<aside class="sidebar"${sidebarGotoAttr}>
          <div class="sidebar-head">
            <div class="sidebar-row">
              <div class="back-btn" aria-label="Back" data-automation-id="NavigationViewBackButton">${ICONS.back}</div>
              <div class="app-title" data-automation-id="AppTitle">Common Agent Desktop</div>
            </div>
            <div class="brand"><div class="brand-badge">B</div></div>
          </div>
          <div class="userbox">
            <div class="email">BrinksSSO@brinkshome.com</div>
            <div class="signout">Sign Out</div>
          </div>
          <nav class="nav" aria-label="Primary" data-automation-id="SideNavMenuScroll">${navItemsHtml}
          </nav>
          <div class="sidebar-foot">
            <div style="display:flex; align-items:center; gap:10px;"><span style="opacity:.9;">«</span><span style="font-weight:650;">Collapse</span></div>
            <div class="version">version ${version}</div>
          </div>
        </aside>`;
  }

  // Register the component
  if (window.ComponentRenderer) {
    window.ComponentRenderer.register('sidebar', render);
  }
})();
