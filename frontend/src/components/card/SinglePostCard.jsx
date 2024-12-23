import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  CloudSun,
  Anchor,
  Clock,
  FileText,
  ExternalLink,
  Trash2,
} from "lucide-react";
import WeatherDisplay from "../../utils/WeatherDisplay";
import UserInfo from "./UserInfo";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import FishingTypeDisplay from "../../utils/FishingTypeDisplay";

const SinglePostCard = ({ item }) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = () => {
    const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      item.location.latitude
    )},${encodeURIComponent(item.location.longitude)}`;
    window.open(searchUrl, "_blank");
  };

  const handleDelete = async () => {
    if (window.confirm("この投稿を削除してもよろしいですか？")) {
      try {
        await apiRequest.delete(`/posts/delete/${item.id}`);
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="cursor-pointer">
          {currentUser?.id === item.userId ? (
            <Link to="/profile">
              <UserInfo item={item} />
            </Link>
          ) : (
            <Link to={`/profile/${item.userId}`}>
              <UserInfo item={item} />
            </Link>
          )}
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 break-all">
            {item.fishName}
          </h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleClick}
              className="flex-1 sm:flex-none bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>ここに行く</span>
            </button>
            {currentUser && currentUser.id === item.userId && (
              <button
                onClick={handleDelete}
                className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>削除</span>
              </button>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg">
            <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
            <span className="break-all">{item.locationName}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg">
            <CloudSun className="w-5 h-5 text-gray-400 shrink-0" />
            <WeatherDisplay weather={item.weather} />
          </div>
          <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg">
            <Anchor className="w-5 h-5 text-gray-400 shrink-0" />
            <FishingTypeDisplay fishingType={item.fishingType} />
          </div>
          <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg">
            <Clock className="w-5 h-5 text-gray-400 shrink-0" />
            <time>{new Date(item.fishingDate).toLocaleDateString()}</time>
          </div>
        </div>

        {/* Description Section */}
        {item.description && (
          <div className="mb-6 border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <FileText className="w-5 h-5 text-gray-400 shrink-0" />
              <span className="font-medium">詳細</span>
            </div>
            <p className="text-gray-600 whitespace-pre-line pl-4 sm:pl-7 break-all">
              {item.description}
            </p>
          </div>
        )}

        {/* Photos Section */}
        {item.photos && item.photos.length > 0 && (
          <div className="border-t border-gray-100 pt-4">
            <div className="space-y-4">
              {item.photos.map((photo, index) => (
                <div key={index} className="aspect-w-16 aspect-h-9">
                  <img
                    src={photo.url}
                    alt="釣果"
                    className="w-full rounded-lg object-contain bg-gray-50"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePostCard;