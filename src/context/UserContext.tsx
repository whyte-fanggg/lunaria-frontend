import { createContext, useContext, useEffect, useState } from "react";

type UserContextType = {
  name: string;
  setName: (name: string) => void;
};

const UserContext = createContext<UserContextType>({
  name: "",
  setName: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("lunaria_name");
    if (stored) setName(stored);
  }, []);

  useEffect(() => {
    if (name) localStorage.setItem("lunaria_name", name);
  }, [name]);

  return (
    <UserContext.Provider value={{ name, setName }}>
      {children}
    </UserContext.Provider>
  );
};
