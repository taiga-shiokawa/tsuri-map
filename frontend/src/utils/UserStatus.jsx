const UserStatus = ({fishingCount}) => {
  const getUserStatus = (fishingCount) => {
    if (fishingCount < 10) {
      return <img src="https://res.cloudinary.com/dogup1dum/image/upload/v1734776920/bronze_eshmvx.png" className="flex w-8 h-8 ml-2" />
    } else if (fishingCount < 50) {
      return <img src="silver.png" className="flex w-8 h-8 ml-2" />
    } else if (fishingCount < 100) {
      return <img src="gold.png" className="flex w-8 h-8 ml-2" />
    } else {
      return <img src="platina.png" className="flex w-8 h-8 ml-2" />
    }
  }
  return (
    <div className="flex justify-center items-center">
      <p>ステータス</p>
      {getUserStatus(fishingCount)}
    </div>
  )
}

export default UserStatus