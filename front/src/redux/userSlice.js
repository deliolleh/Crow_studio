import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import userApi from "../api/userApi";

// const initialState = {
//   isLoggedIn: false,
//   mySeq: "",
//   myEmail: "",
//   myNickname: "",
//   myImageURL: "",
//   // myDesc: "",
// };

const initialState = {
  value: {
    isLoggedIn: false,
    mySeq: "",
    myEmail: "",
    myNickname: "",
    myImageURL: "",
    // myDesc: "",
  },
};

export const signup = createAsyncThunk(
  "user/signup",
  async (signupData, { rejectWithValue, dispatch }) => {
    try {
      const response = await userApi.signup(signupData);
      // localStorage.setItem("access-token", `jwt ${response.data.jwt}`);
      localStorage.setItem("access-token", `${response.data.jwt}`);
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
      // localStorage.setItem("access-token", `jwt ${response.data.jwt}`);
      localStorage.setItem("access-token", `${response.data.jwt}`);
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

export const getMypage = createAsyncThunk("user/getMypage", async (userSeq) => {
  try {
    const response = await userApi.getMypage(userSeq);
    return response.data;
  } catch (err) {
    if (!err.response) {
      throw err;
    }
  }
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("access-token");
      state.value = initialState.value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.fulfilled, (state, action) => {
        const { userId, userNickname, userProfile, userSeq } = action.payload;
        state.value = {
          isLoggedIn: true,
          myEmail: userId,
          myNickname: userNickname,
          myImageURL: userProfile,
          mySeq: userSeq,
        };
      })
      .addCase(getUser.rejected, (state) => {
        state.value = initialState.value;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
