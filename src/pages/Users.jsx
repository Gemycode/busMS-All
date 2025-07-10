import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/admin/users", { replace: true });
  }, [navigate]);
  return null;
};

export default Users;
