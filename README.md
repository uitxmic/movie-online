# Website Xem Phim Online

Website xem phim đơn giản, nhỏ gọn, tối ưu cho Smart TV Samsung đời cũ và các trình duyệt web thông thường.

## 🎯 Tính năng

- ✅ Xem chi tiết thông tin phim
- ✅ Phát video trực tiếp từ embed player
- ✅ Hỗ trợ điều hướng bằng bàn phím (TV Remote)
- ✅ Cache dữ liệu để tăng tốc độ load
- ✅ Responsive design
- ✅ Không cần build tool, chạy trực tiếp

## 🏗️ Cấu trúc dự án (MVC Pattern)

```
WebsiteMovie/
├── index.html              # Trang chủ
├── movie.html              # Trang chi tiết phim
├── watch.html              # Trang xem phim
├── config.js               # Cấu hình API và settings
├── models/
│   └── MovieModel.js       # Model - Xử lý dữ liệu API
├── controllers/
│   └── MovieController.js  # Controller - Logic nghiệp vụ
├── views/
│   └── (HTML files)        # View - Giao diện người dùng
├── assets/
│   ├── css/
│   │   └── style.css       # Stylesheet chính
│   └── js/
│       └── (helper scripts)
├── vercel.json             # Cấu hình Vercel
└── README.md               # Tài liệu
```

## 📋 Yêu cầu

- Trình duyệt web hỗ trợ ES6+ (Chrome, Firefox, Safari, Edge)
- Hoặc trình duyệt trên Smart TV Samsung (đời 2015+)
- Kết nối Internet

## 🚀 Cài đặt và Sử dụng

### Chạy local

1. Clone hoặc tải dự án về máy
2. Mở file `config.js` và cấu hình API endpoint:

```javascript
const CONFIG = {
    API: {
        BASE_URL: 'https://phim.nguonc.com/api', // Thay đổi URL API của bạn
        ...
    }
};
```

3. Mở file `index.html` bằng trình duyệt hoặc sử dụng Live Server:

```bash
# Nếu có Python
python -m http.server 8000

# Nếu có Node.js với http-server
npx http-server
```

4. Truy cập `http://localhost:8000`

### Deploy lên Vercel

1. Cài đặt Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow hướng dẫn trên terminal

### Deploy lên GitHub Pages

1. Push code lên GitHub repository
2. Vào Settings → Pages
3. Chọn branch `main` và folder `/ (root)`
4. Save và đợi deploy

## 📖 Hướng dẫn sử dụng

### Xem chi tiết phim

Truy cập: `movie.html?id=[movie-slug]`

Ví dụ: `movie.html?id=mang-me-di-bo`

### Xem phim

Truy cập: `watch.html?id=[movie-slug]&ep=[episode-slug]`

Ví dụ: `watch.html?id=mang-me-di-bo&ep=tap-full`

### Điều hướng trên Smart TV

- **Phím mũi tên lên/xuống**: Di chuyển giữa các link và button
- **Phím Enter**: Chọn/Click
- **Phím Back**: Quay lại trang trước

## 🔧 Cấu hình

### Config API (config.js)

```javascript
const CONFIG = {
    API: {
        BASE_URL: 'https://your-api.com/api',
        ENDPOINTS: {
            MOVIE_DETAIL: '/movie/',
            SEARCH: '/search',
            HOME: '/home',
            CATEGORIES: '/categories'
        }
    }
};
```

### Player Settings

```javascript
PLAYER: {
    AUTOPLAY: false,    // Tự động phát
    VOLUME: 0.8,        // Âm lượng mặc định
    CONTROLS: true      // Hiển thị controls
}
```

### Cache Settings

```javascript
CACHE: {
    ENABLED: true,              // Bật/tắt cache
    DURATION: 3600000,          // 1 giờ (ms)
    PREFIX: 'movie_cache_'      // Prefix cho localStorage
}
```

## 🎨 Tùy chỉnh giao diện

Chỉnh sửa file `assets/css/style.css`:

- **Màu chủ đạo**: `#4a9eff`
- **Background**: `#0a0a0a`
- **Font size cho TV**: `20px` (có thể điều chỉnh)

## 📱 API Response Format

Dự án hỗ trợ format API như sau:

```json
{
  "status": "success",
  "movie": {
    "id": "...",
    "name": "Tên phim",
    "slug": "slug-phim",
    "original_name": "Original Name",
    "thumb_url": "...",
    "poster_url": "...",
    "description": "Mô tả phim...",
    "episodes": [
      {
        "server_name": "Server #1",
        "items": [
          {
            "name": "Tập 1",
            "slug": "tap-1",
            "embed": "https://embed-url.com/...",
            "m3u8": "https://stream-url.com/..."
          }
        ]
      }
    ]
  }
}
```

## 🐛 Xử lý lỗi

- **Lỗi CORS**: Cần proxy hoặc server API hỗ trợ CORS
- **API không response**: Kiểm tra URL trong `config.js`
- **Video không load**: Kiểm tra `embed` URL trong API response

## 📝 Ghi chú

- Website không sử dụng framework nặng để đảm bảo tương thích với Smart TV đời cũ
- Sử dụng vanilla JavaScript ES6+
- CSS được tối ưu cho hiệu suất
- Hỗ trợ localStorage để cache data

## 🔄 Phát triển tiếp

- [ ] Thêm trang chủ với danh sách phim
- [ ] Tìm kiếm phim
- [ ] Lọc theo thể loại
- [ ] Lịch sử xem
- [ ] Danh sách yêu thích
- [ ] PWA support

## 📄 License

MIT License - Free to use

## 👨‍💻 Hỗ trợ

Nếu có vấn đề, vui lòng tạo issue hoặc liên hệ.

---

Made with ❤️ for Smart TV
