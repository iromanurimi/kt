// Toast Utility - OPTIMIZED
(function () {
    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const showToast = debounce(function (message, duration = 3000) {
        const toast = document.getElementById('error-toast');
        if (!toast) return;

        requestAnimationFrame(() => {
            const messageEl = toast.querySelector('.toast-message');
            if (messageEl) {
                messageEl.textContent = message;
            }

            toast.style.display = 'block';

            // Use requestAnimationFrame for better performance
            const startTime = performance.now();
            function fadeOut(currentTime) {
                const elapsed = currentTime - startTime;
                if (elapsed >= duration) {
                    toast.style.display = 'none';
                } else {
                    requestAnimationFrame(fadeOut);
                }
            }
            requestAnimationFrame(fadeOut);
        });
    }, 100);

    // Make available globally
    window.showToast = showToast;
})();