-- Active: 1765535940941@@127.0.0.1@3307@backstagegear
CREATE DATABASE backstagegear
CHARACTER SET = 'utf8' COLLATE = 'utf8_hungarian_ci';



/*
DELETE FROM users;
DROP TABLE users;
ALTER TABLE users AUTO_INCREMENT = 1;
*/
CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    is_admin TINYINT(1) DEFAULT 0,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    password VARCHAR(255) NOT NULL
);


CREATE FUNCTION pwd_encrypt(pwd varchar(100))
RETURNS VARCHAR(255) DETERMINISTIC
RETURN SHA2(concat(pwd, 'sozas'), 256);

CREATE TRIGGER insert_user BEFORE INSERT ON users
FOR EACH ROW SET new.password = pwd_encrypt(new.password);

CREATE TRIGGER insert_user_on_update BEFORE UPDATE ON users
FOR EACH ROW SET new.password = pwd_encrypt(new.password);

CREATE FUNCTION login(email VARCHAR(255), password VARCHAR(255))
RETURNS INTEGER DETERMINISTIC
BEGIN
    DECLARE OK INTEGER;
    SET OK = 0;
    SELECT id INTO OK FROM users WHERE users.email = email AND users.password = pwd_encrypt(password);
    RETURN OK;
END


INSERT INTO users (id, is_admin, name, username, email, phone_number, date_of_birth, password)
VALUES
(NULL, 1, 'admin', 'admin', 'admin@example.com', '36201234567', '1985-04-12', 'admin'),
(NULL, 0, 'Nagy Éva', 'nagy.eva', 'eva.nagy@example.com', '36309876543', '1992-11-30', 'jelszo1'),
(NULL, 0, 'Tóth Sándor', 'toth.sandor', 'sandor.toth@example.com', '36705551212', '1978-07-05', 'jelszo2'),
(NULL, 0, 'Major Zsuzsanna', 'major.zsuzsi', 'zsuzsa.major@example.com', '36204443333', '1989-02-18', 'jelszo3'),
(NULL, 0, 'János Péter', 'janos.peter', 'peter.janos@example.com', '36302109876', '2000-06-22', 'jelszo4');



/*
DELETE FROM profiles;
DROP TABLE profiles;
ALTER TABLE profiles AUTO_INCREMENT = 1;
*/
CREATE TABLE profiles(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    profile_picture VARCHAR(255) NOT NULL DEFAULT 'default-profile-picture.jpg',

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO profiles (id, user_id)
VALUES
(NULL, 1),
(NULL, 2),
(NULL, 3),
(NULL, 4),
(NULL, 5);



/*
DELETE FROM profile_votes;
DROP TABLE profile_votes;
ALTER TABLE profile_votes AUTO_INCREMENT = 1;
*/
CREATE TABLE profile_votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT NOT NULL,
    voter_user_id INT NOT NULL,
    vote TINYINT NOT NULL, -- 1 = upvote, -1 = downvote

    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (voter_user_id) REFERENCES users(id) ON DELETE CASCADE,

    UNIQUE (profile_id, voter_user_id)
);



