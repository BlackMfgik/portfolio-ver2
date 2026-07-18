"use client";

import { useEffect, useRef } from "react";

const CHARS = [
  "ｦ",
  "ｧ",
  "ｨ",
  "ｩ",
  "ｪ",
  "ｫ",
  "ｬ",
  "ｭ",
  "ｮ",
  "ｯ",
  "ｰ",
  "ｱ",
  "ｲ",
  "ｳ",
  "ｴ",
  "ｵ",
  "ｶ",
  "ｷ",
  "ｸ",
  "ｹ",
  "ｺ",
  "ｻ",
  "ｼ",
  "ｽ",
  "ｾ",
  "ｿ",
  "ﾀ",
  "ﾁ",
  "ﾂ",
  "ﾃ",
  "ﾄ",
  "ﾅ",
  "ﾆ",
  "ﾇ",
  "ﾈ",
  "ﾉ",
  "ﾊ",
  "ﾋ",
  "ﾌ",
  "ﾍ",
  "ﾎ",
  "ﾏ",
  "ﾐ",
  "ﾑ",
  "ﾒ",
  "ﾓ",
  "ﾔ",
  "ﾕ",
  "ﾖ",
  "ﾗ",
  "ﾘ",
  "ﾙ",
  "ﾚ",
  "ﾛ",
  "ﾜ",
  "ﾝ",
];

const FONT_SIZE = 14;
const HIGH_FPS_INTERVAL = 16;
const MID_FPS_INTERVAL = 24;
const LOW_FPS_INTERVAL = 33;
const MID_FRAME_COST = 12;
const LOW_FRAME_COST = 19;
const BACKGROUND_CURSOR_RADIUS = 9;
const BLACK_HOLE_RADIUS = 156;
const EVENT_HORIZON_RADIUS = 30;
const BLACK_HOLE_PULL_DISTANCE = 42;
const BLACK_HOLE_SWIRL_DISTANCE = 58;
const BACKGROUND_TEXT_FILL = "rgb(160, 156, 150)";
const COVER_MIN_VIEWPORT = 900;
const COVER_RIGHT = 0;
const COVER_TOP = 68;
const COVER_MIN_SIZE = 210;
const COVER_MAX_SIZE = 300;
const COVER_LOOSE_CELL_SIZE = FONT_SIZE;
const COVER_DENSE_CELL_SIZE = 6.8;
const COVER_SAMPLE_SIZE = 256;
const COVER_CORNER_LIFT_ALPHA = 0.34;
const COVER_EDGE_LIFT_ALPHA = 0.18;
const COVER_TRANSITION_SIZE = 20;

let sharedMouseX = -9999;
let sharedMouseY = -9999;
let listenerAttached = false;

interface Cell {
  x: number;
  y: number;
  px: number;
  py: number;
  baseChar: string;
  phase: number;
  speed: number;
  brightness: number;
}

interface CoverRect {
  x: number;
  y: number;
  size: number;
}

interface CoverSource {
  image: HTMLImageElement;
  data: ImageData;
  width: number;
  height: number;
}

interface CoverSample {
  luma: number;
  saturation: number;
}

interface CoverLayers {
  imageCanvas: HTMLCanvasElement;
  imageCtx: CanvasRenderingContext2D;
  maskCanvas: HTMLCanvasElement;
  maskCtx: CanvasRenderingContext2D;
}

