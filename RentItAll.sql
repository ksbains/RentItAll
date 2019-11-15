DROP DATABASE IF EXISTS RentItAll_DB;
CREATE DATABASE RentItAll_DB;

USE greatBay_DB;

CREATE TABLE customer(
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(45) NOT NULL,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);

-- need to add FK for loc_address
CREATE TABLE car(
  id INT NOT NULL AUTO_INCREMENT,
  loc_address VARCHAR(100) NOT NULL,
  VIN VARCHAR(100) NOT NULL,
  type VARCHAR(45) NOT NULL,
  make VARCHAR(45) NOT NULL,
  model VARCHAR(45) NOT NULL,
  paint VARCHAR(45) NOT NULL,
  transmission VARCHAR(45) NOT NULL,
  mileage VARCHAR(45) NOT NULL,
  condition VARCHAR(45) NOT NULL,
  year INT(4) NOT NULL,
  address VARCHAR(100) NOT NULL,
  PRIMARY KEY (VIN)
);

-- need to add FK for loc_address
CREATE TABLE rent_out(
  id INT NOT NULL AUTO_INCREMENT,
  cu_username VARCHAR(100) NOT NULL,
  car_VIN VARCHAR(100) NOT NULL,
  price VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);

-- need to add FK for loc_address
CREATE TABLE buy(
  id INT NOT NULL AUTO_INCREMENT,
  cu_username VARCHAR(100) NOT NULL,
  car_VIN VARCHAR(100) NOT NULL,
  price VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);

-- need to add FK for loc_address
CREATE TABLE sell(
  id INT NOT NULL AUTO_INCREMENT,
  cu_username VARCHAR(100) NOT NULL,
  car_VIN VARCHAR(100) NOT NULL,
  price VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);

-- need to add FK for loc_address
CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  SSN INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  loc_address VARCHAR(100) NOT NULL,
  salary INT NOT NULL,
  manager_ssn INT,
  position VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);


CREATE TABLE company_locations(
  address VARCHAR(100) NOT NULL,
  lot_size INT NOT NULL,
  P_number INT NOT NULL,
  PRIMARY KEY (address)
);

CREATE TABLE maintenance_service(
  name VARCHAR(100) NOT NULL,
  price INT NOT NULL,
  me_ssn INT NOT NULL,
  PRIMARY KEY (name)
);

CREATE TABLE service_instance(
  id INT NOT NULL AUTO_INCREMENT,
  cu_name VARCHAR(100) NOT NULL,
  price INT NOT NULL,
  car_VIN VARCHAR(100) NOT NULL,
  me_ssn INT NOT NULL,
  PRIMARY KEY (id)
);

