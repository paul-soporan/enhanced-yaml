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
          ).toEqual(
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
          ).toEqual(
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
          ).toEqual(
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
          ).toEqual(
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
