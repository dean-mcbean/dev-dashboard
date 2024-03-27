import { css, keyframes } from "@emotion/react";

export const outputFieldContainer = css`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 0 10px;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;

  gap: 8px;
`;

export const outputFieldLine = (lineType: string) => css`
  font-family: "Fira Code", monospace;
  font-size: 14px;
  color: ${lineType === 'error' ? '#f74348' : lineType === 'input'? '#15dbb7' : '#fff'};
  display: flex;
  flex-direction: row;
  gap: 8px;
  transition: background-color 0.1s;
  ${lineType === 'input' ?
  css`
  cursor: pointer;
  align-self: flex-start;
  border-radius: 4px;
  padding: 0 4px;
  margin-left: -4px;

  &:hover {
    background-color: #15dbb740;
  }
  ` : ''}
`;


export const commandInput = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
`;

export const prompt = css`
  color: #15dbb7;
  font-family: "Fira Code", monospace;
  font-size: 14px;
  margin-right: 4px;
`;

export const input = css`
  background-color: transparent;
  border: none;
  outline: none;
  color: #15dbb7;
  font-family: "Fira Code", monospace;
  font-size: 14px;
  flex-grow: 1;
`;

// Keyframes for the flashing gradient effect
const flash = keyframes`
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Emotion CSS for the loading component
export const loadingStyle = css`
  display: inline-block;
  border-radius: 5px;
  background: linear-gradient(-45deg, #3e2b41, #714c65, #3e2b41, #714c65);
  background-size: 400% 400%;
  animation: ${flash} 1s linear infinite;
  height: 20px;
  opacity: 0.5;
  margin-bottom: 8px;
  flex-shrink: 0;
`;


export const collapseLineButton = (collapsed?: boolean) => css`
  font-family: "Fira Code", monospace;
  font-size: 14px;
  color: #15dbb7;
  cursor: pointer;
  width: 14px;
  text-align: center;
  height: 14px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  margin-top: 4px;
  margin-left: -2px;

  &:hover {
    background-color: #15dbb7;
    color: #1a121b;
  }
`;

export const outputLineContent = (collapsed?: boolean) => css`
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: ${collapsed ? 0.3 : 1};
  white-space: pre-wrap;

  ${collapsed ?
    `max-height: 1.4em;` : ''}
`;


export const outputFieldContainerParent = css`
  width: 100%;
  overflow-y: auto;
  position: relative;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #15dbb7;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background-color: #1a121b;
    border-radius: 10px;
  }
`;

export const outputFieldEmptyLine = (lineType: string) => css`
  font-family: "Fira Code", monospace;
  font-size: 14px;
  color: ${lineType === 'error' ? '#f74348' : lineType === 'input'? '#15dbb7' : '#fff'};
  display: flex;
  flex-direction: row;
  gap: 8px;
  border: 1px solid #fff;
  align-self: flex-start;
  padding: 0 6px;
  border-radius: 4px;
  opacity: 0.3;
  margin-left: 20px;
`;
