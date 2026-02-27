/* =========================================================
   PAPERLESS BILLING JavaScript
   Handles enrollment/unenrollment flow with modals
   ========================================================= */

(function() {
  'use strict';

  function initPaperlessBilling() {
    const paymentSlide = document.querySelector('[data-title="PaymentBilling"]');
    if (!paymentSlide) return;

    // Get elements
    const toggle = paymentSlide.querySelector('#paperless-toggle');
    const toggleLabel = paymentSlide.querySelector('#paperless-label');
    const contactInfo = paymentSlide.querySelector('#paperless-contact-info');
    const contactName = paymentSlide.querySelector('#paperless-contact-name');
    const contactEmail = paymentSlide.querySelector('#paperless-contact-email');

    // Modals
    const setupModal = paymentSlide.querySelector('#pb-setup-modal');
    const formModal = paymentSlide.querySelector('#pb-form-modal');
    const warningModal = paymentSlide.querySelector('#pb-warning-modal');

    // Setup modal elements
    const contactSelect = paymentSlide.querySelector('#pb-contact-select');
    const createNewBtn = paymentSlide.querySelector('#pb-create-new-btn');
    const continueBtn = paymentSlide.querySelector('#pb-continue-btn');

    // Form modal elements
    const firstNameInput = paymentSlide.querySelector('#pb-first-name');
    const lastNameInput = paymentSlide.querySelector('#pb-last-name');
    const emailInput = paymentSlide.querySelector('#pb-email');
    const saveContactBtn = paymentSlide.querySelector('#pb-save-contact-btn');

    // Warning modal elements
    const cancelUnenrollBtn = paymentSlide.querySelector('#pb-cancel-unenroll-btn');
    const confirmUnenrollBtn = paymentSlide.querySelector('#pb-confirm-unenroll-btn');

    // Close buttons
    const closeButtons = paymentSlide.querySelectorAll('.pb-modal-close');

    // Edit buttons
    const editButtons = paymentSlide.querySelectorAll('.edit-icon-btn');

    // State
    let isEnrolled = false;

    // Helper to close all modals
    function closeAllModals() {
      setupModal.classList.remove('visible');
      formModal.classList.remove('visible');
      warningModal.classList.remove('visible');
    }

    // Toggle event - main enrollment/unenrollment trigger
    toggle.addEventListener('change', function() {
      if (this.checked && !isEnrolled) {
        // Trying to enroll - show setup modal
        setupModal.classList.add('visible');
      } else if (!this.checked && isEnrolled) {
        // Trying to unenroll - show warning modal
        warningModal.classList.add('visible');
      }
    });

    // Contact select - enable/disable continue button
    contactSelect.addEventListener('change', function() {
      continueBtn.disabled = !this.value;
    });

    // Create New Contact button - go to form modal
    createNewBtn.addEventListener('click', function() {
      setupModal.classList.remove('visible');
      formModal.classList.add('visible');
    });

    // Continue button - use selected contact
    continueBtn.addEventListener('click', function() {
      if (contactSelect.value === 'existing') {
        // Use the pre-existing contact from the dropdown
        contactName.textContent = 'SARAH MILLER';
        contactEmail.textContent = 'sarah@email.com';
        completeEnrollment();
      }
      closeAllModals();
    });

    // Save Contact button - save new contact and complete enrollment
    saveContactBtn.addEventListener('click', function() {
      const firstName = firstNameInput.value.trim();
      const lastName = lastNameInput.value.trim();
      const email = emailInput.value.trim();

      if (firstName && lastName && email) {
        contactName.textContent = firstName + ' ' + lastName;
        contactEmail.textContent = email;
        completeEnrollment();
        closeAllModals();
      }
    });

    // Complete enrollment helper
    function completeEnrollment() {
      isEnrolled = true;
      toggle.checked = true;
      toggleLabel.textContent = 'Unenroll Paperless Billing';
      contactInfo.classList.add('visible');
    }

    // Cancel unenrollment - go back to enrolled state
    cancelUnenrollBtn.addEventListener('click', function() {
      toggle.checked = true;
      closeAllModals();
    });

    // Confirm unenrollment - complete unenrollment
    confirmUnenrollBtn.addEventListener('click', function() {
      isEnrolled = false;
      toggle.checked = false;
      toggleLabel.textContent = 'Enroll in Paperless Billing';
      contactInfo.classList.remove('visible');
      closeAllModals();
    });

    // Close button handlers
    closeButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        closeAllModals();
        // Reset toggle if closed without completing enrollment
        if (!isEnrolled) {
          toggle.checked = false;
        }
      });
    });

    // Edit buttons - open form modal to edit contact
    editButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        // Pre-populate form with current values
        const nameParts = contactName.textContent.split(' ');
        firstNameInput.value = nameParts[0] || '';
        lastNameInput.value = nameParts.slice(1).join(' ') || '';
        emailInput.value = contactEmail.textContent || '';
        formModal.classList.add('visible');
      });
    });

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeAllModals();
        if (!isEnrolled) {
          toggle.checked = false;
        }
      }
    });

    // Close modal when clicking overlay background
    [setupModal, formModal, warningModal].forEach(modal => {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          closeAllModals();
          if (!isEnrolled) {
            toggle.checked = false;
          }
        }
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPaperlessBilling);
  } else {
    initPaperlessBilling();
  }
})();
