import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import compileApi from "../api/compileApi";

const initialState = {
  value: {},
};

export const compilePython = createAsyncThunk(
  "compile/compilePython",
  async (compileData, { rejectWithValue }) => {
    try {
      const response = await compileApi.compilePython(compileData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

export const compilePythonStop = createAsyncThunk(
  "compile/compilePythonStop",
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await compileApi.compilePythonStop(projectData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

export const compileSlice = createSlice({
  name: "compile",
  initialState,
  reducers: {},
});

export default compileSlice.reducer;
