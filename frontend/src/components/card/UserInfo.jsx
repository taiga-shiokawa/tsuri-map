const UserInfo = ({ item }) => {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm">
        {item.user?.name?.charAt(0) || "t"}
      </div>
      <span className="text-gray-600 text-lg font-medium">{item.user?.name || "test"}</span>
    </div>
  );
};

export default UserInfo;
