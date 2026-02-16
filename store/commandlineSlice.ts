// import { createSlice } from '@reduxjs/toolkit';
// import { HYDRATE } from 'next-redux-wrapper';
// import { AppState } from './store';

// export interface CommandLineState {
//   commands: string[];
//   pureCommands: string[];
//   responses: string[];
//   dirBiscuitCrumbs: string[];
//   username: string;
// }

// const initialState: CommandLineState = {
//   commands: [],
//   pureCommands: [],
//   responses: [],
//   dirBiscuitCrumbs: [''],
//   username: 'guest',
// };

// export const commandlineSlice = createSlice({
//   name: 'cli',
//   initialState,
//   reducers: {
//     setCommands(state, action) {
//       state.commands = action.payload;
//     },
//     setPureCommands(state, action) {
//       state.pureCommands = action.payload;
//     },
//     setResponses(state, action) {
//       state.responses = action.payload;
//     },
//     setDirBiscuitCrumbs(state, action) {
//       state.dirBiscuitCrumbs = action.payload;
//     },
//     setUsername(state, action) {
//       state.username = action.payload;
//     },
//   },

//   // Special reducer for hydrating the state. Special case for next-redux-wrapper
//   extraReducers: {
//     [HYDRATE]: (state, action) => {
//       return {
//         ...state,
//         ...action.payload.commands,
//         ...action.payload.pureCommands,
//         ...action.payload.responses,
//         ...action.payload.dirBiscuitCrumbs,
//         ...action.payload.username,
//       };
//     },
//   },
// });

// export const { setCommands } = commandlineSlice.actions;
// export const { setPureCommands } = commandlineSlice.actions;
// export const { setResponses } = commandlineSlice.actions;
// export const { setDirBiscuitCrumbs } = commandlineSlice.actions;
// export const { setUsername } = commandlineSlice.actions;

// export const selectCommands = (state: AppState) => state.cli.commands;
// export const selectPureCommands = (state: AppState) => state.cli.pureCommands;
// export const selectResponses = (state: AppState) => state.cli.responses;
// export const selectBiscuitCrumbs = (state: AppState) => state.cli.dirBiscuitCrumbs;
// export const selectUsername = (state: AppState) => state.cli.username;

// export default commandlineSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { AppState } from './store';

export interface CommandLineState {
  commands: string[];
  pureCommands: string[];
  responses: string[];
  dirBiscuitCrumbs: string[];
  username: string;
}

const initialState: CommandLineState = {
  commands: [],
  pureCommands: [],
  responses: [],
  dirBiscuitCrumbs: [''],
  username: 'guest',
};

export const commandlineSlice = createSlice({
  name: 'cli',
  initialState,
  reducers: {
    setCommands(state, action) {
      state.commands = action.payload;
    },
    setPureCommands(state, action) {
      state.pureCommands = action.payload;
    },
    setResponses(state, action) {
      state.responses = action.payload;
    },
    setDirBiscuitCrumbs(state, action) {
      state.dirBiscuitCrumbs = action.payload;
    },
    setUsername(state, action) {
      state.username = action.payload;
    },
  },
});

export const { setCommands, setPureCommands, setResponses, setDirBiscuitCrumbs, setUsername } =
  commandlineSlice.actions;

export const selectCommands = (state: AppState) => state.cli.commands;
export const selectPureCommands = (state: AppState) => state.cli.pureCommands;
export const selectResponses = (state: AppState) => state.cli.responses;
export const selectBiscuitCrumbs = (state: AppState) => state.cli.dirBiscuitCrumbs;
export const selectUsername = (state: AppState) => state.cli.username;

// Reducer export
export default commandlineSlice.reducer;
