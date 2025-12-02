/**
 * Movie Controller - Xử lý logic và hiển thị
 * Đã tối ưu cho Smart TV (Focus handling, Remote navigation)
 */
class MovieController {
    constructor() {
        this.model = movieModel; // Đảm bảo movieModel đã được load từ file khác
        this.currentMovie = null;
    }

    /**
     * Khởi tạo Controller
     */
    init() {
        console.log('MovieController initialized');
        this.checkRoute();
        this.setupEventListeners();
    }

    /**
     * Kiểm tra URL để biết đang ở trang nào
     */
/**
     * Check current route and load appropriate content
     */
    checkRoute() {
        const path = window.location.pathname;
        const params = new URLSearchParams(window.location.search);

        console.log("Current path:", path); // Debug để xem đường dẫn thực tế

        // SỬA ĐỔI: Kiểm tra linh hoạt hơn (chấp nhận cả /movie và /movie.html)
        // Dùng indexOf > -1 thay vì includes để an toàn hơn cho TV đời cũ
        
        // 1. Trang Xem phim (Player)
        if (path.indexOf('/watch') !== -1 || path.indexOf('watch.html') !== -1) {
            const movieId = params.get('id');
            const episode = params.get('ep');
            if (movieId) {
                this.loadPlayer(movieId, episode);
            }
        } 
        // 2. Trang Chi tiết phim
        else if (path.indexOf('/movie') !== -1 || path.indexOf('movie.html') !== -1) {
            const movieId = params.get('id');
            if (movieId) {
                this.loadMovieDetails(movieId);
            }
        }
        // 3. Trang chủ (Mặc định nếu không khớp cái nào ở trên)
        else {
            // Gọi hàm load trang chủ (bạn cần viết thêm hàm này nếu chưa có)
            // this.loadHome(); 
        }
    }

