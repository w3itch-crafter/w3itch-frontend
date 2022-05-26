import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    darkMode: false,
  },
  reducers: {
    lightMode: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.darkMode = false
    },
    darkMode: (state) => {
      state.darkMode = true
    },
    toggle: (state) => {
      state.darkMode = !state.darkMode
    },
  },
})
export const { lightMode, darkMode, toggle } = counterSlice.actions
export default counterSlice.reducer
