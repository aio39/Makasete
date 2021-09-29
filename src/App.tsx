import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRecoilState, useRecoilValue } from 'recoil';
import Footer from './components/footer/footer';
import Navigation from './components/header/Navigation';
import ImageUpload from './components/ImageUpload';
import Loading from './components/main/Loading';
import WordList from './components/main/wordListPart/WordList';
import WordListNav from './components/main/wordListPart/WordListNav';
// import './App.css';
import './index.css';
import { isDarkModeState } from './recoil/settingAtom';
import { isLoadingOcrState, isNowEditingState } from './recoil/stateAtom';
import { currWordListLengthQuery } from './recoil/wordListAtom';

function App() {
  const isExist = useRecoilValue(currWordListLengthQuery);
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
        isDarkMode ? 'dark bg-gray-800' : 'bg-white'
      } max-w-screen  `}
    >
      <div className="dark:bg-gray-800 dark:text-white  w-full min-h-screen  justify-start  flex flex-col   items-center ">
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
      <ToastContainer />
    </div>
  );
}

export default App;
