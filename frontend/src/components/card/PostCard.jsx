import { Link } from "react-router-dom";

const PostCard = ({item}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <Link to={`/posts/${item.id}`}>
        <div className="flex gap-4">
          <div className="flex-1">
            {item.user && <p className="mb-3">投稿者: {item.user.name}</p>}
            <p className="mb-3">魚種: {item.fishName}</p>
            <p className="mb-3">場所: {item.locationName}</p>
            <p className="mb-3">日時: {new Date(item.fishingDate).toLocaleDateString()}</p>
          </div>
          <div className="w-1/3 flex item-center">
            {item.photos && item.photos[0] && (
              <img 
                src={item.photos[0].url} 
                alt="釣果写真"
                className="w-full h-auto max-h-60 object-contain rounded-lg"
              />
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;