import axios from 'axios';
import { FC, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { textState } from '../recoil/atom';

const WordList: FC<any> = () => {
  const text = useRecoilValue(textState);
  const [html, setHtml] = useState<string>('');

  const handleShowDict: React.MouseEventHandler<HTMLElement> = async (e) => {
    if (e.target instanceof HTMLButtonElement) {
      const word = e.target.value;

      const resultHtml = await axios
        .get(`${process.env.REACT_APP_OCR_URL}?word=${word} `, {
          headers: {},
          withCredentials: true,
        })
        .catch((e) => {
          alert(e);
        });
      if (resultHtml) {
        console.log(resultHtml.data);
        setHtml(resultHtml.data);
      }
    }
  };

  function createMarkup() {
    return { __html: html };
  }

  return (
    <div className="min-w-full flex flex-wrap">
      {html !== '' && <div dangerouslySetInnerHTML={createMarkup()}></div>}

      {text.map((list, listIdx) => (
        <div
          key={'list' + (listIdx + 1)}
          className="w-full flex-grow mb-6"
          onClick={handleShowDict}
        >
          <h2 className="text-2xl text font-semibold my-2">
            リスト {listIdx + 1}
          </h2>
          {list.map((word, wordIdx) => (
            <li key={`${word[0]}${listIdx}${wordIdx}`} className="flex  py-2  ">
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
              <button value={word[wordIdx]}>V</button>
            </li>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WordList;
