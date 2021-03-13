import R from 'ramda';


export interface Dimensions {
  rows: number,
  cols: number
}


export interface Range {
  min: number,
  max: number
}


/*
 * Turn string into a matrix
 *
 * parse`
 *   1 2/3 3
 *  -1 2   3
 * `;
 * [[1,0.66666667,3],[-1,2,3]]
 */
export const parse = R.compose(
  R.map(
    R.compose(
      R.map(
        R.ifElse(
          (cell) => R.equals(
            -1,
            R.indexOf(
              '/',
              cell,
            ),
          ),
          parseFloat,
          R.compose(
            R.apply(R.divide),
            R.slice(1, 3),
            R.match(/([-.\d]+)\/([-.\d]+)/),
          ),
        ),
      ),
      R.split(' '),
      // strip odd characters
      R.replace(/[^\d/. -]/g, ''),
      // remove extra whitespace
      R.replace(/\s+/g, ' '),
    ),
  ),
  R.split('\n'),
  R.trim,
  R.head,
);


/*
 * Zip cells of two matrices
 *
 * zip([[1,2],[3,4]], [[-1,-2],[-3,-4]]);
 * [[[1,-1],[2,-2]],[[3,-3],[4,-4]]]
 */
export const zip = R.zipWith<number[], number[], number[][]>(R.zip);


/*
 * Sum two matrices
 *
 * sum([[1,2]],[[3,4]]);
 * [[4,6]]
 * */
export const sum = R.compose(
  R.map(
    R.map(R.sum),
  ),
  zip,
);


/*
 * Subtract two matrices
 *
 * diff([[1,2]],[[3,4]]);
 * [[-2,-2]]
 * */
export const diff = R.curryN(
  2,
  (
    matrix: number[][],
    matrix2: number[][],
  ): number[][] =>
    sum(matrix, matrixByScalar(-1, matrix2)),
);


/*
 * Multiply matrix by a number
 *
 * matrixByScalar(2, [[1,2]]);
 * [[2,4]]
 */
export const matrixByScalar = R.curryN(
  2,
  (
    value: number,
    matrix: number[][],
  ) =>
    R.map(
      R.map(
        R.multiply(value),
      ),
      matrix,
    ),
);


/*
 * Get a single column from a matrix
 *
 * col(1,[[1,2],[3,4]]);
 * [1, 3]
 */
export const col = R.curryN(
  2,
  (
    col: number,
    matrix: number[][],
  ): number[] =>
    R.view(
      R.lensIndex(col),
      R.transpose(matrix),
    ),
);


/*
 * Get product of multiplying a matrix by a col
 *
 * matrixByVector([1,2],[[1,2],[3,4]]);
 * [5, 11]
 */
export const matrixByVector = R.curryN(
  2,
  (
    col: number[],
    matrix: number[][],
  ) =>
    R.map((column) =>
        R.sum(
          R.addIndex<number, number>(R.map)(
            (value, index) =>
              R.multiply(value, col[index]),
            column,
          ),
        ),
      matrix,
    ),
);


/*
 * Transpose a matrix
 *
 * transpose([[1,2],[3,4]]);
 * [[1,3],[2,4]]
 */
export const transpose = R.transpose;


/*
 * Multiply two matrices.
 * NOTE: second matrix is going to be multiplied by the first
 *
 * matrixByMatrix([[1,2],[2,1]], [[0,1],[1,0]);
 * [[1,2],[2,1]]
 */
export const matrixByMatrix = R.curryN(
  2,
  (
    matrix2: number[][],
    matrix: number[][],
  ) => R.transpose(
    R.map(
      (column) =>
        matrixByVector(column)(matrix),
      R.transpose(matrix2),
    ),
  ),
);


/*
 * Get determinant of a 2x2 matrix
 *
 * det([[1,2],[2,1]]);
 * -3
 */
export const det = R.curryN(
  1,
  (matrix: number[][]) =>
    matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0],
);


/*
 * Get adjudicate of a 2x2 matrix
 * adj([[1,2],[2,1]]);
 * [[1,-2],[-2,1]]
 */
