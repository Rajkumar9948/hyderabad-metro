-- Drop tables if they exist (for reset purposes)
DROP TABLE IF EXISTS connections;
DROP TABLE IF EXISTS stations;
DROP TABLE IF EXISTS lines;

-- Lines table
CREATE TABLE lines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(50)
);

-- Stations table
CREATE TABLE stations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    line_id INT REFERENCES lines(id) ON DELETE CASCADE,
    station_order INT NOT NULL, -- Position of station in the line
    is_interchange BOOLEAN DEFAULT FALSE
);

-- Connections table: links between stations
CREATE TABLE connections (
    id SERIAL PRIMARY KEY,
    station_a_id INT REFERENCES stations(id) ON DELETE CASCADE,
    station_b_id INT REFERENCES stations(id) ON DELETE CASCADE,
    distance FLOAT NOT NULL, -- Optional: in KM
    time FLOAT NOT NULL -- in minutes, usually 2.5
);
