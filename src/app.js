(function () {
	function numberFrom(id) {
		return Number(document.getElementById(id).value);
	}

	function formatNumber(value) {
		if (!Number.isFinite(value)) {
			return "Invalid";
		}

		return new Intl.NumberFormat("en-US", {
			maximumFractionDigits: 8,
		}).format(value);
	}

	function writeResult(id, value) {
		var element = document.getElementById(id);
		element.textContent = formatNumber(value);
		element.classList.toggle("error", !Number.isFinite(value));
	}

	function bindBasicCalculator() {
		var form = document.getElementById("basic-form");
		if (!form || !window.BasicCalculator) {
			return;
		}

		function calculate() {
			var operation = document.getElementById("basic-operation").value;
			var result = window.BasicCalculator[operation](numberFrom("basic-a"), numberFrom("basic-b"));
			writeResult("basic-result", result);
		}

		form.addEventListener("submit", function (event) {
			event.preventDefault();
			calculate();
		});
		form.addEventListener("reset", function () {
			setTimeout(calculate, 0);
		});
		calculate();
	}

	function bindAdvancedCalculator() {
		var form = document.getElementById("advanced-form");
		if (!form || !window.AdvancedCalculator) {
			return;
		}

		function calculate() {
			var operation = document.getElementById("advanced-operation").value;
			var result = window.AdvancedCalculator[operation](numberFrom("advanced-a"), numberFrom("advanced-b"));
			writeResult("advanced-result", result);
		}

		form.addEventListener("submit", function (event) {
			event.preventDefault();
			calculate();
		});
		form.addEventListener("reset", function () {
			setTimeout(calculate, 0);
		});
		calculate();
	}

	bindBasicCalculator();
	bindAdvancedCalculator();
})();
