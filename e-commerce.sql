
CREATE TABLE cart (
    id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    size character varying NOT NULL,
    customer_username character varying NOT NULL
);

CREATE SEQUENCE cart_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE TABLE category (
    id integer NOT NULL,
    title character varying NOT NULL
);

CREATE TABLE customer (
    id integer NOT NULL,
    username character varying(20) NOT NULL,
    first_name character varying(20) NOT NULL,
    last_name character varying(20) NOT NULL,
    email character varying(31) NOT NULL,
    phone character varying(20) NOT NULL,
    password character varying NOT NULL,
    registered date NOT NULL,
    appartment_nr character varying(10),
    street character varying(15),
    city character varying(20),
    province character varying(20),
    zip integer,
    country character varying(15)
);

CREATE SEQUENCE customer_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE manufacturer (
    id integer NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL,
    logo_url character varying NOT NULL
);

CREATE TABLE order_item (
    id integer NOT NULL,
    shippment_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    size character varying NOT NULL,
    unit_price_eur integer NOT NULL
);

CREATE SEQUENCE order_item_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE TABLE picture (
    id integer NOT NULL,
    product_id integer NOT NULL,
    url character varying NOT NULL
);


CREATE TABLE product (
    id integer NOT NULL,
    manufacturer_id integer NOT NULL,
    category_id integer NOT NULL,
    title character varying NOT NULL,
    description character varying,
    color character varying NOT NULL,
    unit_price_eur integer NOT NULL,
    gender character varying NOT NULL,
    thumbnail_url character varying NOT NULL,
    material character varying NOT NULL
);

CREATE TABLE shippment (
    id integer NOT NULL,
    date_utc timestamp without time zone NOT NULL,
    total_eur integer NOT NULL,
    payment boolean,
    customer_username character varying NOT NULL,
    to_appartment character varying NOT NULL,
    to_street character varying NOT NULL,
    to_city character varying NOT NULL,
    to_province character varying NOT NULL,
    to_zip integer NOT NULL,
    to_country character varying NOT NULL
);

CREATE SEQUENCE shippment_sequence
    START WITH 1000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE TABLE size (
    id integer NOT NULL,
    size character varying NOT NULL,
    quantity integer,
    product_id integer NOT NULL
);

INSERT INTO cart (id, product_id, quantity, size, customer_username) VALUES (1, 1, 1, 'S/M', 'Ezayji');

INSERT INTO category (id, title) VALUES (1, 'Hats');
INSERT INTO category (id, title) VALUES (2, 'Pants');
INSERT INTO category (id, title) VALUES (3, 'Jackets');
INSERT INTO category (id, title) VALUES (4, 'Shirts');
INSERT INTO category (id, title) VALUES (5, 'Socks');

INSERT INTO customer (id, username, first_name, last_name, email, phone, password, registered, appartment_nr, street, city, province, zip, country) VALUES (1, 'Ezayji', 'Alex-Christopher', 'Koppel', 'akoppel2@gmail.com', '+372 53494198', '$2a$06$MYtwHKWFMkfi.uOQYAJp3O05YcOVIGUXd/7R/nytm7VULekWiQvv2', '2021-02-01', '1', 'somestreet', 'somecity', 'someprovince', 76607, 'highrize');
INSERT INTO customer (id, username, first_name, last_name, email, phone, password, registered, appartment_nr, street, city, province, zip, country) VALUES (2, 'Revarz', 'Selna', 'Kaszk', 'selnaknewemail@testapi.com', '+372 99999999', '$2b$10$5B/Nweqh5O0fFsKJbBZ5MumpPnGMVymUvkoplK6ZKftz0lgloy9T.', '2021-03-21', '1', 'somestreet', 'somecity', 'someprovince', 75607, 'highrise');


