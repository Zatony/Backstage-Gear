CREATE DATABASE backstagegear
CHARACTER SET = 'utf8' COLLATE = 'utf8_hungarian_ci';


/*
DELETE FROM users;
DROP TABLE users;
ALTER TABLE users AUTO_INCREMENT = 1;
*/
CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(255) NOT NULL,
    date_of_birth TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    password VARCHAR(255) NOT NULL
);


/*
DELETE FROM profiles;
DROP TABLE profiles;
ALTER TABLE profiles AUTO_INCREMENT = 1;
*/
CREATE TABLE profiles(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    up_vote INT,
    down_vote INT,
    profile_picture VARCHAR(255),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),

    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);


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


/*
DELETE FROM items;
DROP TABLE items;
ALTER TABLE items AUTO_INCREMENT = 1;
*/
CREATE TABLE items(
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    brand VARCHAR(100),
    name VARCHAR(255),

    FOREIGN KEY (category_id) REFERENCES categories(id)
);


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


/*
DELETE FROM files;
DROP TABLE files;
*/
CREATE TABLE files(
    id VARCHAR(255) NOT NULL PRIMARY KEY UNIQUE,
    file_name VARCHAR(255) NOT NULL,
    file_size INT NOT NULL
);


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
    image VARCHAR(255) NULL,
    date_of_ad TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (used_item_id) REFERENCES used_items(id) ON DELETE CASCADE,
    FOREIGN KEY (image) REFERENCES files(id) ON DELETE CASCADE
);


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