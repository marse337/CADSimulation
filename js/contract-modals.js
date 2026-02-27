/* =========================================================
   CONTRACT INFO MODALS - JavaScript
   Handles opening/closing of Send Copy modals on ContractInfo slide
   ========================================================= */

(function() {
  'use strict';

  function initContractModals() {
    const contractSlide = document.querySelector('[data-title="ContractInfo"]');
    if (!contractSlide) return;

    // Get modal elements
    const extensionModal = contractSlide.querySelector('#extension-contract-modal');
    const initialModal = contractSlide.querySelector('#initial-contract-modal');

    // Use event delegation for Send Copy buttons (works for all views)
    contractSlide.addEventListener('click', (e) => {
      const button = e.target.closest('[data-modal]');
      if (!button) return;

      e.stopPropagation();
      const modalType = button.getAttribute('data-modal');

      if (modalType === 'extension-contract' && extensionModal) {
        extensionModal.classList.add('active');
      } else if (modalType === 'initial-contract' && initialModal) {
        initialModal.classList.add('active');
      }
    });

    // Close modal functions
    function closeModal(modal) {
      if (modal) {
        modal.classList.remove('active');
      }
    }

    // Close button click handlers
    [extensionModal, initialModal].forEach(modal => {
      if (!modal) return;

      // Close button
      const closeBtn = modal.querySelector('.contract-modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          closeModal(modal);
        });
      }

      // Send Email button - closes modal and stays on slide
      const sendBtn = modal.querySelector('.contract-modal-send');
      if (sendBtn) {
        sendBtn.addEventListener('click', (e) => {
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
        closeModal(extensionModal);
        closeModal(initialModal);
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContractModals);
  } else {
    initContractModals();
  }
})();
