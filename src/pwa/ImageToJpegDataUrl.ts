/* eslint-disable no-restricted-globals */
import { imageToJpegDataUrlWorkerMsg } from '../types/serviceWorkerMsg';

const workerCode = () => {
  function dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeType = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeType });
  }

  const offscreen = new OffscreenCanvas(0, 0);
  let imageBitmap: ImageBitmap;
  self.onmessage = function (e: MessageEvent<imageToJpegDataUrlWorkerMsg>) {
    if (e.data.imageUrl) {
      const imageBlob = dataURItoBlob(e.data.imageUrl);
      createImageBitmap(imageBlob).then((result) => {
        imageBitmap = result;
      });
    }
    if (e.data.drawData) {
      const { crop, scaleX, scaleY, pixelRatio } = e.data.drawData;
      offscreen.width = crop.width * pixelRatio * scaleX;
      offscreen.height = crop.height * pixelRatio * scaleY;

      const ctx = offscreen.getContext(
        '2d'
      ) as OffscreenCanvasRenderingContext2D;

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(
        imageBitmap,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );

      offscreen
        .convertToBlob({ type: 'image/jpeg', quality: 0.7 })
        .then((blob) => {
          const objectUrl = URL.createObjectURL(blob);
          self.postMessage(objectUrl);
        });
    }
  };
};

let code = workerCode.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

const blob = new Blob([code], { type: 'application/javascript' });
const imageToJpegDataUrlWorker = URL.createObjectURL(blob);

// module.exports = worker_script;

export default imageToJpegDataUrlWorker;
