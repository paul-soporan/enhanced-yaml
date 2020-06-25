export interface Updater<T> {
  update: (updated: T, patch: Partial<T> | ((originalStructure: T) => Partial<T>)) => T;
}

export function makeUpdater<T extends new (...args: unknown[]) => InstanceType<T>>(
  structure: T,
  original: unknown,
): Updater<InstanceType<T>> {
  return {
    update: (updated, patch) => {
      if (!(original instanceof structure)) {
        return updated;
      }

      return Object.assign(original, typeof patch === 'function' ? patch(original) : patch);
    },
  };
}