INSERT INTO manufacturer (id, title, description, logo_url) VALUES (3, 'RIPNDIP', 'RIPNDIP is a Los Angeles based clothing brand originally founded in Orlando, Florida in 2009 by Ryan O''Connor. They have a very specific voice and it often focuses on eccentric designs that aren''t afraid to stray from the norm. If that sounds like you, and hopefully it does, then pick up some of their gear and keep ripping and dipping, or vice versa.', 'https://i.imgur.com/A0iketK.png');
INSERT INTO manufacturer (id, title, description, logo_url) VALUES (1, 'Carhartt WIP', 'Carhartt Work In Progress (Carhartt WIP) forms a division of the American brand Carhartt, one of the first companies to pioneer workwear in the USA. Founded in Europe in 1989, 100 years after Hamilton Carhartt established his business in Detroit, Carhartt WIP has been carefully adapting and modifying Carhartt''s core product characteristics for a different audience of consumers who value refined design and quality while still remaining true to Carhartt''s brand origins. Since the beginning, Carhartt WIP have built a strong, organic relationship with unknown, inspiring, provocative and upcoming figures in music and sport, becoming an iconic and well respected brand in underground scenes, from hip-hop to skate, from graffiti to cycling, as well as working with labels such as A.P.C., Neighborhood, Patta, Vans, Junya Watanabe and many more.', 'https://i.imgur.com/hLZmOg6.png');
INSERT INTO manufacturer (id, title, description, logo_url) VALUES (2, 'Edwin', 'Founded in Tokyo in 1947, Edwin was born out of one man''s passion for jeans. Yonehachi Tsunemi was a denim aficionado who imported jeans from the United States, as there were no manufacturers in Japan at that time. By 1961, the brand was crafting its own denim, and in 1963, created what was then the world''s heaviest ringspun version. Always forward-thinking and innovative, Edwin also claims to have invented the "old wash" (a way to make new jeans look and feel worn in) in the 1970s and stone-washing in the 1980s.', 'https://i.imgur.com/3IDxFMQ.png');
INSERT INTO manufacturer (id, title, description, logo_url) VALUES (4, 'Stüssy', 'Shawn Stüssy was a surfer who used to shape his own boards for friends and locals in Laguna Beach, California. Stüssy began screening t-shirts and shorts to sell along with the surfboards as a form of promotion; his surname written in a graffiti-influenced hand style was to become the company logo. Stüssy inadvertently fell into the clothing business through his deep-rooted love of surfing, and in a few short years, people were talking within the small, insular world of surf and skateboarding in the late ''80s. Shawn set up small showrooms in New York and California and hit the road, showing his designs to stores he respected.', 'https://i.imgur.com/0qJTIZW.png');

INSERT INTO shippment (id, date_utc, total_eur, payment, customer_username, to_appartment, to_street, to_city, to_province, to_zip, to_country) VALUES (1000, '2021-02-09 13:23:33.770534', 12, true, 'Ezayji', '1', 'somestreet', 'somecity', 'someprovince', 76607, 'highrize');

INSERT INTO order_item (id, shippment_id, product_id, quantity, size, unit_price_eur) VALUES (1, 1000, 20, 1, 'Universal', 12);


