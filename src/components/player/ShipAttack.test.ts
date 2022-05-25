import { createShipAttackModule } from "./ShipAttack";

jest.mock("./Laser", () => {
  return {
    default: {},
  };
});

jest.mock("lodash/throttle", () => {
  return {
    throttle: jest.mock,
  };
});

describe("playerCanAffordResourceRequirement", () => {
  test("Player can afford resources", () => {
    const mockedFunction = jest.fn();
    const actual = createShipAttackModule(100, mockedFunction);
    actual({ x: 0, y: 0 });
    expect(mockedFunction).toHaveBeenCalled();
  });
});
