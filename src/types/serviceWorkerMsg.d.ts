import { Crop } from 'react-image-crop';

interface drawData {
  crop: Crop;
  scaleX: number;
  scaleY: number;
  pixelRatio: number;
}

interface imageToJpegDataUrlWorkerMsg {
  imageUrl: string;
  drawData: drawData;
}
