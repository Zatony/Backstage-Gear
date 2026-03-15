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
(1, 2, 1, 0, 'Öreg Fender Strató, kifejezetten vékony, kényelmes nyakkal, tokkal és vonóval eladóvá vált. A nyakon van egy profin bedugózott furat, ezért ennyi az ára. Extra Jumbó, alig használt bundokkal, elől és hátul YJM Seymour Duncan, középen Kinman hangszedők. Baráti, 3,5 Kg súly!', '2025-02-03 10:10:02'),
(2, 3, 2, 1, '3/4 mini dreadnought formájú test okouméból (afrikai mahagóniból), mahagóni (palaquium) nyak, merbau fogólap és húrláb, dovetail csatlakozás, 22,75˝ húrhossz, saját puhatokkal! Amíg a saját oldalunkon megtalálod,  addig még eladó! Ha nem találod, kérlek írj vagy telefonálj nekünk! Köszönöm, de csere nem érdekel. Az ár nem alkuképes. Kérlek, kattints a linkre, nézz körül az oldalunkon! link megnyitása', '2025-03-15 12:01:01'),
(3, 4, 3, 1, 'Amíg a hirdetésben lévő linkre kattintva a saját oldalunkon megtalálod, addig még eladó, a honlapunkon le is tudod foglalni! Ha már nem találod, kérlek írj vagy telefonálj nekünk! Köszönöm, de csere nem érdekel. Az ár nem alkuképes.', '2025-04-09 20:20:10'),
(4, 5, 4, 0, 'Eladnám kibővített Roland TD-17 elektromos szettemet, mivel teljesen kihasználatlanul tartogatom szinte a megvétele óta. KD-10-es lábdobbal, plusz a szett kiegészítve még 2 cinnel. Semmi mókolás, semmi módosítás, a modul alapból támogatja az 5 cint. Tapadós eredeti Roland V-drums szőnyeget is adok hozzá, duplázó pedált azt nem. Bármilyen duplázóval tökéletesen megy, semmit nem kell állítgatni hozzá, ezért is a KD-10 az egyik legjobb lábdob.', '2025-05-01 15:56:11'),
(5, 5, 5, 0, 'Eladó a 2022-ben vásárolt Marshall DSL1CR gitárkombóm kihasználatlanság miatt. Minden jól működik rajta, otthoni gyakorlásra használtam. Megtekinthető és kipróbálható előzetes egyeztetést követően Budapesten az Orange Termek-ben (1095, Budapest, Soroksári út 158-C).', '2025-06-14 08:07:06'),
(6, 2, 6, 1, 'Eladó egy Behringer X32 Core digitális keverő, kitűnő műszaki és esztétikai állapotban. Kizárólag stúdióban használt, füstmentes környezetből, soha nem turnézott.', '2025-07-22 09:13:56'),
(7, 2, 7, 0, 'Ikonikus Les Paul hangzás letisztult kivitelben. A mahagóni test és juhar top gazdag, sustainben erős tónust biztosít, a humbucker hangszedők pedig vastag, karakteres hangzást adnak. Sokoldalú elektromos gitár rock, blues és modern műfajokhoz egyaránt.', '2025-07-25 10:00:00'),
(8, 3, 8, 0, 'Prémium kategóriás klasszikus gitár a Yamaha kézműves GC szériájából. A tömör cédrus fedlap meleg, kiegyensúlyozott hangzást biztosít, amely ideális klasszikus és fingerstyle játékhoz.', '2025-07-26 10:00:00'),
(9, 4, 9, 0, 'A Clavinova sorozat egyik csúcsmodellje, amely a koncertzongora élményét digitális formában kínálja. Realisztikus billentés, prémium hangminták és modern funkciók teszik ideális választássá gyakorláshoz vagy otthoni zenéléshez.', '2025-07-27 10:00:00'),
(10, 5, 10, 0, 'Professzionális dobkészlet a legendás Starclassic Maple sorozatból. A juhar testek dinamikus, meleg és jól artikulált hangzást biztosítanak, amely stúdióban és élőben is kiváló.', '2025-07-28 10:00:00'),
(11, 5, 11, 0, '100 wattos csöves erősítő fej színpadi használatra tervezve. Több csatorna és az ISF hangszínszabályzó széles hangzásvilágot kínál a brit karaktertől az amerikai stílusig.', '2025-07-29 10:00:00'),
(12, 5, 12, 0, 'Kompakt és megbízható aktív DI-box két csatornával. Ideális hangszerek vagy vonalszintű jelek szimmetrikusítására, valamint jelosztásra élő hangosításnál vagy stúdióban.', '2025-07-30 10:00:00');

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
(1, 'fender-american-professional-ii.jpg'),
(2, 'cort-earth-70.jpg'),
(3, 'yamaha-pss-e30.jpg'),
(4, 'roland-td-07dmk.jpg'),
(5, 'marshall-dsl40cr.jpg'),
(6, 'behringer-xenxy.jpg'),
(7, 'gibson-les-paul.jpg'),
(8, 'yamaha-gc.jpg'),
(9, 'yamaha-csp.jpg'),
(10, 'tama-starclassic.jpg'),
(11, 'blackstar-ht.jpg'),
(12, 'behringer-di20.jpg');

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
('default-ad-picture', 'default-ad-picture.png', 0),
('fender-american-professional-ii.jpg', 'fender-american-professional-ii', 0),
('cort-earth-70.jpg', 'cort-earth-70', 0),
('yamaha-pss-e30.jpg', 'yamaha-pss-e30', 0),
('roland-td-07dmk.jpg', 'roland-td-07dmk', 0),
('marshall-dsl40cr.jpg', 'marshall-dsl40cr', 0),
('behringer-xenxy.jpg', 'behringer-xenxy', 0),
('gibson-les-paul.jpg', 'gibson-les-paul', 0),
('yamaha-gc.jpg', 'yamaha-gc', 0),
('yamaha-csp.jpg', 'yamaha-csp', 0),
('tama-starclassic.jpg', 'tama-starclassic', 0),
('blackstar-ht.jpg', 'blackstar-ht', 0),
('behringer-di20.jpg', 'behringer-di20', 0);

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
(6, 6, 5, 'Behringer Xenyx X2442USB keverő'),
(7, 1, 18, 'Gibson Les Paul Studio, Tobacco Burst'),
(8, 2, 45, 'Yamaha GC-12C klasszikus gitár'),
(9, 3, 45, 'Yamaha CSP-295GP PE Clavinova digitális zongora, lakk fekete'),
(10, 4, 42, 'Tama Starclassic Maple Duracover Wrap Shell Kit 4 pcs - Red Oyster/Chrome HW'),
(11, 5, 6, 'Blackstar HT Stage 100H MkIII'),
(12, 6, 5, 'Behringer Ultra-DI DI20 2-csatornás aktív DI-Box/Splitter');

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
(1, 1, 'profile_picture_1.jpg'),
(2, 2, 'profile_picture_2.jpg'),
(3, 3, 'profile_picture_3.jpg'),
(4, 4, 'profile_picture_4.jpg'),
(5, 5, 'profile_picture_5.jpg');

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
(6, 6, 1000000, 'használt'),
(7, 7, 649900, 'új'),
(8, 8, 418200, 'új'),
(9, 9, 5894070, 'használt'),
(10, 10, 1302100, 'sérült'),
(11, 11, 466400, 'sérült'),
(12, 12, 10500, 'használt');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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

