import type { Displayer } from "white-web-sdk";
import html2canvas from "html2canvas";

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
}

/**
 * Take a snapshot of a whiteboard scene.
 * @param displayer The `room` returned by `sdk.joinRoom()`.
 * @returns Promise of `null` if failed to render, or a rendered `canvas` element.
 */
export function snapshot(
  displayer: Displayer,
  { padding = 5 }: SnapshotOptions = {}
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
    return Promise.resolve(null);
  }
  const viewBox = svg.getAttribute("viewBox");
  if (viewBox) {
    const view = viewBox.split(" ").map(e => Number(e));
    [width, height] = view.slice(2);
  }
  Object.assign(wrapper.style, {
    width: `${width}px`,
    height: `${height}px`,
    padding: `${padding}px`,
  });
  return html2canvas(wrapper, {
    useCORS: true,
    backgroundColor: null,
    onclone: noop,
  });
}