export const adj = R.curryN(
  1,
  (matrix: number[][]) => [
    [matrix[1][1], -1 * matrix[0][1]],
    [-1 * matrix[1][0], matrix[0][0]],
  ],
);


/*
 * Get an inverse of a 2x2 matrix
 *
 * inverse([[1,2],[2,1]]);
 * [[-3,6],[6,-3]]
 */
export const inverse = R.curryN(
  1,
  (matrix: number[][]): number[][] =>
    matrixByScalar(
      det(matrix),
      adj(matrix),
    ),
);


/*
 * Check if two matrices are identical
 *
 * areIdentical([[1]],[[2]]);
 * false
 */
export const areIdentical = R.curryN(
  2,
  (
    matrix: number[][],
    matrix2: number[][],
  ): boolean =>
    R.eqBy(JSON.stringify, matrix, matrix2),
);


/*
 * Split array into a matrix of specified col length
 *
 * array2matrix(2, [1,2,3,4]);
 * [[1,2],[3,4]]
 */
export const array2matrix = R.curryN(
  2,
  (
    cols: number,
    arr: number[],
  ): number[][] => R.addIndex<number, number[]>(R.map)(
    (_, i) =>
      arr.slice(i * cols, i * cols + cols),
    Array(
      Math.ceil(
        R.divide(R.length(arr), cols),
      ),
    ),
  ),
);


/*
 * Create a {rows, cols} matrix where each cell is equal to value
 *
 * fill({rows: 2, cols: 2}, 2);
 * [[2,2],[2,2]]
 */
export const fill = R.curryN(
  2,
  (
    size: Dimensions,
    value: number,
  ): number[][] =>
    Array<number[]>(size.rows).fill(
      Array<number>(size.cols).fill(value),
    ),
);


/*
 * Check if each cell in a matrix is equal to a certain value
 *
 * equal(1, [[1,1],[1,1]]);
 * true
 */
export const equal = R.curryN(
  2,
  (
    value: number,
    matrix: number[][],
  ): boolean =>
    R.all(
      R.all(
        R.equals(value),
      ),
      matrix,
    ),
);

/*
* Check if a matrix is an identity matrix
*
* isIdentity([[1,0],[0,1]]);
* true
* */
export const isIdentity = R.curryN(
  1,
  (matrix: number[][]) =>
    matrix.every((row, rowIndex) =>
      row.every((cell, cellIndex) =>
        cell === Number(cellIndex === rowIndex),
      ),
    ),
);

/*
* Create a {rows, cols} identity matrix
*
* identity({rows: 2, cols: 2});
* [[1,0],[0,1]]
* */
export const identity = R.curryN(
  1,
  (size: Dimensions):(0|1)[] =>
    R.addIndex<0, (0|1)[]>(R.map)(
      (_, rowIndex, array) =>
        R.set<(0|1)[], (0|1)>(
          R.lensIndex(rowIndex),
          1,
          array as 0[],
        ),
      Array(size.rows).fill(0),
    )
);


/*
 * Generate matrices of size: {rows, cols}, with each cell in
 * range: {min, max (excluding)} and call `callback` with each matrix
 *
 * traverse({min: 0, max: 1}, {rows: 1, cols: 2}, console.log);
 */
export const traverse = R.curryN(
  3,
  (
    range: Range,
    size: Dimensions,
    callback: (matrix: number[][]) => void,
  ) =>
    traverseRecursive(range, size, callback, []),
);

const traverseRecursive = (
  range: Range,
  size: Dimensions,
  callback: (matrix: number[][]) => void,
  inlineMatrix: number[],
): void => void (
  inlineMatrix.length === size.rows * size.cols ?
    callback(array2matrix(size.rows, inlineMatrix)) :
    R.addIndex<undefined, void>(R.map)(
      (_, index) =>
        traverseRecursive(
          range,
          size,
          callback,
          [...inlineMatrix, range.min + index],
        ),
      Array(range.max - range.min),
    )
);
