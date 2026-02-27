/**
 * Equipment Financing Module
 * Handles the equipment financing flow in Job Creation Tool
 */
(function() {
  'use strict';

  /**
   * Initialize Equipment Financing functionality
   */
  function init() {
    document.addEventListener('click', handleClick);
  }

  /**
   * Handle click events for Equipment Financing
   * @param {Event} e - Click event
   */
  function handleClick(e) {
    const action = e.target.closest('[data-ef-action]');
    if (!action) return;

    const actionType = action.getAttribute('data-ef-action');
    const section = action.closest('.equipment-financing') ||
                    action.closest('.jct-ef-modal-overlay')?.closest('.slide')?.querySelector('.equipment-financing');

    if (!section) return;

    switch (actionType) {
      case 'open-send-modal':
        openModal(section, 'send');
        break;
      case 'open-cancel-modal':
        openModal(section, 'cancel');
        break;
      case 'close-modal':
        closeAllModals(section);
        break;
      case 'send-contract':
        sendContract(section);
        break;
      case 'cancel-contract':
        cancelContract(section);
        break;
      case 'sign-contract':
        signContract(section);
        break;
    }
  }

  /**
   * Open a modal
   * @param {Element} section - Equipment Financing section
   * @param {string} modalType - 'send' or 'cancel'
   */
  function openModal(section, modalType) {
    const slide = section.closest('.slide');
    const modal = slide.querySelector(`[data-ef-modal="${modalType}"]`);
    if (modal) {
      modal.classList.add('active');
    }
  }

  /**
   * Close all modals
   * @param {Element} section - Equipment Financing section
   */
  function closeAllModals(section) {
    const slide = section.closest('.slide');
    const modals = slide.querySelectorAll('.jct-ef-modal-overlay');
    modals.forEach(modal => modal.classList.remove('active'));
  }

  /**
   * Send contract - transition to tracking state
   * @param {Element} section - Equipment Financing section
   */
  function sendContract(section) {
    const slide = section.closest('.slide');

    // Close modal
    closeAllModals(section);

    // Hide start state
    const startState = section.querySelector('[data-ef-state="start"]');
    if (startState) startState.classList.add('jct-ef-hidden');

    // Show tracking state
    const trackingStates = section.querySelectorAll('[data-ef-state="tracking"]');
    trackingStates.forEach(el => el.classList.remove('jct-ef-hidden'));

    // Reset signed state
    const signedStates = section.querySelectorAll('[data-ef-state="signed"]');
    signedStates.forEach(el => el.classList.add('jct-ef-hidden'));

    // Reset progress line
    const progressLine = section.querySelector('.jct-ef-progress-line');
    if (progressLine) progressLine.style.width = '66%';

    // Reset last step icon
    const lastStepIcon = section.querySelector('[data-ef-action="sign-contract"]');
    if (lastStepIcon) lastStepIcon.classList.remove('complete');

    // Show resend button
    const resendBtn = section.querySelector('[data-ef-hide-when="signed"]');
    if (resendBtn) resendBtn.style.display = '';
  }

  /**
   * Cancel contract - return to start state
   * @param {Element} section - Equipment Financing section
   */
  function cancelContract(section) {
    const slide = section.closest('.slide');

    // Close modal
    closeAllModals(section);

    // Show start state
    const startState = section.querySelector('[data-ef-state="start"]');
    if (startState) startState.classList.remove('jct-ef-hidden');

    // Hide tracking state
    const trackingStates = section.querySelectorAll('[data-ef-state="tracking"]');
    trackingStates.forEach(el => el.classList.add('jct-ef-hidden'));

    // Hide signed state
    const signedStates = section.querySelectorAll('[data-ef-state="signed"]');
    signedStates.forEach(el => el.classList.add('jct-ef-hidden'));
  }

  /**
   * Sign contract - complete the flow
   * @param {Element} section - Equipment Financing section
   */
  function signContract(section) {
    // Update progress line to 100%
    const progressLine = section.querySelector('.jct-ef-progress-line');
    if (progressLine) progressLine.style.width = '100%';

    // Mark last step as complete
    const lastStepIcon = section.querySelector('[data-ef-action="sign-contract"]');
    if (lastStepIcon) {
      lastStepIcon.classList.add('complete');
      lastStepIcon.textContent = '✓';
    }

    // Show success message
    const signedStates = section.querySelectorAll('[data-ef-state="signed"]');
    signedStates.forEach(el => el.classList.remove('jct-ef-hidden'));

    // Hide resend button
    const resendBtn = section.querySelector('[data-ef-hide-when="signed"]');
    if (resendBtn) resendBtn.style.display = 'none';
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for external use
  window.EquipmentFinancing = {
    init: init
  };
})();
