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
  // "0": {
  //   name: "Locifur",
  //   size: 6,
  //   distanceFromCenter: 1000,
  //   id: 0,
  //   composition: {
  //     gas: [["yellow", 0.5]],
  //     mineral: [],
  //   },
  // },
  // "1": {
  //   name: "Andy IV",
  //   distanceFromCenter: 150,
  //   rotationSpeed: 15,
  //   size: 3,
  //   orbit: [1.1],
  //   composition: {
  //     gas: [
  //       ["blue", 0.8],
  //       ["red", 0.2],
  //     ],
  //     mineral: [
  //       ["purple", 0.5],
  //       ["orange", 0.3],
  //     ],
  //   },
  //   id: 1,
  // },
  // "2": {
  //   name: "Wryan",
  //   distanceFromCenter: 250,
  //   rotationSpeed: 25,
  //   size: 2,
  //   composition: {
  //     gas: [["red", 1]],
  //     mineral: [],
  //   },
  //   id: 2,
  // },
  // "3": {
  //   name: "Mayga",
  //   distanceFromCenter: 350,
  //   rotationSpeed: 10,
  //   size: 4,
  //   composition: {
  //     gas: [["yellow", 0.8]],
  //     mineral: [["green", 0.2]],
  //   },
  //   id: 3,
  // },
  // "1.1": {
  //   name: "Charger",
  //   distanceFromCenter: 30,
  //   rotationSpeed: 100,
  //   size: 0,
  //   composition: {
  //     gas: [],
  //     mineral: [["purple", 0.1]],
  //   },
  //   id: 1.1,
  // },

  // "4": {
  //   name: "Odie",
  //   size: 6,
  //   distanceFromCenter: 1000,
  //   composition: {
  //     gas: [["red", 0.1]],
  //     mineral: [["orange", 0.1]],
  //   },
  //   id: 4,
  // },
  // "5": {
  //   name: "Pati",
  //   distanceFromCenter: 150,
  //   rotationSpeed: 15,
  //   size: 3,
  //   composition: {
  //     gas: [],
  //     mineral: [
  //       ["purple", 0.2],
  //       ["green", 0.7],
  //     ],
  //   },
  //   id: 5,
  // },
  // "6": {
  //   name: "Grampar",
  //   distanceFromCenter: 250,
  //   rotationSpeed: 25,
  //   size: 2,
  //   orbit: [6.1],
  //   composition: {
  //     gas: [],
  //     mineral: [
  //       ["purple", 0.1],
  //       ["green", 0.3],
  //     ],
  //   },
  //   id: 6,
  // },
  // "7": {
  //   name: "Birdhead",
  //   distanceFromCenter: 350,
  //   rotationSpeed: 10,
  //   size: 4,
  //   composition: {
  //     gas: [["blue", 0.9]],
  //     mineral: [],
  //   },
  //   id: 7,
  // },
  // "6.1": {
  //   name: "Moe",
  //   distanceFromCenter: 30,
  //   rotationSpeed: 100,
  //   size: 0,
  //   composition: {
  //     gas: [],
  //     mineral: [["purple", 1]],
  //   },
  //   id: 6.1,
  // },
  // "8": {
  //   name: "Effram",
  //   distanceFromCenter: 350,
  //   rotationSpeed: 10,
  //   size: 4,
  //   composition: {
  //     gas: [],
  //     mineral: [["orange", 0.4]],
  //   },
  //   id: 8,
  // },
};

export default data;
