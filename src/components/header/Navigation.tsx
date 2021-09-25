import { FC, useCallback, useEffect } from 'react';
import ReactGA from 'react-ga';
import { useModal } from 'react-hooks-use-modal';
import { GiHelp } from 'react-icons/gi';
import { IoSettingsSharp } from 'react-icons/io5';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  cropFpsState,
  isDarkModeState,
  openDictModeState,
} from '../../recoil/atom';
import DarkModeToggle from './DarkModeToggle';

const OptionModal: FC<{ close: () => void }> = ({ close }) => {
  const [openDictMode, setOpenDictMode] = useRecoilState(openDictModeState);
  const [cropFps, setCropFps] = useRecoilState(cropFpsState);
  const isDarkMode = useRecoilValue(isDarkModeState);
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
    <div
      className={`${
        isDarkMode ? 'dark bg-gray-800 text-white' : 'bg-white  text-black'
      } w-screen max-w-md  md:max-w-lg flex flex-col items-center justify-center p-8 rounded-lg relative`}
    >
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
      <div
        aria-details="모달 창 닫기"
        className="absolute top-2 right-4 text-2xl"
        onClick={close}
      >
        X
      </div>
    </div>
  );
};
const HelpModal: FC<{ close: () => void }> = ({ close }) => {
  const isDarkMode = useRecoilValue(isDarkModeState);
  useEffect(() => {
    ReactGA.modalview('도움말 모달달');
  }, []);

  return (
    <div
      className={`${
        isDarkMode ? 'dark bg-gray-800 text-white' : 'bg-white  text-black'
      } w-screen max-w-md  md:max-w-lg flex flex-col items-center justify-center p-8 rounded-lg relative`}
    >
      <h2 className="text-4xl my-6  font-mono font-bold">도움말</h2>

      <div
        aria-details="모달 창 닫기"
        className="absolute top-2 right-4 text-2xl"
        onClick={close}
      >
        X
      </div>
    </div>
  );
};

const Navigation = () => {
  const [OptionModalBox, optionOpen, optionClose] = useModal('root', {
    preventScroll: false,
    closeOnOverlayClick: true,
  });

  const [HelpModalBox, helpOpen, helpClose] = useModal('root', {
    preventScroll: false,
    closeOnOverlayClick: true,
  });

  return (
    <header className="flex flex-row justify-between px-4 py-2 mb-6  bg-mint w-full h-12 shadow-lg ">
      <div className="flex ">
        <IoSettingsSharp
          className="text-3xl cursor-pointer mr-2"
          onClick={optionOpen}
        />
        <GiHelp className="text-3xl cursor-pointer" onClick={helpOpen} />
        <OptionModalBox>
          <div className="flex items-center justify-center p-12">
            <OptionModal close={optionClose} />
          </div>
        </OptionModalBox>
        <HelpModalBox>
          <div className="flex items-center justify-center p-12">
            <HelpModal close={helpClose} />
          </div>
        </HelpModalBox>
      </div>
      <div>
        <DarkModeToggle />
      </div>
    </header>
  );
};

export default Navigation;
