import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./userSlice";
import teamReducer from "./teamSlice";
import projectReducer from "./projectSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    team: teamReducer,
    project: projectReducer,
  },
});
