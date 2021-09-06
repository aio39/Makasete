import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import Navigation from './components/header/Navigation';
import ImageUpload from './components/ImageUpload';
import WordList from './components/WordList';
import WordListNav from './components/WordListNav';
// import './App.css';
import './index.css';
import { isDarkModeState, wordListLength } from './recoil/atom';

function App() {
  const isExist = useRecoilValue(wordListLength);
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
    <div className={`App   ${isDarkMode ? 'dark bg-black' : 'bg-white'} `}>
      <div className="dark:bg-black dark:text-white h-full w-full  flex flex-col justify-center items-center  px-4 md:px-8">
        <Navigation />
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <ImageUpload />
        {isExist && <WordList />}
        {/* <Crop /> */}
      </div>
      <WordListNav />
      <footer className="bg-gray-400 h-28"></footer>
    </div>
  );
}

export default App;