interface AsciiBackgroundProps {
  isMusicPlaying?: boolean;
  coverImageSrc?: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function smooth01(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function createNoisePattern(ctx: CanvasRenderingContext2D) {
  const size = 192;
  const grainSize = 4;
  const noiseCanvas = document.createElement("canvas");
  const noiseCtx = noiseCanvas.getContext("2d");
  if (!noiseCtx) return null;

  noiseCanvas.width = size;
  noiseCanvas.height = size;

  for (let y = 0; y < size; y += grainSize) {
    for (let x = 0; x < size; x += grainSize) {
      const value = Math.floor(14 + Math.random() * 46);
      const alpha = Math.random() > 0.5 ? 0.13 : 0.045;
      noiseCtx.fillStyle = `rgba(${value}, ${value}, ${value}, ${alpha})`;
      noiseCtx.fillRect(x, y, grainSize, grainSize);
    }
  }

  return ctx.createPattern(noiseCanvas, "repeat");
}

function createGravityWellSprite() {
  const size = Math.ceil(BLACK_HOLE_RADIUS * 2);
  const sprite = document.createElement("canvas");
  const spriteCtx = sprite.getContext("2d");
  if (!spriteCtx) return null;

  sprite.width = size;
  sprite.height = size;

  const center = size / 2;
  const gravityWell = spriteCtx.createRadialGradient(
    center,
    center,
    0,
    center,
    center,
    BLACK_HOLE_RADIUS * 0.85,
  );
  gravityWell.addColorStop(0, "rgba(0, 0, 0, 0.98)");
  gravityWell.addColorStop(0.22, "rgba(0, 0, 0, 0.84)");
  gravityWell.addColorStop(0.46, "rgba(0, 0, 0, 0.24)");
  gravityWell.addColorStop(0.72, "rgba(0, 0, 0, 0.08)");
  gravityWell.addColorStop(1, "rgba(0, 0, 0, 0)");
  spriteCtx.fillStyle = gravityWell;
  spriteCtx.fillRect(0, 0, size, size);

  return sprite;
}

function getAlbumCoverRect(width: number, height: number): CoverRect | null {
  const maxSize = Math.min(
    COVER_MAX_SIZE,
    width - COVER_RIGHT * 2,
    height - COVER_TOP - COVER_RIGHT,
  );

  if (maxSize < COVER_MIN_SIZE) return null;

  const size = clamp(width * 0.19, COVER_MIN_SIZE, maxSize);
  const x = width - size - COVER_RIGHT;
  const y = COVER_TOP;

  return { x, y, size };
}

function getCoverDistance(px: number, py: number, rect: CoverRect) {
  const dx =
    px < rect.x
      ? rect.x - px
      : px > rect.x + rect.size
        ? px - (rect.x + rect.size)
        : 0;
  const dy =
    py < rect.y
      ? rect.y - py
      : py > rect.y + rect.size
        ? py - (rect.y + rect.size)
        : 0;

  return Math.hypot(dx, dy);
}

function getCoverInfluence(px: number, py: number, rect: CoverRect) {
  const distance = getCoverDistance(px, py, rect);
  if (distance > COVER_TRANSITION_SIZE) return 0;
  return distance === 0
    ? 1
    : smooth01(1 - distance / COVER_TRANSITION_SIZE);
}

function sampleCoverPixel(source: CoverSource, u: number, v: number): CoverSample {
  const x = clamp(Math.floor(u * (source.width - 1)), 0, source.width - 1);
  const y = clamp(Math.floor(v * (source.height - 1)), 0, source.height - 1);
  const index = (y * source.width + x) * 4;
  const pixels = source.data.data;
  const r = pixels[index] ?? 0;
  const g = pixels[index + 1] ?? 0;
  const b = pixels[index + 2] ?? 0;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const luma = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255;

  return {
    luma,
    saturation: (max - min) / 255,
  };
}

function reactToCursor(
  px: number,
  py: number,
  phase: number,
  time: number,
  cursorActive: boolean,
  qualityScale: number,
) {
  if (!cursorActive) {
    return { x: px, y: py, fade: 1, gravity: 0 };
  }

  const radius = BLACK_HOLE_RADIUS * qualityScale;
  const cursorDx = px - sharedMouseX;
  const cursorDy = py - sharedMouseY;
  const cursorDistSq = cursorDx * cursorDx + cursorDy * cursorDy;

  if (cursorDistSq >= radius * radius) {
    return { x: px, y: py, fade: 1, gravity: 0 };
  }

  const cursorDist = Math.sqrt(cursorDistSq);
  const safeDist = Math.max(cursorDist, 1);
  const nx = cursorDx / safeDist;
  const ny = cursorDy / safeDist;
  const gravity = smooth01(1 - cursorDist / radius);
  const horizon = smooth01(1 - cursorDist / EVENT_HORIZON_RADIUS);
  const orbitNoise = 0.76 + Math.sin(time * 3.2 + phase * 3.7) * 0.24;
  const pull = gravity * gravity * BLACK_HOLE_PULL_DISTANCE;
  const orbit =
    gravity *
    (1 - horizon * 0.55) *
    BLACK_HOLE_SWIRL_DISTANCE *
    qualityScale *
    orbitNoise;

  return {
    x: px - nx * pull - ny * orbit,
    y: py - ny * pull + nx * orbit,
    fade: 1 - horizon * 0.96,
    gravity,
  };
}

function drawCoverSquareLift(
  ctx: CanvasRenderingContext2D,
  size: number,
  alpha: number,
) {
  const cornerRadius = size * 0.34;
  const corners = [
    [0, 0],
    [size, 0],
    [0, size],
    [size, size],
  ];

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (const [x, y] of corners) {
    const corner = ctx.createRadialGradient(x, y, 0, x, y, cornerRadius);
    corner.addColorStop(0, `rgba(120, 84, 96, ${alpha * COVER_CORNER_LIFT_ALPHA})`);
    corner.addColorStop(1, "rgba(120, 84, 96, 0)");
    ctx.fillStyle = corner;
    ctx.fillRect(0, 0, size, size);
  }

  ctx.fillStyle = `rgba(68, 58, 62, ${alpha * COVER_EDGE_LIFT_ALPHA})`;
  ctx.fillRect(0, 0, size, size);
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = alpha * 0.32;
  ctx.strokeStyle = "rgb(218, 205, 196)";
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, size - 1, size - 1);
  ctx.restore();
}

function drawAsciiAlbumCover(
  ctx: CanvasRenderingContext2D,
  rect: CoverRect,
  source: CoverSource,
  layers: CoverLayers,
  time: number,
  mix: number,
  cursorActive: boolean,
  qualityScale: number,
) {
  const eased = smooth01(mix);
  const cellSize =
    COVER_LOOSE_CELL_SIZE +
    (COVER_DENSE_CELL_SIZE - COVER_LOOSE_CELL_SIZE) * eased;
  const transition = COVER_TRANSITION_SIZE;
  const layerSize = Math.ceil(rect.size + transition * 2);
  const layerX = rect.x - transition;
  const layerY = rect.y - transition;
  const { imageCanvas, imageCtx, maskCanvas, maskCtx } = layers;

  if (imageCanvas.width !== layerSize || imageCanvas.height !== layerSize) {
    imageCanvas.width = layerSize;
    imageCanvas.height = layerSize;
    maskCanvas.width = layerSize;
    maskCanvas.height = layerSize;
  }

  imageCtx.save();
  imageCtx.clearRect(0, 0, layerSize, layerSize);
  imageCtx.globalCompositeOperation = "source-over";
  imageCtx.globalAlpha = smooth01(mix);
  imageCtx.filter = "brightness(1.15) contrast(1.18) saturate(1.08)";
  imageCtx.drawImage(source.image, 0, 0, layerSize, layerSize);
  imageCtx.filter = "none";
  drawCoverSquareLift(imageCtx, layerSize, eased);
  imageCtx.restore();

  maskCtx.save();
  maskCtx.clearRect(0, 0, layerSize, layerSize);
  maskCtx.font = `${Math.max(6.5, cellSize * 0.95)}px "DM Mono", monospace`;
  maskCtx.textAlign = "center";
  maskCtx.textBaseline = "middle";
  maskCtx.fillStyle = "#fff";

  let row = 0;
  let localY = FONT_SIZE / 2;
  while (localY < layerSize) {
    let column = 0;
    let localX = FONT_SIZE / 2;

    while (localX < layerSize) {
      const px = layerX + localX;
      const py = layerY + localY;
      const coverInfluence = getCoverInfluence(px, py, rect);

      if (coverInfluence <= 0) {
        localX += FONT_SIZE;
        column++;
        continue;
      }

      const u = clamp01((px - rect.x) / rect.size);
      const v = clamp01((py - rect.y) / rect.size);
      const sample = sampleCoverPixel(source, u, v);
      const texture =
        Math.sin((u * 10.4 + v * 4.2) + time * 1.4) * 0.04 +
        Math.sin((u - v) * 18.0 - time * 1.7) * 0.035;
      const contrast = clamp01(
        sample.luma * 0.82 + sample.saturation * 0.28 + texture,
      );
      const alpha =
        eased *
        coverInfluence *
        clamp(0.32 + sample.luma * 0.56 + sample.saturation * 0.24, 0.22, 0.98);

      if (alpha < 0.08) {
        localX += FONT_SIZE;
        column++;
        continue;
      }

      const phase = (column * 12.9898 + row * 78.233) % (Math.PI * 2);
      const reaction = reactToCursor(
        px,
        py,
        phase,
        time,
        cursorActive,
        qualityScale,
      );
      const animatedContrast = clamp01(
        contrast + Math.sin(time * 1.5 + phase) * 0.045,
      );
      const charIndex = Math.floor(animatedContrast * (CHARS.length - 1));
      const transitionCellSize =
        FONT_SIZE + (cellSize - FONT_SIZE) * coverInfluence;

      maskCtx.font = `${Math.max(6.5, transitionCellSize * 0.95)}px "DM Mono", monospace`;
      maskCtx.globalAlpha = Math.min(
        1,
        alpha * reaction.fade * (1 + reaction.gravity * 0.16),
      );
      maskCtx.fillText(
        CHARS[charIndex] ?? CHARS[0],
        reaction.x - layerX,
        reaction.y - layerY,
      );

      localX += Math.max(COVER_DENSE_CELL_SIZE, transitionCellSize);
      column++;
    }

    const rowDistance =
      localY < transition
        ? transition - localY
        : localY > transition + rect.size
          ? localY - (transition + rect.size)
          : 0;
    const rowInfluence =
      rowDistance === 0
        ? 1
        : rowDistance > COVER_TRANSITION_SIZE
          ? 0
          : smooth01(1 - rowDistance / COVER_TRANSITION_SIZE);
    const rowCellSize = FONT_SIZE + (cellSize - FONT_SIZE) * rowInfluence;
    localY += Math.max(COVER_DENSE_CELL_SIZE, rowCellSize);
    row++;
  }

  maskCtx.restore();

  imageCtx.save();
  imageCtx.globalCompositeOperation = "destination-in";
  imageCtx.drawImage(maskCanvas, 0, 0);
  imageCtx.restore();

  ctx.save();
  ctx.globalAlpha = 1;
  ctx.drawImage(imageCanvas, layerX, layerY);
  ctx.restore();
}

export default function AsciiBackground({
  isMusicPlaying = false,
  coverImageSrc = "/ascii-track-cover.png",
}: AsciiBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMusicPlayingRef = useRef(isMusicPlaying);

  useEffect(() => {
    isMusicPlayingRef.current = isMusicPlaying;
  }, [isMusicPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let time = 0;
    let grid: Cell[] = [];
    const noisePattern = createNoisePattern(ctx);
    const gravityWellSprite = createGravityWellSprite();
    let rafId: number;
    let lastFrame = 0;
    let frameInterval = HIGH_FPS_INTERVAL;
    let renderCost = 0;
    let measuredFrames = 0;
    let coverMix = 0;
    let coverSource: CoverSource | null = null;
    const coverLayers: CoverLayers = {
      imageCanvas: document.createElement("canvas"),
      imageCtx: null as unknown as CanvasRenderingContext2D,
      maskCanvas: document.createElement("canvas"),
      maskCtx: null as unknown as CanvasRenderingContext2D,
    };
    const imageLayerCtx = coverLayers.imageCanvas.getContext("2d");
    const maskLayerCtx = coverLayers.maskCanvas.getContext("2d");

    if (!imageLayerCtx || !maskLayerCtx) return;

    coverLayers.imageCtx = imageLayerCtx;
    coverLayers.maskCtx = maskLayerCtx;

    const coverImage = new Image();
    coverImage.onload = () => {
      const sourceCanvas = document.createElement("canvas");
      const sourceCtx = sourceCanvas.getContext("2d", {
        willReadFrequently: true,
      });

      if (!sourceCtx) return;

      sourceCanvas.width = COVER_SAMPLE_SIZE;
      sourceCanvas.height = COVER_SAMPLE_SIZE;
      sourceCtx.drawImage(
        coverImage,
        0,
        0,
        COVER_SAMPLE_SIZE,
        COVER_SAMPLE_SIZE,
      );
      coverSource = {
        image: coverImage,
        data: sourceCtx.getImageData(0, 0, COVER_SAMPLE_SIZE, COVER_SAMPLE_SIZE),
        width: COVER_SAMPLE_SIZE,
        height: COVER_SAMPLE_SIZE,
      };
    };
    coverImage.decoding = "async";
    coverImage.src = coverImageSrc;

    const onMouseMove = (e: MouseEvent) => {
      sharedMouseX = e.clientX;
      sharedMouseY = e.clientY;
    };

    if (!listenerAttached) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      listenerAttached = true;
    }

    function initGrid() {
      const columns = Math.ceil(width / FONT_SIZE);
      const rows = Math.ceil(height / FONT_SIZE);
      grid = [];

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
          const px = x * FONT_SIZE + FONT_SIZE / 2;
          const py = y * FONT_SIZE + FONT_SIZE / 2;
          const cell: Cell = {
            x,
            y,
            px,
            py,
            baseChar: CHARS[Math.floor(Math.random() * CHARS.length)],
            phase: Math.random() * Math.PI * 2,
            speed: 0.3 + Math.random() * 0.7,
            brightness: 0.08 + Math.random() * 0.18,
          };

          grid.push(cell);
        }
      }
    }

