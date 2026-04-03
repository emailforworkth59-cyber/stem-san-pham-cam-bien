# He Thong Giam Sat Va Canh Bao Do Am IoT - Hệ thống Giám sát Độ ẩm Đất Thực tiễn

Một dự án IoT mã nguồn mở được thiết kế với tư duy tối ưu chi phí và tính ứng dụng cao, giải quyết bài toán tưới tiêu trong nông nghiệp quy mô nhỏ và vừa.

## 1. Bối cảnh và Mục tiêu dự án

Dự án xuất phát từ quan sát thực tế về sự vất vả trong khâu quản lý tưới tiêu thủ công tại vườn. Các hệ thống giám sát IoT hiện nay trên thị trường thường đi kèm chi phí triển khai cao và yêu cầu kỹ thuật phức tạp, tạo rào cản lớn cho người dùng phổ thông.

Mục tiêu của GreenGuard IoT là xây dựng một hệ thống giám sát thời gian thực, có khả năng cảnh báo tự động, vận hành ổn định trong môi trường khắc nghiệt với tổng chi phí phần cứng được tối ưu dưới mức 1.000.000 VNĐ.

## 2. Tính năng Cốt lõi

- Giám sát Thời gian thực: Dữ liệu cảm biến được truyền tải về Local Server và cập nhật liên tục trên Web Dashboard.
- Cảnh báo Tự động: Tích hợp API để gửi thông báo qua Telegram Bot khi chỉ số độ ẩm vượt ngưỡng an toàn.
- Thuật toán Chống Spam (Debouncing): Áp dụng cơ chế khóa thời gian (Time-lock) sau mỗi lần gửi cảnh báo, ngăn chặn tình trạng tràn lưu lượng tin nhắn và giảm phiền nhiễu cho người dùng.
- Thiết kế Cơ khí Thực dụng: Bo mạch được thiết kế module hóa, bảo vệ bằng ống nhựa PVC tiêu chuẩn, đảm bảo khả năng chống nước và dễ dàng bảo trì tại thực địa.

## 3. Kiến trúc Hệ thống

Hệ thống được phát triển theo định hướng phân tán nhằm giảm tải cho thiết bị phần cứng đầu cuối:

1. Phần cứng (Hardware Node): Cảm biến Analog kết hợp vi điều khiển (ESP32/ESP8266) thực hiện đọc tín hiệu, lọc nhiễu sơ bộ và gửi HTTP Request.
2. Máy chủ Cục bộ (Local Server): Xử lý API, đánh giá ngưỡng cảnh báo và tương tác với cơ sở dữ liệu.
3. Cơ sở dữ liệu (Database): Lưu trữ lịch sử biến thiên độ ẩm phục vụ việc xuất biểu đồ thống kê.
4. Giao diện & Cảnh báo (Frontend & Alert): Web Dashboard hiển thị dữ liệu trực quan và Telegram API xử lý phản hồi tức thời.

## 4. Cấu trúc Thư mục (Mô hình MVC)

Dự án được xây dựng trên nền tảng Node.js, tuân thủ chặt chẽ kiến trúc MVC (Model-View-Controller) để đảm bảo tính bảo mật và khả năng mở rộng:

.
├── public/ # Tài nguyên tĩnh (CSS, JS phía Client, Hình ảnh)
│ ├── css/ # Các file định dạng giao diện
│ └── js/ # Script xử lý logic Frontend (VD: updateData.js)
├── src/ # Mã nguồn Backend (Node.js)
│ ├── config/ # Cấu hình kết nối Cơ sở dữ liệu (database.js)
│ ├── controllers/ # Logic điều khiển chính (Auth, Cây trồng, Bot Telegram)
│ ├── middleware/ # Lớp bảo mật, kiểm tra xác thực
│ ├── models/ # Schema tương tác Database (plant_model, userModel)
│ ├── routes/ # Điều hướng API và Web (web.js)
│ └── views/ # Giao diện người dùng render bằng EJS template
├── server.js # Điểm khởi chạy (Entry point) của Local Server
└── package.json # Quản lý thư viện và dependencies

## 5. Hướng dẫn Triển khai

Yêu cầu môi trường:

- PlatformIO IDE hoặc Arduino IDE
- Node.js (phiên bản LTS)
- Trình duyệt Web hiện đại

Các bước cài đặt:

1. Clone kho lưu trữ:
   git clone https://github.com/emailforworkth59-cyber/stem-san-pham-cam-bien.git
   Cho phần cứng( LƯU Ý: Nên chuyển qua 1 folder mới để clone về)
   git clone https://github.com/HieuTrung0937/IoT_project.git
2. Cài đặt các thư viện Node.js cần thiết (tại thư mục gốc dự án):
   npm install

3. Đổi tên file .env.example thành .env (hoặc tạo file mới) và thiết lập các biến môi trường cần thiết (Thông tin Database, Telegram Bot Token).

4. Khởi chạy Local Server:
   node server.js

5. Biên dịch và nạp thư mục IoT cho mạch vi điều khiển. Truy cập Web Dashboard qua địa chỉ IP cục bộ (ví dụ: http://localhost:3000).

---

Tuyên bố bản quyền: Mã nguồn (Firmware, API, Web Frontend) và thiết kế phần cứng trong kho lưu trữ này được phát triển độc lập hoàn toàn bởi tác giả (Học sinh lớp 11). Các thông tin nhạy cảm đã được loại bỏ khỏi mã nguồn công khai để đảm bảo an toàn thông tin.
