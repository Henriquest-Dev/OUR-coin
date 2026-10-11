#!/usr/bin/env bash
# Encodes the animated Damian logo (art/source/logo-animation.mp4) for the preloader.
# Square centre crop around the character, silent, web-optimised MP4 + WebM + poster frames.
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=art/source/logo-animation.mp4
OUT=public/assets/video
mkdir -p "$OUT"
CROP="crop=1080:1080:535:0,scale=720:720:flags=lanczos"
ffmpeg -v error -y -i "$SRC" -an -vf "$CROP,format=yuv420p" -c:v libx264 -preset slow -crf 23 -movflags +faststart "$OUT/damian-logo.mp4"
ffmpeg -v error -y -i "$SRC" -an -vf "$CROP" -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 "$OUT/damian-logo.webm"
ffmpeg -v error -y -ss 0 -i "$SRC" -frames:v 1 -vf "$CROP" -q:v 3 "$OUT/damian-logo-poster.jpg"
ffmpeg -v error -y -sseof -0.1 -i "$SRC" -frames:v 1 -vf "$CROP" -q:v 3 "$OUT/damian-logo-end.jpg"
ls -la "$OUT"
