import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { Toaster } from "react-hot-toast";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { updateUser } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryMessage = params.get('message');
    if (queryMessage) {
      setMessage(decodeURIComponent(queryMessage));
      // クエリパラメータをクリア
      navigate(location.pathname, { replace: true });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.target);

    const name = formData.get("name");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/login", {
        name,
        password,
      });

      console.log(res.data);
      updateUser(res.data);
      navigate("/");
    } catch (error) {
      console.log("ログインエラー: ", error);
      setError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
        <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-lg border shadow-sm overflow-hidden">
          {/* 左側のサインインフォーム */}
          <div className="w-full md:w-1/2 p-8">
            {/* ロゴ部分 */}
            <div className="mb-10">{/* ロゴは後で作る */}</div>

            {/* メインコンテンツ */}
            <div>
              <h2 className="text-2xl font-bold mb-2">アカウント登録</h2>
              {message && (
              <p className="text-red-500 text-md mb-4">{message}</p>
            )}
            </div>

            {/* フォーム */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {error && <p className="text-red-500">{error}</p>}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    名前
                  </label>
                  <input
                    name="name"
                    type="name"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-black px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    パスワード
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-black px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <a
                href="#"
                className="flex justify-end text-sm text-indigo-600 hover:text-indigo-500"
              >
                パスワードを忘れた場合
              </a>
              <button
                disabled={isLoading}
                type="submit"
                className="w-full rounded-md bg-indigo-600 py-2 px-4 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                ログイン
              </button>
            </form>

            {/* ソーシャルログイン */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    アカウントを持っていない方
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link to="/signin">
                  <button className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-2 px-4 hover:bg-gray-50">
                    <span>アカウント登録</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* 右側の画像部分 */}
          <div className="hidden md:block w-1/2 bg-gray-100">
            <img
              src="tsuri.jpeg"
              alt="Office desk with laptop"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
