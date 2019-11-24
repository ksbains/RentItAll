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
  FOREIGN KEY (cu_username, b_id) REFERENCES service_instance(cu_username, b_id)
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

INSERT INTO customer
VALUES  ('testuser1', '123', 'tester1', '012013012', '123 Virginia St'),
        ('testuser2', '345', 'tester2', '012013123', '124 Virginia St'),
        ('testuser3', '678', 'tester3', '012013345', '125 Virginia St'),
        ('testuser4', '912', 'tester4', '012013234', '126 Virginia St'),
        ('testuser5', '949', 'tester5', '012013233', '132 Irvington St'),
        ('testuser6', '962', 'tester6', '012013232', '133 Irvington St'),
        ('testuser7', '989', 'tester7', '012013231', '134 Irvington St');

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
VALUES  ('123 Washington Sq', '100', '1234567894'),
        ('123 Irvington St', '50', '1234567498'),
        ('123 Redwood Dr', '35', '1234567468');

INSERT INTO employee
VALUES  ('138', 'mgr0', '123 Washington Sq', '99999999'),
        ('123456789', 'mgr1', '123 Washington Sq', '200000'),
        ('123456788', 'mch1', '123 Washington Sq', '100000'),
        ('123456787', 'rep1', '123 Redwood Dr', '100000'),
        ('123456786', 'rep2', '123 Irvington St', '100000'),
        ('123456785', 'mgr2', '123 Irvington St', '200000');

INSERT INTO manager
VALUES  ('138'),  
        ('123456789'),
        ('123456788'),
        ('123456786'),
        ('123456785');

INSERT INTO car
VALUES  ('DHB100ZASFG','123 Washington Sq', NULL, 0, 'RENT', 'GAS',
          'HONDA', 'ACCORD', 'GREEN','CVT-10','10000','500000','USED','2019'),
        
        ('EF3456ZDSF4','123 Washington Sq', NULL, 0, 'RENT', 'GAS',
          'HONDA', 'CIVIC', 'PINK','CVT-10','19000','500000','USED','2001'),
        
        ('CDE45SZQSJK','123 Washington Sq', NULL, 0, 'RENT', 'GAS',
          'HONDA', 'CIVIC', 'RED','CVT-10','18000','500000','USED','2010'),
        
        ('FF3586DDBNM','123 Redwood Dr', NULL, 0, 'RENT', 'GAS',
          'TOYOTA', 'CAMRY', 'BLUE','CVT-10','15000','500000','USED','2003'),
        
        ('NMEFGJGKRWP','123 Washington Sq', NULL, 0, 'RENT', 'GAS',
          'NISSIAN', 'SENTRA', 'BLACK','AUTOMATIC','12000','500000','USED','2012'),
        
        ('IMYRN6G4RW5','123 Redwood Dr', NULL, 0, 'BOTH', 'GAS',
          'NISSIAN', 'SENTRA', 'YELLOW','AUTOMATIC','15000','500000','USED','2013'),
        
        ('WRTGV335DWK','123 Washington Sq', NULL, 0, 'BOTH', 'GAS',
          'MAZDA', 'RX7', 'BLACK','MANUAL','55000','500000','USED','1993'),
        
        ('W3T5VBJ6FWS','123 Irvington St', NULL, 0, 'BOTH', 'GAS',
          'MAZDA', 'RX7', 'WHITE','MANUAL','65000','500000','USED','1993'),
        
        ('3FGDJKL6IPX','123 Irvington St', NULL, 0, 'BOTH', 'GAS',
          'FORD', 'MUSTANG', 'BLACK','MANUAL','70000','500000','USED','2020'),
        
        ('8DNJHSI7JDQ','123 Irvington St', NULL, 0, 'BOTH', 'GAS',
          'MAZDA', 'MX5', 'BLACK','MANUAL','30000','500000','USED','2020'),
        
        ('2DBJDAIBCZX','123 Redwood Dr', NULL, 0, 'SELL', 'GAS',
          'TOYOTA', 'SUPRA', 'BLACK','MANUAL','80000','500000','USED','2019'),
        
        ('6SF53AA3C8B','123 Irvington St', NULL, 0, 'SELL', 'GAS',
          'SUBARU', 'BRZ', 'BLACK','MANUAL','30000','500000','USED','2017'),
        
        ('S3GHKJDF789','123 Irvington St', NULL, 0, 'SELL', 'GAS',
          'SUBARU', 'BRZ', 'GREY','MANUAL','30000','500000','USED','2013'),
        
        ('729JSDHB42F','123 Irvington St', NULL, 0, 'SELL', 'GAS',
          'TOYOTA', 'FRS', 'BLACK','MANUAL','50000','500000','USED','2011'),
        
        ('23DSFSDG5SD','123 Irvington St', NULL, 0, 'SELL', 'GAS',
          'NISSIAN', 'VERSA', 'BLUE','AUTOMATIC','20000','500000','USED','2008');