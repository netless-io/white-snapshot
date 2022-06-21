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
