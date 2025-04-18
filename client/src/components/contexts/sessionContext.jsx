import React, { createContext, useContext, useState } from "react";

const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
  const [selectedSession, setSelectedSession] = useState(null);

  return (
    <SessionContext.Provider value={{ selectedSession, setSelectedSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  return useContext(SessionContext)
}