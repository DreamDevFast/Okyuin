import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import type {AppState, AppDispatch} from './store';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
