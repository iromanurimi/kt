// Ovulation Calculator - OPTIMIZED
function initOvulationCalculator() {
    const ovulationForm = document.getElementById('ovulation-form');
    const modal = document.getElementById('ovulation-results-modal');

    if (!ovulationForm || !modal) return;

    // Set default date
    const lmpInput = document.getElementById('lmp-date');
    const cycleSelect = document.getElementById('cycle-length');

    if (lmpInput) {
        const today = new Date();
        const defaultDate = new Date(today);
        defaultDate.setDate(today.getDate() - 14);

        lmpInput.value = defaultDate.toISOString().split('T')[0];
        lmpInput.max = today.toISOString().split('T')[0];
    }

    if (cycleSelect) {
        cycleSelect.value = '28'; // More realistic default
    }

    // Calculate ovulation dates
    function calculateOvulationDates(lmpDate, cycleLength) {
        const ovulationDay = new Date(lmpDate);
        ovulationDay.setDate(ovulationDay.getDate() + (cycleLength - 14));

        const fertileStart = new Date(ovulationDay);
        fertileStart.setDate(fertileStart.getDate() - 3);

        const fertileEnd = new Date(ovulationDay);
        fertileEnd.setDate(fertileEnd.getDate() + 3);

        const safeStart = new Date(lmpDate);
        safeStart.setDate(safeStart.getDate() + 1);

        const safeEnd = new Date(fertileStart);
        safeEnd.setDate(safeEnd.getDate() - 1);

        return {
            ovulationDay,
            fertileStart,
            fertileEnd,
            safeStart,
            safeEnd
        };
    }

    // Form submission
    ovulationForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const lmpDate = new Date(lmpInput.value);
        const cycleLength = parseInt(cycleSelect.value);

        // Validate
        if (isNaN(lmpDate.getTime()) || lmpDate > new Date()) {
            showToast("Ranar da ka shigar ba ta da inganci");
            return;
        }

        if (cycleLength < 21 || cycleLength > 45) {
            showToast("Tsawon lokacin haila bai kamata ya kasance ƙasa da kwanaki 21 ko fiye da 45 ba");
            return;
        }

        // Calculate
        const dates = calculateOvulationDates(lmpDate, cycleLength);

        // Update modal
        document.getElementById('modal-ovulation-day').textContent =
            formatDateHausa(dates.ovulationDay, 'short');

        document.getElementById('modal-fertile-window').textContent =
            `${formatDateHausa(dates.fertileStart, 'short')} - ${formatDateHausa(dates.fertileEnd, 'short')}`;

        const safePeriodEl = document.getElementById('modal-safe-period');
        if (safePeriodEl) {
            safePeriodEl.textContent = `${formatDateHausa(dates.safeStart, 'short')} - ${formatDateHausa(dates.safeEnd, 'short')}`;
        }

        document.getElementById('results-date-range').textContent =
            `Lissafi daga ${formatDateHausa(lmpDate, 'short')} zuwa ${formatDateHausa(dates.ovulationDay, 'short')}`;

        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Flip card back
        const ovulationCard = document.getElementById('ovulation-benefit-card');
        if (ovulationCard) {
            ovulationCard.classList.remove('flipped');
        }
    });

    // Modal close
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    const modalClose = modal.querySelector('.modal-close');
    const modalOverlay = modal.querySelector('.modal-overlay');

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);


}

// Make available globally
window.initOvulationCalculator = initOvulationCalculator;