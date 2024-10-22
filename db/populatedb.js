#! /usr/bin/env node
/*const { Client } = require("pg");
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
main();*/

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function main() {
  await prisma.users.create({
    data: {
      username: 'David',
      password: 'Password1',
      folders: {
        create: { 
          name: 'Photos',
        },
        create: {
          name: 'Documents'
        },
        create: {
          name: 'Videos',
        }
      }
    }
  })
}
main()
  .then(async () => {
    console.log("done");
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })