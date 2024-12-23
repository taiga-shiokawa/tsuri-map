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
import { useLocation } from "react-router-dom";
import LocationPickerMap from "../components/map/LocationPickerMap";

const HomePage = () => {
  const location = useLocation();
  const user = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isMapView, setIsMapView] = useState(false);
  const [showMap, setShowMap] = useState(false);

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
    if (location.state) {
      setPosts(location.state);
      window.history.replaceState({}, document.title);
    } else {
      fetchPosts();
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

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
      setLatitude("");
      setLongitude("");
      setIsMapView(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "投稿の作成に失敗しました");
    }
  };

  const getCurrentLocation = async (e) => {
    e.preventDefault();
    if (!navigator.geolocation) {
      alert("この端末では現在地を取得できません");
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
      alert("現在地を取得できませんでした" + error.message);
    }
  };

  const handleLocationSelect = ({ latitude, longitude }) => {
    setLatitude(latitude);
    setLongitude(longitude);
    toast.success("位置情報を設定しました");
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
        <div className="mx-auto max-w-7xl px-4">
          {/* モバイルでの地図切り替えボタン */}
          <div className="md:hidden sticky top-0 z-20 bg-gray-100 py-2">
            <button
              onClick={() => setShowMap(!showMap)}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              {showMap ? "投稿一覧を表示" : "地図を表示"}
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4">
            {/* 投稿一覧 */}
            <div className={`w-full md:w-1/2 ${showMap ? 'hidden' : 'block'} md:block`}>
              <div className="relative">
                <PostList items={posts} />
                {user && user.currentUser && (
                  <button
                    className="fixed bottom-6 right-6 md:right-auto md:bottom-14 md:left-40 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-10 transition-colors duration-200"
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
            </div>

            {/* 地図 */}
            <div className={`w-full md:w-1/2 h-[calc(100vh-6rem)] md:h-auto ${!showMap ? 'hidden' : 'block'} md:block sticky top-16 md:top-4`}>
              <Map items={posts} />
            </div>
          </div>

          {/* 投稿ダイアログ */}
          {user && user.currentUser && (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto mx-4">
                <DialogHeader className="space-y-3 sticky top-0 bg-white z-10 pb-4">
                  <DialogTitle className="text-xl md:text-2xl font-semibold">
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
                      <div className="flex flex-col space-y-4">
                        <p>位置情報</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={getCurrentLocation}
                            type="button"
                            className="w-full sm:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                          >
                            現在地を取得する
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setIsMapView(!isMapView);
                            }}
                            type="button"
                            className="w-full sm:w-auto px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                          >
                            {isMapView ? "地図を閉じる" : "地図から選択する"}
                          </button>
                        </div>
                        {isMapView && (
                          <div className="h-64 sm:h-96">
                            <LocationPickerMap
                              onLocationSelect={handleLocationSelect}
                              selectedPosition={
                                latitude && longitude
                                  ? { latitude, longitude }
                                  : null
                              }
                            />
                          </div>
                        )}
                      </div>
                      <input type="hidden" name="latitude" value={latitude} />
                      <input type="hidden" name="longitude" value={longitude} />
                      <input
                        type="date"
                        name="fishingDate"
                        placeholder="日にち"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                      />
                      <select
                        name="weather"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                      >
                        <option value="sunny">晴れ</option>
                        <option value="cloudy">曇り</option>
                        <option value="rainy">雨</option>
                        <option value="stormy">強風</option>
                        <option value="snowy">雪</option>
                      </select>
                      <select
                        name="fishingType"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                      >
                        <option value="floatFishing">フカセ釣り</option>
                        <option value="lure">ルアー</option>
                        <option value="casting">打ち込み</option>
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
                    <div className="sticky bottom-0 pt-4 pb-2 bg-white flex justify-end">
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
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