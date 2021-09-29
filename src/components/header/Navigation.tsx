import { nextTick } from 'process';
import {
  FC,
  MouseEventHandler,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from 'react';
import ReactGA from 'react-ga';
import { useModal } from 'react-hooks-use-modal';
import { GiHelp } from 'react-icons/gi';
import { IoSave, IoSettingsSharp } from 'react-icons/io5';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  cropFpsState,
  dbDictListQuery,
  dbDictListQueryUpdate,
  indexedDBState,
  isDarkModeState,
  openDictModeState,
  textState,
} from '../../recoil/atom';
import Save from '../Save';
import DarkModeToggle from './DarkModeToggle';

const OptionModal: FC<{}> = () => {
  const [openDictMode, setOpenDictMode] = useRecoilState(openDictModeState);
  const [cropFps, setCropFps] = useRecoilState(cropFpsState);
  useEffect(() => {
    ReactGA.modalview('셋팅 모달 창');
  }, []);

  const setCropFpsHandler = useCallback(
    (value: number) => {
      localStorage.setItem('fps', value.toString());
      setCropFps(value);
    },
    [setCropFps]
  );

  return (
    <div>
      <h2 className="text-4xl my-6  font-mono font-bold">マカセテ</h2>
      <div className="my-4">
        <label>사전 오픈 방식</label>
        <input
          type="radio"
          checked={openDictMode === 'modal'}
          value="modal"
          id="radioModal"
          onChange={() => setOpenDictMode('modal')}
        />
        <label htmlFor="radioModal">모달창 </label>
        <input
          type="radio"
          checked={openDictMode === 'tab'}
          value="tab"
          id="radioTab"
          onChange={() => setOpenDictMode('tab')}
        />
        <label htmlFor="radioTab">새 탭 </label>
      </div>
      <div className="my-4">
        <label>FPS</label>
        <input
          type="radio"
          checked={cropFps === 30}
          value="30"
          id="radioFps30"
          onChange={() => setCropFpsHandler(30)}
        />
        <label htmlFor="radioFps30">30 </label>
        <input
          type="radio"
          checked={cropFps === 60}
          value="60"
          id="radioFps60"
          onChange={() => setCropFpsHandler(60)}
        />
        <label htmlFor="radioFps60">60</label>
        <input
          type="radio"
          checked={cropFps === 120}
          value="120"
          id="radioFps120"
          onChange={() => setCropFpsHandler(120)}
        />
        <label htmlFor="radioFps120">120</label>
      </div>
    </div>
  );
};
const HelpModal: FC<{}> = () => {
  return (
    <>
      <h2 className="text-4xl my-6  font-mono font-bold">도움말</h2>
      <p>
        도움말 입니다. 이미지에는 일본어 문자이외 (한글 등)이 들어가지 않도록
        크롭해주세요. 이미지 업로드 직후 크롭 버튼을 누르면 전체 이미지로
        크롭됩니다. 크롭만 제대로 된다면 이미지는 회전되어 있어도 상관없습니다.
        heic등의 특수 사진 포맷에서는 에러가 나타날 수 있습니다. 크로미늄
        엔진에서 성능 이점을 누릴 수 있습니다.
      </p>
    </>
  );
};

const SavedList = () => {
  const loadedList = useRecoilValue(dbDictListQuery);
  const dbPromise = useRecoilValue(indexedDBState);
  const setTextState = useSetRecoilState(textState);
  const setDbDictListQueryUpdate = useSetRecoilState(dbDictListQueryUpdate);

  const handler: MouseEventHandler<HTMLDivElement> = async (e) => {
    if (e.target instanceof HTMLButtonElement) {
      const { key, type } = e.target.dataset;
      if (!key || !type) return;
      const db = await dbPromise;
      if (type === 'load') {
        const data = await db.get('store1', key);
        setTextState(data);
        console.log(data, 'db에서 불러옴');
      }
      if (type === 'delete') {
        const data = await db.delete('store1', key);
      }
      setDbDictListQueryUpdate((v) => !v);
    }
  };

  return (
    <>
      <div onClick={handler}>
        {loadedList
          ? loadedList.map((key) => (
              <li key={key as string}>
                {key}{' '}
                <button data-key={key} data-type="load">
                  불러오기
                </button>{' '}
                <button data-key={key} data-type="delete">
                  삭제하기
                </button>
              </li>
            ))
          : '저장된 단어가 없습니다.'}
      </div>
    </>
  );
};

const SaveModal: FC<{}> = () => {
  const [newDictName, setNewDictName] = useState('');
  const nowWordList = useRecoilValue(textState);
  return (
    <>
      <h2 className="text-4xl my-6  font-mono font-bold">불러오기</h2>
      <Suspense fallback={<div>loading</div>}>
        <SavedList />

        <input
          type="text"
          name="dictName"
          className="text-black"
          onChange={(e) => {
            setNewDictName(e.target.value);
          }}
          value={newDictName}
        />
        <Save idbKey={newDictName} value={nowWordList} />
      </Suspense>
    </>
  );
};

const Navigation = () => {
  const [clickedModal, setClickedModal] = useState('help');
  const isDarkMode = useRecoilValue(isDarkModeState);
  const [ModalBox, ModalOpen, ModalClose] = useModal('root', {
    preventScroll: false,
    closeOnOverlayClick: true,
  });

  const handleModalOpen: MouseEventHandler<SVGAElement> = (e) => {
    const name = e.currentTarget.dataset.name as string;
    setClickedModal(name);
    ReactGA.modalview(`{name} 모달창 클릭릭`);
    nextTick(() => {
      ModalOpen();
    });
  };

  return (
    <header className="flex flex-row justify-between px-4 py-2 mb-6  bg-mint w-full h-12 shadow-lg ">
      <div className="flex ">
        <IoSettingsSharp
          data-name="setting"
          className="text-3xl cursor-pointer mr-2"
          onClick={handleModalOpen}
        />
        <GiHelp
          data-name="help"
          className="text-3xl cursor-pointer mr-2"
          onClick={handleModalOpen}
        />
        <IoSave
          data-name="save"
          className="text-3xl cursor-pointer mr-2"
          onClick={handleModalOpen}
        />
        {/*  */}
        <ModalBox>
          <div
            className={`${
              isDarkMode
                ? 'dark bg-gray-800 text-white'
                : 'bg-white  text-black'
            } w-screen max-w-md  md:max-w-lg flex flex-col items-center justify-center p-8 rounded-lg relative`}
          >
            {clickedModal === 'setting' && <OptionModal />}
            {clickedModal === 'save' && <SaveModal />}
            {clickedModal === 'help' && <HelpModal />}
            <span
              aria-details="모달 창 닫기"
              className="absolute top-2 right-4 text-2xl cursor-pointer"
              onClick={ModalClose}
            >
              X
            </span>
          </div>
        </ModalBox>
      </div>
      <div>
        <DarkModeToggle />
      </div>
    </header>
  );
};

export default Navigation;
