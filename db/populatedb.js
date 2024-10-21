#! /usr/bin/env node
const { Client } = require("pg");
const SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR (255),
  password VARCHAR (30)
);
INSERT INTO users (username, password) 
VALUES
  ('Bryan', 'Password1'),
  ('Odin', 'Password1'),
  ('Damon', 'Password1');
`;
async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.PGSTRING,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}
main();