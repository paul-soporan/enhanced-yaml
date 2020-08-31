import { dump } from 'enhanced-yaml';
import { joinYaml } from 'enhanced-yaml/tests/utils';

describe('dump', () => {
  describe('Syntax', () => {
    describe('Styles', () => {
      describe('Scalars', () => {
        it('should preserve unquoted scalars where possible', () => {
          expect(
            dump(
              'bar',
              {},
              joinYaml(
                // prettier-ignore
                [
                  'foo',
                ],
              ),
            ),
          ).toStrictEqual(
            joinYaml(
              // prettier-ignore
              [
                'bar',
              ],
            ),
          );
        });

        it('should not preserve unquoted scalars where not possible', () => {
          expect(
            dump(
              '@bar',
              {},
              joinYaml(
                // prettier-ignore
                [
                  'foo',
                ],
              ),
            ),
          ).toStrictEqual(
            joinYaml(
              // prettier-ignore
              [
                '"@bar"',
              ],
            ),
          );
        });

        it('should preserve double quoted scalars', () => {
          expect(
            dump(
              'bar',
              {},
              joinYaml(
                // prettier-ignore
                [
                  '"foo"',
                ],
              ),
            ),
          ).toStrictEqual(
            joinYaml(
              // prettier-ignore
              [
                '"bar"',
              ],
            ),
          );
        });

        it('should preserve double quoted scalars even where escaping is needed', () => {
          expect(
            dump(
              '"bar',
              {},
              joinYaml(
                // prettier-ignore
                [
                  '"foo"',
                ],
              ),
            ),
          ).toStrictEqual(
            joinYaml(
              // prettier-ignore
              [
                '"\\"bar"',
              ],
            ),
          );
        });

        it('should preserve single quoted scalars', () => {
          expect(
            dump(
              'bar',
              {},
              joinYaml(
                // prettier-ignore
                [
                  "'foo'",
                ],
              ),
            ),
          ).toStrictEqual(
            joinYaml(
              // prettier-ignore
              [
                "'bar'",
              ],
            ),
          );
        });

        it('should preserve single quoted scalars even where escaping is needed', () => {
          expect(
            dump(
              "'bar",
              {},
              joinYaml(
                // prettier-ignore
                [
                  "'foo'",
                ],
              ),
            ),
          ).toStrictEqual(
            joinYaml(
              // prettier-ignore
              [
                "'''bar'",
              ],
            ),
          );
        });

        it('should preserve folded block scalars', () => {
          expect(
            dump(
              'bar',
              {},
              joinYaml(
                // prettier-ignore
                [
                ">-",
                "foo",
              ],
              ),
            ),
          ).toStrictEqual(
            joinYaml(
              // prettier-ignore
              [
              ">-",
              "bar",
            ],
            ),
          );
        });

        it('should preserve literal block scalars', () => {
          expect(
            dump(
              'bar',
              {},
              joinYaml(
                // prettier-ignore
                [
                "|-",
                "foo",
              ],
              ),
            ),
          ).toStrictEqual(
            joinYaml(
              // prettier-ignore
              [
              "|-",
              "bar",
            ],
            ),
          );
        });
      });

      describe('Maps', () => {
        it('should preserve block style maps', () => {
          expect(
            dump(
              { foo: { bar: 100, baz: 200 } },
              {},
              joinYaml(
                // prettier-ignore
                [
                  'foo:',
                  '  bar: 1',
                  '  baz: 2',
                ],
              ),
            ),
          ).toStrictEqual(
            joinYaml(
              // prettier-ignore
              [
                'foo:',
                '  bar: 100',
                '  baz: 200',
              ],
            ),
          );
        });

        it('should preserve flow style maps', () => {
          expect(
            dump(
              { foo: { bar: 100, baz: 200 } },
              {},
              joinYaml(
                // prettier-ignore
                [
                  'foo: { bar: 1, baz: 2 }',
                ],
              ),
            ),
          ).toStrictEqual(
            joinYaml(
              // prettier-ignore
              [
                'foo: { bar: 100, baz: 200 }',
              ],
            ),
          );
        });
      });

      describe('Sequences', () => {
        it('should preserve block style sequences', () => {
          expect(
            dump(
              [11, 12, 13],
              {},
              joinYaml(
                // prettier-ignore
                [
                  '- 1',
                  '- 2',
                  '- 3',
                ],
              ),
            ),
          ).toStrictEqual(
            joinYaml(
              // prettier-ignore
              [
                '- 11',
                '- 12',
                '- 13',
              ],
            ),
          );
        });

        it('should preserve flow style sequences', () => {
          expect(
            dump(
              [11, 12, 13],
              {},
              joinYaml(
                // prettier-ignore
                [
                  '[ 1, 2, 3 ]',
                ],
              ),
            ),
          ).toStrictEqual(
            joinYaml(
              // prettier-ignore
              [
                '[ 11, 12, 13 ]',
              ],
            ),
          );
        });
      });
    });
  });
});
