import { clone } from 'lodash';

/**
 * The serializer preserves comments and styling by using an updater system.
 * We first use the `yaml` library to create a node representing the updated
 * value and then to parse the original source into a document whose nodes will
 * be used to preserve the required information.
 */
export interface Updater<T extends new (...args: unknown[]) => unknown> {
  /**
   * The YAML data structure the updater is operating on.
   */
  readonly structure: T;

  /**
   * A shallow clone (computed via lodash's `clone` function) of the original node.
   *
   * Used when a copy of the original node is needed after the original has already
   * been mutated by the `update` method.
   */
  readonly shallowOriginalClone: unknown;

  /**
   * After computing the required starting nodes, we go over each updated node
   * and try to match it with an old corresponding node:
   * - If the old node has the same type as the new node, we assign the updated information
   * to the old node.
   * - If the old node has a different type, we return the new node.
   *
   * We mutate the old node because we need to preserve all node references,
   * as it is required for preserving anchors and aliases.
   */
  update: (
    updated: InstanceType<T>,
    patch:
      | Partial<InstanceType<T>>
      | ((originalStructure: InstanceType<T>) => Partial<InstanceType<T>>),
  ) => InstanceType<T>;
}

/**
 * Creates an updater given a data structure and the original node.
 */
export function makeUpdater<T extends new (...args: unknown[]) => InstanceType<T>>(
  structure: T,
  original: unknown,
): Updater<T> {
  return {
    structure,

    shallowOriginalClone: clone(original),

    update: (updated, patch) => {
      if (!(original instanceof structure)) {
        return updated;
      }

      return Object.assign(original, typeof patch === 'function' ? patch(original) : patch);
    },
  };
}
