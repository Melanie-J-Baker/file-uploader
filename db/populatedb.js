#! /usr/bin/env node

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  await prisma.users.create({
    data: {
      username: "David",
      password: "Password1",
      folders: {
        create: {
          name: "Photos",
        },
        create: {
          name: "Documents",
        },
        create: {
          name: "Videos",
        },
      },
    },
  });
}
main()
  .then(async () => {
    console.log("done");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
