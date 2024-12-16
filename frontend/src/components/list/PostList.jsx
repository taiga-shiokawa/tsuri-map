import PostCard from "../card/PostCard";

const PostList = ({ items = [] }) => {  // デフォルト値を設定
  const validItems = Array.isArray(items) ? items : [];  // 配列チェック

  return (
    <div className="space-y-4 overflow-auto h-screen">
      {validItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">投稿が見つかりませんでした</p>
        </div>
      ) : (
        <>
          <div className="mb-4 p-2 bg-blue-50 rounded-lg">
            <p className="text-blue-600">
              {validItems.length}件の投稿が見つかりました
            </p>
          </div>
          {validItems.map(item => (
            <PostCard item={item} key={item.id}/>
          ))}
        </>
      )}
    </div>
  );
};

export default PostList;
