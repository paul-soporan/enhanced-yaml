import { Node } from 'yaml/types';

export function assertNode(value: unknown): asserts value is Node {
  if (!(value instanceof Node)) {
    throw new TypeError(`Expected a YAML Node, got a ${typeof value}`);
  }
}
