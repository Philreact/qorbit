import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  posts: [],
  hashMapPosts: {}
}

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    addToHashMap: (state, action) => {
      const post = action.payload
      state.hashMapPosts[post.id] = post
    },

    upsertPosts: (state, action) => {
      action.payload.forEach((post) => {
        const index = state.posts.findIndex((p) => p.id === post.id)
        if (index !== -1) {
          state.posts[index] = post
        } else {
          state.posts.push(post)
        }
      })
    }
  }
})

export const { addToHashMap, upsertPosts } = postSlice.actions

export default postSlice.reducer
