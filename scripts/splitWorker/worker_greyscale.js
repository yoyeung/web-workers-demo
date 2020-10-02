 // Image manipulation logic from github.com/jwill/psychic-lana

function makePixelGreyScale(r, g, b, a) {
  let y;
  y = (0.3 * r) + (0.59 * g) + (0.11 * b);
  r = y;
  g = y;
  b = y;
  return [r, g, b, a];
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
      let pixel = makePixelGreyScale(r, g, b, a);
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