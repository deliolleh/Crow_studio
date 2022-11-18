import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import editorApi from "../api/editorApi";

const initialState = {
  value: {},
};

export const formatPut = createAsyncThunk(
  "editor/formatPut",
  async ({ language, codeData }, { rejectWithValue }) => {
    try {
      const response = await editorApi.formatPut(language, codeData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

export const formatGet = createAsyncThunk(
  "editor/formatGet",
  async ({ language, fileNum }, { rejectWithValue }) => {
    try {
      const response = await editorApi.formatGet(language, fileNum);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {},
});

export default editorSlice.reducer;
