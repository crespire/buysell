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
  login: string;
  status: 1 | 2 | 3; // unverified, verified, closed
  name: string;
  id: number;
}

export interface AuthProviderProps {
  children?: ReactNode;
}

export interface AuthContextModel {
  user: UserModel | null;
  authErrors: Record<string, any> | null;
  signUp: (email: string, password: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  verifyUser: (key: string ) => Promise<void>;
  logOut: () => Promise<void>;
  requestResetPassword: (login: string) => Promise<void>;
  doResetPassword: (key: string, newPass: string) => Promise<void>;
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
    const requestData = JSON.stringify({"login": email, "password": password});
    await fetch(`${baseUrl}/create-account`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: requestData
    }).then(response => response.json()).then(data => {
      console.log('Got a response:', data);
      setUser(data.user);
      setWithExpiry('user', data.user);
      console.log('Set user in state');
    }).catch(error => console.log(error));
  }

  async function logIn(email: string, password: string): Promise<void> {
    const requestData = JSON.stringify({"login": email, "password": password});
    await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: requestData
    }).then(response => response.json()).then(data => {
      console.log('Got a response:', data);
      setUser(data.user);
      setWithExpiry('user', data.user);
      console.log('Set user in state');
    }).catch(error => console.log(error));
  }

  async function logOut(): Promise<void> {
    if (user === null) {
      console.log('No user set.');
      return;
    }

    await fetch(`${baseUrl}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }).then(response => response.json()).then(data => {
      console.log(data);
      console.log('Server session destroyed, removing local session.');
      setUser(null);
      localStorage.removeItem('user');
    }).catch(error => console.log(error));
  }

  async function verifyUser(key: string): Promise<void> {
    await fetch(`${baseUrl}/verify-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({"key": key})
    }).then(response => response.json()).then(data => {
      setUser(data.user);
      setWithExpiry('user', data.user);
      console.log('User updated after verification.');
    }).catch(error => console.log(error));
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

  const values = {
    user,
    authErrors,
    signUp,
    logIn,
    logOut,
    verifyUser,
    requestResetPassword,
    doResetPassword
  }
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}