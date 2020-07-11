import { computeSimilarityScore, SimilarityScore } from './checks/similarity';
import { mapAndFilter } from './mapAndFilter';

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

  return mapAndFilter(items, ([updatedItem, originalItem, score]) => {
    if (!remainingUpdatedItems.has(updatedItem)) {
      return mapAndFilter.skip;
    }

    if (remainingOriginalItems.size > 0 && !remainingOriginalItems.has(originalItem)) {
      return mapAndFilter.skip;
    }

    remainingUpdatedItems.delete(updatedItem);

    if (remainingOriginalItems.size === 0 || score === 0) {
      return { updatedItem, originalItem: null };
    }

    remainingOriginalItems.delete(originalItem);

    return { updatedItem, originalItem };
  }).sort(
    ({ updatedItem: aUpdatedItem }, { updatedItem: bUpdatedItem }) =>
      updated.indexOf(aUpdatedItem) - updated.indexOf(bUpdatedItem),
  );
}
