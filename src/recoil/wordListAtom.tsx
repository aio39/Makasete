import { atom, selector } from 'recoil';

export const currWordListState = atom<wordList>({
  key: 'currWordList',
  default: [
    [
      ['迷う', 'まよう', '좌절된다'],
      ['言い分', 'いいぶん', '이론'],
      ['確認', 'かくにん', '확인'],
    ],
  ],
});

export const currWordListLengthQuery = selector({
  key: 'currWordListLength',
  get: ({ get }) => {
    const wordList = get(currWordListState);
    return wordList.length;
  },
});
