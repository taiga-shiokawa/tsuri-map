import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

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
