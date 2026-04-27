import Link from "next/link";
import { Property } from "@/types";
import { PropertyStatusBadge } from "./StatusBadge";

const typeLabel: Record<string, string> = {
  APARTMENT: "Apartment",
  HOUSE: "House",
  TOWNHOUSE: "Townhouse",
  STUDIO: "Studio",
  ROOM: "Room",
};

interface Props {
  property: Property & { avgRating?: number | null };
  compact?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

export default function PropertyCard({ property, compact = false, onClick, selected }: Props) {
  const coverImage = property.images?.[0] || null;

  const content = (
    <div
      className={`bg-white rounded-2xl border transition-all cursor-pointer overflow-hidden
        ${selected ? "border-black shadow-lg ring-2 ring-black" : "border-gray-200 hover:border-gray-400 hover:shadow-md"}
        ${compact ? "flex gap-3" : "flex flex-col"}`}
      onClick={onClick}
    >
      {/* Image */}
      <div className={`bg-gray-100 shrink-0 ${compact ? "w-24 h-24 rounded-xl m-2" : "w-full h-48"} overflow-hidden relative`}>
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverImage} alt={property.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">🏠</span>
          </div>
        )}
        {!compact && (
          <div className="absolute top-3 left-3">
            <PropertyStatusBadge status={property.status} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className={`${compact ? "flex-1 py-2 pr-3" : "p-4"}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{typeLabel[property.type]}</p>
            <h3 className={`font-semibold leading-snug truncate mt-0.5 ${compact ? "text-sm" : "text-base"}`}>
              {property.title}
            </h3>
            <p className="text-xs text-gray-500 truncate mt-0.5">{property.suburb}, {property.city}</p>
          </div>
          {property.avgRating && (
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-yellow-400 text-xs">★</span>
              <span className="text-xs font-semibold">{property.avgRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
          <span>{property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}</span>
          <span className="text-gray-300">·</span>
          <span>{property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <p className={`font-bold text-black ${compact ? "text-sm" : "text-base"}`}>
            ${property.price.toLocaleString()}
            <span className="text-xs font-normal text-gray-500">/mo</span>
          </p>
          {property.landlord && !compact && (
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{property.landlord.name[0]}</span>
              </div>
              <span className="text-xs text-gray-500">{property.landlord.name.split(" ")[0]}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (onClick) return content;

  return <Link href={`/tenant/property/${property.id}`}>{content}</Link>;
}
