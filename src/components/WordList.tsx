import { FC } from 'react';
import { useRecoilState } from 'recoil';
import { textState } from '../recoil/atom';

const WordList: FC<any> = () => {
  const [text, setText] = useRecoilState(textState);
  return (
    <div>
      {text.map((list, idxA) =>
        list.map((word, idxB) => (
          <li
            key={`${word[0]}${idxA}${idxB}`}
            className="flex justify-between border-b-2 border-gray-100 py-2 "
          >
            <span className="overflow-hidden ">{word[0]}</span>
            <span className="overflow-hidden">{word[1]}</span>
            <span className="overflow-hidden">{word[2]}</span>
            <div>V</div>
          </li>
        ))
      )}
    </div>
  );
};

export default WordList;
