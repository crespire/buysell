import {
  ReactNode,
  useEffect,
  useState,
  useContext,
  createContext
} from 'react';
import { BaseUrlContext } from '..';

export interface UserModel {
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
  signUp: (email: string, password: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  verifyUser: (key: string ) => Promise<void>;
  logOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextModel>(
  {} as AuthContextModel
)

export function useAuth(): AuthContextModel {
  return useContext(AuthContext);
}

export const AuthProvider = ({children}: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState<UserModel | null>(null);
  const baseUrl = useContext(BaseUrlContext);

  /** TODO: Add time to live for localStorage user
   * 
   * I think we should add an expiry for the local user object so that we don't
   * have a user persisted in local state while our session cookie from the API
   * only lasts for the session.
   * 
   * I think it makes sense then to consolidate the localStorage functions into
   * helper methods here so we can keep all the logic in one place.
   * 
   */

  const oneDay = 86_400_000;
  const setWithExpiry = (key: string, value: object, ttl=(oneDay * 2)): void => {
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

  const values = {
    user,
    signUp,
    logIn,
    logOut,
    verifyUser,
    //resetPassword
  }
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}