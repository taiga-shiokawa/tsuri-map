import { useEffect, useState } from "react"
import toast from "react-hot-toast";
import apiRequest from "../lib/apiRequest";
import { useParams } from "react-router-dom";
import SinglePostCard from "../components/card/SinglePostCard";
import SingleMap from "../components/map/SingleMap";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await apiRequest.get(`/posts/${id}`);
        setPost(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "投稿の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  console.log(post);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // postがnullの場合のチェックを追加
  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>投稿が見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl"> {/* コンテナを追加 */}
        <div className="flex">
          <div className="w-3/6 p-4 overflow-auto">
            <SinglePostCard item={post}/>
          </div>
          <div className="w-3/6 p-4">
            <SingleMap item={post}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetails