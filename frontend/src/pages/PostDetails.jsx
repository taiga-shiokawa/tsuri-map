import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import apiRequest from "../lib/apiRequest";
import { useParams } from "react-router-dom";
import SinglePostCard from "../components/card/SinglePostCard";
import SingleMap from "../components/map/SingleMap";
import { Map as MapIcon, List } from "lucide-react";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await apiRequest.get(`/posts/${id}`);
        setPost(res.data);
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "投稿の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center px-4">
          <p className="text-gray-600 text-lg">投稿が見つかりませんでした。</p>
        </div>
      </div>
    );
  }

  return (
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
                投稿詳細を表示
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
          {/* 投稿詳細 */}
          <div 
            className={`w-full md:w-1/2 ${
              showMap ? 'hidden' : 'block'
            } md:block`}
          >
            <div className="py-4">
              <SinglePostCard item={post} />
            </div>
          </div>

          {/* 地図 */}
          <div 
            className={`w-full md:w-1/2 ${
              !showMap ? 'hidden' : 'block'
            } md:block sticky top-0`}
          >
            <div className="h-[calc(100vh-5rem)] md:h-screen py-4">
              <div className="h-full rounded-lg overflow-hidden shadow-sm">
                <SingleMap item={post} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;