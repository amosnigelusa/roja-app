"use client";

import { useEffect, useRef } from "react";
import { Property } from "@/types";

interface Props {
  properties: Property[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  center?: [number, number];
}

export default function MapView({ properties, selectedId, onSelect, center }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    let destroyed = false;

    import("leaflet").then((L) => {
      if (destroyed || !mapRef.current || mapInstanceRef.current) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const defaultCenter = center || [-17.8252, 31.0335]; // Harare
      const map = L.map(mapRef.current!).setView(defaultCenter, 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      properties.forEach((p) => {
        const isSelected = p.id === selectedId;
        const icon = L.divIcon({
          className: "",
          html: `<div style="
            background:${isSelected ? "#000" : "#fff"};
            color:${isSelected ? "#fff" : "#000"};
            border:2px solid #000;
            border-radius:12px;
            padding:4px 10px;
            font-weight:700;
            font-size:12px;
            white-space:nowrap;
            box-shadow:0 2px 8px rgba(0,0,0,0.2);
            cursor:pointer;
          ">$${p.price.toLocaleString()}</div>`,
          iconAnchor: [30, 16],
        });

        const marker = L.marker([p.latitude, p.longitude], { icon })
          .addTo(map)
          .on("click", () => onSelect?.(p.id));

        markersRef.current.push({ id: p.id, marker });
      });
    });

    return () => {
      destroyed = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker styles when selection changes
  useEffect(() => {
    import("leaflet").then((L) => {
      markersRef.current.forEach(({ id, marker }) => {
        const p = properties.find((p) => p.id === id);
        if (!p) return;
        const isSelected = id === selectedId;
        const icon = L.divIcon({
          className: "",
          html: `<div style="
            background:${isSelected ? "#000" : "#fff"};
            color:${isSelected ? "#fff" : "#000"};
            border:2px solid #000;
            border-radius:12px;
            padding:4px 10px;
            font-weight:700;
            font-size:12px;
            white-space:nowrap;
            box-shadow:0 2px 8px rgba(0,0,0,${isSelected ? "0.4" : "0.2"});
            cursor:pointer;
            transform:${isSelected ? "scale(1.1)" : "scale(1)"};
            transition:all 0.2s;
          ">$${p.price.toLocaleString()}</div>`,
          iconAnchor: [30, 16],
        });
        marker.setIcon(icon);
      });
    });
  }, [selectedId, properties]);

  // Pan map to center when it changes
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, 12, { animate: true });
    }
  }, [center]);

  return (
    <div className="w-full h-full relative">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />
      <div ref={mapRef} className="w-full h-full rounded-2xl" />
    </div>
  );
}
