-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Feb 12. 16:52
-- Kiszolgáló verziója: 10.4.28-MariaDB
-- PHP verzió: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `backstagegear`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `advertisements`
--

CREATE TABLE `advertisements` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `used_item_id` int(11) NOT NULL,
  `is_reported` tinyint(4) DEFAULT 0,
  `description` text NOT NULL,
  `date_of_ad` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `advertisements`
--

INSERT INTO `advertisements` (`id`, `user_id`, `used_item_id`, `is_reported`, `description`, `date_of_ad`) VALUES
(1, 2, 1, 0, 'leírás, leírás', '2025-02-03 10:10:02'),
(2, 3, 2, 1, 'leírás, leírás', '2025-03-15 12:01:01'),
(3, 4, 3, 1, 'leírás, leírás', '2025-04-09 20:20:10'),
(4, 5, 4, 0, 'leírás, leírás', '2025-05-01 15:56:11'),
(5, 5, 5, 0, 'leírás, leírás', '2025-06-14 08:07:06'),
(6, 2, 6, 1, 'leírás, leírás', '2025-07-22 09:13:56');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ad_files`
--

CREATE TABLE `ad_files` (
  `ad_id` int(11) NOT NULL,
  `file_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `ad_files`
--

INSERT INTO `ad_files` (`ad_id`, `file_id`) VALUES
(1, 'default-ad-picture'),
(2, 'default-ad-picture'),
(3, 'default-ad-picture'),
(4, 'default-ad-picture'),
(5, 'default-ad-picture'),
(6, 'default-ad-picture');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `brand_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `brands`
--

INSERT INTO `brands` (`id`, `brand_name`) VALUES
(2, 'Akai'),
(1, 'AKG'),
(3, 'Ampeg'),
(4, 'Arturia'),
(5, 'Behringer'),
(6, 'Blackstar'),
(7, 'Boss'),
(8, 'Bromo'),
(9, 'Casio'),
(10, 'Clavia'),
(11, 'Cort'),
(12, 'Dixon'),
(47, 'Egyéb'),
(13, 'Electro-Voice'),
(14, 'Epiphone'),
(15, 'ESP LTD'),
(16, 'Fender'),
(17, 'Gallien-Krueger'),
(18, 'Gibson'),
(19, 'Gretsch'),
(20, 'Harley Benton'),
(21, 'Hiwatt'),
(22, 'Ibanez'),
(23, 'Jackson'),
(24, 'Korg'),
(25, 'Ludwig'),
(26, 'Markbass'),
(27, 'Marshall'),
(28, 'Mesa/Boogie'),
(29, 'Moog'),
(30, 'Nord'),
(31, 'Ortega'),
(32, 'Pasadena'),
(33, 'Pearl'),
(34, 'Peavey'),
(35, 'PRS'),
(36, 'Roland'),
(37, 'Sabian'),
(38, 'Sennheiser'),
(39, 'Shure'),
(40, 'Squier'),
(41, 'Takamine'),
(42, 'Tama'),
(43, 'Taylor'),
(44, 'Traynor'),
(45, 'Yamaha'),
(46, 'Zildjian');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `brand_categories`
--

CREATE TABLE `brand_categories` (
  `brand_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `brand_categories`
--

INSERT INTO `brand_categories` (`brand_id`, `category_id`) VALUES
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

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `carts`
--

CREATE TABLE `carts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `ad_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `ad_id`) VALUES
(1, 2, 2),
(2, 2, 3),
(3, 3, 5),
(4, 3, 6),
(5, 4, 1),
(6, 5, 3),
(7, 5, 6);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `picture` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `categories`
--

INSERT INTO `categories` (`id`, `name`, `picture`) VALUES
(1, 'elektromos gitár, elektromos basszusgitár', 'elektromos.png'),
(2, 'akusztikus gitár, akusztikus basszusgitár', 'akusztikus.png'),
(3, 'billentyűs', 'billentyus.png'),
(4, 'ütős', 'utos.png'),
(5, 'erősítők/kombók', 'erositok.png'),
(6, 'hangtechnika', 'hangtechnika.png');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `files`
--

CREATE TABLE `files` (
  `id` varchar(255) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_size` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `files`
--

INSERT INTO `files` (`id`, `file_name`, `file_size`) VALUES
('default-ad-picture', 'default-ad-picture.png', 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `items`
--

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `items`
--

INSERT INTO `items` (`id`, `category_id`, `brand_id`, `name`) VALUES
(1, 1, 16, 'Fender American Professional II Stratocaster HSS, RW, Dark Night'),
(2, 2, 11, 'Cort Earth-70 OP akusztikus gitár'),
(3, 3, 45, 'Yamaha PSS E30 gyermek szintetizátor'),
(4, 4, 36, 'Roland TD-07DMK Elektromos dobfelszerelés'),
(5, 5, 27, 'Marshall DSL40CR csöves gitárkombó'),
(6, 6, 5, 'Behringer Xenyx X2442USB keverő');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `sent_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `content`, `sent_at`) VALUES
(1, 3, 2, 'üzenet, üzenet', '2025-08-11 12:08:45'),
(2, 4, 2, 'üzenet, üzenet', '2025-09-30 10:12:13'),
(3, 3, 5, 'üzenet, üzenet', '2025-10-18 09:01:54'),
(4, 2, 3, 'üzenet, üzenet', '2025-01-12 21:10:10');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `profiles`
--

