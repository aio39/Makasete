import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { IoCloudUploadOutline } from 'react-icons/io5';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { textState } from '../recoil/atom';

const ImageUpload = () => {
  const [crop, setCrop] = useState({ unit: '%' });
  const [completedCrop, setCompletedCrop] = useState<HTMLImageElement | null>(
    null
  );
  const [uploadedImage, setUploadedImage] = useState<Object | null>(null);
  const cropTargetImageRef = useRef<HTMLImageElement>();
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const latestCropDataUrl = useRef<string>();

  // const uploadedImageRef = useRef<HTMLCanvasElement>(null);

  const [cropImageList, setCropImageList] = useState<string[]>([]);

  const [divideCount, setDivideCount] = useState('1');
  const setTextSate = useSetRecoilState(textState);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(e);
  };
  const [text, setText] = useRecoilState(textState);

  const onLoad = useCallback((img) => {
    cropTargetImageRef.current = img;
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        const imageUrl = reader.result;
        // if (!uploadedImageRef.current) return;
        // const canvas = uploadedImageRef.current;
        // console.log(canvas);
        // const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        // const pixelRatio = window.devicePixelRatio;

        // ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        // ctx.imageSmoothingQuality = 'high';

        let img = new window.Image();

        // NOTE  반드시 image가 로드가 완료되고 나서 캔버스에 그려줘야한다.
        // img.onload = () => {
        //   console.log(img);

        //   ctx.drawImage(img, 0, 0, 500, 500);
        // };
        // img.src = imageUrl as string;
        // setCropImageList((pre) => [...pre, imageUrl as string]);
        setUploadedImage(imageUrl);

        // console.log(binaryStr);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setUploadedImage(e.target.files[0]);
      const params = new FormData();
      params.append('image', e.target.files[0]);
      params.append('divide', divideCount);
      try {
        // return;
        const result = await axios.post<string[][][]>(
          process.env.REACT_APP_OCR_URL as string,
          params,
          {
            headers: {
              'content-type': 'multipart/form-data',
            },
            withCredentials: true,
          }
        );
        console.log(result);
        setTextSate(result.data);
      } catch (error) {
        console.log(error);
        alert(error);
      }
    }

    console.log(e);
    console.log(uploadedImage);
  };

  useEffect(() => {
    if (
      !completedCrop ||
      !previewCanvasRef.current ||
      !cropTargetImageRef.current
    ) {
      return;
    }

    const image = cropTargetImageRef.current;
    // const canvas = previewCanvasRef.current;
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

    latestCropDataUrl.current = canvas.toDataURL('image/png');
  }, [completedCrop]);

  const handleDivideRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDivideCount(e.target.value);
  };

  const handleCrop = () => {
    setCropImageList((pre) => [...pre, latestCropDataUrl.current as string]);
  };

  const handleResetCrop = () => {
    setCrop({ unit: '%' });
  };

  const handleDeleteCrop = (e: any) => {
    console.log(e.target.dataset.idx);
    setCropImageList((pre) => {
      const temp = [...pre];
      temp.splice(parseInt(e.target.dataset.idx), 1);
      return temp;
    });
  };

  return (
    <section className="w-full flex flex-col items-center">
      <div
        className=" h-40 w-full flex flex-col justify-center items-center max-w-screen-md mb-6  border-2 px-4 py-2  border-mint border-dashed  hover:bg-mint hover:text-white cursor-pointer "
        {...getRootProps({})}
      >
        <input
          {...getInputProps({
            id: 'wordImg',
            type: 'file',
            accept: 'image/*',
            alt: '분석할 단어 사진',
            onChange: handleUpload,
          })}
        />
        <div className="h-6"></div>
        <IoCloudUploadOutline className="text-6xl mb-4 " />
        <div className="h-6">
          <p>드랍 또는 클릭으로 사진 업로드</p>
        </div>
      </div>
      <div>
        <ReactCrop
          src={uploadedImage as string} // 크롭할 이미지 데이터
          onImageLoaded={onLoad}
          crop={crop as any}
          onChange={(c) => setCrop(c as any)}
          onComplete={(c) => setCompletedCrop(c as any)}
        />
      </div>
      <div
        className="flex flex-row gap-4 w-full overflow-scroll mb-6"
        onClick={handleDeleteCrop}
      >
        {cropImageList.map((imgUrl, idx) => (
          <div
            key={'cropImage' + idx}
            className="group relative border-2 border-gray-700"
          >
            <button
              data-idx={idx}
              className="hidden z-10 group-hover:block absolute text-2xl m-auto inset-0 w-full  cursor-pointer "
            >
              삭제
            </button>
            <div className="absolute m-auto w-full h-full bg-gray-700  bg-opacity-0 group-hover:bg-opacity-50"></div>
            <img src={imgUrl} className="w-40 h-40 " />
          </div>
        ))}
      </div>
      {true && (
        <>
          <button onClick={handleCrop} className="bg-mint text-white p-2">
            자르기
          </button>
          <button onClick={handleResetCrop} className="bg-mint text-white p-2">
            자르기 리셋
          </button>
        </>
      )}
      <canvas
        ref={previewCanvasRef}
        // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
      />
      <div onChange={handleDivideRadio}>
        <input
          type="radio"
          name="divide"
          id="divide no"
          value="1"
          defaultChecked
        />
        <label htmlFor="divideOne">원본</label>
        <input type="radio" name="divide" id="divide no" value="2" />
        <label htmlFor="divideTwo">반으로 나누기</label>
      </div>
    </section>
  );
};

export default ImageUpload;
