-- ============================================
-- AISecLearn MySQL 数据库建表脚本
-- 生产环境使用；本地开发用 SQLite 自动建表
-- ============================================

CREATE DATABASE IF NOT EXISTS aiseclearn DEFAULT CHARACTER SET utf8mb4;
USE aiseclearn;

-- 用户表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'student',
    level INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB;

-- 题目表
CREATE TABLE questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(50),
    difficulty VARCHAR(20),
    question TEXT,
    options TEXT,        -- JSON 字符串
    answer INT,
    code TEXT,
    INDEX idx_category (category)
) ENGINE=InnoDB;

-- 课程表
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100),
    category VARCHAR(50),
    difficulty VARCHAR(20),
    `desc` TEXT,
    icon VARCHAR(10),
    progress INT DEFAULT 0,
    lessons INT DEFAULT 0
) ENGINE=InnoDB;

-- 学习记录表
CREATE TABLE learning_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    question_id INT NOT NULL,
    user_answer VARCHAR(10),
    is_correct BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (question_id) REFERENCES questions(id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB;
