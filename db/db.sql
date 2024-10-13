-- crear db
DROP DATABASE IF EXISTS envirapid_db;
CREATE DATABASE envirapid_db;

-- usar
USE envirapid_db;

DROP TABLE IF EXISTS user;

-- Crear tabla user
CREATE TABLE user (
	id BINARY(16) DEFAULT (UUID_TO_BIN(UUID())),
	name VARCHAR(32) NOT NULL,
	lastname VARCHAR(32) NOT NULL,
	document_type VARCHAR(32) NOT NULL,
	document_id VARCHAR(32) NOT NULL UNIQUE,
	phone VARCHAR(32) NOT NULL UNIQUE,
	email VARCHAR(100) NOT NULL UNIQUE,
	create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (id)
);


INSERT INTO user (id, name, lastname, document_type, document_id, phone, email) 
VALUES ((UUID_TO_BIN(UUID()), 'Luis', 'Rivas', 'cedula', '123456789', '31168451', 'luis@corre.com');

SELECT id, name, lastname, document_type, document_id, phone, email FROM user;
SELECT * FROM user;
-- Crear tabla auth
DROP TABLE IF EXISTS auth;

CREATE TABLE auth (
	id BINARY(16) DEFAULT (UUID_TO_BIN(UUID())),
	email VARCHAR(100) NOT NULL UNIQUE,
	phone VARCHAR(32) NOT NULL UNIQUE,
	password VARCHAR(64) NOT NULL UNIQUE,
	PRIMARY KEY (id)
);

SELECT * FROM auth WHERE phone = 6533412;
