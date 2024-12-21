import toast, { Toaster } from "react-hot-toast";
import MyPostList from "../components/list/MyPostList";
import { useState } from "react";
import Map from "../components/map/Map";
import { useEffect } from "react";
import apiRequest from "../lib/apiRequest";
import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import OtherUserProfileCard from "../components/card/OtherUserProfileCard";

const OtherUserProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [fishingPosts, setFishingPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  // console.log("Authentication Status:", !!currentUser);

  // 認証チェックを最初に行う
  useEffect(() => {
    if (!currentUser) {
      toast.error("ログインしてください", {
        duration: 3000,  // トーストの表示時間を延長
      });
      // setTimeout を使用して少し遅延させてからナビゲート
      setTimeout(() => {
        navigate("/");
      }, 1000); // 1秒後にナビゲート
      return;
    }

    // 認証済みの場合のみデータ取得を行う
    const fetchUser = async () => {
      if (!userId) {
        console.log("No userId provided");
        return;
      }

      try {
        setIsLoading(true);
        const res = await apiRequest.get(`/users/profile/${userId}`);
        if (res.data) {
          setUser(res.data);
        }
      } catch (error) {
        console.error("ユーザー情報の取得に失敗しました:", error);
        toast.error("ユーザー情報の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId, currentUser, navigate]);

  // 投稿データの取得（認証済みユーザーの場合のみ）
  useEffect(() => {
    if (!currentUser || !userId) return;

    const fetchPosts = async () => {
      try {
        const res = await apiRequest.get(`/posts/user/${userId}`);
        if (res.data) {
          setPosts(res.data);
          setFishingPosts(res.data.filter((post) => post.type === "fishing"));
        }
      } catch (error) {
        console.error("投稿の取得に失敗しました:", error);
      }
    };

    fetchPosts();
  }, [userId, currentUser]);

  console.log("Other User fishingPosts: ", fishingPosts);

  // データ取得中の表示を追加
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-100">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-3/6 p-4 overflow-auto h-screen">
              <div className="mb-5">
                <OtherUserProfileCard
                  user={{
                    user,
                    fishingPosts,
                  }}
                  onUpdateUser={null}
                />
              </div>
              <MyPostList items={posts} />
            </div>
            <div className="w-full md:w-3/6 p-4 overflow-auto h-screen">
              <Map items={posts} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtherUserProfilePage;
