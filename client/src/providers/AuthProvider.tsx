import {
  ReactNode,
  useEffect,
  useState,
  useContext,
  createContext
} from 'react';

const baseUrl = 'http://localhost:3000'

export type User = {
  login: string,
  status: 1 | 2 | 3, // unverified, verified, closed
  name: string,
}

export interface AuthProviderProps {
  children?: ReactNode;
}

export interface AuthContextModel {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let localUser = localStorage.getItem('user');
    if (localUser && localUser !== undefined) {
      setUser(JSON.parse(localUser));
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
      localStorage.setItem('user', JSON.stringify(data.user));
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
      localStorage.setItem('user', JSON.stringify(data.user));
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
      localStorage.setItem('user', JSON.stringify(data.user));
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