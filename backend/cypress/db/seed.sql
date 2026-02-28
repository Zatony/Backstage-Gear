SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE profile_votes;
TRUNCATE TABLE carts;
TRUNCATE TABLE messages;
TRUNCATE TABLE ad_files;
TRUNCATE TABLE advertisements;
TRUNCATE TABLE used_items;
TRUNCATE TABLE items;
TRUNCATE TABLE profiles;
TRUNCATE TABLE users;
TRUNCATE TABLE brands;
TRUNCATE TABLE categories;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================
-- BASE DATA
-- =====================

INSERT INTO categories (id, name, picture)
VALUES 
(1,'elektromos gitár, elektromos basszusgitár','elektromos.png'),
(2,'akusztikus gitár, akusztikus basszusgitár','akusztikus.png');

INSERT INTO brands (id, brand_name)
VALUES 
(1,'Fender'),
(2,'Gibson');

INSERT INTO items (id, category_id, brand_id, name)
VALUES 
(1,1,1,'Fender American Professional II Stratocaster HSS, RW, Dark Night'),
(2,2,1,'Cort Earth-70 OP akusztikus gitár'),
(3,2,1,'Cort Earth-70 OP akusztikus gitár');

INSERT INTO used_items (id, item_id, price, item_condition)
VALUES 
(1,1,860000,'új'),
(2,2,70000,'új'),
(3,2,70000,'új');

-- =====================
-- USERS
-- =====================

INSERT INTO users
(id,is_admin,name,username,email,phone_number,date_of_birth,password)
VALUES
(1,1,'admin','admin','admin@example.com','36201234567','1985-04-12','admin'),
(2,0,'Nagy Éva','nagy.eva','eva.nagy@example.com','36309876543','1992-11-30','jelszo1'),
(3,0,'User Three','user.three','user.three@example.com','36301234567','1990-01-01','jelszo3'),
(4,0,'User Four','user.four','user.four@example.com','36301234568','1991-02-02','jelszo4');

-- trigger hash-eli jelszót ✅

-- =====================
-- PROFILES
-- =====================

INSERT INTO profiles (id,user_id,profile_picture)
VALUES
(1,1,'profile_picture_1.jpg'),
(2,2,'profile_picture_2.jpg');

-- =====================
-- ADVERTISEMENT
-- =====================

INSERT INTO advertisements
(id,user_id,used_item_id,is_reported,description,date_of_ad)
VALUES
(1,2,1,0,'Öreg Fender Strató, kifejezetten vékony, kényelmes nyakkal, tokkal és vonóval eladóvá vált. A nyakon van egy profin bedugózott furat, ezért ennyi az ára. Extra Jumbó, alig használt bundokkal, elől és hátul YJM Seymour Duncan, középen Kinman hangszedők. Baráti, 3,5 Kg súly!', '2025-02-03 10:10:02'),
(2,1,1,1,'Jelentett hirdetés példa', '2025-03-15 12:01:01'),
(3,2,2,0,'Teszt hirdetés', '2025-03-15 12:01:01'),
(4,3,3,0,'Teszt hirdetés', '2025-03-15 12:01:01');

INSERT INTO ad_files(ad_id,file_id)
VALUES (1,'fender-american-professional-ii.jpg'),
	   (2,'fender-american-professional-ii.jpg'),
	   (3,'fender-american-professional-ii.jpg'),
	   (4,'fender-american-professional-ii.jpg');

-- =====================
-- MESSAGES
-- =====================

INSERT INTO messages(id,sender_id,receiver_id,content,sent_at)
VALUES
(1, 3, 2, 'üzenet, üzenet', '2025-08-11 12:08:45'),
(2, 4, 2, 'üzenet, üzenet', '2025-09-30 10:12:13'),
(3, 2, 3, 'üzenet, üzenet', '2025-01-12 21:10:10');


-- =====================
-- CARTS
-- =====================

INSERT INTO carts (id, user_id, ad_id) VALUES
(1, 2, 1),
(2, 2, 2);