import React, { Fragment } from "react";
import styled from "styled-components";
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

// styled
const SettingsContainer = styled.div`
  border-radius: 0 10px 10px 0;
  height: 100vh;
`;

// dropdown func
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Settings = () => {
  return (
    <>
      <SettingsContainer className="mb-3 bg-component_item_bg_dark flex flex-col">
        <div className="flex justify-between items-center" style={{ padding: 15 }}>
          <div className="text-xl font-bold text-white my-1">
            Settings
          </div>
        </div>
        <hr className="bg-component_dark border-0 m-0" style={{ height: 3 }} />
        <div className="" style={{ padding: 15 }}>
          <div className="pl-1">
            <div className="text-primary_dark text-sm font-bold ">
              폰트 사이즈
            </div>
            {/* dropdown */}
            <Menu as="div" className="relative inline-block text-left mt-2">
              <div>
                <Menu.Button className="flex justify-between items-center rounded-md bg-component_item_bg_+2_dark px-4 py-2 text-xs font-medium text-white text-left shadow-sm hover:bg-point_purple_op20 active:outline-none active:ring-2 active:ring-point_purple" style={{ height: 26, width: 217 }}>
                  보통
                  <ChevronDownIcon className="-mr-1 ml-2 h1.5 w-2.5" aria-hidden="true" />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 z-10 mt-0.5 origin-top-right rounded-md bg-component_item_bg_+2_dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" style={{ height: 104, width: 217 }}>
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? 'bg-point_purple_op20 text-white' : 'text-white',
                            'block px-4 py-1 text-xs'
                          )}
                        >
                          작게
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? 'bg-point_purple_op20 text-white' : 'text-white',
                            'block px-4 py-1 text-xs'
                          )}
                        >
                          보통
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? 'bg-point_purple_op20 text-white' : 'text-white',
                            'block px-4 py-1 text-xs'
                          )}
                        >
                          크게
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? 'bg-point_purple_op20 text-white' : 'text-white',
                            'block px-4 py-1 text-xs'
                          )}
                        >
                          매우 크게
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </SettingsContainer>
    </>
  )
}

export default Settings;