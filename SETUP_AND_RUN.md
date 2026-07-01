# Hướng Dẫn Cài Đặt và Chạy Dự Án AstroFloat (Bao Gồm Tính Năng Tarot)

Dưới đây là các bước chi tiết để setup và chạy dự án này trên môi trường local của bạn.

## Yêu cầu hệ thống
- **Node.js** (Phiên bản 18.x hoặc mới nhất)
- **NPM** (Đi kèm với Node.js)
- Dự án Supabase để lưu trữ Database cho tính năng Tarot.

---

## Bước 1: Thiết Lập Cơ Sở Dữ Liệu Supabase

Tính năng Tarot sử dụng Supabase PostgreSQL làm Database chính.

1. Đăng nhập vào dự án Supabase của bạn tại: [https://supabase.com/dashboard/project/vmnuwravgdeqlniuvtgo](https://supabase.com/dashboard/project/vmnuwravgdeqlniuvtgo) (hoặc truy cập qua URL dự án).
2. Tìm đến mục **SQL Editor** ở menu bên trái.
3. Mở file schema: [`db/tarot_schema.sql`](./db/tarot_schema.sql) nằm trong source code này.
4. Copy toàn bộ nội dung trong file đó và Paste vào SQL Editor trên Supabase.
5. Bấm **Run** để hệ thống tạo tất cả các tables, relations và functions (bao gồm hàm `generate_tarot_reading`).

---

## Bước 2: Thiết Lập Biến Môi Trường

Dự án cần kết nối đến Supabase thông qua các URL và API Key.

1. Tìm file có tên `.env` ở thư mục gốc của project.
2. Đảm bảo file `.env` chứa 2 thông tin sau (nếu chưa có thì bổ sung vào):
   ```env
   NEXT_PUBLIC_TAROT_SUPABASE_URL=https://vmnuwravgdeqlniuvtgo.supabase.co
   NEXT_PUBLIC_TAROT_SUPABASE_KEY=sb_publishable_xA6MfYv1wAarcwaShxk_sw_rnszT_VF
   ```
   *(Thay đổi các khóa này nếu bạn sử dụng một project Supabase khác)*.

---

## Bước 3: Cài Đặt Dependencies & Chạy Dự Án

1. Mở Terminal / Command Prompt và trỏ về thư mục gốc của dự án (`d:\GitHub\AstroFloat`).
2. Chạy lệnh sau để tải các gói thư viện cần thiết (nếu bạn chưa cài đặt):
   ```bash
   npm install
   ```
3. Sau khi cài đặt hoàn tất, chạy lệnh sau để khởi động máy chủ (Dev Server):
   ```bash
   npm run dev
   ```
   *(Trình duyệt sẽ mất khoảng vài giây ở lần load đầu tiên)*.

---

## Bước 4: Kiểm Tra Tính Năng

Sau khi ứng dụng đã chạy, bạn mở trình duyệt và truy cập:

- **Trang chủ chính:** [http://localhost:3000](http://localhost:3000)
- **Trang chủ Tarot:** [http://localhost:3000/tarot](http://localhost:3000/tarot)

Bây giờ bạn đã có thể trải nghiệm toàn bộ tính năng bốc bài Tarot với giao diện vũ trụ (nebula), lịch sử và lá bài mỗi ngày (daily card).

Chúc bạn thành công!
