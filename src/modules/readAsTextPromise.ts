export const readAsTextPromise = (blob: Blob) => {
  const reader = new FileReader();
  return new Promise<string>((resolve, reject) => {
    reader.readAsText(blob);
    reader.onload = () => {
      if (reader.result && typeof reader.result == "string") {
        resolve(reader.result);
      } else {
        reject("Invalid format");
      }
    };
  });
};
