import type { Document } from 'yaml';
import { Alias, Scalar, Pair, YAMLMap, YAMLSeq } from 'yaml/types';
import { makeUpdater } from './makeUpdater';
import { preserveOriginalCollectionOrdering } from './preserveOriginalCollectionOrdering';
import { pairItems } from './pairItems';
import { areValuesEqual } from '../checks/equality';

/**
 * The nodes supported by the serializer.
 * Using an unsupported node will cause the serializer to throw.
 */
export type SupportedNode = Alias | Scalar | Pair | YAMLMap | YAMLSeq;

export interface UpdaterOptions {
  document: Document;
  preserveOriginalOrdering: boolean;
}

/**
 * Updates a Scalar's value.
 */
export function updateScalar(original: unknown, updated: Scalar): Scalar {
  return makeUpdater(Scalar, original).update(updated, { value: updated.value as unknown });
}

/**
 * Updates a Pair's key and value.
 */
export function updatePair(original: unknown, updated: Pair, options: UpdaterOptions): Pair {
  return makeUpdater(Pair, original).update(updated, (originalPair) => ({
    key: updateValue(originalPair.key, updated.key, options),
    value: updateValue(originalPair.value, updated.value, options),
  }));
}

/**
 * Updates a Map's items and sorts them:
 * - it preserves the original ordering if the `preserveOriginalOrdering` option is set
 * - it sorts them based on the `sortMapEntries` option if set
 */
export function updateMap(original: unknown, updated: YAMLMap, options: UpdaterOptions): YAMLMap {
  const sortMapEntries = options.document.schema?.sortMapEntries;

  const updater = makeUpdater(YAMLMap, original);

  const updatedMap = updater.update(updated, (originalMap) => ({
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

  if (options.preserveOriginalOrdering) {
    preserveOriginalCollectionOrdering(updater, updatedMap);
  }

  if (typeof sortMapEntries === 'function') {
    updatedMap.items.sort(sortMapEntries);
  }

  return updatedMap;
}

/**
 * Updates a sequence's items by pairing each updated item with a
 * corresponding original item based on a computed similarity score.
 *
 * It also preserves the original ordering if the `preserveOriginalOrdering` option is set.
 */
export function updateSequence(
  original: unknown,
  updated: YAMLSeq,
  options: UpdaterOptions,
): YAMLSeq {
  const updater = makeUpdater(YAMLSeq, original);

  const updatedSequence = updater.update(updated, (originalSequence) => ({
    items: pairItems({
      updated: updated.items as unknown[],
      original: originalSequence.items as unknown[],
    }).map(({ updatedItem, originalItem }) =>
      originalItem ? updateValue(originalItem, updatedItem, options) : updatedItem,
    ),
  }));

  if (options.preserveOriginalOrdering) {
    preserveOriginalCollectionOrdering(updater, updatedSequence);
  }

  return updatedSequence;
}

/**
 * Updates a supported value.
 */
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
