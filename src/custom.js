(function (root, factory) {
	if (typeof module !== "undefined" && module.exports) {
		module.exports = factory(require("./basic"), require("./advanced"));
		return;
	}

	root.CustomCalculators = factory(root.BasicCalculator, root.AdvancedCalculator);
})(typeof window !== "undefined" ? window : globalThis, function (basic, advanced) {
	function calculateCompoundInterest(principal, ratePercent, years, compounds) {
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

	function calculateLoan(amount, ratePercent, years) {
		var monthlyRate = basic.divide(basic.divide(ratePercent, 100), 12);
		var totalPayments = basic.multiply(years, 12);
		var monthlyPayment;

		if (monthlyRate === 0) {
			monthlyPayment = basic.divide(amount, totalPayments);
		} else {
			var growthFactor = advanced.pow(basic.add(1, monthlyRate), totalPayments);
			var numerator = basic.multiply(basic.multiply(amount, monthlyRate), growthFactor);
			var denominator = basic.subtract(growthFactor, 1);
			monthlyPayment = basic.divide(numerator, denominator);
		}

		var totalPayment = basic.multiply(monthlyPayment, totalPayments);
		var totalInterest = basic.subtract(totalPayment, amount);

		return {
			monthlyPayment: monthlyPayment,
			totalPayment: totalPayment,
			totalInterest: totalInterest,
			totalPayments: totalPayments,
		};
	}

	function calculateElectricityBill(units, firstRate, secondRate, thirdRate, fixedCharge, taxPercent) {
		var firstUnits = Math.min(units, 100);
		var secondUnits = Math.min(Math.max(basic.subtract(units, 100), 0), 200);
		var thirdUnits = Math.max(basic.subtract(units, 300), 0);
		var firstCharge = basic.multiply(firstUnits, firstRate);
		var secondCharge = basic.multiply(secondUnits, secondRate);
		var thirdCharge = basic.multiply(thirdUnits, thirdRate);
		var energyCharge = basic.add(basic.add(firstCharge, secondCharge), thirdCharge);
		var taxAmount = basic.multiply(energyCharge, basic.divide(taxPercent, 100));
		var totalBill = basic.add(basic.add(energyCharge, fixedCharge), taxAmount);

		return {
			firstUnits: firstUnits,
			secondUnits: secondUnits,
			thirdUnits: thirdUnits,
			energyCharge: energyCharge,
			taxAmount: taxAmount,
			totalBill: totalBill,
			blockRemainder: advanced.modulo(units, 100),
		};
	}

	function bindBrowser() {
		if (typeof document === "undefined") {
			return;
		}

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

		function bindForm(formId, calculate) {
			var form = document.getElementById(formId);
			if (!form) {
				return;
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

		bindForm("compound-form", function () {
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
		});

		bindForm("loan-form", function () {
			var result = calculateLoan(
				numberFrom("loan-amount"),
				numberFrom("loan-rate"),
				numberFrom("loan-years")
			);

			writeResult("loan-payment", result.monthlyPayment, formatCurrency);
			writeResult("loan-total", result.totalPayment, formatCurrency);
			writeResult("loan-interest", result.totalInterest, formatCurrency);
			writeResult("loan-payments", result.totalPayments, formatNumber);
		});

		bindForm("electricity-form", function () {
			var result = calculateElectricityBill(
				numberFrom("electricity-units"),
				numberFrom("electricity-rate-1"),
				numberFrom("electricity-rate-2"),
				numberFrom("electricity-rate-3"),
				numberFrom("electricity-fixed"),
				numberFrom("electricity-tax")
			);

			writeResult("electricity-total", result.totalBill, formatCurrency);
			writeResult("electricity-energy", result.energyCharge, formatCurrency);
			writeResult("electricity-tax-amount", result.taxAmount, formatCurrency);
			writeResult("electricity-remainder", result.blockRemainder, function (value) {
				return formatNumber(value) + " kWh";
			});
		});
	}

	var api = {
		calculateCompoundInterest: calculateCompoundInterest,
		calculateLoan: calculateLoan,
		calculateElectricityBill: calculateElectricityBill,
	};

	if (typeof window !== "undefined") {
		bindBrowser();
	}

	return api;
});
