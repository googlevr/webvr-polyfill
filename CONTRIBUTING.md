# Building

This project uses [webpack] to manage dependencies and build the library. `npm run watch` is
especially convenient to preserve the write-and-reload model of development.
This package lives in the npm index.

Relevant commands:

* `npm install`: installs the dependencies.
* `npm start`: auto-builds the module whenever any source changes and serves the example
content on `http://0.0.0.0:8080/`.
* `npm run build`: builds the module.
* `npm run watch`: alias for `npm start`.

# Updating the npm entry

Once changes are made, a new version can be published to the index using the
following commands:

    npm version <NEW_VERSION>
    npm publish
    git push --tags

[webpack]: https://webpack.js.org
