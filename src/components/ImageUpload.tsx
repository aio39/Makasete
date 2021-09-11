import axios from 'axios';
import React, { useCallback, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { isLoadingOcrState, textState } from '../recoil/atom';
import { dataURItoBlob } from '../util/dataURItoBlob';
import rotateDataUrlOfImage from '../util/rotateImage';
import CropZone from './uploadPart/CropZone';
import ImageInputZone from './uploadPart/ImageInputZone';

const ImageUpload = () => {
  // const worker = useMemo(() => {
  //   const worker = new Worker(imageToJpegDataUrlWorker);
  //   worker.onmessage = (m) => {
  //     console.log('msg from worker: ', m.data);
  //   };
  //   return worker;
  // }, []);
  const [completedCrop, setCompletedCrop] = useState<HTMLImageElement | null>(
    null
  );
  const [uploadedImage, setUploadedImage] = useState<Object | null>(null);
  const cropTargetImageRef = useRef<HTMLImageElement>();

  const setIsLoadingOcr = useSetRecoilState(isLoadingOcrState);

  const [croppedImageDataUrlList, setCroppedImageDataUrlList] = useState<
    string[]
  >([]);

  const setTextState = useSetRecoilState(textState);

  const handleSendToServer = useCallback(async () => {
    setIsLoadingOcr(true);

    const result = await Promise.all(
      croppedImageDataUrlList.map(async (dataUrl) => {
        const params = new FormData();
        params.append('image', dataURItoBlob(dataUrl));
        try {
          const result = await axios.post<string[][]>(
            process.env.REACT_APP_OCR_URL as string,
            params,
            {
              headers: {
                'content-type': 'multipart/form-data',
              },
              withCredentials: true,
            }
          );

          return result.data;
        } catch (error) {
          console.error(error);
          alert(error);
          throw new Error('error');
        }
      })
    )
      .catch((err) => {
        return;
      })
      .finally(() => {
        setIsLoadingOcr(false);
      });

    if (!result) return;
    setCroppedImageDataUrlList(() => []);
    setTextState((pre) => [...pre, ...(result as string[][][])]);
  }, [
    setIsLoadingOcr,
    croppedImageDataUrlList,
    setTextState,
    setCroppedImageDataUrlList,
  ]);

  const handleConfirmCrop = useCallback(() => {
    if (
      !completedCrop ||
      // !previewCanvasRef.current ||
      !cropTargetImageRef.current
    ) {
      return;
    }

    const image = cropTargetImageRef.current;
    const canvas = document.createElement('canvas');
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

    setCroppedImageDataUrlList((pre) => [
      ...pre,
      canvas.toDataURL('image/jpeg', 0.7) as string,
    ]);
  }, [completedCrop]);

  const handleDeleteCrop = (e: any) => {
    setCroppedImageDataUrlList((pre) => {
      const temp = [...pre];
      temp.splice(parseInt(e.target.dataset.idx), 1);
      return temp;
    });
  };

  const handleRotateImage = async () => {
    const newDataUrl = await rotateDataUrlOfImage(
      cropTargetImageRef.current?.getAttribute('src') as string
    );
    cropTargetImageRef.current?.setAttribute('src', newDataUrl);
  };

  return (
    <section className="w-full flex flex-col items-center">
      <ImageInputZone setUploadedImage={setUploadedImage} />
      <CropZone
        cropTargetImageRef={cropTargetImageRef}
        uploadedImage={uploadedImage}
        setCompletedCrop={setCompletedCrop}
      />

      <div className="overflow-scroll w-screen">
        <div
          className="flex flex-row justify-center gap-4 w-full mb-6 "
          onClick={handleDeleteCrop}
        >
          {croppedImageDataUrlList.map((imgUrl, idx) => (
            <div
              key={'cropImage' + idx}
              className="group w-40 h-40 relative border-2 border-gray-700 flex-shrink-0"
            >
              <button
                data-idx={idx}
                className="hidden z-10 group-hover:block absolute text-2xl m-auto inset-0 w-full  cursor-pointer "
              >
                삭제
              </button>
              <div className="absolute m-auto w-full h-full bg-gray-700  bg-opacity-0 group-hover:bg-opacity-50"></div>
              <img
                src={imgUrl}
                className="w-40 h-40 "
                alt={`크롭된 이미지 ${idx}`}
              />
            </div>
          ))}
        </div>
      </div>
      {!false && (
        <div className="flex justify-center gap-4 ">
          <button
            onClick={handleConfirmCrop}
            className="bg-mint text-white p-2"
          >
            자르기
          </button>
          <button className="bg-mint text-white p-2">자르기 리셋</button>
          <button
            onClick={handleSendToServer}
            className="bg-mint text-white p-2"
          >
            단어 리스트 생성
          </button>
          <button
            onClick={handleRotateImage}
            className="bg-mint text-white p-2"
          >
            사진 회전
          </button>
        </div>
      )}
    </section>
  );
};

export default ImageUpload;
