import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import toast from "react-hot-toast";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Calendar, Search, Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const context = useContext(AuthContext);
  const { currentUser, updateUser } = context;

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      toast.success("ログアウトしました");
      updateUser(null);
      navigate("/");
      setIsMenuOpen(false);
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
        replace: true,
      });
      setSearchKeyword("");
      setIsSearchOpen(false);
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
    <div className="w-full bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4">
        {/* メインナビゲーション */}
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <Link
            to="/"
            className="shrink-0"
          >
            <img
              src="https://res.cloudinary.com/dogup1dum/image/upload/v1734333189/tsurimap_vpz5sp.png"
              alt="みゃ〜く釣りマップ"
              className="h-8 w-auto"
            />
          </Link>

          {/* デスクトップナビゲーション */}
          <div className="hidden md:flex items-center gap-8">
            <form onSubmit={handleSubmit} className="flex items-center">
              <div className={`relative flex items-center rounded-lg ${
                isSearchFocused
                  ? "ring-2 ring-blue-500"
                  : "hover:ring-1 hover:ring-gray-400"
              }`}>
                <Search className="absolute left-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-[300px] py-2 pl-10 pr-4 text-base border border-gray-300 rounded-lg focus:outline-none"
                  placeholder="釣り場や魚を検索..."
                />
              </div>
              <button
                type="submit"
                className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                検索
              </button>
            </form>

            <div className="relative flex items-center">
              <Calendar className="absolute left-3 w-5 h-5 text-gray-400" />
              <select
                value={selectedMonth}
                onChange={handleMonthSearch}
                className="w-[120px] py-2 pl-10 pr-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">月</option>
                <option value="all">すべて</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>{month}月</option>
                ))}
              </select>
            </div>

            <nav>
              <ul className="flex items-center space-x-6">
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
                        className="hover:text-gray-600"
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

          {/* モバイルメニューボタン */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Search className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* モバイル検索フォーム */}
        {isSearchOpen && (
          <div className="md:hidden py-4 border-t">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="釣り場や魚を検索..."
                />
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedMonth}
                    onChange={handleMonthSearch}
                    className="w-full py-2 pl-10 pr-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">月</option>
                    <option value="all">すべて</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <option key={month} value={month}>{month}月</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  検索
                </button>
              </div>
            </form>
          </div>
        )}

        {/* モバイルナビゲーションメニュー */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <ul className="space-y-4">
              {currentUser ? (
                <>
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      プロフィール
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
                    >
                      ログアウト
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ログイン
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signin"
                      className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      新規登録
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Navbar;