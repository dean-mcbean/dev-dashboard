/** @jsxImportSource @emotion/react */

import { useEffect, useRef } from "react";
import { motionOverlayContainer } from "./MotionOverlay.styles";

export const motionOverlaySize = 120;
export const borderWidth = 4;

export const MotionOverlay = () => {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.arc(motionOverlaySize / 2, motionOverlaySize / 2, motionOverlaySize / 2, 0, 2 * Math.PI);
        ctx.fillStyle = "#07283e";
        ctx.fill();
        ctx.closePath();
      }
    }
  }, []);


  return (
    <div id="motionOverlay" css={motionOverlayContainer(motionOverlaySize)}>
      <canvas ref={canvasRef} id="motionCanvas" width={motionOverlaySize} height={motionOverlaySize} />
    </div>
  );
};
