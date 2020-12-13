export function rand(min: number, max: number) {
	return Math.round(Math.random() * (max - min) + min);
}

export function getProb() {
	return Math.random();
}
