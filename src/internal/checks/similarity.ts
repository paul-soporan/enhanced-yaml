import { Alias, Scalar, Pair, Collection } from 'yaml/types';
import { areValuesEqual } from './equality';

/**
 * A number between 0 and 1.
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

/**
 * Computes the similarity score between 2 values.
 */
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

  // Includes the case of non-equal primitives.
  return 0;
}
