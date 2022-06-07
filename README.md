## @netless/white-snapshot

Take a snapshot of a white-web-sdk scene.

Requires white-web-sdk &ge; 2.16.20.

### Usage

```js
import { snapshot } from "@netless/white-snapshot";
// room = await sdk.joinRoom(...)
snapshot(room).then(canvas => {
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
}): Promise<HTMLCanvasElement | null>;
```

Returns `null` if failed.

| Option      | Type      | Default       | Description                                                                 |
| ----------- | --------- | ------------- | --------------------------------------------------------------------------- |
| scenePath   | string    | current scene | Default is `displayer.state.sceneState.scenePath`.                          |
| padding     | number    | 5             | Pixels to the border of canvas.                                             |
| background  | string    |               | Background color.                                                           |
| crop        | Rectangle | null          | Apply crop on the snapshot. Note that the snapshot includes padding.        |
| crossorigin | boolean   | false         | Apply hack to `document.createElement('img')` to enable crossorigin images. |

### Develop

```bash
pnpm dev
```

### Changelog

#### 0.4.0

- Added back `html2canvas`.

#### 0.3.1

- Fixed `padding` not work.\
  It still has a little visual bug.

- Added Options:

  ```ts
  interface SnapshotOptions {
    /**
     * Background color.
     *
     * @default transparent
     */
    background?: string;
  }
  ```

#### 0.3.0

- Removed html2canvas dependency.\
  Now it must requires white-web-sdk &ge; 2.16.20.

#### 0.2.2

- Fixed `html2canvas` usage may get empty output.\
  Now it works the same as 0.2.0.
- Added Options:

  ```ts
  interface SnapshotOptions {
    /**
     * Print which scene.
     *
     * @default displayer.state.sceneState.scenePath
     */
    scenePath?: string;
  }
  ```

#### 0.2.1

- Support white-web-sdk 2.16.20's native canvas output.
- Added options:

  ```ts
  interface SnapshotOptions {
    /**
     * Use `html2canvas` to print SVG directly.
     *
     * @default false
     */
    html2canvas?: boolean;
    /**
     * Apply hack to all `document.createElement('img')` to include crossorigin attribute.
     * This option requires image server settings and therefore is not enabled by default.
     *
     * @default false
     */
    crossorigin?: boolean;
  }
  ```

#### 0.2.0

- Support `html2canvas` based snapshot. Options:

  ```ts
  interface SnapshotOptions {
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

  function snapshot(
    displayer: Displayer,
    { padding, crop: crop_ }?: SnapshotOptions
  ): Promise<HTMLCanvasElement | null>;
  ```

## License

MIT @ [netless](https://github.com/netless-io/white-snapshot)
