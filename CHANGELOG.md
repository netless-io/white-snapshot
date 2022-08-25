## Changelog

### 0.4.2

- Updated `Displayer` typing, for better understand what it does.

### 0.4.1

- Added `src2dataurl` option.

  Due to a [limitation][1] in `html2canvas`, we must convert images to dataurl before feeding them to it.
  You can change this option to feed your own image loader, for example:

  ```js
  import { src2dataurl } from "@netless/white-snapshot";
  // Force ignore cache.
  snapshot({ ...options, src2dataurl: src => src2dataurl(src, true) });
  ```

[1]: https://github.com/niklasvh/html2canvas/issues/592#issuecomment-727540799

### 0.4.0

- Added back `html2canvas`.

### 0.3.1

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

### 0.3.0

- Removed html2canvas dependency.\
  Now it must requires white-web-sdk &ge; 2.16.20.

### 0.2.2

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

### 0.2.1

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

### 0.2.0

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
