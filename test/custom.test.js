const custom = require("../src/custom");

describe("Custom Calculator Unit Tests", () => {
	describe("Compound Interest Calculator", () => {
		test("calculates future value and interest for monthly compounding", () => {
			const result = custom.calculateCompoundInterest(10000, 7, 10, 12);

			expect(result.futureValue).toBeCloseTo(20096.6138, 4);
			expect(result.interest).toBeCloseTo(10096.6138, 4);
			expect(result.totalPeriods).toBe(120);
			expect(result.periodRatePercent).toBeCloseTo(0.583333, 6);
		});

		test("handles zero years as a boundary input", () => {
			const result = custom.calculateCompoundInterest(5000, 8, 0, 12);

			expect(result.futureValue).toBeCloseTo(5000, 6);
			expect(result.interest).toBeCloseTo(0, 6);
			expect(result.totalPeriods).toBe(0);
		});
	});

	describe("Loan Calculator", () => {
		test("calculates monthly payment, total payment, and total interest", () => {
			const result = custom.calculateLoan(250000, 6.5, 30);

			expect(result.monthlyPayment).toBeCloseTo(1580.1701, 4);
			expect(result.totalPayment).toBeCloseTo(568861.2211, 4);
			expect(result.totalInterest).toBeCloseTo(318861.2211, 4);
			expect(result.totalPayments).toBe(360);
		});

		test("handles zero interest as a boundary input", () => {
			const result = custom.calculateLoan(12000, 0, 2);

			expect(result.monthlyPayment).toBe(500);
			expect(result.totalPayment).toBe(12000);
			expect(result.totalInterest).toBe(0);
			expect(result.totalPayments).toBe(24);
		});
	});

	describe("Electricity Bill Calculator", () => {
		test("calculates a tiered electricity bill", () => {
			const result = custom.calculateElectricityBill(420, 0.12, 0.16, 0.22, 8, 5);

			expect(result.firstUnits).toBe(100);
			expect(result.secondUnits).toBe(200);
			expect(result.thirdUnits).toBe(120);
			expect(result.energyCharge).toBeCloseTo(70.4, 6);
			expect(result.taxAmount).toBeCloseTo(3.52, 6);
			expect(result.totalBill).toBeCloseTo(81.92, 6);
			expect(result.blockRemainder).toBe(20);
		});

		test("handles usage inside the first tier as a boundary input", () => {
			const result = custom.calculateElectricityBill(80, 0.12, 0.16, 0.22, 8, 5);

			expect(result.firstUnits).toBe(80);
			expect(result.secondUnits).toBe(0);
			expect(result.thirdUnits).toBe(0);
			expect(result.energyCharge).toBeCloseTo(9.6, 6);
			expect(result.totalBill).toBeCloseTo(18.08, 6);
			expect(result.blockRemainder).toBe(80);
		});
	});
});

describe("Custom Calculator Invalid Input Handling", () => {
	test("rejects invalid compound interest inputs", () => {
		expect(() => custom.calculateCompoundInterest(-1, 7, 10, 12)).toThrow("principal");
		expect(() => custom.calculateCompoundInterest(1000, 7, 10, 0)).toThrow("compounds");
		expect(() => custom.calculateCompoundInterest(1000, Number.NaN, 10, 12)).toThrow("ratePercent");
	});

	test("rejects invalid loan inputs", () => {
		expect(() => custom.calculateLoan(-1000, 6, 5)).toThrow("amount");
		expect(() => custom.calculateLoan(1000, -6, 5)).toThrow("ratePercent");
		expect(() => custom.calculateLoan(1000, 6, 0)).toThrow("years");
	});

	test("rejects invalid electricity bill inputs", () => {
		expect(() => custom.calculateElectricityBill(-1, 0.12, 0.16, 0.22, 8, 5)).toThrow("units");
		expect(() => custom.calculateElectricityBill(100, -0.12, 0.16, 0.22, 8, 5)).toThrow("firstRate");
		expect(() => custom.calculateElectricityBill(100, 0.12, 0.16, 0.22, 8, Number.NaN)).toThrow("taxPercent");
	});
});

describe("Custom Calculator Integration Tests With Stubs", () => {
	afterEach(() => {
		jest.resetModules();
		jest.dontMock("../src/basic");
		jest.dontMock("../src/advanced");
	});

	function createBasicStub() {
		return {
			add: jest.fn((a, b) => a + b),
			subtract: jest.fn((a, b) => a - b),
			multiply: jest.fn((a, b) => a * b),
			divide: jest.fn((a, b) => a / b),
		};
	}

	function createAdvancedStub() {
		return {
			pow: jest.fn((x, n) => x ** n),
			modulo: jest.fn((a, b) => a % b),
		};
	}

	test("uses Basic and Advanced stubs while calculating compound interest", () => {
		jest.resetModules();
		const basicStub = createBasicStub();
		const advancedStub = createAdvancedStub();
		jest.doMock("../src/basic", () => basicStub);
		jest.doMock("../src/advanced", () => advancedStub);

		const customWithStubs = require("../src/custom");
		const result = customWithStubs.calculateCompoundInterest(1000, 10, 2, 1);

		expect(result.futureValue).toBeCloseTo(1210, 6);
		expect(basicStub.divide).toHaveBeenCalledWith(10, 100);
		expect(basicStub.add).toHaveBeenCalledWith(1, 0.1);
		expect(basicStub.multiply).toHaveBeenCalledWith(1, 2);
		expect(advancedStub.pow).toHaveBeenCalledWith(1.1, 2);
	});

	test("uses Advanced modulo stub while calculating electricity block remainder", () => {
		jest.resetModules();
		const basicStub = createBasicStub();
		const advancedStub = createAdvancedStub();
		jest.doMock("../src/basic", () => basicStub);
		jest.doMock("../src/advanced", () => advancedStub);

		const customWithStubs = require("../src/custom");
		const result = customWithStubs.calculateElectricityBill(420, 0.12, 0.16, 0.22, 8, 5);

		expect(result.totalBill).toBeCloseTo(81.92, 6);
		expect(basicStub.subtract).toHaveBeenCalledWith(420, 100);
		expect(basicStub.multiply).toHaveBeenCalledWith(120, 0.22);
		expect(advancedStub.modulo).toHaveBeenCalledWith(420, 100);
		expect(result.blockRemainder).toBe(20);
	});
});
