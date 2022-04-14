import type { Displayer } from "white-web-sdk";

/**
 * Search the displaying svg element.
 * @param container The param you used in `room.bindHtmlElement`.
 * @returns The svg element or null if not found.
 */
function search_svg(container: HTMLDivElement) {
  return container.querySelector(".background~svg") as SVGElement;
}

function extract_size_from_svg(svg: SVGElement, width: number, height: number) {
  const viewBox = svg.getAttribute("viewBox");
  if (viewBox) {
    const view = viewBox.split(" ").map(e => Number(e));
    [width, height] = view.slice(2);
  }
  return { width, height };
}

/**
 * Search the displaying canvas element.
 * @param container The param you used in `room.bindHtmlElement`.
 * @returns The canvas element or null if not found.
 */
function search_canvas(container: HTMLDivElement) {
  for (const canvas of container.querySelectorAll(".background~canvas")) {
    if ((canvas as HTMLCanvasElement).style.visibility === "visible") {
      return canvas as HTMLCanvasElement;
    }
  }
  return null;
}

function noop() {}

function next_frame() {
  return new Promise(resolve => {
    (window.requestAnimationFrame || setTimeout)(resolve);
  });
}

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

  /**
   * Use `html2canvas` to print SVG directly.
   *
   * @default false
   */
  html2canvas?: boolean;
}

function wrapper_element() {
  const wrapper = document.createElement("div");
  Object.assign(wrapper.style, {
    position: "fixed",
    top: `-9999px`,
    left: `-9999px`,
    width: `100px`,
    height: `100px`,
  });
  return wrapper;
}

/**
 * Take a snapshot of a whiteboard scene.
 * @param displayer The `room` returned by `sdk.joinRoom()`.
 * @returns Promise of `null` if failed to render, or a rendered `canvas` element.
 */
export async function snapshot(
  displayer: Displayer,
  { padding = 5, crop: crop_ = null, html2canvas = false }: SnapshotOptions = {}
) {
  const { scenePath } = displayer.state.sceneState;
  let { width, height } = displayer.state.cameraState;

  const wrapper = wrapper_element();
  document.body.appendChild(wrapper);

  // @ts-expect-error
  // 1. Get real size from svg element
  displayer.fillSceneSnapshot(scenePath, wrapper, width, height, "svg");
  await next_frame();
  const svg = search_svg(wrapper);
  if (!svg) {
    document.body.removeChild(wrapper);
    return null;
  }
  ({ width, height } = extract_size_from_svg(svg, width, height));

  // 2. Render canvas
  try {
    let canvas: HTMLCanvasElement | null;

    if (html2canvas || displayer.fillSceneSnapshot.length < 5) {
      const { default: html2canvas } = await import("html2canvas");
      Object.assign(wrapper.style, {
        width: `${width}px`,
        height: `${height}px`,
        padding: `${padding}px`,
      });
      canvas = await html2canvas(wrapper, {
        useCORS: true,
        backgroundColor: null,
        onclone: noop,
      });
    } else {
      while (wrapper.firstChild) wrapper.removeChild(wrapper.lastChild!);
      // @ts-expect-error
      displayer.fillSceneSnapshot(scenePath, wrapper, width, height, "canvas");
      await next_frame();
      canvas = search_canvas(wrapper);
    }

    if (!canvas) return null;

    return crop_ ? crop(canvas, crop_) : canvas;
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
