/* eslint-disable no-restricted-globals */
import { imageRotateWorkerMsg } from '../types/serviceWorkerMsg';
interface message {
  success: boolean;
  data?: string;
}

const workerCode = () => {
  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeType = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeType });
  };

  self.onmessage = function (e: MessageEvent<imageRotateWorkerMsg>) {
    if (e.data.dataUrl) {
      console.info('service worker is rotating Image');
      const { dataUrl, width: w, height: h } = e.data;
      const width = parseInt(w);
      const height = parseInt(h);
      const imageBlob = dataURItoBlob(dataUrl);
      createImageBitmap(imageBlob).then((imageBitmap) => {
        const canvas = new OffscreenCanvas(height, width);
        const canvasContext = canvas.getContext(
          '2d'
        ) as OffscreenCanvasRenderingContext2D;

        canvasContext.rotate((90 * Math.PI) / 180);
        canvasContext.drawImage(imageBitmap, 0, -height);

        canvas
          .convertToBlob({ type: 'image/jpeg', quality: 0.9 })
          .then((blob) => {
            const newDataUrl = new FileReaderSync().readAsDataURL(blob);
            self.postMessage({ success: true, data: newDataUrl } as message);
          });
      });
    }
  };
};

let code = workerCode.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

const blob = new Blob([code], { type: 'application/javascript' });
const imageRotateWorker = URL.createObjectURL(blob);

export default imageRotateWorker;