CREATE TABLE `profiles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `profile_picture` varchar(255) NOT NULL DEFAULT 'default-profile-picture.jpg'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `profiles`
--

INSERT INTO `profiles` (`id`, `user_id`, `profile_picture`) VALUES
(1, 1, 'default-profile-picture.jpg'),
(2, 2, 'default-profile-picture.jpg'),
(3, 3, 'default-profile-picture.jpg'),
(4, 4, 'default-profile-picture.jpg'),
(5, 5, 'default-profile-picture.jpg');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `profile_votes`
--

CREATE TABLE `profile_votes` (
  `id` int(11) NOT NULL,
  `profile_id` int(11) NOT NULL,
  `voter_user_id` int(11) NOT NULL,
  `vote` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `used_items`
--

CREATE TABLE `used_items` (
  `id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `price` int(11) DEFAULT NULL,
  `item_condition` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `used_items`
--

INSERT INTO `used_items` (`id`, `item_id`, `price`, `item_condition`) VALUES
(1, 1, 860000, 'új'),
(2, 2, 80000, 'új'),
(3, 3, 27000, 'új'),
(4, 4, 420000, 'használt'),
(5, 5, 200000, 'sérült'),
(6, 6, 1000000, 'használt');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
  `name` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

DELIMITER $$
CREATE FUNCTION pwd_encrypt(pwd VARCHAR(100))
RETURNS VARCHAR(255) DETERMINISTIC
RETURN SHA2(CONCAT(pwd, 'sozas'), 256);
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER insert_user BEFORE INSERT ON users
FOR EACH ROW
SET NEW.password = pwd_encrypt(NEW.password);
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER insert_user_on_update BEFORE UPDATE ON users
FOR EACH ROW
SET NEW.password = pwd_encrypt(NEW.password);
$$
DELIMITER ;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `is_admin`, `name`, `username`, `email`, `phone_number`, `date_of_birth`, `password`) VALUES
(1, 1, 'admin', 'admin', 'admin@example.com', '36201234567', '1985-04-12', 'admin'),
(2, 0, 'Nagy Éva', 'nagy.eva', 'eva.nagy@example.com', '36309876543', '1992-11-30', 'jelszo1'),
(3, 0, 'Tóth Sándor', 'toth.sandor', 'sandor.toth@example.com', '36705551212', '1978-07-05', 'jelszo2'),
(4, 0, 'Major Zsuzsanna', 'major.zsuzsi', 'zsuzsa.major@example.com', '36204443333', '1989-02-18', 'jelszo3'),
(5, 0, 'János Péter', 'janos.peter', 'peter.janos@example.com', '36302109876', '2000-06-22', 'jelszo4');

DELIMITER $$
CREATE FUNCTION login(email VARCHAR(255), password VARCHAR(255))
RETURNS INTEGER DETERMINISTIC
BEGIN
    DECLARE OK INTEGER DEFAULT 0;
    SELECT id INTO OK 
    FROM users 
    WHERE users.email COLLATE utf8mb4_hungarian_ci = email COLLATE utf8mb4_hungarian_ci
      AND users.password COLLATE utf8mb4_hungarian_ci = pwd_encrypt(password) COLLATE utf8mb4_hungarian_ci;
    RETURN OK;
END;
$$
DELIMITER ;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `advertisements`
--
ALTER TABLE `advertisements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `used_item_id` (`used_item_id`);

--
-- A tábla indexei `ad_files`
--
ALTER TABLE `ad_files`
  ADD KEY `ad_id` (`ad_id`),
  ADD KEY `file_id` (`file_id`);

--
-- A tábla indexei `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `brand_name` (`brand_name`);

--
-- A tábla indexei `brand_categories`
--
ALTER TABLE `brand_categories`
  ADD PRIMARY KEY (`brand_id`,`category_id`),
  ADD KEY `category_id` (`category_id`);

--
-- A tábla indexei `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `ad_id` (`ad_id`);

--
-- A tábla indexei `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `brand_id` (`brand_id`);

--
-- A tábla indexei `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- A tábla indexei `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `profile_votes`
--
ALTER TABLE `profile_votes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `profile_id` (`profile_id`,`voter_user_id`),
  ADD KEY `voter_user_id` (`voter_user_id`);

--
-- A tábla indexei `used_items`
--
ALTER TABLE `used_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_id` (`item_id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `advertisements`
--
ALTER TABLE `advertisements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT a táblához `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT a táblához `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `profiles`
--
ALTER TABLE `profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `profile_votes`
--
ALTER TABLE `profile_votes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `used_items`
--
ALTER TABLE `used_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `advertisements`
--
ALTER TABLE `advertisements`
  ADD CONSTRAINT `advertisements_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `advertisements_ibfk_2` FOREIGN KEY (`used_item_id`) REFERENCES `used_items` (`id`);

--
-- Megkötések a táblához `ad_files`
--
ALTER TABLE `ad_files`
  ADD CONSTRAINT `ad_files_ibfk_1` FOREIGN KEY (`ad_id`) REFERENCES `advertisements` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ad_files_ibfk_2` FOREIGN KEY (`file_id`) REFERENCES `files` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `brand_categories`
--
ALTER TABLE `brand_categories`
  ADD CONSTRAINT `brand_categories_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`),
  ADD CONSTRAINT `brand_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Megkötések a táblához `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `carts_ibfk_2` FOREIGN KEY (`ad_id`) REFERENCES `advertisements` (`id`);

--
-- Megkötések a táblához `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `items_ibfk_2` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`);

--
-- Megkötések a táblához `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `profiles`
--
ALTER TABLE `profiles`
  ADD CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `profile_votes`
--
ALTER TABLE `profile_votes`
  ADD CONSTRAINT `profile_votes_ibfk_1` FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `profile_votes_ibfk_2` FOREIGN KEY (`voter_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `used_items`
--
ALTER TABLE `used_items`
  ADD CONSTRAINT `used_items_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