INSERT INTO picture (id, product_id, url) VALUES (1, 1, 'https://i.imgur.com/Ya41ell.jpg');
INSERT INTO picture (id, product_id, url) VALUES (2, 1, 'https://i.imgur.com/JKKshEy.jpg');
INSERT INTO picture (id, product_id, url) VALUES (3, 2, 'https://i.imgur.com/p7Dvx6k.jpg');
INSERT INTO picture (id, product_id, url) VALUES (4, 2, 'https://i.imgur.com/ly9yplN.jpg');
INSERT INTO picture (id, product_id, url) VALUES (5, 3, 'https://i.imgur.com/HNkshLj.jpg');
INSERT INTO picture (id, product_id, url) VALUES (6, 3, 'https://i.imgur.com/ajZIlzK.jpg');
INSERT INTO picture (id, product_id, url) VALUES (7, 4, 'https://i.imgur.com/cZE84bq.jpg');
INSERT INTO picture (id, product_id, url) VALUES (8, 4, 'https://i.imgur.com/SVIbcvp.jpg');
INSERT INTO picture (id, product_id, url) VALUES (9, 5, 'https://i.imgur.com/hd5Bv6R.jpg');
INSERT INTO picture (id, product_id, url) VALUES (10, 5, 'https://i.imgur.com/DLzX1kg.jpg');
INSERT INTO picture (id, product_id, url) VALUES (11, 6, 'https://i.imgur.com/x00103j.jpg');
INSERT INTO picture (id, product_id, url) VALUES (12, 6, 'https://i.imgur.com/Z15dNaG.jpg');
INSERT INTO picture (id, product_id, url) VALUES (13, 7, 'https://i.imgur.com/36aKVdt.jpg');
INSERT INTO picture (id, product_id, url) VALUES (14, 7, 'https://i.imgur.com/8iEZSg7.jpg');
INSERT INTO picture (id, product_id, url) VALUES (15, 7, 'https://i.imgur.com/cl4DRVN.jpg');
INSERT INTO picture (id, product_id, url) VALUES (16, 8, 'https://i.imgur.com/AFak30K.jpg');
INSERT INTO picture (id, product_id, url) VALUES (17, 8, 'https://i.imgur.com/N0L3Hfl.jpg');
INSERT INTO picture (id, product_id, url) VALUES (18, 9, 'https://i.imgur.com/DkdaVrY.jpg');
INSERT INTO picture (id, product_id, url) VALUES (20, 10, 'https://i.imgur.com/mOc5Fag.jpg');
INSERT INTO picture (id, product_id, url) VALUES (21, 10, 'https://i.imgur.com/Bus0Ysm.jpg');
INSERT INTO picture (id, product_id, url) VALUES (22, 11, 'https://i.imgur.com/bVUFGAI.jpg');
INSERT INTO picture (id, product_id, url) VALUES (23, 11, 'https://i.imgur.com/AVqPoVo.jpg');
INSERT INTO picture (id, product_id, url) VALUES (24, 12, 'https://i.imgur.com/ZNOFhdd.jpg');
INSERT INTO picture (id, product_id, url) VALUES (25, 12, 'https://i.imgur.com/y62NCWn.jpg');
INSERT INTO picture (id, product_id, url) VALUES (26, 13, 'https://i.imgur.com/RMGhXj1.jpg');
INSERT INTO picture (id, product_id, url) VALUES (27, 13, 'https://i.imgur.com/svxQKP3.jpg');
INSERT INTO picture (id, product_id, url) VALUES (28, 14, 'https://i.imgur.com/NevFbgd.jpg');
INSERT INTO picture (id, product_id, url) VALUES (29, 14, 'https://i.imgur.com/dPNC6k8.jpg');
INSERT INTO picture (id, product_id, url) VALUES (30, 15, 'https://i.imgur.com/zAjozTJ.jpg');
INSERT INTO picture (id, product_id, url) VALUES (31, 15, 'https://i.imgur.com/V2Dp7YP.jpg');
INSERT INTO picture (id, product_id, url) VALUES (32, 16, 'https://i.imgur.com/6irdDo5.jpg');
INSERT INTO picture (id, product_id, url) VALUES (33, 16, 'https://i.imgur.com/MXv3Uzg.jpg');
INSERT INTO picture (id, product_id, url) VALUES (34, 17, 'https://i.imgur.com/PopmJ26.jpg');
INSERT INTO picture (id, product_id, url) VALUES (35, 17, 'https://i.imgur.com/pN467jY.jpg');
INSERT INTO picture (id, product_id, url) VALUES (36, 18, 'https://i.imgur.com/nJJrekd.jpg');
INSERT INTO picture (id, product_id, url) VALUES (19, 9, 'https://i.imgur.com/sKAJb1H.jpg');
INSERT INTO picture (id, product_id, url) VALUES (37, 18, 'https://i.imgur.com/J8dPA9L.jpg');
INSERT INTO picture (id, product_id, url) VALUES (38, 19, 'https://i.imgur.com/iJr0qU0.jpg');
INSERT INTO picture (id, product_id, url) VALUES (39, 19, 'https://i.imgur.com/EaERJwS.jpg');
INSERT INTO picture (id, product_id, url) VALUES (40, 20, 'https://i.imgur.com/RWmYm4J.jpg');
INSERT INTO picture (id, product_id, url) VALUES (41, 20, 'https://i.imgur.com/1xbuyiw.jpg');

