import { atom } from 'recoil';

export const openDictModeState = atom({
  key: 'openDictMode',
  default: 'modal', // 'tab'
});

export const isDarkModeState = atom({
  key: 'isDarkMode',
  default: false,
});

export const cropFpsState = atom({
  key: 'cropFps',
  default: parseInt(localStorage.getItem('fps') as string) || 60,
});
