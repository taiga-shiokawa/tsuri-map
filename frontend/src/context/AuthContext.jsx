import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  const updateUser = (data) => {
    setCurrentUser(data);
  };

  useEffect(() => {
    console.log("AuthContext currentUser:", currentUser);
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  console.log(currentUser);

  const fishingPosts = currentUser?.fishingPosts || [];
  const fishingPhotos = currentUser?.fishingPhotos || [];
  return (
    <AuthContext.Provider value={{ currentUser, updateUser, fishingPosts, fishingPhotos }}>
      {children}
    </AuthContext.Provider>
  );
};
