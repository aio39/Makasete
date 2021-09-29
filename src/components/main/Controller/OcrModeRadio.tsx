import { FC } from 'react';

const OcrModeRadio: FC<{
  setOcrMode: (x: string) => void;
  ocrMode: string;
}> = ({ setOcrMode, ocrMode }) => {
  const handleOCRMode: React.FormEventHandler<HTMLElement> = (e) => {
    if (e.target instanceof HTMLInputElement) {
      setOcrMode(e.target.value);
    }
  };

  return (
    <div onChange={handleOCRMode} className="flex w-full justify-around mb-2">
      <label htmlFor="단어모드" className=" flex justify-center items-center">
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
      <label htmlFor="문장모드" className=" flex justify-center items-center ">
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
  );
};

export default OcrModeRadio;
