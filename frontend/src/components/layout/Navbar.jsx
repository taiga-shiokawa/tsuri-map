import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import toast from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();

  const context = useContext(AuthContext);
  console.log("Full context in Navbar:", context);

  const {currentUser, updateUser} = context;
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

  return (
    <div className="w-full bg-white shadow-md p-4 border-b">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/">
            Logo
          </Link>
          <input type="text" className="ml-12 border border-gray-300 bg-white text-black rounded p-1" placeholder="検索" />
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