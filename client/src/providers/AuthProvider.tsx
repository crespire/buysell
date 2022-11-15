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

}

export interface AuthProviderProps {
  children?: ReactNode;
}

export interface AuthContextModel {
  user: User | null;
}