-- Applied AI Lab DB
CREATE DATABASE IF NOT EXISTS applied_ai_lab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE applied_ai_lab;

-- 관리자 계정 (비밀번호는 bcrypt 해시)
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 페이지별 콘텐츠 (page + section_key 로 구분, content는 JSON)
CREATE TABLE IF NOT EXISTS site_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page VARCHAR(50) NOT NULL,
  section_key VARCHAR(80) NOT NULL,
  content JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_page_section (page, section_key)
);
