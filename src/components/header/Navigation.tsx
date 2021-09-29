import { nextTick } from 'process';
import { MouseEventHandler, useState } from 'react';
import ReactGA from 'react-ga';
import { useModal } from 'react-hooks-use-modal';
import { GiHelp } from 'react-icons/gi';
import { IoSave, IoSettingsSharp } from 'react-icons/io5';
import { useRecoilValue } from 'recoil';
import { isDarkModeState } from '../../recoil/settingAtom';
import DarkModeToggle from './DarkModeToggle';
import { HelpModal } from './HelpModal';
import { OptionModal } from './OptionModal';
import { SaveModal } from './SaveModal';



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
