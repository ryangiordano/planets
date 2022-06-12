export type StellarBodySize = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type GasType = "blue" | "yellow" | "red";

export type MineralType = "green" | "orange" | "purple";

export type MineableResourceType = GasType | MineralType;
export type ResourceType = MineableResourceType;

export type CompositionType = {
  /** Array of tuples of GasType and value*/
  gas: [GasType, number][];
  /** Array of tuples of MineralType and value*/
  mineral: [MineralType, number][];
};
