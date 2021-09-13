import { FC, useState } from 'react';
import { useModal } from 'react-hooks-use-modal';
import Iframe from 'react-iframe';
import { useRecoilValue } from 'recoil';
import { textState } from '../recoil/atom';
// const handleShowDict: React.MouseEventHandler<HTMLElement> = async (e) => {
//   if (e.target instanceof HTMLButtonElement) {
//     const word = e.target.value;

//     const resultHtml = await axios
//       .get(`${process.env.REACT_APP_DICT_URL}?word=${word} `, {
//         headers: {},
//         withCredentials: true,
//       })
//       .catch((e) => {
//         alert(e);
//       });
//     if (resultHtml) {
//       console.log(resultHtml.data);
//       setHtml(resultHtml.data);
//     }
//   }
// };
const WordList: FC<any> = () => {
  const wordListsData = useRecoilValue(textState);
  const [selectedWord, setSelectedWord] = useState<string>();
  const [Modal, open, close, isOpen] = useModal('root', {
    preventScroll: false,
    closeOnOverlayClick: true,
  });

  const handleShowDict: React.MouseEventHandler<HTMLElement> = async (e) => {
    if (e.target instanceof HTMLButtonElement) {
      setSelectedWord(e.target.value);
      open();
    }
  };

  return (
    <div className="min-w-full flex flex-wrap">
      {wordListsData.map((list, listIdx) => (
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
              <button value={word[wordIdx]}>📗</button>
            </li>
          ))}
        </div>
      ))}
      <Modal>
        <div
          className="h-screen w-screen flex items-center p-12"
          onClick={close}
        >
          <Iframe
            url={`https://ja.dict.naver.com/#/search?range=word&query=${selectedWord}`}
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
