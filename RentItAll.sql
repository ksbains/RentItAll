DROP DATABASE IF EXISTS RentItAll_DB;
CREATE DATABASE RentItAll_DB;

USE RentItAll_DB;

CREATE TABLE customer(
  username VARCHAR(100) NOT NULL,
  password VARCHAR(45) NOT NULL,
  name VARCHAR(100) NOT NULL,
  P_number integer NOT NULL,
  address VARCHAR(100) NOT NULL,
  phone_number VARCHAR(100) NOT NULL,
  PRIMARY KEY (username)
);

CREATE TABLE cutomer_type(
  cu_username VARCHAR(100) NOT NULL,
  type varchar(20) NOT NULL,
  PRIMARY KEY (cu_username, type),
  FOREIGN KEY (cu_username) REFERENCES customer(username)
    on delete cascade on update cascade
);

CREATE TABLE company_locations(
  address VARCHAR(100) NOT NULL,
  lot_size INT NOT NULL,
  P_number INT NOT NULL,
  PRIMARY KEY (address)
);

CREATE TABLE employee(
  SSN char(9) NOT NULL,
  name VARCHAR(100) NOT NULL,
  loc_address VARCHAR(100) NOT NULL,
  salary INT NOT NULL,
  PRIMARY KEY (SSN),
  FOREIGN KEY (loc_address) REFERENCES company_locations(address)
    on update cascade
);

CREATE TABLE manager(
  mgr_ssn char(9) NOT NULL,
  PRIMARY KEY (mgr_ssn),
  FOREIGN KEY (mgr_ssn) REFERENCES employee(SSN)
    on delete cascade on update cascade
);

CREATE TABLE car(
  VIN VARCHAR(100) NOT NULL,
  loc_address VARCHAR(100) NOT NULL,
  ma_ssn char(9),
  source boolean not null,
  purpose varchar(10) not null,
  type VARCHAR(45) NOT NULL,
  make VARCHAR(45) NOT NULL,
  model VARCHAR(45) NOT NULL,
  paint VARCHAR(45) NOT NULL,
  transmission VARCHAR(45) NOT NULL,
  mileage integer NOT NULL,
  condition VARCHAR(45) NOT NULL,
  year INT(4) NOT NULL,
  PRIMARY KEY (VIN),
  FOREIGN KEY (loc_address) REFERENCES company_locations(address)
    on update cascade,
  FOREIGN KEY (ma_ssn) REFERENCES manager(mgr_ssn)
    on delete set null on update cascade
);

CREATE TABLE rent_out(
  cu_username VARCHAR(100) NOT NULL,
  car_VIN VARCHAR(100) NOT NULL,
  price VARCHAR(100) NOT NULL,
  PRIMARY KEY (cu_username, car_VIN),
  FOREIGN KEY (car_VIN) REFERENCES car(VIN)
    on delete cascade on update cascade,
  FOREIGN KEY (cu_username) REFERENCES customer(username)
    on delete cascade on update cascade
);

CREATE TABLE rent(
  cu_username VARCHAR(100) NOT NULL,
  car_VIN VARCHAR(100) NOT NULL,
  price VARCHAR(100) NOT NULL,
  PRIMARY KEY (cu_username, car_VIN),
  FOREIGN KEY (car_VIN) REFERENCES car(VIN)
    on delete cascade on update cascade,
  FOREIGN KEY (cu_username) REFERENCES customer(username)
    on delete cascade on update cascade
);

CREATE TABLE buy(
  cu_username VARCHAR(100) NOT NULL,
  car_VIN VARCHAR(100) NOT NULL,
  price VARCHAR(100) NOT NULL,
  PRIMARY KEY (cu_username, car_VIN),
  FOREIGN KEY (car_VIN) REFERENCES car(VIN)
    on delete cascade on update cascade,
  FOREIGN KEY (cu_username) REFERENCES customer(username)
    on delete cascade on update cascade
);

