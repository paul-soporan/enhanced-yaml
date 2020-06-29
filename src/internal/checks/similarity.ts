import { Alias, Scalar, Pair, Collection } from 'yaml/types';
import { areValuesEqual } from './equality';

/**
 * A number between -1 and 1.
 *
 * Meaning:
 * - -1 -> non-equal types and non-similar values
 * - 0 -> equal types and non-similar values
 * - 1 -> equal types and equal values
 *
 * Floating-point numbers represent the average between the scores of the elements in a list.
 *
 * All scores higher than -1 represent at least a partial match.
 *
 * Used to pick the most similar value in a list to a given value.
 */
export type SimilarityScore = number;

/**
 * Computes the similarity score between 2 Arrays, based on their contents.
 */
export function computeArraySimilarityScore(a: unknown[], b: unknown[]): SimilarityScore {
  /**
   * The similarity scores between each item in the first list and the best matching item in the second list.
   * This operation is symmetric.
   */
  const scores = a.map((aItem) => {
    /**
     * The similarity scores between the item in the first list and each item in the second list.
     */
    const partialScores = b.map((bItem) => computeSimilarityScore(aItem, bItem));

    return Math.max(...partialScores);
  });

  return (
    scores.reduce((accumulator, current) => accumulator + current, 0) / Math.max(a.length, b.length)
  );
}

/**
 * Computes the similarity score between 2 Scalars, based on their values.
 */
export function computeScalarSimilarityScore(a: Scalar, b: Scalar): SimilarityScore {
  return computeSimilarityScore(a.value, b.value);
}

/**
 * Computes the similarity score between 2 Pairs, based on their keys and values.
 * If the keys aren't equal, we don't consider the Pairs as being similar.
 */
export function computePairSimilarityScore(a: Pair, b: Pair): SimilarityScore {
  if (!areValuesEqual(a.key, b.key)) {
    return 0;
  }

  return 0.5 + 0.5 * computeSimilarityScore(a.value, b.value);
}

/**
 * Computes the similarity score between 2 Collections (e.g. YAMLMap, YAMLSeq), based on their items.
 */
export function computeCollectionSimilarityScore(a: Collection, b: Collection): SimilarityScore {
  return computeSimilarityScore(a.items, b.items);
}

export function computeSimilarityScore(a: unknown, b: unknown): SimilarityScore {
  if (areValuesEqual(a, b)) {
    return 1;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    return computeArraySimilarityScore(a, b);
  }

  if (a instanceof Alias) {
    return computeSimilarityScore(a.source, b);
  }

  if (b instanceof Alias) {
    return computeSimilarityScore(a, b.source);
  }

  if (a instanceof Scalar && b instanceof Scalar) {
    return computeScalarSimilarityScore(a, b);
  }

  if (a instanceof Pair && b instanceof Pair) {
    return computePairSimilarityScore(a, b);
  }

  if (a instanceof Collection && b instanceof Collection) {
    return computeCollectionSimilarityScore(a, b);
  }

  /**
   * Used to disambiguate between 2 cases:
   * - equal types but non-similar values (e.g. 2 arrays without common elements)
   * - non-equal types and non-similar values (e.g. 1 array and 1 object)
   *
   * The former should produce a higher score than the latter.
   */
  if (Object.prototype.toString.call(a) !== Object.prototype.toString.call(b)) {
    return -1;
  }

  return 0;
}

export function getMostSimilarOriginalItem(
  updatedItem: unknown,
  original: Array<unknown>,
  usedIndices: Set<number>,
): unknown | null {
  const scores = original.map((originalItem) => computeSimilarityScore(originalItem, updatedItem));

  const maxScore = Math.max(...scores);

  const maxScoreIndex = scores.findIndex(
    (score, index) => score === maxScore && !usedIndices.has(index),
  );

  usedIndices.add(maxScoreIndex);

  /**
   * -1 can mean 2 things:
   * 1) There are no unused array elements remaining.
   * 2) The score is -1, which means that types don't match.
   */
  return maxScoreIndex !== -1 ? original[maxScoreIndex] : null;
}
