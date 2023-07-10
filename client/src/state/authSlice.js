import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  isEditing: false,
  ids:{},
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    
    setLogin: (state, action) => {
      state.token = action.payload.token;
    },
    setUserData: (state, action) => {
      state.user = action.payload.user;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    
    setProfileImg: (state, action) => {
      if (state.user) {
        state.user.picturePath = action.payload.picturePath;
      } else {
        console.log("user image error");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    setIsEditing: (state, action) => {
      state.isEditing = action.payload.isEditing;
    },
    setIds: (state, action) => {
      state.ids = action.payload.ids;
    },
  },
});

export const {
  setLogin,
  setLogout,
  setPosts,
  setPost,
  setUserData,
  setProfileImg,
  setIsEditing,
  setIds,
} = authSlice.actions;
export default authSlice.reducer;