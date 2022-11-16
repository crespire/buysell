import { UserInfo } from 'os';
import React, {
  ReactNode,
  useEffect,
  useState,
  useContext,
  createContext
} from 'react';

export type User = {
  login: string,
  status: 'verified' | 'unverified' | 'closed',
  name: string,
}

export interface AuthProviderProps {
  children?: ReactNode;
}

export interface AuthContextModel {
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextModel>(
  {} as AuthContextModel
)

export function useAuth(): AuthContextModel {
  return useContext(AuthContext);
}

export const AuthProvider = ({children}: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log('AuthContext user changed!');
    console.log(user);
  }, [user]);

  async function signUp(email: string, password: string): Promise<void> {
    const requestData = JSON.stringify({"login": email, "password": password});
    await fetch('http://localhost:3000/create-account', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: requestData
    }).then(response => response.json()).then(data => {
      console.log('Got a response:', data);
      setUser(data.user);
      console.log('Set user in state');
    }).catch(error => console.log(error))
  }

  async function logIn(email: string, password: string): Promise<void> {
  }

  async function logOut(): Promise<void> {
    setUser(null);
  }

  const values = {
    user,
    signUp,
    logIn,
    logOut,
    //resetPassword
  }
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}