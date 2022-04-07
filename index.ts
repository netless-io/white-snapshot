import type { Displayer } from "white-web-sdk";
import html2canvas from "html2canvas";

/**
 * Search the displaying svg element.
 * @param container The param you used in `room.bindHtmlElement`.
 * @returns The svg element or null if not found.
 */
function search_svg(container: HTMLDivElement) {
  return container.querySelector(".background~svg");
}

function noop() {}

export interface SnapshotOptions {
  /**
   * @default 5 (px)
   */
  padding?: number;

  /**
   * Apply crop on the snapshot. Note that the snapshot includes padding.
   *
   * @default null
   */
  crop?: Record<"x" | "y" | "width" | "height", number> | null;
}

/**
 * Take a snapshot of a whiteboard scene.
 * @param displayer The `room` returned by `sdk.joinRoom()`.
 * @returns Promise of `null` if failed to render, or a rendered `canvas` element.
 */
export async function snapshot(
  displayer: Displayer,
  { padding = 5, crop: crop_ = null }: SnapshotOptions = {}
) {
  const { scenePath } = displayer.state.sceneState;
  const wrapper = document.createElement("div");
  let { width, height } = displayer.state.cameraState;
  Object.assign(wrapper.style, {
    position: "fixed",
    top: `-9999px`,
    left: `-9999px`,
    width: `100px`,
    height: `100px`,
  });
  document.body.appendChild(wrapper);
  displayer.fillSceneSnapshot(scenePath, wrapper, width, height);
  const svg = search_svg(wrapper);
  if (!svg) {
    document.body.removeChild(wrapper);
    return null;
  }

  const viewBox = svg.getAttribute("viewBox");
  if (viewBox) {
    const view = viewBox.split(" ").map((e) => Number(e));
    [width, height] = view.slice(2);
  }
  // Take the advantage of `svg` can be auto-scaled to parent element.
  Object.assign(wrapper.style, {
    width: `${width}px`,
    height: `${height}px`,
    padding: `${padding}px`,
  });

  try {
    const canvas = await html2canvas(wrapper, {
      useCORS: true,
      backgroundColor: null,
      onclone: noop,
    });
    if (crop_) {
      return crop(canvas, crop_);
    } else {
      return canvas;
    }
  } finally {
    document.body.removeChild(wrapper);
  }
}

/**
 * Utility to cut a specific rect from a canvas.
 * @param canvas The canvas element.
 * @param rect The rect to cut.
 * @returns A new canvas element.
 */
export function crop(
  canvas: HTMLCanvasElement,
  rect: Record<"x" | "y" | "width" | "height", number>
) {
  const newCanvas = document.createElement("canvas");
  const ctx = newCanvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to create canvas context.");
  }
  newCanvas.width = rect.width;
  newCanvas.height = rect.height;
  ctx.drawImage(
    canvas,
    rect.x,
    rect.y,
    rect.width,
    rect.height,
    0,
    0,
    rect.width,
    rect.height
  );
  return newCanvas;
}
