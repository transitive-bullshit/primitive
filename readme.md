# primitive ([demo](https://transitive-bullshit.github.io/primitive-web/))

> Reproduce images from geometric primitives (Node.js + browser port of [primitive](https://github.com/fogleman/primitive)).

[![NPM](https://img.shields.io/npm/v/primitive.svg)](https://www.npmjs.com/package/primitive) [![Build Status](https://travis-ci.com/transitive-bullshit/primitive.svg?branch=master)](https://travis-ci.com/transitive-bullshit/primitive) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This library is also available as a [CLI](https://github.com/transitive-bullshit/primitive-cli).

[![Demo](https://storage.googleapis.com/transitive-bullshit-primitive/artem-bali-578205-unsplash-triangle-500.png)](https://transitive-bullshit.github.io/primitive-web/)

#### Table of Contents

- [Install](#install)
- [Usage](#usage)
- [How It Works](#how-it-works)
- [Node API](#node-api)
  * [primitive](#primitive)
- [Browser API](#browser-api)
  * [primitive](#primitive-1)
- [Related](#related)
- [Examples](#examples)
- [License](#license)

## Install

**Note**: We are currently trying to get the `primitive` npm package name. For now, you have to link to this repository directly.

```bash
npm install --save transitive-bullshit/primitive

# (hopefully soon)
npm install --save primitive
```

## Usage

Primitive is usable from both Node.js and browser environments. Most of the API options between the two are the same, with minor differences in input and output configurations.

A good place to start is by checking out the [web demo](https://transitive-bullshit.github.io/primitive-web/).

Available shape types:

-   triangle
-   ellipse
-   rotated-ellipse
-   rectangle
-   rotated-rectangle
-   random (will use all the shape types)

## How It Works

A target image is provided as input. The algorithm tries to find the single most optimal shape that can be drawn to minimize the error between the target image and the drawn image. It repeats this process, adding one shape at a time. Around 50 to 200 shapes are needed to reach a result that is recognizable yet artistic and abstract.

This GIF demonstrates the iterative nature of the algorithm, attempting to minimize the mean squared error by adding one shape at a time (use a ".gif" output file to generate one yourself).

[![Demo](https://raw.githubusercontent.com/transitive-bullshit/primitive/master/media/artem-bali-578205-unsplash-triangle-500.gif)](https://transitive-bullshit.github.io/primitive-web/)

## Node API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### [primitive](https://github.com/transitive-bullshit/primitive/blob/b242853b0f4634b85b788b8c4d81d4d480d7f617/index.js#L48-L98)

Reproduces the given input image using geometric primitives.

Returns a Promise for the generated model.

Available output formats:

-   png
-   jpg
-   svg
-   gif

Type: `function (opts): Promise`

-   `opts` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Configuration options
    -   `opts.input` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Input image to process (can be a local path, http url, or data url)
    -   `opts.output` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** Path to generate output image
    -   `opts.numSteps` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** Number of steps to process [1, 1000] \(optional, default `200`)
    -   `opts.minEnergy` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?** Minimum energy to stop processing early [0, 1]
    -   `opts.shapeAlpha` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** Alpha opacity of shapes [0, 255] \(optional, default `128`)
    -   `opts.shapeType` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Type of shapes to use (optional, default `traingle`)
    -   `opts.numCandidates` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** Number of top-level candidates per step [1, 32] \(optional, default `1`)
    -   `opts.numCandidateShapes` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** Number of random candidate shapes per step [10, 1000] \(optional, default `50`)
    -   `opts.numCandidateMutations` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** Number of candidate mutations per step [10, 500] \(optional, default `100`)
    -   `opts.numCandidateExtras` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** Number of extra candidate shapes per step [0, 16] \(optional, default `0`)
    -   `opts.onStep` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)?** Optional async function taking in the model and step index
    -   `opts.log` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** Optional logging function (console.log to enable logging) (optional, default `noop`)

## Browser API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### [primitive](https://github.com/transitive-bullshit/primitive/blob/b242853b0f4634b85b788b8c4d81d4d480d7f617/browser.js#L34-L83)

Reproduces the given input image using geometric primitives.

Optionally draws the results to an HTML canvas.

Returns a Promise for the generated model.

Type: `function (opts): Promise`

-   `opts` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Configuration options
    -   `opts.input` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Image](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/Image) | ImageData)** URL, Image, or ImageData of input image to process
    -   `opts.output` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [HTMLCanvasElement](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement))?** Selector or DOM Element of HTMLCanvas to draw results
    -   `opts.numSteps` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** Number of steps to process [1, 1000] (optional, default `200`)
    -   `opts.minEnergy` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?** Minimum energy to stop processing early [0, 1]
    -   `opts.shapeAlpha` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** Alpha opacity of shapes [0, 255] (optional, default `128`)
    -   `opts.shapeType` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Type of shapes to use (optional, default `traingle`)
    -   `opts.numCandidates` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** Number of top-level candidates per step [1, 32] (optional, default `1`)
    -   `opts.numCandidateShapes` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** Number of random candidate shapes per step [10, 1000] (optional, default `50`)
    -   `opts.numCandidateMutations` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** Number of candidate mutations per step [10, 500] (optional, default `100`)
    -   `opts.numCandidateExtras` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** Number of extra candidate shapes per step [0, 16] (optional, default `0`)
    -   `opts.onStep` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)?** Optional async function taking in the model and step index
    -   `opts.log` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** Optional logging function (console.log to enable logging) (optional, default `noop`)

## Related

There are several other ports of the primitive algorithm, including at least two JavaScript ports that I'm aware of. This module isn't necessarily better; I created it out of pure fascination.

-   [primitive-cli](https://github.com/transitive-bullshit/primitive-cli) - CLI for this module.
-   [primitive](https://github.com/fogleman/primitive) - Original Go version by [Michael Fogleman](https://www.michaelfogleman.com/).
-   [primitive.js](https://github.com/ondras/primitive.js) - JavaScript (browser) port by [Ondřej Žára](https://github.com/ondras).
-   [geometrize](http://www.geometrize.co.uk/) - Haxe and C++ ports by [Sam Twidale](https://samcodes.co.uk/).
-   [node-primitive](https://github.com/vincentdesmares/node-primitive) - Node.js port by [Vincent Desmares](https://github.com/vincentdesmares).
-   [sqip](https://github.com/technopagan/sqip) - An SVG-based LQIP library built on top of the [original primitive](https://github.com/fogleman/primitive).

## Examples

![alekzan-powell](https://storage.googleapis.com/transitive-bullshit-primitive/alekzan-powell-408990-unsplash-triangle-500.png "500 triangles")

![atikh-bana](https://storage.googleapis.com/transitive-bullshit-primitive/atikh-bana-125761-unsplash-rotated-ellipse-500.png "500 rotated ellipses")

![caleb-woods](https://storage.googleapis.com/transitive-bullshit-primitive/caleb-woods-248879-unsplash-triangle-500.png "500 triangles")

![glauco-zuccaccia](https://storage.googleapis.com/transitive-bullshit-primitive/glauco-zuccaccia-132831-unsplash-rotated-ellipse-500.png "500 rotated ellipses")

![jessica-weiller](https://storage.googleapis.com/transitive-bullshit-primitive/jessica-weiller-60884-unsplash-triangle-500.png "500 triangles")

![nicolas-picard](https://storage.googleapis.com/transitive-bullshit-primitive/nicolas-picard-450042-unsplash-random-500.png "500 random shapes")

![stefanus-martanto](https://storage.googleapis.com/transitive-bullshit-primitive/stefanus-martanto-setyo-husodo-14699-unsplash-random-500.png "500 random shapes")

![timothy-paul-smith](https://storage.googleapis.com/transitive-bullshit-primitive/timothy-paul-smith-405497-unsplash-rotated-rectangle-500.png "500 rectangles")

![umanoide](https://storage.googleapis.com/transitive-bullshit-primitive/umanoide-112489-unsplash-rotated-ellipse-500.png "500 ellipses")

## License

MIT © [Travis Fischer](https://github.com/transitive-bullshit)

All images are provided by [Unsplash](https://unsplash.com/) via a [CC0](https://creativecommons.org/publicdomain/zero/1.0/) license.
