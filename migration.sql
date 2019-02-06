DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS parties CASCADE;
DROP TABLE IF EXISTS offices CASCADE;
DROP TABLE IF EXISTS candidates CASCADE;
DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS petitions;

DROP TYPE IF EXISTS roles;
  create type roles as enum('user', 'admin', 'politician', 'black');

CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    firstName VARCHAR NOT NULL,
    lastName VARCHAR NOT NULL,
    otherName VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    phoneNumber BIGINT UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    role roles DEFAULT 'user',
    isAdmin BOOLEAN DEFAULT false,
    passportUrl VARCHAR,
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE IF NOT EXISTS parties (
    id SERIAL PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL,
    hqAddress VARCHAR NOT NULL,
    logoUrl VARCHAR NOT NULL,
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE IF NOT EXISTS offices(
    id SERIAL PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL,
    type VARCHAR NOT NULL,
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE IF NOT EXISTS candidates(
    id SERIAL PRIMARY KEY,
    office INT REFERENCES offices(id) ON DELETE CASCADE,
    party INT REFERENCES parties(id) ON DELETE CASCADE,
    userid INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE IF NOT EXISTS votes(
    id SERIAL PRIMARY KEY,
    office INT REFERENCES offices(id) ON DELETE CASCADE,
    candidate INT REFERENCES candidates(userid) ON DELETE CASCADE,
    voter INT REFERENCES users(id) ON DELETE CASCADE
  );

CREATE TABLE IF NOT EXISTS petitions(
    id SERIAL PRIMARY KEY,
    office INT REFERENCES offices(id) ON DELETE CASCADE,
    createdBy INT REFERENCES users(id) ON DELETE CASCADE,
    text VARCHAR NOT NULL,
    evidence VARCHAR NOT NULL
  );

INSERT INTO users(id, firstName, lastName, otherName, email, phoneNumber, passportUrl, password, role, isAdmin) VALUES(2, 'Emmanuel', 'Daniel', 'Umola', 'ecomje@gmail.com', '08145467267', 'http://www.emmsdan.com/me.png', '$2a$12$bJ/eoNrrBYC0fYEmtc5LbeniX86vNmKytDU3al6OIHWPYvoXF5GAi', 'admin', true) ON CONFLICT DO NOTHING;

INSERT INTO parties(name, hqAddress, logoUrl) 
VALUES ('UPN Unity Party of Nigeria', 'Block 10, Flat 1, Amasuma Close, Area 2, Section 1, Garki – Abuja', '/img/upn.jpg'), 
('Alliance for new Nigeria ANN', '20, Durban Street, Wuse 11, Abuja.', '/img/ann.jpg'),
('Social Democratic Party SDP', 'Plot 2105 Herbert Macaulay Way, Opp. Sky Memorial Plaza, Block B3, Wuse zone 6, Abuja', '/img/sdp.jpg'), 
('Labour Party LP', 'Dabo Shopping Mall, 2nd Floor, Plot 73 Ladoke Akintola Boulevard, Garki, Abuja.', '/img/labour.jpg'), 
('Kowa Party KP', '129 Corner Shop, Beside Total Filling Station, Fed. Housing Est., Lugbe, Abuja.', '/img/kowa.jpg'), 
('Action Democratic Party', 'Plot 3379A, Mungo Park CLose, Off Jesse Jackson Asokoro New Extension-Abuja', '/img/adp.jpg') 

ON CONFLICT DO NOTHING;

INSERT INTO offices(name, type) VALUES('senate', 'federal'), ('governor', 'state') ON CONFLICT DO NOTHING;