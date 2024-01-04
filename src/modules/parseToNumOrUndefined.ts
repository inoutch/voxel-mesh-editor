export const parseToNumOrUndefined = (value: string | undefined) => {
  if (value === undefined) {
    return undefined;
  }

  const ret = Number(value);
  return Number.isInteger(ret) ? ret : undefined;
};
