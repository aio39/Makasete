import { openDB } from 'idb';
import { atom, selector } from 'recoil';
import { STORE } from '../const';

export const indexedDBState = atom({
  key: 'indexedDB',
  default: openDB('db1', 1, {
    upgrade(db) {
      db.createObjectStore(STORE, {
        keyPath: 'id',
      });
    },
  }),
});

export const dbDictListQueryUpdater = atom({
  key: 'dbDictListQueryUpdater',
  default: true,
});

export const dbDictListQuery = selector({
  key: 'dbDictList',
  get: async ({ get }) => {
    get(dbDictListQueryUpdater);
    const list = await (await get(indexedDBState))
      .getAllKeys(STORE)
      .catch((err) => {
        console.error(err);
        return [];
      });
    if (list.length === 0) return false as false;
    return list;
  },
  dangerouslyAllowMutability: true,
  cachePolicy_UNSTABLE: {
    eviction: 'most-recent',
  },
});
