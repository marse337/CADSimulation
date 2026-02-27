/* =========================================================
   SYSTEM MANAGEMENT MODAL JavaScript
   Handles the Edit Transformer Location modal on SystemManagement slide
   ========================================================= */

(function() {
  'use strict';

  function initSystemManagementModal() {
    const sysManagementSlide = document.querySelector('[data-title="SystemManagement"]');
    if (!sysManagementSlide) return;

    // Modal reference
    const modal = sysManagementSlide.querySelector('#transformer-modal');
    if (!modal) return;

    // Get the editable transformer location link
    const transformerLink = sysManagementSlide.querySelector('[data-modal="transformer-location"]');
    if (transformerLink) {
      transformerLink.addEventListener('click', (e) => {
        e.stopPropagation();
        modal.classList.add('active');
      });
    }

    // Close modal function
    function closeModal() {
      modal.classList.remove('active');
    }

    // Close button
    const closeBtn = modal.querySelector('.sysm-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal();
      });
    }

    // Update button - closes modal
    const updateBtn = modal.querySelector('.sysm-modal-btn');
    if (updateBtn) {
      updateBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal();
      });
    }

    // Click on overlay background closes modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSystemManagementModal);
  } else {
    initSystemManagementModal();
  }
})();
