import { getRandomInt, isWinningRoll } from "../../../utility/Utility";

export const prefixes = [];

export const suffixes = ["in", "on", "ar", "or", "ik", "er"];

const vowels = ["a", "e", "i", "o", "u"];
const consonants = [
  "b",
  "c",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "m",
  "n",
  "p",
  "q",
  "r",
  "s",
  "t",
  "v",
  "w",
  "x",
  "y",
  "z",
];

const consonantMap = {
  b: {
    pre: ["b", "bl", "br"],
    root: ["b", "bl", "br"],
    suff: ["b"],
  },
  c: {
    pre: ["c", "ch", "cl", "cr"],
    root: ["c", "ch", "cl", "cr"],
    suff: ["c"],
  },
  d: {
    pre: ["d", "dr"],
    root: ["d", "dr"],
    suff: ["d"],
  },
  f: {
    pre: ["f", "fr", "fl"],
    root: ["f", "fr", "fl"],
    suff: ["f"],
  },

  g: {
    pre: ["g", "gr", "gh", "gl", "gn"],
    root: ["g", "gr", "gh", "gl", "gn"],
    suff: ["g", "gh"],
  },
  h: {
    pre: ["h"],
    root: ["h"],
    suff: [],
  },
  j: {
    pre: ["j"],
    root: ["j"],
    suff: [],
  },

  k: {
    pre: ["k", "kh", "kr"],
    root: ["k", "kh", "kr"],
    suff: ["k"],
  },
  l: {
    pre: ["l", "lr"],
    root: ["l", "lr"],
    suff: ["l"],
  },
  m: {
    pre: ["m"],
    root: ["m"],
    suff: ["m"],
  },
  n: {
    pre: ["n"],
    root: ["n"],
    suff: ["n"],
  },
  p: {
    pre: ["p", "ps", "ph", "pr", "pl"],
    root: ["p", "ps", "ph", "pr", "pl"],
    suff: ["p"],
  },
  q: {
    pre: ["qu"],
    root: ["qu"],
    suff: [],
  },
  r: {
    pre: ["r"],
    root: ["r"],
    suff: ["r"],
  },
  s: {
    pre: [
      "s",
      "sl",
      "sz",
      "sh",
      "st",
      "sc",
      "sk",
      "sn",
      "sm",
      "str",
      "sp",
      "squ",
    ],
    root: [
      "s",
      "sl",
      "sz",
      "sh",
      "st",
      "sc",
      "sk",
      "sn",
      "sm",
      "str",
      "sp",
      "squ",
    ],
    suff: ["s"],
  },
  t: {
    pre: ["t", "tr", "th"],
    root: ["t", "tr", "th"],
    suff: ["t", "th"],
  },
  v: {
    pre: ["v"],
    root: ["v"],
    suff: ["v"],
  },
  w: {
    pre: ["w", "wr", "wh"],
    root: ["w", "wr", "wh"],
    suff: ["w"],
  },
  x: {
    pre: ["x"],
    root: ["x"],
    suff: ["x"],
  },
  y: {
    pre: ["y"],
    root: ["y"],
    suff: ["y"],
  },
  z: {
    pre: ["z"],
    root: ["z"],
    suff: ["z"],
  },
};

const syllablePatterns = ["C", "V", "CV", "CVC"];

function createFragment() {
  const syllablePattern =
    syllablePatterns[getRandomInt(0, syllablePatterns.length)];

  let word = [];

  for (let i = 0; i <= syllablePattern.length; i++) {
    if (syllablePattern[i] === "C") {
      word.push(randomConsonant(i, syllablePattern.length));
    } else {
      word.push(randomVowel());
    }
  }

  return word.join("");
}

function randomVowel() {
  return `${vowels[getRandomInt(0, vowels.length)]}`;
}

function randomConsonant(patternIndex, patternLength) {
  const consonantKey = consonants[getRandomInt(0, consonants.length)];
  const clusterMap = consonantMap[consonantKey];
  if (patternIndex === 0) {
    return clusterMap.pre[getRandomInt(0, clusterMap.pre.length)];
  }
  if (patternIndex === patternLength - 1) {
    return clusterMap.suff[getRandomInt(0, clusterMap.suff.length)];
  }

  return clusterMap.root[getRandomInt(0, clusterMap.root.length)];
}

export function createName() {
  const fragments = getRandomInt(1, 3);
  const word = [];
  for (let i = 0; i <= fragments; i++) {
    word.push(createFragment());
  }

  let stringWord = word.join("");

  return stringWord[0].toUpperCase() + stringWord.slice(1);
}