-- =====================================================
-- MOCK DATA: 15 New Profiles with 2-4 Ads Each
-- =====================================================
/*
--
-- Insert 15 new users
--
INSERT INTO `users` (`id`, `is_admin`, `name`, `username`, `email`, `phone_number`, `date_of_birth`, `password`) VALUES
(6, 0, 'Kiss Gábor', 'kiss.gabor', 'kiss.gabor@example.com', '36701234567', '1995-03-15', 'jelszo5'),
(7, 0, 'Szabo Rita', 'szabo.rita', 'szabo.rita@example.com', '36302345678', '1988-07-22', 'jelszo6'),
(8, 0, 'Molnár Attila', 'molnar.attila', 'molnar.attila@example.com', '36704556789', '1992-11-05', 'jelszo7'),
(9, 0, 'Varga Katalin', 'varga.katalin', 'varga.katalin@example.com', '36703667890', '1985-01-18', 'jelszo8'),
(10, 0, 'Kovacs Dani', 'kovacs.dani', 'kovacs.dani@example.com', '36301778901', '1999-06-30', 'jelszo9'),
(11, 0, 'Nemes Zsolt', 'nemes.zsolt', 'nemes.zsolt@example.com', '36707889012', '1990-09-12', 'jelszo10'),
(12, 0, 'Farkas Júlia', 'farkas.julia', 'farkas.julia@example.com', '36309990123', '1987-04-28', 'jelszo11'),
(13, 0, 'Horvath Bence', 'horvath.bence', 'horvath.bence@example.com', '36708001234', '1993-12-03', 'jelszo12'),
(14, 0, 'Csondor Eva', 'csondor.eva', 'csondor.eva@example.com', '36302112345', '1989-05-14', 'jelszo13'),
(15, 0, 'Balazs Peter', 'balazs.peter', 'balazs.peter@example.com', '36709223456', '1991-08-25', 'jelszo14'),
(16, 0, 'Takacs Beatrix', 'takacs.beatrix', 'takacs.beatrix@example.com', '36307334567', '1986-02-11', 'jelszo15'),
(17, 0, 'Marton Tamas', 'marton.tamas', 'marton.tamas@example.com', '36704445678', '1994-10-19', 'jelszo16'),
(18, 0, 'Szendroi Andras', 'szendroi.andras', 'szendroi.andras@example.com', '36308556789', '1988-07-07', 'jelszo17'),
(19, 0, 'Bodnár Mónika', 'bodnar.monika', 'bodnar.monika@example.com', '36706667890', '1992-03-21', 'jelszo18'),
(20, 0, 'Lengyel Csaba', 'lengyel.csaba', 'lengyel.csaba@example.com', '36309778901', '1987-11-09', 'jelszo19');

--
-- Insert 15 new profiles for the new users
--
INSERT INTO `profiles` (`id`, `user_id`, `profile_picture`) VALUES
(6, 6, 'default-profile-picture.jpg'),
(7, 7, 'default-profile-picture.jpg'),
(8, 8, 'default-profile-picture.jpg'),
(9, 9, 'default-profile-picture.jpg'),
(10, 10, 'default-profile-picture.jpg'),
(11, 11, 'default-profile-picture.jpg'),
(12, 12, 'default-profile-picture.jpg'),
(13, 13, 'default-profile-picture.jpg'),
(14, 14, 'default-profile-picture.jpg'),
(15, 15, 'default-profile-picture.jpg'),
(16, 16, 'default-profile-picture.jpg'),
(17, 17, 'default-profile-picture.jpg'),
(18, 18, 'default-profile-picture.jpg'),
(19, 19, 'default-profile-picture.jpg'),
(20, 20, 'default-profile-picture.jpg');

--
-- Insert new items for mock ads
--
INSERT INTO `items` (`id`, `category_id`, `brand_id`, `name`) VALUES
(7, 1, 16, 'Fender Stratocaster HSS'),
(8, 1, 18, 'Gibson Les Paul elektromos gitár'),
(9, 5, 3, 'Ampeg BA110 basszus erősítő'),
(10, 2, 43, 'Taylor GS Mini akusztikus gitár'),
(11, 3, 24, 'Korg Volca Keys szintetizátor'),
(12, 5, 27, 'Marshall MG100HCFX fejegység'),
(13, 2, 31, 'Ortega R121 klasszikus gitár'),
(14, 4, 25, 'Ludwig Classic Maple dobfelszerelés'),
(15, 3, 36, 'Roland TR-909 drum machine'),
(16, 6, 38, 'Sennheiser e901 érzékelő mikrofon'),
(17, 1, 40, 'Squier Stratocaster elektromos gitár'),
(18, 5, 7, 'Boss Katana-50 MkII'),
(19, 4, 42, 'Tama Imperialstar dobfelszerelés'),
(20, 2, 41, 'Takamine Dreadnought Western gitár'),
(21, 3, 29, 'Moog One szintetizátor'),
(22, 5, 28, 'Mesa/Boogie Dual Rectifier Classic'),
(23, 6, 39, 'Shure SM7B stúdió mikrofon'),
(24, 1, 15, 'ESP LTD EC-256 elektromos gitár'),
(25, 4, 33, 'Pearl Masters Maple dobszett'),
(26, 2, 8, 'Bromo klasszikus akusztikus gitár'),
(27, 5, 26, 'Markbass Little Mark III basszus erősítő');

--
-- Insert used_items for the new items
--
INSERT INTO `used_items` (`id`, `item_id`, `price`, `item_condition`) VALUES
(7, 7, 95000, 'Új'),
(8, 8, 130000, 'Használt'),
(9, 9, 75000, 'Új'),
(10, 10, 200000, 'Használt'),
(11, 11, 65000, 'Sérült'),
(12, 12, 180000, 'Új'),
(13, 13, 85000, 'Használt'),
(14, 14, 350000, 'Sérült'),
(15, 15, 120000, 'Új'),
(16, 16, 45000, 'Új'),
(17, 17, 125000, 'Használt'),
(18, 18, 140000, 'Új'),
(19, 19, 280000, 'Használt'),
(20, 20, 105000, 'Új'),
(21, 21, 95000, 'Sérült'),
(22, 22, 520000, 'Új'),
(23, 23, 55000, 'Használt'),
(24, 24, 110000, 'Új'),
(25, 25, 165000, 'Használt'),
(26, 26, 75000, 'Új'),
(27, 27, 310000, 'Sérült');

--
-- Insert mock advertisements
--
INSERT INTO `advertisements` (`id`, `user_id`, `used_item_id`, `is_reported`, `description`, `date_of_ad`) VALUES
(7, 6, 7, 0, 'Szép állapotban, eredeti dobozzal és papírokkal. Van kis karc csak a test hátulján.', '2025-01-20 14:30:45'),
(8, 6, 8, 0, 'Klasszikus rock hangulat, kiváló állapot. Alkalmas kezdőknek és haladó játékosoknak is.', '2025-02-05 10:15:22'),
(9, 6, 9, 0, 'Kompakt erősítő, tökéletes szobahasználathoz. 5W, 2 csatorna, hatás processzor.', '2025-02-18 16:45:30'),
(10, 7, 10, 0, 'Prémium klasszikus gitár, mellékelt case és cleaner. Professzionális minőség.', '2025-01-15 09:20:15'),
(11, 7, 11, 1, 'Kompakt szintetizátor, 16-track sequencer, 100 hang. USB MIDI támogatás.', '2025-02-10 11:30:00'),
(12, 7, 12, 0, 'Nagy teljesítményű gitárerősítő, 100W, 2 csatorna, Reverb. Szép állapot.', '2025-02-22 13:45:20'),
(13, 8, 13, 0, 'Német kézműves dobfelszerelés, maple shell, szuperb hang. Kevés használt.', '2025-01-25 15:20:45'),
(14, 8, 14, 0, 'Fafajta струнолу, kiváló hangtartomány. Oka a vétel: hobbim vált munkává.', '2025-02-08 12:10:30'),
(15, 8, 15, 0, 'Digitális szintetizátor 61 billentyu, 900+ hang bank, USB-s conectare.', '2025-02-20 10:00:00'),
(16, 8, 16, 0, 'Profi minőségű stúdió mikrofon rendszer. Teljes kiépítés, kardioid szenzor.', '2025-03-01 14:30:15'),
(17, 9, 17, 0, 'Fender-ből licencelt közepes szintű modell. Jó intonáció, stabil frekvencia.', '2025-01-18 08:45:20'),
(18, 9, 18, 0, 'Legújabb modell, Twin Reverb kicsinyített változata. Világszínvonalú hangzás.', '2025-02-12 16:15:40'),
(19, 10, 19, 0, 'Vezetékkészlet, vintage ütős hangszerre. Kristálytiszta, réz kerek.', '2025-01-22 11:20:10'),
(20, 10, 20, 0, 'Egyedi klasszikus gitár, nádkészítés, egész fa konstrukció. 20 éves gyűjtés vége.', '2025-02-05 09:30:55'),
(21, 10, 21, 1, 'Nagy teljesítmény, ritka kínálat hazánkban. Limitált kiadás, szériaszerű.', '2025-02-25 14:50:20'),
(22, 11, 22, 0, 'Asztali erősítő Dual Rectifier kicsi modellel. Korábbi verziója, még ritkaságnak számít.', '2025-01-30 13:15:45'),
(23, 11, 23, 0, 'Stúdió mikrofon, rádiófrekv. típus. TV és rádió felvételekre ideális.', '2025-02-14 10:25:30'),
(24, 12, 24, 0, 'Elektromos gitár, közepes típus Squier licencia. Kezdőknek és haladóknak egyaránt.', '2025-01-12 15:40:15'),
(25, 12, 25, 0, 'Zenei szimbólumok, vezetékkapcsoló készlettel. Szóló és trió játékhoz egyaránt alkalmas.', '2025-02-03 12:05:00'),
(26, 12, 26, 0, 'Klasszikus dobfelszerelés, Brazília tárgyból, szép mintázat. Professzionális minőségű.', '2025-02-16 14:30:25'),
(27, 12, 27, 1, 'Ritkán talált teacsatorna erősítő, nagy teljesítménnyel. Szuperb vintage hang.', '2025-03-02 11:45:50'),
(28, 13, 7, 0, 'Szintetizátor szű oszlop szerkezettel. Rezonancia és reverb hatások. Kiváló stúdió alapegység.', '2025-01-28 09:50:35'),
(29, 13, 8, 0, 'Erősítő 50 watt, fedél nélküli típus. Moduláris felépítés, javítható az otthonában.', '2025-02-11 16:20:10'),
(30, 13, 9, 0, 'Klasszikus gitár melegfa felsővel. Világszínvonalú értékelést kapott a szakértőktől.', '2025-02-28 13:35:45'),
(31, 14, 10, 0, 'Mid-range szintetizátor 88 billentűvel, hammer akcióval. Kezdésre ideális.', '2025-02-01 10:15:20'),
(32, 14, 11, 0, 'Elektronikus dobfelszerelés, USB MIDI csatlakozás. Software included. Stúdióhoz tökéletes.', '2025-02-19 15:30:50'),
(33, 15, 12, 0, 'Prémium gitárkombó, tranzisztoros. Reverb és delay effektek. Szép hang.', '2025-01-24 14:20:35'),
(34, 15, 13, 0, 'Akusztikus gitár, western típus, Dreadnought méret. Könnyed játékhoz ideális.', '2025-02-09 11:45:15'),
(35, 15, 14, 0, 'Hangcsatornás fejegység, ritkán használt. Eredeti papírok megvannak.', '2025-02-24 09:30:40'),
(36, 16, 15, 0, 'Digitális zongora, professzionális billentyűzet. 900+ hangszín bank. Midi támogatás.', '2025-01-19 13:25:50'),
(37, 16, 16, 0, 'Kétcsatornás erősítő, szalon méretű. Nappali használathoz tökéletes.', '2025-02-06 16:10:30'),
(38, 16, 17, 0, 'Akusztikus gitár, klasszikus méret. Óvodás és gimis gyerekeknek ideális tanulsxágára.', '2025-02-21 12:40:15'),
(39, 16, 18, 0, 'Ritka dobszett, vintage 1980-as évekből. Collector szinten érdekes darab.', '2025-03-05 10:55:25'),
(40, 17, 19, 0, 'Szintetizátor, kreatív funkcióval. Loop recording, arpeggiator. Elektronikus zenéhez ideális.', '2025-01-27 11:15:45'),
(41, 17, 20, 0, 'Gitárkombó, fekete lekoat, fényes kiállapot. 30 watt teljesítmény.', '2025-02-13 14:30:20'),
(42, 17, 21, 0, 'Jazz dobfelszerelés, barna szín, vintage stílus. Джаз és blues játékosoknak ideális.', '2025-03-01 09:45:30'),
(43, 18, 22, 0, 'Professzionális stúdió mixerpult. 16 csatorna, USB audio. Felvételhez szükséges.', '2025-02-02 15:50:10'),
(44, 18, 23, 0, 'Klasszikus gitár, exportőr minőség. Exportált Spanyolországból.', '2025-02-17 10:20:45'),
(45, 19, 24, 0, 'Elektromos gitár, dél-koreaian gyártott. Semi-hollow body, klasszikus rock hangzás.', '2025-01-23 12:35:50'),
(46, 19, 25, 0, 'Gitárátalakító, digitális processzor. 100+ effekt, hangfelvétel lehetőség.', '2025-02-07 13:50:25'),
(47, 19, 26, 0, 'Dobfelszerelés bőbeszédű, kezdőknek ideális. Könnyű szállíthatóság, összecsukható.', '2025-02-23 11:15:40'),
(48, 19, 27, 0, 'Szintetizátor MIDI szerverezéshez. Moduláris felépítés, bővíthetô.', '2025-03-03 15:40:15'),
(49, 20, 7, 0, 'Mini pianista, kompakt elektromos zongora. Bluetooth lezárással. Hordozható.', '2025-01-21 14:25:35'),
(50, 20, 8, 0, 'Gitárkombó vintage alapegész. Bútor ajánlott az állásból, kifutott modell.', '2025-02-08 16:05:50'),
(51, 20, 9, 0, 'Akusztikus gitár Western típus, professzionális gitárista készítette. Ritkaságigényes.', '2025-02-26 09:30:20');

--
-- Link new ads to file IDs (using default-ad-picture for all)
--
INSERT INTO `ad_files` (`ad_id`, `file_id`) VALUES
(7, 'default-ad-picture'),
(8, 'default-ad-picture'),
(9, 'default-ad-picture'),
(10, 'default-ad-picture'),
(11, 'default-ad-picture'),
(12, 'default-ad-picture'),
(13, 'default-ad-picture'),
(14, 'default-ad-picture'),
(15, 'default-ad-picture'),
(16, 'default-ad-picture'),
(17, 'default-ad-picture'),
(18, 'default-ad-picture'),
(19, 'default-ad-picture'),
(20, 'default-ad-picture'),
(21, 'default-ad-picture'),
(22, 'default-ad-picture'),
(23, 'default-ad-picture'),
(24, 'default-ad-picture'),
(25, 'default-ad-picture'),
(26, 'default-ad-picture'),
(27, 'default-ad-picture'),
(28, 'default-ad-picture'),
(29, 'default-ad-picture'),
(30, 'default-ad-picture'),
(31, 'default-ad-picture'),
(32, 'default-ad-picture'),
(33, 'default-ad-picture'),
(34, 'default-ad-picture'),
(35, 'default-ad-picture'),
(36, 'default-ad-picture'),
(37, 'default-ad-picture'),
(38, 'default-ad-picture'),
(39, 'default-ad-picture'),
(40, 'default-ad-picture'),
(41, 'default-ad-picture'),
(42, 'default-ad-picture'),
(43, 'default-ad-picture'),
(44, 'default-ad-picture'),
(45, 'default-ad-picture'),
(46, 'default-ad-picture'),
(47, 'default-ad-picture'),
(48, 'default-ad-picture'),
(49, 'default-ad-picture'),
(50, 'default-ad-picture'),
(51, 'default-ad-picture');

--
-- Add profile votes for realism
--
INSERT INTO `profile_votes` (`profile_id`, `voter_user_id`, `vote`) VALUES
(6, 2, 1),
(6, 3, 1),
(7, 4, 1),
(8, 5, 1),
(8, 2, -1),
(9, 3, 1),
(10, 2, 1),
(10, 4, 1),
(11, 5, 1),
(12, 2, 1),
(12, 3, 1),
(13, 4, 1),
(14, 2, 1),
(15, 3, 1),
(15, 4, 1),
(16, 5, 1),
(16, 2, 1),
(17, 3, 1),
(18, 2, 1),
(19, 4, 1),
(20, 5, 1);
*/
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
