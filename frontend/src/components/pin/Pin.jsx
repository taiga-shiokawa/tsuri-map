import { Marker, Popup } from "react-leaflet";
import WeatherDisplay from "../../utils/WeatherDisplay";
import FishingTypeDisplay from "../../utils/FishingTypeDisplay";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// デフォルトアイコンの設定
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Pin = ({item}) => {
  if (!item || !item.location) return null;

  const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location.latitude)},${encodeURIComponent(item.location.longitude)}`;

  return (
    <Marker position={[item.location.latitude, item.location.longitude]}>
      <Popup>
        <div className="p-2">
          <h3 className="font-bold">
            <a 
              href={searchUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800 hover:underline"
            >
              {item.locationName}
            </a>
          </h3>
          <p>{item.fishName}</p>
          <WeatherDisplay weather={item.weather} />
          <p className="mb-3"><FishingTypeDisplay fishingType={item.fishingType} /></p>
          <p>{new Date(item.fishingDate).toLocaleDateString()}</p>
          {item.description && (
            <p className="mt-1">{item.description}</p>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default Pin;
