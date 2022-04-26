import { StellarBodySize } from "../../../components/planet/StellarBody";
export type StellarBodyData = {
  name: string;
  distanceFromCenter?: number;
  rotationSpeed?: number;
  color?: number;
  orbit: number[];
  size: StellarBodySize;
  id: number;
};

export default {
  "0": {
    name: "Locifur",
    size: 6,
    color: 0xe0c34c,
    distanceFromCenter: 1000,
  },
  "1": {
    name: "Andy IV",
    distanceFromCenter: 150,
    rotationSpeed: 15,
    size: 3,
    color: 0x606de0,
    orbit: [1.1],
  },
  "2": {
    name: "Wryan",
    distanceFromCenter: 250,
    rotationSpeed: 25,
    size: 2,
    color: 0x98bf88,
  },
  "3": {
    name: "Mayga",
    distanceFromCenter: 350,
    rotationSpeed: 10,
    size: 4,
    color: 0xe362ab,
  },
  "1.1": {
    name: "Charger",
    distanceFromCenter: 30,
    rotationSpeed: 100,
    size: 0,
    color: 0xcfcab8,
  },

  "4": {
    name: "Odie",
    size: 6,
    color: 0xd96729,
    distanceFromCenter: 1000,
  },
  "5": {
    name: "Pati",
    distanceFromCenter: 150,
    rotationSpeed: 15,
    size: 3,
    color: 0x6b5143,
  },
  "6": {
    name: "Grampar",
    distanceFromCenter: 250,
    rotationSpeed: 25,
    size: 2,
    color: 0x98bf88,
    orbit: [6.1],
  },
  "7": {
    name: "Birdhead",
    distanceFromCenter: 350,
    rotationSpeed: 10,
    size: 4,
    color: 0xf02453,
  },
  "6.1": {
    name: "Moe",
    distanceFromCenter: 30,
    rotationSpeed: 100,
    size: 0,
    color: 0xcfcab8,
  },
  "8": {
    name: "Effram",
    distanceFromCenter: 350,
    rotationSpeed: 10,
    size: 4,
    color: 0xe362ab,
  },
};
