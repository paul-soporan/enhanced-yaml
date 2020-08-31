import { dump } from 'enhanced-yaml';
import { joinYaml } from 'enhanced-yaml/tests/utils';

describe('dump', () => {
  describe('Options', () => {
    test('indent', () => {
      expect(dump({ a: { b: 'c' } }, { indent: 4 })).toStrictEqual(
        // prettier-ignore
        joinYaml([
          'a:',
          '    b: c',
        ]),
      );
    });

    test('indentBlockSequences', () => {
      expect(dump({ foo: [1, 2, 3] }, { indentBlockSequences: false })).toStrictEqual(
        // prettier-ignore
        joinYaml([
          'foo:',
          '- 1',
          '- 2',
          '- 3'
        ]),
      );
    });

    describe('sortMapEntries', () => {
      it('should preserve the ordering of the items when false', () => {
        expect(dump({ foo: 1, bar: 2 }, { sortMapEntries: false })).toStrictEqual(
          // prettier-ignore
          joinYaml([
            'foo: 1',
            'bar: 2',
          ]),
        );
      });

      it('should sort the items by comparing them via `<` when true', () => {
        expect(dump({ foo: 1, bar: 2 }, { sortMapEntries: true })).toStrictEqual(
          // prettier-ignore
          joinYaml([
            'bar: 2',
            'foo: 1',
          ]),
        );
      });

      it('should sort the items according to the compare function when one is set', () => {
        const itemOrder = ['baz', 'foo', 'bar'];

        expect(
          dump(
            { foo: 1, bar: 2, baz: 3 },
            {
              sortMapEntries: (a, b) => {
                const indexOfA = itemOrder.indexOf(a.key as string);
                const indexOfB = itemOrder.indexOf(b.key as string);

                return indexOfA - indexOfB;
              },
            },
          ),
        ).toStrictEqual(
          // prettier-ignore
          joinYaml([
            'baz: 3',
            'foo: 1',
            'bar: 2',
          ]),
        );
      });
    });

    describe('preserveOriginalOrdering', () => {
      describe('Maps', () => {
        it('should preserve the original ordering of map keys', () => {
          expect(
            dump(
              { foo: 1, bar: 2, baz: 3 },
              { preserveOriginalOrdering: true },
              joinYaml(
                // prettier-ignore
                [
                  'baz: 100',
                  'foo: 200',
                  'bar: 300',
                ],
              ),
            ),
          ).toStrictEqual(
            // prettier-ignore
            joinYaml([
              'baz: 3',
              'foo: 1',
              'bar: 2',
            ]),
          );
        });

        it('should put non-original map keys to the bottom', () => {
          expect(
            dump(
              { foo: 1, bar: 2, baz: 3 },
              { preserveOriginalOrdering: true },
              joinYaml(
                // prettier-ignore
                [
                  'baz: 100',
                  'bar: 300',
                ],
              ),
            ),
          ).toStrictEqual(
            // prettier-ignore
            joinYaml([
              'baz: 3',
              'bar: 2',
              'foo: 1',
            ]),
          );
        });
      });

      describe('Sequences', () => {
        it('should preserve the original ordering of sequence items', () => {
          expect(
            dump(
              [1, 2, 3],
              { preserveOriginalOrdering: true },
              joinYaml(
                // prettier-ignore
                [
                  '- 2',
                  '- 3',
                  '- 1',
                ],
              ),
            ),
          ).toStrictEqual(
            // prettier-ignore
            joinYaml([
              '- 2',
              '- 3',
              '- 1',
            ]),
          );
        });

        it('should put non-original sequence items to the bottom', () => {
          expect(
            dump(
              [1, 2, 3],
              { preserveOriginalOrdering: true },
              joinYaml(
                // prettier-ignore
                [
                  '- 2',
                  '- 1',
                ],
              ),
            ),
          ).toStrictEqual(
            // prettier-ignore
            joinYaml([
              '- 2',
              '- 1',
              '- 3',
            ]),
          );
        });
      });
    });
  });
});
