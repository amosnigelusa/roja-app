const { PrismaLibSql } = require("@prisma/adapter-libsql");
const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const pw = await hash("Password123", 12);
  const tenant = await prisma.user.upsert({
    where: { email: "amonigel@gmail.com" },
    update: { password: pw },
    create: { email: "amonigel@gmail.com", password: pw, name: "Amos Nigel", role: "TENANT" },
  });
  const landlord = await prisma.user.upsert({
    where: { email: "amonigel.landlord@gmail.com" },
    update: { password: pw },
    create: { email: "amonigel.landlord@gmail.com", password: pw, name: "Amos Nigel", role: "LANDLORD" },
  });
  console.log("Created:", tenant.email, "|", landlord.email);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e.message); process.exit(1); });
