CREATE DATABASE IF NOT EXISTS chat;

USE chat;

DROP TABLE friends;
DROP TABLE messages;
DROP TABLE users;

CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY(id),
  name VARCHAR(900)
);

CREATE TABLE IF NOT EXISTS messages (
  id INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY(id),
  message_text VARCHAR(900),
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  room_name VARCHAR(900)
);

-- CREATE TABLE IF NOT EXISTS friends (
--   id INT NOT NULL AUTO_INCREMENT,
--   PRIMARY KEY(id),
--   friend_one INT,
--   FOREIGN KEY (friend_one) REFERENCES users(id),
--   friend_two INT,
--   FOREIGN KEY (friend_two) REFERENCES users(id),
--   status_flag BIT
-- );

/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

