import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(null);
  const [loading, setLoading] = useState(true); // true while reading localStorage

  // Hydrate from localStorage on first load
  useEffect(() => {
    const storedToken = localStorage.getItem("mm_token");
    const storedUser  = localStorage.getItem("mm_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  /** Call after successful login or register */
  const login = (tokenVal, userData) => {
    localStorage.setItem("mm_token", tokenVal);
    localStorage.setItem("mm_user",  JSON.stringify(userData));
    setToken(tokenVal);
    setUser(userData);
  };

  /** Wipe session */
  const logout = () => {
    localStorage.removeItem("mm_token");
    localStorage.removeItem("mm_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

/** useAuth — convenience hook */
export const useAuth = () => useContext(AuthContext);
