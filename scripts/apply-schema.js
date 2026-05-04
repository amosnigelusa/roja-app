const { createClient } = require("@libsql/client");

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const statements = [
  `CREATE TABLE IF NOT EXISTS "User" ("id" TEXT NOT NULL PRIMARY KEY,"email" TEXT NOT NULL,"password" TEXT NOT NULL,"name" TEXT NOT NULL,"phone" TEXT,"avatar" TEXT,"role" TEXT NOT NULL DEFAULT 'TENANT',"bio" TEXT,"createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" DATETIME NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS "Property" ("id" TEXT NOT NULL PRIMARY KEY,"landlordId" TEXT NOT NULL,"title" TEXT NOT NULL,"description" TEXT NOT NULL,"address" TEXT NOT NULL,"suburb" TEXT NOT NULL,"city" TEXT NOT NULL,"latitude" REAL NOT NULL,"longitude" REAL NOT NULL,"bedrooms" INTEGER NOT NULL,"bathrooms" INTEGER NOT NULL,"price" REAL NOT NULL,"images" TEXT NOT NULL DEFAULT '[]',"amenities" TEXT NOT NULL DEFAULT '[]',"status" TEXT NOT NULL DEFAULT 'AVAILABLE',"type" TEXT NOT NULL DEFAULT 'APARTMENT',"createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" DATETIME NOT NULL,CONSTRAINT "Property_landlordId_fkey" FOREIGN KEY ("landlordId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS "BookingRequest" ("id" TEXT NOT NULL PRIMARY KEY,"tenantId" TEXT NOT NULL,"propertyId" TEXT NOT NULL,"status" TEXT NOT NULL DEFAULT 'PENDING',"message" TEXT,"moveInDate" DATETIME,"createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" DATETIME NOT NULL,CONSTRAINT "BookingRequest_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,CONSTRAINT "BookingRequest_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE RESTRICT ON UPDATE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS "Review" ("id" TEXT NOT NULL PRIMARY KEY,"tenantId" TEXT NOT NULL,"propertyId" TEXT NOT NULL,"rating" INTEGER NOT NULL,"comment" TEXT NOT NULL,"createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "Review_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,CONSTRAINT "Review_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE RESTRICT ON UPDATE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS "Message" ("id" TEXT NOT NULL PRIMARY KEY,"senderId" TEXT NOT NULL,"receiverId" TEXT NOT NULL,"propertyId" TEXT,"content" TEXT NOT NULL,"read" BOOLEAN NOT NULL DEFAULT false,"createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,CONSTRAINT "Message_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE SET NULL ON UPDATE CASCADE)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`,
];

async function run() {
  for (const stmt of statements) {
    await client.execute(stmt);
    console.log("OK:", stmt.substring(0, 70) + "...");
  }
  console.log("Schema applied to Turso!");
}

run().catch((e) => { console.error(e.message); process.exit(1); });
