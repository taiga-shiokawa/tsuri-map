import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import MaleOrFemale from "../components/ui/MaleOrFemale";
import toast, { Toaster } from "react-hot-toast";
import apiRequest from "../lib/apiRequest";

const ProfileEditPage = () => {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [username, setUsername] = useState(currentUser?.name);
  const [about, setAbout] = useState(currentUser?.about);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = {
      name: username,
      about: about,
    };

    try {
      const res = await apiRequest.put("/users/edit", updateData);
      if (res.data) {
        updateUser(res.data);
        toast.success("プロフィールを更新しました");
        setTimeout(() => {
          navigate("/profile");
        }, 1000);
      };
    } catch (error) {
      console.log(error);
      toast.error("プロフィールの更新に失敗しました");
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 relative">
          {/* 戻るボタン - 右上に配置 */}
          <Link to="/profile">
            <button className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 text-sm font-medium">
              戻る
            </button>
          </Link>

          <h1 className="text-2xl font-bold text-center mb-8">プロフィール</h1>

          {/* プロフィール画像 */}
          <div className="flex justify-center mb-4">
            <div className="relative w-32 h-32">
              {currentUser.profilePicture ? (
                <img
                  src={currentUser.profilePicture}
                  alt="プロフィール"
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 bg-sky-200 rounded-full">
                  <MaleOrFemale />
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 名前 */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                名前
              </label>
              <input
                id="name"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 自己紹介セクション */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">自己紹介</h3>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 更新ボタン */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                更新する
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfileEditPage;
