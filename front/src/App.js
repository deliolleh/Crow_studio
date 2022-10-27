import React from "react";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";

import Header from "./components/Header";
import Intro from "./pages/intro/Intro";
import Main from "./pages/Main/Main";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Intro />,
  },
  {
    path: "/main",
    element: <Main />,
  },
]);

function App() {
  return (
    <React.Fragment>
      <Header />
      <RouterProvider router={router} />
    </React.Fragment>
  );
}

export default App;
