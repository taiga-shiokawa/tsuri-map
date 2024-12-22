import { Link } from "react-router-dom";
import UserStatus from "../../utils/UserStatus";
import MaleOrFemale from "../ui/MaleOrFemale";
import { useState } from "react";
import toast from "react-hot-toast";
import apiRequest from "../../lib/apiRequest";
import LinkedText from "../../utils/LinkedText";

const ProfileCard = ({ user, onUpdateUser }) => {
  const [isUploading, setIsUploading] = useState(false);

  if (!user?.currentUser) {
    return null;
  }

  const fishingCount = user.currentUser.fishingPosts?.length || 0;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ファイルサイズチェック (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("画像サイズは5MB以下にしてください");
      return;
    }

    // ファイル形式チェック
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("JPG、PNG、GIF形式の画像のみアップロード可能です");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await apiRequest.post("/users/profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        onUpdateUser({
          ...user.currentUser,
          ...response.data,
        });
        toast.success("プロフィール画像を更新しました");
      }
    } catch (error) {
      console.error("画像アップロードエラー:", error);
      toast.error("画像のアップロードに失敗しました");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 relative">
      {/* 編集ボタン - 右上に配置 */}
      <Link to="/profile/edit">
        <button className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 text-sm font-medium">
          編集
        </button>
      </Link>

      <h1 className="text-2xl font-bold text-center mb-6">プロフィール</h1>

      {/* プロフィール画像セクション */}
      <div className="flex justify-center mb-4">
        <div className="relative w-32 h-32">
          {user.currentUser.profilePicture ? (
            <img
              src={user.currentUser.profilePicture}
              alt="プロフィール"
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 bg-sky-200 rounded-full">
              <MaleOrFemale />
            </div>
          )}

          {/* 画像アップロードオーバーレイ */}
          <label className="absolute inset-0 flex items-center justify-center cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full transition-all duration-200 flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100">
                {isUploading ? "アップロード中..." : "画像を変更"}
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* 名前 */}
      <h2 className="text-xl font-bold text-center mb-2">
        @{user.currentUser.name}
      </h2>

      {/* 現在の状況 */}
      <p className="text-center text-gray-600 mb-4">
        <UserStatus fishingCount={fishingCount} />
      </p>

      {/* 自己紹介セクション */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-center mb-2">自己紹介</h3>
        <div className="text-center text-gray-700">
          <LinkedText text={user.currentUser.about} />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
