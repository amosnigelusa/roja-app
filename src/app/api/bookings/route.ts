import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const role = session.user.role;

    let bookings;
    if (role === "TENANT") {
      bookings = await prisma.bookingRequest.findMany({
        where: { tenantId: session.user.id },
        include: {
          property: {
            include: { landlord: { select: { id: true, name: true, email: true, phone: true, avatar: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else if (role === "LANDLORD") {
      const propertyId = searchParams.get("propertyId");
      bookings = await prisma.bookingRequest.findMany({
        where: {
          property: { landlordId: session.user.id },
          ...(propertyId && { propertyId }),
        },
        include: {
          tenant: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
          property: { select: { id: true, title: true, address: true, price: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return Response.json(bookings);
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "TENANT") {
      return Response.json({ error: "Only tenants can request bookings" }, { status: 401 });
    }

    const body = await req.json();
    const { propertyId, message, moveInDate } = body;

    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return Response.json({ error: "Property not found" }, { status: 404 });
    if (property.status !== "AVAILABLE") {
      return Response.json({ error: "Property is not available" }, { status: 400 });
    }

    const existing = await prisma.bookingRequest.findFirst({
      where: { tenantId: session.user.id, propertyId, status: { in: ["PENDING", "ACCEPTED"] } },
    });
    if (existing) return Response.json({ error: "You already have an active request for this property" }, { status: 409 });

    const booking = await prisma.bookingRequest.create({
      data: {
        tenantId: session.user.id,
        propertyId,
        message,
        moveInDate: moveInDate ? new Date(moveInDate) : null,
      },
      include: {
        property: { select: { id: true, title: true } },
        tenant: { select: { id: true, name: true } },
      },
    });

    return Response.json(booking, { status: 201 });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
