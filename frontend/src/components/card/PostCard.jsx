import FishingTypeDisplay from "../../utils/FishingTypeDisplay";
import { Link } from "react-router-dom";
import { Anchor, MapPin, Calendar } from "lucide-react";

const PostCard = ({ item }) => {
  return (
    <div className="p-1">
      <Link to={`/posts/${item.id}`}>
        <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200 overflow-hidden">
          <div className="flex gap-4 p-4">
            {/* Left side - Image */}
            <div className="w-26 h-24 flex-shrink-0">
              {item.photos && item.photos[0] ? (
                <img
                  src={item.photos[0].url}
                  alt="釣果写真"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>

            {/* Right side - Content */}
            <div className="flex-1 min-w-0">
              {/* User info */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm">
                  {item.user?.name?.charAt(0) || "t"}
                </div>
                <span className="text-gray-600 text-sm">
                  {item.user?.name || "test"}
                </span>
              </div>

              {/* Fish name */}
              <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                {item.fishName}
              </h3>

              {/* Details */}
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Anchor className="w-4 h-4" />
                  <span><FishingTypeDisplay fishingType={item.fishingType} /></span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{item.locationName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(item.fishingDate).toLocaleDateString("ja-JP")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;
