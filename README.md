## @netless/white-snapshot

Take a snapshot of a white-web-sdk scene.

Requires white-web-sdk &ge; 2.16.20 to **not** depending on html2canvas.

### Usage

```js
import { snapshot } from "@netless/white-snapshot";
// room = await sdk.joinRoom(...)
snapshot(room).then((canvas) => {
  document.body.append(canvas);
});
```

### Options

```ts
snapshot(room, {
  scenePath: "/init",
  padding: 5,
  crop: null,
  html2canvas: false,
  crossorigin: false,
}): Promise<HTMLCanvasElement | null>;
```

Returns `null` if failed.

| Option      | Type      | Default       | Description                                                                 |
| ----------- | --------- | ------------- | --------------------------------------------------------------------------- |
| scenePath   | string    | current scene | Default is `displayer.state.sceneState.scenePath`.                          |
| padding     | number    | 5             | Pixels to the border of canvas.                                             |
| crop        | Rectangle | null          | Apply crop on the snapshot. Note that the snapshot includes padding.        |
| html2canvas | boolean   | false\*       | Use `html2canvas` to print SVG directly.                                    |
| crossorigin | boolean   | false         | Apply hack to `document.createElement('img')` to enable crossorigin images. |

\*: always true if white-web-sdk < 2.16.20 because previously there's API support in the sdk.

### How it works

The white-web-sdk provides such API:

```ts
interface Displayer {
  // Get a snapshot of some scene path.
  fillSceneSnapshot(
    // find the scene to print
    scenePath: string,
    // render that scene to this div
    div: HTMLElement,
    // optionally provide the div's size,
    // which affects the output svg/canvas size.
    // otherwise clientWidth/clientHeight will be used
    width?: number,
    height?: number,
    // output svg or canvas, this option was added in 2.16.20
    // previously, it can only output svg
    engine?: RenderEngine // "svg" | "canvas"
  ): void;
}
```

To get <samp>1:1</samp> canvas snapshot of a scene, we have to

1. Find the total boundary of all elements, there's no such API currently,
   so we have to hack one -- use the svg output's `viewBox` attribute, which
   includes its real size.
2. Get a snapshot of the scene, the output html structure is the same as the
   working one rendered by `room.bindHtmlElement()`. So we have to find the
   displaying canvas element in it, which can be determined by searching
   `visibility: visible` in the `style` attribute.
3. Then we just pull out that `<canvas>` element.

### Develop

```bash
pnpm dev
```

## License

MIT @ [netless](https://github.com/netless-io/white-snapshot)
