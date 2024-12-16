const UserInfo = ({item}) => {
  return (
    <div>
      <p className="text-3xl font-bold text-gray-900">{item.user.name}</p>
    </div>
  )
}

export default UserInfo