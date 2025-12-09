/**
 * Configuration file for Movie Website
 * Contains API endpoints and app settings
 */

const CONFIG = {
    // API Configuration
    API: {
        BASE_URL: 'https://phim.nguonc.com/api/film'// Thay đổi URL API của bạn tại đây
    },

    // App Settings
    APP: {
        NAME: 'Xem Phim Online',
        VERSION: '1.0.0',
        ITEMS_PER_PAGE: 20,
        DEFAULT_LANGUAGE: 'vi'
    },

    // Player Settings
    PLAYER: {
        AUTOPLAY: false,
        VOLUME: 0.8,
        CONTROLS: true
    },

    // Cache Settings (for localStorage)
    CACHE: {
        ENABLED: true,
        DURATION: 3600000, // 1 hour in milliseconds
        PREFIX: 'movie_cache_'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
