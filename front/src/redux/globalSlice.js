import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    isLoading: false,
  },
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    // selectFile: (state, action) => {
    //   const { name, type, path } = action.payload;
    //   state.value.selectedFileName = name;
    //   state.value.selectedFileType = type;
    //   state.value.selectedFilePath = path;
    // },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(getTeam.fulfilled, (state, action) => {
  //     const { teamSeq, teamName, projectType, teamGit } = action.payload;
  //     state.value.teamSeq = teamSeq;
  //     state.value.teamName = teamName;
  //     state.value.projectType = projectType;
  //     state.value.teamGit = teamGit;
  //   });
  // },
});

// export const { globalActions } = global.actions;
export default globalSlice.reducer;
