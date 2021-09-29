import { openDB } from 'idb';
import { Crop } from 'react-image-crop';
import { atom, selector } from 'recoil';

export const openDictModeState = atom({
  key: 'openDictMode',
  default: 'modal', // 'tab'
});

export const isDarkModeState = atom({
  key: 'isDarkMode',
  default: false,
});

export const isLoadingOcrState = atom({
  key: 'isLoadingOcr',
  default: false,
});

export const isNowEditingState = atom({
  key: 'isNowEditing',
  default: false,
});

export const cropFpsState = atom({
  key: 'cropFps',
  default: parseInt(localStorage.getItem('fps') as string) || 60,
});

export const textState = atom<string[][][]>({
  key: 'textState', // unique ID (with respect to other atoms/selectors)
  default: [
    [
      ['迷う', 'まよう', '좌절된다'],
      ['言い分', 'いいぶん', '이론'],
      ['確認', 'かくにん', '확인'],
      ['迷う', 'まよう', '좌절된다'],
      ['言い分', 'いいぶん', '이론'],
      ['確認', 'かくにん', '확인'],
    ],
  ],
});

export const wordListLength = selector({
  key: 'isWordListExist', // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const wordList = get(textState);

    return wordList.length;
  },
});

export const cropState = atom<Crop | null>({
  key: 'crop',
  default: null,
});

export const indexedDBState = atom({
  key: 'indexedDB',
  default: openDB('db1', 1, {
    upgrade(db) {
      db.createObjectStore('store1', {
        keyPath: 'id',
      });
    },
  }),
});

export const dbDictListQueryUpdate = atom({
  key: 'dbDictListQueryUpdate',
  default: true,
});

export const dbDictListQuery = selector({
  key: 'dbDictList',
  get: async ({ get }) => {
    console.log('re update');
    get(dbDictListQueryUpdate);
    const list = await (await get(indexedDBState))
      .getAllKeys('store1')
      .catch((err) => {
        console.error(err);
        return [];
      });
    console.log(list);
    if (list.length === 0) return false as false;
    return list;
  },
  dangerouslyAllowMutability: true,
  cachePolicy_UNSTABLE: {
    eviction: 'most-recent',
  },
  // set: ({ get }, newValue) => {
  //   console.log(newValue);
  // },
});

// export const saveWordQuery = selector({
//   key: 'dbDictList',

// });
