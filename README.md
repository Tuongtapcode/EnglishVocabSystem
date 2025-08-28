# English Vocabulary Learning App 📚
*Ứng dụng học từ vựng tiếng Anh trên nền tảng di động*

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)
![Docker](https://img.shields.io/badge/Docker-0CC1F3?style=for-the-badge&logo=docker&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

## 📋 Mục lục
- [Giới thiệu](#giới-thiệu)
- [Tính năng chính](#tính-năng-chính)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt và chạy ứng dụng](#cài-đặt-và-chạy-ứng-dụng)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Đóng góp](#đóng-góp)
- [Tác giả](#tác-giả)
- [License](#license)

## 🌟 Giới thiệu

Trong bối cảnh toàn cầu hóa, tiếng Anh đóng vai trò quan trọng như ngôn ngữ giao tiếp quốc tế. Tuy nhiên, tại Việt Nam, trình độ sử dụng tiếng Anh vẫn còn nhiều hạn chế (xếp hạng 63/116 theo EF English Proficiency Index 2024).

**English Vocabulary Learning App** được phát triển nhằm hỗ trợ người học cải thiện vốn từ vựng tiếng Anh một cách hiệu quả, tiện lợi và khoa học thông qua nền tảng di động.

### 🎯 Mục tiêu
- Xây dựng ứng dụng di động đa nền tảng (Android & iOS)
- Hỗ trợ học từ vựng theo phương pháp khoa học (SM-2 Algorithm)
- Cung cấp trải nghiệm học tập cá nhân hóa và trực quan
- Theo dõi và thống kê tiến độ học tập chi tiết

## ⚡ Tính năng chính

### 🧠 Học từ vựng thông minh
- **Thuật toán SM-2**: Hệ thống nhắc nhở thông minh dựa trên đường cong quên lãng
- **Học theo chủ đề**: Phân loại từ vựng theo các lĩnh vực (giao tiếp, du lịch, học thuật...)
- **Hỗ trợ đa phương tiện**: Hình ảnh, âm thanh, ví dụ minh họa

### 📝 Luyện tập đa dạng
- **Quiz trắc nghiệm**: Kiểm tra nghĩa của từ
- **Ghép từ**: Kết nối từ với nghĩa tương ứng
- **Điền từ**: Hoàn thiện câu với từ vựng phù hợp
- **Flashcard**: Ôn tập nhanh theo phương pháp truyền thống

### 📊 Theo dõi tiến độ
- **Thống kê chi tiết**: Số từ đã học, tỷ lệ chính xác, thời gian học
- **Biểu đồ tiến độ**: Visualize quá trình học tập qua thời gian
- **Báo cáo cá nhân**: Phân tích điểm mạnh và điểm cần cải thiện
- **Streak counter**: Duy trì động lực học tập hàng ngày

### 👤 Quản lý người dùng
- **Đăng ký/Đăng nhập**: Xác thực bảo mật với Spring Security
- **Profile cá nhân**: Quản lý thông tin và cài đặt học tập
- **Đồng bộ đa thiết bị**: Học tập liền mạch trên nhiều device

## 🏗️ Kiến trúc hệ thống

### 📱 Tầng Client (Frontend)
- **React Native**: Framework phát triển đa nền tảng
- **Native Components**: Sử dụng UI components gốc của OS
- **State Management**: Redux/Context API cho quản lý state
- **Offline Support**: Học tập không cần kết nối internet

### ⚙️ Tầng Backend (API Services)
- **Spring Boot**: Framework Java cho REST API
- **Spring Security**: Xác thực và phân quyền người dùng
- **Spring Data JPA**: ORM cho thao tác cơ sở dữ liệu
- **Spring Cache**: Tích hợp Redis để tăng hiệu suất

### 💾 Tầng Dữ liệu
- **MySQL**: Database chính lưu trữ user, vocabulary, progress
- **Redis**: Cache layer cho session, từ vựng phổ biến
- **File Storage**: Lưu trữ audio, hình ảnh minh họa

## 🛠️ Công nghệ sử dụng

### Frontend
- **React Native** 0.72+ - Cross-platform mobile development
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation framework
- **AsyncStorage** - Local data persistence
- **React Native Sound** - Audio playback

### Backend
- **Java 17** - Programming language
- **Spring Boot 3.1+** - Application framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Data access layer
- **MySQL 8.0** - Primary database
- **Redis 7.0** - Caching layer

### DevOps & Tools
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **Maven** - Build automation (Backend)
- **npm/yarn** - Package management (Frontend)

## 🚀 Cài đặt và chạy ứng dụng

### Yêu cầu hệ thống
- **Node.js** >= 16.x
- **Java JDK** >= 17
- **Docker** & Docker Compose
- **MySQL** 8.0+
- **Redis** 7.0+
- **Android Studio** (cho Android)
- **Xcode** (cho iOS - chỉ trên macOS)

### 1. Clone repository


### 2. Chạy với Docker (Khuyến nghị)


### 3. Chạy thủ công



#### Frontend (React Native)

### 4. Cấu hình môi trường


#### Frontend (.env)

## 📚 API Documentation





Xem chi tiết tại: [API Documentation]

## 📱 Screenshots

### Màn hình chính


### Học tập và Quiz

## 🧪 Testing

### Unit Tests


### Integration Tests


## 📈 Performance & Monitoring


## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Hãy xem [CONTRIBUTING.md](./CONTRIBUTING.md) để biết chi tiết.

### Quy trình đóng góp
1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📄 License



## 👤 Tác giả

**Nguyễn Ngọc Tưởng**
- MSSV: 2251052137
- Trường: Đại học Mở TP.HCM
- Ngành: Công nghệ Thông tin
- Email: [your.email@example.com](mailto:your.email@example.com)
- GitHub: [@your-username](https://github.com/your-username)

**Giảng viên hướng dẫn:** Trương Hoàng Vinh

## 🙏 Acknowledgments

- [EF English Proficiency Index](https://www.ef.com/epi/) - Dữ liệu thống kê trình độ tiếng Anh
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Native Documentation](https://reactnative.dev/)
- [SM-2 Algorithm](https://en.wikipedia.org/wiki/SuperMemo#SM-2_algorithm) - Thuật toán học tập
- Cộng đồng lập trình viên Vietnam

---

<div align="center">
  <p><strong>⭐ Nếu project này hữu ích, hãy cho chúng tôi một star! ⭐</strong></p>
  
  Made with ❤️ for English learners in Vietnam 🇻🇳
</div>
