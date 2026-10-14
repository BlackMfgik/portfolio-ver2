import {
  createAsciiRenderer,
  type AsciiMotion,
  type AsciiRenderer,
} from "./renderer";

export type AsciiWorkerMessage =
  | {
      type: "init";
      canvas: OffscreenCanvas;
      width: number;
      height: number;
      coverSrc: string;
      isMusicPlaying: boolean;
      motion: AsciiMotion;
    }
  | { type: "motion"; motion: AsciiMotion }
  | { type: "resize"; width: number; height: number }
  | { type: "mouse"; x: number; y: number }
  | { type: "music"; playing: boolean }
  | { type: "cover"; src: string };

let renderer: AsciiRenderer | null = null;

self.onmessage = (event: MessageEvent<AsciiWorkerMessage>) => {
  const message = event.data;

  if (message.type === "init") {
    renderer = createAsciiRenderer(message.canvas);
    renderer?.setMotion(message.motion);
    renderer?.resize(message.width, message.height);
    renderer?.setMusicPlaying(message.isMusicPlaying);
    renderer?.setCover(message.coverSrc);
    return;
  }

  if (!renderer) return;

  switch (message.type) {
    case "resize":
      renderer.resize(message.width, message.height);
      break;
    case "mouse":
      renderer.setMouse(message.x, message.y);
      break;
    case "music":
      renderer.setMusicPlaying(message.playing);
      break;
    case "cover":
      renderer.setCover(message.src);
      break;
    case "motion":
      renderer.setMotion(message.motion);
      break;
  }
};
