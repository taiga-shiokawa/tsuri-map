import MyPostCard from "../card/MyPostCard"

const MyPostList = ({items}) => {
  return (
    <div className="space-y-4 overflow-auto h-screen">
      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">投稿が見つかりませんでした</p>
        </div>
      ) : (
        <>
          <div className="mb-4 p-2 bg-blue-50 rounded-lg">
            <p className="text-blue-600">
              {items.length}件の投稿が見つかりました
            </p>
          </div>
          {items.map(item => (
            <MyPostCard item={item} key={item.id}/>
          ))}
        </>
      )}
    </div>
  )
}

export default MyPostList