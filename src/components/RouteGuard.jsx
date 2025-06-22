import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const RouteGuard = ({ allowedRoles, children }) => {
  const user = useSelector((state) => state.user.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RouteGuard; 