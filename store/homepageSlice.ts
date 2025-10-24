// import { createSlice } from '@reduxjs/toolkit';
// import { HYDRATE } from 'next-redux-wrapper';
// import { AppState } from './store';

// export interface HomeScreenState {
//   isCLI: boolean;
// }

// const initialState: HomeScreenState = {
//   isCLI: true,
// };

// export const homepageSlice = createSlice({
//   name: 'home',
//   initialState,
//   reducers: {
//     setIsCLI(state, action) {
//       state.isCLI = action.payload;
//     },
//   },

//   // Special reducer for hydrating the state. Special case for next-redux-wrapper
//   extraReducers: {
//     [HYDRATE]: (state, action) => {
//       return {
//         ...state,
//         ...action.payload.isCLI,
//       };
//     },
//   },
// });

// export const { setIsCLI } = homepageSlice.actions;

// export const selectIsCLI = (state: AppState) => state.home.isCLI;

// export default homepageSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { AppState } from './store';

export interface HomeScreenState {
  isCLI: boolean;
}

const initialState: HomeScreenState = {
  isCLI: false,
};

export const homepageSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setIsCLI(state, action) {
      state.isCLI = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: any) => {
      return {
        ...state,
        ...action.payload.home,
      };
    });
  },
});

export const { setIsCLI } = homepageSlice.actions;

export const selectIsCLI = (state: AppState) => state.home.isCLI;

export default homepageSlice.reducer;
