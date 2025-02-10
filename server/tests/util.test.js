import { describe, expect, test } from "@jest/globals";
import { calculateIrrelevantDistribution } from "../utils";

const mockProjects = [
  { distribution_weight: 0.25 },
  { distribution_weight: 0.4 },
];

describe("utils", () => {
  test("calculateIrrelevantDistribution should calculate the ", () => {
    expect(calculateIrrelevantDistribution(mockProjects)).toEqual(0.35);
  });
});
