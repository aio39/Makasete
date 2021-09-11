import { useThrottle } from '@react-hook/throttle';
import React, { FC, memo, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './overwriteCropStyle.css';

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
  const [crop, setCrop] = useThrottle({ unit: '%' }, 60);

  const onLoad = useCallback(
    (img: HTMLImageElement) => {
      cropTargetImageRef.current = img;
    },
    [cropTargetImageRef]
  );

  return (
    <div>
      <ReactCrop
        src={uploadedImage as string} // 크롭할 이미지 데이터
        onImageLoaded={onLoad}
        crop={crop as any}
        onChange={(c) => setCrop(c as any)}
        onComplete={(c) => setCompletedCrop(c as any)}
        className="max-w-screen-md max-h-screen"
        onImageError={() => {
          alert('이미지에 문제가 있습니다.');
        }}
        // renderSelectionAddon={() => <div>aaaaaa</div>} 좌측 위에 붙는 요소
        // scale={3} 이미지 확대
        // zoom={3} // 드래그시 확대 비율
      />
      <style>
        {
          //   '.ReactCrop__image { max-height: 80vh; } .ReactCrop__drag-handle::after { width: 30px; height: 30px;}  '
          '.ReactCrop__image { max-height: 80vh; } .ReactCrop__drag-handle::after { width: 1.5rem; height: 1.5rem;}  '
        }
      </style>
    </div>
  );
};

export default memo(CropZone);