INSERT INTO product (id, manufacturer_id, category_id, title, description, color, unit_price_eur, gender, thumbnail_url, material) VALUES (1, 4, 1, 'Stock Bucket Hat', 'Classic Fit Bucket Hat With Stock Logo Embroidery', 'Black', 50, 'uni', 'https://i.imgur.com/Ya41ell.jpg', '100% Cotton');
INSERT INTO product (id, manufacturer_id, category_id, title, description, color, unit_price_eur, gender, thumbnail_url, material) VALUES (2, 4, 1, 'Stock Bucket Hat', 'Classic Fit Bucket Hat With Stock Logo Embroidery', 'Red', 50, 'uni', 'https://i.imgur.com/p7Dvx6k.jpg', '100% Cotton');
INSERT INTO product (id, manufacturer_id, category_id, title, description, color, unit_price_eur, gender, thumbnail_url, material) VALUES (3, 4, 1, 'Basic Cuff Beanie', 'Classic Fit Rib Knit Beanie With Embroidered Logo On Cuff', 'Black', 35, 'uni', 'https://i.imgur.com/HNkshLj.jpg', '100% Acrylic');
INSERT INTO product (id, manufacturer_id, category_id, title, description, color, unit_price_eur, gender, thumbnail_url, material) VALUES (4, 4, 1, 'Basic Cuff Beanie', 'Classic Fit Rib Knit Beanie With Embroidered Logo On Cuff', 'Red', 35, 'uni', 'https://i.imgur.com/cZE84bq.jpg', '100% Acrylic');
INSERT INTO product (id, manufacturer_id, category_id, title, description, color, unit_price_eur, gender, thumbnail_url, material) VALUES (5, 3, 1, 'Praying Hands Dad Hat', 'Praying Hands Dad Hat With Praying Hands Graphic On Front', 'Black', 34, 'uni', 'https://i.imgur.com/hd5Bv6R.jpg', '100% Cotton');
INSERT INTO product (id, manufacturer_id, category_id, title, description, color, unit_price_eur, gender, thumbnail_url, material) VALUES (6, 3, 1, 'Lord Nermal Bucket Hat', 'Bucket Hat With Lord Nermal Patch', 'Tie Dye', 43, 'uni', 'https://i.imgur.com/x00103j.jpg', '100% Polyester');
INSERT INTO product (id, manufacturer_id, category_id, title, description, color, unit_price_eur, gender, thumbnail_url, material) VALUES (7, 3, 2, 'Psychedelic Sweat Pants', 'RIPNDIP Psychedelic Sweatpants cuz you keep it trippy. These sweatpants are tie dye with mushroom graphics.', 'Tie Dye', 57, 'uni', 'https://i.imgur.com/36aKVdt.jpg', '100% Cotton');
INSERT INTO product (id, manufacturer_id, category_id, title, description, color, unit_price_eur, gender, thumbnail_url, material) VALUES (8, 1, 2, 'Runa Pant', 'The Women''s Runa Pant is a midweight wool chino pant constructed in ''Peoria'' stretch wool for F/W20. The garment features a regular waist, a straight fit and stretch for a tailored fit unique to the wearer.', 'Specter Check Boysenberry', 150, 'women', 'https://i.imgur.com/AFak30K.jpg', '60/38/2% Wool/Polyester/Lycra® ''Peoria'' Stretch Wool, 6.8 oz');
INSERT INTO product (id, manufacturer_id, category_id, title, description, color, unit_price_eur, gender, thumbnail_url, material) VALUES (14, 3, 4, 'Lord Nermal Pocket Tee', 'Regular fit short sleeve tee from Ripndip. An element of surprise with the Nermal cat print under chest pocket.', 'Tie Dye', 32, 'uni', 'https://i.imgur.com/NevFbgd.jpg', '100% Cotton Tee');
INSERT INTO product (id, manufacturer_id, category_id, title, description, color, unit_price_eur, gender, thumbnail_url, material) VALUES (9, 2, 2, 'Loose Straight Jeans', 'The ''Made in Japan'' Collection offers a unique product with no direct competition in terms of quality, price point and a ''Made in Japan'' provenance. Accommodating the more traditional aspects of the premium Japanese denim collection, the Loose Straight Jeans is made from a 14oz Nihon Menpu, Black Rainbow selvage fabric.', 'Black', 180, 'men', 'https://i.imgur.com/DkdaVrY.jpg', '100% Cotton');
INSERT INTO product (id, manufacturer_id, category_id, title, description, color, unit_price_eur, gender, thumbnail_url, material) VALUES (10, 1, 3, 'Brooke Coat', 'The Women''s Brooke Coat is made from hard-wearing organic cotton Dearborn Canvas. This long heavyweight quilted jacket features horizontal quilted nylon taffeta lining and ethical artificial down interior for maximum warmth. The garment also features rib-knit storm cuffs, adjustable bottom band and understated Carhartt WIP labelling.', 'Black', 350, 'women', 'https://i.imgur.com/mOc5Fag.jpg', '100% Organic Cotton ''Dearborn'' Canvas, 12 oz');
INSERT INTO product (id, manufacturer_id, category_id, title, description, color, unit_price_eur, gender, thumbnail_url, material) VALUES (11, 1, 3, 'Nimbus Pullover', 'The classic Nimbus Pullover updated for the winter months with a fleece lining. Created in a fully-breathable nylon supplex fabric with a teflon coating, it dries fast and provides protection from wind and rain showers. Features woven Carhartt WIP label on left chest, and zip closure pockets. Regular fit.', 'Purple Blur Camo', 175, 'men', 'https://i.imgur.com/bVUFGAI.jpg', '100% Nylon Supplex®, 5.3 oz');
INSERT INTO product (id, manufacturer_id, category_id, title, description, color, unit_price_eur, gender, thumbnail_url, material) VALUES (13, 3, 3, 'Galaxy Gypsy Jacket', 'Hooded anorak jacket with front half zip closure, two zip pockets, adjustable hood and hem. Sublimated print on the back on the sleeves.', 'Black', 75, 'uni', 'https://i.imgur.com/svxQKP3.jpg', '100% Nylon');
INSERT INTO product (id, manufacturer_id, category_id, title, description, color, unit_price_eur, gender, thumbnail_url, material) VALUES (15, 4, 4, 'Storm Dyed Tee', 'Short Sleeve T-Shirt - Graphic Art', 'Black', 40, 'men', 'https://i.imgur.com/V2Dp7YP.jpg', '100% Pigment Dyed Cotton');
INSERT INTO product (id, manufacturer_id, category_id, title, description, color, unit_price_eur, gender, thumbnail_url, material) VALUES (12, 4, 3, 'Stüzzy and Nike Insulated Pullover Jacket', 'Stüssy and Nike return with a collection engineered for the elements done in translucent ripstop with a gradient green print. Co-branded Insulated Hooded Baja pullover jacket with 2'' baffles, Thermore Eco-Down recycled fiber fill and recycled translucent ripstop nylon body material.', 'White / Green', 330, 'men', 'https://i.imgur.com/ZNOFhdd.jpg', '100% Nylon');
INSERT INTO product (id, manufacturer_id, category_id, title, description, color, unit_price_eur, gender, thumbnail_url, material) VALUES (16, 4, 4, 'World Tour Tee (WMNS)', 'Short Sleeve T-Shirt - Graphic Art', 'Black', 40, 'women', 'https://i.imgur.com/6irdDo5.jpg', '100% Cotton');
INSERT INTO product (id, manufacturer_id, category_id, title, description, color, unit_price_eur, gender, thumbnail_url, material) VALUES (17, 2, 4, 'Sunrise II TS', 'The t-shirt has a tye dye finish over the entire surface. The t-shirt features a crew neck with ribbed details and the brand logo in the center in a contrasting color.', 'Vintage Blue', 50, 'men', 'https://i.imgur.com/PopmJ26.jpg', '100% Cotton');
INSERT INTO product (id, manufacturer_id, category_id, title, description, color, unit_price_eur, gender, thumbnail_url, material) VALUES (18, 3, 5, 'We Out Here Socks', 'Jacquard knit alien graphics throughout with logo script on upper cuff and footbeds.', 'Tie Dye', 12, 'uni', 'https://i.imgur.com/nJJrekd.jpg', '70% Cotton, 27% Polyester, 3% Spandex');
INSERT INTO product (id, manufacturer_id, category_id, title, description, color, unit_price_eur, gender, thumbnail_url, material) VALUES (19, 3, 5, 'Lord Nermal Socks', 'A pair of mint tie dye socks with the quirky image of Nermal The Cat.', 'Tie Dye', 12, 'uni', 'https://i.imgur.com/iJr0qU0.jpg', '70% Cotton, 27% Polyester, 3% Spandex');
INSERT INTO product (id, manufacturer_id, category_id, title, description, color, unit_price_eur, gender, thumbnail_url, material) VALUES (20, 3, 5, 'Fucking Fuck Mid Socks', 'A pair of mid socks with a contrast lettering at cuff.', 'Black', 12, 'uni', 'https://i.imgur.com/RWmYm4J.jpg', '70% Cotton, 27% Polyester, 3% Spandex');



