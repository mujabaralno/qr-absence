"use client";

import { useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Props = Readonly<{
  onLocationSelect: (lat: number, lng: number) => void;
}>;

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
}

function LocationMarker({ onLocationSelect }: Props) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position ? <Marker position={position} icon={icon} /> : null;
}

function MapController({
  searchPosition,
}: {
  searchPosition: L.LatLng | null;
}) {
  const map = useMap();

  if (searchPosition) {
    map.setView(searchPosition, 15);
  }

  return null;
}

export default function LocationPicker({ onLocationSelect }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchPosition, setSearchPosition] = useState<L.LatLng | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Menggunakan Nominatim API untuk geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&countrycodes=id&addressdetails=1`
      );
      const data: SearchResult[] = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      console.error("Error searching location:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchLocation(value);
    }, 500);
  };

  const handleResultClick = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const position = new L.LatLng(lat, lng);

    setSearchPosition(position);
    onLocationSelect(lat, lng);
    setShowResults(false);
    setSearchQuery(result.display_name);
  };

  const handleResultKeyDown = (
    e: React.KeyboardEvent,
    result: SearchResult
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleResultClick(result);
    }
  };

  const handleSearchFocus = () => {
    if (searchResults.length > 0) {
      setShowResults(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding results to allow clicking on them
    setTimeout(() => setShowResults(false), 200);
  };

  return (
    <div className="relative">
      {/* Map Container */}
      <div className="z-1">
        <MapContainer
          center={[-6.2, 106.8]}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
          className="rounded-lg border border-gray-300"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap"
          />
          <LocationMarker onLocationSelect={onLocationSelect} />
          <MapController searchPosition={searchPosition} />
        </MapContainer>
      </div>

      {/* Instructions */}
      <div className="mt-2 text-sm text-gray-600">
        <p>
          💡 Tips: Ketik nama lokasi di kotak pencarian atau klik langsung pada
          peta untuk memilih lokasi
        </p>
      </div>

      {/* Search Input */}
      <div className="mt-4 relative z-10">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            placeholder="Cari lokasi... (contoh: Jakarta, Bandung, dll)"
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {isSearching ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            ) : (
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute z- w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result) => (
              <button
                key={result.place_id}
                type="button"
                onClick={() => handleResultClick(result)}
                onKeyDown={(e) => handleResultKeyDown(e, result)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
                tabIndex={0}
              >
                <div className="text-sm font-medium text-gray-900 truncate">
                  {result.display_name}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
