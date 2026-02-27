/* =========================================================
   ACCOUNT MANAGEMENT MODALS JavaScript
   Handles opening/closing of edit modals on AccountManagement slide
   ========================================================= */

(function() {
  'use strict';

  function initAccountModals() {
    const accountSlide = document.querySelector('[data-title="AccountManagement"]');
    if (!accountSlide) return;

    // Modal mapping
    const modalMap = {
      'billing-mailing': accountSlide.querySelector('#billing-mailing-modal'),
      'orders-shipped': accountSlide.querySelector('#orders-shipped-modal'),
      'monitored-site': accountSlide.querySelector('#monitored-site-modal'),
      'site-phone': accountSlide.querySelector('#site-phone-modal')
    };

    // Get all edit buttons with data-modal attribute
    const editButtons = accountSlide.querySelectorAll('[data-modal]');

    // Open modal when edit button is clicked
    editButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const modalType = button.getAttribute('data-modal');
        const modal = modalMap[modalType];
        if (modal) {
          modal.classList.add('active');
        }
      });
    });

    // Close modal function
    function closeModal(modal) {
      if (modal) {
        modal.classList.remove('active');
      }
    }

    // Setup close handlers for each modal
    Object.values(modalMap).forEach(modal => {
      if (!modal) return;

      // Close button
      const closeBtn = modal.querySelector('.acct-modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          closeModal(modal);
        });
      }

      // Update button - closes modal
      const updateBtn = modal.querySelector('.acct-modal-btn');
      if (updateBtn) {
        updateBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          closeModal(modal);
        });
      }

      // Click on overlay background closes modal
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    });

    // Escape key closes any open modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        Object.values(modalMap).forEach(modal => closeModal(modal));
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccountModals);
  } else {
    initAccountModals();
  }
})();
