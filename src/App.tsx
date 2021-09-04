import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import ImageUpload from './components/ImageUpload';
import WordList from './components/WordList';
// import './App.css';
import './index.css';
import { isDarkModeState, isWordListExist } from './recoil/atom';

function App() {
  const isExist = useRecoilValue(isWordListExist);
  const [isDarkMode, setIsDarkMode] = useRecoilState(isDarkModeState);

  useEffect(() => {
    if (!window.localStorage) return;
    const browserPrefersColorScheme = window.matchMedia(
      '(prefers-color-scheme: dark)'
    )?.matches as boolean;
    const setLocalDarkSetting = window.localStorage.getItem('isDarkMode');

    // 로컬스토리지 설정을 우선시하고 없을 경우 브라우저 설정
    if (setLocalDarkSetting !== null) {
      setIsDarkMode(setLocalDarkSetting === 'true');
    } else {
      setIsDarkMode(browserPrefersColorScheme);
    }
  }, []);

  return (
    <div
      className={`App h-full w-full flex flex-col justify-center items-center box-border  ${
        isDarkMode ? 'dark bg-black' : 'bg-white'
      } `}
    >
      <header className="App-header">
        <div className="dark:bg-black dark:text-white ">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}

          <ImageUpload />
          {isExist && <WordList />}
        </div>
      </header>
    </div>
  );
}

export default App;
