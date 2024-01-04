export const readAsArrayBufferPromise = (blob: Blob) => {
  const reader = new FileReader();
  return new Promise<ArrayBuffer>((resolve, reject) => {
    reader.readAsArrayBuffer(blob);
    reader.onload = () => {
      if (reader.result && reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject("Invalid format");
      }
    };
  });
};
