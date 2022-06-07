import type { Displayer } from "white-web-sdk";
import html2canvas from "html2canvas";

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

function next_frame() {
  return new Promise(resolve => {
    (window.requestAnimationFrame || setTimeout)(resolve);
  });
}

async function next_frames(n: number) {
  while (n-- > 0) await next_frame();
}

function noop() {}

function call_fn<T>(fn: () => T) {
  return fn();
}

export interface SnapshotOptions {
  /**
   * Print which scene.
   *
   * @default displayer.state.sceneState.scenePath
   */
  scenePath?: string;

  /**
   * @default 5 (px)
   */
  padding?: number;

  /**
   * Background color.
   *
   * @default transparent
   */
  background?: string;

  /**
   * Apply crop on the snapshot. Note that the snapshot includes padding.
   *
   * @default null
   */
  crop?: Record<"x" | "y" | "width" | "height", number> | null;

  /**
   * Apply hack to all `document.createElement('img')` to include crossorigin attribute.
   * This option requires image server settings and therefore is not enabled by default.
   *
   * @default false
   */
  crossorigin?: boolean;
}

function wrapper_element({ width = 100, height = 100, padding = 0 } = {}) {
  const wrapper = document.createElement("div");
  Object.assign(wrapper.style, {
    position: "fixed",
    top: `-9999px`,
    left: `-9999px`,
    width: `${width}px`,
    height: `${height}px`,
    padding: `${padding}px`,
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
  {
    scenePath: scenePath_,
    padding = 5,
    background,
    crop: crop_ = null,
    crossorigin = false,
  }: SnapshotOptions = {}
) {
  const scenePath = scenePath_ || displayer.state.sceneState.scenePath;
  let { width, height } = displayer.state.cameraState;

  let wrapper = wrapper_element();
  document.body.appendChild(wrapper);

  const invoke = crossorigin ? hack_create_image_with_cross_origin : call_fn;

  // 1. Get real size from svg element.
  await invoke(async () => {
    displayer.fillSceneSnapshot(scenePath, wrapper, width, height);
    await next_frames(10);
  });
  const svg = search_svg(wrapper);
  if (!svg) {
    document.body.removeChild(wrapper);
    return null;
  }
  ({ width, height } = extract_size_from_svg(svg, width, height));

  // 2. Render canvas again with correct size,
  //    otherwise the dom elements won't be in the right place.
  document.body.removeChild(wrapper);
  wrapper = wrapper_element({ width, height, padding });
  document.body.appendChild(wrapper);
  await invoke(async () => {
    displayer.fillSceneSnapshot(scenePath, wrapper, width, height);
    await next_frames(10);
  });

  try {
    let canvas = await html2canvas(wrapper, {
      useCORS: true,
      backgroundColor: background || null,
      async onclone(doc: Document): Promise<void> {
        const images = Array.from(doc.getElementsByTagName("image"));
        const tasks: Promise<string>[] = [];
        for (const img of images) {
          tasks.push(src2dataurl(img.href.baseVal));
        }
        for (const img of images) {
          const dataurl = await tasks.shift();
          if (dataurl) img.href.baseVal = dataurl;
        }
      },
    });

    if (crop_) {
      canvas = crop(canvas, crop_);
    }
    return canvas;
  } catch (error) {
    console.error(error);
    return null;
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
  newCanvas.style.cssText = canvas.style.cssText;
  ctx.drawImage(canvas, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
  return newCanvas;
}

export function fill_background(canvas: HTMLCanvasElement, background: string) {
  const newCanvas = document.createElement("canvas");
  const ctx = newCanvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to create canvas context.");
  }
  newCanvas.width = canvas.width;
  newCanvas.height = canvas.height;
  newCanvas.style.cssText = canvas.style.cssText;
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(canvas, 0, 0);
  return newCanvas;
}

export function add_padding(canvas: HTMLCanvasElement, padding: number) {
  const newCanvas = document.createElement("canvas");
  const ctx = newCanvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to create canvas context.");
  }
  newCanvas.width = canvas.width + padding * 2;
  newCanvas.height = canvas.height + padding * 2;
  newCanvas.style.cssText = canvas.style.cssText;
  ctx.drawImage(canvas, padding, padding);
  return newCanvas;
}

let hacked = false; // helper to prevent recursive hack
export async function hack_create_image_with_cross_origin(cb: () => Promise<void>) {
  if (hacked) return await cb();

  hacked = true;
  const _createElement = document.createElement;
  (document as any).createElement = function (...args: any[]) {
    const result = _createElement.apply(this, args as any);
    if (result instanceof HTMLImageElement) {
      result.setAttribute("crossorigin", "anonymous");
    }
    return result;
  };

  try {
    return await cb();
  } finally {
    (document as any).createElement = _createElement;
    hacked = false;
  }
}

export async function src2dataurl(src: string) {
  const r = await fetch(src);
  const blob = await r.blob();
  return new Promise<string>(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}
