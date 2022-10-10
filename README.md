## <del>@netless/white-snapshot</del> Deprecated!

Use this new API instead &darr; (requires white-web-sdk@^2.16.36)

### screenshotToCanvas(context, scenePath, width, height, camera, ratio?)

- `context` {CanvasRenderingContext2D} The canvas to draw on to.
- `scenePath` {String} Path of the scene to render, like "/init".
- `width` {Integer} The abstract width of whiteboard in pixels, it is not `canvas.width`.
- `height` {Integer} The abstract height of whiteboard in pixels, it is not `canvas.height`.
- `camera` {Camera} The camera to render with.
- `ratio` {Number} If present, execute `context.scale(ratio, ratio)` before drawing each element. See [mdn: CanvasRenderingContext2D.scale](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/scale) for more details.

#### Camera

- `camera.centerX` {Number} The x coordinate of the camera in pixels, default `0`.
- `camera.centerY` {Number} The y coordinate of the camera in pixels, default `0`.
- `camera.scale` {Number} The scale of the camera, default `1`.

#### Example

```js
let canvas = document.createElement("canvas");
let context = canvas.getContext("2d");
let { scenePath } = room.state.sceneState;
let { width, height, ...camera } = room.state.cameraState;
room.screenshotToCanvas(context, scenePath, width, height, camera);
```

---

> Original Content

Take a snapshot of a white-web-sdk scene.

Requires white-web-sdk &ge; 2.16.20.

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
  background: 'transparent',
  crop: null,
  crossorigin: false,
  src2dataurl: undefined,
}): Promise<HTMLCanvasElement | null>;
```

Returns `null` if failed.

| Option      | Type                                       | Default       | Description                                                                                             |
| ----------- | ------------------------------------------ | ------------- | ------------------------------------------------------------------------------------------------------- |
| scenePath   | string                                     | current scene | Default is `displayer.state.sceneState.scenePath`.                                                      |
| padding     | number                                     | 5             | Pixels to the border of canvas.                                                                         |
| background  | string                                     |               | Background color.                                                                                       |
| crop        | Rectangle                                  | null          | Apply crop on the snapshot. Note that the snapshot includes padding.                                    |
| crossorigin | boolean                                    | false         | Apply hack to `document.createElement('img')` to enable crossorigin images.                             |
| src2dataurl | (src: string) &rArr; Promise&lt;string&gt; |               | Due to a [limitation][1] in `html2canvas`, we must convert images to dataurl before feeding them to it. |

[1]: https://github.com/niklasvh/html2canvas/issues/592#issuecomment-727540799

### Develop

```bash
pnpm dev
```

### [Changelog](./CHANGELOG.md)

## License

MIT @ [netless](https://github.com/netless-io/white-snapshot)
