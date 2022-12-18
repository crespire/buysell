import {
  ReactNode,
  useEffect,
  useState,
  useContext,
  createContext
} from 'react';
import { BaseUrlContext } from '..';

export interface UserModel {
  admin: boolean;
  email: string;
  status: 1 | 2 | 3; // unverified, verified, closed
  id: number;
}

export interface AuthProviderProps {
  children?: ReactNode;
}

export interface AuthContextModel {
  user: UserModel | null;
  authErrors: Record<string, any> | null;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  verifyUser: (key: string ) => Promise<void>;
  logOut: () => Promise<void>;
  requestResetPassword: (login: string) => Promise<void>;
  doResetPassword: (key: string, newPass: string) => Promise<void>;
  updatePassword: (password: string, newPass: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextModel>(
  {} as AuthContextModel
)

export function useAuth(): AuthContextModel {
  return useContext(AuthContext);
}

export const AuthProvider = ({children}: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState<UserModel | null>(null);
  const [authErrors, setAuthErrors] = useState<Record<string, any> | null>(null);
  const baseUrl = useContext(BaseUrlContext);

  const oneDay = 86_400_000; // 24 hours
  const setWithExpiry = (key: string, value: object, ttl=(oneDay)): void => {
    const now = new Date().getTime();
    const item = {
      user: value,
      expiry: now + ttl,
    }
    localStorage.setItem(key, JSON.stringify(item));
  }

  const getWithExpiry = (key: string): UserModel | null => {
    const rawItem = localStorage.getItem(key);
    if (!rawItem) { return null }

    const item = JSON.parse(rawItem);
    const now = new Date().getTime();

    if (now > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.user;
  }

  useEffect(() => {
    let localUser = getWithExpiry('user');
    if (localUser) {
      setUser(localUser);
    }
  }, [])

  useEffect(() => {
    console.log('AuthContext user changed!');
    console.log(user);
  }, [user]);

  async function signUp(email: string, password: string): Promise<void> {
    let userData: Record<string, string> = {
      "login": email,
      "password": password,
    }
    const requestData = JSON.stringify(userData);
    const response = await fetch(`${baseUrl}/create-account`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: requestData
    });
    const data = await response.json();
    
    if (!response.ok) {
      setAuthErrors(data);
    } else {
      console.log('Sign up successful.');
      setUser(data.user);
      setWithExpiry('user', data.user);
    }
  }

  async function logIn(email: string, password: string): Promise<void> {
    const requestData = JSON.stringify({"login": email, "password": password});
    const response = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: requestData
    })
    const data = await response.json();

    if (!response.ok) {
      setAuthErrors(data);
    } else {
      console.log('Login successful.');
      setUser(data.user);
      setWithExpiry('user', data.user);
    }
  }

  async function logOut(): Promise<void> {
    if (user === null) {
      console.log('No user set.');
      return;
    }

    const response = await fetch(`${baseUrl}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    const data = await response.json();
    
    if (!response.ok) {
      setAuthErrors(data);
    } else {
      console.log(data);
      console.log('Server session destroyed, removing local session.');
      setUser(null);
      localStorage.removeItem('user');
    }
  }

  async function verifyUser(key: string): Promise<void> {
    const response = await fetch(`${baseUrl}/verify-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({"key": key})
    });
    const data = await response.json();
    
    if (!response.ok) {
      setAuthErrors(data);
    } else {
      setUser(data.user);
      setWithExpiry('user', data.user);
      console.log('User updated after verification.');
    }
  }

  async function requestResetPassword(login: string): Promise<void> {
    const response = await fetch(`${baseUrl}/reset-password-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({"login": login})
    });
    const data = await response.json();
    
    if (!response.ok) {
      setAuthErrors(data);
    }
  }

  async function doResetPassword(key: string, newPass: string): Promise<void> {
    const response = await fetch(`${baseUrl}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({"key": key, "password": newPass})
    });
    const data = await response.json();
    
    if (!response.ok) {
      setAuthErrors(data);
    } else {
      setUser(data.user);
      setWithExpiry('user', data.user);
      console.log('User updated after password reset.');
    }
  }

  async function updatePassword(password: string, newPass: string): Promise<void> {
    const response = await fetch(`${baseUrl}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({"password": password, "new-password": newPass})
    });
    const data = await response.json();
    
    if (!response.ok) {
      setAuthErrors(data);
    } else {
      console.log('User password updated.');
    }
  }

  const values = {
    user,
    authErrors,
    signUp,
    logIn,
    logOut,
    verifyUser,
    requestResetPassword,
    doResetPassword,
    updatePassword
  }
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}