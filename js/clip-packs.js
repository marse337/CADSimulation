/* =========================================================
   CLIP PACKS JavaScript
   Handles clip pack selection and summary updates
   ========================================================= */

(function() {
  'use strict';

  function initClipPacks() {
    const systemSlide = document.querySelector('[data-title="SystemManagement"]');
    if (!systemSlide) return;

    // Get elements
    const brinksSelect = systemSlide.querySelector('#brinks-plus-select');
    const clipSelect = systemSlide.querySelector('#clip-packs-select');
    const summaryBrinks = systemSlide.querySelector('#summary-brinks');
    const summaryClips = systemSlide.querySelector('#summary-clips');
    const clipCostText = systemSlide.querySelector('#clip-cost-text');
    const estimatedRow = systemSlide.querySelector('#estimated-rmr-row');
    const estimatedRmr = systemSlide.querySelector('#estimated-rmr');
    const summaryActions = systemSlide.querySelector('#summary-actions');
    const btnDiscard = systemSlide.querySelector('#btn-discard');
    const btnConfirm = systemSlide.querySelector('#btn-confirm');

    if (!clipSelect || !summaryClips) return;

    const baseRmr = 66.96;

    // Update summary when clip pack changes
    clipSelect.addEventListener('change', function() {
      updateSummary();
    });

    // Update summary when Brinks Plus changes
    if (brinksSelect) {
      brinksSelect.addEventListener('change', function() {
        updateSummary();
      });
    }

    function updateSummary() {
      const clipCost = parseFloat(clipSelect.value) || 0;
      const brinksCost = brinksSelect ? (parseFloat(brinksSelect.value) || 0) : 0;

      // Update Brinks summary
      if (brinksSelect && summaryBrinks) {
        const brinksOption = brinksSelect.options[brinksSelect.selectedIndex];
        if (brinksSelect.value === '0') {
          summaryBrinks.textContent = 'Not Enrolled';
        } else {
          summaryBrinks.textContent = 'Enrolled';
        }
      }

      // Update clip pack summary text
      const selectedOption = clipSelect.options[clipSelect.selectedIndex];
      const clipText = selectedOption.text.split(' - ')[0];
      summaryClips.textContent = clipText;

      // Update cost text
      if (clipCost > 0) {
        clipCostText.textContent = '+ $' + clipCost.toFixed(2) + '/mo';
        clipCostText.classList.add('has-cost');
      } else {
        clipCostText.textContent = 'included';
        clipCostText.classList.remove('has-cost');
      }

      // Calculate total add-on cost
      const totalAddOn = clipCost + brinksCost;

      // Show/hide estimated RMR and action buttons
      if (totalAddOn > 0) {
        const total = baseRmr + totalAddOn;
        estimatedRmr.textContent = '$' + total.toFixed(2) + '/mo';
        estimatedRow.classList.remove('hidden');
        summaryActions.classList.remove('hidden');
      } else {
        estimatedRow.classList.add('hidden');
        summaryActions.classList.add('hidden');
      }
    }

    // Discard button - reset selections
    if (btnDiscard) {
      btnDiscard.addEventListener('click', function() {
        clipSelect.value = '0';
        if (brinksSelect) {
          brinksSelect.value = '0';
        }
        updateSummary();
      });
    }

    // Confirm button - just close the UI for now (in real app would save)
    if (btnConfirm) {
      btnConfirm.addEventListener('click', function() {
        // In a real app, this would save the changes
        // For this mockup, just hide the action buttons
        estimatedRow.classList.add('hidden');
        summaryActions.classList.add('hidden');
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClipPacks);
  } else {
    initClipPacks();
  }
})();
