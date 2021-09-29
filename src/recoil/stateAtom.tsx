import { Crop } from 'react-image-crop';
import { atom } from 'recoil';

export const isLoadingOcrState = atom({
  key: 'isLoadingOcr',
  default: false,
});

export const isNowEditingState = atom({
  key: 'isNowEditing',
  default: false,
});

export const cropState = atom<Crop | null>({
  key: 'crop',
  default: null,
});
