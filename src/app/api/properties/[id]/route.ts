import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        landlord: {
          select: { id: true, name: true, email: true, phone: true, avatar: true, bio: true, createdAt: true },
        },
        reviews: {
          include: { tenant: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { bookingRequests: true } },
      },
    });

    if (!property) return Response.json({ error: "Not found" }, { status: 404 });

    return Response.json({
      ...property,
      images: JSON.parse(property.images),
      amenities: JSON.parse(property.amenities),
      avgRating:
        property.reviews.length > 0
          ? property.reviews.reduce((sum: number, r) => sum + r.rating, 0) / property.reviews.length
          : null,
    });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) return Response.json({ error: "Not found" }, { status: 404 });
    if (property.landlordId !== session.user.id) return Response.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const updated = await prisma.property.update({
      where: { id },
      data: {
        ...body,
        images: body.images ? JSON.stringify(body.images) : undefined,
        amenities: body.amenities ? JSON.stringify(body.amenities) : undefined,
      },
    });

    return Response.json({ ...updated, images: JSON.parse(updated.images), amenities: JSON.parse(updated.amenities) });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) return Response.json({ error: "Not found" }, { status: 404 });
    if (property.landlordId !== session.user.id) return Response.json({ error: "Forbidden" }, { status: 403 });

    await prisma.property.delete({ where: { id } });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
