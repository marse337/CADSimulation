/* =========================================================
   CONTACT MANAGEMENT JavaScript
   Handles contact modals (Add/Edit) and drag-drop reordering
   ========================================================= */

(function() {
  'use strict';

  function initContactManagement() {
    const accountSlide = document.querySelector('[data-title="AccountManagement"]');
    if (!accountSlide) return;

    // Modal references
    const setupModal = accountSlide.querySelector('#setup-contact-modal');
    const editModal = accountSlide.querySelector('#edit-contact-modal');

    // Contact lists for drag-and-drop
    const primaryList = accountSlide.querySelector('#primary-contacts-list');
    const secondaryList = accountSlide.querySelector('#secondary-contacts-list');

    // Add Contact button
    const addContactBtn = accountSlide.querySelector('[data-modal="setup-contact"]');
    if (addContactBtn && setupModal) {
      addContactBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setupModal.classList.add('active');
      });
    }

    // Edit Contact buttons
    const editContactBtns = accountSlide.querySelectorAll('[data-modal="edit-contact"]');
    editContactBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (editModal) {
          editModal.classList.add('active');
        }
      });
    });

    // Close modal function
    function closeModal(modal) {
      if (modal) {
        modal.classList.remove('active');
      }
    }

    // Setup close handlers for both modals
    [setupModal, editModal].forEach(modal => {
      if (!modal) return;

      // Close button
      const closeBtn = modal.querySelector('.contact-modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          closeModal(modal);
        });
      }

      // Save/Update button - closes modal
      const saveBtn = modal.querySelector('.contact-modal-btn');
      if (saveBtn) {
        saveBtn.addEventListener('click', (e) => {
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

    // Escape key closes any open contact modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal(setupModal);
        closeModal(editModal);
      }
    });

    // Initialize SortableJS for drag-and-drop if library is loaded
    if (typeof Sortable !== 'undefined') {
      // Primary contacts list
      if (primaryList) {
        new Sortable(primaryList, {
          group: 'contacts',
          animation: 150,
          handle: '.drag-handle',
          ghostClass: 'sortable-ghost',
          chosenClass: 'sortable-chosen',
          onAdd: function(evt) {
            console.log('Contact moved to Primary list');
          },
          onEnd: function(evt) {
            console.log('Contact reordered in Primary list');
          }
        });
      }

      // Secondary contacts list
      if (secondaryList) {
        new Sortable(secondaryList, {
          group: 'contacts',
          animation: 150,
          handle: '.drag-handle',
          ghostClass: 'sortable-ghost',
          chosenClass: 'sortable-chosen',
          onAdd: function(evt) {
            console.log('Contact moved to Secondary list');
          },
          onEnd: function(evt) {
            console.log('Contact reordered in Secondary list');
          }
        });
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactManagement);
  } else {
    initContactManagement();
  }
})();
