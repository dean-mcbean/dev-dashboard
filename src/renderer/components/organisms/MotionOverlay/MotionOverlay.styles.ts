import { css } from "@emotion/react";


export const motionOverlayContainer = (motionOverlaySize: number) => css`
  position: fixed;
  bottom: 0;
  left: 0;
  width: ${motionOverlaySize}px;
  height: ${motionOverlaySize}px;
  display: flex;
  justify-content: center;gener
  align-items: center;
  border-radius: 1000px;
  -webkit-app-region: drag;
`;
