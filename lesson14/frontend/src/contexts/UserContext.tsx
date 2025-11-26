import { useState, useEffect, ReactNode } from "react";
import type { User } from "../features/tasks/types";
import { UserContext } from "./UserContextDef";

const STORAGE_KEY = "currentUserId";

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const savedUserId = localStorage.getItem(STORAGE_KEY);
      if (savedUserId) {
        try {
          const response = await fetch(
            `http://localhost:3000/users/${savedUserId}`,
          );
          if (response.ok) {
            const user = await response.json();
            setCurrentUser(user);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        } catch (error) {
          console.error("Error loading user:", error);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem(STORAGE_KEY, user.id.toString());
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <UserContext.Provider value={{ currentUser, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}
