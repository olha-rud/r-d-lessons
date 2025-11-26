import { createContext } from "react";
import type { User } from "../features/tasks/types";

export type UserContextType = {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);
