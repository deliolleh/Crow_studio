import React, { Fragment } from "react";
import styled from "styled-components";
import { Menu, Transition } from '@headlessui/react';

// import svg
import { ReactComponent as IcNewFile } from "../../../../assets/icons/ic_new_file.svg";
import { ReactComponent as IcNewDir } from "../../../../assets/icons/ic_new_dir.svg";
import { ReactComponent as IcToggle } from "../../../../assets/icons/ic_toggle.svg";

// styled
const DirectoryContainer = styled.div`
  border-radius: 0 10px 10px 0;
  height: 100vh;
`;
const IcSpan = styled.span`
  padding: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #D9D9D9;
    border-radius: 5px;

    & svg {
      & path {
        fill: #2B2C2B;
      }
    }  
  }
`;

// dropdown func
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Directory = () => {
  return (
    <>
      <DirectoryContainer className="mb-3 bg-component_item_bg_dark flex flex-col">
        <div className="flex justify-between items-center" style={{ padding: 15 }}>
          <div className="text-xl font-bold text-white">Directory</div>
          <div className="mt-1 flex items-center">
            <IcSpan>
              <IcNewFile alt="IcNewFile" />
            </IcSpan>
            <IcSpan>
              <IcNewDir alt="IcNewDir" />
            </IcSpan>
            {/* dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button>
                <IcSpan className="flex">
                  <IcToggle alt="IcToggle" aria-hidden="true" />
                </IcSpan>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-6 -top-2 z-10 mt-2 w-36 origin-top-right rounded-md bg-component_item_bg_+2_dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? 'bg-point_purple_op20 text-white' : 'text-white',
                            'block px-4 py-2 text-xs'
                          )}
                        >
                          파일 업로드
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? 'bg-point_purple_op20 text-white' : 'text-white',
                            'block px-4 py-2 text-xs'
                          )}
                        >
                          폴더 업로드
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? 'bg-point_purple_op20 text-white' : 'text-white',
                            'block px-4 py-2 text-xs'
                          )}
                        >
                          zip 파일로 다운로드
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? 'bg-point_purple_op20 text-white' : 'text-white',
                            'block px-4 py-2 text-xs'
                          )}
                        >
                          이름 바꾸기
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? 'bg-point_purple_op20 text-white' : 'text-white',
                            'block px-4 py-2 text-xs'
                          )}
                        >
                          삭제
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
        <hr className="bg-component_dark border-0 m-0" style={{ height: 3 }} />
        <div className="" style={{ padding: 15 }}>여기 폴더 구조</div>
      </DirectoryContainer>
    </>
  )
}

export default Directory;