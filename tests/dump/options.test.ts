import { dump } from 'smart-yaml';
import { joinYaml } from 'smart-yaml/tests/utils';

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
  });
});
