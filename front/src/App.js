import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getUser } from "./redux/userSlice";

import ProtectedRoute from "./route/ProtectedRoute";
import PrivateRoute from "./route/PrivateRoute";

import Intro from "./pages/intro/Intro";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Mypage from "./pages/mypage/Mypage";
import Teams from "./pages/teams/Teams";
import TeamCreate from "./pages/team-create/TeamCreate";
import TeamDetail from "./pages/team-detail/TeamDetail";
import Project from "./pages/project/Project";
import NotFound from "./pages/not-found/NotFound";
import Forbidden from "./pages/forbidden/Forbidden";
import YMonaco3 from "./pages/code-share/YMonaco3";

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
    path: "/mypage/:userSeq",
    element: <Mypage />,
  },
  {
    path: "/teams",
    element: (
      <PrivateRoute>
        <Teams />
      </PrivateRoute>
    ),
  },
  {
    path: "/teams/:teamSeq",
    element: (
      <PrivateRoute>
        <TeamDetail />
      </PrivateRoute>
    ),
  },
  {
    path: "/teams/create",
    element: (
      <PrivateRoute>
        <TeamCreate />
      </PrivateRoute>
    ),
  },
  {
    path: "/project/:teamSeq",
    element: <Project />,
  },
  {
    path: "/project/code-share",
    element: <YMonaco3 />,
  },
  {
    path: "/403",
    element: <Forbidden />,
  },
  {
    path: "/404",
    element: <NotFound />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.value.isLoggedIn);

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
