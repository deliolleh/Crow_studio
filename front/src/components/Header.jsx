import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../redux/userSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, mySeq, myNickname } = useSelector(
    (state) => state.user.value
  );
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navbarOpenHandler = () => setNavbarOpen((prev) => !prev);

  const clickProfileHandler = () => setDropdownOpen((prev) => !prev);

  const logoutHandler = () => {
    dispatch(logout());
    alert("로그아웃 성공");
    navigate("/", { replace: true });
  };

  return (
    <nav className="flex flex-wrap items-center justify-between px-2 py-1 bg-component_item_bg_dark m-3 rounded-lg">
      <div className="w-screen lg:flex-row flex-col relative px-4 flex justify-between">
        {/* 로고, 아이콘 */}
        <div className="relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
          <div className="flex items-center">
            <div className="text-point_purple pr-3">
              <img
                className="w-8 rounded-full"
                src={require("../assets/images/logo.png")}
                alt="logo-img"
              />
            </div>
            <Link
              className="text-xl font-bold leading-relaxed inline-block mr-16 py-2 whitespace-nowrap uppercase text-white"
              to="/"
            >
              까마귀공방
            </Link>
          </div>
          <button
            className="text-white cursor-pointer text-xl leading-none py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
            type="button"
            onClick={navbarOpenHandler}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>

        {/* 링크 모음 */}
        <div
          className={`lg:flex flex-grow items-center lg:justify-start justify-end ${
            navbarOpen ? "flex" : "hidden"
          }`}
          id="example-navbar-danger"
        >
          <ul className="flex flex-col lg:flex-row list-none">
            <li className="nav-item">
              <Link
                className="px-0.5 py-2 flex items-center justify-end text-lg leading-snug text-white hover:opacity-75"
                to="/"
              >
                <span className="ml-1.5">홈</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="px-0.5 py-2 flex items-center justify-end text-lg leading-snug text-white hover:opacity-75"
                to="/teams"
              >
                <span className="ml-7">팀 목록</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="px-0.5 py-2 flex items-center justify-end text-lg leading-snug text-white hover:opacity-75"
                to="/teams/create"
              >
                <span className="ml-7">새로운 팀 생성 +</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* 프로필 */}
        {/* 로그인/닉네임 */}
        <div className="lg:flex flex lg:static absolute right-14 lg:item-center mt-2.5">
          {/* 프로필 이미지 */}
          {/* <div
            className="w-7 h-7 rounded-full cursor-pointer"
            onClick={clickProfileHandler}
          > */}

          {/* 닉네임 */}
          <div
            className="cursor-pointer mt-[3px]"
            onClick={clickProfileHandler}
          >
            {isLoggedIn ? (
              // 프사
              // <img
              // className="w-7 h-7 rounded-full cursor-pointer"
              // src={require("../assets/images/avatar.png")}
              // alt="profile-img"
              // />

              // 닉네임
              <div className="hover:text-white">{myNickname}</div>
            ) : (
              // 빈 프사
              // <div className="w-7 h-7 rounded-full cursor-pointer bg-white"></div>

              // 로그인, 회원가입 버튼
              <div>
                <Link to="/login" className="mr-4 hover:text-white">
                  로그인
                </Link>
                <Link to="/signup" className="hover:text-white">
                  회원가입
                </Link>
              </div>
            )}
          </div>

          {/* 드롭다운 */}
          {dropdownOpen && (
            <div className="absolute flex flex-col w-40 lg:top-12 lg:right-4 top-9 right-0 bg-component_item_bg_+2_dark rounded-md text-right text-white z-10">
              {isLoggedIn ? (
                <React.Fragment>
                  {/* <div>{myNickname}</div>
                  <Link to={`/mypage/${mySeq}`}>마이페이지</Link>
                  <Link to={`/teams`}>팀 목록</Link>
                  <Link to="/">회원정보수정</Link> */}
                  <Link
                    to={`/mypage/${mySeq}`}
                    className="rounded-md hover:bg-point_purple_op20 h-full w-full  px-3 pt-1.5 pb-1"
                  >
                    내 정보
                  </Link>
                  <div
                    className="cursor-pointer rounded-md hover:bg-point_purple_op20 h-full w-full  px-3 pt-1 pb-1.5"
                    onClick={logoutHandler}
                  >
                    로그아웃
                  </div>
                </React.Fragment>
              ) : (
                // 없음
                <React.Fragment>
                  {/* <Link to="/login">로그인</Link>
                  <Link to="/signup">회원가입</Link> */}
                </React.Fragment>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
