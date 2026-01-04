// Page Navigation System - OPTIMIZED
function initPageNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const mainContent = document.querySelector('.main-content');

    if (!navItems.length || !mainContent) return;

    // Use event delegation for navigation
    document.addEventListener('click', function (e) {
        const navItem = e.target.closest('.nav-item');
        if (navItem) {
            e.preventDefault();
            const pageId = navItem.dataset.page;
            switchPage(pageId);
        }

        // Chat back button
        if (e.target.closest('#chat-back-btn')) {
            switchPage('home');
        }
    });

    function switchPage(pageId) {
        requestAnimationFrame(() => {
            // Update navigation
            navItems.forEach(item => {
                item.classList.toggle('active', item.dataset.page === pageId);
            });

            if (pageId === 'chat') {
                mainContent.style.display = 'none';
                document.body.style.overflow = 'hidden';
            } else {
                mainContent.style.display = 'block';
                document.body.style.overflow = 'auto';

                if (pageId === 'home') {
                    window.history.pushState({ page: 'home' }, '', '#');
                } else {
                    window.history.pushState({ page: pageId }, '', `#${pageId}`);
                }
            }
        });
    }

    // Handle browser navigation
    window.addEventListener('popstate', function () {
        const hash = window.location.hash.substring(1) || 'home';
        switchPage(hash);
    });

    // Initialize from URL
    const hash = window.location.hash.substring(1);
    switchPage(hash || 'home');
}

// Make available globally
window.initPageNavigation = initPageNavigation;