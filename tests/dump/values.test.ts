import { dump } from 'smart-yaml';
import { joinYaml } from 'smart-yaml/tests/utils';

describe('dump', () => {
  describe('Values', () => {
    it('should dump primitives as scalars', () => {
      expect(dump(10)).toStrictEqual('10\n');
    });

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

    it('should dump objects as maps', () => {
      expect(dump({ a: 1, b: 2 })).toStrictEqual(
        // prettier-ignore
        joinYaml([
          'a: 1',
          'b: 2',
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
  });
});
