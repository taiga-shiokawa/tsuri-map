import { Link } from "react-router-dom"

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
      <div className="flex flex-col justify-center items-center">
        <h1 className="font-bold text-5xl">404 Not Found</h1>
        <Link to="/">
          <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">ホームへ戻る</button>
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage