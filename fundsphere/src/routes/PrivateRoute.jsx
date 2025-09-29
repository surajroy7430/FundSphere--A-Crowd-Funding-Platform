import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { TailChase } from "ldrs/react";

const PrivateRoute = ({ roles, userTypes }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <TailChase color="#f37656" size={30} speed={2.5} />
      </div>
    );

  if (!user) return <Navigate to="/login" replace />;

  // Role based access
  if (roles && !roles.includes(user.role))
    return <Navigate to="/dashboard" replace />;

  // User type based access
  if (userTypes && !user.userType.some((type) => userTypes.includes(type)))
    return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

export default PrivateRoute;
