import { Scalar, Pair } from 'yaml/types';
import { internal } from 'smart-yaml';

const {
  checks: { similarity },
} = internal;

describe('internal', () => {
  describe('checks', () => {
    describe('similarity', () => {
      it('should compute a similarity score of 1 for equal values', () => {
        expect(similarity.computeSimilarityScore('foo', 'foo')).toStrictEqual(1);
      });

      it('should compute a similarity score of 0 for non-equal primitives', () => {
        expect(similarity.computeSimilarityScore('foo', 'bar')).toStrictEqual(0);
      });

      it('should compute a similarity score of -1 for primitives with different types', () => {
        expect(similarity.computeSimilarityScore('foo', 1)).toStrictEqual(-1);
      });

      it('should compute a similarity score of 1 for arrays with identical elements', () => {
        expect(similarity.computeSimilarityScore(['a'], ['a'])).toStrictEqual(1);
      });

      it('should compute a similarity score of 0.5 for arrays with half identical elements', () => {
        expect(similarity.computeSimilarityScore(['a', 'b'], ['a', 'c'])).toStrictEqual(0.5);
      });

      it('should compute a similarity score of 1 for scalars with equal values', () => {
        expect(similarity.computeSimilarityScore(new Scalar(1), new Scalar(1))).toStrictEqual(1);
      });

      it('should compute a similarity score of 1 for pairs with equal keys and values', () => {
        expect(
          similarity.computeSimilarityScore(new Pair('foo', 1), new Pair('foo', 1)),
        ).toStrictEqual(1);
      });

      it('should compute a similarity score of 0 for pairs with non-equal keys', () => {
        expect(
          similarity.computeSimilarityScore(new Pair('foo', 1), new Pair('bar', 1)),
        ).toStrictEqual(0);
      });

      it('should compute a similarity score of 0.5 for pairs with equal keys but non-similar values', () => {
        expect(
          similarity.computeSimilarityScore(new Pair('foo', 1), new Pair('foo', 0)),
        ).toStrictEqual(0.5);
      });

      test('similarity scores for arrays should be proportional to the number of matching elements', () => {
        const array = ['a', 'b', 'c'];

        const firstOneMatch = similarity.computeSimilarityScore(array, ['a']);
        const secondOneMatch = similarity.computeSimilarityScore(array, ['a', 'd']);

        const firstTwoMatch = similarity.computeSimilarityScore(array, ['a', 'b']);
        const secondTwoMatch = similarity.computeSimilarityScore(array, ['a', 'c']);

        expect(firstOneMatch).toStrictEqual(secondOneMatch);
        expect(firstTwoMatch).toStrictEqual(secondTwoMatch);

        expect(firstOneMatch).toBeLessThan(firstTwoMatch);
      });

      test('similarity scores should be higher when the types match', () => {
        const firstUniqueArray = ['a'];
        const secondUniqueArray = ['b'];

        const firstUniqueObject = { a: 1 };
        const secondUniqueObject = { b: 1 };

        expect(
          similarity.computeSimilarityScore(firstUniqueArray, secondUniqueArray),
        ).toBeGreaterThan(similarity.computeSimilarityScore(firstUniqueArray, firstUniqueObject));

        expect(
          similarity.computeSimilarityScore(firstUniqueObject, secondUniqueObject),
        ).toBeGreaterThan(similarity.computeSimilarityScore(firstUniqueObject, firstUniqueArray));
      });
    });
  });
});
