DROP DATABASE IF EXISTS RentItAll_DB;
CREATE DATABASE RentItAll_DB;

USE RentItAll_DB;

CREATE TABLE customer(
  username VARCHAR(100) NOT NULL,
  password VARCHAR(45) NOT NULL,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(100) NOT NULL,
  PRIMARY KEY (username)
);

-- need to add FK for loc_address
CREATE TABLE car(
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
  cu_username VARCHAR(100) NOT NULL,
  car_VIN VARCHAR(100) NOT NULL,
  price VARCHAR(100) NOT NULL,
  PRIMARY KEY (cu_username, car_VIN)
  FOREIGN KEY (car_VIN) references from car.VIN
  FOREIGN KEY (cu_username) references from customer.username
);

CREATE TABLE rent(
  cu_username VARCHAR(100) NOT NULL,
  car_VIN VARCHAR(100) NOT NULL,
  price VARCHAR(100) NOT NULL,
  PRIMARY KEY (cu_username, car_VIN)
  FOREIGN KEY (car_VIN) references from car.VIN
  FOREIGN KEY (cu_username) references from customer.username
);

-- need to add FK for loc_address
CREATE TABLE buy(
  cu_username VARCHAR(100) NOT NULL,
  car_VIN VARCHAR(100) NOT NULL,
  price VARCHAR(100) NOT NULL,
  PRIMARY KEY (cu_username, car_VIN)
  FOREIGN KEY (car_VIN) references from car.VIN
  FOREIGN KEY (cu_username) references from customer.username
);

-- need to add FK for loc_address
CREATE TABLE sell(
  cu_username VARCHAR(100) NOT NULL,
  car_VIN VARCHAR(100) NOT NULL,
  price VARCHAR(100) NOT NULL,
  PRIMARY KEY (cu_username, car_VIN)
  FOREIGN KEY (car_VIN) references from car.VIN
  FOREIGN KEY (cu_username) references from customer.username
);

-- need to add FK for loc_address
CREATE TABLE employee(
  SSN INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  loc_address VARCHAR(100) NOT NULL,
  salary INT NOT NULL,
  manager_ssn INT,
  position VARCHAR(100) NOT NULL,
  PRIMARY KEY (SSN)
  FOREIGN KEY (loc_address) references from company_locations.address
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
  FOREIGN KEY (me_ssn) references from employee.SSN
);

CREATE TABLE service_instance(
  cu_name VARCHAR(100) NOT NULL,
  price INT NOT NULL,
  car_VIN VARCHAR(100) NOT NULL,
  me_ssn INT NOT NULL,
  PRIMARY KEY (id)
  FOREIGN KEY (cu_name) references from customer.username
  FOREIGN KEY (me_ssn) references from employee.SSN
  FOREIGN KEY (car_VIN) references from car.VIN  
);

