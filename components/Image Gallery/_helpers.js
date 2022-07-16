export const pow2abs = (a, b) => {
	return Math.pow(Math.abs(a - b), 2);
};
export const getDistance = (touches) => {
	const [a, b] = touches;

	if (a == null || b == null) {
		return 0;
	}
	return Math.sqrt(pow2abs(a.pageX, b.pageX) + pow2abs(a.pageY, b.pageY));
};

export const getScale = (currentDistance, initialDistance) => {
	return (currentDistance / initialDistance) * 1.2;
};
