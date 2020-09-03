David Shemian solution for Opora home assignment - Back End

## How to use

1.  Clone repository
2.  Add a .env file with the following properties:
    -   TOKEN_SECRET_KEY=XXX where XXX is the jwt secret key
    -   TOKEN_EXPIRES_TIME=XXX where XXX is the jwt expires time
    -   SERVER_PORT=XXX where XXX is the desired port to run the server on
    -   DB_CONNECTION_STRING=XXX where xxx is the postgres DB full connection string
    -   DB_USE_SSL=XXX where XXX is a boolean value of whether to use SSL for db or not - for local set to false
    -   DB_SHOULD_LOG=XXX where XXX where XXX is a boolean value that determents if the DB would log each query or not 
  
  Example: 

    TOKEN_SECRET_KEY=$123mytokensercretkey!%
    TOKEN_EXPIRES_TIME=3d
    SERVER_PORT=6500
    DB_CONNECTION_STRING=postgres://postgres@localhost:5432/f1_db
    DB_USE_SSL=false
    DB_SHOULD_LOG=true

3. Insert the data to the DB, including creating the drivers avatar column using Wikipedia query API by 
    adding the PostgreSQL compatible MySQL database dump from https://ergast.com/mrd/db/ into the root folder and then run ### `npm build-db`. Afterwards the dump file is not needed.

## Available Scripts

### `npm run build-db`

    Use this in order to Insert the data from https://ergast.com/mrd/db/ to db, including creating drivers avatar column

### `npm run production`

    Use this in order to install dependencies, compile and run the server 

### `npm start`

    Use this in order to run the server 
