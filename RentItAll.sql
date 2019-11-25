DROP DATABASE IF EXISTS RentItAll_DB;
CREATE DATABASE RentItAll_DB;

USE RentItAll_DB;

CREATE TABLE customer(
  username VARCHAR(100) NOT NULL,
  password VARCHAR(45) NOT NULL,
  name VARCHAR(100) NOT NULL,
  P_number VARCHAR(15) NOT NULL,
  address VARCHAR(100) NOT NULL,
  PRIMARY KEY (username)
);

CREATE TABLE customer_type(
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
  source bit not null,
  purpose varchar(10) not null,
  type VARCHAR(45) NOT NULL,
  make VARCHAR(45) NOT NULL,
  model VARCHAR(45) NOT NULL,
  paint VARCHAR(45) NOT NULL,
  transmission VARCHAR(45) NOT NULL,
  price VARCHAR(10) not null,
  mileage integer NOT NULL,
  conditions VARCHAR(45) NOT NULL,
  year integer NOT NULL,
  available varchar(10) NOT null,
  PRIMARY KEY (VIN),
  FOREIGN KEY (loc_address) REFERENCES company_locations(address)
    on update cascade,
  FOREIGN KEY (ma_ssn) REFERENCES manager(mgr_ssn)
    on delete set null on update cascade
);

CREATE TABLE car_relation(
  cu_username VARCHAR(100) NOT null,
  car_VIN VARCHAR(100) NOT NULL,
  state VARCHAR(10),
  PRIMARY KEY(cu_username, car_VIN),
  FOREIGN KEY(cu_username) REFERENCES customer(username)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(car_VIN) REFERENCES car(VIN)
    ON DELETE CASCADE ON UPDATE CASCADE
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
  FOREIGN KEY (cu_username, b_id) REFERENCES service_instance(cu_username, b_id)
    on delete cascade on update cascade,
  FOREIGN KEY (srv_name) REFERENCES maintenance_service(name)
    on delete cascade on update cascade
);
CREATE TABLE service_offer(
  loc_address VARCHAR(100) NOT NULL,
  srv_name VARCHAR(100) NOT NULL,
  price INT NOT NULL,
  PRIMARY KEY(loc_address, srv_name),
  FOREIGN KEY (loc_address) REFERENCES company_locations(address)
    on delete cascade on update cascade,
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

INSERT INTO customer
VALUES  ('testuser1', '123', 'tester1', '012013012', '315 E San Fernando'),
        ('testuser2', '345', 'tester2', '012013123', '316 E San Fernando'),
        ('testuser3', '678', 'tester3', '012013345', '317 E San Fernando'),
        ('testuser4', '912', 'tester4', '012013234', '318 E San Fernando'),
        ('testuser5', '949', 'tester5', '012013233', '168 E Taylor St'),
        ('testuser6', '962', 'tester6', '012013232', '169 E Taylor St'),
        ('testuser7', '989', 'tester7', '012013231', '198 Curtner Ave');

INSERT INTO customer_type
VALUES  ('testuser1', 'buyer'),
        ('testuser1', 'renter'),
        ('testuser2', 'seller'),
        ('testuser3', 'host'),
        ('testuser4', 'renter'),
        ('testuser4', 'buyer'),
        ('testuser5', 'renter'),
        ('testuser6', 'seller'),
        ('testuser7', 'host');

INSERT INTO company_locations
VALUES  ('315 E San Fernando', '100', '1234567894'),
        ('189 Curtner Ave', '50', '1234567498'),
        ('167 E Taylor St', '35', '1234567468');

INSERT INTO employee
VALUES  ('138', 'mgr0', '315 E San Fernando', '99999999'),
        ('123456789', 'mgr1', '315 E San Fernando', '200000'),
        ('123456788', 'mch1', '315 E San Fernando', '100000'),
        ('123456787', 'rep1', '167 E Taylor St', '100000'),
        ('123456786', 'rep2', '189 Curtner Ave', '100000'),
        ('123456785', 'mgr2', '189 Curtner Ave', '200000');

INSERT INTO manager
VALUES  ('138'),  
        ('123456789'),
        ('123456788'),
        ('123456786'),
        ('123456785');

INSERT INTO car
VALUES  ('DHB100ZASFG','315 E San Fernando', NULL, 0, 'RENT', 'GAS',
          'HONDA', 'ACCORD', 'GREEN','CVT-10','10000','500000','USED','2019', "yes"),
        
        ('EF3456ZDSF4','315 E San Fernando', NULL, 0, 'RENT', 'GAS',
          'HONDA', 'CIVIC', 'PINK','CVT-10','19000','500000','USED','2001', "yes"),
        
        ('CDE45SZQSJK','315 E San Fernando', NULL, 0, 'RENT', 'GAS',
          'HONDA', 'CIVIC', 'RED','CVT-10','18000','500000','USED','2010', "yes"),
        
        ('FF3586DDBNM','167 E Taylor St', NULL, 0, 'RENT', 'GAS',
          'TOYOTA', 'CAMRY', 'BLUE','CVT-10','15000','500000','USED','2003', "yes"),
        
        ('NMEFGJGKRWP','315 E San Fernando', NULL, 0, 'RENT', 'GAS',
          'NISSIAN', 'SENTRA', 'BLACK','AUTOMATIC','13000','500000','USED','2012', "yes"),
        
        ('IMYRN6G4RW5','167 E Taylor St', NULL, 0, 'BOTH', 'GAS',
          'NISSIAN', 'SENTRA', 'YELLOW','AUTOMATIC','15000','500000','USED','2013', "yes"),
        
        ('WRTGV335DWK','315 E San Fernando', NULL, 0, 'BOTH', 'GAS',
          'MAZDA', 'RX7', 'BLACK','MANUAL','55000','500000','USED','2000', "yes"),
        
        ('W3T5VBJ6FWS','189 Curtner Ave', NULL, 0, 'BOTH', 'GAS',
          'MAZDA', 'RX7', 'WHITE','MANUAL','65000','500000','USED','2000', "yes"),
        
        ('3FGDJKL6IPX','189 Curtner Ave', NULL, 0, 'BOTH', 'GAS',
          'FORD', 'MUSTANG', 'BLACK','MANUAL','70000','500000','USED','2003', "yes"),
        
        ('8DNJHSI7JDQ','189 Curtner Ave', NULL, 0, 'BOTH', 'GAS',
          'MAZDA', 'MX5', 'BLACK','MANUAL','30000','500000','USED','2004', "yes"),
        
        ('2DBJDAIBCZX','167 E Taylor St', NULL, 0, 'SELL', 'GAS',
          'TOYOTA', 'SUPRA', 'BLACK','MANUAL','80000','500000','USED','2019', "yes"),
        
        ('6SF53AA3C8B','189 Curtner Ave', NULL, 0, 'SELL', 'GAS',
          'SUBARU', 'BRZ', 'BLACK','MANUAL','30000','500000','USED','2017', "yes"),
        
        ('S3GHKJDF789','189 Curtner Ave', NULL, 0, 'SELL', 'GAS',
          'SUBARU', 'BRZ', 'GREY','MANUAL','30000','500000','USED','2013', "yes"),
        
        ('729JSDHB42F','189 Curtner Ave', NULL, 0, 'SELL', 'GAS',
          'TOYOTA', 'FRS', 'BLACK','MANUAL','50000','500000','USED','2011', "yes"),
        
        ('23DSFSDG5SD','189 Curtner Ave', NULL, 0, 'SELL', 'GAS',
          'NISSIAN', 'VERSA', 'BLUE','AUTOMATIC','21000','500000','USED','2008', "yes");