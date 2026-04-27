import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const booking = await prisma.bookingRequest.findUnique({
      where: { id },
      include: { property: true },
    });
    if (!booking) return Response.json({ error: "Not found" }, { status: 404 });

    const isLandlord = session.user.role === "LANDLORD" && booking.property.landlordId === session.user.id;
    const isTenant = session.user.role === "TENANT" && booking.tenantId === session.user.id;

    if (!isLandlord && !isTenant) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const allowedByLandlord = ["ACCEPTED", "REJECTED"];
    const allowedByTenant = ["CANCELLED"];

    if (isLandlord && !allowedByLandlord.includes(status)) {
      return Response.json({ error: "Invalid status transition" }, { status: 400 });
    }
    if (isTenant && !allowedByTenant.includes(status)) {
      return Response.json({ error: "Invalid status transition" }, { status: 400 });
    }

    const updated = await prisma.bookingRequest.update({
      where: { id },
      data: { status },
    });

    if (status === "ACCEPTED") {
      await prisma.property.update({
        where: { id: booking.propertyId },
        data: { status: "PENDING" },
      });
    }

    return Response.json(updated);
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
