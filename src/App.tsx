import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import Footer from './components/footer/footer';
import Navigation from './components/header/Navigation';
import ImageUpload from './components/ImageUpload';
import Loading from './components/Loading';
import WordList from './components/WordList';
import WordListNav from './components/WordListNav';
// import './App.css';
import './index.css';
import {
  isDarkModeState,
  isLoadingOcrState,
  isNowEditingState,
  wordListLength,
} from './recoil/atom';

function App() {
  const isExist = useRecoilValue(wordListLength);
  const isNowEditing = useRecoilValue(isNowEditingState);
  const isLoadingOcr = useRecoilValue(isLoadingOcrState);
  const [isDarkMode, setIsDarkMode] = useRecoilState(isDarkModeState);

  useEffect(() => {
    if (!window.localStorage) return;
    const setLocalDarkSetting = window.localStorage.getItem('isDarkMode');
    // 로컬스토리지 설정을 우선시하고 없을 경우 브라우저 설정
    if (setLocalDarkSetting !== null) {
      setIsDarkMode(setLocalDarkSetting === 'true');
    } else {
      const browserPrefersColorScheme = window.matchMedia(
        '(prefers-color-scheme: dark)'
      )?.matches as boolean;
      setIsDarkMode(browserPrefersColorScheme);
    }
  }, [isDarkMode, setIsDarkMode]);

  return (
    <div
      className={`App  box-border ${
        isDarkMode ? 'dark bg-black' : 'bg-white'
      } max-w-screen  `}
    >
      <div className="dark:bg-black dark:text-white  w-full min-h-screen  justify-start  flex flex-col   items-center ">
        <Navigation />
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <main className="w-full px-6 md:mx-8 ">
          <ImageUpload />
          <React.Suspense fallback={<div>loading !!!</div>}>
            {isLoadingOcr ? <Loading /> : ''}
            {isExist ? <WordList /> : ''}
          </React.Suspense>
        </main>
        <div className="flex-grow "></div>
        {isNowEditing ? <span>is now editing</span> : ''}
        {isExist ? <WordListNav /> : ''}
        <Footer />
      </div>
    </div>
  );
}

export default App;
