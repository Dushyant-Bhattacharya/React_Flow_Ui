import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState,AppDispatch } from './store';
export const useRootDispatch = () => useDispatch<AppDispatch>();
export const useRootSelector: TypedUseSelectorHook<RootState> = useSelector;