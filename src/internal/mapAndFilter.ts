const mapAndFilterSkip = Symbol('mapAndFilterSkip');

export function mapAndFilter<In, Out>(
  array: In[],
  callback: (value: In) => Out | typeof mapAndFilterSkip,
): Out[] {
  return array
    .map((value) => callback(value))
    .filter((value) => value !== mapAndFilterSkip) as Out[];
}

mapAndFilter.skip = mapAndFilterSkip;
