import { useContext, useEffect, useState } from "react";
import PostList from "../components/list/PostList";
import Map from "../components/map/Map";
import toast, { Toaster } from "react-hot-toast";
import apiRequest from "../lib/apiRequest";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { AuthContext } from "../context/AuthContext";

const HomePage = () => {
  const user = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // 投稿を取得する関数を別途定義
  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest.get("/posts");
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
    const fetchPosts = async () => {
      try {
        const res = await apiRequest.get("/posts");
        setPosts(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
        toast.error(
          error.response?.data?.message || "投稿の取得に失敗しました"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    console.log("投稿データ: ", formData);

    const fileInput = e.target.querySelector('input[type="file"]');
    const files = fileInput.files;

    formData.delete("photos");
    for (let i = 0; i < files.length; i++) {
      formData.append("photos", files[i]);
    }

    try {
      await apiRequest.post("/posts/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("投稿が完了しました");
      await fetchPosts();
      setIsOpen(false);
      e.target.reset();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "投稿の作成に失敗しました");
    }
  };

  const getCurrentLocation = async (e) => {
    e.preventDefault();
    if (!navigator.geolocation) {
      alert("この端末では現在地を取得できません");
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);

      toast.success("現在地を取得しました");
    } catch (error) {
      alert("現在地を取得できませんでした" + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
    <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-100">
        <div className="mx-auto max-w-7xl">
          <div className="flex">
            <div className="w-1/2 p-4 relative">
              <PostList items={posts} />
              {user && user.currentUser && (
                <button
                  className="fixed bottom-14 left-40 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-10 transition-colors duration-200"
                  onClick={() => setIsOpen(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              )}
            </div>
            <div className="w-1/2 p-4 relative z-0">
              <Map items={posts} />
            </div>
          </div>
          {user && user.currentUser && (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-2xl font-semibold">
                    新規投稿
                  </DialogTitle>
                  <DialogDescription className="text-gray-500">
                    釣果を投稿してください
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="locationName"
                        placeholder="釣った場所"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                      />
                      <button
                        onClick={getCurrentLocation}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                      >
                        位置情報を取得する
                      </button>
                      <input
                        type="hidden"
                        name="latitude"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                      />
                      <input
                        type="hidden"
                        name="longitude"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                      />
                      <input
                        type="date"
                        name="fishingDate"
                        placeholder="日にち"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                      />
                      <select
                        name="weather"
                        id="weather"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                      >
                        <option value="sunny">晴れ</option>
                        <option value="cloudy">曇り</option>
                        <option value="rainy">雨</option>
                        <option value="stormy">強風</option>
                        <option value="snowy">雪</option>
                      </select>
                      <input
                        type="text"
                        name="fishName"
                        placeholder="魚の名前"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                      />
                      <textarea
                        name="description"
                        placeholder="詳細"
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow resize-none"
                      />
                      <div className="mt-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                          写真を追加
                        </label>
                        <input
                          type="file"
                          name="photos"
                          multiple
                          accept="image/*"
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                      >
                        投稿する
                      </button>
                    </div>
                  </form>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
