export const filterByUniqueKey = <Value, Key = string>(
  values: Value[],
  getKey: (value: Value) => Key,
) => {
  const ret: Value[] = [];
  const set = new Set<Key>();
  for (const value of values) {
    const key = getKey(value);
    if (!set.has(key)) {
      ret.push(value);
      set.add(key);
    }
  }
  return ret;
};
