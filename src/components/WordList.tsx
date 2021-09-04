import { FC } from 'react';
import { useRecoilState } from 'recoil';
import { textState } from '../recoil/atom';

const WordList: FC<any> = () => {
  const [text, setText] = useRecoilState(textState);
  return (
    <div>
      {text.map((word) => (
        <li
          key={word}
          className="flex justify-between border-b-2 border-gray-100 py-2 "
        >
          <span className="overflow-hidden ">{word}</span>
          <span className="overflow-hidden">{word}</span>
          <div>V</div>
        </li>
      ))}
    </div>
  );
};

export default WordList;
