import { FC, useState } from 'react';
import { useModal } from 'react-hooks-use-modal';
import Iframe from 'react-iframe';
import { useRecoilState, useRecoilValue } from 'recoil';
import { openDictModeState, textState } from '../recoil/atom';
import removeOneItemFromArray from '../util/removeOneItemFromArray';

const DICT_URL = 'https://ja.dict.naver.com/#/search?range=word&query=';

const WordList: FC<any> = () => {
  const [wordListsData, setWordListsData] = useRecoilState(textState);
  const openDictMode = useRecoilValue(openDictModeState);
  const [selectedWord, setSelectedWord] = useState<string>();
  const [Modal, open, close] = useModal('root', {
    preventScroll: false,
    closeOnOverlayClick: true,
  }); // , isOpen

  const handleShowDict: React.MouseEventHandler<HTMLElement> = async (e) => {
    if (e.target instanceof HTMLButtonElement) {
      if (e.target.dataset.list) {
        const idx = +e.target.dataset.list;
        setWordListsData((pre) => [...removeOneItemFromArray(pre, idx)]);
      }
      if (e.target.dataset.dict_word) {
        const word = e.target.dataset.dict_word;
        if (openDictMode === 'modal') {
          setSelectedWord(word);
          open();
        }
        if (openDictMode === 'tab') {
          window.open(`${DICT_URL}${word}`, '_blank')?.focus();
        }
      }
    }
  };

  return (
    <div className="min-w-full flex flex-wrap justify-center">
      {wordListsData.map((list, listIdx) => (
        <div
          key={'list' + (listIdx + 1)}
          id={'list' + (listIdx + 1)}
          className="flex-auto mb-6 max-w-screen-sm w-96 mx-2 "
          onClick={handleShowDict}
        >
          <div>
            <div className="flex justify-between">
              <h2 className="text-2xl text font-semibold my-2">
                リスト {listIdx + 1}
              </h2>
              <button data-list={listIdx}>❌</button>
            </div>
          </div>
          <div className=" ">
            {list.map((word, wordIdx) => (
              <li
                key={`${word[0]}${listIdx}${wordIdx}`}
                className="flex  py-2  "
              >
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
                <button data-dict_word={word[0]}>📗</button>
              </li>
            ))}
          </div>
        </div>
      ))}
      <Modal>
        <div
          className="h-screen w-screen flex items-center p-12"
          onClick={close}
        >
          <Iframe
            url={`${DICT_URL}${selectedWord}`}
            width="100%"
            height="100%"
            id="myId"
            className=" "
            display="block"
            position="relative"
          />
        </div>
      </Modal>
    </div>
  );
};

export default WordList;
