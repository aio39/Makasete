import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import Navigation from './components/header/Navigation';
import ImageUpload from './components/ImageUpload';
import WordList from './components/WordList';
import WordListNav from './components/WordListNav';
// import './App.css';
import './index.css';
import {
  isDarkModeState,
  isNowEditingState,
  wordListLength,
} from './recoil/atom';

function App() {
  const isExist = useRecoilValue(wordListLength);
  const isNowEditing = useRecoilValue(isNowEditingState);
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
    <div className={`App ${isDarkMode ? 'dark bg-black' : 'bg-white'} `}>
      <div className="dark:bg-black dark:text-white  w-full   min-h-screen  justify-start  flex flex-col   items-center ">
        <Navigation />
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <main className=" px-4 md:px-8">
          <ImageUpload />
          <React.Suspense fallback={<div>laoding</div>}>
            {isExist && <WordList />}
          </React.Suspense>
        </main>
        <div className="flex-grow "></div>
        {isNowEditing}
        {isExist && <WordListNav />}
        <footer className="bg-gray-400 w-full h-28 "></footer>
      </div>
    </div>
  );
}

export default App;
