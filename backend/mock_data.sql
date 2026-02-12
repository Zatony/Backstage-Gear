-- Mock Data for Backstage Gear Database
-- Adds 15 new profiles with 2-4 ads each

-- Insert 15 new users
INSERT INTO users (id, is_admin, name, username, email, phone_number, date_of_birth, password)
VALUES
(NULL, 0, 'Kiss Gábor', 'kiss.gabor', 'kiss.gabor@example.com', '36701234567', '1995-03-15', 'jelszo5'),
(NULL, 0, 'Szabo Rita', 'szabo.rita', 'szabo.rita@example.com', '36302345678', '1988-07-22', 'jelszo6'),
(NULL, 0, 'Molnár Attila', 'molnar.attila', 'molnar.attila@example.com', '36704556789', '1992-11-05', 'jelszo7'),
(NULL, 0, 'Varga Katalin', 'varga.katalin', 'varga.katalin@example.com', '36703667890', '1985-01-18', 'jelszo8'),
(NULL, 0, 'Kovacs Dani', 'kovacs.dani', 'kovacs.dani@example.com', '36301778901', '1999-06-30', 'jelszo9'),
(NULL, 0, 'Nemes Zsolt', 'nemes.zsolt', 'nemes.zsolt@example.com', '36707889012', '1990-09-12', 'jelszo10'),
(NULL, 0, 'Farkas Júlia', 'farkas.julia', 'farkas.julia@example.com', '36309990123', '1987-04-28', 'jelszo11'),
(NULL, 0, 'Horvath Bence', 'horvath.bence', 'horvath.bence@example.com', '36708001234', '1993-12-03', 'jelszo12'),
(NULL, 0, 'Csondor Eva', 'csondor.eva', 'csondor.eva@example.com', '36302112345', '1989-05-14', 'jelszo13'),
(NULL, 0, 'Balazs Peter', 'balazs.peter', 'balazs.peter@example.com', '36709223456', '1991-08-25', 'jelszo14'),
(NULL, 0, 'Takacs Beatrix', 'takacs.beatrix', 'takacs.beatrix@example.com', '36307334567', '1986-02-11', 'jelszo15'),
(NULL, 0, 'Marton Tamas', 'marton.tamas', 'marton.tamas@example.com', '36704445678', '1994-10-19', 'jelszo16'),
(NULL, 0, 'Szendroi Andras', 'szendroi.andras', 'szendroi.andras@example.com', '36308556789', '1988-07-07', 'jelszo17'),
(NULL, 0, 'Bodnár Mónika', 'bodnar.monika', 'bodnar.monika@example.com', '36706667890', '1992-03-21', 'jelszo18'),
(NULL, 0, 'Lengyel Csaba', 'lengyel.csaba', 'lengyel.csaba@example.com', '36309778901', '1987-11-09', 'jelszo19');

-- Insert 15 new profiles for the new users (user_id 6-20)
INSERT INTO profiles (id, user_id)
VALUES
(NULL, 6),
(NULL, 7),
(NULL, 8),
(NULL, 9),
(NULL, 10),
(NULL, 11),
(NULL, 12),
(NULL, 13),
(NULL, 14),
(NULL, 15),
(NULL, 16),
(NULL, 17),
(NULL, 18),
(NULL, 19),
(NULL, 20);

-- Insert items for new ads (user 6 - Kiss Gábor)
INSERT INTO items (id, category_id, brand_id, name) VALUES
(NULL, 1, 40, 'Squier Stratocaster HSS'),
(NULL, 1, 22, 'Jackson JS22 elektromos gitár'),
(NULL, 5, 6, 'Blackstar HT-5 tranzisztoros erősítő'),
(NULL, 1, 43, 'Taylor GS Mini akusztikus gitár'),
(NULL, 3, 24, 'Korg Volca Keys szintetizátor'),
(NULL, 5, 27, 'Marshall MG100HCFX fejegység'),
(NULL, 2, 31, 'Ortega R121 klasszikus gitár'),
(NULL, 4, 25, 'Ludwig Classic Maple ezüst dobfelszerelés'),
(NULL, 3, 36, 'Yamaha MX88 digitális zongora'),
(NULL, 6, 38, 'Sennheiser e901 érzékelő mikrofon'),
(NULL, 1, 35, 'PRS SE Custom elektromos gitár'),
(NULL, 5, 7, 'Boss Katana-50 MkII'),
(NULL, 4, 42, 'Tama Imperialstar bokeh dobfelszerelés'),
(NULL, 2, 32, 'Pasadena SG160 Western gitár'),
(NULL, 3, 45, 'Yamaha PSR-E463 szintetizátor'),
(NULL, 5, 28, 'Mesa/Boogie Dual Rectifier Classic'),
(NULL, 6, 39, 'Shure SM7B mikrofon'),
(NULL, 1, 14, 'Epiphone SG Special elektromos gitár'),
(NULL, 4, 33, 'Zildjian K Custom szett'),
(NULL, 2, 8, 'Bromo akusztikus gitár'),
(NULL, 5, 20, 'Hiwatt SE100 teacsatorna');

