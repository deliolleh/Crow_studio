import React from "react";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";

import Header from "./components/Header";
import Main from "./pages/main/Main";

const router = createBrowserRouter([
  {
    path: "/",
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
