import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

const SignInPage = () => {
  const { updateUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.target);

    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const age = formData.get("age");
    const gender = formData.get("gender");

    try {
      const res = await apiRequest.post("/auth/register", {
        name,
        email,
        password,
        age,
        gender,
      });

      console.log(res.data);
      updateUser(res.data); // ここでAuthContextを更新
      navigate("/");
    } catch (error) {
      console.log("アカウント登録エラー: ", error);
      setError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-lg border shadow-sm overflow-hidden">
        {/* 左側のサインインフォーム */}
        <div className="w-full md:w-1/2 p-8">
          {/* ロゴ部分 */}
          <div className="mb-10">{/* ロゴは後で作る */}</div>

          {/* メインコンテンツ */}
          <div>
            <h2 className="text-2xl font-bold mb-2">アカウント登録</h2>
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
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-black px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  メールアドレス
                </label>
                <input
                  name="email"
                  type="email"
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex flex-col space-y-2 mr-4">
                  <label className="block text-sm font-medium text-gray-700">
                    年齢
                  </label>
                  <select
                    name="age"
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="" disabled selected>
                      選択してください
                    </option>
                    <option value="10">10代</option>
                    <option value="20">20代</option>
                    <option value="30">30代</option>
                    <option value="40">40代</option>
                    <option value="50">50代</option>
                    <option value="60">60代</option>
                    <option value="70">70代</option>
                    <option value="80">80代</option>
                    <option value="90">90代</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    性別
                  </label>
                  <select
                    name="gender"
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="" disabled selected>
                      選択してください
                    </option>
                    <option value="male">男</option>
                    <option value="female">女</option>
                    <option value="other">その他</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full rounded-md bg-indigo-600 py-2 px-4 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              登録
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
                  すでにアカウントをお持ちの方
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link to="/login">
                <button className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-2 px-4 hover:bg-gray-50">
                  <span>ログイン</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* 右側の画像部分 */}
        <div className="hidden md:block w-1/2 bg-gray-100">
          <img
            src="https://res.cloudinary.com/dogup1dum/image/upload/v1734968405/IMG_9053_lwmbof.jpg"
            alt="Office desk with laptop"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
