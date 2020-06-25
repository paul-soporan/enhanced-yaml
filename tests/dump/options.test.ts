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
  });
});
