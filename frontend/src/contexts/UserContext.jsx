import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userGroup, setUserGroup] = useState(null);

  return (
    <UserContext.Provider value={{ userGroup, setUserGroup }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);