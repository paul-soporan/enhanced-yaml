import { dump } from 'smart-yaml';
import { joinYaml } from 'smart-yaml/tests/utils';

describe('dump', () => {
  describe('Syntax', () => {
    describe('Aliases', () => {
      it('should preserve untouched anchors and aliases', () => {
        expect(
          dump(
            { foo: 1, bar: 1 },
            {},
            joinYaml(
              // prettier-ignore
              [
                'foo: &anc 1',
                'bar: *anc',
              ],
            ),
          ),
        ).toEqual(
          joinYaml(
            // prettier-ignore
            [
              'foo: &anc 1',
              'bar: *anc',
            ],
          ),
        );
      });

      it('should preserve anchors and aliases when both are updated to reference the same value', () => {
        expect(
          dump(
            { foo: 2, bar: 2 },
            {},
            joinYaml(
              // prettier-ignore
              [
                'foo: &anc 1',
                'bar: *anc',
              ],
            ),
          ),
        ).toEqual(
          joinYaml(
            // prettier-ignore
            [
              'foo: &anc 2',
              'bar: *anc',
            ],
          ),
        );
      });

      it('should preserve unused anchors when only the alias is updated to reference a new value', () => {
        expect(
          dump(
            { foo: 1, bar: 3 },
            {},
            joinYaml(
              // prettier-ignore
              [
                'foo: &anc 1',
                'bar: *anc',
              ],
            ),
          ),
        ).toEqual(
          joinYaml(
            // prettier-ignore
            [
              'foo: &anc 1',
              'bar: 3',
            ],
          ),
        );
      });

      it('should replace the alias with the value when only the anchor is updated to reference a new value', () => {
        expect(
          dump(
            { foo: 2, bar: 1 },
            {},
            joinYaml(
              // prettier-ignore
              [
                'foo: &anc 1',
                'bar: *anc',
              ],
            ),
          ),
        ).toEqual(
          joinYaml(
            // prettier-ignore
            [
              'foo: &anc 2',
              'bar: 1',
            ],
          ),
        );
      });

      it('should not alias identical values that were not originally aliases (scalars)', () => {
        expect(dump({ foo: 1, bar: 1 })).toEqual(
          joinYaml(
            // prettier-ignore
            [
              'foo: 1',
              'bar: 1',
            ],
          ),
        );
      });

      it('should not alias identical values that were not originally aliases (lists)', () => {
        expect(dump({ foo: [1, 2], bar: [1, 2] })).toEqual(
          joinYaml(
            // prettier-ignore
            [
              'foo:',
              '  - 1',
              '  - 2',
              'bar:',
              '  - 1',
              '  - 2',
            ],
          ),
        );
      });

      it('should not alias identical values that were not originally aliases (maps)', () => {
        expect(dump({ foo: { a: 1 }, bar: { a: 1 } })).toEqual(
          joinYaml(
            // prettier-ignore
            [
              'foo:',
              '  a: 1',
              'bar:',
              '  a: 1',
            ],
          ),
        );
      });

      it('should not alias identical references that were not originally aliases', () => {
        const map = { a: 1 };

        expect(dump({ foo: map, bar: map })).toEqual(
          joinYaml(
            // prettier-ignore
            [
              'foo:',
              '  a: 1',
              'bar:',
              '  a: 1',
            ],
          ),
        );
      });
    });
  });
});
