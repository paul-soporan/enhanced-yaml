import { computeSimilarityScore, SimilarityScore } from '../checks/similarity';

/**
 * Pairs all updated items with an original item or null,
 * based on a similarity score system.
 */
export function pairItems<UpdatedItem, OriginalItem>({
  updated,
  original,
}: {
  updated: UpdatedItem[];
  original: OriginalItem[];
}): Array<{ updatedItem: UpdatedItem; originalItem: OriginalItem | null }> {
  const items = updated
    .flatMap((updatedItem) =>
      original.map(
        (originalItem) =>
          [updatedItem, originalItem, computeSimilarityScore(updatedItem, originalItem)] as [
            UpdatedItem,
            OriginalItem,
            SimilarityScore,
          ],
      ),
    )
    .sort(([aUpdatedItem, aOriginalItem, aScore], [bUpdatedItem, bOriginalItem, bScore]) => {
      if (aScore !== bScore) {
        return aScore - bScore;
      }

      const indexOfAUpdatedItem = updated.indexOf(aUpdatedItem);
      const indexOfBUpdatedItem = updated.indexOf(bUpdatedItem);

      if (indexOfAUpdatedItem !== indexOfBUpdatedItem) {
        return indexOfBUpdatedItem - indexOfAUpdatedItem;
      }

      return original.indexOf(bOriginalItem) - original.indexOf(aOriginalItem);
    })
    .reverse();

  const remainingUpdatedItems = new Set(updated);
  const remainingOriginalItems = new Set(original);

  interface ItemPair {
    updatedItem: UpdatedItem;
    originalItem: OriginalItem | null;
    score: number;
  }

  const itemPairs = items
    .map(([updatedItem, originalItem, score]) => {
      // This updated item has already been paired, we can skip this iteration.
      if (!remainingUpdatedItems.has(updatedItem)) {
        return null;
      }

      // This original item has already been paired, we can skip this iteration.
      if (remainingOriginalItems.size > 0 && !remainingOriginalItems.has(originalItem)) {
        return null;
      }

      // We delete the updated item so that further iterations know that it's already been paired
      remainingUpdatedItems.delete(updatedItem);

      if (
        // If the updated item hasn't already been paired and we've run
        // out of original items, we pair the updated item with null
        remainingOriginalItems.size === 0 ||
        // If the items are non-similar, we pair the updated item with null.
        // This is because we sort the pairs by score, so if the score is 0, we can
        // be sure that this item won't be included in a pair with a higher score.
        score === 0
      ) {
        return { updatedItem, originalItem: null };
      }

      // We delete the original item so that further iterations know that it's already been paired
      remainingOriginalItems.delete(originalItem);

      return { updatedItem, originalItem };
    })
    .filter((pair) => pair !== null) as ItemPair[];

  // We pair the items again to make sure that we preserve the order of
  // the updated array and that we don't lose any of the updated items.
  return updated.map((updatedItem) => {
    const index = itemPairs.findIndex(
      ({ updatedItem: updatedItemCandidate }) => updatedItemCandidate === updatedItem,
    );
    if (index === -1) {
      return { updatedItem, originalItem: null };
    }

    const [{ originalItem }] = itemPairs.splice(index, 1);

    return { updatedItem, originalItem };
  });
}
