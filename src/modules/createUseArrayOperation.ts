export const createUseArrayOperation = <Value, Key = string, Params = void>(
  useArray: (params: Params) => [Value[], (array: Value[]) => void],
  getKey: (value: Value) => Key,
) => {
  return (params: Params) => {
    const [array, setArray] = useArray(params);
    const add = (value: Value) => {
      const key = getKey(value);
      if (array.find((x) => getKey(x) === key)) {
        return;
      }
      setArray([...array, value]);
    };

    const remove = (key: Key) => {
      setArray(array.filter((x) => getKey(x) !== key));
    };

    const update = (key: Key, value: Value) => {
      // 自分自身の更新もしくはユニークなKeyのみ許可
      const newKey = getKey(value);
      if (key !== newKey && array.some((x) => getKey(x) === newKey)) {
        return;
      }
      const newArray = [...array];
      const index = newArray.findIndex((x) => getKey(x) === key);
      newArray.splice(index, 1, value);
      setArray(newArray);
    };

    const exchange = (index0: number, index1: number) => {
      if (
        index0 < 0 ||
        index0 >= array.length ||
        index1 < 0 ||
        index1 >= array.length ||
        index0 === index1
      ) {
        return;
      }

      const newArray = [...array];
      const tmp = newArray[index0];
      newArray[index0] = newArray[index1];
      newArray[index1] = tmp;
      setArray(newArray);
    };

    return {
      array,
      add,
      remove,
      update,
      exchange,
    };
  };
};
