import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "LANDLORD") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const properties = await prisma.property.findMany({
      where: { landlordId: session.user.id },
      include: {
        _count: { select: { bookingRequests: true, reviews: true } },
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const parsed = properties.map((p) => ({
      ...p,
      images: JSON.parse(p.images),
      amenities: JSON.parse(p.amenities),
    }));

    return Response.json(parsed);
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
