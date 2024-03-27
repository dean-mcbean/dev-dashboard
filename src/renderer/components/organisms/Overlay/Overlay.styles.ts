import { css } from "@emotion/react";
import exp from "constants";


export const motionOverlayContainer = (motionOverlaySize: number) => css`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  border-radius: 6px 6px 12px 12px;
  overflow: hidden;
  background-color: #1a121b;
  box-shadow: inset -1px -1px 0 2px #3e2b41;

  > *:last-child {
    flex-grow: 1;
    overflow: hidden;
  }
`;


export const buttonPanel = css`
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-direction: column;
  padding: 8px 4px;
  flex-shrink: 1;
  box-sizing: border-box;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 20px;
  transition: font-size 0.2s;
`;


export const buttonGroup = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  justify-items: center;
  align-content: flex-start;
  gap: 4px;
  flex-wrap: wrap;
`;

export const dragBox = css`
  width: 14px;
  height: 14px;
  background-color: #3e2b41;
  border-radius: 20px;
  margin: 4px;
  -webkit-app-region: drag;
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
`;

export const closeBox = css`
  width: 18px;
  height: 18px;
  color: #f74348;
  border-radius: 4px;
  -webkit-app-region: no-drag;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;

  svg {
    width: 100%;
    height: 100%;
  }

  &:hover {
    background-color: #f74348;
    color: #1a121b;
  }
`;

export const buttonGroupDivider = css`
  height: 2px;
  background-color: #3e2b41;
  margin: 0 4px;
`;


export const minimizeBox = css`
  width: 18px;
  height: 18px;
  color: #fac92d;
  border-radius: 4px;
  -webkit-app-region: no-drag;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;

  svg {
    width: 100%;
    height: 100%;
  }

  &:hover {
    background-color: #fac92d;
    color: #1a121b;
  }
`;


export const maximizeBox = css`
  width: 18px;
  height: 18px;
  color: #fac92d;
  border-radius: 4px;
  -webkit-app-region: no-drag;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;

  svg {
    width: 100%;
    height: 100%;
  }

  &:hover {
    background-color: #fac92d;
    color: #1a121b;
  }
`;

export const outputField = css`
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-grow: 1;
  padding: 8px;
  box-sizing: border-box;
  gap: 4px;
  flex-shrink: 0;
  margin-top: 4px;
  margin-bottom: 4px;
`;

export const header = css`
  height: 24px;
  background-color: #3e2b41;
  -webkit-app-region: drag;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  box-sizing: border-box;
  position: relative;
  flex-shrink: 0;
`;

export const tabs = css`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 16px;
  -webkit-app-region: no-drag;
`;

export const controls = css`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: 4px;
  -webkit-app-region: no-drag;
`;


export const tab = (isActive: boolean) => css`
  width: 16px;
  height: 16px;
  color: ${isActive ? '#15dbb7' : '#15dbb750'};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: color 0.2s;
  cursor: pointer;

  svg {
    width: 100%;
    height: 100%;
  }

  &:hover {
    color: #15dbb780;
  }
`;

export const folderName = css`
  color: white;
  font-size: 14px;
  font-weight: bold;
  margin: 0;
  gap: 8px;

  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
`;
