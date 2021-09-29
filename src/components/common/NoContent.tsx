import { FC } from 'react';

interface NoContentProp {
  text?: string;
  tail?: string;
}

const NoContent: FC<NoContentProp> = ({ text = 'No', tail = '' }) => {
  return (
    <div
      className={
        'w-full flex justify-center items-center p-16 text-2xl mb-6' + tail
      }
    >
      <div>{text}</div>
    </div>
  );
};

export default NoContent;
