export interface Range {
  minInclusive: number;
  maxInclusive: number;
}

export function isEqual(aRange: Range, another: Range) {
  return aRange.minInclusive === another.minInclusive && aRange.maxInclusive === another.maxInclusive;
}

function create(minInclusive: number, maxInclusive: number): Range {
  if (minInclusive >= maxInclusive) {
    throw Error(`Unexpected minInclusive (== ${minInclusive}) >= maxInclusive (== ${maxInclusive})`);
  }
  return { minInclusive, maxInclusive };
}

// More ranges are expected to be added in the future.
export const LIST = [create(1, 100)];

export function tryParse(s: string): Range | undefined {
  const parts = s.split('-');
  if (parts.length !== 2) {
    return undefined;
  }

  const minInclusive = Number.parseInt(parts[0]);
  if (Number.isNaN(minInclusive)) {
    return undefined;
  }

  const maxInclusive = Number.parseInt(parts[1]);
  if (Number.isNaN(maxInclusive)) {
    return undefined;
  }

  return { minInclusive, maxInclusive };
}

export function toString(r: Range): string {
  const result = `${r.minInclusive}-${r.maxInclusive}`;

  if (tryParse(result) === undefined) {
    throw Error(`Unexpectedly unparsable key of the range ${r}: ${result}`);
  }
  return result;
}
