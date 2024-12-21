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
    <div className="space-y-4">
      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="cursor-pointer">
          {currentUser.id === item.userId ? (
            // 自分自身の投稿の場合
            <Link to="/profile">
              <UserInfo item={item} />
            </Link>
          ) : (
            // 他のユーザーの投稿の場合
            <Link to={`/profile/${item.userId}`}>
              <UserInfo item={item} />
            </Link>
          )}
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{item.fishName}</h2>
          <div className="flex gap-2">
            <button
              onClick={handleClick}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              ここに行く
            </button>
            {currentUser && currentUser.id === item.userId && (
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                削除
              </button>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 text-gray-600">
            <MapPin className="w-5 h-5 text-gray-400" />
            <span>{item.locationName}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <CloudSun className="w-5 h-5 text-gray-400" />
            <WeatherDisplay weather={item.weather} />
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Anchor className="w-5 h-5 text-gray-400" />
            <FishingTypeDisplay fishingType={item.fishingType} />
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Clock className="w-5 h-5 text-gray-400" />
            <time>{new Date(item.fishingDate).toLocaleDateString()}</time>
          </div>
        </div>

        {/* Description Section */}
        {item.description && (
          <div className="mb-6 border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <FileText className="w-5 h-5 text-gray-400" />
              <span className="font-medium">詳細</span>
            </div>
            <p className="text-gray-600 whitespace-pre-line pl-7">
              {item.description}
            </p>
          </div>
        )}

        {/* Photos Section */}
        {item.photos && item.photos.length > 0 && (
          <div className="border-t border-gray-100 pt-4">
            <div className="space-y-4">
              {item.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo.url}
                  alt="釣果"
                  className="w-full rounded-lg object-cover shadow-sm"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePostCard;
