(function (root) {
	function add(a, b) {
		return a + b;
	}

	function subtract(a, b) {
		return a - b;
	}

	function multiply(a, b) {
		return a * b;
	}

	function divide(a, b) {
		return a / b;
	}

	var calculator = {
		add,
		subtract,
		multiply,
		divide,
	};

	if (typeof module !== "undefined" && module.exports) {
		module.exports = calculator;
	}

	if (root) {
		root.BasicCalculator = calculator;
	}
})(typeof window !== "undefined" ? window : globalThis);
