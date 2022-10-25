import React from "react";
import {Link} from "react-router-dom";

export default function Header({ fixed }) {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <>
      <nav className="flex flex-wrap items-center justify-between px-2 py-3 bg-component_item_bg_dark m-3 rounded-lg">
        <div className="container relative px-4 flex items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <div className="flex items-center">
              <div className="text-point_purple pr-3">Logo</div>
              <a
                className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
                href="#pablo"
              >
                까마귀공방
              </a>
            </div>
            <button
              className="text-white cursor-pointer text-xl leading-none py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center lg:justify-start justify-end" +
              (navbarOpen ? " flex" : " hidden")
            }
            id="example-navbar-danger"
          >
            <ul className="flex flex-col lg:flex-row list-none">
              <li className="nav-item">
                <a
                  className="px-0.5 py-2 flex items-center justify-end text-xs font-bold leading-snug text-white hover:opacity-75"
                  href=""
                >
                  <span className="ml-2">홈</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="px-0.5 py-2 flex items-center justify-end text-xs font-bold leading-snug text-white hover:opacity-75"
                  href="#pablo"
                >
                  <span className="ml-2">포럼</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="px-0.5 py-2 flex items-center justify-end text-xs font-bold leading-snug text-white hover:opacity-75"
                  href="#pablo"
                >
                  <span className="ml-2">프로젝트</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="lg:flex lg:static absolute right-12" >
            <img className="w-7 rounded-full" src={require('../assets/images/avatar.png')} />
          </div>
        </div>
      </nav>
    </>
  );
}