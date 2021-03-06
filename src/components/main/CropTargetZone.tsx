import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactCrop from 'react-image-crop';


function generateDownload(canvas: HTMLCanvasElement, crop: HTMLImageElement) {
  if (!crop || !canvas) {
    return;
  }

  canvas.toBlob(
    (blob) => {
      const previewUrl = window.URL.createObjectURL(blob);

      const anchor = document.createElement('a');
      anchor.download = 'cropPreview.png';
      anchor.href = URL.createObjectURL(blob);
      anchor.click();

      window.URL.revokeObjectURL(previewUrl);
    },
    'image/png',
    1
  );
}

const Crop = () => {
  const [upImg, setUpImg] = useState<string>();
  const imgRef = useRef<any>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  // const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 16 / 9 });
  const [crop, setCrop] = useState({ unit: '%', width: 30 });
  const [completedCrop, setCompletedCrop] = useState<HTMLImageElement | null>(
    null
  );

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result as string));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    // 하나의 CSS 픽셀을 그릴 때 사용해야 하는 장치 픽셀의 수
    //  레티나 디스플레이에서 추가 픽셀 밀접도로 해상도를 올릴 수 있다.
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
  }, [completedCrop]);

  return (
    <div className="App">
      <div>
        <input type="file" accept="image/*" onChange={onSelectFile} />
      </div>
      <ReactCrop
        src={upImg as string}
        onImageLoaded={onLoad}
        crop={crop as any}
        onChange={(c) => setCrop(c as any)}
        onComplete={(c) => setCompletedCrop(c as any)}
      />
      <div>
        "preview"
        <canvas
          ref={previewCanvasRef}
          // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
          style={{
            width: Math.round(completedCrop?.width ?? 0),
            height: Math.round(completedCrop?.height ?? 0),
          }}
        />
      </div>
      <button
        type="button"
        disabled={!completedCrop?.width || !completedCrop?.height}
        onClick={() =>
          generateDownload(
            previewCanvasRef.current as HTMLCanvasElement,
            completedCrop as HTMLImageElement
          )
        }
      >
        Download cropped image
      </button>
    </div>
  );
};

export default Crop;
