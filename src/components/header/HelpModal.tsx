import { FC } from 'react';

export const HelpModal: FC<{}> = () => {
  return (
    <>
      <h2 className="text-4xl my-6  font-mono font-bold">도움말</h2>
      <div>
        <p>도움말 입니다.</p>
        <p>
          이미지에는 일본어 문자이외 (한글 등)이 들어가지 않도록 크롭해주세요.
        </p>
        <p>이미지 업로드 직후 크롭 버튼을 누르면 전체 이미지로 크롭됩니다.</p>
        <p>크롭만 제대로 된다면 이미지는 회전되어 있어도 상관없습니다 </p>
        <p>HEIC등의 특수 사진 포맷에서는 에러가 나타날 수 있습니다. </p>
        <p>크로미늄 엔진에서 성능 이점을 누릴 수 있습니다.</p>
      </div>
    </>
  );
};
