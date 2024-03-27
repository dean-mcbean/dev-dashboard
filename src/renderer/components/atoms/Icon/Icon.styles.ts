import { css } from "@emotion/react";

export const iconButtonContainer = css`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  color: #15dbb7;
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
`;
