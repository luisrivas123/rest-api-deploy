-- crear db
DROP DATABASE IF EXISTS datosdb;
CREATE DATABASE datosdb;

-- usar
USE datosdb;

-- crear la tabla datos
CREATE TABLE dato (
  id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
  title VARCHAR(255) NOT NULL,
  poster TEXT,
  year INT NOT NULL
);

CREATE TABLE genre (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE dato_genres (
  dato_id BINARY(16) REFERENCES dato(id),
  genre_id INT REFERENCES genre(id),
  PRIMARY KEY (dato_id, genre_id)
);

-- añadir datos
INSERT INTO genre (name) VALUES
('genero_1'),
('genero_2'),
('genero_3'),
('Terror');

INSERT INTO dato (id, title, poster, year) VALUES
(UUID_TO_BIN(UUID()), 'Titulo 1', 'https://picsum.photos/200/320', 1990),
(UUID_TO_BIN(UUID()), 'Titulo 2', 'https://picsum.photos/200/321', 1991),
(UUID_TO_BIN(UUID()), 'Titulo 3', 'https://picsum.photos/200/322', 1992);

INSERT INTO dato_genres (dato_id, genre_id)
VALUES
  ((SELECT id FROM dato WHERE title = 'Titulo 1'), (SELECT id FROM genre WHERE name = 'genero_1')),
  ((SELECT id FROM dato WHERE title = 'Titulo 1'), (SELECT id FROM genre WHERE name = 'Terror')),
  ((SELECT id FROM dato WHERE title = 'Titulo 2'), (SELECT id FROM genre WHERE name = 'genero_1')),
  ((SELECT id FROM dato WHERE title = 'Titulo 2'), (SELECT id FROM genre WHERE name = 'Terror')),
  ((SELECT id FROM dato WHERE title = 'Titulo 3'), (SELECT id FROM genre WHERE name = 'genero_3'));
 
SELECT * FROM dato;
SELECT *, BIN_TO_UUID(id) id FROM `dato`;