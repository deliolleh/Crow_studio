import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import { store } from "./redux/store";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // beautiful-dnd가 아직 react 18의 <React.StricMode />와 호환되지 않아 제거함
  <Provider store={store}>
    <App />
  </Provider>
);
