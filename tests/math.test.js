const {
  add,
  subtract,
  calculateDiscount,
  multiply,
} = require("../src/math.js");

describe("Math utilities", () => {
  test("add two numbers", () => {
    expect(add(2, 4)).toBe(6);
  });

  test("subtract two numbers", () => {
    expect(subtract(5, 3)).toBe(2);
  });

  test("calculate discount properly", () => {
    expect(calculateDiscount(2000, 10)).toBe(1800);
  });

  test("reject invalid discounts", () => {
    expect(() => calculateDiscount(1200, -4)).toThrow(
      "Invalid price or discount",
    );
  });

  test("multiply two numbers", () => {
    expect(multiply(5, 10)).toBe(50);
  });
});
