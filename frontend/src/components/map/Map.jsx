import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import Pin from "../pin/Pin";

// クリックイベントを処理するための新しいコンポーネント
const LocationMarker = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect({ latitude: lat, longitude: lng });
    },
  });

  return null;
};

const Map = ({ items = [], onLocationSelect, isSelectingLocation = false }) => {
  const validItems = Array.isArray(items) ? items : [];  // 配列チェック
  const defaultPosition = [24.8055, 125.2811];
  
  const position = validItems.length > 0 && validItems[0]?.location?.latitude && validItems[0]?.location?.longitude
    ? [validItems[0].location.latitude, validItems[0].location.longitude]
    : defaultPosition;

  return (
    <div className="h-[calc(100vh-2rem)] w-full border rounded-lg shadow-lg overflow-hidden">
      <MapContainer 
        center={position} 
        zoom={12.5} 
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validItems.map(item => (
          item?.location ? <Pin item={item} key={item.id} /> : null
        ))}
        {isSelectingLocation && <LocationMarker onLocationSelect={onLocationSelect} />}
      </MapContainer>
    </div>
  );
};

export default Map;