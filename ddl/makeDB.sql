-- drop database community;


create database community;
use community;
show tables;

CREATE TABLE images(
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    file_url VARCHAR(128) NOT NULL
);

CREATE TABLE users(
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    image_id INT DEFAULT 1,
    nickname VARCHAR(64) NOT NULL,
    email VARCHAR(32) NOT NULL,
    password VARCHAR(32) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (image_id) REFERENCES images(image_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE  boards(
    board_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    image_id INT,
    title VARCHAR(32) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (image_id) REFERENCES images(image_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE comments(
	comment_id INT PRIMARY KEY AUTO_INCREMENT,
    board_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (board_id) REFERENCES boards(board_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE board_hits(
	board_hit_id INT PRIMARY KEY AUTO_INCREMENT,
    board_id int NOT NULL,
    hit int DEFAULT 0, 
    FOREIGN KEY (board_id) REFERENCES boards(board_id)
);

-- CREATE TABLE sessions(
-- 	session_id INT PRIMARY KEY AUTO_INCREMENT,
--     token VARCHAR(128),
--     user_id INT,
--     FOREIGN KEY (user_id) REFERENCES users(user_id)
-- );

CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_nickname ON users(nickname);

show tables;