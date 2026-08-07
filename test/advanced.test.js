const calculator = require("../src/advanced");

describe("Pow", () => {
	var BVAdata = [
		[2, 0, 1],
		[2, 1, 2],
		[3, 2, 9],
		[5, 3, 125],
	];

	describe.each(BVAdata)("BVA: pow(%i, %i), Expected: %f", (x, n, expected) => {
		test(`returns ${calculator.pow(x, n)}`, () => {
			expect(calculator.pow(x, n)).toBe(expected);
		});
	});

	var DTdata = [
		[1, 10, 1],
		[-2, 3, -8],
		[4, -1, 0.25],
		[-3, 2, 9],
	];

	describe.each(DTdata)("DT: pow(%i, %i), Expected: %f", (x, n, expected) => {
		test(`returns ${calculator.pow(x, n)}`, () => {
			expect(calculator.pow(x, n)).toBe(expected);
		});
	});
});

describe("Modulo", () => {
	var BVAdata = [
		[10, 3, 1],
		[8, 2, 0],
		[0, 7, 0],
		[-9, 4, -1],
	];

	describe.each(BVAdata)("BVA: modulo(%i, %i), Expected: %i", (a, b, expected) => {
		test(`returns ${calculator.modulo(a, b)}`, () => {
			expect(calculator.modulo(a, b)).toBe(expected);
		});
	});

	var DTdata = [
		[89, 10, 9],
		[-17, -5, -2],
		[65, -12, 5],
		[-78, 24, -6],
	];

	describe.each(DTdata)("DT: modulo(%i, %i), Expected: %i", (a, b, expected) => {
		test(`returns ${calculator.modulo(a, b)}`, () => {
			expect(calculator.modulo(a, b)).toBe(expected);
		});
	});
});

