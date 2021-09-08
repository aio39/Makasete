const rotateDataUrlOfImage = async (dataUrl: string): Promise<string> => {
  const canvas = document.createElement('canvas');
  const canvasContext = canvas.getContext('2d');
  const image = new Image();
  let newDataUrl;

  newDataUrl = await new Promise((resolve, reject) => {
    image.onload = function () {
      if (!canvasContext) return;
      canvas.setAttribute('width', image.height.toString());
      canvas.setAttribute('height', image.width.toString());
      canvasContext.rotate((90 * Math.PI) / 180);
      canvasContext.drawImage(image, 0, -image.height);
      resolve(canvas.toDataURL());
    };
    image.src = dataUrl;
  });

  return newDataUrl as string;
};

export default rotateDataUrlOfImage;
