<!-- Links in /docs/documentation should NOT have `.md` at the end, because they end up in our wiki at release. -->

# Speedray CLI

### Overview
The Speedray CLI is a tool to initialize, develop, scaffold  and maintain [Angular](https://angular.io) applications

### Getting Started
To install the Speedray CLI:
```
npm install -g @speedray/cli
```

Generating and serving an Angular project via a development server
[Create](new) and [run](serve) a new project:
```
sr new my-project
cd my-project
sr serve
```
Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

### Bundling

All builds make use of bundling, and using the `--prod` flag in  `sr build --prod`
or `sr serve --prod` will also make use of uglifying and tree-shaking functionality.

### Running unit tests

```bash
sr test
```

Tests will execute after a build is executed via [Karma](http://karma-runner.github.io/0.13/index.html), and it will automatically watch your files for changes. You can run tests a single time via `--watch=false` or `--single-run`.

### Running end-to-end tests

```bash
sr e2e
```

Before running the tests make sure you are serving the app via `sr serve`.
End-to-end tests are run via [Protractor](https://angular.github.io/protractor/).

### Additional Commands
* [sr new](new)
* [sr serve](serve)
* [sr generate](generate)
* [sr lint](lint)
* [sr test](test)
* [sr e2e](e2e)
* [sr build](build)
* [sr get/sr set](config)
* [sr doc](doc)
* [sr eject](eject)
* [sr xi18n](xi18n)
* [sr update](update)

## Speedray CLI Config Schema
* [Config Schema](angular-cli)

### Additional Information
There are several [stories](stories) which will walk you through setting up
additional aspects of Angular applications.
