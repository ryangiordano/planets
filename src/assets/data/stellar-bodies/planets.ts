import { StellarBodySize, CompositionType } from "./Types";

export type StellarBodyData = {
  name: string;
  distanceFromCenter?: number;
  rotationSpeed?: number;
  color?: number;
  orbit?: number[];
  size: StellarBodySize;
  id: number;
  composition?: CompositionType;
};

const data: {
  [key: string]: StellarBodyData;
} = {};

export default data;
