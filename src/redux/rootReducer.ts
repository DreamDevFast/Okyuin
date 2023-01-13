import {combineReducers} from '@reduxjs/toolkit';
import global from './features/globalSlice';
import setting from './features/settingSlice';

export default combineReducers({
  global,
  setting,
});
