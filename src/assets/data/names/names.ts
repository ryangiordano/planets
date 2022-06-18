import { getRandomInt, isWinningRoll } from "../../../utility/Utility";

export const prefixes = [];

export const suffixes = ["in", "on", "ar", "or", "ik", "er"];

const vowels = ["a", "e", "i", "o", "u", "y"];
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
  "z",
];

function createFragment() {
  const length = getRandomInt(0, 3);

  let word = [];

  for (let i = 0; i <= length; i++) {
    if (isWinningRoll(0.5)) {
      word.push(randomVowel());
    } else {
      word.push(randomConsonant());
    }
  }

  return word.join("");
}

function createSuffix() {
  return `${randomVowel()}${randomConsonant()}`;
}

function randomVowel() {
  return `${vowels[getRandomInt(0, vowels.length)]}`;
}

function randomConsonant() {
  return `${consonants[getRandomInt(0, consonants.length)]}`;
}

export function createName() {
  const fragments = getRandomInt(1, 4);
  const word = [];
  for (let i = 0; i <= fragments; i++) {
    word.push(createFragment());
  }

  word.push(createSuffix());
  let stringWord = word.join("");

  return stringWord[0].toUpperCase() + stringWord.slice(1);
}
