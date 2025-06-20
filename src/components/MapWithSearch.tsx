import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { LocateFixed, Navigation } from "lucide-react";

// Fix default icon issue
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png?url";
import markerIcon from "leaflet/dist/images/marker-icon.png?url";
import markerShadow from "leaflet/dist/images/marker-shadow.png?url";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapWithSearchProps {
  center: LatLngExpression;
  zoom?: number;
  markerLabel?: string;
}

const FlyToPosition = ({ position }: { position: LatLngExpression }) => {
  const map = useMap();
  map.flyTo(position, 16);
  return null;
};

export const MapWithSearch = ({ center, zoom = 15, markerLabel }: MapWithSearchProps) => {
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState<LatLngExpression>(center);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search) return;
    try {
      setSearching(true);
      const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`);
      const data = await resp.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPos: LatLngExpression = [parseFloat(lat), parseFloat(lon)];
        setPosition(newPos);
      }
    } finally {
      setSearching(false);
    }
  };

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const coords: LatLngExpression = [pos.coords.latitude, pos.coords.longitude];
      setPosition(coords);
    });
  };

  const handleDirections = () => {
    const dest = Array.isArray(center) ? center : [0, 0];
    const [lat, lng] = dest as number[];
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
  };

  const customIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div className="relative w-full h-full">
      {/* Search overlay */}
      <form onSubmit={handleSearch} className="absolute z-[1000] top-4 left-1/2 -translate-x-1/2 w-11/12 md:w-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full px-4 py-2 shadow-lg">
        <Search className="h-4 w-4 text-slate-500" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un lieu..."
          className="border-none focus-visible:ring-0 bg-transparent pl-2 flex-1"
        />
      </form>

      <MapContainer center={position} zoom={zoom} scrollWheelZoom style={{ height: "100%", width: "100%", borderRadius: "inherit" }}>
        <TileLayer
          attribution='© <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={customIcon}>
          <Popup>{markerLabel}</Popup>
        </Marker>
        <FlyToPosition position={position} />
      </MapContainer>
      {searching && <div className="absolute inset-0 bg-white/60 flex items-center justify-center text-slate-700 font-medium">Recherche...</div>}

      {/* Action buttons */}
      <div className="absolute z-[1000] bottom-4 right-4 flex flex-col gap-2">
        <Button size="icon" variant="secondary" onClick={handleLocate} title="Ma position">
          <LocateFixed className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" onClick={handleDirections} title="Itinéraire">
          <Navigation className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}; 