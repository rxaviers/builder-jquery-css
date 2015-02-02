## Why builder-jquery-css?

Use `builder-jquery-css` to generate the CSS bundle of a jQuery project that
uses JS comments like `//>> css.<name>: files` to define its CSS dependencies and that uses AMD
definitions to define its JS dependencies.

It's ideal for applications that builds bundles on the fly using [Node.js][].

[Node.js]: http://nodejs.org/

## Usage

   npm install builder-jquery-css

```javascript
var fs = require( "js" );
var jqueryCssBuilder = require( "builder-jquery-css" );

var files = {
  "main.js": fs.readFileSync( "./main.js" ),
  "main.css": fs.readFileSync( "./main.css" ),
  "foo.js": fs.readFileSync( "./foo.js" ),
  "foo.css": fs.readFileSync( "./foo.css" ),
  "bar.js": fs.readFileSync( "./foo.js" ),
  "bar.css": fs.readFileSync( "./bar.css" ),
  ...
}

jqueryCssBuilder( files, "structure", {
  include: "main"
}, function( error, builtStructureCss ) {
  ...
});

jqueryCssBuilder( files, "theme", {
  include: "main"
}, function( error, builtThemeCss ) {
  ...
});
```

## API

- **`jqueryCssBuilder( files, which, requirejsConfig, callback )`**

**files** *Object* containing (path, data) key-value pairs, e.g.:

```
{
   <path-of-file-1>: <data-of-file-1>,
   <path-of-file-2>: <data-of-file-2>,
   ...
}
```

**which** *String* css name selector.

**requirejsConfig** *Object* [require.js build configuration][

**callback** *Function* called with three arguments: null or an Error object, a
String with the built css content, an Object with the cloned built files
structure.

[require.js build configuration]: https://github.com/jrburke/r.js/blob/master/build/example.build.js

## Test

    npm test

## License

MIT © [Rafael Xavier de Souza](http://rafael.xavier.blog.br)
