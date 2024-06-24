-- select
select * from sessions;
select * from users; 
select * from images;
select * from boards;
select * from comments;

INSERT INTO users (nickname, email, password) VALUES
('user3', 'user3@example.com', 'password3');
ALTER TABLE users
ALTER COLUMN image_id SET DEFAULT 1;

update comments set content = 'new content' where comment_id = 1;

update boards set title = 'new title', content = 'new content', image_id = 1 where board_id = 1;

select b.board_id, c.comment_id ,b.deleted_at board_deleted, c.deleted_at comment_deleted from comments c
join boards b on c.board_id = b.board_id
where c.board_id = 1;

select u.user_id, b.board_id, c.comment_id, u.deleted_at user_deleted, b.deleted_at board_deleted, c.deleted_at comment_deleted from users u
join boards b on u.user_id = b.user_id
join comments c on u.user_id = c.user_id
where u.user_id = 2;

