import * as random from './random';

export function generateBank(aRandom: random.Random, min: number, max: number): number[] {
  const count = 9;
  const result = aRandom.intSubset(min, max, count);

  if (result.length !== count) {
    throw Error(`Expected result of count ${count}, but got: ${result.length}`);
  }
  return result;
}
