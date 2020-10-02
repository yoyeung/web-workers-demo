package main

import (  
	"fmt"
	"syscall/js"
)



func Max(x, y int) int {
	if x < y {
			return y
	}
	return x
}

// Min returns the smaller of x or y.
func Min(x, y int) int {
	if x > y {
			return y
	}
	return x
}


func makePixelInverted(r, g, b, a byte) []byte{
	_r := 255 - r
  _g := 255 - g
  _b := 255 - b
  return []byte{_r, _g, _b, a}
};


func makePixelChroma(r, g, b, a byte) []byte {
  max := Max(int(r), Min(int(g), int(b)));
  if (max <= int(g)) {
    return []byte{0, 0, 0, 0};
  } else {
    return []byte{r, g, b, a};
  }
};

func makePixelGreyScale(r, g, b, a byte) []byte  {
  y := byte((0.3 * float32(r)) + (0.59 * float32(g)) + (0.11 * float32(b)));
  r = y;
  g = y;
  b = y;
  return []byte{r, g, b, a};
};

func makePixelVibrant(r, g, b, a byte) []byte  {
  avg := byte((r + g + b) / 3.0);
  mx := byte(Max(int(r), Max(int(g), int(b))));
  amt := byte(float32((mx / 255 * avg / 255)) * (-0.4 * 3.0));
  rs := r + (amt * (mx - r));
  gs := g + (amt * (mx - g));
  bs := b + (amt * (mx - b));
  return []byte{rs, gs, bs, a};
};

func imageConvertInverted () js.Func {
	convertFunc := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
						return "Invalid no of arguments passed"
		}
		imageData := make([]byte, args[0].Length())

		js.CopyBytesToGo(imageData, args[0])

		length := len(imageData) / 4;
		
    for i := 0 ; i < length; i++ {
      r := imageData[i * 4 + 0]
      g := imageData[i * 4 + 1]
      b := imageData[i * 4 + 2]
			a := imageData[i * 4 + 3]
			pixel := makePixelInverted(r, g, b, a)
      imageData[i * 4 + 0] = pixel[0]
      imageData[i * 4 + 1] = pixel[1]
      imageData[i * 4 + 2] = pixel[2]
      imageData[i * 4 + 3] = pixel[3]
    }
		// fmt.Println(imageData)
		dst := js.Global().Get("Uint8ClampedArray").New(len(imageData))
  	js.CopyBytesToJS(dst, imageData)
		return dst
	})
	return convertFunc
}

func imageConvertChroma () js.Func {
	convertFunc := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
						return "Invalid no of arguments passed"
		}
		imageData := make([]byte, args[0].Length())

		js.CopyBytesToGo(imageData, args[0])

		length := len(imageData) / 4;
		
    for i := 0 ; i < length; i++ {
      r := imageData[i * 4 + 0]
      g := imageData[i * 4 + 1]
      b := imageData[i * 4 + 2]
			a := imageData[i * 4 + 3]
			pixel := makePixelChroma(r, g, b, a)
      imageData[i * 4 + 0] = pixel[0]
      imageData[i * 4 + 1] = pixel[1]
      imageData[i * 4 + 2] = pixel[2]
      imageData[i * 4 + 3] = pixel[3]
    }
		// fmt.Println(imageData)
		dst := js.Global().Get("Uint8ClampedArray").New(len(imageData))
  	js.CopyBytesToJS(dst, imageData)
		return dst
	})
	return convertFunc
}

func imageConvertGreyScale () js.Func {
	convertFunc := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
						return "Invalid no of arguments passed"
		}
		imageData := make([]byte, args[0].Length())

		js.CopyBytesToGo(imageData, args[0])

		length := len(imageData) / 4;
		
    for i := 0 ; i < length; i++ {
      r := imageData[i * 4 + 0]
      g := imageData[i * 4 + 1]
      b := imageData[i * 4 + 2]
			a := imageData[i * 4 + 3]
			pixel := makePixelGreyScale(r, g, b, a)
      imageData[i * 4 + 0] = pixel[0]
      imageData[i * 4 + 1] = pixel[1]
      imageData[i * 4 + 2] = pixel[2]
      imageData[i * 4 + 3] = pixel[3]
    }
		// fmt.Println(imageData)
		dst := js.Global().Get("Uint8ClampedArray").New(len(imageData))
  	js.CopyBytesToJS(dst, imageData)
		return dst
	})
	return convertFunc
}

func imageConvertPixelVibrant () js.Func {
	convertFunc := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
						return "Invalid no of arguments passed"
		}
		imageData := make([]byte, args[0].Length())

		js.CopyBytesToGo(imageData, args[0])

		length := len(imageData) / 4;
		
    for i := 0 ; i < length; i++ {
      r := imageData[i * 4 + 0]
      g := imageData[i * 4 + 1]
      b := imageData[i * 4 + 2]
			a := imageData[i * 4 + 3]
			pixel := makePixelVibrant(r, g, b, a)
      imageData[i * 4 + 0] = pixel[0]
      imageData[i * 4 + 1] = pixel[1]
      imageData[i * 4 + 2] = pixel[2]
      imageData[i * 4 + 3] = pixel[3]
    }
		// fmt.Println(imageData)
		dst := js.Global().Get("Uint8ClampedArray").New(len(imageData))
  	js.CopyBytesToJS(dst, imageData)
		return dst
	})
	return convertFunc
}

func RenderCore () {

}

func main() {
	fmt.Println("Hello, WebAssembly!")
	js.Global().Set("imageConvertInverted", imageConvertInverted())
	js.Global().Set("imageConvertChroma", imageConvertChroma())
	js.Global().Set("imageConvertGreyScale", imageConvertGreyScale())
	js.Global().Set("imageConvertPixelVibrant", imageConvertPixelVibrant())
	<-make(chan bool)
}