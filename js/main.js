/**
 * Main Application Entry Point
 * Initializes all modules when DOM is ready
 */
(function() {
  'use strict';

  /**
   * Initialize all application modules
   */
  function initApp() {
    // Render reusable components first (before navigation binds events)
    if (window.ComponentRenderer) {
      window.ComponentRenderer.renderAll();
    }

    // Initialize navigation system
    if (window.SlideNavigation) {
      window.SlideNavigation.init();
    }

    // Initialize incoming call button
    if (window.IncomingCall) {
      window.IncomingCall.init();
    }

    // Initialize environment switcher
    if (window.EnvironmentSwitcher) {
      window.EnvironmentSwitcher.init();
    }

    // Initialize department switcher
    if (window.DepartmentSwitcher) {
      window.DepartmentSwitcher.init();
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    // DOM is already ready
    initApp();
  }
})();
