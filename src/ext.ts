interface Array<T> {
	src(): string;
}

Array.prototype.src = function () {
	const extensions = ['json', 'js', 'ts'];

	const hasExtension = (str: string): boolean =>
		extensions.includes(str.split('.')[1]);

	const isFlag = (str: string): boolean =>
		str.charAt(0) === '-';

	const source =
		this.filter(arg => hasExtension(arg) && !isFlag(arg));

	return source[0];
};
