import {
  CompositionType,
  StellarBodySize,
} from "../../../components/planet/StellarBody";

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
} = {
  "0": {
    name: "Locifur",
    size: 6,
    color: 0xe0c34c,
    distanceFromCenter: 1000,
    id: 0,
  },
  "1": {
    name: "Andy IV",
    distanceFromCenter: 150,
    rotationSpeed: 15,
    size: 3,
    color: 0x606de0,
    orbit: [1.1],
    composition: {
      gas: [
        ["blue", 0.5],
        ["red", 0.2],
      ],
      mineral: [
        ["purple", 0.5],
        ["orange", 0.3],
      ],
    },
    id: 1,
  },
  "2": {
    name: "Wryan",
    distanceFromCenter: 250,
    rotationSpeed: 25,
    size: 2,
    color: 0x98bf88,
    composition: {
      gas: [["red", 0.5]],
      mineral: [],
    },
    id: 2,
  },
  "3": {
    name: "Mayga",
    distanceFromCenter: 350,
    rotationSpeed: 10,
    size: 4,
    color: 0xe362ab,
    composition: {
      gas: [["yellow", 0.5]],
      mineral: [["green", 0.5]],
    },
    id: 3,
  },
  "1.1": {
    name: "Charger",
    distanceFromCenter: 30,
    rotationSpeed: 100,
    size: 0,
    color: 0xcfcab8,
    composition: {
      gas: [],
      mineral: [["purple", 0.5]],
    },
    id: 1.1,
  },

  "4": {
    name: "Odie",
    size: 6,
    color: 0xd96729,
    distanceFromCenter: 1000,
    composition: {
      gas: [["red", 0.5]],
      mineral: [["orange", 0.5]],
    },
    id: 4,
  },
  "5": {
    name: "Pati",
    distanceFromCenter: 150,
    rotationSpeed: 15,
    size: 3,
    color: 0x6b5143,
    composition: {
      gas: [],
      mineral: [
        ["purple", 0.5],
        ["green", 0.5],
      ],
    },
    id: 5,
  },
  "6": {
    name: "Grampar",
    distanceFromCenter: 250,
    rotationSpeed: 25,
    size: 2,
    color: 0x98bf88,
    orbit: [6.1],
    composition: {
      gas: [],
      mineral: [
        ["purple", 0.5],
        ["green", 0.5],
      ],
    },
    id: 6,
  },
  "7": {
    name: "Birdhead",
    distanceFromCenter: 350,
    rotationSpeed: 10,
    size: 4,
    color: 0xf02453,
    composition: {
      gas: [["blue", 0.5]],
      mineral: [],
    },
    id: 7,
  },
  "6.1": {
    name: "Moe",
    distanceFromCenter: 30,
    rotationSpeed: 100,
    size: 0,
    color: 0xcfcab8,
    composition: {
      gas: [],
      mineral: [["purple", 0.5]],
    },
    id: 6.1,
  },
  "8": {
    name: "Effram",
    distanceFromCenter: 350,
    rotationSpeed: 10,
    size: 4,
    color: 0xe362ab,
    composition: {
      gas: [],
      mineral: [["orange", 0.5]],
    },
    id: 8,
  },
};

export default data;
