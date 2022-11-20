import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getUser } from "./redux/userSlice";

import ProtectedRoute from "./route/ProtectedRoute";
import PrivateRoute from "./route/PrivateRoute";

import WithLoading from "./components/WithLoading";

import Intro from "./pages/intro/Intro";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Mypage from "./pages/mypage/Mypage";
import Teams from "./pages/teams/Teams";
import TeamCreate from "./pages/team-create/TeamCreate";
import TeamDetail from "./pages/team-detail/TeamDetail";
import Project from "./pages/project/Project";
import NotFound from "./pages/not-found/NotFound";
import YMonaco3 from "./pages/code-share/YMonaco3";
import Forbidden from "./pages/forbidden/Forbidden";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <WithLoading>
        <Intro />
      </WithLoading>
    ),
  },
  {
    path: "/login",
    element: (
      <ProtectedRoute>
        <WithLoading>
          <Login />
        </WithLoading>
      </ProtectedRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <ProtectedRoute>
        <WithLoading>
          <Signup />
        </WithLoading>
      </ProtectedRoute>
    ),
  },
  {
    path: "/mypage/:userSeq",
    element: (
      <WithLoading>
        <Mypage />
      </WithLoading>
    ),
  },
  {
    path: "/teams",
    element: (
      <PrivateRoute>
        <WithLoading>
          <Teams />
        </WithLoading>
      </PrivateRoute>
    ),
  },
  {
    path: "/teams/:teamSeq",
    element: (
      <PrivateRoute>
        <WithLoading>
          <TeamDetail />
        </WithLoading>
      </PrivateRoute>
    ),
  },
  {
    path: "/teams/create",
    element: (
      <PrivateRoute>
        <WithLoading>
          <TeamCreate />
        </WithLoading>
      </PrivateRoute>
    ),
  },
  {
    path: "/project/:teamSeq",
    element: (
      <WithLoading>
        <Project />
      </WithLoading>
    ),
  },
  {
    path: "/project/code-share",
    element: (
      <WithLoading>
        <YMonaco3 />
      </WithLoading>
    ),
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
