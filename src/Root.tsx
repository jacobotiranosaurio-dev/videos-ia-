import React from "react";
import { Composition } from "remotion";
import { Video01, V01_DURATION } from "./v01/Video";
import { Video02, V02_DURATION } from "./v02/Video";
import { Video03, V03_DURATION } from "./v03/Video";
import { Video04, V04_DURATION } from "./v04/Video";
import { Video05, V05_DURATION } from "./v05/Video";
import { Video06, V06_DURATION } from "./v06/Video";
import { Video07, V07_DURATION } from "./v07/Video";

const FPS = 30;
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="V01-CurvaDelOlvido" component={Video01} durationInFrames={Math.round(V01_DURATION * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="V02-GTA6-SeisEstrellas" component={Video02} durationInFrames={Math.round(V02_DURATION * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="V03-SueldoDiputado" component={Video03} durationInFrames={Math.round(V03_DURATION * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="V04-LeyDHondt" component={Video04} durationInFrames={Math.round(V04_DURATION * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="V05-GoogleMapsAtascos" component={Video05} durationInFrames={Math.round(V05_DURATION * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="V06-DespertarAntesAlarma" component={Video06} durationInFrames={Math.round(V06_DURATION * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="V07-PerrosColores" component={Video07} durationInFrames={Math.round(V07_DURATION * FPS)} fps={FPS} width={1080} height={1920} />
  </>
);
