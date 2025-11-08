import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [staff, setStaff] = useState(null);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    // Load from localStorage on mount
    const savedUser = localStorage.getItem('user');
    const savedStaff = localStorage.getItem('staff');
    const savedAdmin = localStorage.getItem('admin');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedStaff) setStaff(JSON.parse(savedStaff));
    if (savedAdmin) setAdmin(JSON.parse(savedAdmin));
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const loginStaff = (staffData) => {
    setStaff(staffData);
    localStorage.setItem('staff', JSON.stringify(staffData));
  };

  const loginAdmin = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem('admin', JSON.stringify(adminData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const logoutStaff = () => {
    setStaff(null);
    localStorage.removeItem('staff');
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        staff,
        admin,
        loginUser,
        loginStaff,
        loginAdmin,
        logoutUser,
        logoutStaff,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

