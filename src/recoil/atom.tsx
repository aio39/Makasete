import { atom, selector } from 'recoil';

export const isDarkModeState = atom({
  key: 'isDarkMode',
  default: false,
});

// export const isDarkMode = selector({
//   key: 'charCountState', // unique ID (with respect to other atoms/selectors)
//   get: ({ get }) => {
//     const wordList = get(textState);

//     return wordList.length;
//   },
// });

export const textState = atom({
  key: 'textState', // unique ID (with respect to other atoms/selectors)
  default: [
    'しゅうせいあん',
    'しゅくしょう',
    'けいこう',
    'そうりつ',
    'てんしょく',
    'ぎかい',
    'しょうにん',
    'さいよう',
    'ちく',
    'よせん',
    'しゅつじょう',
    'ちんたいりょう',
    'こうとう てんぽ',
    'かいりょう',
    'ほどこす',
    'しったい',
    'えんじる',
    'かんとく',
    'きよう',
    'いっこだて ぜいたく きき',
    'てんじ',
  ], // default value (aka initial value)
});

export const isWordListExist = selector({
  key: 'charCountState', // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const wordList = get(textState);

    return wordList.length;
  },
});
