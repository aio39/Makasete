import { useEffect } from 'react';
import ReactGA from 'react-ga';
import { useModal } from 'react-hooks-use-modal';
import { IoSettingsSharp } from 'react-icons/io5';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isDarkModeState, openDictModeState } from '../../recoil/atom';
import DarkModeToggle from './DarkModeToggle';

const OptionModal = () => {
  const [openDictMode, setOpenDictMode] = useRecoilState(openDictModeState);
  const isDarkMode = useRecoilValue(isDarkModeState);
  useEffect(() => {
    ReactGA.modalview('셋팅 모달달');
  }, []);
  return (
    <div
      className={`${
        isDarkMode ? 'dark bg-gray-800 text-white' : 'bg-white  text-black'
      } w-screen max-w-md  md:max-w-lg flex flex-col items-center justify-center p-8 rounded-lg`}
    >
      <h2 className="text-4xl my-6  font-mono font-bold">
        マカセテ
        {/* <span className="sp">マ</span>
        <span className="sp">カ</span>
        <span className="sp">セ</span>
        <span className="sp">テ</span> */}
      </h2>
      <div>
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
    </div>
  );
};

const Navigation = () => {
  const [Modal, open, close, isOpen] = useModal('root', {
    preventScroll: false,
    closeOnOverlayClick: true,
  });

  return (
    <header className="flex flex-row justify-between px-4 py-2 mb-6  bg-mint w-full h-12 shadow-lg ">
      <div>
        <IoSettingsSharp className="text-3xl cursor-pointer" onClick={open} />
        <Modal>
          <div
            className="flex items-center justify-center p-12"
            // onClick={close}
          >
            <OptionModal />
          </div>
        </Modal>
      </div>
      <div>
        <DarkModeToggle />
      </div>
    </header>
  );
};

export default Navigation;
