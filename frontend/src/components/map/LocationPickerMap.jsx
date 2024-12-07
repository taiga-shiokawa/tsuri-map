import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import 'leaflet/dist/leaflet.css';

const LocationPickerMap = ({ onLocationSelect, initialPosition, selectedPosition }) => {
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        onLocationSelect({ latitude: lat, longitude: lng });
      },
    });
    return null;
  };

  return (
    <div className="h-[250px] w-full border rounded-lg overflow-hidden">
      <MapContainer 
        center={initialPosition || [24.8055, 125.2811]}
        zoom={12} 
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler />
        {selectedPosition && (
          <Marker position={[selectedPosition.latitude, selectedPosition.longitude]} />
        )}
      </MapContainer>
    </div>
  );
};

export default LocationPickerMap;