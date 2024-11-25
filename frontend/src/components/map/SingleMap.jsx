import { MapContainer, TileLayer } from "react-leaflet";
import Pin from "../pin/Pin";

const SingleMap = ({item}) => {
  // デフォルトの位置（例：日本の中心あたり）
  const defaultPosition = [24.8055, 125.2811];

  return (
    <div className="h-[calc(100vh-2rem)] w-full border rounded-lg shadow-lg overflow-hidden">
      <MapContainer 
        center={item.location.latitude && item.location.longitude ? [item.location.latitude, item.location.longitude] : defaultPosition} 
        zoom={12.5} 
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Pin item={item}/>
      </MapContainer>
    </div>
  )
}

export default SingleMap