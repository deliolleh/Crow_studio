import React from "react";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";

import Main from "./pages/main/main";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
]);

function App() {
  return (
    <React.Fragment>
      <RouterProvider router={router} />
    </React.Fragment>
  );
}

export default App;
