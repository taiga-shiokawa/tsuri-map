import { useContext, useEffect, useState } from "react";
import ProfileCard from "../components/card/ProfileCard";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Map from "../components/map/Map";
import toast, { Toaster } from "react-hot-toast";
import apiRequest from "../lib/apiRequest";
import MyPostList from "../components/list/MyPostList";
import { Map as MapIcon, List } from "lucide-react";

const ProfilePage = () => {
  const { currentUser, updateUser, fishingPosts } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest.get("/posts/myPosts");
      setPosts(res.data);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "投稿の取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiRequest.get("/users/me");
        if (res.data) {
          updateUser(res.data);
        }
      } catch (error) {
        console.error("ユーザー情報の取得に失敗しました:", error);
        toast.error("ユーザー情報の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      toast.error("ログインしてください");
      navigate("/");
    }
  }, [currentUser, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-100">
        <div className="mx-auto max-w-7xl px-4">
          {/* モバイルでの切り替えボタン */}
          <div className="md:hidden sticky top-0 z-20 bg-gray-100 pt-4 pb-2">
            <button
              onClick={() => setShowMap(!showMap)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              {showMap ? (
                <>
                  <List className="w-5 h-5" />
                  投稿一覧を表示
                </>
              ) : (
                <>
                  <MapIcon className="w-5 h-5" />
                  地図を表示
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4">
            {/* プロフィールと投稿一覧 */}
            <div className={`w-full md:w-1/2 ${showMap ? 'hidden' : 'block'} md:block`}>
              <div className="py-4">
                <div className="bg-white rounded-lg shadow mb-4">
                  <ProfileCard
                    user={{
                      currentUser,
                      fishingPosts,
                    }}
                    onUpdateUser={updateUser}
                  />
                </div>
                <div className="mt-4">
                  <MyPostList items={posts} />
                </div>
              </div>
            </div>

            {/* 地図 */}
            <div 
              className={`w-full md:w-1/2 ${!showMap ? 'hidden' : 'block'} md:block sticky top-0`}
            >
              <div className="h-[calc(100vh-5rem)] md:h-screen py-4">
                <div className="h-full rounded-lg overflow-hidden">
                  <Map items={fishingPosts} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;