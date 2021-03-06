import { FC, memo, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { IoCamera, IoCloudUploadOutline } from 'react-icons/io5';

interface IImageInputZone {
  setUploadedImage: React.Dispatch<React.SetStateAction<Object | null>>;
  setWorkerImage: (imageUrl: any) => void;
}

const ImageInputZone: FC<IImageInputZone> = ({
  setUploadedImage,
  setWorkerImage,
}) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file: File) => {
        const reader = new FileReader();
        reader.onabort = () => console.info('file reading was aborted');
        reader.onerror = () => console.info('file reading has failed');
        reader.onload = () => {
          const imageUrl = reader.result;
          setWorkerImage(imageUrl);
          setUploadedImage(imageUrl);
        };
        reader.readAsDataURL(file);
      });
    },
    [setWorkerImage, setUploadedImage]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });
  const { getRootProps: getRootProps2, getInputProps: getInputProps2 } =
    useDropzone({
      onDrop,
    });

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
