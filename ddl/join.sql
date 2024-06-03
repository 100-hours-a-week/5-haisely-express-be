-- Join 
use community;

-- get board data
select b.board_id, u.nickname writer, i2.file_url profile_image, b.title, b.content, i.file_url board_image, b.created_at, b.updated_at, b.deleted_at, h.hit from boards b 
left join board_hits h on b.board_id = h.board_id
left join images i on b.image_id = i.image_id
left join users u on b.user_id = u.user_id
left join images i2 on u.image_id = i2.image_id;

-- get user data
select u.user_id, u.nickname, u.email, i.file_url from users u
left join images i on u.image_id = i.image_id;

-- get comment data
select c.comment_id, u.nickname, i.file_url profile_image, c.content, c.created_at, c.updated_at, c.deleted_at from comments c
left join users u on c.user_id = u.user_id
left join images i on u.image_id = i.image_id;
