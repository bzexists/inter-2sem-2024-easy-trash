CREATE DATABASE IF NOT EXISTS locais DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE locais;

DROP TABLE IF EXISTS ecoponto ;

CREATE TABLE IF NOT EXISTS ecoponto(
	id int NOT NULL AUTO_INCREMENT,
	nomelocal varchar(50) NOT NULL,
	cep varchar(9) NOT NULL,
	numero varchar(25) NOT NULL,
	telefone varchar(14) NOT NULL,
	logradouro varchar(50) NOT NULL,
	bairro varchar(50) NOT NULL,
	cidade varchar(50) NOT NULL,
	estado varchar(50) NOT NULL,
    lat double not null,
    lng double not null,
  PRIMARY KEY (id),
  UNIQUE KEY nomelocal_UN (nomelocal)
);
