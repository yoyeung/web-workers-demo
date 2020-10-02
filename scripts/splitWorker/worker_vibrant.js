 // Image manipulation logic from github.com/jwill/psychic-lana

function makePixelVibrant(r, g, b, a) {
  let amt, avg, bs, gs, mx, rs;
  avg = (r + g + b) / 3.0;
  mx = Math.max(r, Math.max(g, b));
  amt = (mx / 255 * avg / 255) * (-0.4 * 3.0);
  rs = r + (amt * (mx - r));
  gs = g + (amt * (mx - g));
  bs = b + (amt * (mx - b));
  return [rs, gs, bs, a];
};

this.onmessage = function(e) {
  const data = e.data;
  // console.log('data', data)
  let imageData = {data: new Uint8ClampedArray(data.imageData)};
  let type = data.type;

  try {
    length = imageData.data.length / 4;
    for (i = 0 ; i < length; ++i) {
      let r = imageData.data[i * 4 + 0];
      let g = imageData.data[i * 4 + 1];
      let b = imageData.data[i * 4 + 2];
      let a = imageData.data[i * 4 + 3];
      let pixel = makePixelVibrant(r, g, b, a);
      imageData.data[i * 4 + 0] = pixel[0];
      imageData.data[i * 4 + 1] = pixel[1];
      imageData.data[i * 4 + 2] = pixel[2];
      imageData.data[i * 4 + 3] = pixel[3];
      delete r
      delete g
      delete b
      delete a
      delete pixel
    }
    postMessage(imageData.data.buffer, [imageData.data.buffer]);
    delete imageData
  } catch (e) {
    console.log(e);
    function ManipulationException(message) {
      this.name = "ManipulationException";
      this.message = message;
    };
    throw new ManipulationException('Image manipulation error');
    postMessage(undefined);
  }
}