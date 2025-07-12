import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RedirectIfAuthenticated({ children }) {
  const user = useSelector((state) => state.user.user);

  if (user) {
    // خزّن رسالة التوست في localStorage
    localStorage.setItem("showLoginToast", "1");
    return <Navigate to="/" replace />;
  }
  return children;
} 