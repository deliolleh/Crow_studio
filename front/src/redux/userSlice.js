import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import userApi from "../api/userApi";

const initialState = {
  value: {
    isLoggedIn: false,
    mySeq: "",
    myEmail: "",
    myNickname: "",
    myImageURL: "",
    myGitUsername: "",
    myGitToken: "",
  },
};

export const signup = createAsyncThunk(
  "user/signup",
  async (signupData, { rejectWithValue, dispatch }) => {
    try {
      const response = await userApi.signup(signupData);
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

export const getUser = createAsyncThunk("user/getUser", async (_) => {
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

export const modifyNickname = createAsyncThunk(
  "user/modifyNickname",
  async (nicknameData) => {
    try {
      const response = await userApi.putNickname(nicknameData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
    }
  }
);

export const modifyPassword = createAsyncThunk(
  "user/modifyPassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await userApi.putPassword(passwordData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

export const userQuit = createAsyncThunk(
  "user/userQuit",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await userApi.userQuit();
      dispatch(logout());
      // 회원탈퇴후 인트로 페이지로 리다이렉트시키기
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      // return rejectWithValue(err.response.status);
    }
  }
);

export const searchUser = createAsyncThunk(
  "user/searchUser",
  async (searchData, { rejectWithValue }) => {
    try {
      const response = await userApi.searchUser(searchData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      // return rejectWithValue(err.response.status);
    }
  }
);

export const resign = createAsyncThunk(
  "user/resign",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await userApi.resign();
      dispatch(logout());
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

export const updateGitAuth = createAsyncThunk(
  "user/updateGitAuth",
  async (credentialsData, { rejectWithValue }) => {
    try {
      const response = await userApi.updateGitAuth(credentialsData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

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
        const {
          userId,
          userNickname,
          userProfile,
          userSeq,
          userGitUsername,
          userGitToken,
        } = action.payload;
        state.value = {
          isLoggedIn: true,
          myEmail: userId,
          myNickname: userNickname,
          myImageURL: userProfile,
          mySeq: userSeq,
          myGitUsername: userGitUsername,
          myGitToken: userGitToken,
        };
      })
      .addCase(getUser.rejected, (state) => {
        state.value = initialState.value;
      })
      .addCase(modifyNickname.fulfilled, (state, action) => {
        state.value.myNickname = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
