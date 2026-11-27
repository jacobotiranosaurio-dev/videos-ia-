#!/bin/bash
# Renderiza los 5 Shorts a out/<id>.mp4 (1080x1920, 30 fps)
for id in ${@:-planetas prohibidos envidia roma sinhumanos}; do
  npx remotion render src/index.ts $id out/$id.mp4 --codec=h264 --crf=18 --audio-bitrate=192k --log=error && echo "OK $id"
done
