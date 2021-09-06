import { FC } from 'react';
import { useRecoilState } from 'recoil';
import { textState } from '../recoil/atom';

const WordList: FC<any> = () => {
  const [text, setText] = useRecoilState(textState);
  return (
    <div className="min-w-full">
      {text.map((list, idxA) => (
        <div id={'list' + (idxA + 1)}>
          <div>
            <h2>단어 리스트 {idxA + 1}</h2>
          </div>
          {list.map((word, idxB) => (
            <li
              key={`${word[0]}${idxA}${idxB}`}
              className="flex  border-b-2 border-gray-100 py-2 "
            >
              {Array(3)
                .fill('')
                .map((_, idx) => (
                  <div className="flex-grow w-1/4" key={word[idx]}>
                    <span className=" ">{word[idx]}</span>
                  </div>
                ))}

              {/* <span className="overflow-hidden">{word[1]}</span> */}
              {/* <span className="overflow-hidden">{word[2]}</span> */}
              <div>V</div>
            </li>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WordList;
