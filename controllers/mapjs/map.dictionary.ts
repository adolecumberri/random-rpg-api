import { connection } from '../../config/database';

const CIUDADES = [
	{ id: 1, name: 'albacete', connections: [7, 9, 11, 16] },
	{ id: 2, name: 'almería', connections: [10, 11] },
	{ id: 3, name: 'asturias', connections: [6, 12, 14] },
	{ id: 4, name: 'badajoz', connections: [7, 8, 13] },
	{ id: 5, name: 'barcelona', connections: [15, 16, 17] },
	{ id: 6, name: 'bilbao', connections: [3, 12, 17] },
	{ id: 7, name: 'ciudad real', connections: [1, 4, 9, 10] },
	{ id: 8, name: 'huelva', connections: [4, 10] },
	{ id: 9, name: 'madrid', connections: [1, 7, 12, 15] },
	{ id: 10, name: 'malaga', connections: [2, 7, 8] },
	{ id: 11, name: 'murcia', connections: [1, 2, 16] },
	{ id: 12, name: 'palencia', connections: [3, 6, 9, 13] },
	{ id: 13, name: 'salamanca', connections: [4, 12, 14] },
	{ id: 14, name: 'santiago de compostela', connections: [3, 13] },
	{ id: 15, name: 'soria', connections: [5, 9, 16, 17] },
	{ id: 16, name: 'valencia', connections: [1, 5, 11, 15] },
	{ id: 17, name: 'zaragoza', connections: [5, 6, 15] },
];

export { CIUDADES };
