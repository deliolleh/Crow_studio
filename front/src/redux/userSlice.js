import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import userApi from "../api/userApi";

const initialState = {
  isLoggedIn: false,
  // mySeq: "",
  myEmail: "",
  myNickname: "",
  // myImageURL: "",
  // myDesc: "",
};

export const signup = createAsyncThunk(
  "user/signup",
  async (signupData, { rejectWithValue }) => {
    const response = await userApi.signup(signupData);
    return response.data;
  }
);

export const login = createAsyncThunk(
  "user/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await userApi.login(loginData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      // return rejectWithValue(err);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  // reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, { payload }) => {
        state.isLoggedIn = true;
        console.log("fulfilled payload:", payload);
      })
      .addCase(login.rejected, (state, action) => {});
  },
});

// export const {  } = authSlice.actions;
export default userSlice.reducer;
