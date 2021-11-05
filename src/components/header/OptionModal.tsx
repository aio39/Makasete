import { FC, useCallback, useEffect } from 'react';
import ReactGA from 'react-ga';
import { useRecoilState } from 'recoil';
import { cropFpsState, openDictModeState } from '../../recoil/settingAtom';

export const OptionModal: FC<{}> = () => {
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
      <h2 className="text-4xl my-6  font-mono font-bold text-center">
        マカセテ
      </h2>
      <div className="my-4">
        <label className="mr-4">사전 오픈 방식</label>
        <input
          type="radio"
          checked={openDictMode === 'modal'}
          value="modal"
          id="radioModal"
          onChange={() => setOpenDictMode('modal')}
          className="mr-4"
        />
        <label htmlFor="radioModal" className="mr-4">
          모달창
        </label>
        <input
          type="radio"
          checked={openDictMode === 'tab'}
          value="tab"
          id="radioTab"
          onChange={() => setOpenDictMode('tab')}
          className="mr-4"
        />
        <label htmlFor="radioTab">새 탭 </label>
      </div>
      <div className="my-4">
        <label className="mr-4">FPS</label>
        <input
          type="radio"
          checked={cropFps === 30}
          value="30"
          id="radioFps30"
          onChange={() => setCropFpsHandler(30)}
          className="mr-4"
        />

        <label htmlFor="radioFps30" className="mr-4">
          30
        </label>
        <input
          type="radio"
          checked={cropFps === 60}
          value="60"
          id="radioFps60"
          onChange={() => setCropFpsHandler(60)}
          className="mr-4"
        />
        <label htmlFor="radioFps60" className="mr-4">
          60
        </label>
        <input
          type="radio"
          checked={cropFps === 120}
          value="120"
          id="radioFps120"
          onChange={() => setCropFpsHandler(120)}
          className="mr-4"
        />
        <label htmlFor="radioFps120">120</label>
      </div>
    </div>
  );
};
