(function (root) {
	function pow(x, n) {
		return x ** n;
	}

	function modulo(a, b) {
		return a % b;
	}

	var calculator = {
		pow,
		modulo,
	};

	if (typeof module !== "undefined" && module.exports) {
		module.exports = calculator;
	}

	if (root) {
		root.AdvancedCalculator = calculator;
	}
})(typeof window !== "undefined" ? window : globalThis);
