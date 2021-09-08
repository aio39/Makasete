import { FC } from 'react';
import { useRecoilState } from 'recoil';
import { textState } from '../recoil/atom';

const WordList: FC<any> = () => {
  const [text, setText] = useRecoilState(textState);
  return (
    <div className="min-w-full flex flex-wrap">
      {text.map((list, idxA) => (
        <div id={'list' + (idxA + 1)} className="w-full flex-grow mb-6">
          <h2 className="text-2xl text font-semibold my-2">
            リスト {idxA + 1}
          </h2>
          {list.map((word, idxB) => (
            <li key={`${word[0]}${idxA}${idxB}`} className="flex  py-2  ">
              {Array(3)
                .fill('')
                .map((_, idx) => (
                  <div
                    className="flex-grow w-1/4 border-b-2 border-gray-100 mr-4 pb-2 pt-1"
                    key={word[idx]}
                  >
                    <span className=" ">{word[idx]}</span>
                  </div>
                ))}
              <div>V</div>
            </li>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WordList;
