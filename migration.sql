DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS parties CASCADE;
DROP TABLE IF EXISTS offices CASCADE;
DROP TABLE IF EXISTS candidates CASCADE;
DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS petitions;

create type roles as enum('user', 'admin', 'politician', 'black');

CREATE TABLE IF NOT EXISTS users(
    id SERIAL,
    userid NUMERIC PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    phone NUMERIC UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    role roles DEFAULT 'user',
    isAdmin BOOLEAN DEFAULT false,
    photoUrl VARCHAR UNIQUE,
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE IF NOT EXISTS parties (
    id SERIAL,
    partyid NUMERIC PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL,
    hqAddress VARCHAR NOT NULL,
    logoUrl VARCHAR UNIQUE NOT NULL,
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE IF NOT EXISTS offices(
    id SERIAL,
    officeid NUMERIC PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL,
    type VARCHAR NOT NULL,
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE IF NOT EXISTS candidates(
    id SERIAL,
    candidateid NUMERIC PRIMARY KEY,
    officeid INT REFERENCES offices(officeid) ON DELETE CASCADE,
    partyid INT REFERENCES parties(partyid) ON DELETE CASCADE,
    userid INT REFERENCES users(userid) ON DELETE CASCADE,
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE IF NOT EXISTS votes(
    id SERIAL PRIMARY KEY,
    officeid INT REFERENCES offices(officeid) ON DELETE CASCADE,
    candidate INT REFERENCES candidates(candidateid) ON DELETE CASCADE,
    voter INT REFERENCES users(userid) ON DELETE CASCADE
  );

CREATE TABLE IF NOT EXISTS petitions(
    id SERIAL PRIMARY KEY,
    office INT REFERENCES offices(officeid) ON DELETE CASCADE,
    createdBy INT REFERENCES users(userid) ON DELETE CASCADE,
    text VARCHAR NOT NULL,
    evidence VARCHAR NOT NULL
  );

INSERT INTO users(userid, name, email, phone, photoUrl, password, role, isAdmin) VALUES(1, 'Emmanuel Daniel', 'ecomje@gmail.com', '08145467267', 'http://www.emmsdan.com/me.png', '$2a$12$bJ/eoNrrBYC0fYEmtc5LbeniX86vNmKytDU3al6OIHWPYvoXF5GAi', 'admin', true) ON CONFLICT DO NOTHING;

INSERT INTO parties(partyid, name, hqAddress, logoUrl) VALUES(1, 'The great party', 'surulere, abulegba, lagos', 'http://somedistantparty.png'), (2, 'Commission party', 'freeborn street, lekki, abuja', 'http://hereandnowparty.png') ON CONFLICT DO NOTHING;

INSERT INTO offices(officeid, name, type) VALUES(1, 'senate', 'federal'), (2, 'governor', 'state') ON CONFLICT DO NOTHING;