-- Insert used_items for the new items
INSERT INTO used_items (id, item_id, price, item_condition) VALUES
(NULL, 7, 95000, 'új'),
(NULL, 8, 130000, 'használt'),
(NULL, 9, 75000, 'új'),
(NULL, 10, 200000, 'használt'),
(NULL, 11, 65000, 'sérült'),
(NULL, 12, 180000, 'új'),
(NULL, 13, 85000, 'használt'),
(NULL, 14, 350000, 'sérült'),
(NULL, 15, 120000, 'új'),
(NULL, 16, 45000, 'új'),
(NULL, 17, 125000, 'használt'),
(NULL, 18, 140000, 'új'),
(NULL, 19, 280000, 'használt'),
(NULL, 20, 105000, 'új'),
(NULL, 21, 95000, 'sérült'),
(NULL, 22, 520000, 'új'),
(NULL, 23, 55000, 'használt'),
(NULL, 24, 110000, 'új'),
(NULL, 25, 165000, 'használt'),
(NULL, 26, 75000, 'új'),
(NULL, 27, 310000, 'sérült');

-- Insert advertisements for Kiss Gábor (user 6) - 3 ads
INSERT INTO advertisements (id, user_id, used_item_id, is_reported, description, date_of_ad) VALUES
(NULL, 6, 7, FALSE, 'Szép állapotban, eredeti dobozzal és papírokkal. Van kis karc csak a test hátulján.', '2025-01-20 14:30:45'),
(NULL, 6, 8, FALSE, 'Klasszikus rock hangulat, kiváló állapot. Alkalmas kezdőknek és haladó játékosoknak is.', '2025-02-05 10:15:22'),
(NULL, 6, 9, FALSE, 'Kompakt erősítő, tökéletes szobahasználathoz. 5W, 2 csatorna, hatás processzor.', '2025-02-18 16:45:30');

-- Insert advertisements for Szabo Rita (user 7) - 3 ads
INSERT INTO advertisements (id, user_id, used_item_id, is_reported, description, date_of_ad) VALUES
(NULL, 7, 10, FALSE, 'Prémium klasszikus gitár, mellékelt case és cleaner. Professzionális minőség.', '2025-01-15 09:20:15'),
(NULL, 7, 11, TRUE, 'Kompakt szintetizátor, 16-track sequencer, 100 hang. USB MIDI támogatás.', '2025-02-10 11:30:00'),
(NULL, 7, 12, FALSE, 'Nagy teljesítményű gitárerősítő, 100W, 2 csatorna, Reverb. Szép állapot.', '2025-02-22 13:45:20');

-- Insert advertisements for Molnár Attila (user 8) - 4 ads
INSERT INTO advertisements (id, user_id, used_item_id, is_reported, description, date_of_ad) VALUES
(NULL, 8, 13, FALSE, 'Német kézműves dobfelszerelés, maple shell, szuperb hang. Kevés használt.', '2025-01-25 15:20:45'),
(NULL, 8, 14, FALSE, 'Fafajta струнолу, kiváló hangtartomány. Oka a vétel: hobbim vált munkává.', '2025-02-08 12:10:30'),
(NULL, 8, 15, FALSE, 'Digitális szintetizátor 61 billentyu, 900+ hang bank, USB-s conectare.', '2025-02-20 10:00:00'),
(NULL, 8, 16, FALSE, 'Profi minőségű stúdió mikrofon rendszer. Teljes kiépítés, kardioid szenzor.', '2025-03-01 14:30:15');

