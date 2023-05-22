import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  owner: null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    setOwner: (state, action) => {
      state.owner = action.payload
    }
  }
})

export const { setUser, setOwner } = authSlice.actions

export default authSlice.reducer