INSERT INTO size (id, size, quantity, product_id) VALUES (1, 'S/M', 5, 1);
INSERT INTO size (id, size, quantity, product_id) VALUES (2, 'L/XL', 2, 1);
INSERT INTO size (id, size, quantity, product_id) VALUES (3, 'S/M', 2, 2);
INSERT INTO size (id, size, quantity, product_id) VALUES (4, 'L/XL', 1, 2);
INSERT INTO size (id, size, quantity, product_id) VALUES (5, 'Universal', 4, 3);
INSERT INTO size (id, size, quantity, product_id) VALUES (6, 'Universal', 2, 4);
INSERT INTO size (id, size, quantity, product_id) VALUES (7, 'Universal', 3, 5);
INSERT INTO size (id, size, quantity, product_id) VALUES (8, 'Universal', 2, 6);
INSERT INTO size (id, size, quantity, product_id) VALUES (9, '32', 2, 7);
INSERT INTO size (id, size, quantity, product_id) VALUES (10, '34', 3, 7);
INSERT INTO size (id, size, quantity, product_id) VALUES (11, '28', 2, 8);
INSERT INTO size (id, size, quantity, product_id) VALUES (12, '29', 1, 8);
INSERT INTO size (id, size, quantity, product_id) VALUES (13, '30', 2, 9);
INSERT INTO size (id, size, quantity, product_id) VALUES (14, '34', 1, 9);
INSERT INTO size (id, size, quantity, product_id) VALUES (15, 'S', 2, 10);
INSERT INTO size (id, size, quantity, product_id) VALUES (16, 'M', 3, 10);
INSERT INTO size (id, size, quantity, product_id) VALUES (17, 'M', 3, 11);
INSERT INTO size (id, size, quantity, product_id) VALUES (18, 'L', 1, 11);
INSERT INTO size (id, size, quantity, product_id) VALUES (19, 'M', 1, 12);
INSERT INTO size (id, size, quantity, product_id) VALUES (20, 'L', 1, 12);
INSERT INTO size (id, size, quantity, product_id) VALUES (21, 'S', 2, 13);
INSERT INTO size (id, size, quantity, product_id) VALUES (22, 'M', 2, 13);
INSERT INTO size (id, size, quantity, product_id) VALUES (23, 'S', 2, 14);
INSERT INTO size (id, size, quantity, product_id) VALUES (24, 'M', 1, 14);
INSERT INTO size (id, size, quantity, product_id) VALUES (25, 'XL', 3, 14);
INSERT INTO size (id, size, quantity, product_id) VALUES (26, 'L', 1, 15);
INSERT INTO size (id, size, quantity, product_id) VALUES (27, 'S', 1, 16);
INSERT INTO size (id, size, quantity, product_id) VALUES (28, 'M', 1, 16);
INSERT INTO size (id, size, quantity, product_id) VALUES (29, 'L', 1, 16);
INSERT INTO size (id, size, quantity, product_id) VALUES (30, 'M', 3, 17);
INSERT INTO size (id, size, quantity, product_id) VALUES (31, 'XL', 2, 17);
INSERT INTO size (id, size, quantity, product_id) VALUES (32, 'Universal', 5, 18);
INSERT INTO size (id, size, quantity, product_id) VALUES (33, 'Universal', 3, 19);
INSERT INTO size (id, size, quantity, product_id) VALUES (34, 'Universal', 4, 20);