-- Insert advertisements for Varga Katalin (user 9) - 2 ads
INSERT INTO advertisements (id, user_id, used_item_id, is_reported, description, date_of_ad) VALUES
(NULL, 9, 17, FALSE, 'Fender-ből licencelt közepes szintű modell. Jó intonáció, stabil frekvencia.', '2025-01-18 08:45:20'),
(NULL, 9, 18, FALSE, 'Legújabb modell, Twin Reverb kicsinyített változata. Világszínvonalú hangzás.', '2025-02-12 16:15:40');

-- Insert advertisements for Kovacs Dani (user 10) - 3 ads
INSERT INTO advertisements (id, user_id, used_item_id, is_reported, description, date_of_ad) VALUES
(NULL, 10, 19, FALSE, 'Vezetékkészlet, vintage ütős hangszerre. Kristálytiszta, réz kerek.', '2025-01-22 11:20:10'),
(NULL, 10, 20, FALSE, 'Egyedi klasszikus gitár, nádkészítés, egész fa konstrukció. 20 éves gyűjtés vége.', '2025-02-05 09:30:55'),
(NULL, 10, 21, TRUE, 'Nagy teljesítmény, ritka kínálat hazánkban. Limitált kiadás, szériaszerű.', '2025-02-25 14:50:20');

-- Insert advertisements for Nemes Zsolt (user 11) - 2 ads
INSERT INTO advertisements (id, user_id, used_item_id, is_reported, description, date_of_ad) VALUES
(NULL, 11, 22, FALSE, 'Asztali erősítő Dual Rectifier kicsi modellel. Korábbi verziója, még ritkaságnak számít.', '2025-01-30 13:15:45'),
(NULL, 11, 23, FALSE, 'Stúdió mikrofon, rádiófrekv. típus. TV és rádió felvételekre ideális.', '2025-02-14 10:25:30');

-- Insert advertisements for Farkas Júlia (user 12) - 4 ads
INSERT INTO advertisements (id, user_id, used_item_id, is_reported, description, date_of_ad) VALUES
(NULL, 12, 24, FALSE, 'Elektromos gitár, közepes típus Squier licencia. Kezdőknek és haladóknak egyaránt.', '2025-01-12 15:40:15'),
(NULL, 12, 25, FALSE, 'Zenei szimbólumok, vezetékkapcsoló készlettel. Szóló és trió játékhoz egyaránt alkalmas.', '2025-02-03 12:05:00'),
(NULL, 12, 26, FALSE, 'Klasszikus dobfelszerelés, Brazília tárgyból, szép mintázat. Professzionális minőségű.', '2025-02-16 14:30:25'),
(NULL, 12, 27, TRUE, 'Ritkán talált teacsatorna erősítő, nagy teljesítménnyel. Szuperb vintage hang.', '2025-03-02 11:45:50');

-- Insert advertisements for Horvath Bence (user 13) - 3 ads
INSERT INTO advertisements (id, user_id, used_item_id, is_reported, description, date_of_ad) VALUES
(NULL, 13, 28, FALSE, 'Szintetizátor szű oszlop szerkezettel. Rezonancia és reverb hatások. Kiváló stúdió alapegység.', '2025-01-28 09:50:35'),
(NULL, 13, 29, FALSE, 'Erősítő 50 watt, fedél nélküli típus. Moduláris felépítés, javítható az otthonában.', '2025-02-11 16:20:10'),
(NULL, 13, 30, FALSE, 'Klasszikus gitár melegfa felsővel. Világszínvonalú értékelést kapott a szakértőktől.', '2025-02-28 13:35:45');

-- Insert advertisements for Csondor Eva (user 14) - 2 ads
INSERT INTO advertisements (id, user_id, used_item_id, is_reported, description, date_of_ad) VALUES
(NULL, 14, 31, FALSE, 'Mid-range szintetizátor 88 billentűvel, hammer akcióval. Kezdésre ideális.', '2025-02-01 10:15:20'),
(NULL, 14, 32, FALSE, 'Elektronikus dobfelszerelés, USB MIDI csatlakozás. Software included. Stúdióhoz tökéletes.', '2025-02-19 15:30:50');

-- Insert advertisements for Balazs Peter (user 15) - 3 ads
INSERT INTO advertisements (id, user_id, used_item_id, is_reported, description, date_of_ad) VALUES
(NULL, 15, 33, FALSE, 'Prémium gitárkombó, tranzisztoros. Reverb és delay effektek. Szép hang.', '2025-01-24 14:20:35'),
(NULL, 15, 34, FALSE, 'Akusztikus gitár, western típus, Dreadnought méret. Könnyed játékhoz ideális.', '2025-02-09 11:45:15'),
(NULL, 15, 35, FALSE, 'Hangcsatornás fejegység, ritkán használt. Eredeti papírok megvannak.', '2025-02-24 09:30:40');

