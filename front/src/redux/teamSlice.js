import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import teamApi from "../api/teamApi";

const initialState = {
  value: {
    teamSeq: "",
    teamName: "",
    projectType: "",
    teamGit: "",
    selectedFileName: "",
    selectedFileType: "directory",
    selectedFilePath: "",
  },
};

export const getTeams = createAsyncThunk(
  "team/getTeams",
  async (_, { rejectWithValue }) => {
    try {
      const response = await teamApi.getTeams();
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

export const getTeam = createAsyncThunk(
  "team/getTeam",
  async (teamSeq, { rejectWithValue }) => {
    try {
      const response = await teamApi.getTeam(teamSeq);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

export const createTeam = createAsyncThunk(
  "team/createTeam",
  async (teamData, { rejectWithValue }) => {
    try {
      const response = await teamApi.createTeam(teamData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

export const modifyTeamName = createAsyncThunk(
  "team/modifyTeamName",
  async ({ teamSeq, teamName }, { rejectWithValue }) => {
    try {
      const response = await teamApi.modifyTeamName(
        teamSeq,
        JSON.stringify({ teamName })
      );
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

export const deleteTeam = createAsyncThunk(
  "team/deleteTeam",
  async (teamSeq, { rejectWithValue }) => {
    try {
      const response = await teamApi.deleteTeam(teamSeq);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

export const getMembers = createAsyncThunk(
  "team/getMembers",
  async (teamSeq, { rejectWithValue }) => {
    try {
      const response = await teamApi.getMembers(teamSeq);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

export const addMember = createAsyncThunk(
  "team/addMember",
  async (addData, { rejectWithValue }) => {
    try {
      const response = await teamApi.addMember(addData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

export const deleteMember = createAsyncThunk(
  "team/deleteMember",
  async (deleteData, { rejectWithValue }) => {
    try {
      const response = await teamApi.deleteMember(deleteData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

export const delegateLeader = createAsyncThunk(
  "team/delegateLeader",
  async (delegateData, { rejectWithValue }) => {
    try {
      const response = await teamApi.delegateLeader(delegateData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

export const resignTeam = createAsyncThunk(
  "team/resignTeam",
  async (teamSeq, { rejectWithValue }) => {
    try {
      const response = await teamApi.resignTeam(teamSeq);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

export const modifyProjectType = createAsyncThunk(
  "team/modifyProjectType",
  async ({ teamSeq, modifiedData }, { rejectWithValue }) => {
    try {
      const response = await teamApi.modifyProjectType(teamSeq, modifiedData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.status);
    }
  }
);

export const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    selectFile: (state, action) => {
      const { name, type, path } = action.payload;
      state.value.selectedFileName = name;
      state.value.selectedFileType = type;
      state.value.selectedFilePath = path;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTeam.fulfilled, (state, action) => {
      const { teamSeq, teamName, projectType, teamGit } = action.payload;
      state.value.teamSeq = teamSeq;
      state.value.teamName = teamName;
      state.value.projectType = projectType;
      state.value.teamGit = teamGit;
    });
  },
});

export const { selectFile } = teamSlice.actions;
export default teamSlice.reducer;
