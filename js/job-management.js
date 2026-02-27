/* =========================================================
   JOB MANAGEMENT JavaScript
   Handles expandable job rows and action menus
   ========================================================= */

(function() {
  'use strict';

  function initJobManagement() {
    const jobSlide = document.querySelector('[data-title="JobManagement"]');
    if (!jobSlide) return;

    // Get all clickable job rows
    const jobRows = jobSlide.querySelectorAll('.job-row.clickable-row');

    // Handle row click to expand/collapse details
    jobRows.forEach(row => {
      row.addEventListener('click', (e) => {
        // Don't toggle if clicking on dots button or action menu
        if (e.target.closest('.dots-btn') || e.target.closest('.action-menu')) {
          return;
        }

        const jobId = row.getAttribute('data-job-id');
        const details = jobSlide.querySelector(`#job-details-${jobId}`);

        if (details) {
          // Close all other details first
          jobSlide.querySelectorAll('.job-details.active').forEach(d => {
            if (d.id !== `job-details-${jobId}`) {
              d.classList.remove('active');
            }
          });

          // Remove expanded class from all rows
          jobSlide.querySelectorAll('.job-row.expanded').forEach(r => {
            if (r !== row) {
              r.classList.remove('expanded');
            }
          });

          // Toggle current details
          details.classList.toggle('active');
          row.classList.toggle('expanded');
        }
      });
    });

    // Handle dots button click to show action menu
    const dotsButtons = jobSlide.querySelectorAll('.dots-btn');
    dotsButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();

        const menu = btn.nextElementSibling;
        if (!menu || !menu.classList.contains('action-menu')) return;

        // Close all other menus first
        jobSlide.querySelectorAll('.action-menu.active').forEach(m => {
          if (m !== menu) {
            m.classList.remove('active');
          }
        });

        // Toggle current menu
        menu.classList.toggle('active');
      });
    });

    // Handle action menu item click
    const actionMenuItems = jobSlide.querySelectorAll('.action-menu div');
    actionMenuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const menu = item.parentElement;
        menu.classList.remove('active');
        // Action would be handled here (e.g., Edit, Reschedule, etc.)
      });
    });

    // Close menus when clicking elsewhere on the slide
    jobSlide.addEventListener('click', (e) => {
      if (!e.target.closest('.dots-btn') && !e.target.closest('.action-menu')) {
        jobSlide.querySelectorAll('.action-menu.active').forEach(m => {
          m.classList.remove('active');
        });
      }
    });

    // Close menus on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        jobSlide.querySelectorAll('.action-menu.active').forEach(m => {
          m.classList.remove('active');
        });
      }
    });

    // Handle filter buttons in activity section
    const filterContainers = jobSlide.querySelectorAll('.filter-buttons');
    filterContainers.forEach(container => {
      const buttons = container.querySelectorAll('.btn-filter');
      buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          // Remove active from siblings
          buttons.forEach(b => b.classList.remove('active'));
          // Add active to clicked button
          btn.classList.add('active');
        });
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initJobManagement);
  } else {
    initJobManagement();
  }
})();
