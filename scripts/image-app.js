(function(){
  // http://stackoverflow.com/questions/10906734/how-to-upload-image-into-html5-canvas
  var original;
  var imageLoader = document.querySelector('#imageLoader');
  imageLoader.addEventListener('change', handleImage, false);
  var canvas = document.querySelector('#image');
  var ctx = canvas.getContext('2d');

  function handleImage(e){
    var reader = new FileReader();
    reader.onload = function(event){
      var img = new Image();
      img.onload = function(){
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img,0,0);
        original = ctx.getImageData(0, 0, canvas.width, canvas.height);
      }
      img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
  }

  // greys out the buttons while manipulation is happening
  // un-greys out the buttons when the manipulation is done
  function toggleButtonsAbledness() {
    var buttons = document.querySelectorAll('button');
    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i].hasAttribute('disabled')) {
        buttons[i].removeAttribute('disabled')
      } else {
        buttons[i].setAttribute('disabled', null);
      }
    };
  }

  function manipulateImageWebAssemeber(type) {
    console.time('manipulateImageWebAssemeber')
    var a, b, g, i, imageData, j, length, pixel, r, ref;
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    toggleButtonsAbledness();

    let image;

    switch (type) {
    case 'invert':
      image = imageConvertInverted(imageData.data);
      break;
    case 'chroma':
      image = imageConvertChroma(imageData.data);
    break;
    case 'greyscale':
      image = imageConvertGreyScale(imageData.data);
    break;
    case 'vibrant':
      // image = makePixelVibrant(imageData.data);
      alert('this function fuckup. = [')
    break;
    }
    
    
    toggleButtonsAbledness();
    console.timeEnd('manipulateImageWebAssemeber')
    return ctx.putImageData(new ImageData (
      image,
      imageData.width,
      imageData.height
    ), 0, 0);
  }

  function manipulateImageWebWorker(type) {
    console.time('manipulateImageWebWorker')
    var imageWorker = new Worker('scripts/worker.js');
    var a, b, g, i, imageData, j, length, pixel, r, ref;
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    toggleButtonsAbledness();
   
    imageWorker.postMessage({'imageData': imageData.data.buffer, 'type': type}, [imageData.data.buffer]);

    imageWorker.onmessage = function(e) {
      toggleButtonsAbledness();
      var image = e.data;
      imageWorker.terminate();
      console.timeEnd('manipulateImageWebWorker')
      if (image) return ctx.putImageData(new ImageData (
        new Uint8ClampedArray(image),
        imageData.width,
        imageData.height
      ), 0, 0);
    }
  }

  function manipulateImageSplitWebWorker(type) {
    console.time('manipulateImageSplitWebWorker')
    var imageWorker = new Worker(`scripts/splitWorker/worker_${type}.js`);
    var a, b, g, i, imageData, j, length, pixel, r, ref;
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    toggleButtonsAbledness();
   
    imageWorker.postMessage({'imageData': imageData.data.buffer, 'type': type}, [imageData.data.buffer]);

    imageWorker.onmessage = function(e) {
      toggleButtonsAbledness();
      var image = e.data;
      imageWorker.terminate();
      console.timeEnd('manipulateImageSplitWebWorker')
      if (image) return ctx.putImageData(new ImageData (
        new Uint8ClampedArray(image),
        imageData.width,
        imageData.height
      ), 0, 0);
    }
  }

  function manipulateImage(type) {
    console.time('manipulateImage')
    var a, b, g, i, imageData, j, length, pixel, r, ref;
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    toggleButtonsAbledness();

    length = imageData.data.length / 4;
    for (i = j = 0, ref = length; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      r = imageData.data[i * 4 + 0];
      g = imageData.data[i * 4 + 1];
      b = imageData.data[i * 4 + 2];
      a = imageData.data[i * 4 + 3];
      pixel = manipulate(type, r, g, b, a);
      imageData.data[i * 4 + 0] = pixel[0];
      imageData.data[i * 4 + 1] = pixel[1];
      imageData.data[i * 4 + 2] = pixel[2];
      imageData.data[i * 4 + 3] = pixel[3];
    }

    toggleButtonsAbledness();
    console.timeEnd('manipulateImage')
    return ctx.putImageData(imageData, 0, 0);
  };

  function generateImage(type){
    const mode = document.querySelector('input[name="mode"]:checked').value;
    console.log('mode', mode);
    let func = null;
    switch (mode) {
      case 'webworker':
        func = manipulateImageWebWorker
        break;
      case 'webworker-split':
        func = manipulateImageSplitWebWorker
        break;
      case 'sync':
        func = manipulateImage
        break;
      case 'webassembly':
        func = manipulateImageWebAssemeber
        break;
    }
    func(type);
  }

  function revertImage() {
    return ctx.putImageData(original, 0, 0);
  }

  document.querySelector('#invert').onclick = function() {
    generateImage("invert");
  };
  document.querySelector('#chroma').onclick = function() {
    generateImage("chroma");
  };
  document.querySelector('#greyscale').onclick = function() {
    generateImage("greyscale");
  };
  document.querySelector('#vibrant').onclick = function() {
    generateImage("vibrant");
  };
  document.querySelector('#revert').onclick = function() {
    revertImage();
  };
})();