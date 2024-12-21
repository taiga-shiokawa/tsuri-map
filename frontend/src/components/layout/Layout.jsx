import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Layout = () => {
  return (
    <div className="layout">
      <Navbar />
      <div className="content">
        <Outlet />
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

const RequireAuth = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      toast.error("ログインしてください", {
        duration: 3000
      });
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  return !currentUser ? (
    <Navigate to="/" />
  ) : (
    <div className="layout">
      <Navbar />
      <div className="content">
        <Outlet />
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export { Layout, RequireAuth };
