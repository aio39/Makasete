import { FC, memo, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { IoCamera, IoCloudUploadOutline } from 'react-icons/io5';

interface IImageInputZone {
  setUploadedImage: React.Dispatch<React.SetStateAction<Object | null>>;
}

const ImageInputZone: FC<IImageInputZone> = ({ setUploadedImage }) => {
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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });
  const { getRootProps: getRootProps2, getInputProps: getInputProps2 } =
    useDropzone({
      onDrop,
    });

  //   const testHandler = (e: any) => {
  //     console.log(e);
  //     console.log(e.target);
  //   };

  return (
    <div className="h-40 w-full  max-w-screen-md mb-6 relative  border-2 px-4 py-2  border-mint border-dashed  hover:bg-mint hover:text-white cursor-pointer">
      <div
        className="flex flex-col justify-center items-center"
        {...getRootProps({})}
      >
        <input
          {...getInputProps({
            id: 'wordImg',
            type: 'file',
            accept: 'image/*',
            alt: '분석할 단어 사진',
            //   onChange: testHandler,
          })}
        />

        <div className="h-6"></div>
        <IoCloudUploadOutline className="text-6xl mb-4 " />
        <div className="h-6">
          <p>드랍 또는 클릭으로 사진 업로드</p>
        </div>
      </div>
      <div
        {...getRootProps2({})}
        className=" absolute right-4 top-4 border-2 p-2 z-10 "
      >
        <input
          {...getInputProps2({
            id: 'wordImg',
            type: 'file',
            accept: 'image/*',
            alt: '분석할 단어 사진',
            capture: 'camera',
            //   onChange: testHandler,
          })}
        />
        <IoCamera className="text-4xl" />
      </div>
    </div>
  );
};

export default memo(ImageInputZone);
