-- Cleaning up existing internal if present
DROP DATABASE IF EXISTS athena;

-- Cleaning up existing user if present
DROP USER IF EXISTS athena;

-- Create athena user and internal
CREATE USER athena WITH PASSWORD 'password' LOGIN;
CREATE DATABASE athena;
GRANT CONNECT ON DATABASE athena TO athena;

-- Switch to new internal
\c athena

-- Create UUID extension for uuid_generate_v4 support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Functions for automatically managing created_at and updated_at timestamps
CREATE OR REPLACE FUNCTION update_table_timestamps()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';


/**
    Users Table
    -----------
    Used to store user accounts.
 */
CREATE TABLE IF NOT EXISTS users (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    username VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    encryption_secret VARCHAR(255) NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);
CREATE TRIGGER update_user_timestamps BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_table_timestamps();

/**
    Changes Table
    -----------
    Used to store all the changes that users make to their content.
 */
CREATE TABLE IF NOT EXISTS changes (
     id VARCHAR(100) NOT NULL UNIQUE,
     data TEXT NOT NULL,
     owner UUID NOT NULL,
     CONSTRAINT change_owner FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE,
     PRIMARY KEY (id)
);

-- Grant privileges to athena user after everything is created
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO athena;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO athena;
