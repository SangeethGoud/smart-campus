// ==========================================
// DARK THEME - Smart Campus
// ==========================================

(function() {
    'use strict';

    // Apply dark theme on page load
    function init() {
        // Ensure dark theme is always applied
        document.body.classList.add('theme-dark');
        document.body.style.background = 'linear-gradient(180deg, #06112a 0%, #071428 100%)';
        document.body.style.color = '#e6eefc';
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
