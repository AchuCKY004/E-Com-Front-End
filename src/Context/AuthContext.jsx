import { createContext, use, useEffect, useState } from "react";

export const AuthContext = createContext();

// export function AuthProvider({ children }) {
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedToken !== "undefined") {
      setToken(storedToken);
      setRole(storedRole);
      setIsLoggedIn(true);
   if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("AuthContext: Failed to parse user data", error);
          setUser(null);
        }
      }
    }
     else {
      setIsLoggedIn(false);
    }

  }, []);

  const login = (data) => {
    // data means (token ,role)
    console.log("User logged in");
    console.log("Token:", data.token);

    if (!data || !data.token) return;

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.token);
    setRole(data.role);
    setUser(data.user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    console.log("User logged out");

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user")

    setToken(null);
    setRole(null);
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, role, token , user }}>
      {children}
    </AuthContext.Provider>
  );

}


