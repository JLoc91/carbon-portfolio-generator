# Overview

This project provides the backend and frontend for generating carbon portfolios. The server is built using Node.js and Express, with a PostgreSQL database.

## Prerequisites

- Node.js
- npm (Node Package Manager)
- PostgreSQL
- Docker
- Docker-Compose

## Installation

### Clone the repository

```
git clone https://github.com/JLoc91/carbon-portfolio-generator.git
```

### .env

- copy the data from .env.sample into .env

#### Postgres DB

- run the dockerfile with the tho following commands

```
docker build --pull --no-cache  -t carbon-project-image .

docker run --name carbon-portfolio-generator-db -p 5432:5432 -d carbon-project-image
```

- if the data should not be copied correctly please insert a data bank with the following command manually

```
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
```

- and add the data from the `projects_sample.csv`

#### Frontend

- navigate to the client subdirectory with `cd client`
- install the packages with `npm i`

- Development

  - start the dev server with `npm run dev`
  - open the browser and navigate to `http://localhost:8080/`
  - fill the input field on the page with an integer and submit it

- Production

  - when deploying the server use the `npm run start` command
  - fill the input field on the page with an integer and submit it

#### Backend

- navigate to the server subdirectory with `cd server`
- install the packages with `npm i`

- Development

  - start the dev server with `npm run serve`
  - the server runs now on port `3000`

- Production

  - when deploying the server use the `npm run start` command

## Testing

### Unit-Tests

- navigate to the server directory and run the command `npm run test`

### E2E-Tests

- not implemented yet
