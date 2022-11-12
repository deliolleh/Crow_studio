import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import fileApi from "../api/fileApi";

const initialState = {
  value: {},
};

export const createFile = createAsyncThunk(
  "file/createFile",
  async ({ teamSeq, type, fileData }, { rejectWithValue }) => {
    try {
      const response = await fileApi.fileCreate(teamSeq, type, fileData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

export const deleteFile = createAsyncThunk(
  "file/deleteFile",
  async ({ teamSeq, type, fileData }, { rejectWithValue }) => {
    try {
      const response = await fileApi.fileDelete(teamSeq, type, fileData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

export const renameFile = createAsyncThunk(
  "file/renameFile",
  async (fileData, { rejectWithValue }) => {
    try {
      const response = await fileApi.fileNameChange(fileData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

//

//

//

export const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {},
});

export default fileSlice.reducer;
