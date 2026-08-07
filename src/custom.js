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

	function formatCurrency(value) {
		if (!Number.isFinite(value)) {
			return "Invalid";
		}

		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			maximumFractionDigits: 2,
		}).format(value);
	}

	function writeResult(id, value, formatter) {
		var element = document.getElementById(id);
		element.textContent = formatter(value);
		element.classList.toggle("error", !Number.isFinite(value));
	}

	function calculateCompoundInterest(principal, ratePercent, years, compounds) {
		var basic = window.BasicCalculator;
		var advanced = window.AdvancedCalculator;
		var annualRate = basic.divide(ratePercent, 100);
		var periodRate = basic.divide(annualRate, compounds);
		var growthBase = basic.add(1, periodRate);
		var totalPeriods = basic.multiply(compounds, years);
		var growthFactor = advanced.pow(growthBase, totalPeriods);
		var futureValue = basic.multiply(principal, growthFactor);
		var interest = basic.subtract(futureValue, principal);

		return {
			futureValue: futureValue,
			interest: interest,
			totalPeriods: totalPeriods,
			periodRatePercent: basic.multiply(periodRate, 100),
		};
	}

	function bindCompoundCalculator() {
		var form = document.getElementById("compound-form");
		if (!form || !window.BasicCalculator || !window.AdvancedCalculator) {
			return;
		}

		function calculate() {
			var result = calculateCompoundInterest(
				numberFrom("principal"),
				numberFrom("annual-rate"),
				numberFrom("years"),
				numberFrom("compounds")
			);

			writeResult("compound-result", result.futureValue, formatCurrency);
			writeResult("compound-interest", result.interest, formatCurrency);
			writeResult("compound-periods", result.totalPeriods, formatNumber);
			writeResult("compound-period-rate", result.periodRatePercent, function (value) {
				return formatNumber(value) + "%";
			});
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

	bindCompoundCalculator();
})();
