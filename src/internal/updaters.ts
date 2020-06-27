import { Alias, Scalar, Pair, YAMLMap, YAMLSeq } from 'yaml/types';
import { makeUpdater } from './makeUpdater';
import { getMostSimilarOriginalItem } from './checks/similarity';
import { areValuesEqual } from './checks/equality';

export type SupportedNode = Alias | Scalar | Pair | YAMLMap | YAMLSeq;

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
    items: updated.items.map((pair) =>
      originalMap.has(pair.key)
        ? updatePair(
            originalMap.items.find((item) => areValuesEqual(item.key, pair.key)),
            pair,
          )
        : pair,
    ),
  }));
}

export function updateSequence(original: unknown, updated: YAMLSeq): YAMLSeq {
  const usedIndices = new Set<number>();

  return makeUpdater(YAMLSeq, original).update(updated, (originalSequence) => ({
    items: updated.items.map((updatedItem: unknown) => {
      const originalItem = getMostSimilarOriginalItem(
        updatedItem,
        originalSequence.items,
        usedIndices,
      );

      if (originalItem === null) {
        return updatedItem;
      }

      return updateValue(originalItem, updatedItem);
    }),
  }));
}

export function updateValue(original: unknown, updated: unknown): SupportedNode {
  /**
   * Because `yaml` stores nodes by reference and we mutate the original nodes,
   * both anchors and aliases are updated automatically, so we can just check for equality.
   */
  if (original instanceof Alias && areValuesEqual(original.source, updated)) {
    return original;
  }

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
