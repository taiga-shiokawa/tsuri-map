import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"

const MaleOrFemale = () => {
  const user = useContext(AuthContext);

  console.log( "gender: ", user.currentUser.gender);

  return (
    <div className="flex justify-center mb-4">
        <div className="w-32 h-32 bg-sky-200 rounded-full">
          {user.currentUser.gender === "male" ? (
            <img src="https://res.cloudinary.com/dogup1dum/image/upload/v1732508448/kkrn_icon_user_1_cm5hah.png" alt="メンズ画像" className="w-full h-full text-gray-300" />
          ) : (
            <img src="https://res.cloudinary.com/dogup1dum/image/upload/v1732508465/kkrn_icon_user_4_gyukva.png" />
          )}
        </div>
      </div>
  )
}

export default MaleOrFemale