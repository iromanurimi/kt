// Pregnancy Tracker - OPTIMIZED
function initPregnancyTracker() {
    const pregnancyForm = document.getElementById('pregnancy-form');
    const modal = document.getElementById('pregnancy-results-modal');

    if (!pregnancyForm || !modal) {
        console.log('Pregnancy calculator elements not found');
        return;
    }

    const typeButtons = document.querySelectorAll('.type-btn');
    const lmpContainer = document.getElementById('lmp-input-container');
    const eddContainer = document.getElementById('edd-input-container');
    const lmpDateInput = document.getElementById('pregnancy-lmp-date');
    const eddDateInput = document.getElementById('pregnancy-edd-date');

    let currentCalculationType = 'lmp';

    // Set calculation type
    function setCalculationType(type) {
        currentCalculationType = type;

        // Update active button
        typeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });

        // Show/hide containers
        if (type === 'lmp') {
            lmpContainer?.classList.add('active');
            eddContainer?.classList.remove('active');
            if (lmpDateInput) lmpDateInput.required = true;
            if (eddDateInput) eddDateInput.required = false;
            setTimeout(() => lmpDateInput?.focus(), 100);
        } else {
            lmpContainer?.classList.remove('active');
            eddContainer?.classList.add('active');
            if (lmpDateInput) lmpDateInput.required = false;
            if (eddDateInput) eddDateInput.required = true;
            setTimeout(() => eddDateInput?.focus(), 100);
        }

        // Clear inactive input
        if (type === 'lmp' && eddDateInput) {
            eddDateInput.value = '';
        } else if (lmpDateInput) {
            lmpDateInput.value = '';
        }
    }

    // Type button event listeners
    typeButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            setCalculationType(this.dataset.type);
        });
    });

    // Set default dates
    function setDefaultDates() {
        const today = new Date();

        if (lmpDateInput) {
            lmpDateInput.max = today.toISOString().split('T')[0];
        }

        if (eddDateInput) {
            eddDateInput.min = today.toISOString().split('T')[0];
            const maxDate = new Date(today);
            maxDate.setMonth(maxDate.getMonth() + 10);
            eddDateInput.max = maxDate.toISOString().split('T')[0];
        }
    }

    // Calculate pregnancy details
    function calculatePregnancyDetails(lmp, edd, today) {
        console.log('Calculating pregnancy details:', { lmp, edd, today });

        const diffTime = today - lmp;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        console.log('Days from LMP:', diffDays);

        let weeks = Math.floor(diffDays / 7);
        const days = diffDays % 7;

        if (weeks > 40) weeks = 40;

        const dueDiffTime = edd - today;
        const dueDiffDays = Math.max(0, Math.floor(dueDiffTime / (1000 * 60 * 60 * 24)));
        const weeksLeft = Math.ceil(dueDiffDays / 7);

        let trimesterText;
        if (weeks <= 13) {
            trimesterText = "1 (Na Farko)";
        } else if (weeks <= 27) {
            trimesterText = "2 (Na Biyu)";
        } else {
            trimesterText = "3 (Na Uku)";
        }

        const month = Math.floor(weeks / 4.3) + 1;
        const progress = Math.min(100, Math.round((weeks / 40) * 100));
        const babySize = window.Constants ? window.Constants.getBabySizes()[Math.min(weeks, 39)] || "Watermelon" : "Watermelon";

        console.log('Calculation results:', { weeks, days, weeksLeft, babySize });

        return {
            lmp, edd, weeks, days, weeksLeft, daysLeft: dueDiffDays,
            trimesterText, month, progress, babySize, daysFromLMP: diffDays
        };
    }

    // Define these functions BEFORE they're used in event listener
    function calculateFromLMP(lmpValue) {
        console.log('Calculating from LMP:', lmpValue);
        const lmpDate = new Date(lmpValue);
        const today = new Date();
        const edd = new Date(lmpDate);
        edd.setDate(edd.getDate() + 280);
        console.log('LMP Date:', lmpDate, 'EDD:', edd, 'Today:', today);
        return calculatePregnancyDetails(lmpDate, edd, today);
    }

    function calculateFromEDD(eddValue) {
        console.log('Calculating from EDD:', eddValue);
        const today = new Date();
        const edd = new Date(eddValue);
        const lmp = new Date(edd);
        lmp.setDate(lmp.getDate() - 280);
        console.log('EDD Date:', edd, 'LMP:', lmp, 'Today:', today);
        return calculatePregnancyDetails(lmp, edd, today);
    }

    function updatePregnancyModal(results) {
        console.log('Updating modal with results:', results);

        const updateElement = (id, text) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = text;
                console.log(`Updated ${id}: ${text}`);
            } else {
                console.warn(`Element ${id} not found`);
            }
        };

        updateElement('current-week', results.weeks);
        updateElement('current-day', results.days);
        updateElement('baby-size-text', `Girman jariri: ${results.babySize}`);
        updateElement('due-date-text', formatDateHausa ? formatDateHausa(results.edd) : results.edd.toLocaleDateString());
        updateElement('weeks-left-text', `Saura makonni: ${results.weeksLeft}`);
        updateElement('week-display', `${results.weeks} (Ki ke a yanzu)`);
        updateElement('month-display', `${results.month} (Ki ke a yanzu)`);
        updateElement('trimester-display', results.trimesterText);

        const progressBar = document.getElementById('pregnancy-progress');
        if (progressBar) {
            requestAnimationFrame(() => {
                progressBar.style.width = `${results.progress}%`;
                console.log('Progress bar set to:', `${results.progress}%`);

                if (results.weeks <= 13) {
                    progressBar.style.background = 'linear-gradient(90deg, #00aeef, #4dc9ff)';
                } else if (results.weeks <= 27) {
                    progressBar.style.background = 'linear-gradient(90deg, #fb923c, #fdba74)';
                } else {
                    progressBar.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
                }
            });
        }
    }

    // Form submission
    pregnancyForm.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log('Pregnancy form submitted, type:', currentCalculationType);

        const submitBtn = this.querySelector('.calculate-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Ana lissafawa...';
        submitBtn.disabled = true;

        let results;
        let validationError = null;

        if (currentCalculationType === 'lmp') {
            const lmpValue = lmpDateInput.value;
            console.log('LMP input value:', lmpValue);
            const lmpDate = new Date(lmpValue);

            if (isNaN(lmpDate.getTime()) || lmpDate > new Date()) {
                validationError = "Ranar da ka shigar ba ta da inganci";
            } else {
                const oneYearAgo = new Date();
                oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                if (lmpDate < oneYearAgo) {
                    validationError = "Ranar haila ta wuce shekara guda. Da fatan za a shigar da wadda ta kusa";
                } else {
                    results = calculateFromLMP(lmpValue);
                }
            }
        } else {
            const eddValue = eddDateInput.value;
            console.log('EDD input value:', eddValue);
            const eddDate = new Date(eddValue);

            if (isNaN(eddDate.getTime())) {
                validationError = "Ranar da ka shigar ba ta da inganci";
            } else {
                const twoWeeksAgo = new Date();
                twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
                if (eddDate < twoWeeksAgo) {
                    validationError = "Ranar haihuwa ta wuce makonni biyu. Da fatan za a shigar da wadda ta dace";
                } else {
                    results = calculateFromEDD(eddValue);
                }
            }
        }

        if (validationError) {
            console.log('Validation error:', validationError);
            showToast(validationError);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }

        console.log('Calculation results:', results);

        if (results.weeks < 0) {
            showToast("Ba zai yiwu ciki ya kasance kafin ranar haila ba");
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }

        // Show results
        requestAnimationFrame(() => {
            updatePregnancyModal(results);
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            console.log('Modal displayed');

            const babyCard = document.getElementById('baby-tracking-card');
            if (babyCard) {
                babyCard.classList.remove('flipped');
                console.log('Baby card flipped back');
            }

            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });

    // Modal close
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        console.log('Modal closed');
    }

    const modalClose = modal.querySelector('.modal-close');
    const modalOverlay = modal.querySelector('.modal-overlay');

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // Save and share


    // Initialize
    function initialize() {
        console.log('Initializing pregnancy calculator');
        setCalculationType('lmp');
        setDefaultDates();

        // Load saved data
        try {
            const savedData = localStorage.getItem('pregnancy_tracking_data');
            if (savedData) {
                const data = JSON.parse(savedData);
                if (data.calculationType) setCalculationType(data.calculationType);
                if (data.lmpDate && lmpDateInput) lmpDateInput.value = data.lmpDate;
                if (data.eddDate && eddDateInput) eddDateInput.value = data.eddDate;
            }
        } catch (e) {
            console.error('Error loading saved pregnancy data:', e);
        }
    }

    initialize();
    console.log('Pregnancy calculator initialized');
}

// Make available globally
window.initPregnancyTracker = initPregnancyTracker;