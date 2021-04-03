# Ramda Matrices
Ramda-based library for working with matrices in JavaScript

# How to use
Install this package:
```bash
npm i ramda-matrix
```

Import the library into your script:
```js
import * as M from 'ramda-matrix';
```

Start hacking!
```js
const A = M.parse`
   1 2/3 3
  -1 2   3
`;

console.table(M.matrixByMatrix(A,A));
```

## Documentation
Documentation is located in `src/index.ts`

## Features
* Strongly-typed (TypeScript)
* Purely functional
* Every function is curried
* Tiny bundle size
* Support for most common linear algebra functions and utilities:
  - parse a matrix from a string (`parse`)
  - add/subtract two matrices (`sum`, `diff`)
  - transpose (`transpose`)
  - multiply matrix by a scalar/vector/matrix(`matrixByScalar`,
    `matrixByVector`, `matrixByMatrix`)
  - compare matrices (`equal`, `isIdentity`)
  - generating matrices (`identity`, `traverse`, `fill`)
  
NOTE: you can print any matrix by calling `console.table`:
```js
console.table(A);
```

NOTE: JavaScript is infamous for floating point rounding errors.
Most of them can be metigated by rounding each cell, like this:
```js
parseInt(cell.toFixed("3"))
```

## Changelog

Status indicators:
* (`b`) signifies a breaking change
* (`i`) signifies change of behaviour for existing functions

### 1.1.2 [Hot-Fix]
* Fix a bug with `parse` returning NaN when line contains whitespaces
  at the beginning (`i`)

### 1.1.1
* Add a `markowChain` function
* Add a `rotationMatrix` function
* Improve documentation

### 1.1.0
* Make `parse` support floating-point numbers and fractions (`i`)
* Improve documentation
* Make function names more consistent (`b`)
* Remove `rotate` function (`b`)

### 1.0.4
* Initial release

## TODO
* Add functions for elementary matrix operations
* Make `det` work with any matrix
* Add a `rref` function
* Add an `inverse` function
* Add a `rotate` function
* Add a `reflect` function?
* Make `identity` accept single argument
