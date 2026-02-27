/* =========================================================
   MARKET TYPE SYNC JavaScript
   Syncs market type selection across all slides
   ========================================================= */

(function() {
  'use strict';

  let initialized = false;

  function initMarketTypeSync() {
    if (initialized) return;

    // Get all topbar select dropdowns
    const allSelects = document.querySelectorAll('.topbar-select');

    // If no selects found yet, components haven't been rendered
    // Wait and try again
    if (allSelects.length === 0) {
      setTimeout(initMarketTypeSync, 100);
      return;
    }

    initialized = true;

    // Add change listener to each dropdown
    allSelects.forEach(select => {
      select.addEventListener('change', function() {
        const newValue = this.value;
        syncMarketType(newValue);
      });
    });

    // Restore saved value
    restoreMarketType();
  }

  /**
   * Sync market type value across all slides
   * @param {string} newValue - The new market type value
   */
  function syncMarketType(newValue) {
    // Update all dropdown selects
    const allSelects = document.querySelectorAll('.topbar-select');
    allSelects.forEach(select => {
      if (select.value !== newValue) {
        select.value = newValue;
      }
    });

    // Also update any static market type displays (for slides without dropdown)
    // These would be topbar-item elements where the label is "Market Type"
    const allTopbarItems = document.querySelectorAll('.topbar-item');
    allTopbarItems.forEach(item => {
      const label = item.querySelector('.label');
      const value = item.querySelector('.value');

      if (label && value && label.textContent === 'Market Type') {
        // Only update if it's not a dropdown (no select inside)
        if (!value.querySelector('select')) {
          value.textContent = newValue;
        }
      }
    });

    // Store in sessionStorage so it persists during the session
    try {
      sessionStorage.setItem('cadSimMarketType', newValue);
    } catch (e) {
      // Ignore storage errors
    }
  }

  /**
   * Restore market type from session storage on page load
   */
  function restoreMarketType() {
    try {
      const savedValue = sessionStorage.getItem('cadSimMarketType');
      if (savedValue) {
        syncMarketType(savedValue);
      }
    } catch (e) {
      // Ignore storage errors
    }
  }

  // Initialize when DOM is ready, with retry for component rendering
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      // Wait a bit for main.js to render components
      setTimeout(initMarketTypeSync, 50);
    });
  } else {
    setTimeout(initMarketTypeSync, 50);
  }
})();
