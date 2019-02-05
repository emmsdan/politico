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

INSERT INTO users(id, firstName, lastName, otherName, email, phoneNumber, passportUrl, password, role, isAdmin) VALUES(1, 'Emmanuel', 'Daniel', 'Umola', 'ecomje@gmail.com', '08145467267', 'http://www.emmsdan.com/me.png', '$2a$12$bJ/eoNrrBYC0fYEmtc5LbeniX86vNmKytDU3al6OIHWPYvoXF5GAi', 'admin', true) ON CONFLICT DO NOTHING;

INSERT INTO parties(id, name, hqAddress, logoUrl) VALUES(1, 'The great party', 'surulere, abulegba, lagos', 'http://somedistantparty.png'), (2, 'Commission party', 'freeborn street, lekki, abuja', 'http://hereandnowparty.png') ON CONFLICT DO NOTHING;

INSERT INTO offices(id, name, type) VALUES(1, 'senate', 'federal'), (2, 'governor', 'state') ON CONFLICT DO NOTHING;