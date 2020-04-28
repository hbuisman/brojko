export class Random {
  private unsafeRandom: () => number = () => NaN;

  constructor(random: () => number) {
    this.unsafeRandom = random;
  }

  number01(): number {
    const result = this.unsafeRandom();
    if (result < 0 || result >= 1.0) {
      throw Error(`Expected a random number within [0.0, 1.0), but got: ${result}`);
    }

    return result;
  }

  int(minInclusive: number, maxInclusive: number): number {
    if (!Number.isInteger(minInclusive)) {
      throw Error(`Expected min to be an integer, but got: ${minInclusive}`);
    }

    if (!Number.isInteger(maxInclusive)) {
      throw Error(`Expected max to be an integer, but got: ${maxInclusive}`);
    }

    const rand = this.number01();

    const minInt = Math.ceil(minInclusive);
    const maxInt = Math.floor(maxInclusive);
    const result = Math.floor(rand * (maxInt - minInt + 1)) + minInt;

    if (!Number.isInteger(result)) {
      throw Error(`Expected an integer, but the random number was: ${result}`);
    }
    if (result < minInclusive || result > maxInclusive) {
      throw Error(`Unexpected number outside of the range [${minInclusive}, ${maxInclusive}]: ${result}`);
    }

    return result;
  }

  choose<T>(population: Array<T>): T {
    if (population.length === 0) {
      throw Error(`Unexpected empty population to choose from`);
    }

    const index = this.int(0, population.length - 1);
    const result = population[index];

    if (population.indexOf(result) === -1) {
      throw Error(`Expected to find the result in the population: ${result}`);
    }

    return result;
  }

  shuffleInPlace<T>(array: Array<T>): void {
    // Fisher-Yates
    for (let i = array.length - 1; i >= 0; i--) {
      const j = this.int(0, i);
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  // The returned subset is shuffled.
  intSubset(minInclusive: number, maxInclusive: number, size: number): Array<number> {
    // Preconditions
    if (size === 0) {
      return new Array<number>();
    }
    if (!Number.isInteger(minInclusive)) {
      throw Error(`Expected minInclusive to be an integer, but got: ${minInclusive}`);
    }
    if (!Number.isInteger(maxInclusive)) {
      throw Error(`Expected maxInclusive to be an integer, but got: ${maxInclusive}`);
    }
    if (!Number.isInteger(size)) {
      throw Error(`Expected size to be an integer, but got: ${size}`);
    }
    if (minInclusive >= maxInclusive) {
      throw Error(`minInclusive (== ${minInclusive}) is greater-equal maxInclusive (== ${maxInclusive})`);
    }
    if (size > maxInclusive - minInclusive + 1) {
      throw Error(
        `The subset size (== ${size}) is larger than the number of integers ` +
          `in the given range [${minInclusive}, ${maxInclusive}].`,
      );
    }

    let result = new Array<number>();

    const rangeSize = maxInclusive - minInclusive + 1;

    // We need to distinguish two strategies:
    // 1) The size of the subset encompasses a large part of the range -> we need to shuffle, otherwise the small sample
    //    size will bite us.
    //
    // 2) The size of the subset << the size of the range -> use time-optimal reservoir sampling
    if (size / rangeSize >= 0.1) {
      ////
      // Actualize the range as an array, shuffle and pick a subset.
      ////

      const array = new Array<number>();
      for (let i = minInclusive; i <= maxInclusive; i++) {
        array.push(i);
      }

      this.shuffleInPlace(array);

      result = array.slice(0, size).sort();
    } else {
      ////
      // Algorithm L from:
      // Li, Kim-Hung, "Reservoir-Sampling Algorithms of Time Complexity O(n(1+log(N/n)))",
      //  ACM Transactions on Mathematical Software, 20(4): 481-493.
      ////

      // Pointer
      let i = minInclusive;

      // Fill the reservoir
      for (; i < minInclusive + size; i++) {
        result.push(i);
      }

      let w = Math.exp(Math.log(this.number01() + 1e-15) / size);

      while (i <= maxInclusive) {
        i = i + Math.floor(Math.log(this.number01() + 1e-15) / Math.log(1 - w)) + 1;

        if (i <= maxInclusive) {
          // Replace a random item of the reservoir with the i
          result[this.int(0, size - 1)] = i;

          w = w * Math.exp(Math.log(this.number01() + 1e-15) / size);
        }
      }
    }

    this.shuffleInPlace(result);

    // Post-conditions
    if (result.length !== size) {
      throw Error(`Expected the result to have length of the size (== ${size}), but got: ${result.length}`);
    }
    for (const i of result) {
      if (!Number.isInteger(i)) {
        throw Error(`Expected an element of the result to be an integer, but got: ${i}`);
      }
      if (i < minInclusive || i > maxInclusive) {
        throw Error(
          `Expected an element of the result to be in the range [${minInclusive}, ${maxInclusive}], ` + `but got: ${i}`,
        );
      }
    }
    if (new Set(result).size !== result.length) {
      throw Error(`Expected the result to be a subset, but there are duplicate elements in the result.`);
    }

    return result;
  }
}
