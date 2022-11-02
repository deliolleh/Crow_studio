import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import userApi from "../api/userApi";

const initialState = {
  isLoggedIn: false,
  mySeq: "",
  myEmail: "",
  myNickname: "",
  myImageURL: "",
  // myDesc: "",
};

export const signup = createAsyncThunk(
  "user/signup",
  async (signupData, { rejectWithValue, dispatch }) => {
    try {
      const response = await userApi.signup(signupData);
      localStorage.setItem("access-token", `jwt ${response.data.jwt}`);
      dispatch(getUser());
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async (loginData, { rejectWithValue, dispatch }) => {
    try {
      const response = await userApi.login(loginData);
      localStorage.setItem("access-token", `jwt ${response.data.jwt}`);
      dispatch(getUser());
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

export const getUser = createAsyncThunk("user/getuser", async (_) => {
  try {
    const response = await userApi.getUser();
    return response.data;
  } catch (err) {
    if (!err.reponse) {
      throw err;
    }
  }
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  // reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUser.fulfilled, (state, action) => {
        const { userId, userNickname, userProfile, userSeq } = action.payload;
        state.isLoggedIn = true;
        state.myEmail = userId;
        state.myNickname = userNickname;
        state.myImageURL = userProfile;
        state.mySeq = userSeq;
      })
      .addCase(getUser.rejected, (state) => {
        state.isLoggedIn = false;
        state.myEmail = "";
        state.myNickname = "";
        state.myImageURL = "";
        state.mySeq = "";
      });
  },
});

// export const {  } = authSlice.actions;
export default userSlice.reducer;
