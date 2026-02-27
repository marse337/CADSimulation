/**
 * Slide Navigation Module
 * Handles slide transitions, counters, and button state
 */
(function() {
  'use strict';

  // State
  let slides = [];
  let currentIndex = 0;

  // External tab slides that show the Back to CAD button
  const EXTERNAL_TAB_TITLES = ['AlarmTab', 'VoziqTab', 'SupportCenterTab', 'MyAccountCSTab'];

  /**
   * Initialize the navigation system
   */
  function init() {
    slides = Array.from(document.querySelectorAll('.slide'));
    currentIndex = slides.findIndex(s => s.classList.contains('active'));
    if (currentIndex < 0) currentIndex = 0;

    setupClickHandlers();
    setupKeyboardHandlers();
    setActive(currentIndex);
  }

  // Department-based slide redirects (0-indexed)
  // When dept is CRSE and customer is Cancelled, redirect to CRSE variants
  // For non-cancelled customers on CRSE, load the same slides as CR
  const DEPT_REDIRECTS = {
    'crse': {
      10: 33,  // JobManagement (slide 11) → JobManagementCRSE (slide 34)
      11: 34   // SystemManagement (slide 12) → SystemManagementCRSE (slide 35)
    }
  };

  /**
   * Set the active slide by index
   * @param {number} i - Target slide index
   */
  function setActive(i) {
    // Apply department-based redirects only for Cancelled customers
    var canvas = document.getElementById('canvas');
    if (canvas) {
      var dept = canvas.getAttribute('data-dept');
      var customerType = (window.AppConfig && window.AppConfig.customerType) || 'AlarmDotCom';
      var redirectMap = DEPT_REDIRECTS[dept];
      if (redirectMap && redirectMap[i] !== undefined && customerType === 'Cancelled') {
        i = redirectMap[i];
      }
    }

    currentIndex = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach((s, n) => {
      if (n === currentIndex) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });
    updateCountersAndButtons();
    updateCustomerViews();
  }

  /**
   * Toggle customer-type-specific content based on AppConfig.customerType
   */
  function updateCustomerViews() {
    const activeSlide = slides[currentIndex];
    if (!activeSlide) return;

    var customerType = (window.AppConfig && window.AppConfig.customerType) || 'AlarmDotCom';

    // Show/hide views that match a specific customer type
    // AuthorizedDealer inherits AlarmDotCom content when no dedicated AuthorizedDealer content block exists
    var views = activeSlide.querySelectorAll('[data-customer-view]');
    var hasAuthorizedDealerContent = customerType === 'AuthorizedDealer' &&
      activeSlide.querySelector('.content[data-customer-view="AuthorizedDealer"]');
    views.forEach(function(view) {
      var viewType = view.getAttribute('data-customer-view');
      if (viewType === customerType) {
        view.style.display = '';
      } else if (customerType === 'AuthorizedDealer' && viewType === 'AlarmDotCom' && !hasAuthorizedDealerContent) {
        view.style.display = '';
      } else {
        view.style.display = 'none';
      }
    });

    // Show/hide default views that should hide for a specific customer type
    // Supports comma-separated values e.g. data-customer-view-hide="Cancelled,AuthorizedDealer"
    var hideViews = activeSlide.querySelectorAll('[data-customer-view-hide]');
    hideViews.forEach(function(view) {
      var hideTypes = view.getAttribute('data-customer-view-hide').split(',');
      if (hideTypes.indexOf(customerType) !== -1) {
        view.style.display = 'none';
      } else {
        view.style.display = '';
      }
    });

    // Show Collections Account modal on AccountActivity for Cancelled customers on CR/CS dept
    var collectionsModal = document.getElementById('collections-modal');
    if (collectionsModal) {
      var canvas = document.getElementById('canvas');
      var dept = canvas ? canvas.getAttribute('data-dept') : '';
      var isCancelled = customerType === 'Cancelled';
      var isCrOrCs = (dept === 'cr' || dept === 'cs');

      if (activeSlide.getAttribute('data-title') === 'AccountActivity' && isCancelled && isCrOrCs) {
        collectionsModal.classList.add('active');
      } else {
        collectionsModal.classList.remove('active');
      }
    }
  }

  /**
   * Update slide counters and button states
   */
  function updateCountersAndButtons() {
    slides.forEach((s) => {
      const counter = s.querySelector('[data-counter]');
      if (counter) {
        const title = s.dataset.title ? ` — ${s.dataset.title}` : '';
        counter.textContent = `${currentIndex + 1} / ${slides.length}${title}`;
      }

      const prev = s.querySelector('[data-prev]');
      const next = s.querySelector('[data-next]');
      if (prev) prev.disabled = (currentIndex === 0);
      if (next) next.disabled = (currentIndex === slides.length - 1);
    });

    // Update the global slide indicator
    updateSlideIndicator();
  }

  /**
   * Update the slide indicator and Back to CAD button visibility
   */
  function updateSlideIndicator() {
    const indicator = document.getElementById('slideIndicator');
    if (indicator) {
      const currentEl = indicator.querySelector('.slide-indicator-current');
      const totalEl = indicator.querySelector('.slide-indicator-total');

      if (currentEl) currentEl.textContent = currentIndex + 1;
      if (totalEl) totalEl.textContent = slides.length;
    }

    // Show/hide Back to CAD button based on current slide
    const backBtn = document.getElementById('backToCadBtn');
    if (backBtn) {
      const currentSlide = slides[currentIndex];
      const slideTitle = currentSlide ? currentSlide.dataset.title : '';
      const isExternalTab = EXTERNAL_TAB_TITLES.includes(slideTitle);

      if (isExternalTab) {
        backBtn.classList.add('visible');
      } else {
        backBtn.classList.remove('visible');
      }
    }
  }

  /**
   * Set up click event handlers for navigation
   */
  function setupClickHandlers() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;

    // Handle Back to CAD button click
    const backToCadBtn = document.getElementById('backToCadBtn');
    if (backToCadBtn) {
      backToCadBtn.addEventListener('click', (e) => {
        const dest = parseInt(backToCadBtn.getAttribute('data-goto-on-click'), 10);
        if (!Number.isNaN(dest)) {
          setActive(dest - 1);
        }
      });
    }

    canvas.addEventListener('click', (e) => {
      // Handle customer type selection flag
      const customerTypeEl = e.target.closest('[data-customer-type]');
      if (customerTypeEl && window.AppConfig) {
        window.AppConfig.customerType = customerTypeEl.getAttribute('data-customer-type');
      }

      // Handle prev/next buttons
      const prev = e.target.closest('[data-prev]');
      const next = e.target.closest('[data-next]');
      const goto = e.target.closest('[data-goto]');

      if (prev) return setActive(currentIndex - 1);
      if (next) return setActive(currentIndex + 1);

      // Handle direct goto buttons
      if (goto) {
        const target = parseInt(goto.getAttribute('data-goto'), 10);
        if (!Number.isNaN(target)) return setActive(target - 1);
      }

      // Handle conditional navigation (e.g., Create Job button with market type check)
      // Supports JSON mapping: data-goto-market-map='{"Truck Roll Only":"19","Remote Tech Only":"21"}'
      const conditionalEl = e.target.closest('[data-goto-market-map]');
      if (conditionalEl) {
        const activeSlide = slides[currentIndex];
        if (activeSlide && activeSlide.contains(conditionalEl)) {
          const marketDropdown = activeSlide.querySelector('.topbar-select');
          if (marketDropdown) {
            try {
              const marketMap = JSON.parse(conditionalEl.getAttribute('data-goto-market-map'));
              const targetSlide = parseInt(marketMap[marketDropdown.value], 10);
              if (!Number.isNaN(targetSlide)) {
                e.preventDefault();
                e.stopPropagation();
                return setActive(targetSlide - 1);
              }
            } catch (err) {
              console.warn('Invalid market map JSON:', err);
            }
          }
        }
      }

      // Legacy: Handle single conditional navigation (data-goto-if-market)
      const legacyConditionalEl = e.target.closest('[data-goto-if-market]');
      if (legacyConditionalEl) {
        const activeSlide = slides[currentIndex];
        if (activeSlide && activeSlide.contains(legacyConditionalEl)) {
          const marketValue = legacyConditionalEl.getAttribute('data-goto-if-market');
          const targetSlide = parseInt(legacyConditionalEl.getAttribute('data-goto-target'), 10);

          // Find the market type dropdown in the current slide
          const marketDropdown = activeSlide.querySelector('.topbar-select');
          if (marketDropdown && marketDropdown.value === marketValue && !Number.isNaN(targetSlide)) {
            e.preventDefault();
            e.stopPropagation();
            return setActive(targetSlide - 1);
          }
        }
      }

      // Handle click-zone navigation
      const ruleEl = e.target.closest('[data-goto-on-click]');
      if (!ruleEl) return;

      const activeSlide = slides[currentIndex];
      if (!activeSlide || !activeSlide.contains(ruleEl)) return;

      // Check if a specific trigger selector is required
      const triggerSel = ruleEl.getAttribute('data-goto-trigger');
      if (triggerSel) {
        const hit = e.target.closest(triggerSel);
        if (!hit || !ruleEl.contains(hit)) return;
      }

      const dest = parseInt(ruleEl.getAttribute('data-goto-on-click'), 10);
      if (!Number.isNaN(dest)) {
        e.preventDefault();
        e.stopPropagation();
        setActive(dest - 1);
      }
    });
  }

  /**
   * Set up keyboard event handlers for navigation
   */
  function setupKeyboardHandlers() {
    window.addEventListener('keydown', (e) => {
      const key = e.key;
      if (key === 'ArrowRight' || key === ' ' || key === 'PageDown') {
        e.preventDefault();
        setActive(currentIndex + 1);
      } else if (key === 'ArrowLeft' || key === 'PageUp') {
        e.preventDefault();
        setActive(currentIndex - 1);
      } else if (key === 'Home') {
        e.preventDefault();
        setActive(0);
      } else if (key === 'End') {
        e.preventDefault();
        setActive(slides.length - 1);
      }
    });
  }

  // Export for use by other modules
  window.SlideNavigation = {
    init: init,
    setActive: setActive,
    getCurrentIndex: function() { return currentIndex; },
    getSlideCount: function() { return slides.length; }
  };
})();
