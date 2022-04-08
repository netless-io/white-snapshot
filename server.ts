import http from "http";
import https from "https";

// Simple server to serve CORS image.
var img_orginal =
  "https://flat-storage.oss-accelerate.aliyuncs.com/cloud-storage/2022-02/21/59455e11-d5fe-4f88-9d50-39b824a5c94b/59455e11-d5fe-4f88-9d50-39b824a5c94b.jpeg";

var fetch_img = new Promise((resolve) => {
  https.get(img_orginal, (res) => {
    var chunks = [];
    res.on("data", (c) => chunks.push(c));
    res.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
  });
});

var server = http.createServer((req, res) => {
  if (req.url === "/img.jpeg") {
    res.writeHead(200, {
      "Content-Type": "image/jpeg",
      "Access-Control-Allow-Origin": "http://localhost:3000",
    });
    fetch_img.then((buffer) => {
      // https://stackoverflow.com/questions/34391134/send-a-binary-buffer-to-client-through-http-serverresponse-in-node-js
      res.write(buffer, "binary");
      res.end(null, "binary");
    });
  } else {
    res.writeHead(404);
    res.end("not found");
  }
});

server.listen(4000, () => {
  console.log("serving http://localhost:4000/img.jpeg");
});
