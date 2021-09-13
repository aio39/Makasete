import axios from 'axios';
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactGA from 'react-ga';
import { AiOutlineRotateRight } from 'react-icons/ai';
import { BiReset } from 'react-icons/bi';
import { IoCut } from 'react-icons/io5';
import { Crop } from 'react-image-crop';
import { useSetRecoilState } from 'recoil';
import imageToJpegDataUrlWorker from '../pwa/ImageToJpegDataUrl';
import { cropState, isLoadingOcrState, textState } from '../recoil/atom';
import { dataURItoBlob } from '../util/dataURItoBlob';
import rotateDataUrlOfImage from '../util/rotateImage';
import CropZone from './uploadPart/CropZone';
import ImageInputZone from './uploadPart/ImageInputZone';

const ImageUpload = () => {
  const worker = useMemo(() => {
    if (!window.OffscreenCanvas) return null;
    const worker = new Worker(imageToJpegDataUrlWorker);
    worker.onmessage = (m) => {
      setCroppedImageDataUrlList((pre) => [...pre, m.data]);
    };
    return worker;
  }, []);
  const cropTargetImageRef = useRef<HTMLImageElement>();
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [uploadedImage, setUploadedImage] = useState<Object | null>(null);
  const [croppedImageDataUrlList, setCroppedImageDataUrlList] = useState<
    string[]
  >([]);
  const [ocrMode, setOcrMode] = useState('0');

  const setIsLoadingOcr = useSetRecoilState(isLoadingOcrState);
  const setTextState = useSetRecoilState(textState);
  const setCrop = useSetRecoilState(cropState);

  useEffect(() => {
    return () => {
      worker?.terminate();
    };
  }, [worker]);

  const setWorkerImage = useCallback(
    (imageUrl) => {
      worker?.postMessage({ imageUrl });
    },
    [worker]
  );

  const handleSendToServer = useCallback(async () => {
    if (croppedImageDataUrlList.length === 0) {
      alert('크롭된 이미지가 없습니다.');
      return;
    }
    setIsLoadingOcr(true);
    const result = await Promise.all(
      croppedImageDataUrlList.map(async (dataOrObjectUrl) => {
        const params = new FormData();
        if (window.OffscreenCanvas) {
          console.time('fetch');
          const blob = await fetch(dataOrObjectUrl).then((r) => r.blob());
          console.timeEnd('fetch');
          params.append('image', blob);
        } else {
          params.append('image', dataURItoBlob(dataOrObjectUrl));
        }
        params.append('mode', ocrMode);

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
          ReactGA.event({
            category: 'OCR',
            action: `Failed`,
          });
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
    ReactGA.event({
      category: 'OCR',
      action: `Success`,
    });
    setCroppedImageDataUrlList(() => []);
    setTextState((pre) => [...pre, ...(result as string[][][])]);
  }, [
    setIsLoadingOcr,
    croppedImageDataUrlList,
    setTextState,
    setCroppedImageDataUrlList,
    ocrMode,
  ]);

  const handleConfirmCrop = useCallback(() => {
    if (!cropTargetImageRef.current) return;

    const image = cropTargetImageRef.current;
    const crop: Crop =
      completedCrop && completedCrop.width !== 0 // 이미지 업로드시 0 0으로 설정됨
        ? completedCrop
        : {
            unit: 'px',
            x: 0,
            y: 0,
            width: image.width,
            height: image.height,
          };

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    // 하나의 CSS 픽셀을 그릴 때 사용해야 하는 장치 픽셀의 수
    //  레티나 디스플레이에서 추가 픽셀 밀접도로 해상도를 올릴 수 있다.
    const pixelRatio = window.devicePixelRatio;

    if (window.OffscreenCanvas) {
      const drawData = {
        crop,
        scaleX,
        scaleY,
        pixelRatio,
      };
      worker?.postMessage({ drawData });
    } else {
      const canvas = document.createElement('canvas') as any;
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
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
    }
  }, [completedCrop, worker]);

  const handleDeleteCrop = (e: any) => {
    setCroppedImageDataUrlList((pre) => {
      const temp = [...pre];
      const [deletedObjectUrl] = temp.splice(parseInt(e.target.dataset.idx), 1);
      URL.revokeObjectURL(deletedObjectUrl);
      return temp;
    });
  };

  const handleRotateImage = async () => {
    const newDataUrl = await rotateDataUrlOfImage(
      cropTargetImageRef.current?.getAttribute('src') as string
    );
    cropTargetImageRef.current?.setAttribute('src', newDataUrl);
    worker?.postMessage({ imageUrl: newDataUrl });
  };

  const handleResetCrop = () => {
    setCrop(null);
    setCompletedCrop(null);
  };

  const handleOCRMode: React.FormEventHandler<HTMLElement> = (e) => {
    if (e.target instanceof HTMLInputElement) {
      setOcrMode(e.target.value);
    }
  };

  return (
    <section className="w-full flex flex-col items-center">
      <ImageInputZone
        setUploadedImage={setUploadedImage}
        setWorkerImage={setWorkerImage}
      />
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
        <div className="flex flex-col items-center">
          <div className="text-2xl w-full max-w-screen-md flex  justify-between mb-4">
            {(
              [
                [handleConfirmCrop, <IoCut />],
                [handleResetCrop, <BiReset />],
                [handleRotateImage, <AiOutlineRotateRight />],
              ] as [() => void, ReactElement][]
            ).map((btnData, idx) => {
              return (
                <button
                  key={'editBtn' + idx}
                  onClick={btnData[0]}
                  className="bg-mint text-white py-3 px-5 rounded-sm mx-4 "
                >
                  {btnData[1]}
                </button>
              );
            })}
          </div>
          <div
            onChange={handleOCRMode}
            className="flex w-full justify-around mb-2"
          >
            <label
              htmlFor="단어모드"
              className=" flex justify-center items-center"
            >
              <input
                id="단어모드"
                type="radio"
                value="0"
                name="단어모드"
                checked={ocrMode === '0'}
                className="mr-2 text-mint"
              />
              단어 리스트
            </label>
            <label
              htmlFor="문장모드"
              className=" flex justify-center items-center "
            >
              <input
                id="문장모드"
                type="radio"
                value="1"
                name="문장모드"
                checked={ocrMode === '1'}
                className="mr-2 text-mint "
              />
              문장
            </label>
          </div>
          <div>
            <button
              onClick={handleSendToServer}
              // disabled={croppedImageDataUrlList.length === 0}
              className="bg-mint text-white py-2 px-4 rounded-sm my-4"
            >
              단어 리스트 생성
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ImageUpload;
