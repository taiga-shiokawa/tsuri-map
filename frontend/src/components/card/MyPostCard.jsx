import { Link } from "react-router-dom";
import FishingTypeDisplay from "../../utils/FishingTypeDisplay";
import { Anchor, MapPin, Calendar } from "lucide-react";

const MyPostCard = ({ item }) => {
  return (
    <div className="p-2">
      <Link to={`/posts/${item.id}`}>
        <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200 overflow-hidden">
          <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
            {/* Left side - Image */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
              {item.photos && item.photos[0] ? (
                <img
                  src={item.photos[0].url}
                  alt="釣果写真"
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No Image</span>
                </div>
              )}
            </div>

            {/* Right side - Content */}
            <div className="flex-1 min-w-0">
              {/* User info */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 text-sm">
                  {item.user?.name?.charAt(0) || "t"}
                </div>
                <span className="text-gray-600 text-sm truncate">
                  {item.user?.name || "test"}
                </span>
              </div>

              {/* Fish name */}
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 truncate">
                {item.fishName}
              </h3>

              {/* Details */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-1 min-w-0">
                  <Anchor className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">
                    <FishingTypeDisplay fishingType={item.fishingType} />
                  </span>
                </div>
                <div className="flex items-center gap-1 min-w-0">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.locationName}</span>
                </div>
                <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(item.fishingDate).toLocaleDateString("ja-JP")}
                  </span>
                </div>
              </div>

              {/* Mobile only date */}
              <div className="flex sm:hidden items-center gap-1 mt-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>
                  {new Date(item.fishingDate).toLocaleDateString("ja-JP")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MyPostCard;