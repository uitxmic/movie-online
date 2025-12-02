/**
 * Movie Model - Handles all movie data operations
 * Communicates with the API and manages data caching
 */

class MovieModel {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = CONFIG.CACHE.DURATION;
    }

    /**
     * Get movie details by ID or slug
     * @param {string} movieId - Movie ID or slug
     * @returns {Promise<Object>} Movie data
     */
    async getMovieDetail(movieId) {
        const cacheKey = `${CONFIG.CACHE.PREFIX}movie_${movieId}`;
        
        // Check cache first
        if (CONFIG.CACHE.ENABLED) {
            const cached = this._getFromCache(cacheKey);
            if (cached) return cached;
        }

        try {
            const url = `${CONFIG.API.BASE_URL}/${movieId}`;
            console.log('Fetching from:', url); // Debug log
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Check API response status
            if (data.status !== 'success') {
                throw new Error('API returned error status');
            }
            
            // Cache the result
            if (CONFIG.CACHE.ENABLED) {
                this._setCache(cacheKey, data.movie);
            }
            
            return data.movie;
        } catch (error) {
            console.error('Error fetching movie details:', error);
            throw error;
        }
    }

    /**
     * Cache management methods
     */
    _getFromCache(key) {
        const item = localStorage.getItem(key);
        if (!item) return null;

        try {
            const parsed = JSON.parse(item);
            const now = Date.now();
            
            if (now - parsed.timestamp > this.cacheTimeout) {
                localStorage.removeItem(key);
                return null;
            }
            
            return parsed.data;
        } catch (error) {
            console.error('Error parsing cache:', error);
            localStorage.removeItem(key);
            return null;
        }
    }

    _setCache(key, data) {
        try {
            const item = {
                data: data,
                timestamp: Date.now()
            };
            localStorage.setItem(key, JSON.stringify(item));
        } catch (error) {
            console.error('Error setting cache:', error);
        }
    }

    /**
     * Clear all cached data
     */
    clearCache() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(CONFIG.CACHE.PREFIX)) {
                localStorage.removeItem(key);
            }
        });
    }
}

// Create singleton instance
const movieModel = new MovieModel();