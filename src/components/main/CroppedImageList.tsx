import { FC } from 'react';
import NoContent from '../common/NoContent';

interface props {
  handleDeleteCrop: (e: any) => void;
  croppedImageDataUrlList: string[];
  isLoadingOcr: boolean;
}

const CroppedImageList: FC<props> = ({
  handleDeleteCrop,
  croppedImageDataUrlList,
  isLoadingOcr,
}) => {
  return (
    <div className="overflow-x-scroll  w-full pt-4 ">
      <div
        className="flex flex-row justify-center w-full mb-6 "
        onClick={handleDeleteCrop}
      >
        {croppedImageDataUrlList.length === 0 ? (
          <NoContent text="이미지를 크롭해주세요." tail="h-40" />
        ) : (
          croppedImageDataUrlList.map((imgUrl, idx) => (
            <div
              key={'cropImage' + idx}
              className="group w-40 h-40 relative border-2 border-gray-700 flex-shrink-0 mx-3"
            >
              <span className={isLoadingOcr ? 'ocrLoader' : ''}></span>
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
          ))
        )}
      </div>
    </div>
  );
};

export default CroppedImageList;
