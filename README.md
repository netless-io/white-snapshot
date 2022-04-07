## @netless/white-snapshot

Take a snapshot of a white-web-sdk scene.

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
  padding: 5,
}): Promise<HTMLCanvasElement | null>;
```

Returns `null` if failed.

| Option  | Type   | Default | Description                     |
| ------- | ------ | ------- | ------------------------------- |
| padding | number | 5       | Pixels to the border of canvas. |

### Develop

```bash
pnpm dev
```

## License

MIT @ [netless](https://github.com/netless-io/white-snapshot)
