import styled from 'styled-components';

import { styled as themeStyled } from '@react-tabtab-next/tabtab';

let { TabList, ActionButton, Tab, Panel } = themeStyled;

TabList = styled(TabList)`
  background-color: transparent;
  line-height: 1.2;
  border: 0;
`;

Tab = styled(Tab)`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 1px 10px;
  width: 138px;
  height: 31px;
  position: relative;
  font-size: 14px;
  text-transform: uppercase;
  border: 0;
  background: #3C3C3C;
  transition: background 0.15s, border-bottom 0.15s;
  border-radius: 10px 10px 0 0;
  border-bottom: 2px solid transparent;
  color: unset;
  ${(props) => {
      return props.active
          ? `
    border-bottom: 2px solid #ce93d8;
  `
          : null;
  }}
  &:hover .tab-label_close-button {
    opacity: 1;
  }
  &:hover {
    color: unset;
    background: #89898920;
  }
`;

ActionButton = styled(ActionButton)`
  background-color: transparent;
  border-radius: 0;
  border: none;
  opacity: 0.3;
  transition: opacity 0.2s;
  & svg {
    font-size: 14px;
    padding: 0;
  }
  &:hover {
    opacity: 1;
  }
`;

Panel = styled(Panel)`
  padding: 2px;
  background-color: #3C3C3C;
  height: 100%;
`;

export { TabList, ActionButton, Tab, Panel };