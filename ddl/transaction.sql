-- transaction
use community;

SELECT @@autocommit;
SET autocommit = 0;
ROLLBACK;

-- delete board
START TRANSACTION;
UPDATE boards b set b.deleted_at = CURRENT_TIMESTAMP WHERE b.board_id = 1;
UPDATE comments c set c.deleted_at = CURRENT_TIMESTAMP WHERE c.board_id = 1;
COMMIT;


-- delete user
START TRANSACTION;
UPDATE users u set u.deleted_at = CURRENT_TIMESTAMP WHERE u.user_id = 2;
UPDATE boards b set b.deleted_at = CURRENT_TIMESTAMP WHERE b.user_id = 2;
UPDATE comments c set c.deleted_at = CURRENT_TIMESTAMP WHERE c.user_id = 2;
COMMIT;

-- new user
START TRANSACTION;
INSERT INTO images (file_url) VALUES ('http://example.com/new_image.jpg');
INSERT INTO users (image_id, nickname, email, password) VALUES (LAST_INSERT_ID(), 'new_user', 'new_user@example.com', 'new_password');
COMMIT;

-- new board
START TRANSACTION;
INSERT INTO images (file_url) VALUES ('http://example.com/new_board_image.jpg');
INSERT INTO boards (user_id, image_id, title, content) VALUES (1, LAST_INSERT_ID(), 'New Board', 'This is the content of the new board');
COMMIT;

-- edit user
START TRANSACTION;
INSERT INTO images (file_url) VALUES ('http://example.com/new_profile_image.jpg');
UPDATE users u SET u.nickname = 'new_nickname', u.password = 'new_password', u.image_id = LAST_INSERT_ID() WHERE u.user_id = 2;
COMMIT;

-- edit board
START TRANSACTION;
INSERT INTO images (file_url) VALUES ('http://example.com/new_board_image.jpg');
UPDATE boards b
SET b.title = 'new_title', b.content = 'new_content', b.image_id = LAST_INSERT_ID() WHERE b.board_id = 2;
COMMIT;
