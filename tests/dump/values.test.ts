import { dump } from 'enhanced-yaml';
import { joinYaml } from 'enhanced-yaml/tests/utils';

describe('dump', () => {
  describe('Values', () => {
    describe('Scalars', () => {
      it('should dump primitives as scalars', () => {
        expect(dump(10)).toStrictEqual('10\n');
      });

      it('should dump null as null', () => {
        expect(dump(null)).toStrictEqual('null\n');
      });
    });

    describe('Maps', () => {
      it('should dump objects as maps', () => {
        expect(dump({ a: 1, b: 2 })).toStrictEqual(
          // prettier-ignore
          joinYaml([
            'a: 1',
            'b: 2',
          ]),
        );
      });

      it('should dump empty objects as flow maps', () => {
        expect(dump({ a: {} })).toStrictEqual(
          // prettier-ignore
          joinYaml([
            'a: {}',
          ]),
        );
      });

      it('should dump maps as maps', () => {
        expect(
          dump(
            new Map([
              ['a', 1],
              ['b', 2],
            ]),
          ),
        ).toStrictEqual(
          // prettier-ignore
          joinYaml([
            'a: 1',
            'b: 2',
          ]),
        );
      });

      it('should dump empty maps as flow maps', () => {
        expect(dump({ a: new Map() })).toStrictEqual(
          // prettier-ignore
          joinYaml([
            'a: {}',
          ]),
        );
      });
    });

    describe('Sequences', () => {
      it('should dump arrays as sequences', () => {
        expect(dump([1, 2, 3])).toStrictEqual(
          // prettier-ignore
          joinYaml([
            '- 1',
            '- 2',
            '- 3',
          ]),
        );
      });

      it('should dump empty arrays as flow sequences', () => {
        expect(dump([])).toStrictEqual(
          // prettier-ignore
          joinYaml([
            '[]',
          ]),
        );
      });
    });

    describe('Sets', () => {
      it('should dump objects with null values as sets', () => {
        expect(dump({ a: null, b: null })).toStrictEqual(
          // prettier-ignore
          joinYaml([
            '? a',
            '? b',
          ]),
        );
      });

      it('should dump maps with null values as sets', () => {
        expect(
          dump(
            new Map([
              ['a', null],
              ['b', null],
            ]),
          ),
        ).toStrictEqual(
          // prettier-ignore
          joinYaml([
            '? a',
            '? b',
          ]),
        );
      });
    });
  });
});
