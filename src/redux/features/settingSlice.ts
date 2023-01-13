import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import type {AppState} from '../store';

export type Range = {
  low: number;
  high: number;
};

export interface SettingState {
  id: string;
  isNotifying: boolean;
  searchLocation: string;
  keyword: string;
  priceRange: Range;
  unlimitedLikesAndChat: string;
  ageRange: Range;
}

const initialState: SettingState = {
  id: '',
  isNotifying: false,
  searchLocation: '',
  keyword: '',
  priceRange: {
    low: 1500,
    high: 10000,
  },
  unlimitedLikesAndChat: '0',
  ageRange: {
    low: 15,
    high: 30,
  },
};

type setNotifyingPayload = boolean;

type setSearchLocationPayload = string;

type setKeywordPayload = string;

type setPriceRange = Range;

export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setSetting: (state, action: PayloadAction<SettingState>) => {
      const {
        id,
        isNotifying,
        searchLocation,
        keyword,
        priceRange,
        unlimitedLikesAndChat,
        ageRange,
      } = action.payload;
      state.id = id;
      state.isNotifying = isNotifying;
      state.searchLocation = searchLocation;
      state.keyword = keyword;
      state.priceRange = priceRange;
      state.unlimitedLikesAndChat = unlimitedLikesAndChat;
      state.ageRange = ageRange;
    },
    setNotifying: (state, action: PayloadAction<setNotifyingPayload>) => {
      state.isNotifying = action.payload;
    },
    setSearchLocation: (
      state,
      action: PayloadAction<setSearchLocationPayload>,
    ) => {
      state.searchLocation = action.payload;
    },
    setKeyword: (state, action: PayloadAction<setKeywordPayload>) => {
      state.keyword = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<setPriceRange>) => {
      state.priceRange = action.payload;
    },
  },
});

export const {
  setSetting,
  setNotifying,
  setSearchLocation,
  setKeyword,
  setPriceRange,
} = settingSlice.actions;

export default settingSlice.reducer;
