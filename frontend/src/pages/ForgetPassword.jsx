import { useNavigate } from "react-router-dom";
import apiRequest from "../lib/apiRequest";
import { useState } from "react";


const ForgetPassword = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    try {
      await apiRequest.put("/users/forget-password", { email });
      navigate("/email-sent-confirmation");
    } catch (error) {
      console.log(error);
      setError(
        error.response?.data?.message || 
        "エラーが発生しました。もう一度お試しください。"
      );
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
      <div className="flex flex-col justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-sm w-full">
          <h1 className="font-bold text-4xl text-center">パスワード再設定</h1>
          {/* フォーム */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
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
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>
            <button
                disabled={isLoading}
                type="submit"
                className="w-full rounded-md bg-indigo-600 py-2 px-4 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "送信中..." : "送信"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
