const rotateDataUrlOfImage = async (dataUrl: string): Promise<string> => {
  const canvas = document.createElement('canvas');
  const canvasContext = canvas.getContext('2d');
  const image = new Image();
  let newDataUrl;

  console.time('start');
  newDataUrl = await new Promise((resolve, reject) => {
    image.onload = function () {
      if (!canvasContext) return;
      canvas.setAttribute('width', image.height.toString());
      canvas.setAttribute('height', image.width.toString());
      canvasContext.rotate((90 * Math.PI) / 180);
      canvasContext.drawImage(image, 0, -image.height);
      console.time('a');
      resolve(canvas.toDataURL('image/jpeg'));
      console.timeEnd('a');
    };
    image.src = dataUrl;
  });
  console.timeEnd('start');
  return newDataUrl as string;
};

export default rotateDataUrlOfImage;
