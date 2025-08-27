import React from "react";
import { Marker, useMapEvents, Popup } from "react-leaflet";
import L from "leaflet";
import toast from "react-hot-toast";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
});

// Custom marker component that handles map clicks
export default function Map({ position, setPosition, setAddress, mapRef }) {
  const map = useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      const newPosition = [lat, lng];
      setPosition(newPosition);

      // Fly to the selected location with smooth animation
      map.flyTo(newPosition, 16, {
        animate: true,
        duration: 1.0,
      });

      // Reverse geocoding to get address
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
        );
        const data = await response.json();
        if (data.display_name) {
          setAddress(data.display_name);
          toast.success("Location selected successfully!");
        }
      } catch (error) {
        console.error("Error getting address:", error);
        toast.error("Could not get address for this location");
      }
    },
  });

  // Update map center when position changes externally (like from getCurrentLocation)
  React.useEffect(() => {
    if (position && map) {
      map.flyTo(position, 16, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        <div style={{ textAlign: "center", padding: "8px" }}>
          <strong>📍 Delivery Location</strong>
          <br />
          <small>Lat: {position[0].toFixed(6)}</small>
          <br />
          <small>Lng: {position[1].toFixed(6)}</small>
        </div>
      </Popup>
    </Marker>
  );
}
