import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  userAvatarMap: {}
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserAvatarMap: (state, action) => {
      const avatar = action.payload
      if (avatar?.name && avatar?.url) {
        state.userAvatarMap[avatar?.name] = avatar?.url
      }
    }
  }
})

export const { setUserAvatarMap } = authSlice.actions

export default authSlice.reducer
