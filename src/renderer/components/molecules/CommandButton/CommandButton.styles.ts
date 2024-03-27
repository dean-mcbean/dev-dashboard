import { css } from "@emotion/react";


export const commandButtonContainer = css`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  color: #15dbb7;
  flex-grow: 1;
  width: 1em;
  height: 1em;
  cursor: pointer;
  position: relative;

  &:hover {
    svg {
      color: #00ffd0;
    }
    .commandName {
      transform: translateX(0);
      opacity: 1;
    }
  }

  svg {
    width: 100%;
    height: 100%;
    transition: color 0.2s;
  }

  .commandName {
    opacity: 0;
    transform: translateX(16px);
    pointer-events: none;
    position: absolute;
    color: white;
    font-family: "Fira Code", monospace;
    font-size: 12px;
    background-color: #3e2b41;
    right: 28px;
    white-space: nowrap;
    border-radius: 4px;
    transition: transform 0.2s, opacity 0.2s;
    padding: 6px 12px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  }
`;
