import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));
  const [username, setUsername] = useState(() => localStorage.getItem('username'));

  const login = (id, name) => {
    localStorage.setItem('userId', id);
    localStorage.setItem('username', name);
    setUserId(id);
    setUsername(name);
  };

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setUserId(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ userId, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook so any component can just do: const { userId } = useAuth();
export const useAuth = () => useContext(AuthContext);