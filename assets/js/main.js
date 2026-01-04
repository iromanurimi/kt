// Main Application Entry Point - OPTIMIZED VERSION
document.addEventListener('DOMContentLoaded', function () {
    // ============================================
    // PERFORMANCE OPTIMIZATION SETUP
    // ============================================
    // Prevent multiple initializations
    if (window.appInitialized) return;
    window.appInitialized = true;

    // Performance monitoring
    const perf = {
        start: (name) => performance.mark(`${name}-start`),
        end: (name) => {
            performance.mark(`${name}-end`);
            performance.measure(name, `${name}-start`, `${name}-end`);
            const duration = performance.getEntriesByName(name)[0].duration;
            if (duration > 50) console.warn(`Slow: ${name} took ${duration.toFixed(2)}ms`);
        }
    };

    // Throttle function for expensive operations
    function throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // DOM Element Cache
    const DOMCache = {
        _cache: new Map(),

        get: function (id) {
            if (!this._cache.has(id)) {
                const el = document.getElementById(id);
                if (el) this._cache.set(id, el);
                return el;
            }
            return this._cache.get(id);
        },

        query: function (selector) {
            if (!this._cache.has(selector)) {
                const el = document.querySelector(selector);
                if (el) this._cache.set(selector, el);
                return el;
            }
            return this._cache.get(selector);
        },

        queryAll: function (selector) {
            return document.querySelectorAll(selector);
        },

        clear: function () {
            this._cache.clear();
        }
    };

    // ============================================
    // INITIALIZE APP WITH ERROR HANDLING
    // ============================================
    function initApp() {
        try {
            console.log('Initializing Ciki da Raino App (Optimized)...');

            // Initialize core modules
            perf.start('initTheme');
            initTheme();
            perf.end('initTheme');

            perf.start('initFlipCards');
            initFlipCards();
            perf.end('initFlipCards');

            perf.start('initOvulationCalculator');
            initOvulationCalculator();
            perf.end('initOvulationCalculator');

            perf.start('initPregnancyTracker');
            initPregnancyTracker();
            perf.end('initPregnancyTracker');

            perf.start('initArticles');
            initArticles();
            perf.end('initArticles');

            perf.start('initPageNavigation');
            initPageNavigation();
            perf.end('initPageNavigation');

            // Initialize chatbot only when chat page is loaded
            if (window.location.hash === '#chat' || document.querySelector('.nav-item[data-page="chat"].active')) {
                perf.start('initChatbot');
                initChatbot();
                perf.end('initChatbot');
            }

            console.log('App initialized successfully!');

            // Clean up on page unload
            window.addEventListener('beforeunload', function () {
                DOMCache.clear();
                window.appInitialized = false;
            });

        } catch (error) {
            console.error('App initialization failed:', error);
            showToast("An sami matsala. Da fatan za a sake kunnawa shafin.", 5000);
        }
    }

    // Start the app with a small delay for better UX
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        // DOM already loaded, run immediately
        setTimeout(initApp, 100);
    }
});

// Performance CSS injection
(function () {
    const performanceCSS = `
    /* Add these styles to your CSS file */
    .flip-card, .article-card, .modal-content {
        transform: translateZ(0);
        backface-visibility: hidden;
        will-change: transform;
    }

    /* Prevent text selection during interactions */
    .flip-card * {
        -webkit-user-select: none;
        user-select: none;
    }

    /* Allow text selection only in content areas */
    .article-content, .modal-content, .card-back * {
        -webkit-user-select: text;
        user-select: text;
    }

    /* Smooth scrolling for mobile */
    html {
        -webkit-overflow-scrolling: touch;
    }

    /* Optimize animations */
    .flip-card-inner {
        transform-style: preserve-3d;
    }

    /* Reduce paint areas */
    .flip-card {
        isolation: isolate;
    }
    `;

    const style = document.createElement('style');
    style.textContent = performanceCSS;
    document.head.appendChild(style);
})();