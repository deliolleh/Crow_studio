// import React, { useEffect} from "react";
// import { Navigate } from "react-router-dom";
// import { useDispatch } from "react-redux";

// import { getTeam } from "../redux/teamSlice"

// const TeamRoute = ({ children }) => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(getTeam()).unwrap()
//   }, [dispatch])

//   if (isLoggedIn) {
//     return children;
//   }
//   return <Navigate to="/" replace />;
// };

// export default TeamRoute;