-- Insert advertisements for Takacs Beatrix (user 16) - 4 ads
INSERT INTO advertisements (id, user_id, used_item_id, is_reported, description, date_of_ad) VALUES
(NULL, 16, 36, FALSE, 'Digitális zongora, professzionális billentyűzet. 900+ hangszín bank. Midi támogatás.', '2025-01-19 13:25:50'),
(NULL, 16, 37, FALSE, 'Kétcsatornás erősítő, szalon méretű. Nappali használathoz tökéletes.', '2025-02-06 16:10:30'),
(NULL, 16, 38, FALSE, 'Akusztikus gitár, klasszikus méret. Óvodás és gimis gyerekeknek ideális tanulsxágára.', '2025-02-21 12:40:15'),
(NULL, 16, 39, FALSE, 'Ritka dobszett, vintage 1980-as évekből. Collector szinten érdekes darab.', '2025-03-05 10:55:25');

-- Insert advertisements for Marton Tamas (user 17) - 3 ads
INSERT INTO advertisements (id, user_id, used_item_id, is_reported, description, date_of_ad) VALUES
(NULL, 17, 40, FALSE, 'Szintetizátor, kreatív funkcióval. Loop recording, arpeggiator. Elektronikus zenéhez ideális.', '2025-01-27 11:15:45'),
(NULL, 17, 41, FALSE, 'Gitárkombó, fekete lekoat, fényes kiállapot. 30 watt teljesítmény.', '2025-02-13 14:30:20'),
(NULL, 17, 42, FALSE, 'Jazz dobfelszerelés, barna szín, vintage stílus. Джаз és blues játékosoknak ideális.', '2025-03-01 09:45:30');

-- Insert advertisements for Szendroi Andras (user 18) - 2 ads
INSERT INTO advertisements (id, user_id, used_item_id, is_reported, description, date_of_ad) VALUES
(NULL, 18, 43, FALSE, 'Professzionális stúdió mixerpult. 16 csatorna, USB audio. Felvételhez szükséges.', '2025-02-02 15:50:10'),
(NULL, 18, 44, FALSE, 'Klasszikus gitár, exportőr minőség. Exportált Spanyolországból.', '2025-02-17 10:20:45');

-- Insert advertisements for Bodnár Mónika (user 19) - 4 ads
INSERT INTO advertisements (id, user_id, used_item_id, is_reported, description, date_of_ad) VALUES
(NULL, 19, 45, FALSE, 'Elektromos gitár, dél-koreaian gyártott. Semi-hollow body, klasszikus rock hangzás.', '2025-01-23 12:35:50'),
(NULL, 19, 46, FALSE, 'Gitárátalakító, digitális processzor. 100+ effekt, hangfelvétel lehetőség.', '2025-02-07 13:50:25'),
(NULL, 19, 47, FALSE, 'Dobfelszerelés bőbeszédű, kezdőknek ideális. Könnyű szállíthatóság, összecsukható.', '2025-02-23 11:15:40'),
(NULL, 19, 48, FALSE, 'Szintetizátor MIDI szerverezéshez. Moduláris felépítés, bővíthetô.', '2025-03-03 15:40:15');

-- Insert advertisements for Lengyel Csaba (user 20) - 3 ads
INSERT INTO advertisements (id, user_id, used_item_id, is_reported, description, date_of_ad) VALUES
(NULL, 20, 49, FALSE, 'Mini pianista, kompakt elektromos zongora. Bluetooth lezárással. Hordozható.', '2025-01-21 14:25:35'),
(NULL, 20, 50, FALSE, 'Gitárkombó vintage alapegész. Bútor ajánlott az állásból, kifutott modell.', '2025-02-08 16:05:50'),
(NULL, 20, 51, FALSE, 'Akusztikus gitár Western típus, professzionális gitárista készítette. Ritkaságigényes.', '2025-02-26 09:30:20');

-- Link new ads to file IDs (using default-ad-picture for all)
INSERT INTO ad_files (ad_id, file_id)
SELECT id, 'default-ad-picture' FROM advertisements WHERE id >= 7;

-- Add some votes to new profiles for realism
INSERT INTO profile_votes (profile_id, voter_user_id, vote) VALUES
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
