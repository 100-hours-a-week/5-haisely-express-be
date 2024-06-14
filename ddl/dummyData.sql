-- Inserting dummy data into images table
INSERT INTO images (file_url) VALUES
('http://example.com/image1.jpg'),
('http://example.com/image2.jpg'),
('http://example.com/image3.jpg'),
('http://example.com/image4.jpg'),
('http://example.com/image5.jpg'),
('http://example.com/image6.jpg');

-- Inserting dummy data into users table
INSERT INTO users (image_id, nickname, email, password) VALUES
(4, 'user1', 'user1@example.com', 'password1'),
(5, 'user2', 'user2@example.com', 'password2'),
(6, 'user3', 'user3@example.com', 'password3');

-- Inserting dummy data into boards table
INSERT INTO boards (user_id, image_id, title, content) VALUES
(1, 1, 'First Board', 'This is the content of the first board'),
(2, 2, 'Second Board', 'This is the content of the second board'),
(3, 3, 'Third Board', 'This is the content of the third board');

-- Inserting dummy data into comments table
INSERT INTO comments (board_id, user_id, content) VALUES
(1, 2, 'This is a comment on the first board by user2'),
(1, 3, 'This is another comment on the first board by user3'),
(2, 1, 'This is a comment on the second board by user1'),
(3, 2, 'This is a comment on the third board by user2');

-- Inserting dummy data into board_hits table
INSERT INTO board_hits (board_id, hit) VALUES
(1, 10),
(2, 20),
(3, 30);


