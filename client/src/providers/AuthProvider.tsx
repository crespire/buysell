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
  name: string;
  status: string | number; // 1 unverified | 2 verified | 3 closed
  id: number;
}

export interface AuthProviderProps {
  children?: ReactNode;
}

export interface AuthContextModel {
  user: UserModel | null;
  authErrors: Record<string, any> | null;
  authSuccess: Record<string, any> | null;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  verifyUser: (key: string ) => Promise<void>;
  logOut: () => Promise<void>;
  requestResetPassword: (login: string) => Promise<void>;
  doResetPassword: (key: string, newPass: string) => Promise<void>;
  updateUser: (password: string, newPass: string, name: string) => Promise<void>;
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
  const [authSuccess, setAuthSuccess] = useState<Record<string, string> | null>(null);
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
  }, []);

  async function signUp(email: string, password: string, name: string): Promise<void> {
    let userData: Record<string, string> = {
      "login": email,
      "password": password,
    }

    if (name.length > 0 ) {
      userData['name'] = name;
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
      setUser(data.user);
      setWithExpiry('user', data.user);
    }
  }

  async function logIn(email: string, password: string): Promise<void> {
    
      setUser({
        "admin": true,
        "login": "testuser@test.com",
        "name": "testuser1",
        "status": 2,
        "id": 1
      })
    return;

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
      setUser({
        "admin": true,
        "login": "testuser@test.com",
        "name": "testuser1",
        "status": 2,
        "id": 1
      })
    } else {
      setUser(data.user);
      setWithExpiry('user', data.user);
    }
  }

  async function logOut(): Promise<void> {
    if (user === null) {
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
    }
  }

  async function updateUser(password: string, newPass = '', name = ''): Promise<void> {
    async function doPasswordUpdate(password: string, newPass: string): Promise<void> {
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
        setAuthSuccess({'success': 'password updated'});
      }
    };

    async function doNameUpdate(password: string, name: string): Promise<void> {
      const response = await fetch(`${baseUrl}/account`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({"account": {"password": password, "name": name}})
      });
      const data = await response.json();
      
      if (!response.ok) {
        setAuthErrors(data);
      } else {
        setUser(data);
        setAuthSuccess({'success': 'username updated'});
      }
    };

    if (newPass.length > 0) {
      doPasswordUpdate(password, newPass);
    }

    if (name.length > 0) {
      doNameUpdate(password, name);
    }
  }

  const values = {
    user,
    authErrors,
    authSuccess,
    signUp,
    logIn,
    logOut,
    verifyUser,
    requestResetPassword,
    doResetPassword,
    updateUser
  }
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}
