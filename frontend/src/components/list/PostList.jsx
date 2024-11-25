import PostCard from "../card/PostCard";

const PostList = ({items}) => {
  return (
    <div className="space-y-4 overflow-auto h-screen">
      {items.map(item => (
        <PostCard item={item} key={item.id}/>
      ))}
    </div>
  );
};

export default PostList;
