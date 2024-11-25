import { useContext } from "react"
import WeatherDisplay from "../../utils/WeatherDisplay"
import UserInfo from "./UserInfo"
import { AuthContext } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom" // useNavigateを追加
import apiRequest from "../../lib/apiRequest"

const SinglePostCard = ({item}) => {
  const { currentUser } = useContext(AuthContext); // currentUserを直接取得
  const navigate = useNavigate(); // useNavigateを追加

  const handleClick = () => {
    const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location.latitude)},${encodeURIComponent(item.location.longitude)}`;
    window.open(searchUrl, '_blank');
  }

  // プロフィールへの遷移を処理する関数
  const handleProfileClick = (e) => {
    e.preventDefault();
    if (!currentUser) {
      // stateを使用せずにクエリパラメータを使用
      navigate(`/login?message=${encodeURIComponent("ログインしてください")}`);
    } else {
      navigate("/profile");
    }
  }

  const handleDelete = async () => {
    try {
      await apiRequest.delete(`/posts/delete/${item.id}`);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md mb-4 p-4">
        {/* ユーザー情報 */}
        <div onClick={handleProfileClick} className="cursor-pointer">
          <UserInfo item={item}/>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        {/* 投稿内容 */}
        <div className="flex justify-between">
          <p className="mb-3">魚種: {item.fishName}</p>
          <button 
            onClick={handleClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            ここに行く
          </button>
        </div>
        <div>
          <p className="mb-3">場所: {item.locationName}</p>
          <p className="mb-3"><WeatherDisplay weather={item.weather} /></p>
          <p className="mb-3">日時: {new Date(item.fishingDate).toLocaleDateString()}</p>
          <p>詳細: {item.description}</p>
        </div>
        <div className="text-right">
          {currentUser && // currentUserを直接チェック
            <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">削除</button>
          }
          <div className="mt-4">
            {item.photos && item.photos.map((photo, index) => (
              <img key={index} src={photo.url} alt="釣果" className="w-full mt-5 w-90 h-90 object-cover rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default SinglePostCard