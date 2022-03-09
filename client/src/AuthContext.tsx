import React, { createContext, useState, FC, useEffect } from "react";
import { getCurrentUser, loginUser, logoutUser, signupUser } from "./Api/Auth";

export interface AuthContextState {
  currentUser?: any;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, email: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
}

const contextDefaultValues: AuthContextState = {
  currentUser: undefined,
  login: async () => {
    return false;
  },
  register: async () => {
    return false;
  },
  logout: async () => {
    return false;
  },
};

export const AuthContext = createContext<AuthContextState>(
  contextDefaultValues
);

const AuthProvider: FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(contextDefaultValues.currentUser);

  const register = async function (username: string, password: string, email: string) {
    let user = await signupUser(username, password, email);
    if (user) {
      setCurrentUser(user)
    }
    return !!user
  }

  const login = async function (username: string, password: string) {
    let user = await loginUser(username, password);
    if (user) {
      setCurrentUser(user)
    }
    return !!user
  }

  const logout = async function () {
    let bool = await logoutUser();
    if (bool) {
      setCurrentUser(undefined)
    }
    return bool
  }

  useEffect(() => {
    // This will be used once to check if the user is logged in.
    getCurrentUser().then((user) => {
      if (user) {
        console.log("User is logged in")
        setCurrentUser(user)
      } else {
        console.log("User not logged in")
      }
    }).catch(() => { });
  }, [])

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
