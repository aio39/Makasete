import { FC, ReactElement } from 'react';

const EditButton: FC<{
  btnData: [() => void, ReactElement, boolean];
  idx: number;
}> = ({ btnData, idx }) => {
  return (
    <button
      key={'editBtn' + idx}
      onClick={btnData[0]}
      className={`bg-mint text-white py-3 px-5 rounded-sm mx-4  ${
        btnData[2] ? '' : 'bg-opacity-30'
      } `}
      disabled={!btnData[2]}
    >
      {btnData[1]}
    </button>
  );
};

export default EditButton;
