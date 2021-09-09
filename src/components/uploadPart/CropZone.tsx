import { useThrottle } from '@react-hook/throttle';
import React, { FC, memo, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ICropZone {
  cropTargetImageRef: any;
  uploadedImage: any;
  setCompletedCrop: any;
}

const CropZone: FC<ICropZone> = ({
  cropTargetImageRef,
  uploadedImage,
  setCompletedCrop,
}) => {
  const [crop, setCrop] = useThrottle({ unit: '%' }, 20);

  const onLoad = useCallback((img: HTMLImageElement) => {
    cropTargetImageRef.current = img;
  }, []);

  return (
    <div>
      <ReactCrop
        src={uploadedImage as string} // 크롭할 이미지 데이터
        onImageLoaded={onLoad}
        crop={crop as any}
        onChange={(c) => setCrop(c as any)}
        onComplete={(c) => setCompletedCrop(c as any)}
        className="max-w-screen-md max-h-screen"
      />
      <style>{'.ReactCrop__image { max-height: 80vh; }'}</style>
    </div>
  );
};

export default memo(CropZone);
