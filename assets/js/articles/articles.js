// Articles Section - OPTIMIZED
function initArticles() {
    console.log('Initializing articles...');

    const articlesCard = document.getElementById('articles-benefit-card');
    const articlesContentSection = document.getElementById('articles-content-section');

    if (!articlesCard || !articlesContentSection) {
        console.log('Articles elements not found');
        return;
    }

    // Sample articles (in real app, load from API)
    const sampleArticles = [
        {
            id: 1,
            title: "Abinci Mai Gina Jiki Ga Uwa Mai Ciki",
            excerpt: "Menene abinci masu muhimmanci don lafiyar ku da ta jariri a lokacin ciki?",
            category: "nutrition",
            content: `<h2>Abinci Mai Gina Jiki Ga Uwa Mai Ciki</h2>
                <p>A lokacin ciki, cin abinci mai gina jiki yana da muhimmanci ga lafiyar ku da ta jariri.</p>`,
            readTime: "5 min",
            date: "15 Janairu 2024",
            icon: "🍎",
            saved: false
        },
        {
            id: 2,
            title: "Alamun Farko na Ciki",
            excerpt: "Menene alamun da za ka iya gani a farkon ciki?",
            category: "symptoms",
            content: `<h2>Alamun Farko na Ciki</h2>
                <p>Alamun farko na ciki na iya bambanta daga mace zuwa mace, amma akwai wasu alamomin gama gari.</p>`,
            readTime: "4 min",
            date: "20 Janairu 2024",
            icon: "🤰",
            saved: false
        }
    ];

    let currentCategory = 'all';
    let currentSearch = '';

    // Load articles with requestAnimationFrame for smooth rendering
    function loadArticles() {
        requestAnimationFrame(() => {
            let filteredArticles = sampleArticles;

            if (currentCategory !== 'all') {
                filteredArticles = filteredArticles.filter(article =>
                    article.category === currentCategory
                );
                console.log(`Filtered to category "${currentCategory}": ${filteredArticles.length} articles`);
            }

            if (currentSearch.trim() !== '') {
                const searchTerm = currentSearch.toLowerCase();
                filteredArticles = filteredArticles.filter(article =>
                    article.title.toLowerCase().includes(searchTerm) ||
                    article.excerpt.toLowerCase().includes(searchTerm)
                );
            }

            updateArticlesUI(filteredArticles);
        });
    }

    function updateArticlesUI(articles) {
        const count = articles.length;
        const countElement = document.getElementById('articles-count');
        const titleElement = document.getElementById('articles-category-title');

        if (countElement) countElement.textContent = `${count} labar${count === 1 ? 'i' : 'ai'}`;

        if (titleElement) {
            const categoryNames = window.Constants ? window.Constants.getCategoryNames() : {};
            titleElement.textContent = categoryNames[currentCategory] || currentCategory;
        }

        const articlesGrid = document.getElementById('articles-grid');
        if (!articlesGrid) {
            console.error('Articles grid not found');
            return;
        }

        // Clear grid efficiently
        while (articlesGrid.firstChild) {
            articlesGrid.removeChild(articlesGrid.firstChild);
        }

        const noArticlesElement = document.getElementById('no-articles-message');
        if (count === 0) {
            if (noArticlesElement) noArticlesElement.style.display = 'block';
            return;
        }

        if (noArticlesElement) noArticlesElement.style.display = 'none';

        // Use document fragment for batch DOM insertion
        const fragment = document.createDocumentFragment();
        articles.forEach(article => {
            fragment.appendChild(createArticleCard(article));
        });
        articlesGrid.appendChild(fragment);
    }

    function createArticleCard(article) {
        const card = document.createElement('div');
        card.className = 'article-card';
        card.dataset.id = article.id;

        const categoryNames = window.Constants ? window.Constants.getCategoryNames() : {};

        card.innerHTML = `
            <div class="article-image">
                <span>${article.icon}</span>
            </div>
            <div class="article-content">
                <span class="article-category">${categoryNames[article.category] || article.category}</span>
                <h4 class="article-title">${article.title}</h4>
                <p class="article-excerpt">${article.excerpt}</p>
                <div class="article-meta">
                    <span class="article-date">
                        <span>📅</span>
                        <span>${article.date}</span>
                    </span>
                    <span class="article-read-time">
                        <span>⏱️</span>
                        <span>${article.readTime}</span>
                    </span>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            showArticleDetail(article);
        });

        return card;
    }

    function showArticleDetail(article) {
        const articleDetailModal = document.getElementById('article-detail-modal');
        if (!articleDetailModal) return;

        const categoryNames = window.Constants ? window.Constants.getCategoryNames() : {};

        // Update modal content
        const titleEl = document.getElementById('article-detail-title');
        const categoryEl = document.getElementById('article-category-badge');
        const dateEl = document.getElementById('article-date');
        const readTimeEl = document.getElementById('article-read-time');
        const bodyEl = document.getElementById('article-body');

        if (titleEl) titleEl.textContent = article.title;
        if (categoryEl) categoryEl.textContent = categoryNames[article.category] || article.category;
        if (dateEl) dateEl.textContent = `📅 ${article.date}`;
        if (readTimeEl) readTimeEl.textContent = `⏱️ ${article.readTime}`;
        if (bodyEl) bodyEl.innerHTML = article.content;

        // Show modal
        articleDetailModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeArticleDetail() {
        const articleDetailModal = document.getElementById('article-detail-modal');
        if (articleDetailModal) {
            articleDetailModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Articles card click
    const cardFront = articlesCard.querySelector('.card-front');
    if (cardFront) {
        cardFront.addEventListener('click', function (e) {
            // Don't flip if clicking on interactive elements
            if (e.target.closest('.hint-text') ||
                e.target.tagName === 'BUTTON' ||
                e.target.tagName === 'INPUT' ||
                e.target.tagName === 'SELECT') {
                return;
            }

            articlesCard.classList.add('flipped');
            articlesContentSection.style.display = 'block';
            loadArticles();
        });
    }

    // Category selection with event delegation - FIXED
    const categoryContainer = document.getElementById('articles-categories');
    if (categoryContainer) {
        categoryContainer.addEventListener('click', function (e) {
            const btn = e.target.closest('.category-btn');
            if (btn) {
                // Remove active class from all buttons
                const allButtons = document.querySelectorAll('.category-btn');
                allButtons.forEach(b => b.classList.remove('active'));

                // Add active class to clicked button
                btn.classList.add('active');

                // Update current category
                currentCategory = btn.dataset.category;
                console.log('Category changed to:', currentCategory);

                // Load articles for the selected category
                loadArticles();
            }
        });

        // Set initial active category
        const initialActiveBtn = categoryContainer.querySelector('.category-btn[data-category="all"]');
        if (initialActiveBtn) {
            initialActiveBtn.classList.add('active');
        }
    }

    // Search functionality
    const searchInput = document.getElementById('articles-search');
    const searchBtn = document.querySelector('.search-btn');

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            currentSearch = searchInput.value;
            loadArticles();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                currentSearch = searchInput.value;
                loadArticles();
            }
        });
    }

    // Article detail modal
    const backBtn = document.querySelector('.article-back-btn');
    const modalOverlay = document.getElementById('article-detail-modal')?.querySelector('.modal-overlay');

    if (backBtn) backBtn.addEventListener('click', closeArticleDetail);
    if (modalOverlay) modalOverlay.addEventListener('click', closeArticleDetail);

    // Article action buttons with event delegation
    document.addEventListener('click', function (e) {
        const actionBtn = e.target.closest('.article-action-btn');
        if (actionBtn) {
            const action = actionBtn.dataset.action;
            switch (action) {
                case 'share':
                    if (typeof showToast === 'function') {
                        showToast("Hanyar haɗin labari an kwafa shi");
                    }
                    break;
                case 'save':
                    if (typeof showToast === 'function') {
                        showToast("Labari an ajiye shi");
                    }
                    break;
                case 'speak':
                    if (typeof showToast === 'function') {
                        showToast("Ana karanta labarin...");
                    }
                    break;
            }
        }
    });

    console.log('Articles module initialized');
}

// Make available globally
window.initArticles = initArticles;