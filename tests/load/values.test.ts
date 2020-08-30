import { load } from 'smart-yaml';

describe('load', () => {
  describe('Values', () => {
    describe('Non-values', () => {
      it('should load empty strings as null', () => {
        expect(load('')).toBeNull();
      });

      it('should load whitespace-only strings as null', () => {
        expect(load('\n \t \n')).toBeNull();
      });
    });

    describe('Maps', () => {
      it('should load empty map items as null', () => {
        expect(load('foo:')).toStrictEqual({ foo: null });
        expect(load('foo: ')).toStrictEqual({ foo: null });
        expect(load('foo:\n')).toStrictEqual({ foo: null });
      });
    });
  });
});
