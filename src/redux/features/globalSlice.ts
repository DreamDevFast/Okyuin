import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import type {AppState} from '../store';

export type TempUser = {
  id: string;
  email: string;
  mobile: string;
  name: string;
  birthday: string;
  prefecture: number;
  address: string;
  avatar: string;
  role: 'girl' | 'shop';
};

export type BackgroundNavigateScreen = {
  screenName: string;
  data: any;
} | null;

export interface GlobalState {
  isLoading: boolean;
  isAuthenticated: boolean;
  isFirstLogin: boolean;
  tempUser: TempUser | undefined;
  loginMethod: 'email' | 'mobile';
  newMatchedUsers: Array<any>;
  isEntering: boolean;
  backgroundNavigateScreen: BackgroundNavigateScreen;
  resendCount: number;
}

const initialState: GlobalState = {
  isLoading: true,
  isAuthenticated: false,
  isFirstLogin: true,
  tempUser: {
    id: '',
    email: '',
    mobile: '',
    name: '',
    birthday: new Date().toString(),
    prefecture: 0,
    address: '',
    avatar: 'default.png',
    role: 'girl',
  },
  loginMethod: 'email',
  newMatchedUsers: [],
  isEntering: true,
  backgroundNavigateScreen: null,
  resendCount: 0,
};

type setLoginMethodPayload = 'email' | 'mobile';

type setTempUserPayload = {
  id: string;
  email: string;
  mobile: string;
  name: string;
  birthday: string;
  prefecture: number;
  address: string;
  avatar: string;
  role: 'girl' | 'shop';
};

type setLoadingPayload = boolean;
type setAuthenticatedPayload = boolean;
type setFirstLogin = boolean;
type setNewMatchedUsersPayload = Array<any>;
type setEnteringPayload = boolean;
type setBackgroundNavigateScreenPayload = BackgroundNavigateScreen;
type setresendCountPayload = number;

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setLoginMethod: (state, action: PayloadAction<setLoginMethodPayload>) => {
      state.loginMethod = action.payload;
    },
    setTempUser: (state, action: PayloadAction<setTempUserPayload>) => {
      state.tempUser = {
        ...action.payload,
      };
    },
    setLoading: (state, action: PayloadAction<setLoadingPayload>) => {
      state.isLoading = action.payload;
    },
    setAuthenticated: (
      state,
      action: PayloadAction<setAuthenticatedPayload>,
    ) => {
      state.isAuthenticated = action.payload;
    },
    setFirstLogin: (state, action: PayloadAction<setFirstLogin>) => {
      state.isFirstLogin = action.payload;
    },
    setNewMatchedUsers: (
      state,
      action: PayloadAction<setNewMatchedUsersPayload>,
    ) => {
      state.newMatchedUsers = action.payload;
    },
    setEntering: (state, action: PayloadAction<setEnteringPayload>) => {
      state.isEntering = action.payload;
    },
    setBackgroundNavigateScreen: (
      state,
      action: PayloadAction<setBackgroundNavigateScreenPayload>,
    ) => {
      state.backgroundNavigateScreen = action.payload;
    },
    setResendCount: (state, action: PayloadAction<setresendCountPayload>) => {
      state.resendCount = action.payload;
    },
  },
});

export const {
  setTempUser,
  setLoading,
  setLoginMethod,
  setAuthenticated,
  setFirstLogin,
  setNewMatchedUsers,
  setEntering,
  setBackgroundNavigateScreen,
  setResendCount,
} = globalSlice.actions;

export default globalSlice.reducer;
