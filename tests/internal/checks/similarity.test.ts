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
        const updated = ['a', 'b', 'c'];

        const firstOneMatch = similarity.computeSimilarityScore(updated, ['a']);
        const secondOneMatch = similarity.computeSimilarityScore(updated, ['a', 'd']);

        const firstTwoMatch = similarity.computeSimilarityScore(updated, ['a', 'b']);
        const secondTwoMatch = similarity.computeSimilarityScore(updated, ['a', 'c']);

        expect(firstOneMatch).toStrictEqual(secondOneMatch);
        expect(firstTwoMatch).toStrictEqual(secondTwoMatch);

        expect(firstOneMatch).toBeLessThan(firstTwoMatch);
      });
    });
  });
});
