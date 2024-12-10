import { Marker, Popup } from "react-leaflet";
import WeatherDisplay from "../../utils/WeatherDisplay";
import FishingTypeDisplay from "../../utils/FishingTypeDisplay";

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
          <p>魚種: {item.fishName}</p>
          <WeatherDisplay weather={item.weather} />
          <p className="mb-3"><FishingTypeDisplay fishingType={item.fishingType} /></p>
          <p>日時: {new Date(item.fishingDate).toLocaleDateString()}</p>
          {item.description && (
            <p className="mt-1">詳細: {item.description}</p>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default Pin;
