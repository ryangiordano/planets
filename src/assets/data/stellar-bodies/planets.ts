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
  stellarEnemies?: number;
};

const data: {
  [key: string]: StellarBodyData;
} = {
  "0": {
    name: "Locifur",
    size: 6,
    distanceFromCenter: 1000,
    id: 0,
    resourceType: "yellow",
    remainingYield: 100,
    maxYield: 100,
  },
  "1": {
    name: "Andy IV",
    distanceFromCenter: 150,
    rotationSpeed: 15,
    size: 3,
    orbit: [1.1],
    resourceType: "blue",
    remainingYield: 4,
    maxYield: 4,
    id: 1,
  },
  "2": {
    name: "Wryan",
    distanceFromCenter: 250,
    rotationSpeed: 25,
    size: 2,
    resourceType: "red",
    remainingYield: 100,
    maxYield: 100,
    id: 2,
  },
  "3": {
    name: "Mayga",
    distanceFromCenter: 350,
    rotationSpeed: 10,
    size: 4,
    resourceType: "yellow",
    remainingYield: 100,
    maxYield: 100,
    id: 3,
  },
  "1.1": {
    name: "Charger",
    distanceFromCenter: 30,
    rotationSpeed: 100,
    size: 0,
    resourceType: "purple",
    remainingYield: 1,
    maxYield: 1,
    id: 1.1,
  },
  "4": {
    name: "Odie",
    size: 6,
    distanceFromCenter: 1000,
    resourceType: "red",
    remainingYield: 100,
    maxYield: 100,
    id: 4,
  },
  "5": {
    name: "Pati",
    distanceFromCenter: 150,
    rotationSpeed: 15,
    size: 3,
    resourceType: "green",
    remainingYield: 100,
    maxYield: 100,
    id: 5,
  },
  "6": {
    name: "Grampar",
    distanceFromCenter: 250,
    rotationSpeed: 25,
    size: 2,
    orbit: [6.1],
    resourceType: "green",
    remainingYield: 100,
    maxYield: 100,
    id: 6,
  },
  "7": {
    name: "Birdhead",
    distanceFromCenter: 350,
    rotationSpeed: 10,
    size: 4,
    resourceType: "blue",
    remainingYield: 100,
    maxYield: 100,
    id: 7,
  },
  "6.1": {
    name: "Moe",
    distanceFromCenter: 30,
    rotationSpeed: 100,
    size: 0,
    resourceType: "purple",
    remainingYield: 100,
    maxYield: 100,
    id: 6.1,
  },
  "8": {
    name: "Effram",
    distanceFromCenter: 350,
    rotationSpeed: 10,
    size: 4,
    resourceType: "orange",
    remainingYield: 100,
    maxYield: 100,
    id: 8,
  },
};

export default data;
