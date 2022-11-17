import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import userApi from "../api/userApi";

// 초기 상태값
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

// 회원가입
export const signup = createAsyncThunk(
  "user/signup",
  async (signupData, { rejectWithValue, dispatch }) => {
    try {
      const response = await userApi.signup(signupData);
      localStorage.setItem("access-token", `${response.data.jwt}`); // 로컬 스토리지에 저장
      dispatch(getUser()); // 해당 토큰으로 유저 정보 가져옴
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

// 로그인
export const login = createAsyncThunk(
  "user/login",
  async (loginData, { rejectWithValue, dispatch }) => {
    try {
      const response = await userApi.login(loginData);
      localStorage.setItem("access-token", `${response.data.jwt}`); // 로컬 스토리지에 저장
      dispatch(getUser()); // 해당 토큰으로 유저 정보 가져옴
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

// JWT에 해당하는 유저 정보 조희
export const getUser = createAsyncThunk(
  "user/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getUser();
      return response.data;
    } catch (err) {
      if (!err.reponse) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

// userSeq의 해당 마이페이지 조회
export const getMypage = createAsyncThunk(
  "user/getMypage",
  async (userSeq, { rejectWithValue }) => {
    try {
      const response = await userApi.getMypage(userSeq);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

// 닉네임 변경
export const updateNickname = createAsyncThunk(
  "user/updateNickname",
  async (updatedNicknameData, { rejectWithValue }) => {
    try {
      const response = await userApi.updateNickname(updatedNicknameData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

// 비밀번호 변경
export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (updatedPasswordData, { rejectWithValue }) => {
    try {
      const response = await userApi.updatePassword(updatedPasswordData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

// 회원 탈퇴
export const resign = createAsyncThunk(
  "user/resign",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await userApi.resign();
      dispatch(logout()); // 탈퇴 후 로그아웃으로 JWT 삭제
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

// 유저 검색
export const searchUser = createAsyncThunk(
  "user/searchUser",
  async (searchUserData, { rejectWithValue }) => {
    try {
      const response = await userApi.searchUser(searchUserData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

// 깃 토큰 변경
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
      .addCase(updateNickname.fulfilled, (state, action) => {
        state.value.myNickname = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
