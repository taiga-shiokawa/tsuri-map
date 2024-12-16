import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import toast from "react-hot-toast";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Calendar, Search } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const context = useContext(AuthContext);
  console.log("Full context in Navbar:", context);

  const { currentUser, updateUser } = context;
  console.log("currentUser in Navbar:", currentUser);

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      toast.success("ログアウトしました");
      updateUser(null);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!searchKeyword.trim()) return;

    try {
      const res = await apiRequest.get(
        `/posts/search?search=${encodeURIComponent(searchKeyword.trim())}`
      );

      if (res.data.length === 0) {
        toast.info("検索結果が見つかりませんでした");
      }

      navigate("/", {
        state: res.data,
        replace: true, // 履歴に残さない
      });
      setSearchKeyword("");
    } catch (error) {
      console.error(error);
      toast.error("検索結果がありませんでした");
    }
  };

  const handleMonthSearch = async (e) => {
    const month = e.target.value;
    setSelectedMonth(month);

    if (month === "all") {
      const res = await apiRequest.get("/posts");
      navigate("/", {
        state: res.data,
        replace: true,
      });
      return;
    }

    if (!month) return;

    try {
      const res = await apiRequest.get(`/posts/search/month/${month}`);
      if (res.data.length === 0) {
        toast.info(`${month}月の投稿は見つかりませんでした`);
      }

      navigate("/", {
        state: res.data,
        replace: true,
      });
    } catch (error) {
      console.error(error);
      toast.error("検索結果がありませんでした");
    }
  };

  return (
    <div className="w-full bg-white shadow-md p-4 border-b">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold flex items-center gap-8">
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <img
              src="https://res.cloudinary.com/dogup1dum/image/upload/v1734333189/tsurimap_vpz5sp.png"
              alt="みゃ〜く釣りマップ"
              className="h-10 w-auto" // ← このクラスを追加
            />
          </Link>

          <form onSubmit={handleSubmit} className="relative flex items-center">
            <div
              className={`
          relative flex items-center rounded-lg
          ${
            isSearchFocused
              ? "ring-2 ring-blue-500"
              : "hover:ring-1 hover:ring-gray-400"
          }
          transition-all duration-200
        `}
            >
              <Search className="absolute left-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="search"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="
              w-[300px] py-2 pl-10 pr-4
              text-base font-normal
              border border-gray-300 rounded-lg
              bg-white text-gray-900
              placeholder:text-gray-500
              focus:outline-none
              transition-all duration-200
            "
                placeholder="釣り場や魚を検索..."
              />
            </div>
            <button
              type="submit"
              className="
                ml-2 px-4 py-2
                bg-blue-600 hover:bg-blue-700
                text-white text-base font-medium
                rounded-lg
                transition-colors duration-200
                flex items-center gap-2
              "
            >
              検索
            </button>
          </form>

          <div className="relative flex items-center">
            <Calendar className="absolute left-3 w-5 h-5 text-gray-400" />
            <select
              value={selectedMonth}
              onChange={handleMonthSearch}
              className="
                w-[120px] py-2 pl-10 pr-4
                text-base font-normal
                border border-gray-300 rounded-lg
                bg-white text-gray-900
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-all duration-200
              "
            >
              <option value="">月</option>
              <option value="all">すべて</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {month}月
                </option>
              ))}
            </select>
          </div>
        </div>

        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-gray-600">
                ホーム
              </Link>
            </li>
            {currentUser ? (
              <>
                <li>
                  <Link to="/profile" className="hover:text-gray-600">
                    プロフィール
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="hover:text-gray-600 cursor-pointer"
                  >
                    ログアウト
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-gray-600">
                    ログイン
                  </Link>
                </li>
                <li>
                  <Link to="/signin" className="hover:text-gray-600">
                    新規登録
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
