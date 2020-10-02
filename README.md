# This project original from [Cameron Pittman](http://twitter.com/cwpittman)
Use for personal study Web Worker and Web Assmebly 

Go 1.15. Please make sure to build the main.go using same version.
If you have change the version, please also update wasm_exec.js from GO github

For easily to startup the web server you can use.

```shell
goexec 'http.ListenAndServe(`:8080`, http.FileServer(http.Dir(`.`)))'
```
in the root folder

# Web Workers Demo
Migrate Long Running JS onto a Web Worker

### [Relevant Quiz from Browser Rendering Optimization](https://www.udacity.com/course/viewer#!/c-ud860/l-4138168623/e-4184098558/m-4150829139)

### [Relevant solution from Browser Rendering Optimization](https://www.udacity.com/course/viewer#!/c-ud860/l-4138168623/e-4184098558/m-4146278980)

Working on the quiz? Start by examining index.html and the JavaScript files linked inside it.