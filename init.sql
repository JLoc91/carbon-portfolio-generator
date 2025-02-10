CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name TEXT,
    country TEXT,
    image TEXT,
    price_per_ton DECIMAL,
    offered_volume_in_tons INTEGER,
    distribution_weight DECIMAL,
    supplier_name TEXT,
    earliest_delivery DATE,
    description TEXT
);

COPY projects (id, name, country, image, price_per_ton, offered_volume_in_tons, distribution_weight, supplier_name, earliest_delivery, description)
FROM '/docker-entrypoint-initdb.d/projects_sample.csv'
DELIMITER ','
CSV HEADER;
