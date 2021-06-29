CREATE DATABASE my_db;
    default character set utf8  default collate utf8_general_ci;

USE my_db;

CREATE TABLE Persons
(
    ID INT AUTO_INCREMENT PRIMARY KEY,
    TITLE VARCHAR(100) NOT NULL,
    TYPE VARCHAR(100) NOT NULL,
    URL varchar(255)
) ENGINE=InnoDB default character set utf8 collate utf8_general_ci;


INSERT INTO Persons (TITLE,TYPE,URL)VALUES ("TWICE","picture", 'http://img.hani.co.kr/imgdb/resize/2019/0502/00503582_20190502.JPG');
INSERT INTO Persons (TITLE,TYPE,URL)VALUES ("트와이스","picture", 'http://www.senmedia.kr/news/photo/201803/3748_3614_4826.jpg');


SELECT * FROM Persons;