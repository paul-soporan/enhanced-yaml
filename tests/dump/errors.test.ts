import { dump } from 'smart-yaml';
import { YAMLSemanticError } from 'yaml/util';

describe('dump', () => {
  describe('Errors', () => {
    it('should throw the first error when there is an error inside the parsed original document', () => {
      expect(() => dump({ foo: 'baz' }, {}, 'foo: @bar')).toThrow(YAMLSemanticError);
    });

    it('should throw an error when unable to create a node from the updated value', () => {
      expect(() => dump({ foo: () => {} })).toThrow('Tag not resolved for Function value');
    });
  });
});
