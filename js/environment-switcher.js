/**
 * Environment Switcher Module
 * Handles switching between Stage, Training, and Production environments
 */
(function() {
  'use strict';

  /**
   * Initialize the environment switcher
   */
  function init() {
    const canvas = document.getElementById('canvas');
    const envSwitcher = document.querySelector('.env-switcher');

    if (!canvas || !envSwitcher) return;

    envSwitcher.addEventListener('click', (e) => {
      const btn = e.target.closest('.env-btn');
      if (!btn) return;

      const env = btn.getAttribute('data-env');
      if (!env) return;

      // Update canvas data attribute
      canvas.setAttribute('data-env', env);

      // Update active button state
      document.querySelectorAll('.env-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  }

  // Export for use by other modules
  window.EnvironmentSwitcher = {
    init: init
  };
})();
