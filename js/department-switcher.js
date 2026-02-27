/**
 * Department Switcher Module
 * Handles switching between CR (Customer Retention) and CS (Customer Service) departments
 */
(function() {
  'use strict';

  /**
   * Initialize the department switcher
   */
  function init() {
    const canvas = document.getElementById('canvas');
    const deptSwitcher = document.querySelector('.dept-switcher');

    if (!canvas || !deptSwitcher) return;

    deptSwitcher.addEventListener('click', (e) => {
      const btn = e.target.closest('.dept-btn');
      if (!btn) return;

      const dept = btn.getAttribute('data-dept');
      if (!dept) return;

      // Update canvas data attribute
      canvas.setAttribute('data-dept', dept);

      // Update active button state
      document.querySelectorAll('.dept-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  }

  // Export for use by other modules
  window.DepartmentSwitcher = {
    init: init
  };
})();