    /**
     * Thiết lập các sự kiện (Remote control)
     */
    setupEventListeners() {
        // Hỗ trợ điều hướng bằng bàn phím (Giả lập Remote TV)
        document.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e);
        });

        // Xử lý nút Back của trình duyệt
        window.addEventListener('popstate', () => {
            this.checkRoute();
        });
    }

    /**
     * Logic điều hướng 4 chiều cho Remote TV
     */
    handleKeyNavigation(e) {
        // Lấy tất cả các phần tử có thể focus
        const selector = 'a, button, [tabindex]:not([tabindex="-1"])';
        const focusableElements = Array.from(document.querySelectorAll(selector));
        const activeElement = document.activeElement;
        const currentIndex = focusableElements.indexOf(activeElement);

        // Nếu chưa có gì được focus, focus vào cái đầu tiên
        if (currentIndex === -1 && focusableElements.length > 0) {
            focusableElements[0].focus();
            return;
        }

        // Xác định số lượng cột dựa trên chiều rộng màn hình (để tính toán phím Lên/Xuống)
        // Trên TV màn hình rộng thường là 4-5 item/hàng, mobile là 1-2
        let itemsPerRow = 1;
        if (window.innerWidth >= 1024) itemsPerRow = 5; // Desktop/TV to
        else if (window.innerWidth >= 768) itemsPerRow = 3; // Tablet
        
        switch(e.key) {
            case 'ArrowRight':
                e.preventDefault();
                if (currentIndex < focusableElements.length - 1) {
                    focusableElements[currentIndex + 1].focus();
                }
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (currentIndex > 0) {
                    focusableElements[currentIndex - 1].focus();
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                // Nhảy xuống dòng dưới
                const nextIndex = Math.min(currentIndex + itemsPerRow, focusableElements.length - 1);
                // Nếu logic +row bị lỗi (do layout không đều), fallback về +1
                if (focusableElements[nextIndex]) focusableElements[nextIndex].focus();
                else if (currentIndex < focusableElements.length - 1) focusableElements[currentIndex + 1].focus();
                break;
            case 'ArrowUp':
                e.preventDefault();
                // Nhảy lên dòng trên
                const prevIndex = Math.max(currentIndex - itemsPerRow, 0);
                if (focusableElements[prevIndex]) focusableElements[prevIndex].focus();
                else if (currentIndex > 0) focusableElements[currentIndex - 1].focus();
                break;
            case 'Enter':
                // Mặc định Enter sẽ kích hoạt click, nhưng một số TV browser cần ép buộc
                activeElement.click();
                break;
            case 'Back': 
            case 'Escape':
            case 'Backspace': 
                // Xử lý nút Back trên Remote (Samsung Tizen thường dùng code 10009 hoặc Backspace)
                window.history.back();
                break;
        }
    }

    /**
     * Tải trang Chi tiết phim
     */
    async loadMovieDetails(movieId) {
        const container = document.getElementById('movieDetail') || document.querySelector('.container');
        if (!container) return;

        container.innerHTML = '<div class="loading">Đang tải thông tin phim...</div>';

        try {
            const movie = await this.model.getMovieDetail(movieId);
            this.currentMovie = movie;
            container.innerHTML = this._renderMovieDetail(movie);
            
            // QUAN TRỌNG: Auto focus vào nút "Xem Ngay" để tiện bấm play luôn
            setTimeout(() => {
                const watchBtn = document.querySelector('.btn-watch');
                if (watchBtn) watchBtn.focus();
            }, 100);

        } catch (error) {
            console.error(error);
            this._renderError(container, error.message);
        }
    }

    /**
     * Tải trang Xem phim (Player)
     */
    async loadPlayer(movieId, episodeSlug) {
        const container = document.getElementById('player') || document.querySelector('.container');
        if (!container) return;

        container.innerHTML = '<div class="loading">Đang tải trình phát...</div>';

        try {
            const movie = await this.model.getMovieDetail(movieId);
            this.currentMovie = movie;

            // Tìm URL embed của tập phim
            let embedUrl = null;
            let currentEpName = '';

            if (movie.episodes) {
                for (const server of movie.episodes) {
                    const ep = server.items.find(e => e.slug === episodeSlug);
                    if (ep) {
                        embedUrl = ep.embed;
                        currentEpName = ep.name;
                        break;
                    }
                }
            }

            if (embedUrl) {
                container.innerHTML = this._renderPlayer(movie, embedUrl, currentEpName, episodeSlug);
                
                // Focus vào khung player hoặc nút quay lại
                // Lưu ý: Iframe thường sẽ cướp focus, cần cẩn thận
                const playerFrame = document.querySelector('iframe');
                if(playerFrame) playerFrame.focus();

            } else {
                this._renderError(container, 'Không tìm thấy tập phim này.');
            }
        } catch (error) {
            console.error(error);
            this._renderError(container, error.message);
        }
    }

    /**
     * Render Giao diện Chi tiết phim
     */
    _renderMovieDetail(movie) {
        const categories = this._formatCategories(movie.category);
        
        return `
            <div class="movie-detail">
                <div class="movie-poster">
                    <img src="${movie.poster_url || movie.thumb_url}" alt="${movie.name}">
                    <div class="watch-button-container">
                        ${this._renderWatchButton(movie)}
                    </div>
                </div>
                
                <div class="movie-info-detail">
                    <a href="index.html" class="btn-home" style="font-size: 1rem; padding: 5px 10px; margin-bottom: 10px;">← Trang chủ</a>
                    <h1>${movie.name}</h1>
                    <p class="original-name">${movie.original_name || ''}</p>
                    
                    <div class="movie-meta-detail">
                        <span class="quality">${movie.quality || 'HD'}</span>
                        <span class="language">${movie.language || 'Vietsub'}</span>
                        <span class="time">${movie.time || 'N/A'}</span>
                    </div>

                    <div class="movie-description">
                        <h2>Nội dung</h2>
                        <p>${movie.description || 'Đang cập nhật...'}</p>
                    </div>

                    <div class="movie-metadata">
                        ${movie.director ? `<p><strong>Đạo diễn:</strong> ${movie.director}</p>` : ''}
                        ${movie.casts ? `<p><strong>Diễn viên:</strong> ${movie.casts}</p>` : ''}
                        ${categories ? `<p><strong>Thể loại:</strong> ${categories}</p>` : ''}
                    </div>

                    <div class="episodes-section">
                        <h2>Danh sách tập</h2>
                        ${this._renderEpisodes(movie)}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render Giao diện Player
     */
    _renderPlayer(movie, embedUrl, currentEpName, currentEpSlug) {
        return `
            <div class="player-container">
                <div class="player-wrapper">
                    <iframe src="${embedUrl}" 
                            frameborder="0" 
                            allowfullscreen
                            allow="autoplay; encrypted-media"
                            class="video-player">
                    </iframe>
                </div>

                <div class="player-info">
                    <h1>${movie.name} - Tập ${currentEpName}</h1>
                    <div class="player-controls">
                        <a href="movie.html?id=${movie.slug}" class="btn-home">← Thông tin phim</a>
                    </div>
                </div>

                <div class="episodes-section">
                    <h2>Chọn tập khác</h2>
                    ${this._renderEpisodes(movie, currentEpSlug)}
                </div>
            </div>
        `;
    }

    /**
     * Render nút Xem ngay (Lấy tập đầu tiên)
     */
    _renderWatchButton(movie) {
        if (!movie.episodes || movie.episodes.length === 0) {
            return '<p class="no-episodes">Phim đang cập nhật tập mới</p>';
        }
        // Mặc định lấy tập đầu tiên của server đầu tiên
        const firstEp = movie.episodes[0].items[0];
        return `
            <a href="watch.html?id=${movie.slug}&ep=${firstEp.slug}" class="btn-watch">
                ▶ Xem Ngay
            </a>
        `;
    }

    /**
     * Render Danh sách tập (Hỗ trợ nhiều server + Grid layout)
     * @param {Object} movie 
     * @param {String} currentSlug - Slug tập đang xem (để highlight)
     */
    _renderEpisodes(movie, currentSlug = null) {
        if (!movie.episodes || movie.episodes.length === 0) return '';

        let html = '';
        
        movie.episodes.forEach(server => {
            html += `<div class="server-group">
                        <h3>Server: ${server.server_name}</h3>
                        <div class="episode-list">`;
            
            server.items.forEach(item => {
                // Kiểm tra xem đây có phải tập đang xem không
                const isActive = (item.slug === currentSlug) ? 'active' : '';
                
                html += `
                    <a href="watch.html?id=${movie.slug}&ep=${item.slug}" 
                       class="episode-btn ${isActive}"
                       tabindex="0">
                       ${item.name}
                    </a>
                `;
            });

            html += `   </div>
                     </div>`;
        });

        return html;
    }

    /**
     * Xử lý lỗi hiển thị
     */
    _renderError(container, message) {
        container.innerHTML = `
            <div class="error">
                <h2>⚠️ Đã xảy ra lỗi</h2>
                <p>${message}</p>
                <a href="index.html" class="btn">Về trang chủ</a>
            </div>
        `;
    }

    /**
     * Helper: Format category object thành string
     */
    _formatCategories(categoryObj) {
        if (!categoryObj) return '';
        const genres = [];
        // Duyệt qua các key của object category (1, 2, 3...)
        Object.keys(categoryObj).forEach(key => {
            const group = categoryObj[key];
            if (group.group.name === "Thể loại" && group.list) {
                group.list.forEach(i => genres.push(i.name));
            }
        });
        return genres.join(', ');
    }
}

// Khởi chạy
document.addEventListener('DOMContentLoaded', () => {
    // Giả sử class MovieModel đã được định nghĩa ở file khác
    // window.movieModel = new MovieModel(); 
    window.movieController = new MovieController();
    window.movieController.init();
});