    function resize() {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = window.innerHeight;
      initGrid();
    }

    function draw(now: number) {
      rafId = requestAnimationFrame(draw);

      if (now - lastFrame < frameInterval) return;
      lastFrame = now;
      const renderStartedAt = performance.now();

      const cursorActive = sharedMouseX > -1000 && sharedMouseY > -1000;
      const coverTarget =
        isMusicPlayingRef.current && width >= COVER_MIN_VIEWPORT ? 1 : 0;
      coverMix += (coverTarget - coverMix) * 0.075;
      if (Math.abs(coverTarget - coverMix) < 0.003) coverMix = coverTarget;
      const coverRect =
        coverMix > 0.01 && width >= COVER_MIN_VIEWPORT && coverSource
          ? getAlbumCoverRect(width, height)
          : null;

      ctx!.fillStyle = "#0a0a0a";
      ctx!.fillRect(0, 0, width, height);
      if (noisePattern) {
        ctx!.globalAlpha = 0.2;
        ctx!.fillStyle = noisePattern;
        ctx!.fillRect(0, 0, width, height);
        ctx!.globalAlpha = 1;
      }

      if (cursorActive && gravityWellSprite) {
        ctx!.drawImage(
          gravityWellSprite,
          sharedMouseX - gravityWellSprite.width / 2,
          sharedMouseY - gravityWellSprite.height / 2,
        );
      }
      ctx!.font = `${FONT_SIZE}px "DM Mono", monospace`;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";

      const mx = sharedMouseX / FONT_SIZE;
      const my = sharedMouseY / FONT_SIZE;
      const backgroundRadiusSq = BACKGROUND_CURSOR_RADIUS * BACKGROUND_CURSOR_RADIUS;
      const qualityScale =
        frameInterval >= LOW_FPS_INTERVAL
          ? 0.74
          : frameInterval >= MID_FPS_INTERVAL
            ? 0.88
            : 1;
      const blackHoleRadius = BLACK_HOLE_RADIUS * qualityScale;
      const blackHoleRadiusSq = blackHoleRadius * blackHoleRadius;
      let lastFillStyle = "";

      const setFillStyle = (style: string) => {
        if (style !== lastFillStyle) {
          ctx!.fillStyle = style;
          lastFillStyle = style;
        }
      };

      for (const cell of grid) {
        const dx = cursorActive ? cell.x - mx : 9999;
        const dy = cursorActive ? cell.y - my : 9999;
        const distSq = dx * dx + dy * dy;
        const wave =
          Math.sin(time * cell.speed * 0.58 + cell.phase) * 0.5 + 0.5;
        const proximity =
          distSq < backgroundRadiusSq
            ? smooth01(1 - Math.sqrt(distSq) / BACKGROUND_CURSOR_RADIUS)
            : 0;
        const alpha = Math.min(
          cell.brightness * (0.45 + wave * 0.55) + proximity * 0.38,
          0.28,
        );

        let coverFade = 1;
        if (coverRect) {
          const coverBlend = getCoverInfluence(cell.px, cell.py, coverRect) * coverMix;
          coverFade = 1 - coverBlend * 0.96;
        }

        if (alpha * coverFade < 0.02) continue;

        const charIndex = Math.floor(wave * (CHARS.length - 1));
        let reactedX = cell.px;
        let reactedY = cell.py;
        let gravity = 0;
        let horizon = 0;

        if (cursorActive) {
          const cursorDx = cell.px - sharedMouseX;
          const cursorDy = cell.py - sharedMouseY;
          const cursorDistSq = cursorDx * cursorDx + cursorDy * cursorDy;

          if (cursorDistSq < blackHoleRadiusSq) {
            const cursorDist = Math.sqrt(cursorDistSq);
            const safeDist = Math.max(cursorDist, 1);
            const nx = cursorDx / safeDist;
            const ny = cursorDy / safeDist;
            gravity = smooth01(1 - cursorDist / blackHoleRadius);
            horizon = smooth01(1 - cursorDist / EVENT_HORIZON_RADIUS);

            const orbitNoise =
              0.76 + Math.sin(time * 3.2 + cell.phase * 3.7) * 0.24;
            const pull = gravity * gravity * BLACK_HOLE_PULL_DISTANCE;
            const orbit =
              gravity *
              (1 - horizon * 0.55) *
              BLACK_HOLE_SWIRL_DISTANCE *
              qualityScale *
              orbitNoise;
            reactedX = cell.px - nx * pull - ny * orbit;
            reactedY = cell.py - ny * pull + nx * orbit;
          }
        }

        setFillStyle(BACKGROUND_TEXT_FILL);
        const drawAlpha =
          alpha * coverFade * (1 + gravity * 0.22) * (1 - horizon * 0.96);
        if (drawAlpha < 0.018) continue;
        ctx!.globalAlpha = Math.min(0.34, drawAlpha);
        ctx!.fillText(CHARS[charIndex] ?? cell.baseChar, reactedX, reactedY);
      }

      if (coverRect && coverSource) {
        drawAsciiAlbumCover(
          ctx!,
          coverRect,
          coverSource,
          coverLayers,
          time,
          coverMix,
          cursorActive,
          qualityScale,
        );
      }

      ctx!.globalAlpha = 1;
      time += 0.014;

      const cost = performance.now() - renderStartedAt;
      renderCost = renderCost === 0 ? cost : renderCost * 0.9 + cost * 0.1;
      measuredFrames++;

      if (measuredFrames % 20 === 0) {
        frameInterval =
          renderCost > LOW_FRAME_COST
            ? LOW_FPS_INTERVAL
            : renderCost > MID_FRAME_COST
              ? MID_FPS_INTERVAL
              : HIGH_FPS_INTERVAL;
      }
    }

    window.addEventListener("resize", resize);
    resize();
    rafId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      listenerAttached = false;
      cancelAnimationFrame(rafId);
    };
  }, [coverImageSrc]);

  return (
    <canvas
      ref={canvasRef}
      id="bg-canvas"
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, opacity: 0.9 }}
      aria-hidden="true"
    />
  );
}
