/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, ReactNode, useEffect, useReducer } from 'react';
import decodeJwt from 'jwt-decode';

import { ActionMap } from 'types/context';
import { isValidToken, setSession } from 'utils/jwt';
import { JWTContextType, AuthState, AuthUser } from 'types/auth';
import { getMeApi, getTokenApi, signUpApi } from 'library/api/auth';

const INITIALIZE = 'INITIALIZE';
const SIGN_IN = 'SIGN_IN';
const SIGN_OUT = 'SIGN_OUT';
const SIGN_UP = 'SIGN_UP';

type AuthActionTypes = {
  [INITIALIZE]: {
    isAuthenticated: boolean;
    user: AuthUser;
    permissions: string | null;
  };
  [SIGN_IN]: {
    user: AuthUser;
  };
  [SIGN_OUT]: undefined;
  [SIGN_UP]: {
    user: AuthUser;
  };
};

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

function JWTReducer(
  state: AuthState,
  action: ActionMap<AuthActionTypes>[keyof ActionMap<AuthActionTypes>]
) {
  switch (action.type) {
    case INITIALIZE:
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user
      };
    case SIGN_IN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user
      };
    case SIGN_OUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    case SIGN_UP:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user
      };

    default:
      return state;
  }
}

const AuthContext = createContext<JWTContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('access_token');

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const response = await getMeApi();
          const user = response.data;

          const permissions = window.localStorage.getItem('permissions');

          dispatch({
            type: INITIALIZE,
            payload: {
              isAuthenticated: true,
              user,
              permissions
            }
          });
        } else {
          dispatch({
            type: INITIALIZE,
            payload: {
              isAuthenticated: false,
              user: null,
              permissions: null
            }
          });
        }
      } catch (err) {
        console.error(err);

        dispatch({
          type: INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null,
            permissions: null
          }
        });
      }
    };

    initialize();
  }, []);

  const signIn = async (email: string, password: string) => {
    const formData = new FormData();

    formData.append('username', email);
    formData.append('password', password);

    const response = await getTokenApi();

    const { data } = response;
    const { access_token, user } = data;

    if (response.status > 400 && response.status < 500) {
      if (data.detail) {
        throw new Error(data.detail);
      }
      throw new Error(data as any);
    }

    setSession(access_token);

    dispatch({
      type: SIGN_IN,
      payload: {
        user
      }
    });
  };

  const signOut = async () => {
    setSession(null);
    dispatch({ type: SIGN_OUT });
  };

  const signUp = async (email: string, password: string) => {
    const formData = new FormData();

    formData.append('username', email);
    formData.append('password', password);

    const response = await signUpApi(formData);

    const { access_token, user } = response.data;

    const decodedToken: any = decodeJwt(response.data.access_token);
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('permissions', decodedToken.permissions);

    dispatch({
      type: SIGN_UP,
      payload: {
        user
      }
    });
  };

  const resetPassword = (email: string) => console.log(email);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        signIn,
        signOut,
        signUp,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
