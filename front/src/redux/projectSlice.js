import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import projectApi from "../api/projectApi";

const initialState = {
  value: {},
};

export const getDirectoryList = createAsyncThunk(
  "project/getDirectoryList",
  async (directoryData, { rejectWithValue }) => {
    try {
      const response = await projectApi.directoryList(directoryData);
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

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
});

export default projectSlice.reducer;
