// Flip Card Functionality - OPTIMIZED FOR MOBILE
function initFlipCards() {
    console.log('Initializing flip cards...');

    const flipCards = document.querySelectorAll('.flip-card');
    if (!flipCards.length) {
        console.warn('No flip cards found');
        return;
    }

    // Store flip card state
    const flipCardState = new Map();

    // Function to flip a specific card
    function flipCard(card, shouldFlip) {
        requestAnimationFrame(() => {
            if (shouldFlip) {
                card.classList.add('flipped');
                flipCardState.set(card, true);

                // Focus on first input after animation
                setTimeout(() => {
                    const firstInput = card.querySelector('input, select');
                    if (firstInput && firstInput.type !== 'hidden') {
                        firstInput.focus();
                    }
                }, 300);
            } else {
                card.classList.remove('flipped');
                flipCardState.set(card, false);

                // Special handling for articles card
                if (card.id === 'articles-benefit-card') {
                    const articlesSection = document.getElementById('articles-content-section');
                    if (articlesSection) {
                        articlesSection.style.display = 'none';
                    }
                }

                // Reset form if exists
                const form = card.querySelector('form');
                if (form) form.reset();
            }
        });
    }

    // Handle front card clicks
    flipCards.forEach(card => {
        const front = card.querySelector('.card-front');
        const backBtn = card.querySelector('.back-btn');

        if (front) {
            front.addEventListener('click', function (e) {
                console.log('Front clicked for card:', card.id);
                e.stopPropagation();

                // Don't flip if clicking on interactive elements
                if (e.target.closest('.hint-text') ||
                    e.target.tagName === 'BUTTON' ||
                    e.target.tagName === 'INPUT' ||
                    e.target.tagName === 'SELECT') {
                    return;
                }

                // Flip the card
                flipCard(card, true);
            });
        }

        if (backBtn) {
            backBtn.addEventListener('click', function (e) {
                console.log('Back button clicked for card:', card.id);
                e.stopPropagation();
                e.preventDefault();
                flipCard(card, false);
            });
        }
    });

    // Handle click outside to close flipped cards
    document.addEventListener('click', function (e) {
        // Don't close if clicking on a flip card element
        if (e.target.closest('.flip-card') ||
            e.target.closest('.calculator-modal') ||
            e.target.closest('.article-modal') ||
            e.target.closest('.modal-content') ||
            e.target.closest('.modal-overlay')) {
            return;
        }

        // Close all flipped cards
        const flippedCards = document.querySelectorAll('.flip-card.flipped');
        if (flippedCards.length) {
            flippedCards.forEach(card => {
                flipCard(card, false);
            });
        }
    }, true);

    console.log('Flip cards initialized successfully');
}

// Make available globally
window.initFlipCards = initFlipCards;