import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import projectApi from "../api/projectApi";

const initialState = {
  value: {},
};

export const getAllFiles = createAsyncThunk(
  "project/getAllFiles",
  async (teamSeq, { rejectWithValue }) => {
    try {
      const response = await projectApi.getAllFiles(teamSeq);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
});

export default projectSlice.reducer;
