/* =========================================================
   EVENT HISTORY - DISPATCH MODAL JavaScript
   Handles opening/closing of Temporary Dispatch Note modal
   ========================================================= */

(function() {
  'use strict';

  function initDispatchModal() {
    const eventHistorySlide = document.querySelector('[data-title="EventHistory"]');
    if (!eventHistorySlide) return;

    // Get modal element
    const dispatchModal = eventHistorySlide.querySelector('#temp-dispatch-modal');
    if (!dispatchModal) return;

    // Get the + New button
    const newButton = eventHistorySlide.querySelector('[data-modal="temp-dispatch"]');

    // Open modal when + New button is clicked
    if (newButton) {
      newButton.addEventListener('click', (e) => {
        e.stopPropagation();
        dispatchModal.classList.add('active');
      });
    }

    // Close modal function
    function closeModal() {
      dispatchModal.classList.remove('active');
    }

    // Close button click handler
    const closeBtn = dispatchModal.querySelector('.dispatch-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal();
      });
    }

    // Create Note button - closes modal and stays on slide
    const createBtn = dispatchModal.querySelector('.dispatch-create-btn');
    if (createBtn) {
      createBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal();
      });
    }

    // Click on overlay background closes modal
    dispatchModal.addEventListener('click', (e) => {
      if (e.target === dispatchModal) {
        closeModal();
      }
    });

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dispatchModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDispatchModal);
  } else {
    initDispatchModal();
  }
})();
