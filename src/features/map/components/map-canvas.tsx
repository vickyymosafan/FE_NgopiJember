"use client";

import { useMemo } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import type { CoffeeShop } from "@/features/coffee-shop/types/coffee-shop.types";

const JEMBER_CENTER: [number, number] = [-8.1684, 113.7137];

function createIcon(active: boolean): L.DivIcon {
  return L.divIcon({
    className: "ngopi-marker",
    html: `<span class="ngopi-pin${active ? " is-active" : ""}"></span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

function FlyToSelected({
  shop,
}: {
  shop: CoffeeShop | null;
}) {
  const map = useMap();
  if (shop && shop.latitude !== null && shop.longitude !== null) {
    map.flyTo([shop.latitude, shop.longitude], 16, { duration: 0.6 });
  }
  return null;
}

interface MapCanvasProps {
  shops: CoffeeShop[];
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
}

export default function MapCanvas({
  shops,
  selectedSlug,
  onSelect,
}: MapCanvasProps) {
  const selected = useMemo(
    () => shops.find((shop) => shop.slug === selectedSlug) ?? null,
    [shops, selectedSlug],
  );

  return (
    <MapContainer
      center={JEMBER_CENTER}
      zoom={14}
      scrollWheelZoom
      className="size-full"
      style={{ background: "var(--muted)" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup chunkedLoading maxClusterRadius={50}>
        {shops.map((shop) =>
          shop.latitude !== null && shop.longitude !== null ? (
            <Marker
              key={shop.id}
              position={[shop.latitude, shop.longitude]}
              icon={createIcon(shop.slug === selectedSlug)}
              eventHandlers={{ click: () => onSelect(shop.slug) }}
            >
              <Popup>
                <span className="block text-sm font-semibold">{shop.name}</span>
                <span className="block text-xs text-slate-500">
                  {shop.address}
                </span>
                <a
                  href={`/coffee-shops/${shop.slug}`}
                  className="mt-1 inline-block text-xs font-medium text-[#c08457]"
                >
                  Lihat detail
                </a>
              </Popup>
            </Marker>
          ) : null,
        )}
      </MarkerClusterGroup>
      <FlyToSelected shop={selected} />
    </MapContainer>
  );
}