import { MapContainer, TileLayer } from "react-leaflet"
import 'leaflet/dist/leaflet.css';
import Pin from "../pin/Pin";

const Map = ({items = []}) => {
  // デフォルトの位置（例：日本の中心あたり）
  const defaultPosition = [24.8055, 125.2811];
  
  // items が空でない場合のみ、最初の投稿の位置を使用
  const position = items && items.length > 0 && items[0].location
    ? [items[0].location.latitude, items[0].location.longitude]
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
        {items.map(item => (
          <Pin item={item} key={item.id} />
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;