import { dump } from 'smart-yaml';
import { joinYaml } from 'smart-yaml/tests/utils';

describe('dump', () => {
  describe('Syntax', () => {
    describe('Comments', () => {
      describe('Scalars', () => {
        it('should preserve comments attached to scalars', () => {
          expect(
            dump(
              10,
              {},
              joinYaml(
                // prettier-ignore
                [
                  '# Above',
                  '42 # Aside',
                ],
              ),
            ),
          ).toStrictEqual(
            joinYaml(
              // prettier-ignore
              [
                '# Above',
                '10 # Aside',
              ],
            ),
          );
        });
      });

      describe('Maps', () => {
        it('should preserve comments attached to maps', () => {
          expect(
            dump(
              { bar: 20 },
              {},
              joinYaml(
                // prettier-ignore
                [
                  '# Above: bar',
                  'bar: # Aside: bar',
                  '  # Above: baz',
                  '  baz: 2 # Aside: baz',
                ],
              ),
            ),
          ).toStrictEqual(
            joinYaml(
              // prettier-ignore
              [
                '# Above: bar',
                'bar: # Aside: bar',
                '  20',
              ],
            ),
          );
        });

        it('should preserve comments attached to map items', () => {
          expect(
            dump(
              { foo: 20 },
              {},
              joinYaml(
                // prettier-ignore
                [
                  '# Above: foo',
                  'foo: 1 # Aside: foo',
                ],
              ),
            ),
          ).toStrictEqual(
            joinYaml(
              // prettier-ignore
              [
                '# Above: foo',
                'foo: 20 # Aside: foo',
              ],
            ),
          );
        });
      });

      describe('Sequences', () => {
        it('should preserve comments attached to sequence items (scalars)', () => {
          expect(
            dump(
              [4, 1, 3],
              {},
              joinYaml(
                // prettier-ignore
                [
                  '- 1 # Aside: 1',
                  '- 2 # Aside: 2',
                  '- 3 # Aside: 3',
                  '- 4 # Aside: 4',
                ],
              ),
            ),
          ).toStrictEqual(
            joinYaml(
              // prettier-ignore
              [
                '- 4 # Aside: 4',
                '- 1 # Aside: 1',
                '- 3 # Aside: 3',
              ],
            ),
          );
        });

        it('should preserve comments attached to sequence items (maps)', () => {
          expect(
            dump(
              [{ bar: [] }, { foo: {} }],
              {},
              joinYaml(
                // prettier-ignore
                [
                  '- foo: # Aside: foo',
                  '    a',
                  '- bar: # Aside: bar',
                  '    b',
                ],
              ),
            ),
          ).toStrictEqual(
            joinYaml(
              // prettier-ignore
              [
                '- bar: # Aside: bar',
                '    []',
                '- foo: # Aside: foo',
                '    {}',
              ],
            ),
          );
        });

        it('should preserve comments attached to sequence items (sequences)', () => {
          expect(
            dump(
              [[1, 2, 3]],
              {},
              joinYaml(
                // prettier-ignore
                [
                  '- - 1 # Aside: first 1',
                  '- - 1 # Aside: second 1',
                  '  - 2',
                ],
              ),
            ),
          ).toStrictEqual(
            joinYaml(
              // prettier-ignore
              [
                '- - 1 # Aside: second 1',
                '  - 2',
                '  - 3',
              ],
            ),
          );
        });
      });

      describe('Document', () => {
        it('should preserve comments and separators attached to the document', () => {
          expect(
            dump(
              10,
              {},
              joinYaml(
                // prettier-ignore
                [
                  '# Before: Document',
                  '---',
                  '# Above',
                  '42 # Aside',
                  '',
                  '# After: Document',
                ],
              ),
            ),
          ).toStrictEqual(
            joinYaml(
              // prettier-ignore
              [
                '# Before: Document',
                '---',
                '# Above',
                '10 # Aside',
                '',
                '# After: Document',
              ],
            ),
          );
        });
      });
    });
  });
});
