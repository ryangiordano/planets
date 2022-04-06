import { StellarBodySize } from "../../../components/planet/StellarBody";
export type StellarBodyData = {
  name: string;
  distanceFromCenter?: number;
  rotationSpeed?: number;
  color?: number;
  orbit: number[];
  size: StellarBodySize;
};

export default {
  "0": {
    size: 6,
    color: 0xe0c34c,
  },
  "1": {
    name: "",
    distanceFromCenter: 150,
    rotationSpeed: 115,
    size: 3,
    color: 0x606de0,
    orbit: [1.1, 1.2],
  },
  "2": {
    name: "",
    distanceFromCenter: 250,
    rotationSpeed: 55,
    size: 2,
    color: 0x98bf88,
  },
  "3": {
    name: "",
    distanceFromCenter: 350,
    rotationSpeed: 10,
    size: 4,
    color: 0xe362ab,
  },
  "1.1": {
    name: "",
    distanceFromCenter: 30,
    rotationSpeed: 200,
    size: 0,
    color: 0xcfcab8,
  },
  "1.2": {
    name: "",
    distanceFromCenter: 25,
    rotationSpeed: 300,
    size: 0,
    color: 0xcfcab8,
  },
};
