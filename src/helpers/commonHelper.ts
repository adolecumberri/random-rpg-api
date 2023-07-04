export function rand(min: number = 0, max: number = 100) {
	return Math.round(Math.random() * (max - min) + min);
}

export function getProb() {
	return Math.random();
}
