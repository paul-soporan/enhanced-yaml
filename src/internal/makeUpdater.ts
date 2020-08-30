import { clone } from 'lodash';

export interface Updater<T extends new (...args: unknown[]) => unknown> {
  readonly structure: T;

  readonly shallowOriginalClone: unknown;

  update: (
    updated: InstanceType<T>,
    patch:
      | Partial<InstanceType<T>>
      | ((originalStructure: InstanceType<T>) => Partial<InstanceType<T>>),
  ) => InstanceType<T>;
}

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
