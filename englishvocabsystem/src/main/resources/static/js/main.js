document.addEventListener("DOMContentLoaded", function () {
  // --- Active menu ---
  const currentPath = window.location.pathname; // ví dụ: /words hoặc /words/add
  const navLinks = document.querySelectorAll(".sidebar .nav-link");

  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href");
    if (linkPath && currentPath.startsWith(linkPath)) {
      link.classList.add("active");
    }
  });

  // --- Sidebar toggle ---
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("mainContent");
  const toggleBtn = document.getElementById("toggleSidebar");

  if (toggleBtn && sidebar && mainContent) {
    toggleBtn.addEventListener("click", function () {
      sidebar.classList.toggle("collapsed");
      mainContent.classList.toggle("expanded");
    });
  }

  // --- Dynamic page title ---
  const pageTitles = {
    dashboard: "Dashboard",
    users: "Quản lý người dùng",
    words: "Quản lý từ vựng",
    categories: "Quản lý danh mục",
    exercises: "Quản lý bài tập",
    "vocabulary-lists": "Danh sách từ vựng",
    notifications: "Thông báo",
    analytics: "Phân tích",
    settings: "Cài đặt",
  };

  const parts = currentPath.split("/").filter(Boolean); // ["users", "add"]
  const key = parts[0]; // ví dụ "users"
  const titleElement = document.getElementById("pageTitle");

  if (titleElement && pageTitles[key]) {
    titleElement.textContent = pageTitles[key];
  }
});