CREATE TABLE sell(
  cu_username VARCHAR(100) NOT NULL,
  car_VIN VARCHAR(100) NOT NULL,
  price VARCHAR(100) NOT NULL,
  PRIMARY KEY (cu_username, car_VIN),
  FOREIGN KEY (car_VIN) REFERENCES car(VIN)
    on delete cascade on update cascade,
  FOREIGN KEY (cu_username) REFERENCES customer(username)
    on delete cascade on update cascade
);

CREATE TABLE mechanic(
  m_ssn char(9) NOT NULL,
  ma_ssn char(9),
  PRIMARY KEY (m_ssn),
  FOREIGN KEY (ma_ssn) REFERENCES manager(mgr_ssn)
    on delete set null on update cascade,
  FOREIGN KEY (m_ssn) REFERENCES employee(SSN)
    on delete cascade on update cascade
);

CREATE TABLE receptionist(
  r_ssn char(9) NOT NULL,
  ma_ssn char(9),
  PRIMARY KEY (r_ssn),
  FOREIGN KEY (ma_ssn) REFERENCES manager(mgr_ssn)
    on delete set null on update cascade,
  FOREIGN KEY (r_ssn) REFERENCES employee(SSN)
    on delete cascade on update cascade
);

CREATE TABLE review(
  r_id integer NOT NULL,
  stars integer NOT NULL,
  content varchar(300),
  cu_username varchar(100),
  loc_address varchar(100) NOT NULL,
  PRIMARY KEY (r_id),
  FOREIGN KEY (cu_username) REFERENCES customer(username)
    on delete set null on update cascade,
  FOREIGN KEY (loc_address) REFERENCES company_locations(address)
    on update cascade
);

CREATE TABLE maintenance_service(
  name VARCHAR(100) NOT NULL,
  price INT NOT NULL,
  me_ssn char(9),
  PRIMARY KEY (name),
  FOREIGN KEY (me_ssn) REFERENCES mechanic(m_ssn)
    on delete set null on update cascade
);

CREATE TABLE service_instance(
  cu_username VARCHAR(100) NOT NULL,
  b_id integer NOT NULL,
  price INT NOT NULL,
  time_book integer NOT NULL,
  car_VIN VARCHAR(100),
  me_ssn char(9),
  PRIMARY KEY (cu_username, b_id),
  FOREIGN KEY (cu_username) REFERENCES customer(username)
    on delete cascade on update cascade,
  FOREIGN KEY (me_ssn) REFERENCES mechanic(m_ssn)
    on delete set null on update cascade,
  FOREIGN KEY (car_VIN) REFERENCES car(VIN)
    on delete set null on update cascade
);

CREATE TABLE instance_of(
  cu_username varchar(100) NOT NULL,
  b_id integer NOT NULL,
  srv_name varchar(100) NOT NULL,
  PRIMARY KEY(cu_username, b_id, srv_name),
  FOREIGN KEY (cu_username) REFERENCES customer(username)
    on delete cascade on update cascade,
  FOREIGN KEY (b_id) REFERENCES service_instance(b_id)
    on delete cascade on update cascade,
  FOREIGN KEY (srv_name) REFERENCES maintenance_service(name)
    on delete cascade on update cascade
);

CREATE TABLE service_offer(
  loc_address VARCHAR(100) NOT NULL,
  srv_name VARCHAR(100) NOT NULL,
  PRIMARY KEY(loc_address, srv_name),
  FOREIGN KEY (loc_address) REFERENCES company_locations(address)
    on delete cascade on update cascade,
  FOREIGN KEY (srv_name) REFERENCES maintenance_service(name)
    on delete cascade on update cascade
);

CREATE TABLE assist(
  cu_username varchar(100) NOT NULL,
  re_ssn varchar(9) NOT NULL,
  PRIMARY KEY (cu_username, re_ssn),
  FOREIGN KEY (cu_username) REFERENCES customer(username)
    on delete cascade on update cascade,
  FOREIGN KEY (re_ssn) REFERENCES receptionist(r_ssn)
    on delete cascade on update cascade
);
