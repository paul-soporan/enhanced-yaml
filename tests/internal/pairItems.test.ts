import { internal } from 'smart-yaml';

const { pairItems } = internal;

describe('internal', () => {
  describe('pairItems', () => {
    it('should preserve the ordering of the updated items', () => {
      expect(
        pairItems({
          updated: [3, 2, 1],
          original: [1, 2, 3],
        }),
      ).toStrictEqual([
        { updatedItem: 3, originalItem: 3 },
        { updatedItem: 2, originalItem: 2 },
        { updatedItem: 1, originalItem: 1 },
      ]);
    });

    it('should set the original item to null when no match for an updated item is found', () => {
      expect(
        pairItems({
          updated: [4, 3, 2],
          original: [2, 3],
        }),
      ).toStrictEqual([
        { updatedItem: 4, originalItem: null },
        { updatedItem: 3, originalItem: 3 },
        { updatedItem: 2, originalItem: 2 },
      ]);
    });

    it('should ignore original items that are not matched to updated items', () => {
      expect(
        pairItems({
          updated: [1],
          original: [1, 2, 3, 4, 5],
        }),
      ).toStrictEqual([{ updatedItem: 1, originalItem: 1 }]);
    });
  });
});
