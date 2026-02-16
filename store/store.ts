import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import { homepageSlice } from './homepageSlice';
import { commandlineSlice } from './commandlineSlice';

const reducers = {
  [homepageSlice.name]: homepageSlice.reducer,
  [commandlineSlice.name]: commandlineSlice.reducer,
};

const reducer = combineReducers(reducers);

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware()].filter(Boolean) as any,
});

export type AppStore = typeof store;
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;
