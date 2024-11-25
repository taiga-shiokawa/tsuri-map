import { Link } from "react-router-dom";
import UserStatus from "../../utils/UserStatus";

const ProfileCard = ({user}) => {

  console.log(user.currentUser.about);

  if (!user?.currentUser) {
    return null;
  }

  const fishingCount = user.currentUser.fishingPosts?.length || 0;

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 relative">
      {/* 編集ボタン - 右上に配置 */}
      <Link to ="/profile/edit">
        <button 
          className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
        >
          編集
        </button>
      </Link>

      <h1 className="text-2xl font-bold text-center mb-6">プロフィール</h1>
      
      {/* プロフィール画像 */}
      <div className="flex justify-center mb-4">
        <div className="w-32 h-32 bg-sky-200 rounded-full">
          <img src="male.png" alt="メンズ画像" className="w-full h-full text-gray-300" />
        </div>
      </div>

      {/* 名前 */}
      <h2 className="text-xl font-bold text-center mb-2">@{user.currentUser.name}</h2>

      {/* 現在の状況 */}
      <p className="text-center text-gray-600 mb-4">
        <UserStatus fishingCount={fishingCount} />
      </p>

      {/* 自己紹介セクション */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-center mb-2">自己紹介</h3>
        <p className="text-center text-gray-700">
          {user.currentUser.about}
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;