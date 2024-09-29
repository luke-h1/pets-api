'use client';

import authService from '@frontend/services/authService';
import { LoginUserInput } from '@validation/schema/auth.schema';
import { User } from '@validation/schema/user.schema';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface AuthContextState {
  user?: User;
  isAuth: boolean;
  ready: boolean;
}

export const AuthContext = createContext<AuthContextState | undefined>(
  undefined,
);

interface Props {
  children?: ReactNode;
}

export function AuthContextProvider({ children }: Props) {
  const [state, setState] = useState<AuthContextState>({
    isAuth: false,
    user: undefined,
    ready: false,
  });

  const isAuth = async () => {
    const result = await authService.isAuth();
    if (!result.isAuth) {
      setState({ isAuth: false, user: undefined, ready: true });
    } else {
      const user = await authService.me();
      setState({ isAuth: true, user, ready: true });
    }
  };

  useEffect(() => {
    (async () => {
      await isAuth();
    })();
  }, []);

  const login = async (input: LoginUserInput['body']) => {
    const result = await authService.login(input);

    if ('id' in result) {
      setState({ isAuth: true, user: result, ready: true });
    }
  };

  const logout = async () => {
    await authService.logout();
    setState({ isAuth: false, user: undefined, ready: true });
  };

  const contextState: AuthContextState = useMemo(() => {
    return {
      isAuth: state.isAuth,
      user: state.user,
      ready: state.ready,
      login,
      logout,
    };
  }, [state]);

  return state.ready ? (
    <AuthContext.Provider value={contextState}>{children}</AuthContext.Provider>
  ) : null;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuthContext must be used within an AuthContextProvider',
    );
  }

  return context;
}
