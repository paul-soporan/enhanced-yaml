import { internal } from 'enhanced-yaml';

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

    it('should set all original items to null when the original array is empty', () => {
      expect(
        pairItems({
          updated: [1, 2, 3],
          original: [],
        }),
      ).toStrictEqual([
        { updatedItem: 1, originalItem: null },
        { updatedItem: 2, originalItem: null },
        { updatedItem: 3, originalItem: null },
      ]);
    });

    it('should return an empty array when the updated array is empty', () => {
      expect(
        pairItems({
          updated: [],
          original: [1, 2, 3],
        }),
      ).toStrictEqual([]);
    });

    it("should pair duplicates with null when there aren't any original matches left", () => {
      expect(
        pairItems({
          updated: [3, 3, 2, 2, 1, 1],
          original: [3, 2, 1],
        }),
      ).toStrictEqual([
        { updatedItem: 3, originalItem: 3 },
        { updatedItem: 3, originalItem: null },
        { updatedItem: 2, originalItem: 2 },
        { updatedItem: 2, originalItem: null },
        { updatedItem: 1, originalItem: 1 },
        { updatedItem: 1, originalItem: null },
      ]);
    });

    it.todo('should pair duplicates with duplicates correctly');
  });
});