SELECT pg_catalog.setval('cart_sequence', 2, true);

SELECT pg_catalog.setval('customer_sequence', 2, true);

SELECT pg_catalog.setval('order_item_sequence', 3, true);

SELECT pg_catalog.setval('shippment_sequence', 1002, true);

ALTER TABLE ONLY cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);


ALTER TABLE ONLY category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


ALTER TABLE ONLY category
    ADD CONSTRAINT category_title_key UNIQUE (title);


ALTER TABLE ONLY customer
    ADD CONSTRAINT customer_email_key UNIQUE (email);


ALTER TABLE ONLY customer
    ADD CONSTRAINT customer_phone_key UNIQUE (phone);


ALTER TABLE ONLY customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);


ALTER TABLE ONLY customer
    ADD CONSTRAINT customer_username_key UNIQUE (username);


ALTER TABLE ONLY manufacturer
    ADD CONSTRAINT manufacturer_pkey PRIMARY KEY (id);


ALTER TABLE ONLY manufacturer
    ADD CONSTRAINT manufacturer_title_key UNIQUE (title);


ALTER TABLE ONLY order_item
    ADD CONSTRAINT order_item_pkey PRIMARY KEY (id);


ALTER TABLE ONLY picture
    ADD CONSTRAINT picture_pkey PRIMARY KEY (id);


