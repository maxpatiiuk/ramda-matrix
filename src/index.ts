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
 *   1 2 3
 *  -1 2 3
 * `;
 * [[1,2,3],[-1,2,3]]
 */
export const parse = R.compose(
	R.map(
		R.compose(
			R.map(parseInt),
			R.split(' '),
			// strip odd characters
			R.replace(/[^\d. -]/g, ''),
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
export const diff = R.curry(
	(
		matrix: number[][],
		matrix2: number[][],
	): number[][] =>
		sum(matrix, prod(-1, matrix2)),
);


/*
 * Multiply matrix by a number
 *
 * prod(2, [[1,2]]);
 * [[2,4]]
 */
export const prod = R.curry(
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
export const col = R.curry(
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
 * Turn a single column matrix into a 1d array
 *
 * rotate([[1],[2],[3]])
 * [1,2,3]
 */
export const rotate = R.map(R.head);


/*
 * Get product of multiplying a matrix by a col
 *
 * colProd([1,2],[[1,2],[3,4]])
 * [5, 11]
 */
export const colProd = R.curry(
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
 * transpose([[1,2],[3,4]])
 * [[1,3],[2,4]]
 */
export const transpose = R.transpose;


/*
 * Multiply two matrices
 *
 * multiply([[1,2],[2,1]], [[0,1],[1,0])
 * [[1,2],[2,1]]
 */
export const multiply = R.curry(
	(
		matrix2: number[][],
		matrix: number[][],
	) => R.transpose(
		R.map(
			(column) =>
				colProd(column)(matrix),
			R.transpose(matrix2),
		),
	),
);


/*
 * Get determinant of a 2x2 matrix
 *
 * det([[1,2],[2,1]])
 * -3
 */
export const det = R.curry((matrix: number[][]) =>
	matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0],
);


/*
 * Get adjudicate of a 2x2 matrix
 * adj([[1,2],[2,1]])
 * [[1,-2],[-2,1]]
 */
export const adj = R.curry((matrix: number[][]) => [
	[matrix[1][1], -1 * matrix[0][1]],
	[-1 * matrix[1][0], matrix[0][0]],
]);


/*
 * Get an inverse of a 2x2 matrix
 *
 * inverse([[1,2],[2,1]])
 * [[-3,6],[6,-3]]
 */
export const inverse = R.curry((matrix: number[][]): number[][] =>
	prod(
		det(matrix),
		adj(matrix),
	),
);


/*
 * Check if two matrices are equal
 *
 * eq([[1]],[[2]])
 * false
 */
export const eq = R.curry(
	(
		matrix: number[][],
		matrix2: number[][],
	): boolean =>
		JSON.stringify(matrix) === JSON.stringify(matrix2),
);


/*
 * Split array into a matrix of specified col length
 *
 * array2matrix(2, [1,2,3,4])
 * [[1,2],[3,4]]
 */
export const array2matrix = R.curry(
	(
		cols: number,
		arr: number[],
	): number[][] => R.addIndex(R.map)(
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
 * Create a {rows, cols} matrix with each cell consisting of value
 */
export const fill = R.curry(
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
 * equal(1, [[1,1],[1,1]])
 * true
 */
export const equal = R.curry(
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
 * Generate matrices of size: {rows, cols}, with each cell in
 * range: {min, max} and call `callback` with each matrix
 */
export const traverse = R.curry(
	(
		range: Range,
		size: Dimensions,
		callback: (matrix: number[][]) => unknown,
		inlineMatrix: number[] = [],
	): void => void (
		inlineMatrix.length === size.rows * size.cols ?
			callback(array2matrix(size.rows, inlineMatrix)) :
			R.addIndex(R.map)(
				(_, index) =>
					traverse(
						range,
						size,
						callback,
						[...inlineMatrix, range.min + index],
					),
				Array(range.max - range.min),
			)
	),
);
