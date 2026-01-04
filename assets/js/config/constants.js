// Constants - OPTIMIZED
const Constants = {
    getBabySizes: function () {
        if (!this._babySizes) {
            this._babySizes = [
                "Kwayoyin halitta", "Kankana", "Kankana", "Blueberry", "Blueberry",
                "Cherry", "Cherry", "Fig", "Fig", "Lime",
                "Lime", "Lemon", "Lemon", "Apple", "Apple",
                "Avocado", "Avocado", "Pear", "Pear", "Sweet Potato",
                "Sweet Potato", "Mango", "Mango", "Banana", "Banana",
                "Carrot", "Carrot", "Papaya", "Papaya", "Grapefruit",
                "Grapefruit", "Cantaloupe", "Cantaloupe", "Cauliflower", "Cauliflower",
                "Zucchini", "Zucchini", "Eggplant", "Eggplant", "Watermelon"
            ];
        }
        return this._babySizes;
    },

    getCategoryNames: function () {
        if (!this._categoryNames) {
            this._categoryNames = {
                'all': 'Duka Labarai',
                'pregnancy': 'Labaran Ciki',
                'baby-care': 'Kula da Jariri',
                'health': 'Lafiya',
                'nutrition': 'Abinci mai gina jiki',
                'postpartum': 'Bayan Haihuwa',
                'tips': 'Shawarwari',
                'symptoms': 'Alamun Ciki'
            };
        }
        return this._categoryNames;
    }
};

// Make available globally
window.Constants = Constants;