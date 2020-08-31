import { load } from 'enhanced-yaml';
import { YAMLSemanticError } from 'yaml/util';

describe('load', () => {
  describe('Errors', () => {
    it('should throw the first error when there is an error inside the parsed document', () => {
      expect(() => load('foo: @bar')).toThrow(YAMLSemanticError);
    });
  });
});
