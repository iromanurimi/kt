// Date Utility - OPTIMIZED
(function () {
    function formatDateHausa(date, format = 'short') {
        if (!date || isNaN(date.getTime())) return '';

        const options = format === 'long' ? {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        } : {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        };

        // Cache formatted dates
        const cacheKey = `${date.getTime()}-${format}`;
        if (!this._dateCache) this._dateCache = new Map();
        if (this._dateCache.has(cacheKey)) {
            return this._dateCache.get(cacheKey);
        }

        const formatted = date.toLocaleDateString('ha-NG', options);
        this._dateCache.set(cacheKey, formatted);
        return formatted;
    }

    // Make available globally
    window.formatDateHausa = formatDateHausa;
})();