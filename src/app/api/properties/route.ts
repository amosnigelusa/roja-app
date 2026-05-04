import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const bedrooms = searchParams.get("bedrooms");
    const maxPrice = searchParams.get("maxPrice");
    const type = searchParams.get("type");

    const where: Record<string, unknown> = { status: "AVAILABLE" };
    if (city) where.city = { contains: city };
    if (bedrooms) where.bedrooms = parseInt(bedrooms);
    if (maxPrice) where.price = { lte: parseFloat(maxPrice) };
    if (type) where.type = type;

    const properties = await prisma.property.findMany({
      where,
      include: {
        landlord: {
          select: { id: true, name: true, email: true, phone: true, avatar: true, bio: true },
        },
        reviews: { select: { rating: true } },
        _count: { select: { bookingRequests: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const parsed = properties.map((p) => ({
      ...p,
      images: JSON.parse(p.images),
      amenities: JSON.parse(p.amenities),
      avgRating:
        p.reviews.length > 0
          ? p.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / p.reviews.length
          : null,
    }));

    return Response.json(parsed);
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "LANDLORD") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, address, suburb, city, latitude, longitude,
      bedrooms, bathrooms, price, images, amenities, type } = body;

    const property = await prisma.property.create({
      data: {
        landlordId: session.user.id,
        title,
        description,
        address,
        suburb,
        city,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        price: parseFloat(price),
        images: JSON.stringify(images || []),
        amenities: JSON.stringify(amenities || []),
        type: type || "APARTMENT",
      },
    });

    return Response.json({ ...property, images: JSON.parse(property.images), amenities: JSON.parse(property.amenities) }, { status: 201 });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
