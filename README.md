# Ramda Matrices
Ramda-based library for working with matrices in JavaScript

## Documentation
Documentation is located in `src/index.ts`

## Features
* Strongly-typed (TypeScript)
* Purely functional
* Every function is curried
* Tiny bundle size
* Support for most common mathematical functions and utilities:
  - parse a matrix from a string (`parse`)
  - add/subtract two matrices (`sum`, `diff`)
  - transpose (`transpose`)
  - multiply matrix by a scalar/vector/matrix(`matrixByScalar`,
    `matrixByVector`, `matrixByMatrix`)
  - compare matrices (`equal`, `isIdentity`)
  - generating matrices (`identity`, `traverse`, `fill`)
  
NOTE: you can print any matrix by calling `console.table`:
```js
const A = parse`
   1 2/3 3
  -1 2   3
`;
console.table(A);
  
```

## Changelog

Status indicators:
* (`b`) signifies a breaking change
* (`i`) signifies change of behaviour for existing functions

### 1.1.0
* Make `parse` support floating-point numbers and fractions (`i`)
* Improve documentation
* Make function names more consistent (`b`)
* Remove `rotate` function ** (`b`)

### 1.0.4
* Initial release