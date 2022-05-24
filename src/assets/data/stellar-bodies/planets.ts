import { StellarBodySize, MineableResourceType } from "./Types";

export type StellarBodyData = {
  name: string;
  distanceFromCenter?: number;
  remainingYield: number;
  maxYield: number;
  rotationSpeed?: number;
  color?: number;
  orbit?: number[];
  size: StellarBodySize;
  id: number;
  resourceType: MineableResourceType;
};

const data: {
  [key: string]: StellarBodyData;
} = {};

export default data;
