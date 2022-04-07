import { DefaultHotKeys, RenderEngine, WhiteWebSdk } from "white-web-sdk";
import { snapshot } from "./index";

const sdk = new WhiteWebSdk({
  appIdentifier: "Gh0NyZub25jZT0x/Amcm9sZT0w",
  renderEngine: RenderEngine.Canvas,
});

sdk
  .joinRoom({
    uid: "uid-" + Math.random().toString(36).slice(2),
    uuid: "7285abc0b62911ecbd89bfc026a26890",
    roomToken:
      "NETLESSROOM_YWs9eTBJOWsxeC1IVVo4VGh0NyZub25jZT0xNjQ5MzA0OTY3Njg0MDAmcm9sZT0wJnNpZz04YjA2N2Q1ZjAwZjU1NTBjM2E3NjNkMWIzNjMxOGUyMGUzMWRmOTI3ZmFiYjNmOTkzYTk0NTYwOWEwYTM4N2M3JnV1aWQ9NzI4NWFiYzBiNjI5MTFlY2JkODliZmMwMjZhMjY4OTA",
    hotKeys: {
      ...DefaultHotKeys,
      changeToEraser: "e",
      changeToPencil: "p",
    },
  })
  .then((room) => {
    (window as any).room = room;
    (window as any).snapshot = snapshot;

    room.bindHtmlElement(
      document.getElementById("whiteboard") as HTMLDivElement
    );
  });
