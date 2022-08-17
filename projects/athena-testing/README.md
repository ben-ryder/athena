# athena-testing
A collection of test data and functions which can be used in client and server testing.

## Test Data
Test data is exported from the package - for example `testUsers` or `testData` - which exports
predefined application data with users, notes, vaults etc. This can be used to seed the database
for E2E tests and also helps quickly set up a database for local development.

## Database Functions
This package exports database functions which can be used to quickly clear and seed a database
which is useful for E2E test setup/teardown:
- `resetDatabase()` clears and seeds the given database
- `clearDatabase()` clears the given database, removing all content
- `seedDatabase()` seeds the given database with the predefined test data

These functions can be used with any database, and just rely on a postgres `pg` instance to be connected to
the target database.

## Database "CLI"
The package also has a "CLI" (just a .ts script) which can run `resetDatabase` from the command line.  
This means you can quickly set up your local environment without having to import the actual functions anywhere.  
To use this script you can do the following:
- Set up the `DATABASE_URL` environment variable:
  - `cp .env.example .env` and edit
- Run the typescript file with `ts-node ./cli.ts`
