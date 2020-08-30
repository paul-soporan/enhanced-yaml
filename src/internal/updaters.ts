import type { Document } from 'yaml';
import { Alias, Scalar, Pair, YAMLMap, YAMLSeq } from 'yaml/types';
import { makeUpdater } from './makeUpdater';
import { pairItems } from './pairItems';
import { areValuesEqual } from './checks/equality';

export type SupportedNode = Alias | Scalar | Pair | YAMLMap | YAMLSeq;

export interface UpdaterOptions {
  document: Document;
}

export function updateScalar(original: unknown, updated: Scalar): Scalar {
  return makeUpdater(Scalar, original).update(updated, { value: updated.value as unknown });
}

export function updatePair(original: unknown, updated: Pair, options: UpdaterOptions): Pair {
  return makeUpdater(Pair, original).update(updated, (originalPair) => ({
    key: updateValue(originalPair.key, updated.key, options),
    value: updateValue(originalPair.value, updated.value, options),
  }));
}

export function updateMap(original: unknown, updated: YAMLMap, options: UpdaterOptions): YAMLMap {
  const sortMapEntries = options.document.schema?.sortMapEntries;

  const updatedMap = makeUpdater(YAMLMap, original).update(updated, (originalMap) => ({
    items: updated.items.map((pair) =>
      originalMap.has(pair.key)
        ? updatePair(
            originalMap.items.find((item) => areValuesEqual(item.key, pair.key)),
            pair,
            options,
          )
        : pair,
    ),
  }));

  if (typeof sortMapEntries === 'function') {
    updatedMap.items.sort(sortMapEntries);
  }

  return updatedMap;
}

export function updateSequence(
  original: unknown,
  updated: YAMLSeq,
  options: UpdaterOptions,
): YAMLSeq {
  return makeUpdater(YAMLSeq, original).update(updated, (originalSequence) => ({
    items: pairItems({
      updated: updated.items as unknown[],
      original: originalSequence.items as unknown[],
    }).map(({ updatedItem, originalItem }) =>
      originalItem ? updateValue(originalItem, updatedItem, options) : updatedItem,
    ),
  }));
}

export function updateValue(
  original: unknown,
  updated: unknown,
  options: UpdaterOptions,
): SupportedNode {
  /*
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
    return updatePair(original, updated, options);
  }

  if (updated instanceof YAMLMap) {
    return updateMap(original, updated, options);
  }

  if (updated instanceof YAMLSeq) {
    return updateSequence(original, updated, options);
  }

  throw new Error(`Unsupported value ${String(updated)} (of type ${typeof updated})`);
}
