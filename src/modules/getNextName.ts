export const getNextName = <T>(
  values: T[],
  baseName: string,
  callback: (value: T) => string,
) => {
  const names = new Set(values.map(callback));
  if (!names.has(baseName)) {
    return baseName;
  }

  for (let i = 0; i < 99999; i++) {
    const nextName = `${baseName} ${i}`;
    if (!names.has(nextName)) {
      return nextName;
    }
  }
  throw new Error("Maximum calls");
};
