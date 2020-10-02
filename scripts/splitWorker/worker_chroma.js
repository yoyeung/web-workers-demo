 // Image manipulation logic from github.com/jwill/psychic-lana
function makePixelChroma(r, g, b, a) {
  let max;
  max = Math.max(r, Math.max(g, b));
  if (max === g) {
    return [0, 0, 0, 0];
  } else {
    return [r, g, b, a];
  }
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
      let pixel = makePixelChroma(r, g, b, a);
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