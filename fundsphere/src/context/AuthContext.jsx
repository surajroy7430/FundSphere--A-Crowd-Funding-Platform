import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useFetch } from "../hooks/use-fetch";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { request, loading } = useFetch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await request({
          url: "/api/profile",
          method: "GET",
          showToast: false,
        });

        if (res.success) {
          setUser(res.data);
        }
      } catch (error) {
        toast.error("Please login again");
        setTimeout(() => logout(), 4000);
      }
    };

    fetchProfile();
  }, []);

  const register = async (username, email, password) => {
    return await request({
      url: "/api/auth/register",
      method: "POST",
      data: { username, email, password },
    });
  };

  const login = async (email, password) => {
    const res = await request({
      url: "/api/auth/login",
      method: "POST",
      data: { email, password },
    });

    if (res.success) {
      setUser(res.data.user);
      navigate("/dashboard", { replace: true });
    }

    return res;
  };

  const logout = async () => {
    await request({
      url: "/api/auth/logout",
      method: "POST",
      showToast: false,
    });
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
