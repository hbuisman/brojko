import * as random from '../random';

it('generates numbers min inclusive.', () => {
  const mockMathRandom = () => 0.0;
  const r = new random.Random(mockMathRandom);

  const someNumber = r.int(-100, 100);
  expect(someNumber).toBe(-100);
});

it('generates numbers max inclusive.', () => {
  const mockMathRandom = () => 0.999;
  const r = new random.Random(mockMathRandom);

  const someNumber = r.int(-100, 100);
  expect(someNumber).toBe(100);
});

it('generates numbers uniformly at random in the range [0, 2].', () => {
  let randomResult = 0.0;
  const mockMathRandom = () => randomResult;
  const r = new random.Random(mockMathRandom);

  const histogram = new Map<number, number>();

  for (randomResult = 0.0; randomResult < 1.0; randomResult += 0.01) {
    const someNumber = r.int(0, 2);

    const oldCount = histogram.get(someNumber);
    if (oldCount === undefined) {
      histogram.set(someNumber, 1);
    } else {
      histogram.set(someNumber, oldCount + 1);
    }
  }

  const expected = new Map<number, number>([
    [0, 34],
    [1, 33],
    [2, 33],
  ]);

  expect(histogram).toEqual(expected);
});

it('generates numbers uniformly at random in the range [0, 3].', () => {
  let randomResult = 0.0;
  const mockMathRandom = () => randomResult;
  const r = new random.Random(mockMathRandom);

  const histogram = new Map<number, number>();

  for (randomResult = 0.0; randomResult < 1.0; randomResult += 0.01) {
    const someNumber = r.int(0, 3);

    const oldCount = histogram.get(someNumber);
    if (oldCount === undefined) {
      histogram.set(someNumber, 1);
    } else {
      histogram.set(someNumber, oldCount + 1);
    }
  }

  const expected = new Map<number, number>([
    [0, 25],
    [1, 25],
    [2, 25],
    [3, 25],
  ]);
  expect(histogram).toEqual(expected);
});

it('chooses the elements uniformly from an array of 3 elements.', () => {
  let randomResult = 0.0;
  const mockMathRandom = () => randomResult;
  const r = new random.Random(mockMathRandom);

  const population = [10, 20, 30];

  const histogram = new Map<number, number>();

  for (randomResult = 0.0; randomResult < 1.0; randomResult += 0.01) {
    const someElement = r.choose(population);

    const oldCount = histogram.get(someElement);
    if (oldCount === undefined) {
      histogram.set(someElement, 1);
    } else {
      histogram.set(someElement, oldCount + 1);
    }
  }

  const expected = new Map<number, number>([
    [10, 34],
    [20, 33],
    [30, 33],
  ]);
  expect(histogram).toEqual(expected);
});

it('chooses the elements uniformly from an array of 4 elements.', () => {
  let randomResult = 0.0;
  const mockMathRandom = () => randomResult;
  const r = new random.Random(mockMathRandom);

  const population = [10, 20, 30, 40];

  const histogram = new Map<number, number>();

  for (randomResult = 0.0; randomResult < 1.0; randomResult += 0.01) {
    const someElement = r.choose(population);
    const oldCount = histogram.get(someElement);
    if (oldCount === undefined) {
      histogram.set(someElement, 1);
    } else {
      histogram.set(someElement, oldCount + 1);
    }
  }

  const expected = new Map<number, number>([
    [10, 25],
    [20, 25],
    [30, 25],
    [40, 25],
  ]);
  expect(histogram).toEqual(expected);
});

it('chooses uniformly a subset of integers from a small range.', () => {
  const histogram = new Map<string, number>();

  const r = new random.Random(Math.random);

  const trials = 1000;
  for (let trial = 0; trial < trials; trial++) {
    const subset = r.intSubset(1, 4, 2);
    const [a, b] = subset.sort();

    const key = `${a} ${b}`;
    const oldCount = histogram.get(key);
    if (oldCount === undefined) {
      histogram.set(key, 1);
    } else {
      histogram.set(key, oldCount + 1);
    }
  }

  // There are 4 integers in [1, 4]. There are 4 choose 2 == 6 possible subsets of size 2.
  expect(histogram.size).toBe(6);

  for (const value of histogram.values()) {
    // 1/6 == 16% which equals 160 trials, but we are more lax here and expect 130 hit trials due to random effects.
    expect(value).toBeGreaterThan(130);
  }
});

it('chooses uniformly a subset of integers from a large range.', () => {
  const histogram = new Map<string, number>();

  const r = new random.Random(Math.random);

  // We pick a range of 20 numbers and subsets of 2. 2 chooses 20 is 190. We do 190 * 100 trials, so that we observe
  // each combination at least 70 times.
  const trials = 190 * 100;
  for (let trial = 0; trial < trials; trial++) {
    const [a, b] = r.intSubset(1, 20, 2).sort();

    const key = `${a} ${b}`;
    const oldCount = histogram.get(key);
    if (oldCount === undefined) {
      histogram.set(key, 1);
    } else {
      histogram.set(key, oldCount + 1);
    }
  }

  expect(histogram.size).toBe(190);
  for (const value of histogram.values()) {
    expect(value).toBeGreaterThan(70);
  }
});