ALTER TABLE ONLY product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


ALTER TABLE ONLY shippment
    ADD CONSTRAINT shippment_pkey PRIMARY KEY (id);


ALTER TABLE ONLY size
    ADD CONSTRAINT size_pkey PRIMARY KEY (id);


ALTER TABLE ONLY cart
    ADD CONSTRAINT cart_customer_username_fkey FOREIGN KEY (customer_username) REFERENCES customer(username);


ALTER TABLE ONLY cart
    ADD CONSTRAINT cart_product_id_fkey FOREIGN KEY (product_id) REFERENCES product(id);


ALTER TABLE ONLY order_item
    ADD CONSTRAINT order_item_product_id_fkey FOREIGN KEY (product_id) REFERENCES product(id);


ALTER TABLE ONLY order_item
    ADD CONSTRAINT order_item_shippment_id_fkey FOREIGN KEY (shippment_id) REFERENCES shippment(id);


ALTER TABLE ONLY picture
    ADD CONSTRAINT picture_product_id_fkey FOREIGN KEY (product_id) REFERENCES product(id);


ALTER TABLE ONLY product
    ADD CONSTRAINT product_category_id_fkey FOREIGN KEY (category_id) REFERENCES category(id);


ALTER TABLE ONLY product
    ADD CONSTRAINT product_manufacturer_id_fkey FOREIGN KEY (manufacturer_id) REFERENCES manufacturer(id);


ALTER TABLE ONLY shippment
    ADD CONSTRAINT shippment_customer_username_fkey FOREIGN KEY (customer_username) REFERENCES customer(username);


ALTER TABLE ONLY size
    ADD CONSTRAINT size_product_id_fkey FOREIGN KEY (product_id) REFERENCES product(id);
