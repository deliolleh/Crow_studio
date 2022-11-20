import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Menu, Item, useContextMenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";

import { logout } from "../redux/userSlice";

const MENU_ID = "nav-menu-id";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, mySeq, myNickname } = useSelector(
    (state) => state.user.value
  );
  const [navbarOpen, setNavbarOpen] = useState(false);

  const navbarOpenHandler = () => setNavbarOpen((prev) => !prev);

  const clickProfileHandler = (e) => displayMenu(e);

  const logoutHandler = () => {
    dispatch(logout());
    alert("로그아웃 성공");
    navigate("/", { replace: true });
  };

  const { show } = useContextMenu({
    id: MENU_ID,
  });

  const displayMenu = (e) => {
    show({
      event: e,
    });
    return e;
  };

  return (
    <React.Fragment>
      {/* Context Menu */}
      <Menu id={MENU_ID} className="contexify-crow-nav">
        {isLoggedIn && (
          <React.Fragment>
            <Item onClick={() => navigate(`/mypage/${mySeq}`)}>내 정보</Item>
            <Item onClick={logoutHandler}>로그아웃</Item>
          </React.Fragment>
        )}
      </Menu>
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
          <div className="lg:flex flex lg:static absolute right-14 lg:item-center mt-2.5">
            <div className="cursor-pointer mt-[3px]">
              {isLoggedIn && (
                <div className="hover:text-white" onClick={clickProfileHandler}>
                  {myNickname}
                </div>
              )}
              {!isLoggedIn && (
                <div className="flex items-center gap-4">
                  <div
                    className="hover:text-white"
                    onClick={() => navigate("/login")}
                  >
                    로그인
                  </div>
                  <div
                    className="hover:text-white"
                    onClick={() => navigate("/signup")}
                  >
                    회원가입
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default Header;
