import { useContext, useEffect, useState } from "react";
import ProfileCard from "../components/card/ProfileCard";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Map from "../components/map/Map";
import toast, { Toaster } from "react-hot-toast";
import apiRequest from "../lib/apiRequest";
import MyPostList from "../components/list/MyPostList";

const ProfilePage = () => {
  const { currentUser, updateUser, fishingPosts } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest.get("/posts/myPosts");
      console.log("my-posts", res.data);
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

  // ユーザー情報を取得
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
  }, []); // 依存配列を空にして初回のみ実行

  // 未認証ユーザーのリダイレクト
  useEffect(() => {
    if (!isLoading && !currentUser) {
      toast.error("ログインしてください");
      navigate("/");
    }
  }, [currentUser, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">読み込み中...</div>
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
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-3/6 p-4 overflow-auto h-screen">
              <div className="mb-5">
                <ProfileCard
                  user={{
                    currentUser,
                    fishingPosts,
                  }}
                  onUpdateUser={updateUser}
                />
              </div>
              <MyPostList items={posts} />
            </div>
            <div className="w-full md:w-3/6 p-4 overflow-auto h-screen">
              <Map items={fishingPosts} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
