(function() {
  'use strict';
  function init() {
    var btn = document.getElementById('incomingCallBtn');
    var banner = document.getElementById('connectedBanner');
    var popup = document.getElementById('callPopup');
    var closeBtn = document.getElementById('callPopupClose');

    var nvBtn = document.getElementById('notVerifiedCallBtn');
    var nvPopup = document.getElementById('notVerifiedPopup');
    var nvCloseBtn = document.getElementById('notVerifiedPopupClose');

    var btnsContainer = document.querySelector('.incoming-call-btns');

    if (!btn || !banner || !popup || !nvBtn || !nvPopup) return;

    btn.addEventListener('click', function() {
      banner.style.display = '';
      popup.style.display = '';
      btnsContainer.style.display = 'none';
    });

    nvBtn.addEventListener('click', function() {
      banner.style.display = '';
      nvPopup.style.display = '';
      btnsContainer.style.display = 'none';
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        popup.style.display = 'none';
      });
    }

    if (nvCloseBtn) {
      nvCloseBtn.addEventListener('click', function() {
        nvPopup.style.display = 'none';
      });
    }

    // Reset slide 1 state when navigating back to it
    var slide1 = document.querySelector('.slide[data-title="LoggedIn"]');
    if (slide1) {
      new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
          if (m.attributeName === 'class' && slide1.classList.contains('active')) {
            btnsContainer.style.display = '';
            banner.style.display = 'none';
            popup.style.display = 'none';
            nvPopup.style.display = 'none';
          }
        });
      }).observe(slide1, { attributes: true, attributeFilter: ['class'] });
    }
  }
  window.IncomingCall = { init: init };
})();