/*
DELETE FROM messages;
DROP TABLE messages;
ALTER TABLE messages AUTO_INCREMENT = 1;
*/
CREATE TABLE messages(
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    content TEXT NOT NULL,
    sent_at DATETIME NOT NULL DEFAULT NOW(),

    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO messages (id, sender_id, receiver_id, content, sent_at)
VALUES
(NULL, 3, 2, 'üzenet, üzenet', '2025-08-11 12:08:45'),
(NULL, 4, 2, 'üzenet, üzenet', '2025-09-30 10:12:13'),
(NULL, 3, 5, 'üzenet, üzenet', '2025-10-18 09:01:54'),
(NULL, 2, 3, 'üzenet, üzenet', '2025-01-12 21:10:10');




/*
DELETE FROM categories;
DROP TABLE categories;
ALTER TABLE categories AUTO_INCREMENT = 1;
*/
CREATE TABLE categories(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    picture VARCHAR(255) NOT NULL
);

INSERT INTO categories (id, name, picture)
VALUES
(NULL, 'elektromos gitár, elektromos basszusgitár', 'elektromos.png'),
(NULL, 'akusztikus gitár, akusztikus basszusgitár', 'akusztikus.png'),
(NULL, 'billentyűs', 'billentyus.png'),
(NULL, 'ütős', 'utos.png'),
(NULL, 'erősítők/kombók', 'erositok.png'),
(NULL, 'hangtechnika', 'hangtechnika.png');



CREATE TABLE brands(
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand_name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO brands 
VALUES
(NULL, "AKG"),--
(NULL, "Akai"),--
(NULL, "Ampeg"),--
(NULL, "Arturia"),--
(NULL, "Behringer"),--
(NULL, "Blackstar"),--
(NULL, "Boss"),--
(NULL, "Bromo"),--
(NULL, "Casio"),--
(NULL, "Clavia"),--
(NULL, "Cort"),--
(NULL, "Dixon"),--
(NULL, "Electro-Voice"),--
(NULL, "Epiphone"),--
(NULL, "ESP LTD"),--
(NULL, "Fender"),--
(NULL, "Gallien-Krueger"),--
(NULL, "Gibson"),--
(NULL, "Gretsch"),--
(NULL, "Harley Benton"),--
(NULL, "Hiwatt"),--
(NULL, "Ibanez"),--
(NULL, "Jackson"),--
(NULL, "Korg"),--
(NULL, "Ludwig"),--
(NULL, "Markbass"),--
(NULL, "Marshall"),--
(NULL, "Mesa/Boogie"),--
(NULL, "Moog"),--
(NULL, "Nord"),--
(NULL, "Ortega"),--
(NULL, "Pasadena"),--
(NULL, "Pearl"),--
(NULL, "Peavey"),--
(NULL, "PRS"),--
(NULL, "Roland"),--
(NULL, "Sabian"),--
(NULL, "Sennheiser"),--
(NULL, "Shure"),--
(NULL, "Squier"),--
(NULL, "Takamine"),--
(NULL, "Tama"),--
(NULL, "Taylor"),--
(NULL, "Traynor"),--
(NULL, "Yamaha"),--
(NULL, "Zildjian"),--
(NULL, "Egyéb");



/*
DELETE FROM items;
DROP TABLE items;
ALTER TABLE items AUTO_INCREMENT = 1;
*/
CREATE TABLE items(
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    brand_id INT NOT NULL,
    name VARCHAR(255),

    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (brand_id) REFERENCES brands(id)
);

INSERT INTO items (id, category_id, brand_id, name)
VALUES
(NULL, 1, 16, 'Fender American Professional II Stratocaster HSS, RW, Dark Night'),
(NULL, 2, 11, 'Cort Earth-70 OP akusztikus gitár'),
(NULL, 3, 45, 'Yamaha PSS E30 gyermek szintetizátor'),
(NULL, 4, 36, 'Roland TD-07DMK Elektromos dobfelszerelés'),
(NULL, 5, 27, 'Marshall DSL40CR csöves gitárkombó'),
(NULL, 6, 5, 'Behringer Xenyx X2442USB keverő');



CREATE TABLE brand_categories (
    brand_id INT NOT NULL,
    category_id INT NOT NULL,

    PRIMARY KEY (brand_id, category_id),
    FOREIGN KEY (brand_id) REFERENCES brands(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

INSERT INTO brand_categories
VALUES
(1, 6),
(2, 3),
(3, 5),
(4, 3),
(5, 3),
(5, 4),
(5, 6),
(6, 5),
(7, 5),
(8, 2),
(9, 3),
(10, 3),
(11, 1),
(11, 2),
(12, 4),
(13, 6),
(14, 1),
(14, 2),
(15, 1),
(16, 1),
(16, 2),
(16, 5),
(17, 4),
(18, 1),
(18, 2),
(19, 1),
(19, 4),
(20, 1),
(20, 2),
(21, 5),
(22, 1),
(22, 2),
(23, 1),
(24, 3),
(25, 4),
(26, 5),
(27, 5),
(28, 5),
(29, 3),
(30, 3),
(31, 2),
(32, 2),
(33, 4),
(34, 5),
(35, 1),
(36, 3),
(36, 4),
(37, 4),
(38, 6),
(39, 6),
(40, 1),
(41, 2),
(42, 4),
(43, 2),
(44, 5),
(45, 1),
(45, 2),
(45, 3),
(45, 4),
(46, 4);



/*
DELETE FROM used_items;
DROP TABLE used_items;
ALTER TABLE used_items AUTO_INCREMENT = 1;
*/
CREATE TABLE used_items(
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    price INT,
    item_condition VARCHAR(100) NOT NULL,

    FOREIGN KEY (item_id) REFERENCES items(id)
);

INSERT INTO used_items (id, item_id, price, item_condition)
VALUES
(NULL, 1, 860000, 'új'),
(NULL, 2, 80000, 'új'),
(NULL, 3, 27000, 'új'),
(NULL, 4, 420000, 'használt'),
(NULL, 5, 200000, 'sérült'),
(NULL, 6, 1000000, 'használt');



/*
DELETE FROM files;
DROP TABLE files;
*/
CREATE TABLE files(
    id VARCHAR(255) NOT NULL PRIMARY KEY UNIQUE,
    file_name VARCHAR(255) NOT NULL,
    file_size INT NOT NULL
);

INSERT INTO files (id, file_name, file_size)
VALUES
('default-ad', 'default-ad.jpg', 0),
('https://source.unsplash.com/400x300/?guitar1', 'file1.name', 300),
('https://source.unsplash.com/400x300/?guitar2', 'file2.name', 300),
('https://source.unsplash.com/400x300/?acguitar1', 'file3.name', 300),
('https://source.unsplash.com/400x300/?acguitar2', 'file4.name', 300),
('https://source.unsplash.com/400x300/?piano', 'file5.name', 300),
('https://source.unsplash.com/400x300/?drum', 'file6.name', 300),
('https://source.unsplash.com/400x300/?amp', 'file7.name', 300),
('https://source.unsplash.com/400x300/?mix1', 'file8.name', 300),
('https://source.unsplash.com/400x300/?mix2', 'file9.name', 300);

UPDATE files
SET file_name = 'default-ad-picture.png'
WHERE file_name = 'default-ad.png';



/*
DELETE FROM advertisements;
DROP TABLE advertisements;
ALTER TABLE advertisements AUTO_INCREMENT = 1;
*/
CREATE TABLE advertisements(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    used_item_id INT NOT NULL,
    is_reported TINYINT DEFAULT false,
    description TEXT NOT NULL,
    date_of_ad DATE,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (used_item_id) REFERENCES used_items(id) ON DELETE CASCADE
);

INSERT INTO advertisements (id, user_id, used_item_id, is_reported, description, date_of_ad) VALUES
(NULL, 2, 1, FALSE, 'leírás, leírás', '2025-02-03'),
(NULL, 3, 2, TRUE, 'leírás, leírás', '2025-03-15'),
(NULL, 4, 3, TRUE, 'leírás, leírás', '2025-04-09'),
(NULL, 5, 4, FALSE, 'leírás, leírás', '2025-05-01'),
(NULL, 5, 5, FALSE, 'leírás, leírás', '2025-06-14'),
(NULL, 2, 6, TRUE, 'leírás, leírás', '2025-07-22');



/*
DELETE FROM ad_files;
DROP TABLE ad_files;
*/
CREATE TABLE ad_files(
    ad_id INT NOT NULL,
    file_id VARCHAR(255),

    FOREIGN KEY (ad_id) REFERENCES advertisements(id) ON DELETE CASCADE,
    FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
);

INSERT INTO ad_files (ad_id, file_id) VALUES
(1, 'https://source.unsplash.com/400x300/?guitar1'),
(1, 'https://source.unsplash.com/400x300/?guitar2'),
(2, 'https://source.unsplash.com/400x300/?acguitar1'),
(2, 'https://source.unsplash.com/400x300/?acguitar2'),
(3, 'https://source.unsplash.com/400x300/?piano'),
(4, 'https://source.unsplash.com/400x300/?drum'),
(5, 'https://source.unsplash.com/400x300/?amp'),
(6, 'https://source.unsplash.com/400x300/?mix1'),
(6, 'https://source.unsplash.com/400x300/?mix2');



/*
DELETE FROM carts;
DROP TABLE carts;
ALTER TABLE carts AUTO_INCREMENT = 1;
*/
CREATE TABLE carts(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    ad_id INT NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ad_id) REFERENCES advertisements(id)
);

INSERT INTO carts (id, user_id, ad_id) VALUES
(NULL, 2, 1),
(NULL, 3, 2),
(NULL, 4, 3),
(NULL, 5, 4),
(NULL, 5, 5),
(NULL, 2, 6);