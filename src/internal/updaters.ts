import { Scalar, Pair, YAMLMap, YAMLSeq } from 'yaml/types';
import { makeUpdater } from './makeUpdater';
import { areValuesEqual } from './checks';

export type SupportedNode = Scalar | Pair | YAMLMap | YAMLSeq;

export function updateScalar(original: unknown, updated: Scalar): Scalar {
  return makeUpdater(Scalar, original).update(updated, { value: updated.value as unknown });
}

export function updatePair(original: unknown, updated: Pair): Pair {
  return makeUpdater(Pair, original).update(updated, (originalPair) => ({
    key: updateValue(originalPair.key, updated.key),
    value: updateValue(originalPair.value, updated.value),
  }));
}

export function updateMap(original: unknown, updated: YAMLMap): YAMLMap {
  return makeUpdater(YAMLMap, original).update(updated, (originalMap) => ({
    items: updated.items.map((pair) => {
      return originalMap.has(pair.key)
        ? updatePair(
            originalMap.items.find((item) => areValuesEqual(item.key, pair.key)),
            pair,
          )
        : pair;
    }),
  }));
}

export function updateSequence(original: unknown, updated: YAMLSeq): YAMLSeq {
  return makeUpdater(YAMLSeq, original).update(updated, { items: updated.items });
}

export function updateValue(original: unknown, updated: unknown): SupportedNode {
  if (updated instanceof Scalar) {
    return updateScalar(original, updated);
  }

  if (updated instanceof Pair) {
    return updatePair(original, updated);
  }

  if (updated instanceof YAMLMap) {
    return updateMap(original, updated);
  }

  if (updated instanceof YAMLSeq) {
    return updateSequence(original, updated);
  }

  throw new Error(`Unsupported value ${String(updated)} (of type ${typeof updated})`);
}
