import { useRecoilState } from 'recoil';
import { isDarkModeState } from '../../recoil/settingAtom';

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useRecoilState(isDarkModeState);

  const handleDarkMode = () => {
    window.localStorage.setItem('isDarkMode', !isDarkMode + '');
    setIsDarkMode((pre) => !pre);
  };

  return (
    <div className="flex items-center justify-center w-full mb-12">
      <label htmlFor="toggleB" className="flex items-center cursor-pointer">
        <div className="relative" onChange={handleDarkMode}>
          <input type="checkbox" id="toggleB" className="sr-only" />
          <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
          <div
            className={`transform bg-white  ${
              isDarkMode && 'translate-x-full bg-yellow-400'
            }  absolute left-1 top-1  w-6 h-6 rounded-full transition`}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default DarkModeToggle;
