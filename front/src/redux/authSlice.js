import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import authApi from "../api/authApi";

const initialState = {
  isLoggedIn: false,
  // mySeq: "",
  myEmail: "",
  myNickname: "",
  // myImageURL: "",
  // myDesc: "",
};

export const signup = createAsyncThunk(
  "authSlice/signup",
  async (signupData) => {
    const response = await authApi.signup(signupData);
    return response.data;
  }
);

export const login = createAsyncThunk(
  "authSlice/login",
  // async (credentials, { rejectWithValue }) => {
  //   try {
  //     const res = await authApi.login(credentials);
  //     localStorage.setItem("access-token", `jwt ${res.data.jwt}`);
  //   } catch (err) {
  //     console.log("rejectWithValue:", rejectWithValue);
  //     return rejectWithValue();
  //   }
  // }
  async (loginData) => {
    const response = await authApi.login(loginData);
    return response.data;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  // reducers: {},
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      console.log("fulfilled!!");
      console.log("state:", state);
      console.log("action:", action);
      localStorage.setItem("access-token", `jwt ${action.payload.jwt}`);
    },
    [login.pending]: (state, action) => {
      console.log("pending...");
      console.log("state:", state);
      console.log("action:", action);
    },
    [login.rejected]: (state, action) => {
      console.log("rejected!");
      console.log("state:", state);
      console.log("action:", action);
    },
  },
});

// export const {  } = authSlice.actions;
export default authSlice.reducer;
