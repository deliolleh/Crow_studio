import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getUser } from "./redux/userSlice";

import ProtectedRoute from "./route/ProtectedRoute";
// import PrivateRoute from "./route/PrivateRoute";

import Intro from "./pages/intro/Intro";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Main from "./pages/main/Main";
import Mypage from "./pages/mypage/Mypage";
import ProjectCreate from "./pages/project-create/ProjectCreate";
import Team from "./pages/team/Team";
import TeamCreate from "./pages/team/TeamCreate";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Intro />,
  },
  {
    path: "/login",
    element: (
      <ProtectedRoute>
        <Login />
      </ProtectedRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <ProtectedRoute>
        <Signup />
      </ProtectedRoute>
    ),
  },
  {
    path: "/main",
    element: <Main />,
  },
  {
    path: "/mypage/:userSeq",
    element: <Mypage />,
  },
  {
    path: "/project/create",
    element: <ProjectCreate />,
  },
  {
    path: "/team",
    element: <Team />,
  },
  {
    path: "/team/create",
    element: <TeamCreate />,
  },
]);

function App() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.user.value);

  useEffect(() => {
    const accessToken = localStorage.getItem("access-token");
    if (accessToken) {
      dispatch(getUser());
    }
  }, [dispatch, isLoggedIn]);

  return (
    <React.Fragment>
      <RouterProvider router={router} />
    </React.Fragment>
  );
}

export default App;
