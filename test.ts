navigator.serviceWorker.getRegistrations().then((rs) => {
  rs.forEach((r) => r.unregister());
});

var src_original =
  "https://flat-storage.oss-accelerate.aliyuncs.com/cloud-storage/2022-02/21/59455e11-d5fe-4f88-9d50-39b824a5c94b/59455e11-d5fe-4f88-9d50-39b824a5c94b.jpeg";
var src_cors = "http://localhost:4000/img.jpeg";

var chosen = location.search.includes('o') ? src_original : src_cors;

var canvas = document.querySelector("canvas")!;
var context = canvas.getContext("2d")!;

var image = new Image();
window.image = image;
image.onload = () => {
  context.drawImage(image, 0, 0);
  var a = document.createElement("a");
  a.textContent = "download";
  a.download = "img.jpeg";
  a.href = canvas.toDataURL();
  document.body.appendChild(a);
  // a.dispatchEvent(new MouseEvent("click"));
};

// If there's no CORS header (src_original)
// 1. without this prop, the image can be drawn, but cannot be exported (toDataURL)
// 2. with this prop, the image cannot be drawn, and cannot be exported

// If there's CORS header (src_cors)
// 1. without this prop, the image can be drawn, but cannot be exported (toDataURL)
// 2. with this prop, the image can be drawn, and can be exported

if (chosen === src_cors) {
  image.setAttribute("crossorigin", "anonymous");
}
image.src = chosen;
