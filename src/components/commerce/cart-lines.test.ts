import { describe, expect, it } from "vitest";

/**
 * Mirrors the quantity stepper submit values in cart-lines.tsx.
 * Kept in tests so we can lock the BRK-16 contract without a DOM harness.
 */
function productionStepperSubmitValues(quantity: number) {
  return {
    minusButtonValue: quantity + 1,
    plusButtonValue: quantity - 1,
  };
}

function expectedStepperSubmitValues(quantity: number) {
  return {
    minusButtonValue: quantity - 1,
    plusButtonValue: quantity + 1,
  };
}

describe("cart quantity stepper submit values", () => {
  it("documents current production wiring for a mid-range quantity", () => {
    expect(productionStepperSubmitValues(3)).toEqual({
      minusButtonValue: 4,
      plusButtonValue: 2,
    });
  });

  // BRK-16: minus/plus buttons swap their submit values in cart-lines.tsx.
  it.fails("minus decrements and plus increments quantity (BRK-16)", () => {
    expect(productionStepperSubmitValues(3)).toEqual(
      expectedStepperSubmitValues(3),
    );
  });
});
