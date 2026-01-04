// Theme Management - OPTIMIZED
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Use classList.toggle with animation frame for smooth transition
    function toggleTheme() {
        requestAnimationFrame(() => {
            const isDark = document.body.classList.contains('dark-mode');
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', isDark ? 'light' : 'dark');

            // Update both toggles if they exist
            const themeToggleChat = document.getElementById('theme-toggle-chat');
            if (themeToggleChat) {
                themeToggleChat.classList.toggle('active', !isDark);
            }
            themeToggle.classList.toggle('active', !isDark);
        });
    }

    // Single event handler for both toggles
    function handleThemeToggle(e) {
        e.stopPropagation();
        toggleTheme();
        showToast(document.body.classList.contains('dark-mode') ?
            "Yanayin duhu" : "Yanayin haske", 2000);
    }

    themeToggle.addEventListener('click', handleThemeToggle);

    const themeToggleChat = document.getElementById('theme-toggle-chat');
    if (themeToggleChat) {
        themeToggleChat.addEventListener('click', handleThemeToggle);
    }

    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.classList.add('active');
        if (themeToggleChat) themeToggleChat.classList.add('active');
    }
}

// Make available globally
window.initTheme = initTheme;