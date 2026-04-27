import { PrismaClient, PropertyType } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { hash } from "bcryptjs";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

const PROPERTIES: {
  title: string; description: string; address: string; suburb: string; city: string;
  latitude: number; longitude: number; bedrooms: number; bathrooms: number; price: number;
  type: PropertyType; images: string[]; amenities: string[];
}[] = [
  {
    title: "4-Bed Townhouse — Borrowdale",
    description: "Modern home in a secure gated community with open-plan living and four spacious ensuite bedrooms. State-of-the-art kitchen with granite counters, borehole, solar backup, and electric gate. Minutes from Borrowdale Village and Sam Levy's Village shopping.",
    address: "14 Borrowdale Road",
    suburb: "Borrowdale",
    city: "Harare",
    latitude: -17.7421,
    longitude: 31.0812,
    bedrooms: 4, bathrooms: 4, price: 3000,
    type: "TOWNHOUSE",
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"],
    amenities: ["WiFi", "Parking", "Security", "Borehole", "Solar", "Garden"],
  },
  {
    title: "Furnished 2-Bed Garden Flat — Avondale",
    description: "Fully furnished duplex apartment with fitted kitchen, private veranda, and dedicated parking. Borehole, electric gate, and serene garden setting. Walking distance to Avondale shops and popular restaurants — ideal for a young professional.",
    address: "22 King George Road",
    suburb: "Avondale",
    city: "Harare",
    latitude: -17.7883,
    longitude: 31.0269,
    bedrooms: 2, bathrooms: 1, price: 1600,
    type: "APARTMENT",
    images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80"],
    amenities: ["WiFi", "Parking", "Security", "Furnished", "Borehole", "Garden"],
  },
  {
    title: "3-Bed House — Highlands",
    description: "Spacious family home in prestigious Highlands with fully tiled interior, double garage, borehole, and manicured garden. Open-plan lounge with fireplace, separate dining room, and a large patio for entertaining. Close to Highlands shopping centre.",
    address: "7 Josiah Tongogara Avenue",
    suburb: "Highlands",
    city: "Harare",
    latitude: -17.8089,
    longitude: 31.0678,
    bedrooms: 3, bathrooms: 2, price: 2200,
    type: "HOUSE",
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80"],
    amenities: ["Parking", "Garden", "Security", "Borehole"],
  },
  {
    title: "Duplex Flat — Newlands",
    description: "Refurbished triple-storey duplex flat near Newlands shopping centre. Communal pool, entertainment area, 2 000L water tank, borehole, and double garage. Modern kitchen with granite countertops and fireplace in lounge. Very clean, well-managed complex.",
    address: "5 Newlands Avenue",
    suburb: "Newlands",
    city: "Harare",
    latitude: -17.8345,
    longitude: 31.0312,
    bedrooms: 3, bathrooms: 3, price: 1400,
    type: "APARTMENT",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"],
    amenities: ["WiFi", "Parking", "Pool", "Security", "Borehole"],
  },
  {
    title: "4-Bed Family Home — Greystone Park",
    description: "Well-maintained family home in secure Greystone Park. Double garage, large garden, borehole, solar geyser. All bedrooms with built-in cupboards, main bedroom ensuite. Close to Greystone Park Primary School and Borrowdale Village shopping.",
    address: "3 Greystone Drive",
    suburb: "Greystone Park",
    city: "Harare",
    latitude: -17.7512,
    longitude: 31.0678,
    bedrooms: 4, bathrooms: 2, price: 1600,
    type: "HOUSE",
    images: ["https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80"],
    amenities: ["Parking", "Garden", "Security", "Borehole", "Solar", "Pet-friendly"],
  },
  {
    title: "Furnished Villa — Greendale",
    description: "Fully furnished 3-bedroom villa in a gated Greendale complex. All bedrooms ensuite, modern open-plan kitchen, private patio, and communal pool. 3KVA solar backup, borehole, and 24-hour security. Close to Greendale shops and Eastgate Mall.",
    address: "18 Glenara Avenue",
    suburb: "Greendale",
    city: "Harare",
    latitude: -17.8012,
    longitude: 31.1023,
    bedrooms: 3, bathrooms: 3, price: 1800,
    type: "TOWNHOUSE",
    images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80"],
    amenities: ["WiFi", "Parking", "Pool", "Security", "Furnished", "Borehole", "Solar"],
  },
  {
    title: "Furnished Flat — Upper Avenues",
    description: "Well-appointed furnished flat in the sought-after Upper Avenues. Features a study room, fitted kitchen, private balcony, and access to a communal pool. Walking distance to Harare CBD, Avenues Clinic, restaurants, and supermarkets.",
    address: "9 Baines Avenue",
    suburb: "Avenues",
    city: "Harare",
    latitude: -17.8278,
    longitude: 31.0478,
    bedrooms: 2, bathrooms: 2, price: 1200,
    type: "APARTMENT",
    images: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80"],
    amenities: ["WiFi", "Parking", "Pool", "Security", "Furnished", "Balcony"],
  },
  {
    title: "4-Bed House — Mandara",
    description: "Beautiful home in quiet, leafy Mandara. All four bedrooms with built-in cupboards, main ensuite with dressing area. Lounge with fireplace, fitted kitchen, double garage, borehole, and electric perimeter fence. Perfect for a family.",
    address: "6 Mandara Drive",
    suburb: "Mandara",
    city: "Harare",
    latitude: -17.7812,
    longitude: 31.1234,
    bedrooms: 4, bathrooms: 2, price: 1500,
    type: "HOUSE",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"],
    amenities: ["Parking", "Garden", "Security", "Borehole"],
  },
  {
    title: "3-Bed House — Marlborough",
    description: "Spacious walled and gated home with double lock-up garage. Three bedrooms, open-plan kitchen and lounge, fitted kitchen with electric and gas hob, water tank, and security lights. Close to Marlborough shops and public transport.",
    address: "11 Marlborough Drive",
    suburb: "Marlborough",
    city: "Harare",
    latitude: -17.7934,
    longitude: 31.0134,
    bedrooms: 3, bathrooms: 2, price: 1200,
    type: "HOUSE",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"],
    amenities: ["Parking", "Security", "Garden"],
  },
  {
    title: "3-Bed House with Cottage — Westgate",
    description: "Modern house with a separate 2-bed cottage — ideal for rental income or extended family. Solar backup, borehole, and electric gate. Open-plan living with granite kitchen counters and fitted wardrobes throughout. Close to Westgate Mall and US Embassy.",
    address: "42 Westgate Road",
    suburb: "Westgate",
    city: "Harare",
    latitude: -17.8067,
    longitude: 30.9934,
    bedrooms: 3, bathrooms: 2, price: 1500,
    type: "HOUSE",
    images: ["https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&q=80"],
    amenities: ["Parking", "Security", "Borehole", "Solar", "Garden"],
  },
  {
    title: "2-Bed Cluster Townhouse — Vainona",
    description: "Modern cluster townhouse in a secure Vainona complex. Open-plan lounge and kitchen, private garden, and covered parking. Close to Borrowdale Village shopping, international schools, and easy access to Harare North.",
    address: "8 Vainona Drive",
    suburb: "Vainona",
    city: "Harare",
    latitude: -17.7623,
    longitude: 31.0756,
    bedrooms: 2, bathrooms: 1, price: 1300,
    type: "TOWNHOUSE",
    images: ["https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&q=80"],
    amenities: ["WiFi", "Parking", "Security", "Garden"],
  },
  {
    title: "2-Bed House — Msasa Park",
    description: "Newly renovated tiled 2-bedroom home. Built-in cupboards, fitted kitchen, carport, 2 000L water tank, walled and gated. Quiet residential street. Ideal for a small family or young couple looking for value in a well-connected location.",
    address: "17 Msasa Park Road",
    suburb: "Msasa Park",
    city: "Harare",
    latitude: -17.8567,
    longitude: 31.1134,
    bedrooms: 2, bathrooms: 1, price: 480,
    type: "HOUSE",
    images: ["https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80"],
    amenities: ["Parking", "Security"],
  },
  {
    title: "3-Bed Duplex Flat — Greencroft",
    description: "Modern duplex flat with fully fitted kitchen, separate laundry room, 3KVA solar backup, and electric geyser. Walled and gated complex with secure parking. Close to Westgate Mall and good schools.",
    address: "3 Greencroft Avenue",
    suburb: "Greencroft",
    city: "Harare",
    latitude: -17.8134,
    longitude: 31.0078,
    bedrooms: 3, bathrooms: 2, price: 1450,
    type: "APARTMENT",
    images: ["https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80"],
    amenities: ["WiFi", "Parking", "Security", "Laundry", "Solar"],
  },
  {
    title: "4-Bed House — Tynwald",
    description: "Modern 4-bedroom family home with solar geyser, 2 000L water tank, double garage, walled and gated. Tiled throughout, fitted kitchen with gas hob. Quiet street close to Tynwald Park. Excellent value for a large family.",
    address: "25 Tynwald Drive",
    suburb: "Tynwald",
    city: "Harare",
    latitude: -17.8167,
    longitude: 31.0023,
    bedrooms: 4, bathrooms: 2, price: 550,
    type: "HOUSE",
    images: ["https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800&q=80"],
    amenities: ["Parking", "Security", "Solar", "Garden"],
  },
  {
    title: "3-Bed House — Waterfalls",
    description: "Comfortable 3-bedroom home in a quiet Waterfalls street. Tiled throughout, fitted kitchen, 2 000L water tank, walled and gated with double carport. Close to Waterfalls shops and schools. Good value for a family.",
    address: "9 Waterfalls Road",
    suburb: "Waterfalls",
    city: "Harare",
    latitude: -17.8745,
    longitude: 31.0456,
    bedrooms: 3, bathrooms: 2, price: 650,
    type: "HOUSE",
    images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80"],
    amenities: ["Parking", "Security", "Garden"],
  },
  {
    title: "Executive Home — Borrowdale Brooke Estate",
    description: "Modern executive home in the exclusive Borrowdale Brooke estate. Four bedrooms, open-plan kitchen with island counter, heated pool, borehole, 5KVA solar system, and electric perimeter fence. 24/7 estate security with guard house. A true flagship property.",
    address: "7 Brooke Estate Drive",
    suburb: "Borrowdale Brooke",
    city: "Harare",
    latitude: -17.7310,
    longitude: 31.0920,
    bedrooms: 4, bathrooms: 3, price: 1900,
    type: "HOUSE",
    images: ["https://images.unsplash.com/photo-1706808849802-8f876ade0d1f?w=800&q=80"],
    amenities: ["Pool", "Parking", "Garden", "Security", "Borehole", "Solar"],
  },
  {
    title: "3-Bed House — Glen Lorne",
    description: "Well-maintained home in leafy Glen Lorne. Large garden with mature trees, borehole, double garage, walled and gated. Three bedrooms with built-in cupboards, open-plan lounge with fireplace. Quiet estate close to Borrowdale Village shops.",
    address: "14 Glen Lorne Road",
    suburb: "Glen Lorne",
    city: "Harare",
    latitude: -17.7345,
    longitude: 31.1023,
    bedrooms: 3, bathrooms: 2, price: 900,
    type: "HOUSE",
    images: ["https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80"],
    amenities: ["Parking", "Garden", "Security", "Borehole"],
  },
  {
    title: "2-Bed Flat — Avondale West",
    description: "Neat 2-bedroom flat in a well-managed Avondale West complex. Built-in cupboards throughout, fitted kitchen, lounge with balcony, and off-street parking. Close to Avondale shops, restaurants, and public transport. Ideal for a young professional.",
    address: "5 Maasdorp Avenue",
    suburb: "Avondale West",
    city: "Harare",
    latitude: -17.7923,
    longitude: 31.0189,
    bedrooms: 2, bathrooms: 1, price: 700,
    type: "APARTMENT",
    images: ["https://images.unsplash.com/photo-1598228723793-52759bba239c?w=800&q=80"],
    amenities: ["WiFi", "Parking", "Security", "Balcony"],
  },
  {
    title: "2-Bed Flat — Eastlea",
    description: "Modern 2-bedroom flat in a secure Eastlea complex. Tiled throughout, fitted kitchen, open-plan lounge, covered parking. Gated complex with guard. Close to Eastlea shopping centre and easy access to the CBD and Newlands.",
    address: "33 Eastlea Drive",
    suburb: "Eastlea",
    city: "Harare",
    latitude: -17.8234,
    longitude: 31.0934,
    bedrooms: 2, bathrooms: 1, price: 1200,
    type: "APARTMENT",
    images: ["https://images.unsplash.com/photo-1651752523215-9bf678c29355?w=800&q=80"],
    amenities: ["WiFi", "Parking", "Security"],
  },
  {
    title: "3-Bed House — Madokero",
    description: "Secured family home with three bedrooms, fitted kitchen with electric and gas hob, separate office room, 2 000L water tank, and double carport. Quiet neighbourhood close to Westgate Mall, US Embassy, and Harare International School.",
    address: "18 Madokero Road",
    suburb: "Madokero",
    city: "Harare",
    latitude: -17.8034,
    longitude: 30.9867,
    bedrooms: 3, bathrooms: 2, price: 800,
    type: "HOUSE",
    images: ["https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80"],
    amenities: ["Parking", "Security", "Garden"],
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Create landlords
  const landlordPassword = await hash("password123", 12);

  const landlords = await Promise.all([
    prisma.user.upsert({
      where: { email: "james@roja.co.za" },
      update: {},
      create: {
        email: "james@roja.co.za",
        password: landlordPassword,
        name: "James Moyo",
        phone: "+263 77 123 4567",
        role: "LANDLORD",
        bio: "Property investor with 15+ years experience. I manage over 12 properties across Harare's northern suburbs.",
      },
    }),
    prisma.user.upsert({
      where: { email: "sarah@roja.co.za" },
      update: {},
      create: {
        email: "sarah@roja.co.za",
        password: landlordPassword,
        name: "Sarah Mutasa",
        phone: "+263 71 987 6543",
        role: "LANDLORD",
        bio: "Harare property specialist. I pride myself on well-maintained, beautiful spaces and responsive service.",
      },
    }),
    prisma.user.upsert({
      where: { email: "thabo@roja.co.za" },
      update: {},
      create: {
        email: "thabo@roja.co.za",
        password: landlordPassword,
        name: "Tendai Dube",
        phone: "+263 63 456 7890",
        role: "LANDLORD",
        bio: "Harare-based landlord with a passion for community. All my units are modern, safe, and value for money.",
      },
    }),
  ]);

  // Create tenants
  const tenantPassword = await hash("password123", 12);

  const tenants = await Promise.all([
    prisma.user.upsert({
      where: { email: "alice@example.com" },
      update: {},
      create: {
        email: "alice@example.com",
        password: tenantPassword,
        name: "Alice Chigumba",
        phone: "+263 77 111 2222",
        role: "TENANT",
      },
    }),
    prisma.user.upsert({
      where: { email: "tom@example.com" },
      update: {},
      create: {
        email: "tom@example.com",
        password: tenantPassword,
        name: "Tom Murwira",
        phone: "+263 71 333 4444",
        role: "TENANT",
      },
    }),
  ]);

  // Create properties — distribute across the 3 landlords (20 properties total)
  const landlordMap = [
    landlords[0], landlords[0], landlords[0], landlords[0], landlords[0], landlords[0], landlords[0], // 7 → James
    landlords[1], landlords[1], landlords[1], landlords[1], landlords[1], landlords[1], // 6 → Sarah
    landlords[2], landlords[2], landlords[2], landlords[2], landlords[2], landlords[2], landlords[2], // 7 → Tendai
  ];

  const createdProperties = [];
  for (let i = 0; i < PROPERTIES.length; i++) {
    const p = PROPERTIES[i];
    const landlord = landlordMap[i];

    const existing = await prisma.property.findFirst({
      where: { title: p.title, landlordId: landlord.id },
    });

    if (existing) {
      createdProperties.push(existing);
      continue;
    }

    const prop = await prisma.property.create({
      data: {
        ...p,
        landlordId: landlord.id,
        images: JSON.stringify(p.images),
        amenities: JSON.stringify(p.amenities),
      },
    });
    createdProperties.push(prop);
  }

  // Add a review to first property
  if (createdProperties[0]) {
    const hasReview = await prisma.review.findFirst({ where: { propertyId: createdProperties[0].id, tenantId: tenants[0].id } });
    if (!hasReview) {
      await prisma.review.create({
        data: {
          propertyId: createdProperties[0].id,
          tenantId: tenants[0].id,
          rating: 5,
          comment: "James is an excellent landlord — very responsive and the townhouse is exactly as described. The Borrowdale location is fantastic, right near Sam Levy's.",
        },
      });
      await prisma.review.create({
        data: {
          propertyId: createdProperties[0].id,
          tenantId: tenants[1].id,
          rating: 4,
          comment: "Great place, solar and borehole are a lifesaver with load shedding and water cuts. James was very helpful throughout the process.",
        },
      });
    }
  }

  console.log(`✅ Seeded:
  - ${landlords.length} landlords
  - ${tenants.length} tenants
  - ${createdProperties.length} properties

Demo accounts (password: password123):
  Landlord: james@roja.co.za
  Landlord: sarah@roja.co.za
  Tenant:   alice@example.com
  Tenant:   tom@example.com`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
