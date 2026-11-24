import React from "react";
import { Composition } from "remotion";
import { Video01, V01_DURATION } from "./v01/Video";

const FPS = 30;
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="V01-CurvaDelOlvido" component={Video01} durationInFrames={Math.round(V01_DURATION * FPS)} fps={FPS} width={1080} height={1920} />
  </>
);
