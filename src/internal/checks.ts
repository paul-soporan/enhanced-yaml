import { Scalar, Pair } from 'yaml/types';

export function areScalarsEqual(a: Scalar, b: Scalar): boolean {
  return areValuesEqual(a.value, b.value);
}

export function arePairsEqual(a: Pair, b: Pair): boolean {
  return areValuesEqual(a.key, b.key) && areValuesEqual(a.value, b.value);
}

export function areValuesEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }

  if (a instanceof Scalar && b instanceof Scalar) {
    return areScalarsEqual(a, b);
  }

  if (a instanceof Pair && b instanceof Pair) {
    return arePairsEqual(a, b);
  }

  return false;
}
